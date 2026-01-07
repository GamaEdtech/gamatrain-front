import type { ApiResult } from '~/types/api'

const balance = ref<number>(0)
const isLoading = ref<boolean>(false)

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

  const consumeCoins = async (points: number, description: string) => {
    console.log(description)

    if (balance.value < points) {
      return {
        succeeded: false,
        message: 'Insufficient balance',
      }
    }
    isLoading.value = true

    try {
      await useApiService.post('/api/v2/games/spends', {
        points,
      })
      await fetchBalance()

      return {
        succeeded: true,
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
