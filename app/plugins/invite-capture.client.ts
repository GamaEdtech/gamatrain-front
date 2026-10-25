import { INVITE_QUERY_KEY, saveInviteCode } from '~/utils/inviteCode'

/**
 * Captures a teacher's invite code from `?invite=CODE` on any page, in the browser only (see utils/inviteCode.ts for why
 * the server never touches it), then drops the parameter from the address bar so it isn't copied on or bookmarked.
 */
export default defineNuxtPlugin((nuxtApp) => {
  const url = new URL(window.location.href)
  const code = url.searchParams.get(INVITE_QUERY_KEY)
  if (!code) return

  // Saved before the app mounts, so components (the invite banner) can read it in their own onMounted.
  // A signed-in visitor already has an account, so the code can't apply to them.
  if (!useAuth().isAuthenticated.value) saveInviteCode(code.trim())

  nuxtApp.hook('app:mounted', () => {
    const current = new URL(window.location.href)
    current.searchParams.delete(INVITE_QUERY_KEY)
    // replaceState, not router.replace: it changes only the address bar, so the page doesn't navigate or refetch.
    window.history.replaceState(window.history.state, '', `${current.pathname}${current.search}${current.hash}`)
  })
})
