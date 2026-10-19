export interface ErrorRecoveryLink {
  label: string
  to: string
}

// A missing or private detail page sends the user to the listing it belongs to, where they can find
// something close, instead of dropping them on the home page. Keyed by the route's first path segment.
const LISTING_BY_SECTION: Record<string, ErrorRecoveryLink> = {
  paper: { label: 'Browse past papers', to: '/search?type=paper' },
  test: { label: 'Browse past papers', to: '/search?type=paper' },
  exam: { label: 'Browse exams', to: '/search?type=quizhub' },
  multimedia: { label: 'Browse multimedia', to: '/search?type=multimedia' },
  qa: { label: 'Browse Q&A', to: '/search?type=forum' },
  tutorial: { label: 'Browse tutorials', to: '/search?type=tutorial' },
  post: { label: 'Read latest posts', to: '/post' },
  school: { label: 'Find schools', to: '/school' },
}

export const getErrorRecoveryListing = (path: string): ErrorRecoveryLink | null => {
  const section = path.split('/').filter(Boolean)[0] ?? ''
  return LISTING_BY_SECTION[section] ?? null
}
