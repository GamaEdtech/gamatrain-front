import type {
  AddAdminSubscriptionFeatureDTO,
  AdminSubscriptionFeatureDTO,
  ApiResult,
  GetAdminSubscriptionFeatureParams,
  ResponseListDTO,
} from '@/types'

const NAME = 'Subscription feature'
const BASE_URL = '/api/v2/admin/subscriptions/features'

export const useSubscriptionFeatureAdmin = () => {
  const { $toast } = useNuxtApp()
  const { handleApiResponseError, handleApiCatchError, createApiFailure } = useApiErrorHandler()

  const data = ref<AdminSubscriptionFeatureDTO[]>([])
  const featureOptions = ref<AdminSubscriptionFeatureDTO[]>([])
  const totalCount = ref(0)
  const pageCount = ref(0)
  const loadingGetData = ref(true)
  const loadingGetFeatureOptions = ref(false)
  const loadingDeleteItem = ref(false)
  const loadingAddItem = ref(false)
  const loadingEditItem = ref(false)

  const getData = async (params: GetAdminSubscriptionFeatureParams) => {
    loadingGetData.value = true

    try {
      const response = await useApiService.get<
        ApiResult<ResponseListDTO<AdminSubscriptionFeatureDTO>>
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
      handleApiCatchError(err)

      data.value = []
      totalCount.value = 0
      pageCount.value = 0

      return createApiFailure<ResponseListDTO<AdminSubscriptionFeatureDTO>>(err)
    }
    finally {
      loadingGetData.value = false
    }
  }

  const getFeatureOptions = async (params: GetAdminSubscriptionFeatureParams) => {
    loadingGetFeatureOptions.value = true

    try {
      const response = await useApiService.get<
        ApiResult<ResponseListDTO<AdminSubscriptionFeatureDTO>>
      >(
        BASE_URL,
        {
          'PagingDto.PageFilter.Size': params.pageSize,
          'PagingDto.PageFilter.Skip': (params.page - 1) * params.pageSize,
          'PagingDto.PageFilter.ReturnTotalRecordsCount': true,
        },
      )

      if (response.succeeded && response.data) {
        featureOptions.value = response.data.list
      }
      else {
        featureOptions.value = []
        handleApiResponseError(response)
      }

      return response
    }
    catch (err: unknown) {
      handleApiCatchError(err)

      featureOptions.value = []

      return createApiFailure<ResponseListDTO<AdminSubscriptionFeatureDTO>>(err)
    }
    finally {
      loadingGetFeatureOptions.value = false
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

  const addItem = async (subscriptionFeature: AddAdminSubscriptionFeatureDTO) => {
    loadingAddItem.value = true

    try {
      const response = await useApiService.post<ApiResult<boolean>>(
        BASE_URL,
        { ...subscriptionFeature },
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
    subscriptionFeature: AddAdminSubscriptionFeatureDTO,
    id: string | number,
  ) => {
    loadingEditItem.value = true

    try {
      const response = await useApiService.put<ApiResult<boolean>>(
        `${BASE_URL}/${id}`,
        { ...subscriptionFeature },
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
    featureOptions,
    getData,
    getFeatureOptions,
    loadingGetFeatureOptions,
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
