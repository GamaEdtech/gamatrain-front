<template>
  <v-container class="w-100 d-flex flex-column">
    <v-row>
      <v-col
        cols="12"
        class="d-flex"
      >
        <v-file-input
          ref="avatarInputRef"
          v-model="userInformation.avatarFile"
          class="d-none"
          accept="image/png,image/webp,image/jpeg"
          @change="uploadAvatar"
        />

        <v-skeleton-loader
          v-if="userDataLoading"
          width="72"
          height="72"
          class="rounded-circle"
        />
        <img
          v-if="userInformation.avatarUrl && !userDataLoading"
          width="72"
          height="72"
          class="pointer rounded-pill"
          :src="userInformation.avatarUrl"
          @click="changeUserAvatar"
        >
        <v-btn
          v-if="!userInformation.avatarUrl && !userDataLoading"
          class="d-flex pointer rounded-pill"
          variant="outlined"
          size="x-large"
          icon
          density="default"
          @click="changeUserAvatar"
        >
          <v-icon size="36">
            md:person
          </v-icon>
        </v-btn>
        <div class="pa-3">
          <p
            class="text-h5 pointer"
            @click="changeUserAvatar"
          >
            <v-icon size="small">
              md:edit
            </v-icon>
            Edit
          </p>
          <span class="text-h5"> Help to pick profile pic </span>
        </div>
      </v-col>
      <v-col cols="12">
        <v-skeleton-loader
          v-if="userDataLoading"
          width="200"
          height="20"
          class="rounded-pill"
        />
        <div
          v-else
          class="text-h6 text-sm-h5 text-grey700"
        >
          Want to see your public profile?
          <NuxtLink
            v-if="userInformation.handle"
            :to="`/profile/${userInformation.handle}`"
            class="text-primary font-weight-bold text-decoration-none"
          >
            Open your profile page
          </NuxtLink>
        </div>
      </v-col>
    </v-row>

    <!-- Personal Information -->
    <v-row>
      <v-col
        cols="12"
        class="pl-5 text-h4 teal--text"
      >
        <v-icon
          large
          color="primary"
        >
          md:person_outlined
        </v-icon>
        <span class="font-weight-bold"> Your personal information </span>
      </v-col>

      <v-col
        cols="12"
        md="4"
      >
        <v-text-field
          v-model="userInformation.firstName"
          density="compact"
          variant="outlined"
          :rules="firstNameRules"
          label="First name"
          outlined
          rounded="lg"
          color="#FFB600"
        >
          <template #prepend-inner>
            <v-progress-circular
              v-if="userDataLoading"
              indeterminate
              size="20"
              color="#ffb300"
              class="mr-2"
            />
          </template>
        </v-text-field>
      </v-col>

      <v-col
        cols="12"
        md="4"
      >
        <v-text-field
          v-model="userInformation.lastName"
          density="compact"
          variant="outlined"
          label="Last name"
          outlined
          rounded="lg"
          color="#FFB600"
        >
          <template #prepend-inner>
            <v-progress-circular
              v-if="userDataLoading"
              indeterminate
              size="20"
              color="#ffb300"
              class="mr-2"
            />
          </template>
        </v-text-field>
      </v-col>

      <v-col
        cols="12"
        md="4"
      >
        <CommonCustomSelectField
          label="Gender"
          :items="genderList"
          :selected-item="userInformation.gender"
          :has-search="false"
          :loading="userDataLoading"
          @change-selected-item="(item : SelectOption) => userInformation.gender = item"
        />
      </v-col>
    </v-row>

    <!-- Location Details -->
    <v-row>
      <v-col
        cols="12"
        class="pl-5 text-h4 teal--text"
      >
        <v-icon
          large
          color="primary"
        >
          md:location_on_outlined
        </v-icon>
        <span class="font-weight-bold"> Location details </span>
      </v-col>

      <v-col
        cols="12"
        md="4"
      >
        <CommonCustomSelectField
          label="Country"
          :items="countries"
          :selected-item="userInformation.country"
          :loading="countryLoading || userDataLoading"
          @change-selected-item="countyChange"
        />
      </v-col>

      <v-col
        cols="12"
        md="4"
      >
        <CommonCustomSelectField
          label="State"
          :items="states"
          :selected-item="userInformation.state"
          :loading="stateLoading || userDataLoading"
          :disabled="!userInformation.country"
          @change-selected-item="stateChange"
        />
      </v-col>

      <v-col
        cols="12"
        md="4"
      >
        <CommonCustomSelectField
          label="City"
          :items="cities"
          :selected-item="userInformation.city"
          :loading="cityLoading || userDataLoading"
          :disabled="!userInformation.state"
          @change-selected-item="cityChange"
        />
      </v-col>
    </v-row>

    <!-- School Profile -->
    <v-row>
      <v-col
        cols="12"
        class="pl-5 text-h4 teal--text"
      >
        <v-icon
          large
          color="primary"
        >
          md:school_outlined
        </v-icon>
        <span class="font-weight-bold"> School Profile </span>
      </v-col>

      <v-col
        cols="12"
        md="4"
      >
        <CommonCustomSelectField
          label="Board"
          :items="boards"
          :selected-item="userInformation.board"
          :loading="boardLoading || userDataLoading"
          @change-selected-item="boardChange"
        />
      </v-col>

      <v-col
        cols="12"
        md="4"
      >
        <CommonCustomSelectField
          label="Grade"
          :items="grades"
          :selected-item="userInformation.grade"
          :loading="gradeLoading || userDataLoading"
          :disabled="!userInformation.board"
          @change-selected-item="(item : SelectOption) => userInformation.grade = item"
        />
      </v-col>

      <v-col
        cols="12"
        md="4"
      >
        <CommonCustomSelectField
          label="School"
          :items="schools"
          :selected-item="userInformation.school"
          :loading="schoolLoading || userDataLoading"
          :disabled="!userInformation.city"
          @change-selected-item="(item : SelectOption) => userInformation.school = item"
        />
      </v-col>
    </v-row>

    <v-row>
      <v-divider class="my-3" />
      <v-col
        cols="12"
        md="6"
        class="pb-0 d-flex justify-center justify-md-end"
      >
        <v-btn
          flat
          rounded="lg"
          width="250"
          class="text-h5 font-weight-bold"
          color="success"
          :loading="submitLoading"
          :disabled="!isFormValid"
          @click="submitData"
        >
          Submit
        </v-btn>
      </v-col>
      <v-col
        cols="12"
        md="6"
        class="d-flex justify-center justify-md-start"
      >
        <v-btn
          flat
          rounded="lg"
          width="250"
          class="text-h5 font-weight-bold"
          color="error"
          to="/user"
        >
          Discard
        </v-btn>
      </v-col>
    </v-row>

    <CommonCropperDialog
      v-model="showCropperDialog"
      :file-url="cropAvatarUrl"
      :stencil-props="stencilProps"
      @cropped-data="confirmCrop"
    />
  </v-container>
</template>

<script setup lang="ts">
interface SelectOption {
  id: number | string
  title?: string
  name?: string
}
interface UserProfileUI {
  avatarFile: File | null
  avatarUrl: string | null
  handle: string
  firstName: string
  lastName: string
  gender: SelectOption | null
  country: SelectOption | null
  state: SelectOption | null
  city: SelectOption | null
  board: SelectOption | null
  grade: SelectOption | null
  school: SelectOption | null
}
interface UserProfileDTO {
  userName: string
  handle: string | null
  firstName: string
  lastName: string
  countryId: number | null
  stateId: number | null
  cityId: number | null
  schoolId: number | null
  referralId: string | null
  gender: string | null
  board: number | null
  grade: number | null
  avatar: string | null
}

interface ApiResponse<T> {
  data: T
  succeeded: boolean
  errors: {
    message: string
    code: string
    reference: string
    info: string
    value: string
  }[]
}
type ListFields
  = | 'gender'
    | 'country'
    | 'state'
    | 'city'
    | 'board'
    | 'grade'
    | 'school'

// Define page meta
definePageMeta({
  layout: 'dashboard-layout',
  title: 'Edit Profile',
})

useSeoMeta({
  title: 'Edit Profile',
})

const { $toast } = useNuxtApp()

const userInformation = ref<UserProfileUI>({
  avatarFile: null,
  avatarUrl: null,
  handle: '',
  firstName: '',
  lastName: '',
  gender: null,
  country: null,
  state: null,
  city: null,
  board: null,
  grade: null,
  school: null,
})
const userDataLoading = ref(true)

const firstNameRules = [
  (v: string) => !!v || 'First name is required',
  (v: string) => v.length >= 2 || 'First name must be at least 2 characters',
  (v: string) => v.length <= 50 || 'First name must be less than 50 characters',
  (v: string) =>
    /^[a-zA-Z\s]+$/.test(v) || 'First name can only contain letters and spaces',
]
// const lastNameRules = [
//   (v: string) => !!v || "Last name is required",
//   (v: string) => v.length >= 2 || "Last name must be at least 2 characters",
//   (v: string) => v.length <= 50 || "Last name must be less than 50 characters",
//   (v: string) =>
//     /^[a-zA-Z\s]+$/.test(v) || "Last name can only contain letters and spaces",
// ];

const genderList = ref<SelectOption[]>([
  { id: 'Male', title: 'Male' },
  { id: 'Female', title: 'Female' },
])

// Location Info
const countries = ref<SelectOption[]>([])
const countryLoading = ref(true)
const states = ref<SelectOption[]>([])
const stateLoading = ref(true)
const cities = ref<SelectOption[]>([])
const cityLoading = ref(true)

const handleChange = async (
  field: ListFields,
  value: SelectOption | null,
  firstInitialize: boolean,
  resetFields: ListFields[],
  fetchType?: keyof typeof locationConfig,
) => {
  userInformation.value[field] = value

  if (!firstInitialize) {
    resetFields.forEach((f) => {
      userInformation.value[f] = null
      if (f === 'state') states.value = []
      if (f === 'city') cities.value = []
      if (f === 'school') schools.value = []
      if (f === 'grade') grades.value = []
    })
    if (value && fetchType) {
      await getFilterList({ 'PagingDto.PageFilter.Size': 10000 }, fetchType)
    }
  }
}

const countyChange = async (item: SelectOption, firstInitilize: boolean) => {
  await handleChange(
    'country',
    item,
    firstInitilize,
    ['state', 'city', 'school'],
    'states',
  )
}

const stateChange = async (item: SelectOption, firstInitilize: boolean) => {
  await handleChange(
    'state',
    item,
    firstInitilize,
    ['city', 'school'],
    'cities',
  )
}

const cityChange = async (item: SelectOption, firstInitilize: boolean) => {
  await handleChange('city', item, firstInitilize, ['school'], 'school')
}

// School Info
const boards = ref<SelectOption[]>([])
const boardLoading = ref(true)
const grades = ref<SelectOption[]>([])
const gradeLoading = ref(true)
const schools = ref<SelectOption[]>([])
const schoolLoading = ref(true)

const boardChange = async (item: SelectOption, firstInitilize: boolean) => {
  await handleChange('board', item, firstInitilize, ['grade'], 'grade')
}

const avatarInputRef = ref<HTMLInputElement | null>(null)
const cropAvatarUrl = ref('')
const showCropperDialog = ref(false)
const stencilProps = { width: 100, height: 100, resizable: true }
const changeUserAvatar = () => {
  avatarInputRef.value?.click()
}
const uploadAvatar = () => {
  const file = userInformation.value.avatarFile
  if (file) {
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      $toast.error('File size must be less than 5MB')
      return
    }
    cropAvatarUrl.value = URL.createObjectURL(file)
    showCropperDialog.value = true
  }
}
const confirmCrop = (dataCroped: Blob) => {
  userInformation.value.avatarUrl = URL.createObjectURL(dataCroped)
  showCropperDialog.value = false
  const timestamp = new Date().getTime()
  const fileType = 'image/webp'
  const fileExt = 'webp'
  const filename = `image_${timestamp}.${fileExt}`
  const file = new File([dataCroped], filename, { type: fileType })
  userInformation.value.avatarFile = file
}

const getUserInfo = async () => {
  try {
    userDataLoading.value = true
    const { data } = await useApiService.get<ApiResponse<UserProfileDTO>>(
      '/api/v2/identities/profiles',
    )
    userDataLoading.value = false
    const {
      gender,
      handle,
      firstName,
      lastName,
      avatar,
      countryId,
      stateId,
      cityId,
      board,
      grade,
      schoolId,
    } = data
    userInformation.value = {
      ...userInformation.value,
      gender: gender ? { id: gender, title: gender } : null,
      handle: handle ?? '',
      firstName,
      lastName,
      avatarUrl: avatar || null,
      country: countryId ? { id: countryId } : null,
      state: stateId ? { id: stateId } : null,
      city: cityId ? { id: cityId } : null,
      board: board ? { id: board } : null,
      grade: grade ? { id: grade } : null,
      school: schoolId ? { id: schoolId } : null,
    }

    const filterPromises: Promise<void>[] = []
    if (countryId)
      filterPromises.push(
        getFilterList({ 'PagingDto.PageFilter.Size': 10000 }, 'states'),
      )
    if (stateId)
      filterPromises.push(
        getFilterList({ 'PagingDto.PageFilter.Size': 10000 }, 'cities'),
      )
    if (cityId)
      filterPromises.push(
        getFilterList({ 'PagingDto.PageFilter.Size': 10000 }, 'school'),
      )
    if (board)
      filterPromises.push(
        getFilterList({ 'PagingDto.PageFilter.Size': 10000 }, 'grade'),
      )

    await Promise.allSettled(filterPromises)
  }
  catch (err: unknown) {
    const error = err as { response?: { data?: { message?: string } } }
    $toast.error(
      error.response?.data?.message || 'Failed to load user information',
    )
  }
  finally {
    userDataLoading.value = false
    countryLoading.value = false
    stateLoading.value = false
    cityLoading.value = false
    boardLoading.value = false
    gradeLoading.value = false
    schoolLoading.value = false
  }
}

const locationConfig = {
  countries: {
    endpoint: () => '/api/v2/locations/countries',
    loading: countryLoading,
    valueRef: countries,
  },
  states: {
    endpoint: () =>
      `/api/v2/locations/states/${userInformation.value.country?.id}`,
    loading: stateLoading,
    valueRef: states,
  },
  cities: {
    endpoint: () =>
      `/api/v2/locations/cities/${userInformation.value.state?.id}`,
    loading: cityLoading,
    valueRef: cities,
  },
  board: {
    endpoint: () => '/api/v1/types/list',
    loading: boardLoading,
    valueRef: boards,
  },
  grade: {
    endpoint: () =>
      `/api/v1/types/list/?type=base&section_id=${userInformation.value.board?.id}`,
    loading: gradeLoading,
    valueRef: grades,
  },
  school: {
    endpoint: () => '/api/v2/schools',
    loading: schoolLoading,
    valueRef: schools,
  },
}

const getFilterList = async (
  params: Record<string, string | number>,
  type: keyof typeof locationConfig,
) => {
  try {
    const config = locationConfig[type]
    if (!config) return

    config.loading.value = true
    if (type === 'school') {
      params.CityId = userInformation.value.city?.id as string
    }
    const response = await useApiService.get<
      ApiResponse<SelectOption[] | { list: SelectOption[] }>
    >(config.endpoint(), params)

    config.loading.value = false
    if (type === 'school') {
      const list = (response.data as { list: SelectOption[] }).list || []
      config.valueRef.value = list.map((item: SelectOption) => ({
        id: item.id,
        title: item.name,
      }))
    }
    else if ((response.data as { list: SelectOption[] }).list) {
      config.valueRef.value = (response.data as { list: SelectOption[] }).list
    }
    else {
      config.valueRef.value = response.data as SelectOption[]
    }
  }
  catch (err) {
    console.error('Error fetching location data:', err)
    locationConfig[type].loading.value = false
  }
}

onMounted(async () => {
  await getFilterList({ 'PagingDto.PageFilter.Size': 250 }, 'countries')
  await getFilterList({ type: 'section' }, 'board')
  await getUserInfo()
})

const submitLoading = ref(false)

const isFormValid = computed(() => {
  const info = userInformation.value

  const firstName = info.firstName?.trim() || ''
  const isFirstNameValid = firstNameRules.every(
    rule => rule(firstName) === true,
  )
  return isFirstNameValid
})

const submitData = async () => {
  if (isFormValid.value) {
    submitLoading.value = true
    try {
      const profilePayload = new FormData()

      if (userInformation.value.city?.id)
        profilePayload.append('CityId', String(userInformation.value.city.id))

      if (userInformation.value.school?.id)
        profilePayload.append(
          'SchoolId',
          String(userInformation.value.school.id),
        )

      if (userInformation.value.firstName)
        profilePayload.append('FirstName', userInformation.value.firstName)

      if (userInformation.value.lastName)
        profilePayload.append('LastName', userInformation.value.lastName)

      if (userInformation.value.gender?.id)
        profilePayload.append(
          'Gender',
          String(userInformation.value.gender.id),
        )

      if (userInformation.value.board?.id)
        profilePayload.append('Board', String(userInformation.value.board.id))

      if (userInformation.value.grade?.id)
        profilePayload.append('Grade', String(userInformation.value.grade.id))

      if (userInformation.value.avatarFile)
        profilePayload.append('Avatar', userInformation.value.avatarFile)

      const profileResponse = await useApiService.put<ApiResponse<unknown>>(
        '/api/v2/identities/profiles',
        profilePayload,
      )
      if (profileResponse?.succeeded) {
        $toast.success('Profile updated successfully')
      }
      else {
        $toast.error('Failed to update profile')
      }
    }
    catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } }
      $toast.error(error.response?.data?.message || 'Failed to update profile')
    }
    finally {
      submitLoading.value = false
    }
  }
}
</script>
