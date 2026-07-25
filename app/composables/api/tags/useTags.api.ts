import type {
  ApiResult,
  TagTypeDTO,
  TagDTO,
} from '@/types'

const data = ref<TagDTO[]>([])
const loadingGetData = ref(true)

export const useTags = () => {
  const { handleApiResponseError, handleApiCatchError } = useApiErrorHandler()

  const getData = async (type: TagTypeDTO) => {
    loadingGetData.value = true
    try {
      const response = await useApiService.get<
        ApiResult<TagDTO[]>
      >(`/api/v2/tags/${type}`)

      if (response.succeeded && response.data) {
        data.value = response.data
      }
      else {
        data.value = []
        handleApiResponseError(response)
      }
    }
    catch (err: unknown) {
      data.value = []
      handleApiCatchError(err)
    }
    finally {
      loadingGetData.value = false
    }
  }

  return { loadingGetData, data, getData }
}
