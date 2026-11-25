import type {
  AdminPastPaperDetailDTO,
  AdminPastPaperDTO,
  ApiResult,
  GetAdminPastPaperParams,
  ReviewPastPaperDTO,
} from '@/types'

const data = ref<AdminPastPaperDTO[]>([])
const totalCount = ref(0)
const pageCount = ref(0)
const loadingGetData = ref(false)
const loadingReview = ref(false)
const loadingDeleteItem = ref(false)
const BASE = '/api/v2/admin/pastpapers'

/**
 * The admin panel's past papers, from the backend's copy. Reading works at any time; changes are refused
 * ("notNative") until papers are written in the backend, and the backend's message then says so.
 */
export const usePastPaperAdmin = () => {
  const { $toast } = useNuxtApp()
  const { handleApiResponseError, handleApiCatchError } = useApiErrorHandler()

  const getData = async (params: GetAdminPastPaperParams) => {
    loadingGetData.value = true
    try {
      const query: Record<string, string | number> = { page: params.page, perpage: params.pageSize }
      if (params.status !== null && params.status !== undefined) query.status = params.status
      if (params.pendingEdit) query.pending_edit = 1
      if (params.title) query.title = params.title
      if (params.uid) query.uid = params.uid
      for (const key of ['section', 'base', 'lesson', 'test_type', 'edu_year', 'edu_month', 'variant', 'id', 'code', 'is_paper', 'refScore', 'order'] as const) {
        const value = params[key]
        if (value !== null && value !== undefined && value !== '') query[key] = value
      }

      const response = await useApiService.get<ApiResult<{ list: AdminPastPaperDTO[], num: number }>>(BASE, query)
      if (response.succeeded && response.data) {
        data.value = response.data.list
        totalCount.value = Number(response.data.num)
        pageCount.value = Math.ceil(totalCount.value / params.pageSize)
      }
      else {
        data.value = []
        totalCount.value = 0
        pageCount.value = 0
        handleApiResponseError(response)
      }
    }
    catch (err: unknown) {
      data.value = []
      handleApiCatchError(err)
    }
    finally {
      loadingGetData.value = false
    }
  }

  const review = async (id: string | number, item: ReviewPastPaperDTO) => {
    loadingReview.value = true
    try {
      const response = await useApiService.put<ApiResult<{ id: number, status: number }>>(`${BASE}/${id}/review`, {
        status: item.status,
        notes: item.notes,
      })
      if (response.succeeded) $toast.success('Review saved.')
      else handleApiResponseError(response)
      return response.succeeded
    }
    catch (err: unknown) {
      handleApiCatchError(err)
      return false
    }
    finally {
      loadingReview.value = false
    }
  }

  const setScore = async (id: string | number, score: number) => {
    try {
      const response = await useApiService.put<ApiResult<{ id: number, ref_score: number }>>(`${BASE}/${id}/score`, { score })
      if (response.succeeded) $toast.success('Score saved.')
      else handleApiResponseError(response)
      return response.succeeded
    }
    catch (err: unknown) {
      handleApiCatchError(err)
      return false
    }
  }

  const deleteItem = async (id: string | number) => {
    loadingDeleteItem.value = true
    try {
      const response = await useApiService.remove<ApiResult<unknown>>(`${BASE}/${id}`)
      if (response.succeeded) $toast.success('Past paper deleted.')
      else handleApiResponseError(response)
      return response.succeeded
    }
    catch (err: unknown) {
      handleApiCatchError(err)
      return false
    }
    finally {
      loadingDeleteItem.value = false
    }
  }

  /** One paper in any status, for the review: its fields, which files it has and the last review's note. */
  const getPaper = async (id: string | number) => {
    try {
      const response = await useApiService.get<ApiResult<AdminPastPaperDetailDTO>>(`${BASE}/${id}`)
      if (response.succeeded && response.data) return response.data
      handleApiResponseError(response)
    }
    catch (err: unknown) {
      handleApiCatchError(err)
    }
    return null
  }

  /**
   * A short signed link to one of a paper's files (its id in the paper's `files`), in any status; nothing is charged. With
   * `pending`, the file of the owner's edit waiting for review.
   */
  const getFileLink = async (id: string | number, fileId: number, pending = false) => {
    try {
      const response = await useApiService.get<ApiResult<{ url: string }>>(
        `${BASE}/${id}/files/${fileId}`,
        pending ? { pending: true } : undefined,
      )
      if (response.succeeded && response.data?.url) return response.data.url
      handleApiResponseError(response)
    }
    catch (err: unknown) {
      handleApiCatchError(err)
    }
    return null
  }

  return {
    data,
    totalCount,
    pageCount,
    loadingGetData,
    loadingReview,
    loadingDeleteItem,
    getData,
    getPaper,
    getFileLink,
    review,
    setScore,
    deleteItem,
  }
}
