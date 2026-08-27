export const useUserPermissions = () => {
  const { user } = useUser()

  const canAddEducationalContent = computed(() => user.value?.roles?.includes('Teacher') ?? false)

  return {
    canAddEducationalContent,
  }
}
