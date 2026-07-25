import type {
  AddAdminSubscriptionGatewayMappingDTO,
  AdminSubscriptionGatewayMappingDTO,
  ApiResult,
  GetAdminSubscriptionGatewayMappingParams,
  ResponseListDTO,
} from '@/types'

const data = ref<AdminSubscriptionGatewayMappingDTO[]>([])
const totalCount = ref(0)
const pageCount = ref(0)
const loadingGetData = ref(true)
const loadingDeleteItem = ref(false)
const loadingAddItem = ref(false)
const loadingEditItem = ref(false)

const NAME = 'Subscription gateway mapping'
const BASE_URL = '/api/v2/admin/subscriptions/gateway-mappings'

export const useSubscriptionGatewayMappingAdmin = () => {
  const { $toast } = useNuxtApp()
  const { handleApiResponseError, handleApiCatchError, createApiFailure } = useApiErrorHandler()

  const getData = async (params: GetAdminSubscriptionGatewayMappingParams) => {
    loadingGetData.value = true

    try {
      const response = await useApiService.get<
        ApiResult<ResponseListDTO<AdminSubscriptionGatewayMappingDTO>>
      >(
        BASE_URL,
        {
          'PagingDto.PageFilter.Size': params.pageSize,
          'PagingDto.PageFilter.Skip': (params.page - 1) * params.pageSize,
          'PagingDto.PageFilter.ReturnTotalRecordsCount': true,
        },
      )

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

      return response
    }
    catch (err: unknown) {
      data.value = []
      totalCount.value = 0
      pageCount.value = 0

      handleApiCatchError(err)

      return createApiFailure<ResponseListDTO<AdminSubscriptionGatewayMappingDTO>>(err)
    }
    finally {
      loadingGetData.value = false
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

  const addItem = async (
    gatewayMapping: AddAdminSubscriptionGatewayMappingDTO,
  ) => {
    loadingAddItem.value = true

    try {
      const response = await useApiService.post<ApiResult<boolean>>(
        BASE_URL,
        { ...gatewayMapping },
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

      return createApiFailure<boolean>(err, false)
    }
    finally {
      loadingAddItem.value = false
    }
  }

  const editItem = async (
    gatewayMapping: AddAdminSubscriptionGatewayMappingDTO,
    id: string | number,
  ) => {
    loadingEditItem.value = true

    try {
      const response = await useApiService.put<ApiResult<boolean>>(
        `${BASE_URL}/${id}`,
        { ...gatewayMapping },
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

      return createApiFailure<boolean>(err, false)
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
    deleteItem,
    loadingDeleteItem,
    addItem,
    loadingAddItem,
    editItem,
    loadingEditItem,
  }
}
