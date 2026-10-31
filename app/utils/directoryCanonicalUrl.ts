import type { DirectorySelection } from '~/types/subject-directory/cascader'

export const getDirectoryCanonicalUrl = (selection: DirectorySelection | null, siteUrl: string): string | null => {
  if (!selection) return null

  const board = String(selection.board?.code ?? '').trim()
  const grade = String(selection.grade?.id ?? '').trim()
  const subject = String(selection.subject?.id ?? '').trim()
  if (!board || !grade || !subject) return null

  // Only the committed subject path identifies this collection. Request query
  // parameters, tracking values and fragments must not enter its canonical URL.
  const url = new URL('/subject-directory', siteUrl)
  url.search = new URLSearchParams({ board, grade, subject }).toString()
  return url.href
}
