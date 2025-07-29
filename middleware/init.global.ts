import { defineNuxtRouteMiddleware, navigateTo, useState } from 'nuxt/app'
import { useUser } from '@/composables/useUser'
import { useAuth } from '@/composables/useAuth'

interface UserResponse {
  data: {
    id: string
    username: string
    first_name: string
    last_name: string
    avatar: string
    sex: string | null
    active: string
    credit: string
    group_id: number
    section: string | null
    base: string | null
    course: string | null
    area: string | null
    school: string | null
    score_check_info: string
    state: string | null
    city: string | null
  }
}

interface ErrorResponse {
  response?: {
    status: number
    data?: {
      message: string
    }
  }
}

export default defineNuxtRouteMiddleware(async (to) => {
  const auth = useAuth()
  const authToken = auth.getUserToken()

  // Skip if no token
  if (!authToken) {
    if (to.path.startsWith('/user')) {
      return navigateTo('/')
    }
    return
  }

  const hasFetchedUserInfo = useState<boolean>(
    'hasFetchedUserInfo',
    () => false,
  )

  if (!hasFetchedUserInfo.value) {
    try {
      const response = await $fetch<UserResponse>(`/api/v1/users/info`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      })

      if (response && response.data) {
        const { setUser } = useUser()
        setUser(response.data)
        hasFetchedUserInfo.value = true // Mark as fetched
      }
      else if (to.path.startsWith('/user')) {
        return navigateTo('/')
      }
    }
    catch (error) {
      const status = (error as ErrorResponse)?.response?.status
      if ((status === 401 || status === 403) && to.path.startsWith('/user')) {
        return navigateTo('/')
      }
    }
  }
})
