export function getResumeApiBaseUrl() {
  const value = import.meta.env.VITE_RESUME_API_BASE_URL?.trim() || ''
  return value.replace(/\/$/, '')
}

export function buildResumeApiUrl(pathname) {
  const baseUrl = getResumeApiBaseUrl()
  return baseUrl ? `${baseUrl}${pathname}` : pathname
}
