import { createDirectoryPaperLoader } from './directoryPaperLoader'
import { createDirectorySessionAvailability } from './directorySessionAvailability'
import { createDirectoryLatestSessionExpansion } from './directoryPaperExpansion'
import type { DirectoryInitialPaperContext, DirectoryInitialPapers, DirectoryInitialPapersOptions, DirectoryPaperQuery } from '~/types/subject-directory/initialPapers'

export const getDirectoryInitialPapersKey = ({ subjectId, gradeId }: DirectoryInitialPaperContext) =>
  `directory-initial-papers:${JSON.stringify([subjectId, gradeId])}`

// Resolve the initial open session before rendering, then serialize both caches
// so hydration can restore the same rows and accordion state without refetching.
export const loadDirectoryInitialPapers = async (options: DirectoryInitialPapersOptions): Promise<DirectoryInitialPapers> => {
  const result: DirectoryInitialPapers = { selected: null, sessions: [] }
  const firstYear = options.years[0]
  const firstSession = options.sessions[0]
  if (!options.subjectId || !firstYear || !firstSession) return result

  const loader = createDirectoryPaperLoader(options.fetchPapers)
  const availability = createDirectorySessionAvailability(options.fetchPapers)
  const queries: DirectoryPaperQuery[] = []
  const queryFor = (year: number, month: number): DirectoryPaperQuery => ({
    lesson: options.subjectId, edu_year: year, edu_month: month,
  })
  let selectedPapers: Promise<unknown> | undefined
  const startSelectedPapers = (year: number) => {
    if (selectedPapers) return
    // Start the selected page as soon as all newer sessions are confirmed empty.
    // Slower checks for older sessions still finish before we serialize the year.
    for (const session of options.sessions) {
      const query = queryFor(year, session.id)
      const status = availability.getState(query).status
      if (status === 'available') {
        selectedPapers = loader.getState(query).loaded ? Promise.resolve() : loader.load(query)
        return
      }
      if (status !== 'empty') return
    }
  }
  const expansion = createDirectoryLatestSessionExpansion({
    years: () => options.years,
    sessions: () => options.sessions,
    checkYear: async (year) => {
      await Promise.all(options.sessions.map(async (session) => {
        const query = queryFor(year, session.id)
        queries.push(query)
        // Reuse the newest session's full page for availability, while the
        // other session checks run through their existing bounded queue.
        if (year === firstYear.id && session.id === firstSession.id) await loader.load(query)
        const state = loader.getState(query)
        if (state.loaded) availability.seed(query, state.total > 0 || state.items.length > 0)
        else await availability.check(query)
        startSelectedPapers(year)
      }))
    },
    status: (year, month) => availability.getState(queryFor(year, month)).status,
    open: (year, month) => { result.selected = { year, month } },
  })

  try {
    await expansion.openLatest()
    await selectedPapers
    result.sessions = queries.map(query => ({
      query,
      availability: availability.getState(query).status,
      papers: { ...loader.getState(query) },
    }))
    return result
  }
  finally {
    loader.clear()
    availability.clear()
  }
}
