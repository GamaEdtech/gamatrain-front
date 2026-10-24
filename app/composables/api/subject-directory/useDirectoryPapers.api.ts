import { useNuxtApp } from '#app'
import { useApiService } from '~/composables/useApiService'
import type { DirectoryInitialPapersOptions, DirectoryPaperResponse } from '~/types/subject-directory/initialPapers'

export const useDirectoryPapersApi = () => {
  const nuxtApp = useNuxtApp()
  const fetchPapers: DirectoryInitialPapersOptions['fetchPapers'] = (params, signal) =>
    nuxtApp.runWithContext(() => useApiService.get<DirectoryPaperResponse>(
      '/api/v1/tests/search', { ...params }, { public: true, signal },
    ))
  return { fetchPapers }
}
