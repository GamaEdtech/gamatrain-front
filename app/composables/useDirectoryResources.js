import { useAsyncData } from '#app'
import { useApiService } from '~/composables/useApiService'

export const useDirectoryResources = async (context) => {
  const key = computed(() => `directory-resources:${context.value.subjectId || 'none'}`)
  const { data, pending, error, refresh } = await useAsyncData(key, () => {
    const subjectId = context.value.subjectId
    if (!subjectId) return Promise.resolve({ data: { list: [] } })
    return useApiService.get('/api/v1/tests/search', {
      is_paper: false,
      directory: true,
      lesson: subjectId,
    }, { public: true })
  })

  return {
    resourcesData: computed(() => Array.isArray(data.value?.data?.list) ? data.value.data.list : []),
    isLoadingResources: pending,
    resourceError: error,
    refreshResources: refresh,
  }
}
