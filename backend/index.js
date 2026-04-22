import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import multer from 'multer'
import { HeadObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { fileURLToPath } from 'url'

dotenv.config()

const app = express()
const port = Number.parseInt(process.env.PORT ?? '4000', 10)
const maxUploadSizeMb = Number.parseInt(process.env.MAX_UPLOAD_SIZE_MB ?? '5', 10)
const resumeObjectKey = process.env.RESUME_OBJECT_KEY?.trim() || 'resume/latest.pdf'
const storageEnvKeys = [
  'S3_BUCKET_NAME',
  'S3_REGION',
  'S3_ACCESS_KEY_ID',
  'S3_SECRET_ACCESS_KEY',
  'S3_PUBLIC_URL_BASE',
]

const missingStorageEnv = storageEnvKeys.filter((key) => !process.env[key]?.trim())
const isStorageConfigured = missingStorageEnv.length === 0
const s3Client = isStorageConfigured
  ? new S3Client({
      region: process.env.S3_REGION,
      endpoint: process.env.S3_ENDPOINT?.trim() || undefined,
      forcePathStyle: process.env.S3_FORCE_PATH_STYLE === 'true',
      credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY_ID,
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
      },
    })
  : null

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: maxUploadSizeMb * 1024 * 1024 },
  fileFilter: (_request, file, callback) => {
    if (file.mimetype !== 'application/pdf') {
      callback(new Error('Only PDF files are allowed.'))
      return
    }

    callback(null, true)
  },
})

function getAllowedOrigins() {
  const origins = process.env.CORS_ORIGIN?.split(',').map((value) => value.trim()).filter(Boolean)
  return origins ?? []
}

function getResumeUrl() {
  const baseUrl = process.env.S3_PUBLIC_URL_BASE?.trim()

  if (!baseUrl) {
    return null
  }

  const normalizedBaseUrl = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`
  return new URL(resumeObjectKey, normalizedBaseUrl).toString()
}

function isAuthorized(request) {
  const expectedSecretKey =
    process.env.ADMIN_SECRET_KEY?.trim() || process.env.ADMIN_TOKEN?.trim()

  if (!expectedSecretKey) {
    return false
  }

  const authorizationHeader = request.get('authorization')
  const bearerToken = authorizationHeader?.startsWith('Bearer ')
    ? authorizationHeader.slice(7).trim()
    : ''
  const secretHeader = request.get('x-admin-secret')?.trim() || ''
  const headerToken = request.get('x-admin-token')?.trim() || ''

  return (
    bearerToken === expectedSecretKey ||
    secretHeader === expectedSecretKey ||
    headerToken === expectedSecretKey
  )
}

function requireAdminToken(request, response, next) {
  if (!isAuthorized(request)) {
    response.status(401).json({
      error: 'Unauthorized',
      message: 'Provide a valid secret key to upload a new resume.',
    })
    return
  }

  next()
}

function isMissingObjectError(error) {
  return (
    error?.$metadata?.httpStatusCode === 404 ||
    error?.name === 'NotFound' ||
    error?.Code === 'NotFound' ||
    error?.code === 'NotFound'
  )
}

app.use(
  cors({
    origin(origin, callback) {
      const allowedOrigins = getAllowedOrigins()

      if (!origin || allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
        callback(null, true)
        return
      }

      callback(new Error(`Origin ${origin} is not allowed by CORS.`))
    },
  }),
)

app.use(express.json())

app.get('/api/health', (_request, response) => {
  response.json({ ok: true })
})

app.get('/api/resume/auth-check', requireAdminToken, (_request, response) => {
  response.json({
    authenticated: true,
    message: 'Secret key accepted.',
  })
})

app.get('/api/resume', async (_request, response) => {
  if (!isStorageConfigured || !s3Client) {
    response.json({
      configured: false,
      resumeUrl: null,
      objectKey: resumeObjectKey,
      message: 'S3 storage is not configured yet.',
      missingEnv: missingStorageEnv,
    })
    return
  }

  try {
    const result = await s3Client.send(
      new HeadObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME,
        Key: resumeObjectKey,
      }),
    )

    response.json({
      configured: true,
      resumeUrl: getResumeUrl(),
      objectKey: resumeObjectKey,
      lastModified: result.LastModified?.toISOString() ?? null,
      contentLength: result.ContentLength ?? null,
    })
  } catch (error) {
    if (isMissingObjectError(error)) {
      response.json({
        configured: true,
        resumeUrl: null,
        objectKey: resumeObjectKey,
        lastModified: null,
        contentLength: null,
      })
      return
    }

    console.error('Failed to read resume metadata:', error)
    response.status(502).json({
      error: 'ResumeLookupFailed',
      message: 'Could not read the current resume from storage.',
    })
  }
})

app.post('/api/resume/upload', requireAdminToken, upload.single('resume'), async (request, response) => {
  if (!isStorageConfigured || !s3Client) {
    response.status(500).json({
      error: 'StorageNotConfigured',
      message: 'Set the required S3 environment variables before uploading.',
      missingEnv: missingStorageEnv,
    })
    return
  }

  if (!request.file) {
    response.status(400).json({
      error: 'MissingFile',
      message: 'Attach a PDF file in the `resume` field.',
    })
    return
  }

  try {
    await s3Client.send(
      new PutObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME,
        Key: resumeObjectKey,
        Body: request.file.buffer,
        ContentType: 'application/pdf',
        CacheControl: 'no-store, max-age=0',
      }),
    )

    response.status(201).json({
      message: 'Resume uploaded successfully.',
      resumeUrl: getResumeUrl(),
      objectKey: resumeObjectKey,
      uploadedAt: new Date().toISOString(),
      size: request.file.size,
    })
  } catch (error) {
    console.error('Failed to upload resume:', error)
    response.status(502).json({
      error: 'ResumeUploadFailed',
      message: 'The upload reached the server, but storage rejected it.',
    })
  }
})

app.use((error, _request, response, _next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      response.status(400).json({
        error: 'FileTooLarge',
        message: `Resume PDF must be ${maxUploadSizeMb} MB or smaller.`,
      })
      return
    }
  }

  if (error?.message) {
    response.status(400).json({
      error: 'BadRequest',
      message: error.message,
    })
    return
  }

  console.error('Unexpected server error:', error)
  response.status(500).json({
    error: 'InternalServerError',
    message: 'Something went wrong while handling the request.',
  })
})

export default app

const entryFilePath = process.argv[1] ? fileURLToPath(new URL(`file://${process.argv[1]}`)) : null
const currentFilePath = fileURLToPath(import.meta.url)

if (entryFilePath === currentFilePath) {
  app.listen(port, () => {
    console.log(`Resume API listening on http://localhost:${port}`)
  })
}
