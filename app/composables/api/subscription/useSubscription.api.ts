import type {
  ApiResult,
  UpgradeSuggestionsDTO,
} from '@/types'

export const useSubscription = () => {
  const { handleApiResponseError, handleApiCatchError } = useApiErrorHandler()

  const data = ref<UpgradeSuggestionsDTO[]>([])
  const loadingGetData = ref(true)

  const getData = async () => {
    loadingGetData.value = true
    try {
      const response = await useApiService.get<
        ApiResult<UpgradeSuggestionsDTO[]>
      >(`/api/v2/subscriptions/plans`)

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
