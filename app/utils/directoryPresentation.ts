import type { DirectorySelection } from '~/types/subject-directory/cascader'

export const getDirectoryIntroduction = (selection: DirectorySelection | null) => {
  if (!selection) {
    const description = 'Select a board, grade and subject to browse question papers, mark schemes and additional study resources.'
    return {
      title: 'Past Papers',
      description,
      seoTitle: 'Past Papers | GamaTrain',
      metaDescription: description,
    }
  }

  const selectedPath = [selection.board.title, selection.grade.title, selection.subject.title].join(' ')

  return {
    title: `${selectedPath} Past Papers`,
    description: `Browse ${selectedPath} question papers and mark schemes, organised by year, session, paper and variant. Find additional study materials in the Resources section.`,
    seoTitle: `${selectedPath} Past Papers | GamaTrain`,
    metaDescription: `Browse ${selectedPath} question papers and mark schemes by year, session, paper and variant. Explore additional study resources.`,
  }
}
