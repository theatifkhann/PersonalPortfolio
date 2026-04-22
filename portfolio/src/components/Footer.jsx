import { useState } from 'react'
import SocialIcon from './SocialIcon'
import { buildResumeApiUrl } from '../utils/resumeApi'
import { SITE_CONFIG, SOCIAL_LINKS } from '../utils/constants'

function SettingsIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path
        d="M8.303 2.743C8.835 1.086 11.165 1.086 11.697 2.743C12.04 3.811 13.264 4.277 14.22 3.7C15.704 2.805 17.351 4.452 16.456 5.936C15.879 6.892 16.345 8.116 17.413 8.459C19.07 8.991 19.07 11.321 17.413 11.853C16.345 12.196 15.879 13.42 16.456 14.376C17.351 15.86 15.704 17.507 14.22 16.612C13.264 16.035 12.04 16.501 11.697 17.569C11.165 19.226 8.835 19.226 8.303 17.569C7.96 16.501 6.736 16.035 5.78 16.612C4.296 17.507 2.649 15.86 3.544 14.376C4.121 13.42 3.655 12.196 2.587 11.853C0.93 11.321 0.93 8.991 2.587 8.459C3.655 8.116 4.121 6.892 3.544 5.936C2.649 4.452 4.296 2.805 5.78 3.7C6.736 4.277 7.96 3.811 8.303 2.743Z"
        stroke="currentColor"
        strokeWidth="1.35"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12.5 10A2.5 2.5 0 1 1 7.5 10A2.5 2.5 0 0 1 12.5 10Z"
        stroke="currentColor"
        strokeWidth="1.35"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function Footer({ onOpenResumeSettings }) {
  const [isSettingsGateOpen, setIsSettingsGateOpen] = useState(false)
  const [secretKey, setSecretKey] = useState('')
  const [isCheckingKey, setIsCheckingKey] = useState(false)
  const [status, setStatus] = useState(null)

  function handleOpenSettingsGate() {
    setIsSettingsGateOpen(true)
    setStatus(null)
    setSecretKey('')
  }

  function handleCloseSettingsGate() {
    setIsSettingsGateOpen(false)
    setIsCheckingKey(false)
    setStatus(null)
    setSecretKey('')
  }

  async function handleSettingsSubmit(event) {
    event.preventDefault()

    if (!secretKey.trim()) {
      setStatus({ tone: 'error', message: 'Enter the secret key to open resume settings.' })
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

      onOpenResumeSettings(secretKey.trim())
      handleCloseSettingsGate()
    } catch (error) {
      setStatus({ tone: 'error', message: error.message || 'The secret key is incorrect.' })
    } finally {
      setIsCheckingKey(false)
    }
  }

  return (
    <>
      <footer className="site-footer">
        <div>
          <p>{SITE_CONFIG.name}</p>
          <span>{SITE_CONFIG.availability}</span>
        </div>

        <div className="site-footer__links">
          {SOCIAL_LINKS.map((link) => (
            <a key={link.id} href={link.href} aria-label={link.label}>
              <span className="site-footer__icon">
                <SocialIcon id={link.id} />
              </span>
            </a>
          ))}
          <span className="site-footer__separator" aria-hidden="true">
            |
          </span>
          <button type="button" aria-label="Open resume settings" onClick={handleOpenSettingsGate}>
            <span className="site-footer__icon">
              <SettingsIcon />
            </span>
            <span>Settings</span>
          </button>
        </div>
      </footer>

      {isSettingsGateOpen ? (
        <div className="settings-gate-backdrop" role="presentation" onClick={handleCloseSettingsGate}>
          <div
            className="settings-gate-card"
            role="dialog"
            aria-modal="true"
            aria-labelledby="settings-gate-title"
            onClick={(event) => event.stopPropagation()}
          >
            <p className="settings-gate-card__eyebrow">Protected Access</p>
            <h2 id="settings-gate-title">Enter the secret key to open settings</h2>
            <p className="settings-gate-card__body">
              Resume settings stay behind the same backend secret check as the upload flow.
            </p>

            <form className="settings-gate-card__form" onSubmit={handleSettingsSubmit}>
              <label className="settings-gate-card__field">
                <span>Secret key</span>
                <input
                  type="password"
                  value={secretKey}
                  onChange={(event) => setSecretKey(event.target.value)}
                  placeholder="Enter your ADMIN_SECRET_KEY"
                  autoComplete="current-password"
                />
              </label>

              {status ? (
                <p
                  className={`settings-gate-card__status ${
                    status.tone === 'error' ? 'is-error' : 'is-success'
                  }`}
                >
                  {status.message}
                </p>
              ) : null}

              <div className="settings-gate-card__actions">
                <button type="submit" disabled={isCheckingKey}>
                  {isCheckingKey ? 'Checking...' : 'Open Settings'}
                </button>
                <button type="button" className="is-secondary" onClick={handleCloseSettingsGate}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </>
  )
}

export default Footer
