import { defineNuxtRouteMiddleware, navigateTo } from 'nuxt/app'
import { useAuth } from '~/composables/useAuth'

export default defineNuxtRouteMiddleware((to) => {
  const { isAuthenticated } = useAuth()

  if (!isAuthenticated.value) {
    // Open the sign-in dialog on home and bring the user back to this page once they have signed in,
    // instead of silently dropping them on home and losing the link they opened.
    return navigateTo({
      path: '/',
      query: { auth_form: 'login', [AUTH_REDIRECT_QUERY_KEY]: to.fullPath },
    })
  }
})
