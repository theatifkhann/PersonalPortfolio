import { useEffect, useState } from 'react'
import { NAV_LINKS, SITE_CONFIG } from '../utils/constants'
import { buildResumeApiUrl } from '../utils/resumeApi'

function Navbar() {
  const [activeHref, setActiveHref] = useState(NAV_LINKS[0]?.href ?? '#hero')
  const [resumeUrl, setResumeUrl] = useState('/resume.pdf')

  useEffect(() => {
    const sections = NAV_LINKS.map((item) =>
      document.querySelector(item.href),
    ).filter(Boolean)

    if (!sections.length) {
      return undefined
    }

    const visibility = new Map(sections.map((section) => [section.id, 0]))

    const updateActiveSection = () => {
      const visibleSections = [...visibility.entries()].filter(
        ([, ratio]) => ratio > 0,
      )

      if (visibleSections.length) {
        visibleSections.sort((a, b) => b[1] - a[1])
        setActiveHref(`#${visibleSections[0][0]}`)
        return
      }

      let fallbackHref = NAV_LINKS[0]?.href ?? '#hero'

      sections.forEach((section) => {
        if (section.getBoundingClientRect().top <= window.innerHeight * 0.28) {
          fallbackHref = `#${section.id}`
        }
      })

      setActiveHref(fallbackHref)
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          visibility.set(entry.target.id, entry.isIntersecting ? entry.intersectionRatio : 0)
        })

        updateActiveSection()
      },
      {
        rootMargin: '-18% 0px -55% 0px',
        threshold: [0.15, 0.3, 0.45, 0.6, 0.75],
      },
    )

    sections.forEach((section) => observer.observe(section))
    updateActiveSection()

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    let isMounted = true

    async function loadResumeUrl() {
      try {
        const response = await fetch(buildResumeApiUrl('/api/resume'))

        if (!response.ok) {
          return
        }

        const data = await response.json()

        if (isMounted && data.resumeUrl) {
          setResumeUrl(data.resumeUrl)
        }
      } catch {
        // Keep the static fallback when the API is unavailable.
      }
    }

    loadResumeUrl()

    return () => {
      isMounted = false
    }
  }, [])

  return (
    <header className="site-header">
      <nav className="navbar">
        <a className="navbar__brand" href="#hero" aria-label={`${SITE_CONFIG.name} home`}>
          <span className="navbar__brand-mark">{SITE_CONFIG.initials}</span>
        </a>

        <div className="navbar__links" aria-label="Primary">
          {NAV_LINKS.map((item) => (
            <a
              key={item.href}
              href={item.href}
              aria-current={activeHref === item.href ? 'page' : undefined}
            >
              {item.label}
            </a>
          ))}
        </div>

        <div className="navbar__right">
          <div className="navbar__actions">
            <a className="navbar__pill" href="#contact">
              Contact Me
            </a>
            <a
              className="navbar__pill navbar__pill--dark navbar__pill--resume"
              href={resumeUrl}
              target="_blank"
              rel="noreferrer"
            >
              <span>Resume</span>
              <svg
                className="navbar__pill-icon"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  d="M8 3.5V10.5M8 10.5L5.5 8M8 10.5L10.5 8M4 12.5H12"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
          </div>
        </div>
      </nav>
    </header>
  )
}

export default Navbar
