import { defineNuxtRouteMiddleware } from 'nuxt/app'

export default defineNuxtRouteMiddleware(() => {
  const { user } = useUser()

  const roles = user.value?.roles || []
  const isAdmin = roles.some(
    role => role.toLowerCase() === 'admin',
  )

  if (!isAdmin) {
    showError({
      statusCode: 403,
      statusMessage: 'Access Denied!',
    })
  }
})
