export const useUserPermissions = () => {
  const { user } = useUser()

  const canAddEducationalContent = computed(() => user.value?.roles?.includes('Teacher') ?? false)

  const hasChosenUserType = computed(() =>
    (user.value?.roles?.includes('Teacher') || user.value?.roles?.includes('Student')) ?? false,
  )

  return {
    canAddEducationalContent,
    hasChosenUserType,
  }
}
