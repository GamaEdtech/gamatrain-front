import { defineNuxtRouteMiddleware } from 'nuxt/app'

export default defineNuxtRouteMiddleware(() => {
  const { user } = useUser()

  const roles = user.value?.roles || []
  const hasFinanceRole = roles.some(
    role => role.toLowerCase() === 'finance',
  )

  if (!hasFinanceRole) {
    return showError({
      statusCode: 403,
      statusMessage: 'Access Denied!',
    })
  }
})
