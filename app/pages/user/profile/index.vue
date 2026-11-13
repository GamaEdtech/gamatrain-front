<template>
  <v-container class="w-100 d-flex flex-column ga-6 profile-edit">
    <v-form
      v-model="isFormValid"
      class="w-100 d-flex flex-column ga-6"
      @submit.prevent="submitData"
    >
      <!-- About you -->
      <v-card
        flat
        rounded="lg"
        border
        tag="section"
        class="pa-4 pa-sm-6 profile-edit__card"
        aria-labelledby="about-title"
      >
        <div class="d-flex flex-wrap justify-space-between align-center ga-2">
          <h2
            id="about-title"
            class="text-h6 font-weight-bold text-grey900"
          >
            About you
          </h2>
          <v-btn
            v-if="userInformation.handle"
            :to="`/profile/${userInformation.handle}`"
            variant="text"
            color="info"
            class="text-none px-1"
            append-icon="mdi-arrow-right"
          >
            View your public profile
          </v-btn>
        </div>

        <v-alert
          v-if="isTeacherWithoutName"
          type="info"
          color="primaryStrong"
          density="compact"
          variant="tonal"
          class="mt-3"
        >
          Add your name to appear in the teacher directory. Teachers without a name aren't listed.
        </v-alert>

        <div class="d-flex flex-wrap align-center ga-4 mt-4">
          <v-file-input
            ref="avatarInputRef"
            v-model="userInformation.avatarFile"
            class="d-none"
            accept="image/png,image/webp,image/jpeg"
            @change="uploadAvatar"
          />
          <v-skeleton-loader
            v-if="userDataLoading"
            type="avatar"
            width="80"
            height="80"
          />
          <v-avatar
            v-else
            size="80"
            color="surfaceTertiary"
          >
            <v-img
              v-if="userInformation.avatarUrl"
              :src="userInformation.avatarUrl"
              alt="Your profile photo"
              cover
            />
            <v-icon
              v-else
              size="40"
              color="grey500"
              aria-hidden="true"
            >
              md:person
            </v-icon>
          </v-avatar>
          <div class="d-flex flex-column align-start ga-1">
            <v-btn
              variant="outlined"
              color="secondary"
              class="text-none"
              prepend-icon="mdi-camera-outline"
              :disabled="userDataLoading"
              @click="changeUserAvatar"
            >
              {{ userInformation.avatarUrl ? 'Change photo' : 'Add a photo' }}
            </v-btn>
            <span class="text-caption text-grey600">PNG, JPG or WebP, up to 5 MB</span>
          </div>
        </div>

        <v-row class="mt-4">
          <v-col
            cols="12"
            md="4"
          >
            <v-text-field
              id="profile-first-name"
              v-model="userInformation.firstName"
              :rules="nameRules"
              label="First name"
              variant="outlined"
              density="comfortable"
              rounded="lg"
              color="secondary"
              autocomplete="given-name"
              :loading="userDataLoading"
            />
          </v-col>
          <v-col
            cols="12"
            md="4"
          >
            <v-text-field
              id="profile-last-name"
              v-model="userInformation.lastName"
              :rules="lastNameRules"
              label="Last name"
              variant="outlined"
              density="comfortable"
              rounded="lg"
              color="secondary"
              autocomplete="family-name"
              :loading="userDataLoading"
            />
          </v-col>
          <v-col
            cols="12"
            md="4"
          >
            <common-gombo-box
              v-model="userInformation.gender"
              label="Gender (optional)"
              :items="genderList"
              :data-loading="userDataLoading"
              :has-search="false"
              density="comfortable"
              rounded="lg"
              base-color="grey500"
              color="secondary"
            />
          </v-col>
        </v-row>

        <user-profile-edit-details-list
          :user="currentUser"
          @edit="openField"
        />
      </v-card>

      <!-- School and study -->
      <v-card
        flat
        rounded="lg"
        border
        tag="section"
        class="pa-4 pa-sm-6 profile-edit__card"
        aria-labelledby="school-title"
      >
        <h2
          id="school-title"
          class="text-h6 font-weight-bold text-grey900"
        >
          School and study
        </h2>
        <p class="ma-0 mt-1 text-body-2 text-grey600">
          Where you are and the school you study or teach at. Pick your city first: its schools then appear in the list.
        </p>

        <v-row
          id="profile-location"
          class="mt-2"
        >
          <v-col
            cols="12"
            md="4"
          >
            <common-gombo-box
              v-model="userInformation.country"
              label="Country"
              :items="countries"
              :data-loading="loadingCountries || userDataLoading"
              density="comfortable"
              rounded="lg"
              base-color="grey500"
              color="secondary"
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
              density="comfortable"
              rounded="lg"
              base-color="grey500"
              color="secondary"
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
              density="comfortable"
              rounded="lg"
              base-color="grey500"
              color="secondary"
              @update:model-value="cityChange"
            />
          </v-col>

          <v-col
            id="profile-school"
            cols="12"
            md="4"
          >
            <common-gombo-box
              v-model="userInformation.school"
              :label="userInformation.city ? 'School' : 'School (pick a city first)'"
              :items="schools.map((school) => ({
                id: school.id,
                title: school.name,
              }))"
              :data-loading="loadingSchools || loadingCities || loadingStates || loadingCountries || userDataLoading"
              :disabled="!userInformation.city"
              :infinite-loading="true"
              :loading-more="loadingMoreSchool"
              :has-more-items="hasMoreItemsSchool"
              density="comfortable"
              rounded="lg"
              base-color="grey500"
              color="secondary"
              @load-more="loadMoreSchool"
            />
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
              density="comfortable"
              rounded="lg"
              base-color="grey500"
              color="secondary"
              @update:model-value="boardChange"
            />
          </v-col>
          <v-col
            cols="12"
            md="4"
          >
            <common-gombo-box
              v-model="userInformation.grade"
              :label="userInformation.board ? 'Grade' : 'Grade (pick a board first)'"
              :items="grades.map((grade) => ({
                id: grade.id,
                title: grade.title,
              }))"
              :data-loading="loadingGrade || loadingBoards || userDataLoading"
              :disabled="!userInformation.board"
              density="comfortable"
              rounded="lg"
              base-color="grey500"
              color="secondary"
            />
          </v-col>
        </v-row>
      </v-card>
    </v-form>

    <!-- These save straight away, so they sit outside the form and its save bar. -->
    <user-profile-my-schools />
    <user-profile-edit-experience-card
      :experiences="currentUser?.experiences ?? []"
      @add="openField('experience')"
    />
    <user-profile-edit-privacy-card />

    <user-profile-edit-field-dialogs ref="fieldDialogs" />

    <user-profile-edit-save-bar
      :dirty="isDirty"
      :valid="isFormValid !== false"
      :saving="loadingEditItem"
      @save="submitData"
      @cancel="discardChanges"
    />

    <CommonCropperDialog
      v-model="showCropperDialog"
      :file-url="cropAvatarUrl"
      :stencil-props="stencilProps"
      @cropped-data="confirmCrop"
    />
  </v-container>
</template>

<script setup lang="ts">
import type { EditProfileDTO, Gender, ProfileFieldCode, User } from '@/types'

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
  personName,
} = useValidationRules()
const {
  user: currentUser,
  getProfile,
  setUser,
} = useUser()
const { editItem, loadingEditItem } = useProfile()

// Reads the saved profile, not the form, so the note stays until the name is actually saved.
const isTeacherWithoutName = computed(() =>
  (currentUser.value?.roles?.includes('Teacher') ?? false)
  && !`${currentUser.value?.firstName ?? ''}${currentUser.value?.lastName ?? ''}`.trim(),
)
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
const nameRules = [required, minLength(2), maxLength(50), personName]
const lastNameRules = [maxLength(50), personName]

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
    markSaved()
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

const fieldDialogs = ref<{ open: (code: ProfileFieldCode) => void } | null>(null)

/** Opens a profile field's own dialog (status, bio, skills, school history); each saves on its own. */
const openField = (code: ProfileFieldCode) => fieldDialogs.value?.open(code)

// Unsaved changes: the form's fields as last loaded or saved, against what's in it now. The save bar shows only when they differ.
const formFields = () => {
  const { avatarFile: _file, avatarUrl: _url, handle: _handle, ...fields } = userInformation.value
  return JSON.stringify({ ...fields, firstName: fields.firstName.trim(), lastName: fields.lastName.trim() })
}
const savedFields = ref('')
const markSaved = () => {
  savedFields.value = formFields()
}
const isDirty = computed(() => !userDataLoading.value && (Boolean(userInformation.value.avatarFile) || formFields() !== savedFields.value))

/** Cancel: back to what's saved, lists included (a changed country also reloaded its states and cities). */
const discardChanges = async () => {
  userInformation.value.avatarFile = null
  await getUserInfo()
}

if (import.meta.client) {
  const warnBeforeUnload = (event: BeforeUnloadEvent) => {
    if (isDirty.value) event.preventDefault()
  }
  onMounted(() => window.addEventListener('beforeunload', warnBeforeUnload))
  onBeforeUnmount(() => window.removeEventListener('beforeunload', warnBeforeUnload))
}

onBeforeRouteLeave(() => !isDirty.value || window.confirm('You have unsaved changes. Leave without saving them?'))

const submitData = async () => {
  if (isFormValid.value) {
    const data: EditProfileDTO = {
      cityId: toOptionalNumber(userInformation.value.city),
      schoolId: toOptionalNumber(userInformation.value.school),
      firstName: userInformation.value.firstName.trim(),
      lastName: userInformation.value.lastName.trim(),
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
        firstName: userInformation.value.firstName.trim(),
        lastName: userInformation.value.lastName.trim(),
        countryId: toOptionalNumber(userInformation.value.country) ?? 0,
        stateId: toOptionalNumber(userInformation.value.state) ?? 0,
        cityId: toOptionalNumber(userInformation.value.city) ?? 0,
        schoolId: toOptionalNumber(userInformation.value.school) ?? 0,
        board: toOptionalNumber(userInformation.value.board) ?? 0,
        grade: toOptionalNumber(userInformation.value.grade) ?? 0,
        gender: userInformation.value.gender as Gender,
        avatarUri: userInformation.value.avatarUrl ?? '',
      })
      userInformation.value.firstName = userInformation.value.firstName.trim()
      userInformation.value.lastName = userInformation.value.lastName.trim()
      userInformation.value.avatarFile = null
      markSaved()
    }
  }
}
</script>

<style scoped>
.profile-edit {
  max-width: 1120px;
}

.profile-edit__card {
  border-color: rgb(var(--v-theme-borderSubtle)) !important;
}
</style>
