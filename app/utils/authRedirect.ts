import type { LocationQueryValue } from 'vue-router'

// Query key the auth middleware uses to remember the page a signed-out user was sent away from.
export const AUTH_REDIRECT_QUERY_KEY = 'redirect'

// Placeholder origin to resolve against: whatever resolves outside it points at another site.
const SAME_SITE_BASE = 'https://same-site.invalid'
const MAX_REDIRECT_LENGTH = 2048

// Only same-site paths are followed after sign-in, or a crafted link could send a user who just signed in
// to a phishing page. String checks alone miss what browsers normalise ("//host", "/\host", tabs or
// newlines inside "/\t/host"), so let the URL parser resolve it and keep it only if it stays on our origin.
export const getSafeAuthRedirect = (value: LocationQueryValue | LocationQueryValue[] | undefined): string | null => {
  const raw = Array.isArray(value) ? value[0] : value
  if (!raw || raw.length > MAX_REDIRECT_LENGTH || !raw.startsWith('/')) return null

  let url: URL
  try {
    url = new URL(raw, SAME_SITE_BASE)
  }
  catch {
    return null
  }
  if (url.origin !== SAME_SITE_BASE) return null

  // Pointing back at the sign-in prompt itself would just reopen the dialog after signing in.
  if (url.searchParams.has('auth_form')) return null

  return `${url.pathname}${url.search}${url.hash}`
}
