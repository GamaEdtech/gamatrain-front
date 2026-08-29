import type {
  AdminUserSubscriptionDetailDTO,
  AdminUserSubscriptionListDTO,
  AdminSubscriptionUsageAggregateDTO,
  AdminSubscriptionUsageDTO,
  ApiResult,
  ExtendAdminUserSubscriptionDTO,
  GetAdminSubscriptionUsageAggregateParams,
  GetAdminSubscriptionUsageParams,
  GetAdminUserSubscriptionParams,
  GrantAdminUserSubscriptionDTO,
  GrantAdminUserSubscriptionResponseDTO,
  ResponseListDTO,
} from '@/types'

const NAME = 'User subscription'
const BASE_URL = '/api/v2/admin/subscriptions/users'
const USAGE_BASE_URL = '/api/v2/admin/subscriptions/usage'

export const useUserSubscriptionAdmin = () => {
  const { $toast } = useNuxtApp()
  const { handleApiResponseError, handleApiCatchError, createApiFailure } = useApiErrorHandler()

  const data = ref<AdminUserSubscriptionListDTO[]>([])
  const totalCount = ref(0)
  const pageCount = ref(0)
  const loadingGetData = ref(true)
  const loadingGetItemById = ref(false)
  const loadingGrantItem = ref(false)
  const loadingRevokeItem = ref(false)
  const loadingExtendItem = ref(false)
  const usageData = ref<AdminSubscriptionUsageDTO[]>([])
  const usageTotalCount = ref(0)
  const usagePageCount = ref(0)
  const loadingGetUsageData = ref(false)
  const usageAggregateData = ref<AdminSubscriptionUsageAggregateDTO[]>([])
  const loadingGetUsageAggregateData = ref(false)

  const getData = async (params: GetAdminUserSubscriptionParams) => {
    loadingGetData.value = true

    try {
      const response = await useApiService.get<
        ApiResult<ResponseListDTO<AdminUserSubscriptionListDTO>>
      >(
        BASE_URL,
        {
          'PagingDto.PageFilter.Size': params.pageSize,
          'PagingDto.PageFilter.Skip': (params.page - 1) * params.pageSize,
          'PagingDto.PageFilter.ReturnTotalRecordsCount': true,
          'UserId': params.userId || null,
          'Status': params.status || null,
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

      return createApiFailure<ResponseListDTO<AdminUserSubscriptionListDTO>>(err)
    }
    finally {
      loadingGetData.value = false
    }
  }

  const getItemById = async (id: string | number) => {
    loadingGetItemById.value = true

    try {
      const response = await useApiService.get<ApiResult<AdminUserSubscriptionDetailDTO>>(
        `${BASE_URL}/${id}`,
      )

      if (!response.succeeded) {
        handleApiResponseError(response)
      }

      return response
    }
    catch (err: unknown) {
      handleApiCatchError(err)

      return createApiFailure<AdminUserSubscriptionDetailDTO>(err)
    }
    finally {
      loadingGetItemById.value = false
    }
  }

  const grantItem = async (payload: GrantAdminUserSubscriptionDTO) => {
    loadingGrantItem.value = true

    try {
      const response = await useApiService.post<ApiResult<GrantAdminUserSubscriptionResponseDTO>>(
        `${BASE_URL}/grant`,
        { ...payload },
      )

      if (response.succeeded) {
        $toast.success(`${NAME} granted successfully!`)
      }
      else {
        handleApiResponseError(response)
      }

      return response
    }
    catch (err: unknown) {
      handleApiCatchError(err)

      return createApiFailure<GrantAdminUserSubscriptionResponseDTO>(err)
    }
    finally {
      loadingGrantItem.value = false
    }
  }

  const revokeItem = async (id: string | number) => {
    loadingRevokeItem.value = true

    try {
      const response = await useApiService.post<ApiResult<boolean>>(
        `${BASE_URL}/${id}/revoke`,
      )

      if (response.succeeded) {
        $toast.success(`${NAME} revoked successfully!`)
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
      loadingRevokeItem.value = false
    }
  }

  const extendItem = async (
    id: string | number,
    payload: ExtendAdminUserSubscriptionDTO,
  ) => {
    loadingExtendItem.value = true

    try {
      const response = await useApiService.post<ApiResult<boolean>>(
        `${BASE_URL}/${id}/extend`,
        { ...payload },
      )

      if (response.succeeded) {
        $toast.success(`${NAME} extended successfully!`)
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
      loadingExtendItem.value = false
    }
  }

  const getUsageData = async (params: GetAdminSubscriptionUsageParams) => {
    loadingGetUsageData.value = true

    try {
      const query: Record<string, string | number | boolean | null> = {
        'PagingDto.PageFilter.Size': params.pageSize,
        'PagingDto.PageFilter.Skip': (params.page - 1) * params.pageSize,
        'PagingDto.PageFilter.ReturnTotalRecordsCount': true,
        'UserId': params.userId || null,
        'FeatureCode': params.featureCode || null,
        'IdentifierId': params.identifierId || null,
        'FromDate': params.fromDate || null,
        'ToDate': params.toDate || null,
      }

      params.sortFilter?.forEach((sortOption, index) => {
        query[`PagingDto.SortFilter[${index}].sortType`] = sortOption.sortType
        query[`PagingDto.SortFilter[${index}].column`] = sortOption.column
      })

      params.searchFilter?.forEach((searchOption, index) => {
        query[`PagingDto.SearchFilter[${index}].phrase`] = searchOption.phrase
        query[`PagingDto.SearchFilter[${index}].column`] = searchOption.column
      })

      const response = await useApiService.get<
        ApiResult<ResponseListDTO<AdminSubscriptionUsageDTO>>
      >(
        USAGE_BASE_URL,
        query,
      )

      if (response.succeeded && response.data) {
        usageData.value = response.data.list
        usageTotalCount.value = response.data.totalRecordsCount
        usagePageCount.value = Math.ceil(usageTotalCount.value / params.pageSize)
      }
      else {
        usageData.value = []
        usageTotalCount.value = 0
        usagePageCount.value = 0
        handleApiResponseError(response)
      }

      return response
    }
    catch (err: unknown) {
      usageData.value = []
      usageTotalCount.value = 0
      usagePageCount.value = 0

      handleApiCatchError(err)

      return createApiFailure<ResponseListDTO<AdminSubscriptionUsageDTO>>(err)
    }
    finally {
      loadingGetUsageData.value = false
    }
  }

  const getUsageAggregateData = async (
    params: GetAdminSubscriptionUsageAggregateParams = {},
  ) => {
    loadingGetUsageAggregateData.value = true

    try {
      const response = await useApiService.get<
        ApiResult<AdminSubscriptionUsageAggregateDTO[]>
      >(
        `${USAGE_BASE_URL}/aggregate`,
        {
          UserId: params.userId || null,
          FromDate: params.fromDate || null,
          ToDate: params.toDate || null,
        },
      )

      if (response.succeeded && response.data) {
        usageAggregateData.value = response.data
      }
      else {
        usageAggregateData.value = []
        handleApiResponseError(response)
      }

      return response
    }
    catch (err: unknown) {
      usageAggregateData.value = []

      handleApiCatchError(err)

      return createApiFailure<AdminSubscriptionUsageAggregateDTO[]>(err, [])
    }
    finally {
      loadingGetUsageAggregateData.value = false
    }
  }

  return {
    data,
    totalCount,
    pageCount,
    loadingGetData,
    getData,
    loadingGetItemById,
    getItemById,
    loadingGrantItem,
    grantItem,
    loadingRevokeItem,
    revokeItem,
    loadingExtendItem,
    extendItem,
    usageData,
    usageTotalCount,
    usagePageCount,
    loadingGetUsageData,
    getUsageData,
    usageAggregateData,
    loadingGetUsageAggregateData,
    getUsageAggregateData,
  }
}
