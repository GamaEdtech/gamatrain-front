/** What a signed-in user did with a post: read it, started its podcast, or heard at least 80% of the podcast. */
export type UserActivityType = 'PostRead' | 'PodcastPlay' | 'PodcastListen'

/**
 * Records reads and podcast listens (`POST /api/v2/activities`) for the weekly report and authors' read counts.
 * Fire-and-forget: only for signed-in users, once per kind and post on this page, and it never shows an error or throws.
 * The backend keeps at most one per user, kind, post and day.
 */
export const useUserActivity = () => {
  const { isAuthenticated } = useAuth()
  const sent = new Set<string>()

  const record = (type: UserActivityType, contentId: number) => {
    if (!import.meta.client || !isAuthenticated.value || !(contentId > 0)) return
    const key = `${type}:${contentId}`
    if (sent.has(key)) return
    sent.add(key)
    useApiService.post('/api/v2/activities', { type, contentId }).catch(() => {})
  }

  return { record }
}
