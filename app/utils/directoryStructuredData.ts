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

  // Same trail as the cascader (Board / Grade / Subject), linking each level to its
  // past-paper search like the old page's breadcrumb, and shaped like useSeoEngine's.
  const crumbs = [
    { name: 'Past Papers', item: new URL('/search?type=paper', siteUrl).href },
    { name: selection.board.title, item: new URL(`/search?type=paper&section=${selection.board.code}`, siteUrl).href },
    { name: selection.grade.title, item: new URL(`/search?type=paper&base=${selection.grade.id}`, siteUrl).href },
    { name: selection.subject.title, item: url },
  ]

  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': `${url}#webpage`,
    'url': url,
    'name': introduction.title,
    'description': introduction.description,
    'about': { '@type': 'Thing', 'name': selection.subject.title },
    'breadcrumb': {
      '@type': 'BreadcrumbList',
      'itemListElement': crumbs.map((crumb, index) => ({
        '@type': 'ListItem',
        'position': index + 1,
        // Board/grade titles come from the API with stray spaces.
        'name': String(crumb.name).trim(),
        'item': crumb.item,
      })),
    },
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
