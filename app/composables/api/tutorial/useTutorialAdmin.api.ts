import type {
  AdminTutorialDTO,
  AdminTutorialDetailDTO,
  AdminTutorialEditDTO,
  AdminTutorialKeywordsDTO,
  ApiResult,
  GetAdminTutorialParams,
  TutorialStatus,
  TypeItemDTO,
} from '@/types'

const BASE = '/api/v2/admin/tutorials'

/**
 * The admin panel's tutorials, from the backend's copy. Reading works at any time; changes are refused ("notNative")
 * until tutorials are edited in the backend, and the backend's message then says so.
 */
export const useTutorialAdmin = () => {
  const { $toast } = useNuxtApp()
  const { handleApiResponseError, handleApiCatchError } = useApiErrorHandler()

  const list = ref<AdminTutorialDTO[]>([])
  const totalCount = ref(0)
  const pageCount = ref(0)
  const loadingList = ref(false)
  const loadingSave = ref(false)
  const loadingKeywords = ref(false)
  const loadingDelete = ref(false)

  /** Runs a call, shows the backend's error when it fails, and answers its data (null on failure). */
  const call = async <T>(request: () => Promise<ApiResult<T>>, success?: string): Promise<T | null> => {
    try {
      const response = await request()
      if (!response.succeeded) {
        handleApiResponseError(response)
        return null
      }

      if (success) $toast.success(success)
      return (response.data ?? true) as T
    }
    catch (err: unknown) {
      handleApiCatchError(err)
      return null
    }
  }

  const getList = async (params: GetAdminTutorialParams) => {
    loadingList.value = true
    const query: Record<string, string | number> = { page: params.page, pageSize: params.pageSize }
    if (params.status) query.status = params.status
    if (params.boardId) query.boardId = params.boardId
    if (params.gradeId) query.gradeId = params.gradeId
    if (params.subjectId) query.subjectId = params.subjectId
    if (params.title) query.title = params.title
    const data = await call(() => useApiService.get<ApiResult<{ total: number, items: AdminTutorialDTO[] }>>(BASE, query))
    list.value = data?.items ?? []
    totalCount.value = data?.total ?? 0
    pageCount.value = Math.ceil(totalCount.value / params.pageSize)
    loadingList.value = false
  }

  const getTutorial = (id: number | string) =>
    call(() => useApiService.get<ApiResult<AdminTutorialDetailDTO>>(`${BASE}/${id}`))

  const save = async (id: number | null, item: AdminTutorialEditDTO) => {
    loadingSave.value = true
    const result = id
      ? await call(() => useApiService.put<ApiResult<boolean>>(`${BASE}/${id}`, item), 'Tutorial saved.')
      : await call(() => useApiService.post<ApiResult<number>>(BASE, item), 'Tutorial added.')
    loadingSave.value = false
    return result
  }

  const setStatus = (id: number, status: TutorialStatus) =>
    call(() => useApiService.put<ApiResult<boolean>>(`${BASE}/${id}/status`, { status }), 'Status saved.')

  const remove = async (id: number) => {
    loadingDelete.value = true
    const result = await call(() => useApiService.remove<ApiResult<boolean>>(`${BASE}/${id}`), 'Tutorial deleted.')
    loadingDelete.value = false
    return result
  }

  const generateKeywords = async (id: number) => {
    loadingKeywords.value = true
    const result = await call(() => useApiService.post<ApiResult<AdminTutorialKeywordsDTO>>(`${BASE}/${id}/keywords`, {}), 'Keywords generated and saved.')
    loadingKeywords.value = false
    return result
  }

  return { list, totalCount, pageCount, loadingList, loadingSave, loadingKeywords, loadingDelete, getList, getTutorial, save, setStatus, remove, generateKeywords }
}

/**
 * gama-api's lookup lists (boards, grades, subjects, topics) as the backend copies them; a tutorial and a topic match
 * store these ids.
 */
export const useTypeLists = () => {
  const load = async (query: Record<string, string | number>): Promise<TypeItemDTO[]> => {
    try {
      const response = await useApiService.get<ApiResult<TypeItemDTO[]>>('/api/v2/search/types', query, { public: true })
      return response.data ?? []
    }
    catch {
      return []
    }
  }

  return {
    boards: () => load({ type: 'section' }),
    grades: (boardId: number | string) => load({ type: 'base', section_id: boardId }),
    subjects: (gradeId: number | string) => load({ type: 'lesson', base_id: gradeId }),
    topics: (subjectId: number | string) => load({ type: 'topic', lesson_id: subjectId }),
  }
}
