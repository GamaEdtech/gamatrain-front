// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface CoinTransaction {
  amount: number
  type: 'debit' | 'credit'
  description: string
}

export const useCoinBalance = () => {
  const balance = ref<number>(0)
  const isLoading = ref<boolean>(false)
  const error = ref<string | null>(null)
  const auth = useAuth()

  /**
   * Fetch user's current coin balance
   */
  const fetchBalance = async (): Promise<number> => {
    // Check authentication first
    if (!auth.isAuthenticated.value) {
      error.value = 'User not authenticated'
      return 0
    }

    isLoading.value = true
    error.value = null

    try {
      const response = await useApiService.get<{ data: number }>('/api/v2/transactions/balance')
      balance.value = response.data || 0
      return balance.value
    }
    catch (err: unknown) {
      error.value = (err as Error)?.message || 'Failed to fetch balance'
      console.error('Error fetching coin balance:', err)
      return 0
    }
    finally {
      isLoading.value = false
    }
  }

  /**
   * Consume coins via API call
   */
  const consumeCoins = async (points: number): Promise<boolean> => {
    // Check authentication first
    if (!auth.isAuthenticated.value) {
      error.value = 'User not authenticated'
      return false
    }

    isLoading.value = true
    error.value = null

    try {
      await useApiService.post('/api/v2/game/coins/consume', {
        points,
      })

      // If successful, refresh the balance
      await fetchBalance()

      console.log(`Successfully consumed ${points} coins`)
      return true
    }
    catch (err: unknown) {
      error.value = (err as Error)?.message || 'Failed to consume coins'
      console.error('Error consuming coins:', err)
      return false
    }
    finally {
      isLoading.value = false
    }
  }

  /**
   * Deduct coins using the consume API
   */
  const deductCoins = async (amount: number, description: string = 'File download'): Promise<boolean> => {
    // Check authentication first
    if (!auth.isAuthenticated.value) {
      error.value = 'User not authenticated'
      return false
    }

    isLoading.value = true
    error.value = null

    try {
      // Check if user has sufficient balance
      if (balance.value < amount) {
        error.value = 'Insufficient balance'
        return false
      }

      // Call the consume coins API
      const success = await consumeCoins(amount)

      if (success) {
        console.log(`Successfully deducted ${amount} coins for ${description}`)
        return true
      }

      return false
    }
    catch (err: unknown) {
      error.value = (err as Error)?.message || 'Failed to process payment'
      console.error('Error processing coin payment:', err)
      return false
    }
    finally {
      isLoading.value = false
    }
  }

  /**
   * Check if user has sufficient balance
   */
  const hasSufficientBalance = (requiredAmount: number): boolean => {
    return balance.value >= requiredAmount
  }

  /**
   * Check if a file requires coin payment (2025 files)
   */
  const requiresCoinPayment = (contentData: Record<string, unknown>): boolean => {
    if (!contentData) return false

    // Check if the file is from 2025
    const eduYear = contentData.edu_year
    return eduYear === 2025 || eduYear === '2025'
  }

  return {
    balance: readonly(balance),
    isLoading: readonly(isLoading),
    error: readonly(error),
    fetchBalance,
    consumeCoins,
    deductCoins,
    hasSufficientBalance,
    requiresCoinPayment,
  }
}
