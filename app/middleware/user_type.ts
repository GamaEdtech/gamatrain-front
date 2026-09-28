export default defineNuxtRouteMiddleware(() => {
  const { hasChosenUserType } = useUserPermissions()

  if (hasChosenUserType.value)
    return
  else
    return navigateTo('/user/type')
})
