import type {
  ApiResult,
  AppError,
  TagTypeDTO,
  TagDTO,
} from '~/types/api'

const data = ref<TagDTO[]>([])
const loadingGetData = ref(true)

export const useTags = () => {
  const { $toast } = useNuxtApp()

  const getData = async (type: TagTypeDTO) => {
    loadingGetData.value = true
    try {
      const response = await useApiService.get<
        ApiResult<TagDTO[]>
      >(`/api/v2/tags/${type}`)
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
