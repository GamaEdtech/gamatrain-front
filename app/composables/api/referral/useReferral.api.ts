import type {
  ApiResult,
  GetInvitedUsersParams,
  InvitedUserDTO,
  ReferralStatusDTO,
  ResponseListDTO,
} from '@/types'

const BASE_URL = '/api/v2/referral'

/** The teacher invite program (backend docs/business/referrals.md): status, joining, and the invited users. */
export const useReferral = () => {
  const { handleApiResponseError, handleApiCatchError } = useApiErrorHandler()

  const status = ref<ReferralStatusDTO | null>(null)
  const loadingStatus = ref(false)
  const loadingJoin = ref(false)
  const invitedUsers = ref<InvitedUserDTO[]>([])
  const loadingInvited = ref(false)
  const invitedTotal = ref(0)
  const invitedPageCount = ref(0)

  const getStatus = async () => {
    loadingStatus.value = true
    try {
      const response = await useApiService.get<ApiResult<ReferralStatusDTO>>(BASE_URL)
      if (response.succeeded && response.data) {
        status.value = response.data
      }
      else {
        handleApiResponseError(response)
      }
      return response
    }
    catch (err: unknown) {
      handleApiCatchError(err)
      return null
    }
    finally {
      loadingStatus.value = false
    }
  }

  /** Locks the rate for life and creates the invite code. Returns true when the caller is now a member. */
  const join = async () => {
    loadingJoin.value = true
    try {
      const response = await useApiService.post<ApiResult<ReferralStatusDTO>>(`${BASE_URL}/join`, {})
      if (response.succeeded && response.data) {
        status.value = response.data
        return true
      }
      handleApiResponseError(response, 'We could not add you to the invite program. Please try again.')
      return false
    }
    catch (err: unknown) {
      handleApiCatchError(err)
      return false
    }
    finally {
      loadingJoin.value = false
    }
  }

  const getInvitedUsers = async ({ page, pageSize }: GetInvitedUsersParams) => {
    loadingInvited.value = true
    try {
      const response = await useApiService.get<ApiResult<ResponseListDTO<InvitedUserDTO>>>(`${BASE_URL}/invited`, {
        'PagingDto.PageFilter.Size': pageSize,
        'PagingDto.PageFilter.Skip': (page - 1) * pageSize,
        'PagingDto.PageFilter.ReturnTotalRecordsCount': true,
      })
      if (response.succeeded && response.data) {
        invitedUsers.value = response.data.list
        invitedTotal.value = response.data.totalRecordsCount
        invitedPageCount.value = Math.ceil(invitedTotal.value / pageSize)
      }
      else {
        invitedUsers.value = []
        handleApiResponseError(response)
      }
    }
    catch (err: unknown) {
      invitedUsers.value = []
      handleApiCatchError(err)
    }
    finally {
      loadingInvited.value = false
    }
  }

  return {
    status,
    loadingStatus,
    getStatus,
    join,
    loadingJoin,
    invitedUsers,
    loadingInvited,
    invitedTotal,
    invitedPageCount,
    getInvitedUsers,
  }
}
