import { PAST_PAPER_YEAR_OPTIONS } from '~/constants/pastpaper/sessions'
import type { DirectorySelection } from '~/types/subject-directory/cascader'

export const getDirectoryIntroduction = (selection: DirectorySelection | null) => {
  if (!selection) return {
    title: 'Past Papers',
    description: 'Select a board, grade and subject to browse question papers, mark schemes and additional study resources.',
  }

  const selectedPath = [selection.board.title, selection.grade.title, selection.subject.title].join(' ')
  const years = PAST_PAPER_YEAR_OPTIONS.map(year => year.id)
  const yearRange = `${Math.min(...years)}–${Math.max(...years)}`

  return {
    title: `${selectedPath} Past Papers`,
    description: `Browse free ${selectedPath} question papers (QP) and mark schemes (MS) from ${yearRange}, organised by year, session, paper and variant. Find additional study materials in the Resources section.`,
  }
}
