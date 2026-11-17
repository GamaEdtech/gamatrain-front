import type { ApiResult, GetTopicMatchParams, TopicMatchDTO, TopicMatchSuggestDTO } from '@/types'

const BASE = '/api/v2/admin/topicmatches'

/**
 * The review of the suggested matches between GAMA's topics and other boards' (approving one links the two topics).
 * Changes are refused ("notNative") until topic matches are reviewed in the backend.
 */
export const useTopicMatchAdmin = () => {
  const { $toast } = useNuxtApp()
  const { handleApiResponseError, handleApiCatchError } = useApiErrorHandler()

  const list = ref<TopicMatchDTO[]>([])
  const totalCount = ref(0)
  const pageCount = ref(0)
  const loadingList = ref(false)
  const loadingSuggest = ref(false)
  const busyId = ref<number | null>(null)

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

  const getList = async (params: GetTopicMatchParams) => {
    loadingList.value = true
    const query: Record<string, string | number> = { page: params.page, pageSize: params.pageSize }
    if (params.status) query.status = params.status
    if (params.topicId) query.topicId = params.topicId
    if (params.subjectId) query.subjectId = params.subjectId
    const data = await call(() => useApiService.get<ApiResult<{ total: number, items: TopicMatchDTO[] }>>(BASE, query))
    list.value = data?.items ?? []
    totalCount.value = data?.total ?? 0
    pageCount.value = Math.ceil(totalCount.value / params.pageSize)
    loadingList.value = false
  }

  const act = async <T>(id: number, request: () => Promise<ApiResult<T>>, success: string) => {
    busyId.value = id
    const result = await call(request, success)
    busyId.value = null
    return result !== null
  }

  const approve = (id: number) => act(id, () => useApiService.post<ApiResult<boolean>>(`${BASE}/${id}/approve`, {}), 'Match approved: the topics are linked.')
  const unapprove = (id: number) => act(id, () => useApiService.remove<ApiResult<boolean>>(`${BASE}/${id}/approve`), 'Approval taken back.')
  const remove = (id: number) => act(id, () => useApiService.remove<ApiResult<boolean>>(`${BASE}/${id}`), 'Match removed.')

  const add = (gamaTopicId: number, externalTopicId: number) =>
    call(() => useApiService.post<ApiResult<number>>(BASE, { gamaTopicId, externalTopicId }), 'Match added.')

  const suggest = async (topicId: number) => {
    loadingSuggest.value = true
    const result = await call(() => useApiService.post<ApiResult<TopicMatchSuggestDTO>>(`${BASE}/suggest/${topicId}`, {}))
    loadingSuggest.value = false
    if (result) {
      $toast.success(result.added ? `${result.added} new match(es) suggested.` : 'No new confident match found.')
      if (result.errors.length) $toast.warning(`Some subjects could not be compared (${result.errors.length}).`)
    }

    return result
  }

  return { list, totalCount, pageCount, loadingList, loadingSuggest, busyId, getList, approve, unapprove, remove, add, suggest }
}
