/**
 * Provisional client-side leveling formula derived from the user's real score.
 * There is no backend leveling/XP system yet — this is a first-pass placeholder
 * so the dashboard can show real, per-user progress instead of a fixed number.
 * TODO: replace with a real leveling system once the backend exposes one.
 */
const XP_PER_LEVEL = 300
const LEVEL_TITLES = ['Newcomer', 'Rising Star', 'Contributor', 'Achiever', 'Mentor', 'Expert', 'Legend']

export function useLevel(score: number | undefined | null) {
  const safeScore = Math.max(0, Number(score) || 0)
  const level = Math.floor(safeScore / XP_PER_LEVEL) + 1
  const xpIntoLevel = safeScore % XP_PER_LEVEL
  const percent = Math.round((xpIntoLevel / XP_PER_LEVEL) * 100)
  const title = LEVEL_TITLES[Math.min(level - 1, LEVEL_TITLES.length - 1)]

  return {
    level,
    title,
    percent,
    xpIntoLevel,
    xpPerLevel: XP_PER_LEVEL,
  }
}
