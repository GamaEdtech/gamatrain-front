import { useNuxtApp } from '#app'
import { useApiService } from '~/composables/useApiService'
import { useBoardApi } from '~/composables/api/board/useBoard.api'
import type { ApiResult } from '~/types/api'
import type { BoardDTO, GradeDTO, SubjectDTO } from '~/types/board'
import type { DirectoryPaperQuery, DirectoryPaperResponse, DirectoryResourceGroup } from '~/types/subject-directory'

// Requests for the subject directory. Board, grade and subject lists are cached
// once per app instance (one per server request, one in the browser), so the URL
// resolver and the picker don't load the same list twice.
// The paper lists are the same for every visitor and cached by gamatrain-back and Cloudflare, so no token or cookie is
// sent: one cached copy then suits everyone, and the endpoint's any-origin CORS answer is valid without credentials.
const publicRequest = { public: true, credentials: 'omit' } as const

export const useSubjectDirectoryApi = () => {
  const nuxtApp = useNuxtApp() as ReturnType<typeof useNuxtApp> & { _directoryOptionLists?: Map<string, Promise<unknown[]>> }
  const lists = nuxtApp._directoryOptionLists ??= new Map<string, Promise<unknown[]>>()

  const getList = <T>(key: string, request: () => Promise<ApiResult<T[]>>): Promise<T[]> => {
    const cached = lists.get(key)
    if (cached) return cached as Promise<T[]>
    const pending = nuxtApp.runWithContext(request).then((response) => {
      if (response.succeeded === false || !Array.isArray(response.data)) throw new Error('Unable to load directory options')
      return response.data
    }).catch((error: unknown) => {
      lists.delete(key)
      throw error
    })
    lists.set(key, pending)
    return pending
  }

  // The same board list as Search's Board filter (v2 boards, in API order).
  const getBoards = () => getList<BoardDTO>('boards', useBoardApi().getBoards)

  const getGrades = (boardId: number | string) => getList<GradeDTO>(`grades:${boardId}`, () =>
    useApiService.get<ApiResult<GradeDTO[]>>('/api/v1/types/list/', { type: 'base', section_id: boardId }, { public: true }))

  const getSubjects = (gradeId: string) => getList<SubjectDTO>(`subjects:${gradeId}`, () =>
    useApiService.get<ApiResult<SubjectDTO[]>>('/api/v1/types/list/', { type: 'lesson', base_id: gradeId }, { public: true }))

  // gama-api's tests/search through gamatrain-back, which caches it (Redis, then Cloudflare): it took 1.4-2.2s uncached.
  const fetchPapers = (params: DirectoryPaperQuery & { page: number, perpage: number }) => nuxtApp.runWithContext(() =>
    useApiService.get<DirectoryPaperResponse>('/api/v2/search/papers', { ...params, is_paper: true, directory: true }, publicRequest))

  const fetchResources = (subjectId: string | number) =>
    useApiService.get<{ data?: { list?: DirectoryResourceGroup[] } }>('/api/v2/search/papers', {
      is_paper: false, directory: true, lesson: subjectId,
    }, publicRequest)

  return { getBoards, getGrades, getSubjects, fetchPapers, fetchResources }
}
