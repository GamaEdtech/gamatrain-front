import { useState } from 'nuxt/app'
import type { ApiResult } from '~/types/api'
import { get } from '@/composables/useApiService'

interface User {
  avatar: string
  userName: string
  firstName: string
  lastName: string
  group: number
  profileUpdated: boolean
  roles: string[]
}

export const useUser = () => {
  const user = useState<User | null>('user', () => null)

  const setUser = (data: User) => {
    user.value = data
  }

  const cleanUser = () => {
    user.value = null
  }

  interface UserResponse {
    data: {
      avatar: string
      userName: string
      firstName: string
      lastName: string
      profileUpdated: boolean
      roles: string[]
    }
  }

  const auth = useAuth()
  const getProfile = async (token?: null): Promise<ApiResult<UserResponse>> => {
    try {
      const response = await get<UserResponse>(`/api/v2/identities/profiles`, {}, {
        headers: {
          Authorization: `Bearer ${token || auth.getUserTokenV2()}`,
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

      // fallback
      return { data: null, status: 0, error }
    }
  }

  return {
    user,
    setUser,
    getProfile,
    cleanUser,
  }
}
