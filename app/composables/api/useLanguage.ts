import type {
  ApiResult,
  AppError,
  AdminLanguageDTO,
} from '~/types/api'

const data = ref<AdminLanguageDTO[]>([])
const loadingGetData = ref(false)

export const useLanguage = () => {
  const { $toast } = useNuxtApp()

  const getData = async () => {
    loadingGetData.value = true
    try {
      const response = await useApiService.get<
        ApiResult<AdminLanguageDTO[]>
      >('/api/v2/languages')
      if (response.data) {
        data.value = response.data
      }
      else {
        data.value = []
      }
    }
    catch (err: unknown) {
      const error = err as AppError
      if (error.response?.status === 400) {
        $toast.error(error.response.data?.message || '')
      }
    }
    finally {
      loadingGetData.value = false
    }
  }

  return { loadingGetData, data, getData }
}
