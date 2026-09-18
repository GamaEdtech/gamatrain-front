import type {
  AddAdminNudgeTemplateDTO,
  AdminNudgeTemplateDTO,
  AdminNudgeTemplateIdDTO,
  ApiResult,
  GetAdminNudgeTemplateParams,
  ResponseListDTO,
  AdminNudgeTemplateDetailDTO,
  EditAdminNudgeTemplateDTO,
} from '@/types'

const NAME = 'Nudge template'
const BASE_URL = '/api/v2/admin/nudges/templates'

export const useNudgeAdmin = () => {
  const { $toast } = useNuxtApp()
  const { handleApiResponseError, handleApiCatchError, createApiFailure } = useApiErrorHandler()

  const data = ref<AdminNudgeTemplateDTO[]>([])
  const totalCount = ref(0)
  const pageCount = ref(0)
  const loadingGetData = ref(true)
  const loadingGetItemById = ref(false)
  const loadingDeleteItem = ref(false)
  const loadingAddItem = ref(false)
  const loadingEditItem = ref(false)

  const getData = async (params: GetAdminNudgeTemplateParams) => {
    loadingGetData.value = true

    try {
      const query: Record<string, string | number | boolean | null> = {
        'PagingDto.PageFilter.Size': params.pageSize,
        'PagingDto.PageFilter.Skip': (params.page - 1) * params.pageSize,
        'PagingDto.PageFilter.ReturnTotalRecordsCount': true,
      }

      const response = await useApiService.get<
        ApiResult<ResponseListDTO<AdminNudgeTemplateDTO>>
      >(BASE_URL, query)

      if (response.succeeded && response.data) {
        data.value = response.data.list
        totalCount.value = response.data.totalRecordsCount
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
      totalCount.value = 0
      pageCount.value = 0
      handleApiCatchError(err)
    }
    finally {
      loadingGetData.value = false
    }
  }

  const getItemById = async (id: string | number) => {
    loadingGetItemById.value = true

    try {
      const response = await useApiService.get<ApiResult<AdminNudgeTemplateDetailDTO>>(
        `${BASE_URL}/${id}`,
      )

      if (response.succeeded && response.data) {
        return response
      }

      handleApiResponseError(response)
      return response
    }
    catch (err: unknown) {
      handleApiCatchError(err)

      return createApiFailure<AdminNudgeTemplateDetailDTO>(err)
    }
    finally {
      loadingGetItemById.value = false
    }
  }

  const deleteItem = async (id: string | number) => {
    loadingDeleteItem.value = true

    try {
      const response = await useApiService.remove<ApiResult<boolean>>(
        `${BASE_URL}/${id}`,
      )

      if (response.succeeded) {
        $toast.success(`${NAME} deleted successfully!`)
      }
      else {
        handleApiResponseError(response)
      }

      return response
    }
    catch (err: unknown) {
      handleApiCatchError(err)

      return createApiFailure<boolean>(err, false)
    }
    finally {
      loadingDeleteItem.value = false
    }
  }

  const addItem = async (nudge: AddAdminNudgeTemplateDTO) => {
    loadingAddItem.value = true

    try {
      const response = await useApiService.post<ApiResult<AdminNudgeTemplateIdDTO>>(
        BASE_URL,
        { ...nudge },
      )

      if (response.succeeded) {
        $toast.success(`${NAME} created successfully!`)
      }
      else {
        handleApiResponseError(response)
      }

      return response
    }
    catch (err: unknown) {
      handleApiCatchError(err)

      return createApiFailure<AdminNudgeTemplateIdDTO>(err)
    }
    finally {
      loadingAddItem.value = false
    }
  }

  const editItem = async (nudge: EditAdminNudgeTemplateDTO, id: string | number) => {
    loadingEditItem.value = true

    try {
      const response = await useApiService.put<ApiResult<AdminNudgeTemplateIdDTO>>(
        `${BASE_URL}/${id}`,
        { ...nudge },
      )

      if (response.succeeded) {
        $toast.success(`${NAME} updated successfully!`)
      }
      else {
        handleApiResponseError(response)
      }

      return response
    }
    catch (err: unknown) {
      handleApiCatchError(err)

      return createApiFailure<AdminNudgeTemplateIdDTO>(err)
    }
    finally {
      loadingEditItem.value = false
    }
  }

  return {
    data,
    getData,
    pageCount,
    totalCount,
    loadingGetData,
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
