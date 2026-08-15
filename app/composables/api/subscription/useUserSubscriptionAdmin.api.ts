import type {
  AdminUserSubscriptionDetailDTO,
  AdminUserSubscriptionListDTO,
  ApiResult,
  ExtendAdminUserSubscriptionDTO,
  GetAdminUserSubscriptionParams,
  GrantAdminUserSubscriptionDTO,
  GrantAdminUserSubscriptionResponseDTO,
  ResponseListDTO,
} from '@/types'

const NAME = 'User subscription'
const BASE_URL = '/api/v2/admin/subscriptions/users'

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
          'UserId': params.userId ?? null,
          'Status': params.status ?? null,
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
  }
}
