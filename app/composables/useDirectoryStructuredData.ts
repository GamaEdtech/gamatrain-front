import { computed } from 'vue'
import type { DirectorySelection } from '~/types/subject-directory/cascader'
import type { DirectoryStructuredDataSource } from '~/types/subject-directory/structuredData'
import { getDirectoryStructuredData, serializeDirectoryStructuredData } from '~/utils/directoryStructuredData'

export const useDirectoryStructuredData = (
  selection: () => DirectorySelection | null,
  source: DirectoryStructuredDataSource,
) => {
  const siteConfig = useSiteConfig()
  const schema = computed(() => {
    const papers = source.visibleYears.value.flatMap(year =>
      source.displayedSessions(year.id)
        .filter(session => source.isSessionOpen(year.id, session.id))
        .flatMap(session => source.sessionState(year.id, session.id).items.map(paper => ({
          paper, year: year.title, session: session.title,
        }))),
    )
    return getDirectoryStructuredData(selection(), papers, siteConfig.url)
  })

  useHead(() => ({
    script: schema.value
      ? [{
          key: 'directory-structured-data',
          type: 'application/ld+json',
          innerHTML: serializeDirectoryStructuredData(schema.value),
        }]
      : [],
  }))
}
