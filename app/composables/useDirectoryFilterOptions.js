import { getDirectoryPaperSessions, PAST_PAPER_YEAR_OPTIONS } from '~/constants/pastpaper/sessions'
import { useApiService } from '~/composables/useApiService'
import { getDirectoryVariantOptions } from '~/utils/directoryFilterOptions'

// Directory catalogue loading is kept outside the shared filter presentation.
export const useDirectoryFilterOptions = (context) => {
  const catalogues = reactive({})
  const loading = reactive({})
  const errors = reactive({})
  const requests = new Map()
  const catalogueKey = key => key === 'paper' ? `papers:${context.boardId}` : 'variants'

  const optionLists = computed(() => ({
    year: PAST_PAPER_YEAR_OPTIONS,
    series: getDirectoryPaperSessions(context.gradeId),
    paper: catalogues[catalogueKey('paper')] || [],
    variant: catalogues.variants || [],
  }))
  const optionLoading = computed(() => ({
    paper: Boolean(loading[catalogueKey('paper')]),
    variant: Boolean(loading.variants),
  }))
  const optionErrors = computed(() => ({
    paper: errors[catalogueKey('paper')] || '',
    variant: errors.variants || '',
  }))

  const fetchOptions = async (filter) => {
    if (!['paper', 'variant'].includes(filter) || !context.subjectId) return
    if (filter === 'paper' && !context.boardId) return
    const key = catalogueKey(filter)
    if (catalogues[key]) return
    if (requests.has(key)) return requests.get(key)

    loading[key] = true
    errors[key] = ''
    const params = filter === 'paper'
      ? { type: 'test_type', section_id: context.boardId }
      : { type: 'variant' }
    const request = (async () => {
      try {
        const response = await useApiService.get('/api/v1/types/list', params, { public: true })
        if (Number(response?.status) !== 1 || !Array.isArray(response.data)) throw new Error('Invalid options')
        catalogues[key] = filter === 'paper'
          ? response.data.filter(item => item.is_paper === true || item.is_paper === '1' || item.is_paper === 1)
          : getDirectoryVariantOptions(response.data)
      }
      catch {
        errors[key] = 'Unable to load options. Please try again.'
      }
      finally {
        loading[key] = false
        requests.delete(key)
      }
    })()
    requests.set(key, request)
    return request
  }

  let mounted = false
  const preloadOptions = () => Promise.all(['paper', 'variant'].map(fetchOptions))
  onMounted(() => {
    mounted = true
    preloadOptions()
  })
  watch(() => [context.subjectId, context.boardId], () => {
    if (mounted) preloadOptions()
  })

  return { optionLists, optionLoading, optionErrors, fetchOptions }
}
