// Text mapping for the profile `onlineStatus` enum, shared by the search
// result cards. Mirrors the text half of app/components/profile/header.vue's
// userOnlineStatus map (the color/theme half isn't needed for a plain-text row).
const onlineStatusText: Record<string, string> = {
  NewUser: 'New here',
  ActiveLongTimeAgo: 'Long time no see',
  ActiveThisMonth: 'Missing for days',
  ActiveThisWeek: 'Was here this week',
  OnlineToday: 'Was here today',
  ActiveRecently: 'Be right back',
  Online: 'Online',
}

export function useOnlineStatusText(status?: string | null) {
  if (!status) return ''
  return onlineStatusText[status] ?? status
}
