import type {
  AddAdminLocationDTO,
  AdminLocationDTO,
  AdminLocationTypeDTO,
  ApiResult,
  AppError,
  GetAdminLocationParams,
  GetAdminParentLocationParams,
  LocationItemDTO,
  ResponseListDTO,
} from '@/types'

const locations = ref<AdminLocationDTO[]>([])
const countries = ref<LocationItemDTO[]>([])
const states = ref<LocationItemDTO[]>([])
const cities = ref<LocationItemDTO[]>([])

const locationsTotalCount = ref(0)
const locationsPageCount = ref(0)
const countriesTotalCount = ref(0)
const statesTotalCount = ref(0)
const citiesTotalCount = ref(0)
const countriesPageCount = ref(0)
const statesPageCount = ref(0)
const citiesPageCount = ref(0)

const loadingLocations = ref(true)
const loadingLocation = ref(false)
const loadingDeleteLocation = ref(false)
const loadingAddLocation = ref(false)
const loadingEditLocation = ref(false)
const loadingCountries = ref(false)
const loadingStates = ref(false)
const loadingCities = ref(false)
const loadingMoreCountries = ref(false)
const loadingMoreStates = ref(false)
const loadingMoreCities = ref(false)

const countriesHasMoreItems = computed(() => countries.value.length < countriesTotalCount.value)
const statesHasMoreItems = computed(() => states.value.length < statesTotalCount.value)
const citiesHasMoreItems = computed(() => cities.value.length < citiesTotalCount.value)

const NAME = 'Location'

interface GetLocationListOptions {
  append?: boolean
}

export const useLocationAdmin = () => {
  const { $toast } = useNuxtApp()

  const handleError = (err: unknown) => {
    const error = err as AppError

    if (error.response?.status === 400) {
      $toast.error(error.response.data?.message || '')
    }
  }

  const showResponseError = (response: ApiResult<unknown>) => {
    if (response.errors && response.errors.length > 0) {
      $toast.error(response.errors[0].message || '')
    }
    else {
      $toast.error('The operation failed. Please try again later.')
    }
  }

  const getLocations = async (params: GetAdminLocationParams) => {
    loadingLocations.value = true

    try {
      const response = await useApiService.get<
        ApiResult<ResponseListDTO<AdminLocationDTO>>
      >(
        `/api/v2/admin/locations/${params.locationType}`,
        {
          'PagingDto.PageFilter.Size': params.pageSize,
          'PagingDto.PageFilter.Skip': (params.page - 1) * params.pageSize,
          'PagingDto.PageFilter.ReturnTotalRecordsCount': true,
        },
      )

      if (response.data) {
        locations.value = response.data.list
        locationsTotalCount.value = response.data.totalRecordsCount
        locationsPageCount.value = Math.ceil(
          locationsTotalCount.value / params.pageSize,
        )
      }
      else {
        locations.value = []
        locationsTotalCount.value = 0
        locationsPageCount.value = 0
      }

      return response
    }
    catch (err: unknown) {
      handleError(err)

      locations.value = []
      locationsTotalCount.value = 0
      locationsPageCount.value = 0

      return {
        succeeded: false,
        status: 0,
        data: null,
      }
    }
    finally {
      loadingLocations.value = false
    }
  }

  const getLocationById = async (
    locationType: AdminLocationTypeDTO,
    id: string | number,
  ) => {
    loadingLocation.value = true

    try {
      const response = await useApiService.get<ApiResult<AdminLocationDTO>>(
        `/api/v2/admin/locations/${locationType}/${id}`,
      )

      return response
    }
    catch (err: unknown) {
      handleError(err)

      return {
        succeeded: false,
        status: 0,
        data: null,
      }
    }
    finally {
      loadingLocation.value = false
    }
  }

  const addLocation = async (
    locationType: AdminLocationTypeDTO,
    location: AddAdminLocationDTO,
  ) => {
    loadingAddLocation.value = true

    try {
      const response = await useApiService.post<ApiResult<boolean>>(
        `/api/v2/admin/locations/${locationType}`,
        { ...location },
      )

      if (response.succeeded) {
        $toast.success(`${NAME} added successfully!`)
      }
      else {
        showResponseError(response)
      }

      return response
    }
    catch (err: unknown) {
      handleError(err)

      return {
        succeeded: false,
        status: 0,
        data: false,
      }
    }
    finally {
      loadingAddLocation.value = false
    }
  }

  const editLocation = async (
    locationType: AdminLocationTypeDTO,
    id: string | number,
    location: AddAdminLocationDTO,
  ) => {
    loadingEditLocation.value = true

    try {
      const response = await useApiService.put<ApiResult<boolean>>(
        `/api/v2/admin/locations/${locationType}/${id}`,
        { ...location },
      )

      if (response.succeeded) {
        $toast.success(`${NAME} edited successfully!`)
      }
      else {
        showResponseError(response)
      }

      return response
    }
    catch (err: unknown) {
      handleError(err)

      return {
        succeeded: false,
        status: 0,
        data: false,
      }
    }
    finally {
      loadingEditLocation.value = false
    }
  }

  const deleteLocation = async (
    locationType: AdminLocationTypeDTO,
    id: string | number,
  ) => {
    loadingDeleteLocation.value = true

    try {
      const response = await useApiService.remove<ApiResult<boolean>>(
        `/api/v2/admin/locations/${locationType}/${id}`,
      )

      if (response.succeeded) {
        $toast.success(`${NAME} deleted successfully!`)
      }
      else {
        showResponseError(response)
      }

      return response
    }
    catch (err: unknown) {
      handleError(err)

      return {
        succeeded: false,
        status: 0,
        data: false,
      }
    }
    finally {
      loadingDeleteLocation.value = false
    }
  }

  const getCountries = async (
    params: GetAdminParentLocationParams,
    options: GetLocationListOptions = {},
  ) => {
    const { append = false } = options

    if (append)
      loadingMoreCountries.value = true
    else
      loadingCountries.value = true

    try {
      const response = await useApiService.get<
        ApiResult<ResponseListDTO<LocationItemDTO>>
      >(
        '/api/v2/admin/locations/countries',
        {
          'PagingDto.PageFilter.Size': params.pageSize,
          'PagingDto.PageFilter.Skip': (params.page - 1) * params.pageSize,
          'PagingDto.PageFilter.ReturnTotalRecordsCount': true,
        },
      )

      if (response.data) {
        const newItems = response.data.list ?? []

        countries.value = append
          ? [...countries.value, ...newItems]
          : newItems

        countriesTotalCount.value = response.data.totalRecordsCount
        countriesPageCount.value = Math.ceil(
          countriesTotalCount.value / params.pageSize,
        )
      }
      else if (!append) {
        resetCountries()
      }
    }
    catch (err: unknown) {
      handleError(err)

      if (!append) {
        resetCountries()
      }
    }
    finally {
      if (append)
        loadingMoreCountries.value = false
      else
        loadingCountries.value = false
    }
  }

  const getStates = async (
    countryId: string | number,
    params: GetAdminParentLocationParams,
    options: GetLocationListOptions = {},
  ) => {
    const { append = false } = options

    if (append)
      loadingMoreStates.value = true
    else
      loadingStates.value = true

    try {
      const response = await useApiService.get<
        ApiResult<ResponseListDTO<LocationItemDTO>>
      >(
        `/api/v2/locations/states/${countryId}`,
        {
          'PagingDto.PageFilter.Size': params.pageSize,
          'PagingDto.PageFilter.Skip': (params.page - 1) * params.pageSize,
          'PagingDto.PageFilter.ReturnTotalRecordsCount': true,
        },
      )

      if (response.data) {
        const newItems = response.data.list ?? []

        states.value = append
          ? [...states.value, ...newItems]
          : newItems

        statesTotalCount.value = response.data.totalRecordsCount
        statesPageCount.value = Math.ceil(
          statesTotalCount.value / params.pageSize,
        )
      }
      else if (!append) {
        resetStates()
      }
    }
    catch (err: unknown) {
      handleError(err)

      if (!append) {
        resetStates()
      }
    }
    finally {
      if (append)
        loadingMoreStates.value = false
      else
        loadingStates.value = false
    }
  }

  const getCities = async (
    stateId: string | number,
    params: GetAdminParentLocationParams,
    options: GetLocationListOptions = {},
  ) => {
    const { append = false } = options

    if (append)
      loadingMoreCities.value = true
    else
      loadingCities.value = true

    try {
      const response = await useApiService.get<
        ApiResult<ResponseListDTO<LocationItemDTO>>
      >(
        `/api/v2/locations/cities/${stateId}`,
        {
          'PagingDto.PageFilter.Size': params.pageSize,
          'PagingDto.PageFilter.Skip': (params.page - 1) * params.pageSize,
          'PagingDto.PageFilter.ReturnTotalRecordsCount': true,
        },
      )

      if (response.data) {
        const newItems = response.data.list ?? []

        cities.value = append
          ? [...cities.value, ...newItems]
          : newItems

        citiesTotalCount.value = response.data.totalRecordsCount
        citiesPageCount.value = Math.ceil(
          citiesTotalCount.value / params.pageSize,
        )
      }
      else if (!append) {
        resetCities()
      }
    }
    catch (err: unknown) {
      handleError(err)

      if (!append) {
        resetCities()
      }
    }
    finally {
      if (append)
        loadingMoreCities.value = false
      else
        loadingCities.value = false
    }
  }

  const resetCountries = () => {
    countries.value = []
    countriesTotalCount.value = 0
    countriesPageCount.value = 0
  }

  const resetStates = () => {
    states.value = []
    statesTotalCount.value = 0
    statesPageCount.value = 0
  }

  const resetCities = () => {
    cities.value = []
    citiesTotalCount.value = 0
    citiesPageCount.value = 0
  }

  return {
    locations,
    locationsTotalCount,
    locationsPageCount,
    loadingLocations,
    getLocations,

    getLocationById,
    loadingLocation,
    addLocation,
    loadingAddLocation,
    editLocation,
    loadingEditLocation,
    deleteLocation,
    loadingDeleteLocation,

    countries,
    countriesTotalCount,
    countriesPageCount,
    countriesHasMoreItems,
    loadingCountries,
    loadingMoreCountries,
    getCountries,
    resetCountries,

    states,
    statesTotalCount,
    statesPageCount,
    statesHasMoreItems,
    loadingStates,
    loadingMoreStates,
    getStates,
    resetStates,

    cities,
    citiesTotalCount,
    citiesPageCount,
    citiesHasMoreItems,
    loadingCities,
    loadingMoreCities,
    getCities,
    resetCities,
  }
}
