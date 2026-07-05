import type {
  AddAdminTagDTO,
  AdminTagDTO,
  ApiResult,
  AppError,
  GetAdminTagParams,
  ResponseListDTO,
} from '@/types'

const data = ref<AdminTagDTO[]>([])
const totalCount = ref(0)
const pageCount = ref(0)
const loadingGetData = ref(true)
const loadingGetItemById = ref(false)
const loadingDeleteItem = ref(false)
const loadingAddItem = ref(false)
const loadingEditItem = ref(false)

const NAME = 'Tag'

export const useTagAdmin = () => {
  const { $toast } = useNuxtApp()

  const handleError = (err: unknown) => {
    const error = err as AppError
    if (error.response?.status === 400) {
      $toast.error(error.response.data?.message || '')
    }
  }

  const showResponseError = (response: ApiResult<unknown>) => {
    if (response.errors && response.errors.length > 0) {
      $toast.error(response.errors[0].message || '')
    }
    else {
      $toast.error('The operation failed. Please try again later.')
    }
  }

  const getData = async (params: GetAdminTagParams) => {
    loadingGetData.value = true

    try {
      const query: Record<string, string | number | boolean | null> = {
        'PagingDto.PageFilter.Size': params.pageSize,
        'PagingDto.PageFilter.Skip': (params.page - 1) * params.pageSize,
        'PagingDto.PageFilter.ReturnTotalRecordsCount': true,
        'TagType': params.tagType,
      }

      const response = await useApiService.get<
        ApiResult<ResponseListDTO<AdminTagDTO>>
      >('/api/v2/admin/tags', query)

      if (response.data) {
        data.value = response.data.list
        totalCount.value = response.data.totalRecordsCount
        pageCount.value = Math.ceil(totalCount.value / params.pageSize)
      }
      else {
        data.value = []
        totalCount.value = 0
        pageCount.value = 0
      }
    }
    catch (err: unknown) {
      handleError(err)
    }
    finally {
      loadingGetData.value = false
    }
  }

  const getItemById = async (id: string | number) => {
    loadingGetItemById.value = true

    try {
      const response = await useApiService.get<ApiResult<AdminTagDTO>>(
        `/api/v2/admin/tags/${id}`,
      )

      return response
    }
    catch (err: unknown) {
      handleError(err)

      return {
        succeeded: false,
        status: 0,
        data: null,
      }
    }
    finally {
      loadingGetItemById.value = false
    }
  }

  const deleteItem = async (id: string | number) => {
    loadingDeleteItem.value = true

    try {
      const response = await useApiService.remove<ApiResult<boolean>>(
        `/api/v2/admin/tags/${id}`,
      )

      if (response.succeeded) {
        $toast.success(`${NAME} deleted successfully!`)
      }
      else {
        showResponseError(response)
      }

      return response
    }
    catch (err: unknown) {
      handleError(err)

      return {
        succeeded: false,
        status: 0,
        data: false,
      }
    }
    finally {
      loadingDeleteItem.value = false
    }
  }

  const addItem = async (tag: AddAdminTagDTO) => {
    loadingAddItem.value = true

    try {
      const response = await useApiService.post<ApiResult<boolean>>(
        '/api/v2/admin/tags',
        { ...tag },
      )

      if (response.succeeded) {
        $toast.success(`${NAME} created successfully!`)
      }
      else {
        showResponseError(response)
      }

      return response
    }
    catch (err: unknown) {
      handleError(err)

      return {
        succeeded: false,
        status: 0,
        data: false,
      }
    }
    finally {
      loadingAddItem.value = false
    }
  }

  const editItem = async (tag: AddAdminTagDTO, id: string | number) => {
    loadingEditItem.value = true

    try {
      const response = await useApiService.put<ApiResult<boolean>>(
        `/api/v2/admin/tags/${id}`,
        { ...tag },
      )

      if (response.succeeded) {
        $toast.success(`${NAME} updated successfully!`)
      }
      else {
        showResponseError(response)
      }

      return response
    }
    catch (err: unknown) {
      handleError(err)

      return {
        succeeded: false,
        status: 0,
        data: false,
      }
    }
    finally {
      loadingEditItem.value = false
    }
  }

  return {
    loadingGetData,
    data,
    getData,
    totalCount,
    pageCount,
    getItemById,
    loadingGetItemById,
    deleteItem,
    loadingDeleteItem,
    addItem,
    loadingAddItem,
    editItem,
    loadingEditItem,
  }
}
