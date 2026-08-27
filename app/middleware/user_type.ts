export default defineNuxtRouteMiddleware(() => {
  const { user } = useUser()

  if (user.value?.roles.includes('Teacher') || user.value?.roles.includes('Student'))
    return
  else
    return navigateTo('/user/type')
})
