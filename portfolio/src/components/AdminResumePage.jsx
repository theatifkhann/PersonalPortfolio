import { useEffect, useState } from 'react'
import { buildResumeApiUrl, getResumeApiBaseUrl } from '../utils/resumeApi'

function LockIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path
        d="M6.667 8.333V6.667A3.333 3.333 0 0 1 13.333 6.667V8.333M6.333 17.083H13.667C14.6 17.083 15.067 17.083 15.423 16.902C15.736 16.743 15.993 16.486 16.152 16.173C16.333 15.817 16.333 15.35 16.333 14.417V11C16.333 10.067 16.333 9.6 16.152 9.244C15.993 8.931 15.736 8.674 15.423 8.515C15.067 8.333 14.6 8.333 13.667 8.333H6.333C5.4 8.333 4.933 8.333 4.577 8.515C4.264 8.674 4.007 8.931 3.848 9.244C3.667 9.6 3.667 10.067 3.667 11V14.417C3.667 15.35 3.667 15.817 3.848 16.173C4.007 16.486 4.264 16.743 4.577 16.902C4.933 17.083 5.4 17.083 6.333 17.083Z"
        stroke="currentColor"
        strokeWidth="1.45"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10 12.083V13.333"
        stroke="currentColor"
        strokeWidth="1.45"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function formatTimestamp(value) {
  if (!value) {
    return 'Not uploaded yet'
  }

  try {
    return new Intl.DateTimeFormat(undefined, {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(new Date(value))
  } catch {
    return value
  }
}

function AdminResumePage({ initialSecretKey = '' }) {
  const [secretKey, setSecretKey] = useState('')
  const [authorizedSecretKey, setAuthorizedSecretKey] = useState(initialSecretKey)
  const [isUnlocked, setIsUnlocked] = useState(Boolean(initialSecretKey))
  const [selectedFile, setSelectedFile] = useState(null)
  const [resumeMeta, setResumeMeta] = useState({
    configured: false,
    resumeUrl: null,
    lastModified: null,
    message: '',
    missingEnv: [],
  })
  const [isLoading, setIsLoading] = useState(true)
  const [isCheckingKey, setIsCheckingKey] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [status, setStatus] = useState(null)

  const apiBaseUrl =
    getResumeApiBaseUrl() || (typeof window === 'undefined' ? 'http://localhost:4000' : window.location.origin)

  useEffect(() => {
    let isMounted = true

    async function loadResumeMeta() {
      setIsLoading(true)

      try {
        const response = await fetch(buildResumeApiUrl('/api/resume'))
        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.message || 'Failed to load resume status.')
        }

        if (isMounted) {
          setResumeMeta(data)
          setStatus(null)
        }
      } catch (error) {
        if (isMounted) {
          setStatus({
            tone: 'error',
            message: error.message || 'Could not reach the resume API.',
          })
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    loadResumeMeta()

    return () => {
      isMounted = false
    }
  }, [])

  useEffect(() => {
    let isMounted = true

    async function restoreUnlockedState() {
      if (!secretKey.trim()) {
        return
      }

      try {
        const query = new URLSearchParams({
          action: 'auth-check',
          secretKey: secretKey.trim(),
        })
        const response = await fetch(buildResumeApiUrl(`/api/resume?${query.toString()}`))

        if (!response.ok) {
          return
        }

        if (isMounted) {
          setIsUnlocked(true)
        }
      } catch {
        // Keep the panel locked if validation fails.
      }
    }

    restoreUnlockedState()

    return () => {
      isMounted = false
    }
  }, [secretKey])

  async function handleUnlock(event) {
    event.preventDefault()

    if (!secretKey.trim()) {
      setStatus({ tone: 'error', message: 'Enter the secret key to unlock the admin panel.' })
      return
    }

    setIsCheckingKey(true)
    setStatus(null)

    try {
      const query = new URLSearchParams({
        action: 'auth-check',
        secretKey: secretKey.trim(),
      })
      const response = await fetch(buildResumeApiUrl(`/api/resume?${query.toString()}`))
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'The secret key is incorrect.')
      }

      setIsUnlocked(true)
      setAuthorizedSecretKey(secretKey.trim())
      setStatus({ tone: 'success', message: 'Admin panel unlocked.' })
    } catch (error) {
      setIsUnlocked(false)
      setAuthorizedSecretKey('')
      setStatus({ tone: 'error', message: error.message || 'The secret key is incorrect.' })
    } finally {
      setIsCheckingKey(false)
    }
  }

  function handleLock() {
    setIsUnlocked(false)
    setAuthorizedSecretKey('')
    setSelectedFile(null)
    setStatus(null)
  }

  async function handleSubmit(event) {
    event.preventDefault()

    if (!isUnlocked) {
      setStatus({ tone: 'error', message: 'Unlock the admin panel before uploading.' })
      return
    }

    const activeSecretKey = authorizedSecretKey || secretKey.trim()

    if (!activeSecretKey) {
      setStatus({ tone: 'error', message: 'Enter the secret key before uploading.' })
      return
    }

    if (!selectedFile) {
      setStatus({ tone: 'error', message: 'Choose a PDF file first.' })
      return
    }

    const formData = new FormData()
    formData.append('resume', selectedFile)
    formData.append('secretKey', activeSecretKey)

    setIsUploading(true)
    setStatus(null)

    try {
      const response = await fetch(buildResumeApiUrl('/api/resume'), {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Upload failed.')
      }

      setResumeMeta((currentValue) => ({
        ...currentValue,
        configured: true,
        resumeUrl: data.resumeUrl,
        lastModified: data.uploadedAt,
      }))
      setSelectedFile(null)
      setStatus({ tone: 'success', message: 'Resume uploaded. The live button now uses the new PDF.' })
    } catch (error) {
      setStatus({ tone: 'error', message: error.message || 'Upload failed.' })
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="site-shell">
      <header className="site-header">
        <div className="navbar">
          <a className="navbar__brand" href="/" aria-label="Back to portfolio">
            <span className="navbar__brand-mark">AT</span>
          </a>

          <div className="navbar__right">
            <div className="navbar__actions">
              <a className="navbar__pill" href="/">
                View Portfolio
              </a>
            </div>
          </div>
        </div>
      </header>

      <main className="site-main">
        <section className="content-section">
          <div className="mx-auto grid w-full max-w-[70rem] gap-8 xl:grid-cols-[minmax(0,1.05fr)_minmax(24rem,0.95fr)]">
            <div className={`resume-admin-shell ${isUnlocked ? 'is-unlocked' : 'is-locked'}`}>
              <p className="font-mono text-[0.72rem] uppercase tracking-[0.22em] text-[var(--text-muted)]">
                Resume Admin
              </p>
              <h1 className="mt-4 max-w-[12ch] text-[clamp(2.5rem,5vw,4.5rem)] font-semibold leading-[0.94] tracking-[-0.06em] text-[var(--text)]">
                Upload the live resume PDF
              </h1>
              <p className="mt-5 max-w-[40rem] text-[1rem] leading-8 text-[var(--text-soft)] sm:text-[1.05rem]">
                Unlock this admin panel with your secret key, then upload a PDF to the Express API.
                The upload overwrites a single object in S3-compatible storage, and the navbar opens
                whatever URL the API reports as the current live resume.
              </p>

              <form className="mt-8 grid gap-5" onSubmit={handleUnlock}>
                <label className="grid gap-2">
                  <span className="text-sm font-medium text-[var(--text)]">Secret key</span>
                  <input
                    className="min-h-[50px] rounded-2xl border border-[var(--line)] bg-[var(--surface-soft)] px-4 text-[var(--text)] outline-none transition-colors duration-200 focus:border-[var(--line-strong)]"
                    type="password"
                    value={secretKey}
                    onChange={(event) => setSecretKey(event.target.value)}
                    placeholder="Enter the ADMIN_SECRET_KEY from your backend env"
                    autoComplete="current-password"
                  />
                </label>

                <label className="grid gap-2">
                  <span className="text-sm font-medium text-[var(--text)]">Panel status</span>
                  <div className="resume-admin-status">
                    <span className="resume-admin-status__icon">
                      <LockIcon />
                    </span>
                    <span>{isUnlocked ? 'Unlocked for resume upload' : 'Locked and protected'}</span>
                  </div>
                </label>

                <div className="flex flex-wrap items-center gap-3">
                  <button
                    className="inline-flex min-h-[46px] items-center justify-center rounded-[14px] border border-[var(--line-strong)] bg-[var(--surface-elevated)] px-5 text-[0.88rem] font-semibold text-[var(--text)] transition-[transform,border-color,background,box-shadow] duration-200 hover:-translate-y-0.5 hover:bg-[color:rgba(40,44,52,0.96)] disabled:cursor-not-allowed disabled:opacity-70"
                    type="submit"
                    disabled={isCheckingKey}
                  >
                    {isCheckingKey ? 'Checking...' : isUnlocked ? 'Verify Key' : 'Unlock Admin Panel'}
                  </button>

                  {isUnlocked ? (
                    <button
                      className="inline-flex min-h-[46px] items-center justify-center rounded-[14px] border border-white/12 bg-transparent px-5 text-[0.88rem] font-medium text-[var(--text-soft)] transition-[transform,border-color,color] duration-200 hover:-translate-y-0.5 hover:border-white/20 hover:text-[var(--text)]"
                      type="button"
                      onClick={handleLock}
                    >
                      Lock Panel
                    </button>
                  ) : null}
                </div>
              </form>

              <div className={`resume-admin-upload-shell ${isUnlocked ? 'is-unlocked' : 'is-locked'}`}>
                {isUnlocked ? (
                  <form className="mt-8 grid gap-5" onSubmit={handleSubmit}>
                    <label className="grid gap-2">
                      <span className="text-sm font-medium text-[var(--text)]">Resume PDF</span>
                      <input
                        className="block min-h-[54px] rounded-2xl border border-dashed border-[var(--line-strong)] bg-[var(--surface-soft)] px-4 py-3 text-[var(--text-soft)] file:mr-4 file:rounded-xl file:border-0 file:bg-[var(--surface-elevated)] file:px-4 file:py-2 file:text-sm file:font-medium file:text-[var(--text)]"
                        type="file"
                        accept="application/pdf"
                        onChange={(event) => setSelectedFile(event.target.files?.[0] ?? null)}
                      />
                    </label>

                    <div className="flex flex-wrap items-center gap-3">
                      <button
                        className="inline-flex min-h-[46px] items-center justify-center rounded-[14px] border border-[var(--line-strong)] bg-[var(--surface-elevated)] px-5 text-[0.88rem] font-semibold text-[var(--text)] transition-[transform,border-color,background,box-shadow] duration-200 hover:-translate-y-0.5 hover:bg-[color:rgba(40,44,52,0.96)] disabled:cursor-not-allowed disabled:opacity-70"
                        type="submit"
                        disabled={isUploading}
                      >
                        {isUploading ? 'Uploading...' : 'Upload Resume'}
                      </button>

                      <span className="text-sm text-[var(--text-muted)]">
                        {selectedFile ? selectedFile.name : 'No file selected'}
                      </span>
                    </div>
                  </form>
                ) : (
                  <div className="resume-admin-overlay" aria-hidden="true">
                    <div className="resume-admin-overlay__badge">
                      <span className="resume-admin-overlay__icon">
                        <LockIcon />
                      </span>
                      <span>Protected Upload Zone</span>
                    </div>
                    <h2>Unlock to access resume controls</h2>
                    <p>
                      Your secret key is required before file selection and upload actions become
                      available.
                    </p>
                  </div>
                )}
              </div>

              {status ? (
                <div
                  className={`mt-5 rounded-2xl border px-4 py-3 text-sm ${
                    status.tone === 'success'
                      ? 'border-emerald-400/25 bg-emerald-500/10 text-emerald-200'
                      : 'border-rose-400/25 bg-rose-500/10 text-rose-200'
                  }`}
                >
                  {status.message}
                </div>
              ) : null}
            </div>

            <aside className="rounded-[32px] border border-[var(--line)] bg-[var(--surface)] p-6 shadow-[var(--shadow)] sm:p-8">
              <p className="font-mono text-[0.72rem] uppercase tracking-[0.22em] text-[var(--text-muted)]">
                Current Status
              </p>
              <div className="mt-5 grid gap-4">
                <div className="rounded-[24px] border border-[var(--line)] bg-[var(--surface-soft)] p-5">
                  <p className="text-sm text-[var(--text-muted)]">API base</p>
                  <p className="mt-2 break-all text-[0.95rem] font-medium text-[var(--text)]">
                    {apiBaseUrl}
                  </p>
                </div>

                <div className="rounded-[24px] border border-[var(--line)] bg-[var(--surface-soft)] p-5">
                  <p className="text-sm text-[var(--text-muted)]">Admin panel</p>
                  <p className="mt-2 text-[0.95rem] font-medium text-[var(--text)]">
                    {isUnlocked ? 'Unlocked' : 'Locked'}
                  </p>
                </div>

                <div className="rounded-[24px] border border-[var(--line)] bg-[var(--surface-soft)] p-5">
                  <p className="text-sm text-[var(--text-muted)]">Storage</p>
                  <p className="mt-2 text-[0.95rem] font-medium text-[var(--text)]">
                    {isLoading
                      ? 'Checking...'
                      : resumeMeta.configured
                        ? 'Configured'
                        : 'Not configured yet'}
                  </p>

                  {resumeMeta.message ? (
                    <p className="mt-2 text-sm leading-6 text-[var(--text-soft)]">
                      {resumeMeta.message}
                    </p>
                  ) : null}

                  {resumeMeta.missingEnv?.length ? (
                    <p className="mt-2 text-sm leading-6 text-[var(--text-soft)]">
                      Missing env: {resumeMeta.missingEnv.join(', ')}
                    </p>
                  ) : null}
                </div>

                <div className="rounded-[24px] border border-[var(--line)] bg-[var(--surface-soft)] p-5">
                  <p className="text-sm text-[var(--text-muted)]">Live resume URL</p>
                  {resumeMeta.resumeUrl ? (
                    <a
                      className="mt-2 inline-flex break-all text-[0.95rem] font-medium text-[var(--text)] underline underline-offset-4"
                      href={resumeMeta.resumeUrl}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {resumeMeta.resumeUrl}
                    </a>
                  ) : (
                    <p className="mt-2 text-[0.95rem] font-medium text-[var(--text)]">
                      No uploaded resume found yet
                    </p>
                  )}

                  <p className="mt-3 text-sm text-[var(--text-soft)]">
                    Last updated: {formatTimestamp(resumeMeta.lastModified)}
                  </p>
                </div>

                <div className="rounded-[24px] border border-[var(--line)] bg-[var(--surface-soft)] p-5">
                  <p className="text-sm text-[var(--text-muted)]">Open this screen</p>
                  <p className="mt-2 text-sm leading-6 text-[var(--text-soft)]">
                    Visit <span className="font-mono text-[var(--text)]">?admin=resume</span> on
                    your portfolio domain after deploying the frontend.
                  </p>
                </div>
              </div>
            </aside>
          </div>
        </section>
      </main>
    </div>
  )
}

export default AdminResumePage
