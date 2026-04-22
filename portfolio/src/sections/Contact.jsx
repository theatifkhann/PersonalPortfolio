import { useState } from 'react'

const CONTACT_ITEMS = [
  {
    id: 'email',
    label: 'Email',
    value: 'aatifkhayt@gmail.com',
    href: 'mailto:aatifkhayt@gmail.com',
    actionLabel: 'Send Email',
    accent: 'Direct contact',
  },
  {
    id: 'github',
    label: 'GitHub',
    value: 'github.com/theatifkhann',
    href: 'https://github.com/theatifkhann',
    actionLabel: 'View my projects',
    accent: 'Open source work',
  },
  {
    id: 'linkedin',
    label: 'LinkedIn',
    value: 'www.linkedin.com/in/atif-khan-at313',
    href: 'https://www.linkedin.com/in/%E1%B4%80%E1%B4%9B%C9%AA%D2%93-%E1%B4%8B%CA%9C%E1%B4%80%C9%B4-366201341/',
    actionLabel: 'Connect with me',
    accent: 'Professional network',
  },
]

function ContactIcon({ id }) {
  if (id === 'email') {
    return (
      <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path
          d="M3.333 5.833L8.971 9.78C9.338 10.037 9.522 10.165 9.722 10.215C9.899 10.259 10.101 10.259 10.278 10.215C10.478 10.165 10.662 10.037 11.029 9.78L16.667 5.833M5.333 15.833H14.667C15.6 15.833 16.067 15.833 16.423 15.652C16.736 15.493 16.993 15.236 17.152 14.923C17.333 14.567 17.333 14.1 17.333 13.167V6.833C17.333 5.9 17.333 5.433 17.152 5.077C16.993 4.764 16.736 4.507 16.423 4.348C16.067 4.167 15.6 4.167 14.667 4.167H5.333C4.4 4.167 3.933 4.167 3.577 4.348C3.264 4.507 3.007 4.764 2.848 5.077C2.667 5.433 2.667 5.9 2.667 6.833V13.167C2.667 14.1 2.667 14.567 2.848 14.923C3.007 15.236 3.264 15.493 3.577 15.652C3.933 15.833 4.4 15.833 5.333 15.833Z"
          stroke="currentColor"
          strokeWidth="1.45"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    )
  }

  if (id === 'github') {
    return (
      <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path
          d="M7.917 15.833C4.583 16.875 4.583 14.063 3.25 13.646M12.583 17.917V15.229C12.609 14.898 12.564 14.566 12.451 14.253C12.337 13.941 12.157 13.658 11.922 13.427C14.136 13.177 16.458 12.344 16.458 8.521C16.458 7.543 16.108 6.603 15.489 5.896C15.783 5.11 15.762 4.24 15.431 3.469C15.431 3.469 14.646 3.219 12.583 4.604C11.057 4.191 9.443 4.191 7.917 4.604C5.854 3.219 5.069 3.469 5.069 3.469C4.738 4.24 4.717 5.11 5.011 5.896C4.387 6.608 4.036 7.557 4.042 8.542C4.042 12.333 6.364 13.167 8.578 13.448C8.346 13.676 8.168 13.954 8.056 14.26C7.944 14.567 7.9 14.893 7.928 15.219V17.917"
          stroke="currentColor"
          strokeWidth="1.45"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path
        d="M5.833 7.5A1.667 1.667 0 1 1 5.833 4.167A1.667 1.667 0 0 1 5.833 7.5ZM4.375 8.958H7.292V15.833H4.375V8.958ZM9.792 8.958H12.59V9.896H12.629C13.018 9.198 13.971 8.462 15.389 8.462C18.34 8.462 18.889 10.404 18.889 12.929V15.833H15.972V13.271C15.972 12.66 15.96 11.875 15.125 11.875C14.278 11.875 14.148 12.536 14.148 13.229V15.833H11.231V8.958H9.792Z"
        stroke="currentColor"
        strokeWidth="1.45"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function Contact() {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText('aatifkhayt@gmail.com')
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1800)
    } catch {
      setCopied(false)
    }
  }

  return (
    <section className="content-section content-section--contact" id="contact">
      <div className="grid w-full items-start gap-10 xl:grid-cols-[minmax(0,0.82fr)_minmax(0,1.18fr)] xl:gap-16">
        <div className="flex max-w-[34rem] flex-col justify-center" data-reveal>
          <p className="font-mono text-[0.72rem] uppercase tracking-[0.22em] text-[var(--text-muted)]">
            Contact
          </p>
          <h2 className="mt-4 max-w-[10ch] text-[clamp(2.7rem,4.8vw,4.6rem)] font-semibold leading-[0.95] tracking-[-0.055em] text-[var(--text)]">
            Get In Touch
          </h2>
          <p className="mt-6 max-w-[34rem] text-[1.02rem] leading-8 text-[var(--text-soft)] sm:text-[1.08rem]">
            I&apos;m always open to discussing new projects, ideas, or opportunities.
            Feel free to reach out.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <a
              className="inline-flex min-h-[46px] items-center justify-center rounded-[14px] border border-[var(--line-strong)] bg-[var(--surface-elevated)] px-5 text-[0.88rem] font-semibold text-[var(--text)] shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] transition-[transform,border-color,background,box-shadow] duration-200 hover:-translate-y-0.5 hover:border-[var(--line-strong)] hover:bg-[color:rgba(40,44,52,0.96)] hover:shadow-[0_12px_30px_rgba(0,0,0,0.25)]"
              href="mailto:aatifkhayt@gmail.com"
            >
              Let&apos;s Work Together
            </a>
          </div>
        </div>

        <div
          className="rounded-[32px] border border-[var(--line)] bg-[var(--surface)] p-5 shadow-[var(--shadow)] sm:p-7"
          data-reveal
        >
          <div className="grid gap-4">
            {CONTACT_ITEMS.map((item) => (
              <article
                className="grid gap-4 rounded-[22px] border border-[var(--line)] bg-[var(--surface-soft)] p-5 transition-[transform,border-color,box-shadow] duration-200 hover:-translate-y-0.5 hover:border-[var(--line-strong)] hover:shadow-[0_16px_36px_rgba(0,0,0,0.18)] sm:grid-cols-[auto_minmax(0,1fr)_auto] sm:items-center sm:gap-5"
                key={item.id}
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[var(--line)] bg-[var(--surface)] text-[var(--text)] shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]">
                  <span className="h-5 w-5">
                    <ContactIcon id={item.id} />
                  </span>
                </div>

                <div className="min-w-0">
                  <p className="font-mono text-[0.68rem] uppercase tracking-[0.2em] text-[var(--text-muted)]">
                    {item.label}
                  </p>
                  <p className="mt-2 break-all text-[1rem] font-semibold tracking-[-0.02em] text-[var(--text)] sm:break-normal">
                    {item.value}
                  </p>
                  <p className="mt-1 text-[0.9rem] text-[var(--text-soft)]">{item.accent}</p>
                </div>

                {item.id === 'email' ? (
                  <div className="flex flex-wrap gap-2 sm:justify-end">
                    <button
                      className="inline-flex min-h-[40px] items-center justify-center rounded-xl border border-[var(--line)] bg-[var(--surface)] px-4 text-[0.82rem] font-medium text-[var(--text-soft)] transition-[transform,border-color,color,background] duration-200 hover:-translate-y-0.5 hover:border-[var(--line-strong)] hover:text-[var(--text)]"
                      type="button"
                      onClick={handleCopy}
                    >
                      {copied ? 'Copied' : 'Copy'}
                    </button>
                    <a
                      className="inline-flex min-h-[40px] items-center justify-center rounded-xl border border-[var(--line-strong)] bg-[var(--surface-elevated)] px-4 text-[0.82rem] font-medium text-[var(--text)] transition-[transform,border-color,background] duration-200 hover:-translate-y-0.5 hover:border-[var(--line-strong)] hover:bg-[color:rgba(40,44,52,0.96)]"
                      href={item.href}
                    >
                      {item.actionLabel}
                    </a>
                  </div>
                ) : (
                  <a
                    className="inline-flex min-h-[40px] items-center justify-center rounded-xl border border-[var(--line)] bg-[var(--surface)] px-4 text-[0.82rem] font-medium text-[var(--text-soft)] transition-[transform,border-color,color,background] duration-200 hover:-translate-y-0.5 hover:border-[var(--line-strong)] hover:bg-[var(--surface-muted)] hover:text-[var(--text)] sm:justify-self-end"
                    href={item.href}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {item.actionLabel}
                  </a>
                )}
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default Contact
