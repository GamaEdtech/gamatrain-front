import type {
  AddAdminSubscriptionPlanDTO,
  AdminSubscriptionPlanDTO,
  ApiResult,
  EditAdminSubscriptionPlanFeaturesDTO,
  GetAdminSubscriptionPlanParams,
  ResponseListDTO,
} from '@/types'

const planFeatures = ref<AdminSubscriptionPlanDTO['features']>([])
const totalCount = ref(0)
const pageCount = ref(0)
const loadingGetItemById = ref(false)
const loadingDeleteItem = ref(false)
const loadingAddItem = ref(false)
const loadingEditItem = ref(false)
const loadingGetFeatures = ref(false)
const loadingEditFeatures = ref(false)

const NAME = 'Subscription plan'
const BASE_URL = '/api/v2/admin/subscriptions/plans'

export const useSubscriptionPlanAdmin = () => {
  const { $toast } = useNuxtApp()
  const { handleApiResponseError, handleApiCatchError, createApiFailure } = useApiErrorHandler()
  const data = ref<AdminSubscriptionPlanDTO[]>([])
  const loadingGetData = ref(true)

  const getData = async (params: GetAdminSubscriptionPlanParams) => {
    loadingGetData.value = true

    try {
      const response = await useApiService.get<
        ApiResult<ResponseListDTO<AdminSubscriptionPlanDTO>>
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

      return createApiFailure<ResponseListDTO<AdminSubscriptionPlanDTO>>(err)
    }
    finally {
      loadingGetData.value = false
    }
  }

  const getItemById = async (id: string | number) => {
    loadingGetItemById.value = true

    try {
      const response = await useApiService.get<ApiResult<AdminSubscriptionPlanDTO>>(
        `${BASE_URL}/${id}`,
      )
      if (!response.succeeded) {
        handleApiResponseError(response)
      }

      return response
    }
    catch (err: unknown) {
      handleApiCatchError(err)

      return createApiFailure<AdminSubscriptionPlanDTO>(err)
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

  const addItem = async (subscriptionPlan: AddAdminSubscriptionPlanDTO) => {
    loadingAddItem.value = true

    try {
      const response = await useApiService.post<ApiResult<number>>(
        BASE_URL,
        { ...subscriptionPlan },
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
    subscriptionPlan: AddAdminSubscriptionPlanDTO,
    id: string | number,
  ) => {
    loadingEditItem.value = true

    try {
      const response = await useApiService.put<ApiResult<boolean>>(
        `${BASE_URL}/${id}`,
        { ...subscriptionPlan },
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

  const getFeatures = async (id: string | number) => {
    loadingGetFeatures.value = true

    try {
      const response = await useApiService.get<ApiResult<AdminSubscriptionPlanDTO['features']>>(
        `${BASE_URL}/${id}/features`,
      )

      if (response.succeeded && response.data) {
        planFeatures.value = response.data
      }
      else {
        planFeatures.value = []
        handleApiResponseError(response)
      }

      return response
    }
    catch (err: unknown) {
      planFeatures.value = []

      handleApiCatchError(err)

      return createApiFailure<AdminSubscriptionPlanDTO>(err)
    }
    finally {
      loadingGetFeatures.value = false
    }
  }

  const editFeatures = async (
    id: string | number,
    payload: EditAdminSubscriptionPlanFeaturesDTO,
  ) => {
    loadingEditFeatures.value = true

    try {
      const response = await useApiService.put<ApiResult<boolean>>(
        `${BASE_URL}/${id}/features`,
        { ...payload },
      )

      if (response.succeeded) {
        $toast.success(`${NAME} features updated successfully!`)
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
      loadingEditFeatures.value = false
    }
  }

  return {
    loadingGetData,
    data,
    planFeatures,
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
    getFeatures,
    loadingGetFeatures,
    editFeatures,
    loadingEditFeatures,
  }
}
