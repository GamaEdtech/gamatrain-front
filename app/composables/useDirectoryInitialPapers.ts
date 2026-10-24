import { useAsyncData } from '#app'
import { useDirectoryPapersApi } from '~/composables/api/subject-directory/useDirectoryPapers.api'
import { getDirectoryPaperSessions, PAST_PAPER_YEAR_OPTIONS } from '~/constants/pastpaper/sessions'
import { getDirectoryInitialPapersKey, loadDirectoryInitialPapers } from '~/utils/directoryInitialPapers'
import type { DirectoryInitialPaperContext } from '~/types/subject-directory/initialPapers'

export const useDirectoryInitialPapers = (context: DirectoryInitialPaperContext) => {
  const { subjectId, gradeId } = context
  const { fetchPapers } = useDirectoryPapersApi()
  return useAsyncData(getDirectoryInitialPapersKey(context), () => loadDirectoryInitialPapers({
    subjectId,
    years: PAST_PAPER_YEAR_OPTIONS,
    sessions: getDirectoryPaperSessions(gradeId),
    fetchPapers,
  }))
}
