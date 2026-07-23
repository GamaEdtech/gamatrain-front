import type {
  AddAdminSubscriptionPlanDTO,
  AdminSubscriptionPlanDTO,
  ApiResult,
  AppError,
  GetAdminSubscriptionPlanParams,
  ResponseListDTO,
} from '@/types'

const data = ref<AdminSubscriptionPlanDTO[]>([])
const totalCount = ref(0)
const pageCount = ref(0)
const loadingGetData = ref(true)
const loadingGetItemById = ref(false)
const loadingDeleteItem = ref(false)
const loadingAddItem = ref(false)
const loadingEditItem = ref(false)

const NAME = 'Subscription plan'
const BASE_URL = '/api/v2/admin/subscriptions/plans'

export const useSubscriptionPlanAdmin = () => {
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

      return response
    }
    catch (err: unknown) {
      handleError(err)

      data.value = []
      totalCount.value = 0
      pageCount.value = 0

      return {
        succeeded: false,
        status: 0,
        data: null,
      }
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
        `${BASE_URL}/${id}`,
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
        showResponseError(response)
      }

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
