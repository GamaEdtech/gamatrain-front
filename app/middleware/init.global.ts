import { defineNuxtRouteMiddleware, navigateTo, useState } from 'nuxt/app'

interface User {
  avatar: string
  userName: string
  firstName: string
  lastName: string
  group: string
  profileUpdated: boolean
  roles: string[]
}

export default defineNuxtRouteMiddleware(async (to) => {
  const { getProfile, setUser } = useUser()
  const { isAuthenticated } = useAuth()

  const hasFetchedUserInfo = useState<boolean>(
    'hasFetchedUserInfo',
    () => false,
  )

  if (!hasFetchedUserInfo.value && isAuthenticated.value) {
    const result = await getProfile()
    if (result.data) {
      const data = result.data.data as Partial<User>
      setUser({
        avatar: data.avatar ?? '',
        userName: data.userName ?? '',
        firstName: data.firstName ?? '',
        lastName: data.lastName ?? '',
        group: data.group ?? '',
        profileUpdated: data.profileUpdated ?? false,
        roles: data.roles ?? [],
      })
      hasFetchedUserInfo.value = true
    }

    if ((result.status === 401 || result.status === 403) && to.path.startsWith('/user')) {
      return navigateTo('/')
    }
  }
})
