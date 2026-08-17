import type { ApiResult, SpendPointsResponseDTO } from '@/types'

const balance = ref<number>(0)
const isLoading = ref<boolean>(true)

export const useCoinBalance = () => {
  const { isAuthenticated } = useAuth()

  const fetchBalance = async () => {
    isLoading.value = true

    try {
      const response = await useApiService.get<ApiResult<number>>('/api/v2/transactions/balance')
      balance.value = response.data || 0
      return {
        succeeded: true,
        data: balance.value,
        message: 'Balance get Successfully',
      }
    }
    catch (err: unknown) {
      const error = (err as Error)?.message || 'Failed to fetch balance'
      return {
        succeeded: false,
        message: error,
      }
    }
    finally {
      isLoading.value = false
    }
  }

  const consumeCoins = async (points: number, contentType: string = 'PastPaper', identifierId: number, description: string) => {
    console.log(description)

    if (balance.value < points) {
      return {
        succeeded: false,
        message: 'Insufficient balance',
      }
    }
    isLoading.value = true

    try {
      // games/spends is genuinely dual-versioned server-side (v1.0 -> plain bool, v2.0 -> the richer
      // SpendPointsResponseViewModel with reason/currentPlanTitle, gamatrain-back#575) - but useApiService's
      // "/api/v2/" here only selects which backend host to call, not which server-side API version; with
      // this repo's current NUXT_PROXY_API2_BASE_URL (already rooted at .../api/v1) the request that
      // actually goes out is the v1.0 route, so `data` comes back as a bare boolean, not an object. Handled
      // for both shapes rather than assumed, since that routing is environment-dependent, not this call's to fix.
      const response = await useApiService.post<ApiResult<boolean | SpendPointsResponseDTO>>('/api/v2/games/spends', {
        points,
        identifierId,
        contentType,
      })
      await fetchBalance()

      const spent = typeof response.data === 'boolean' ? response.data : (response.data?.spent ?? false)

      if (!response.succeeded || !spent) {
        return {
          succeeded: false,
          message: response.errors?.[0]?.message || 'Failed to consume coins',
          data: response.data,
        }
      }

      return {
        succeeded: true,
        data: response.data,
      }
    }
    catch (err: unknown) {
      const error = (err as Error)?.message || 'Failed to consume coins'
      console.error('Error consuming coins:', err)
      return {
        succeeded: false,
        message: error,
      }
    }
    finally {
      isLoading.value = false
    }
  }

  const resetBalance = () => {
    balance.value = 0
  }

  watch(() =>
    isAuthenticated.value,
  async (isAuth) => {
    if (isAuth) {
      await fetchBalance()
    }
    else {
      resetBalance()
    }
  },
  )

  return {
    balance: readonly(balance),
    isLoading: readonly(isLoading),
    fetchBalance,
    consumeCoins,
  }
}
