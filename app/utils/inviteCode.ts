/**
 * Teacher invite codes (backend docs/business/referrals.md).
 *
 * A teacher shares any page with `?invite=CODE`. The code is kept in the visitor's browser only: public pages are
 * server-rendered and cached by Cloudflare, so the server must never read it, render it or set a cookie for it, or a
 * cached page would hand one teacher's code to everyone. The first code wins and is kept for 30 days; it is sent with
 * sign-up/sign-in requests and cleared after a successful sign-in.
 */

export const INVITE_QUERY_KEY = 'invite'
const STORAGE_KEY = 'gama_invite'
const COOKIE_NAME = 'gama_invite'
const MAX_AGE_DAYS = 30
const CODE_PATTERN = /^[A-Za-z0-9]{1,10}$/

interface StoredInvite {
  code: string
  savedAt: number
}

const isValidCode = (code: unknown): code is string => typeof code === 'string' && CODE_PATTERN.test(code)

const isFresh = (savedAt: number) => Date.now() - savedAt < MAX_AGE_DAYS * 24 * 60 * 60 * 1000

const readCookie = (): string | null => {
  const match = document.cookie.split('; ').find(part => part.startsWith(`${COOKIE_NAME}=`))
  if (!match) return null
  const value = decodeURIComponent(match.slice(COOKIE_NAME.length + 1))
  return isValidCode(value) ? value : null
}

/** The stored invite code, or null when none (or it is older than 30 days). Browser only. */
export const getInviteCode = (): string | null => {
  if (!import.meta.client) return null

  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const stored = JSON.parse(raw) as StoredInvite
      if (isValidCode(stored.code) && isFresh(stored.savedAt)) return stored.code
    }
  }
  catch {
    // Storage blocked or corrupt: fall back to the cookie.
  }

  return readCookie()
}

/** Keeps the code unless one is already stored (the first teacher's link wins). Browser only. */
export const saveInviteCode = (code: string) => {
  if (!import.meta.client || !isValidCode(code) || getInviteCode()) return

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ code, savedAt: Date.now() } satisfies StoredInvite))
  }
  catch {
    // Private mode: the cookie below still keeps it.
  }

  const secure = location.protocol === 'https:' ? '; Secure' : ''
  document.cookie = `${COOKIE_NAME}=${encodeURIComponent(code)}; Max-Age=${MAX_AGE_DAYS * 24 * 60 * 60}; Path=/; SameSite=Lax${secure}`
}

export const clearInviteCode = () => {
  if (!import.meta.client) return

  try {
    localStorage.removeItem(STORAGE_KEY)
  }
  catch {
    // Ignore.
  }
  document.cookie = `${COOKIE_NAME}=; Max-Age=0; Path=/; SameSite=Lax`
}

/** `url` with `?invite=CODE` set (replacing any existing one). */
export const buildInviteLink = (url: string, code: string) => {
  const link = new URL(url)
  link.searchParams.set(INVITE_QUERY_KEY, code)
  return link.toString()
}
