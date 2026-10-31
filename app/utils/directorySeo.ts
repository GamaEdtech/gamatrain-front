import { getDirectoryPaperLink, getDirectoryPaperTitle } from './directoryPapers'
import type { DirectoryPaper, DirectorySelection } from '../types/subject-directory'

// Title, description, canonical URL and JSON-LD for the subject directory page.

export interface DirectoryStructuredDataPaper {
  paper: DirectoryPaper
  year: string
  session: string
}

const subjectPath = ({ board, grade, subject }: DirectorySelection) => `${board.title} ${grade.title} ${subject.title}`

export const getDirectoryIntroduction = (selection: DirectorySelection | null) => {
  const title = selection ? `${subjectPath(selection)} Past Papers` : 'Past Papers'
  return {
    title,
    seoTitle: `${title} | GamaTrain`,
    description: selection
      ? `Browse ${subjectPath(selection)} question papers and mark schemes, organised by year, session, paper and variant. Find additional study materials in the Resources section.`
      : 'Select a board, grade and subject to browse question papers, mark schemes and additional study resources.',
  }
}

// Only board, grade and subject identify the page; other query values stay out.
export const getDirectoryCanonicalUrl = (selection: DirectorySelection | null, siteUrl: string) => selection
  ? `${new URL('/subject-directory', siteUrl).href}?${new URLSearchParams({
    board: String(selection.board.code), grade: String(selection.grade.id), subject: String(selection.subject.id),
  })}`
  : null

// CollectionPage with a Board / Grade / Subject breadcrumb (each level links to its
// past-paper search) and the papers currently shown.
export const getDirectoryStructuredData = (selection: DirectorySelection | null, papers: DirectoryStructuredDataPaper[], siteUrl: string) => {
  const url = getDirectoryCanonicalUrl(selection, siteUrl)
  if (!selection || !url) return null
  const { title, description } = getDirectoryIntroduction(selection)
  const link = (path: string) => new URL(path, siteUrl).href
  const list = (items: object[]) => items.map((item, index) => ({ '@type': 'ListItem', 'position': index + 1, ...item }))

  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    url,
    'name': title,
    description,
    'about': { '@type': 'Thing', 'name': selection.subject.title },
    'breadcrumb': {
      '@type': 'BreadcrumbList',
      'itemListElement': list([
        { name: 'Past Papers', item: link('/search?type=paper') },
        { name: selection.board.title.trim(), item: link(`/search?type=paper&section=${selection.board.code}`) },
        { name: selection.grade.title.trim(), item: link(`/search?type=paper&base=${selection.grade.id}`) },
        { name: selection.subject.title.trim(), item: url },
      ]),
    },
    ...(papers.length && {
      mainEntity: {
        '@type': 'ItemList',
        'itemListElement': list(papers.map(({ paper, year, session }) => ({
          item: {
            '@type': 'LearningResource',
            'url': link(getDirectoryPaperLink(paper)),
            'name': `${subjectPath(selection)} — ${session} ${year} — ${getDirectoryPaperTitle(paper)}`,
            'learningResourceType': 'Past paper',
            'educationalLevel': selection.grade.title,
          },
        }))),
      },
    }),
  }
}

// Keep API-supplied titles safe inside an HTML script element.
export const serializeDirectoryStructuredData = (schema: object) => JSON.stringify(schema).replace(/</g, '\\u003c')
