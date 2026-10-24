import type { DirectorySelection } from '~/types/subject-directory/cascader'
import type { DirectoryStructuredDataPaper } from '~/types/subject-directory/structuredData'
import { getDirectoryCanonicalUrl } from './directoryCanonicalUrl'
import { getDirectoryIntroduction } from './directoryPresentation'
import { getDirectoryPaperLink, getDirectoryPaperTitle } from './directoryPapers'

export const getDirectoryStructuredData = (
  selection: DirectorySelection | null,
  papers: DirectoryStructuredDataPaper[],
  siteUrl: string,
) => {
  const url = getDirectoryCanonicalUrl(selection, siteUrl)
  if (!selection || !url) return null

  const introduction = getDirectoryIntroduction(selection)
  const subjectPath = [selection.board.title, selection.grade.title, selection.subject.title].join(' ')
  const seen = new Set<string>()
  const items = papers.filter(({ paper }) => {
    const id = String(paper.id ?? '').trim()
    if (!id || seen.has(id)) return false
    seen.add(id)
    return true
  }).map(({ paper, year, session }, index) => {
    const paperUrl = new URL(getDirectoryPaperLink(paper), siteUrl).href
    return {
      '@type': 'ListItem',
      'position': index + 1,
      'item': {
        '@type': 'LearningResource',
        '@id': `${paperUrl}#learning-resource`,
        'url': paperUrl,
        'name': `${subjectPath} — ${session} ${year} — ${getDirectoryPaperTitle(paper)}`,
        'learningResourceType': 'Past paper',
        'educationalLevel': selection.grade.title,
        'about': { '@type': 'Thing', 'name': selection.subject.title },
      },
    }
  })

  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': `${url}#webpage`,
    'url': url,
    'name': introduction.title,
    'description': introduction.description,
    'about': { '@type': 'Thing', 'name': selection.subject.title },
    // This is the rendered subset, not a claim about the entire archive size.
    ...(items.length
      ? {
          mainEntity: {
            '@type': 'ItemList',
            '@id': `${url}#papers`,
            'name': introduction.title,
            'itemListElement': items,
          },
        }
      : {}),
  }
}

// Keep API-supplied titles safe inside an HTML script element.
export const serializeDirectoryStructuredData = (schema: NonNullable<ReturnType<typeof getDirectoryStructuredData>>) =>
  JSON.stringify(schema, null, 2).replace(/</g, '\\u003c')
