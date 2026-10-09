import type { DirectorySelection, DirectorySubjectSearchResult } from '~/types/subject-directory/cascader'

export const searchDirectorySubjects = (paths: DirectorySelection[], query: string): DirectorySubjectSearchResult[] => {
  const normalizedQuery = query.trim().toLocaleLowerCase()
  if (!normalizedQuery) return []
  const terms = normalizedQuery.split(/\s+/)
  const uniquePaths = new Map(paths.map(selection => [
    JSON.stringify([selection.board.code, selection.grade.id, selection.subject.id]), selection,
  ]))

  return [...uniquePaths.entries()]
    .filter(([, { subject }]) => terms.every(term => subject.title.toLocaleLowerCase().includes(term)))
    .map(([id, selection]) => {
      // The existing options API includes syllabus codes in subject titles, e.g. Mathematics (0580).
      const codes = [...selection.subject.title.matchAll(/\(([^()]+)\)/g)]
        .map(match => match[1]!.trim().toLocaleLowerCase())
      return {
        id, selection, title: selection.subject.title,
        path: `${selection.board.title} → ${selection.grade.title}`,
        exactCode: codes.includes(normalizedQuery),
      }
    })
    .sort((first, second) => Number(second.exactCode) - Number(first.exactCode)
      || first.title.localeCompare(second.title, undefined, { sensitivity: 'base', numeric: true })
      || first.path.localeCompare(second.path, undefined, { sensitivity: 'base', numeric: true }))
}
