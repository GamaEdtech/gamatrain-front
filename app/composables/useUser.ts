import { useState } from 'nuxt/app'
import type { ApiResult, User } from '@/types'

export const useUser = () => {
  const hasFetched = useState('hasFetchedUser', () => false)
  const user = useState<User | null>('user', () => null)
  const auth = useAuth()

  const setUser = (data: User) => {
    user.value = data
  }

  const cleanUser = () => {
    user.value = null
  }

  const getProfile = async (token?: null | string) => {
    try {
      const response = await useApiService.get<ApiResult<User>>(`/api/v2/identities/profiles`, {}, {
        headers: {
          Authorization: `Bearer ${token || auth.getUserToken()}`,
        },
      })

      return { data: response, status: 200 }
    }
    catch (error: unknown) {
      if (error && typeof error === 'object' && 'status' in error) {
        return {
          data: null,
          status: (error as { status: number }).status,
          error,
        }
      }

      return { data: null, status: 0, error }
    }
  }

  return {
    user,
    hasFetched,
    setUser,
    getProfile,
    cleanUser,
  }
}
