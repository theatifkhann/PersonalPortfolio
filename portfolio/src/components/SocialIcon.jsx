function SocialIcon({ id }) {
  if (id === 'instagram') {
    return (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <rect x="4.5" y="4.5" width="15" height="15" rx="4.5" stroke="currentColor" strokeWidth="1.75" />
        <circle cx="12" cy="12" r="3.5" stroke="currentColor" strokeWidth="1.75" />
        <circle cx="17.4" cy="6.6" r="1" fill="currentColor" />
      </svg>
    )
  }

  if (id === 'linkedin') {
    return (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M7 9.25V17M7 7.25C6.31 7.25 5.75 6.69 5.75 6C5.75 5.31 6.31 4.75 7 4.75C7.69 4.75 8.25 5.31 8.25 6C8.25 6.69 7.69 7.25 7 7.25Z"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M11 17V9.25H14V10.75C14.58 9.78 15.64 9.08 17.1 9.08C19.42 9.08 20.25 10.59 20.25 13.1V17"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M14 13.25C14 12.15 14.9 11.25 16 11.25C17.1 11.25 18 12.15 18 13.25V17"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M7 6.5L17 17.5M17 6.5L7 17.5"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
      />
    </svg>
  )
}

export default SocialIcon
