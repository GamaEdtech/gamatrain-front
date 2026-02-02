import { defineNuxtRouteMiddleware, navigateTo } from 'nuxt/app'

export default defineNuxtRouteMiddleware(() => {
  const { user } = useUser()

  if (!user.value) {
    return navigateTo('/')
  }

  const roles = user.value.roles || []

  const isAdmin = roles.some(
    role => role.toLowerCase() === 'admin',
  )

  if (!isAdmin) {
    return navigateTo('/')
  }
})
