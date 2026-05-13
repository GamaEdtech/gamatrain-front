import type {
  ApiResult,
  AppError,
  ResponseListDTO,
  AdminLanguageDTO,
  AdminCultureDTO,
} from '@/types'

interface AddLanguageDTO {
  name: string
  code: string
  icon: string
  isEnable: boolean
  isDefault: boolean
}
interface GetDataParams {
  page: number
  pageSize: number
}

const data = ref<AdminLanguageDTO[]>([])
const cultures = ref<AdminCultureDTO[]>([])
const totalCount = ref(0)
const pageCount = ref(0)
const loadingGetData = ref(true)
const loadingDeleteItem = ref(false)
const loadingAddItem = ref(false)
const loadingGetItemById = ref(false)
const loadingEditItem = ref(false)
const loadingGetCultures = ref(false)

export const useLanguageAdmin = () => {
  const { $toast } = useNuxtApp()

  const getData = async (params: GetDataParams) => {
    const { page, pageSize } = params
    loadingGetData.value = true
    try {
      const query: Record<string, string | number | boolean | null> = {
        'PagingDto.PageFilter.Size': pageSize,
        'PagingDto.PageFilter.Skip': (page - 1) * pageSize,
        'PagingDto.PageFilter.ReturnTotalRecordsCount': true,
      }
      const response = await useApiService.get<
        ApiResult<ResponseListDTO<AdminLanguageDTO>>
      >('/api/v2/admin/languages', query)
      if (response.data) {
        data.value = response.data.list
        totalCount.value = response.data.totalRecordsCount
        pageCount.value = Math.ceil(totalCount.value / pageSize)
      }
      else {
        data.value = []
      }
    }
    catch (err: unknown) {
      const error = err as AppError
      if (error.response?.status === 400) {
        $toast.error(error.response.data?.message || '')
      }
    }
    finally {
      loadingGetData.value = false
    }
  }

  const getItemById = async (id: string) => {
    loadingGetItemById.value = true
    try {
      const response = await useApiService.get<
        ApiResult<AdminLanguageDTO>
      >(`/api/v2/admin/languages/${id}`)

      return response
    }
    catch (err: unknown) {
      const error = err as AppError
      if (error.response?.status === 400) {
        $toast.error(error.response.data?.message || '')
      }
      return {
        succeeded: false,
        message: 'The operation failed. Please try again later.',
        data: {},
      }
    }
    finally {
      loadingGetItemById.value = false
    }
  }

  const deleteItem = async (id: string) => {
    try {
      loadingDeleteItem.value = true
      const response = await useApiService.remove<
        ApiResult<boolean>
      >(
        `/api/v2/admin/languages/${id}`,
      )
      if (response.succeeded) {
        $toast.success('Language deleted successfully!')
      }
      else {
        $toast.error('The operation failed. Please try again later.')
      }
    }
    catch (err: unknown) {
      const error = err as AppError
      if (error.response?.status === 400) {
        $toast.error(error.response.data?.message || '')
      }
    }
    finally {
      loadingDeleteItem.value = false
    }
  }

  const addItem = async (language: AddLanguageDTO) => {
    try {
      loadingAddItem.value = true
      const response = await useApiService.post<
        ApiResult<boolean>
      >(
        '/api/v2/admin/languages',
        { ...language },
      )
      if (response.succeeded) {
        $toast.success('Language Added successfully!')
      }
      else {
        $toast.error('The operation failed. Please try again later.')
      }
      return response
    }
    catch (err: unknown) {
      const error = err as AppError
      if (error.response?.status === 400) {
        $toast.error(error.response.data?.message || '')
      }
      return {
        succeeded: false,
        message: 'The operation failed. Please try again later.',
      }
    }
    finally {
      loadingAddItem.value = false
    }
  }

  const editItem = async (language: AddLanguageDTO, id: string) => {
    try {
      loadingEditItem.value = true
      const response = await useApiService.put<
        ApiResult<boolean>
      >(
        `/api/v2/admin/languages/${id}`,
        { ...language },
      )
      if (response.succeeded) {
        $toast.success('Language Edited successfully!')
      }
      else {
        $toast.error('The operation failed. Please try again later.')
      }
      return response
    }
    catch (err: unknown) {
      const error = err as AppError
      if (error.response?.status === 400) {
        $toast.error(error.response.data?.message || '')
      }
      return {
        succeeded: false,
        message: 'The operation failed. Please try again later.',
      }
    }
    finally {
      loadingEditItem.value = false
    }
  }

  const getCultures = async () => {
    if (cultures.value.length > 0) return

    loadingGetCultures.value = true
    try {
      const response = await useApiService.get<
        ApiResult<AdminCultureDTO[]>
      >('/api/v2/admin/languages/cultures')
      if (response.data && response.data.length > 0) {
        cultures.value = response.data
      }
    }
    catch (err: unknown) {
      const error = err as AppError
      if (error.response?.status === 400) {
        $toast.error(error.response.data?.message || '')
      }
    }
    finally {
      loadingGetCultures.value = false
    }
  }

  return { loadingGetData, data, getData, totalCount, pageCount,
    getItemById, loadingGetItemById, deleteItem, loadingDeleteItem, addItem, loadingAddItem, editItem, loadingEditItem, getCultures, loadingGetCultures, cultures,
  }
}
