import type {
  ApiResult,
  AppError,
  LocationItemDTO,
  ResponseListDTO,
} from '@/types'

const countries = ref<LocationItemDTO[]>([])
const states = ref<LocationItemDTO[]>([])
const cities = ref<LocationItemDTO[]>([])
const loadingCountries = ref(false)
const loadingStates = ref(false)
const loadingCities = ref(false)

export const useLocation = () => {
  const { $toast } = useNuxtApp()

  const getCountries = async () => {
    try {
      loadingCountries.value = true

      const response = await useApiService.get<
        ApiResult<ResponseListDTO<LocationItemDTO>>
      >(
        '/api/v2/locations/countries',
        {
          'PagingDto.PageFilter.Size': 10000,
        },
      )

      if (response.data) {
        countries.value = response.data.list
      }
      else {
        countries.value = []
      }

      return response
    }
    catch (err: unknown) {
      const error = err as AppError

      if (error.response?.status === 400) {
        $toast.error(error.response.data?.message || '')
      }

      countries.value = []

      return {
        succeeded: false,
        message: 'The operation failed. Please try again later.',
        data: {},
      }
    }
    finally {
      loadingCountries.value = false
    }
  }

  const resetCountries = () => {
    countries.value = []
  }

  const getStates = async (countryId: number | string) => {
    try {
      loadingStates.value = true

      const response = await useApiService.get<
        ApiResult<ResponseListDTO<LocationItemDTO>>
      >(
        `/api/v2/locations/states/${countryId}`,
        {
          'PagingDto.PageFilter.Size': 10000,
        },
      )

      if (response.data) {
        states.value = response.data.list
      }
      else {
        states.value = []
      }

      return response
    }
    catch (err: unknown) {
      const error = err as AppError

      if (error.response?.status === 400) {
        $toast.error(error.response.data?.message || '')
      }

      states.value = []

      return {
        succeeded: false,
        message: 'The operation failed. Please try again later.',
        data: {},
      }
    }
    finally {
      loadingStates.value = false
    }
  }

  const resetStates = () => {
    states.value = []
  }

  const getCities = async (stateId: number | string) => {
    try {
      loadingCities.value = true

      const response = await useApiService.get<
        ApiResult<ResponseListDTO<LocationItemDTO>>
      >(
        `/api/v2/locations/cities/${stateId}`,
        {
          'PagingDto.PageFilter.Size': 10000,
        },
      )

      if (response.data) {
        cities.value = response.data.list
      }
      else {
        cities.value = []
      }

      return response
    }
    catch (err: unknown) {
      const error = err as AppError

      if (error.response?.status === 400) {
        $toast.error(error.response.data?.message || '')
      }

      cities.value = []

      return {
        succeeded: false,
        message: 'The operation failed. Please try again later.',
        data: {},
      }
    }
    finally {
      loadingCities.value = false
    }
  }

  const resetCities = () => {
    cities.value = []
  }

  return {
    countries,
    states,
    cities,
    loadingCountries,
    loadingStates,
    loadingCities,
    getCountries,
    getStates,
    getCities,
    resetCountries,
    resetStates,
    resetCities,
  }
}
