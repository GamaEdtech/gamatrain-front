import type {
  ApiResult,
  AppError,
  BoardDTO,
} from '~/types/api'

const data = ref<BoardDTO[]>()
const loadingGetData = ref(true)

export const useBoard = () => {
  const { $toast } = useNuxtApp()

  const getData = async () => {
    loadingGetData.value = true
    try {
      const response = await useApiService.get<
        ApiResult<BoardDTO[]>
      >('/api/v2/boards', undefined, { public: true })
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
