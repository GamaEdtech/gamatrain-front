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
          :rules="lastNameRules"
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
          :rules="[
            (v : string) => (!!v && v.trim().length > 0) || 'This field is required',
          ]"
          @change-selected-item="(item : ListItem) => userInformation.gender = item"
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
          :rules="[
            (v : string) => (!!v && v.trim().length > 0) || 'This field is required',
          ]"
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
          :rules="[
            (v : string) => (!!v && v.trim().length > 0) || 'This field is required',
          ]"
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
          :rules="[
            (v : string) => (!!v && v.trim().length > 0) || 'This field is required',
          ]"
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
          :rules="[
            (v : string) => (!!v && v.trim().length > 0) || 'This field is required',
          ]"
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
          :rules="[
            (v : string) => (!!v && v.trim().length > 0) || 'This field is required',
          ]"
          @change-selected-item="(item : ListItem) => userInformation.grade = item"
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
          @change-selected-item="(item : ListItem) => userInformation.school = item"
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
interface ListItem {
  id: number | string
  title?: string
  name?: string
}
interface UserInfo {
  avatarFile: File | null
  avatarUrl: string | null
  firstName: string
  lastName: string
  gender: ListItem | null
  country: ListItem | null
  state: ListItem | null
  city: ListItem | null
  board: ListItem | null
  grade: ListItem | null
  school: ListItem | null
}
interface ProfileData {
  userName: string
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

// Define page meta
definePageMeta({
  layout: 'dashboard-layout',
  title: 'Edit Profile',
})

useHead({
  title: 'Edit Profile',
})
const { $toast } = useNuxtApp()

const userInformation = ref<UserInfo>({
  avatarFile: null,
  avatarUrl: null,
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
const lastNameRules = [
  (v: string) => !!v || 'Last name is required',
  (v: string) => v.length >= 2 || 'Last name must be at least 2 characters',
  (v: string) => v.length <= 50 || 'Last name must be less than 50 characters',
  (v: string) =>
    /^[a-zA-Z\s]+$/.test(v) || 'Last name can only contain letters and spaces',
]

const genderList = ref<ListItem[]>([
  { id: 'Male', title: 'Male' },
  { id: 'Female', title: 'Female' },
])

// Location Info
const countries = ref<ListItem[]>([])
const countryLoading = ref(true)
const states = ref<ListItem[]>([])
const stateLoading = ref(true)
const cities = ref<ListItem[]>([])
const cityLoading = ref(true)

const countyChange = async (item: ListItem, firstInitilize: boolean) => {
  userInformation.value.country = item
  if (!firstInitilize) {
    userInformation.value.state = null
    states.value = []
    if (item) {
      await getFilterList({ 'PagingDto.PageFilter.Size': 10000 }, 'states')
    }
    userInformation.value.city = null
    cities.value = []
    userInformation.value.school = null
    schools.value = []
  }
}

const stateChange = async (item: ListItem, firstInitilize: boolean) => {
  userInformation.value.state = item
  if (!firstInitilize) {
    userInformation.value.city = null
    cities.value = []
    if (item) {
      await getFilterList({ 'PagingDto.PageFilter.Size': 10000 }, 'cities')
    }
    userInformation.value.school = null
    schools.value = []
  }
}

const cityChange = async (item: ListItem, firstInitilize: boolean) => {
  userInformation.value.city = item
  if (!firstInitilize) {
    userInformation.value.school = null
    schools.value = []
    if (item) {
      await getFilterList({ 'PagingDto.PageFilter.Size': 10000 }, 'school')
    }
  }
}

// School Info
const boards = ref<ListItem[]>([])
const boardLoading = ref(true)
const grades = ref<ListItem[]>([])
const gradeLoading = ref(true)
const schools = ref<ListItem[]>([])
const schoolLoading = ref(true)

const boardChange = async (item: ListItem, firstInitilize: boolean) => {
  userInformation.value.board = item
  if (!firstInitilize) {
    userInformation.value.grade = null
    grades.value = []
    if (item) {
      await getFilterList({ 'PagingDto.PageFilter.Size': 10000 }, 'grade')
    }
  }
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
    const profileResponse = await useApiService.get<ApiResponse<ProfileData>>(
      '/api/v2/identities/profiles',
    )
    userDataLoading.value = false
    console.log('profileResponse', profileResponse)

    if (profileResponse.data.gender)
      userInformation.value.gender = {
        id: profileResponse.data.gender,
        title: profileResponse.data.gender,
      }
    userInformation.value.firstName = profileResponse.data.firstName
    userInformation.value.lastName = profileResponse.data.lastName
    if (profileResponse.data.avatar)
      userInformation.value.avatarUrl = profileResponse.data.avatar

    if (profileResponse.data.countryId)
      userInformation.value.country = {
        id: profileResponse.data.countryId,
      }
    if (profileResponse.data.stateId) {
      userInformation.value.state = {
        id: profileResponse.data.stateId,
      }
    }
    if (profileResponse.data.cityId) {
      userInformation.value.city = {
        id: profileResponse.data.cityId,
      }
      await getFilterList({ 'PagingDto.PageFilter.Size': 10000 }, 'school')
    }
    if (profileResponse.data.board) {
      userInformation.value.board = {
        id: profileResponse.data.board,
      }
      await getFilterList({ 'PagingDto.PageFilter.Size': 10000 }, 'grade')
    }
    if (profileResponse.data.grade)
      userInformation.value.grade = {
        id: profileResponse.data.grade,
      }

    if (profileResponse.data.countryId) {
      await getFilterList({ 'PagingDto.PageFilter.Size': 10000 }, 'states')
      if (profileResponse.data.stateId) {
        await getFilterList({ 'PagingDto.PageFilter.Size': 10000 }, 'cities')
      }
    }
    if (profileResponse.data.schoolId) {
      userInformation.value.school = {
        id: profileResponse.data.schoolId,
      }
    }
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

const getFilterList = async (
  params: Record<string, string | number>,
  type: string,
) => {
  try {
    let endpoint = '/api/v1/types/list'
    if (type === 'countries') {
      countryLoading.value = true
      endpoint = '/api/v2/locations/countries'
    }
    if (type === 'states') {
      stateLoading.value = true
      endpoint = `/api/v2/locations/states/${userInformation.value.country?.id}`
    }
    if (type === 'cities') {
      cityLoading.value = true
      endpoint = `/api/v2/locations/cities/${userInformation.value.state?.id}`
    }
    if (type === 'board') {
      boardLoading.value = true
    }
    if (type === 'grade') {
      gradeLoading.value = true
      endpoint = `/api/v1/types/list/?type=base&section_id=${userInformation.value.board?.id}`
    }
    if (type === 'school') {
      schoolLoading.value = true
      params.CityId = userInformation.value.city?.id as string
      endpoint = `/api/v2/schools`
    }

    const response = await useApiService.get<
      ApiResponse<
        | ListItem[]
        | {
          list: ListItem[]
        }
      >
    >(endpoint, params)

    if (type === 'countries') {
      countryLoading.value = false
      countries.value = (
        response.data as {
          list: ListItem[]
        }
      ).list
    }
    if (type === 'states') {
      stateLoading.value = false
      states.value = (
        response.data as {
          list: ListItem[]
        }
      ).list
    }
    if (type === 'cities') {
      cityLoading.value = false
      cities.value = (
        response.data as {
          list: ListItem[]
        }
      ).list
    }
    if (type === 'board') {
      boardLoading.value = false
      boards.value = response.data as ListItem[]
    }
    if (type === 'grade') {
      gradeLoading.value = false
      grades.value = response.data as ListItem[]
    }
    if (type === 'school') {
      schoolLoading.value = false
      const resposneSchool = (
        response.data as {
          list: ListItem[]
        }
      ).list
      if (resposneSchool && resposneSchool.length > 0) {
        schools.value = resposneSchool.map((item: ListItem) => ({
          id: item.id,
          title: item.name,
        }))
      }
    }
  }
  catch (err) {
    console.error('Error fetching location data:', err)
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
  const lastName = info.lastName?.trim() || ''

  const isFirstNameValid = firstNameRules.every(
    rule => rule(firstName) === true,
  )
  const isLastNameValid = lastNameRules.every(
    rule => rule(lastName) === true,
  )
  return (
    isFirstNameValid
    && isLastNameValid
    && !!info.gender
    && !!info.country
    && !!info.state
    && !!info.city
    && !!info.board
    && !!info.grade
  )
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
