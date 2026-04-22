# PortfolioWeb

This repo contains the full portfolio workspace:

- `portfolio/`: Vite frontend portfolio app
- `backend/`: Express resume upload API with Cloudflare R2-compatible storage
- `render.yaml`: optional Render blueprint for the backend

## Local setup

Frontend:

```bash
cd portfolio
npm install
npm run dev
```

Backend:

```bash
cd backend
npm install
npm run dev
```

## Environment files

Do not commit local secret files.

- Frontend local env: `portfolio/.env`
- Backend local env: `backend/.env`

Use these safe templates instead:

- `portfolio/.env.example`
- `backend/.env.example`

## Vercel deployment

Deploy this repo to Vercel as two separate projects from the same GitHub repository.

### 1. Frontend project

- Import the repo into Vercel
- Set the root directory to `portfolio`
- Framework preset: `Vite`
- Add:

```text
VITE_RESUME_API_BASE_URL=https://your-backend-project.vercel.app
```

### 2. Backend project

- Import the same repo again into Vercel
- Set the root directory to `backend`
- Vercel will detect the Express app from `index.js`
- Add these environment variables:

```text
ADMIN_SECRET_KEY=your-secret-key
CORS_ORIGIN=https://your-frontend-project.vercel.app
MAX_UPLOAD_SIZE_MB=5
S3_REGION=auto
S3_ENDPOINT=https://<ACCOUNT_ID>.r2.cloudflarestorage.com
S3_BUCKET_NAME=portfolio-resume
S3_ACCESS_KEY_ID=your-r2-access-key-id
S3_SECRET_ACCESS_KEY=your-r2-secret-access-key
S3_PUBLIC_URL_BASE=https://your-public-r2-url/
S3_FORCE_PATH_STYLE=false
RESUME_OBJECT_KEY=resume/ResumeAtif.pdf
```

## Notes

- The backend is now Vercel-ready and exports the Express app directly for deployment
- `render.yaml` is still available if you ever want Render as a fallback
