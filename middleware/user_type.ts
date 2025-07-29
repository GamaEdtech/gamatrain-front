import { useUser } from '~/composables/useUser'
import { defineNuxtRouteMiddleware, navigateTo } from 'nuxt/app'

export default defineNuxtRouteMiddleware(() => {
  const { user } = useUser()

  if (user.value?.group_id) {
    if (user.value.group_id == '3') {
      return navigateTo('/test-maker')
    }
    else if (user.value.group_id == '5' || user.value.group_id == '6') {
      return
    }
    else {
      return navigateTo('/user/type')
    }
  }
})
