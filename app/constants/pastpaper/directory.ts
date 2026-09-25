export const DIRECTORY_FILTERS = [
  { key: 'year', title: 'Year', icon: 'md:calendar_today_outlined' },
  { key: 'series', title: 'Session' },
  { key: 'paper', title: 'Paper', inline: true },
  { key: 'variant', title: 'Variant', inline: true },
]

// Exact colors from the approved directory Figma frame (25:3943). These named
// tokens preserve that design where the existing palette has no exact match.
export const DIRECTORY_COLORS = {
  directoryInk: '#1E2A44',
  directorySeries: '#EEF3FF',
  directoryAnswer: '#EEF1F5',
  directoryButtonBorder: '#D8DEE8',
  directoryExtraBorder: '#EEF1F6',
  directoryHover: '#F9F9F9',
  directoryDescription: '#424A53',
}

// Exact tokens from the approved redesign/search filter UI. Matching colors
// already in DIRECTORY_COLORS are reused rather than duplicated.
export const DIRECTORY_FILTER_COLORS = {
  academicGold: '#F4B400',
  academicGoldHover: '#E8A800',
  softGold: '#FFF8E1',
  surfaceSecondary: '#F7F8FA',
  errorStrong: '#C93C37',
}

export const getDirectoryFilterOptionTitle = (key: string, item: { title: string }) => key === 'paper'
  ? String(item.title).replace(/^\s*paper\s+(\d+)\s*$/i, '$1')
  : item.title

export const getDirectoryFilterColumns = (key: string, boardId: string | number) => key === 'paper'
  ? Number(boardId) === 6657 ? 2 : 4
  : 3
