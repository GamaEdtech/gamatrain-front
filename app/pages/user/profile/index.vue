<template>
  <v-container class="w-100 d-flex flex-column">
    <v-form
      v-model="isFormValid"
      class="w-100 d-flex flex-column"
    >
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
          class="pl-5 text-h4 text-grey700"
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
            color="primary"
          >
            <template #prepend-inner>
              <v-progress-circular
                v-if="userDataLoading"
                indeterminate
                size="20"
                color="primary"
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
            color="primary"
          >
            <template #prepend-inner>
              <v-progress-circular
                v-if="userDataLoading"
                indeterminate
                size="20"
                color="primary"
                class="mr-2"
              />
            </template>
          </v-text-field>
        </v-col>

        <v-col
          cols="12"
          md="4"
        >
          <common-gombo-box
            v-model="userInformation.gender"
            label="Gender"
            :items="genderList"
            :data-loading="userDataLoading"
            :has-search="false"
            density="compact"
            rounded="lg"
            base-color="grey500"
            color="primary"
          />
        </v-col>
      </v-row>

      <!-- Location Details -->
      <v-row>
        <v-col
          cols="12"
          class="pl-5 text-h4 text-grey700"
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
          <common-gombo-box
            v-model="userInformation.country"
            label="Country"
            :items="countries"
            :data-loading="loadingCountries || userDataLoading"
            density="compact"
            rounded="lg"
            base-color="grey500"
            color="primary"
            @update:model-value="countyChange"
          />
        </v-col>

        <v-col
          cols="12"
          md="4"
        >
          <common-gombo-box
            v-model="userInformation.state"
            label="State"
            :items="states"
            :data-loading="loadingStates || loadingCountries || userDataLoading"
            :disabled="!userInformation.country"
            density="compact"
            rounded="lg"
            base-color="grey500"
            color="primary"
            @update:model-value="stateChange"
          />
        </v-col>

        <v-col
          cols="12"
          md="4"
        >
          <common-gombo-box
            v-model="userInformation.city"
            label="City"
            :items="cities"
            :data-loading="loadingCities || loadingStates || loadingCountries || userDataLoading"
            :disabled="!userInformation.state"
            density="compact"
            rounded="lg"
            base-color="grey500"
            color="primary"
            @update:model-value="cityChange"
          />
        </v-col>
      </v-row>

      <!-- School Profile -->
      <v-row>
        <v-col
          cols="12"
          class="pl-5 text-h4 text-grey700"
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
          <common-gombo-box
            v-model="userInformation.board"
            label="Board"
            :items="boards.map((board) => ({
              id: board.code,
              title: board.title,
            }))"
            :data-loading="loadingBoards || userDataLoading"
            density="compact"
            rounded="lg"
            base-color="grey500"
            color="primary"
            @update:model-value="boardChange"
          />
        </v-col>

        <v-col
          cols="12"
          md="4"
        >
          <common-gombo-box
            v-model="userInformation.grade"
            label="Grade"
            :items="grades.map((grade) => ({
              id: grade.id,
              title: grade.title,
            }))"
            :data-loading="loadingGrade || loadingBoards || userDataLoading"
            :disabled="!userInformation.board"
            density="compact"
            rounded="lg"
            base-color="grey500"
            color="primary"
          />
        </v-col>

        <v-col
          cols="12"
          md="4"
        >
          <common-gombo-box
            v-model="userInformation.school"
            label="School"
            :items="schools.map((school) => ({
              id: school.id,
              title: school.name,
            }))"
            :data-loading="loadingSchools || loadingCities || loadingStates || loadingCountries || userDataLoading"
            :disabled="!userInformation.city"
            :infinite-loading="true"
            :loading-more="loadingMoreSchool"
            :has-more-items="hasMoreItemsSchool"
            density="compact"
            rounded="lg"
            base-color="grey500"
            color="primary"
            @load-more="loadMoreSchool"
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
            :loading="loadingEditItem"
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
    </v-form>

    <CommonCropperDialog
      v-model="showCropperDialog"
      :file-url="cropAvatarUrl"
      :stencil-props="stencilProps"
      @cropped-data="confirmCrop"
    />
  </v-container>
</template>

<script setup lang="ts">
import type { EditProfileDTO, Gender, User } from '@/types'

type SelectValue = number | string
interface SelectItem {
  id: SelectValue
  title: string
}

interface UserProfileUI {
  avatarFile: File | null
  avatarUrl: string | null
  handle: string
  firstName: string
  lastName: string
  gender: SelectValue
  country: SelectValue
  state: SelectValue
  city: SelectValue
  board: SelectValue
  grade: SelectValue
  school: SelectValue
}

// Define page meta
definePageMeta({
  layout: 'dashboard-layout',
  title: 'Edit Profile',
})

useSeoMeta({
  title: 'Edit Profile',
})

const { $toast } = useNuxtApp()
const {
  required,
  minLength,
  maxLength,
  alphabetic,
} = useValidationRules()
const {
  user: currentUser,
  getProfile,
  setUser,
} = useUser()
const { editItem, loadingEditItem } = useProfile()
const {
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
} = useLocation()
const {
  loadingGetData: loadingBoards,
  data: boards,
  getData: getBoards,
  resetBoards,
  getGrades,
  grades,
  loadingGrade,
  resetGrades,
} = useBoard()
const {
  loadingGetData: loadingSchools,
  data: schools,
  getData: getSchools,
  resetData: resetSchools,
  loadingMore: loadingMoreSchool,
  hasMoreItems: hasMoreItemsSchool,
} = useSchool()

const userInformation = ref<UserProfileUI>({
  avatarFile: null,
  avatarUrl: null,
  handle: '',
  firstName: '',
  lastName: '',
  gender: '',
  country: '',
  state: '',
  city: '',
  board: '',
  grade: '',
  school: '',
})

const userDataLoading = ref(true)
const isFormValid = ref(false)
const pageSchool = ref(1)
const pageSizeSchool = 50

const genderList = ref<SelectItem[]>([
  { id: 'Male', title: 'Male' },
  { id: 'Female', title: 'Female' },
])
const firstNameRules = [required, minLength(2), maxLength(50), alphabetic]

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

const toOptionalNumber = (value: SelectValue) => value ? Number(value) : undefined

const setUserInformation = (user: User) => {
  userInformation.value = {
    ...userInformation.value,
    avatarUrl: user.avatarUri || null,
    handle: user.handle ?? '',
    firstName: user.firstName ?? '',
    lastName: user.lastName ?? '',
    gender: user.gender ?? '',
    country: user.countryId ?? '',
    state: user.stateId ?? '',
    city: user.cityId ?? '',
    board: user.board ?? '',
    grade: user.grade ?? '',
    school: user.schoolId ?? '',
  }
}

const fetchSchoolList = async (append = false) => {
  if (!userInformation.value.city) return

  await getSchools(
    {
      page: pageSchool.value,
      pageSize: pageSizeSchool,
      countryId: toOptionalNumber(userInformation.value.country),
      stateId: toOptionalNumber(userInformation.value.state),
      cityId: toOptionalNumber(userInformation.value.city),
    },
    { append },
  )
}

const countyChange = async (countryId: SelectValue) => {
  userInformation.value.state = ''
  userInformation.value.city = ''
  userInformation.value.school = ''
  resetStates()
  resetCities()
  resetSchools()
  pageSchool.value = 1

  if (countryId) {
    await getStates(countryId)
  }
}

const stateChange = async (stateId: SelectValue) => {
  userInformation.value.city = ''
  userInformation.value.school = ''
  resetCities()
  resetSchools()
  pageSchool.value = 1

  if (stateId) {
    await getCities(stateId)
  }
}

const cityChange = async (cityId: SelectValue) => {
  userInformation.value.school = ''
  resetSchools()
  pageSchool.value = 1

  if (cityId) {
    await fetchSchoolList()
  }
}

const boardChange = async (boardId: SelectValue) => {
  userInformation.value.grade = ''
  resetGrades()

  if (boardId) {
    await getGrades(boardId)
  }
}

const loadMoreSchool = async () => {
  pageSchool.value += 1
  await fetchSchoolList(true)
}

const getUserInfo = async () => {
  try {
    userDataLoading.value = true
    const profileResponse = await getProfile()
    const profile = profileResponse.data?.data

    if (!profile) {
      $toast.error('Failed to load user information')
      return
    }

    setUserInformation(profile)
    setUser(profile)

    await Promise.allSettled([
      profile.countryId ? getStates(profile.countryId) : Promise.resolve(),
      profile.stateId ? getCities(profile.stateId) : Promise.resolve(),
      profile.board ? getGrades(profile.board) : Promise.resolve(),
      profile.cityId ? fetchSchoolList() : Promise.resolve(),
    ])
  }
  catch (err: unknown) {
    const error = err as { response?: { data?: { message?: string } } }
    $toast.error(
      error.response?.data?.message || 'Failed to load user information',
    )
  }
  finally {
    userDataLoading.value = false
  }
}

onMounted(async () => {
  await getCountries()
  await getBoards()
  await getUserInfo()
})

onUnmounted(() => {
  resetCountries()
  resetStates()
  resetCities()
  resetBoards()
  resetGrades()
  resetSchools()
})

const submitData = async () => {
  if (isFormValid.value) {
    const data: EditProfileDTO = {
      cityId: toOptionalNumber(userInformation.value.city),
      schoolId: toOptionalNumber(userInformation.value.school),
      firstName: userInformation.value.firstName,
      lastName: userInformation.value.lastName,
      board: toOptionalNumber(userInformation.value.board),
      grade: toOptionalNumber(userInformation.value.grade),
      gender: userInformation.value.gender as Gender,
    }

    if (userInformation.value.avatarFile) {
      data.avatar = userInformation.value.avatarFile
    }

    const response = await editItem(data)

    if (response?.succeeded && currentUser.value) {
      setUser({
        ...currentUser.value,
        firstName: userInformation.value.firstName,
        lastName: userInformation.value.lastName,
        countryId: toOptionalNumber(userInformation.value.country) ?? 0,
        stateId: toOptionalNumber(userInformation.value.state) ?? 0,
        cityId: toOptionalNumber(userInformation.value.city) ?? 0,
        schoolId: toOptionalNumber(userInformation.value.school) ?? 0,
        board: toOptionalNumber(userInformation.value.board) ?? 0,
        grade: toOptionalNumber(userInformation.value.grade) ?? 0,
        gender: userInformation.value.gender as Gender,
        avatarUri: userInformation.value.avatarUrl ?? '',
      })
    }
  }
}
</script>
