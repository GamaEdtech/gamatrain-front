import type {
  AdminTypeItemDTO,
  AdminTypeItemListDTO,
  ApiResult,
  GetAdminTypeItemParams,
  SaveAdminTypeItemDTO,
} from '@/types'

const data = ref<AdminTypeItemDTO[]>([])
const totalCount = ref(0)
const pageCount = ref(0)
const loadingGetData = ref(false)
const loadingSave = ref(false)
const loadingDeleteItem = ref(false)
const BASE = '/api/v2/admin/types'

/**
 * The lookup lists (boards, grades, subjects, topics, classifications...) in the backend's copy. Changes are refused
 * ("notNative") until the lists are edited in the backend, and the backend's message then says so.
 */
export const useTypeAdmin = () => {
  const { $toast } = useNuxtApp()
  const { handleApiResponseError, handleApiCatchError } = useApiErrorHandler()

  const getData = async (params: GetAdminTypeItemParams) => {
    loadingGetData.value = true
    try {
      const query: Record<string, string | number | boolean> = { kind: params.kind, page: params.page, pageSize: params.pageSize }
      if (params.parent) query.parent = params.parent
      if (params.title) query.title = params.title
      if (params.includeDeleted) query.includeDeleted = true

      const response = await useApiService.get<ApiResult<AdminTypeItemListDTO>>(BASE, query)
      if (response.succeeded && response.data) {
        data.value = response.data.items
        totalCount.value = response.data.total
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

  const saveItem = async (item: SaveAdminTypeItemDTO, id?: number) => {
    loadingSave.value = true
    try {
      const response = id
        ? await useApiService.put<ApiResult<boolean>>(`${BASE}/${id}`, { ...item })
        : await useApiService.post<ApiResult<number>>(BASE, { ...item })
      if (response.succeeded) $toast.success(id ? 'Item saved.' : 'Item added.')
      else handleApiResponseError(response)
      return response.succeeded
    }
    catch (err: unknown) {
      handleApiCatchError(err)
      return false
    }
    finally {
      loadingSave.value = false
    }
  }

  const deleteItem = async (id: number) => {
    loadingDeleteItem.value = true
    try {
      const response = await useApiService.remove<ApiResult<boolean>>(`${BASE}/${id}`)
      if (response.succeeded) $toast.success('Item hidden.')
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

  return { data, totalCount, pageCount, loadingGetData, loadingSave, loadingDeleteItem, getData, saveItem, deleteItem }
}
