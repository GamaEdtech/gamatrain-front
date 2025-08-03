<template>
  <div class="main">
    <v-row>
      <v-col
        cols="12"
        md="8"
      >
        <div class="d-flex pb-0">
          <img
            v-if="avatarUrl"
            width="72"
            height="72"
            class="pointer"
            style="border-radius: 5px !important"
            :src="avatarUrl"
            @click="selectAvatar"
          >
          <v-btn
            v-else
            class="d-flex pointer rounded-pill"
            variant="outlined"
            size="x-large"
            icon
            density="default"
            @click="selectAvatar"
          >
            <v-icon size="large">
              mdi-account-outline
            </v-icon>
          </v-btn>
          <div class="pa-3">
            <p
              class="text-h5 pointer"
              @click="selectAvatar"
            >
              <v-icon size="small">
                mdi-pencil
              </v-icon>
              Edit
            </p>
            <NuxtLink
              to="/"
              class="text-h5"
            >
              Help to pick profile pic
            </NuxtLink>
          </div>
        </div>
      </v-col>

      <v-col
        cols="12"
        md="4"
        class="text-right pb-8"
      >
        <v-row>
          <v-col
            cols="12"
            md="12"
          >
            <form>
              <v-row>
                <v-col
                  md="10"
                  sm="9"
                  cols="8"
                >
                  <v-file-input
                    ref="avatarInput"
                    v-model="form.avatar"
                    class="d-none"
                    accept="image/png,image/webp,image/jpeg"
                    @change="uploadAvatar"
                  />

                  <v-text-field
                    v-model="username"
                    variant="outlined"
                    density="compact"
                    filled
                    dense
                    :rules="usernameRules"
                    :error-messages="usernameErrors"
                    class="mt-4 mb-0"
                    placeholder="Choose username"
                    type="text"
                  >
                    <template #prepend-inner>
                      <span class="d-flex align-center">@</span>
                    </template>
                    <template #append-inner>
                      <v-btn
                        color="primary"
                        size="small"
                        class="default"
                        type="submit"
                        variant="flat"
                      >
                        Choose
                      </v-btn>
                    </template>
                  </v-text-field>
                </v-col>
              </v-row>
            </form>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <v-form
      ref="formRef"
      @submit.prevent="submitProfile"
    >
      <!-- Personal Information -->
      <v-row>
        <v-col
          cols="12"
          class="pl-5 text-h4 teal--text"
        >
          <v-icon
            large
            color="teal"
          >
            mdi-account-outline
          </v-icon>
          <span> Your personal information </span>
        </v-col>

        <v-col
          cols="12"
          md="4"
        >
          <v-text-field
            v-model="form.first_name"
            density="compact"
            variant="outlined"
            dense
            :rules="firstNameRules"
            :error-messages="firstNameErrors"
            label="First name"
            outlined
          />
        </v-col>

        <v-col
          cols="12"
          md="4"
        >
          <v-text-field
            v-model="form.last_name"
            density="compact"
            variant="outlined"
            dense
            :rules="lastNameRules"
            :error-messages="lastNameErrors"
            label="Last name"
            outlined
          />
        </v-col>

        <v-col
          cols="12"
          md="4"
        >
          <v-select
            v-model="form.gender"
            dense
            density="compact"
            :rules="genderRules"
            :error-messages="genderErrors"
            :items="genderList"
            item-value="id"
            item-title="title"
            label="Gender"
            variant="outlined"
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
            color="teal"
          >
            mdi-map-marker-outline
          </v-icon>
          <span> Location details </span>
        </v-col>

        <v-col
          cols="12"
          md="4"
        >
          <v-autocomplete
            v-model="form.country"
            dense
            density="compact"
            :items="countries"
            item-text="title"
            item-value="id"
            :rules="countryRules"
            :error-messages="countryErrors"
            label="Country"
            variant="outlined"
            @update:model-value="handleCountryChange"
          />
        </v-col>

        <v-col
          cols="12"
          md="4"
        >
          <v-autocomplete
            v-model="form.state"
            dense
            density="compact"
            :items="states"
            item-text="title"
            item-value="id"
            :rules="stateRules"
            :error-messages="stateErrors"
            :disabled="!form.country"
            label="State"
            variant="outlined"
            @update:model-value="handleStateChange"
          />
        </v-col>

        <v-col
          cols="12"
          md="4"
        >
          <v-autocomplete
            v-model="form.city"
            dense
            density="compact"
            :items="cities"
            item-text="title"
            item-value="id"
            :rules="cityRules"
            :error-messages="cityErrors"
            label="City"
            variant="outlined"
            :disabled="!form.state"
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
            color="teal"
          >
            mdi-account-school-outline
          </v-icon>
          <span> School Profile </span>
        </v-col>

        <v-col
          cols="12"
          md="4"
        >
          <v-autocomplete
            v-model="form.level"
            dense
            density="compact"
            :items="levelList"
            :rules="levelRules"
            :error-messages="levelErrors"
            item-text="title"
            item-value="id"
            label="Board"
            variant="outlined"
          />
        </v-col>

        <v-col
          cols="12"
          md="4"
        >
          <v-autocomplete
            v-model="form.grade"
            dense
            density="compact"
            :items="gradeList"
            item-value="id"
            item-text="title"
            :rules="gradeRules"
            :error-messages="gradeErrors"
            label="Grade"
            variant="outlined"
            :disabled="!form.level"
          />
        </v-col>

        <v-col
          cols="12"
          md="4"
        >
          <v-select
            v-model="form.school"
            dense
            density="compact"
            :items="filteredSchoolList"
            item-value="id"
            item-title="name"
            :error-messages="schoolErrors"
            label="School"
            variant="outlined"
            :disabled="!form.city || !form.level"
            :loading="loadingSchools"
            clearable
            :no-data-text="loadingSchools ? 'Loading...' : 'No schools found'"
          >
            <template #prepend-item>
              <v-list-item>
                <v-text-field
                  ref="schoolSearchInput"
                  v-model="schoolSearchQuery"
                  density="compact"
                  variant="outlined"
                  placeholder="Search schools..."
                  hide-details
                  class="mb-2"
                  @click.stop="focusSchoolSearch"
                >
                  <template #prepend-inner>
                    <v-icon class="pointer">
                      mdi-magnify
                    </v-icon>
                  </template>
                </v-text-field>
              </v-list-item>
              <v-divider />
            </template>
          </v-select>
        </v-col>
      </v-row>
      <v-row>
        <v-divider class="my-3" />
        <v-col
          cols="12"
          md="6"
          class="pb-0"
        >
          <v-btn
            type="submit"
            lg
            color="success"
            block
            :disabled="!isFormValid"
            :loading="isSubmitting"
          >
            Submit
          </v-btn>
        </v-col>
        <v-col
          cols="12"
          md="6"
        >
          <v-btn
            lg
            outlined
            color="error"
            disabled
            block
          >
            Discard
          </v-btn>
        </v-col>
      </v-row>
    </v-form>
    <!-- Avatar Cropper Dialog -->
    <CommonCropperDialog
      v-model="cropperDialog"
      :file_url="cropAvatarUrl"
      :stencil_props="stencilProps"
      image-restriction="stencil"
      @cropped-data="confirmCrop"
    />
  </div>
</template>

<script setup lang="ts">
// Types
interface ListItem {
  id: number
  title: string
}

interface UserForm {
  first_name: string
  last_name: string
  gender: number | null
  state: number | null
  city: number | null
  level: number | null
  grade: number | null
  school: number | null
  avatar: File | null
  country: number | null
}

// Type for autocomplete items
interface AutocompleteItem {
  id: number
  title: string
}

// Type for school items (different structure from other autocomplete items)
interface SchoolItem {
  id: number
  name: string
  slug: string
  lat: number
  long: number
  cityTitle: string
  countryTitle: string
  stateTitle: string
  hasWebsite: boolean
  hasPhone: boolean
  hasEmail: boolean
  hasLocation: boolean
  lastModifyDate: string
  score: number | null
  defaultImageUri: string | null
  distance: number | null
}

// Define page meta
definePageMeta({
  layout: 'dashboard-layout',
  title: 'Edit Profile',
})

useHead({
  title: 'Edit Profile',
})

// Reactive data
const userData = useUser()
const { $toast } = useNuxtApp()
const userType = computed(() =>
  userData.user.value ? userData.user.value.group_id : null,
)

const form = reactive<UserForm>({
  first_name: '',
  last_name: '',
  gender: null,
  country: null,
  state: null,
  city: null,
  level: null,
  grade: null,
  school: null,
  avatar: null,
})
const formRef = ref()
const username = ref('')
const avatarUrl = ref('')
const cropAvatarUrl = ref('')
const cropAvatarLoading = ref(false)
const cropperDialog = ref(false)
const isSubmitting = ref(false)
const stencilProps = ref(() => ({ width: 180, height: 180 }))
const isFormValid = ref(true)
const genderList = ref<ListItem[]>([
  { id: 1, title: 'Male' },
  { id: 2, title: 'Female' },
])
const levelList = ref<ListItem[]>([])
const gradeList = ref<ListItem[]>([])
const schoolList = ref<SchoolItem[]>([])
const stateList = ref<ListItem[]>([])
const countryList = ref<ListItem[]>([])
const usernameErrors = ref<string[]>([])
const firstNameErrors = ref<string[]>([])
const lastNameErrors = ref<string[]>([])
const genderErrors = ref<string[]>([])
const stateErrors = ref<string[]>([])
const cityErrors = ref<string[]>([])
const levelErrors = ref<string[]>([])
const gradeErrors = ref<string[]>([])
const schoolErrors = ref<string[]>([])
const countryErrors = ref<string[]>([])
const loadingCountries = ref(false)
const loadingStates = ref(false)
const loadingCities = ref(false)
const loadingSchools = ref(false)
const countries = ref<AutocompleteItem[]>([])
const states = ref<AutocompleteItem[]>([])
const cities = ref<AutocompleteItem[]>([])
const schoolPage = ref(1)
const schoolPerPage = ref(20)
const schoolTotalCount = ref(0)
const schoolHasMore = ref(true)
const schoolSearchQuery = ref('')
const searchTimeout = ref<NodeJS.Timeout | null>(null)
const filteredSchoolList = computed(() => {
  return schoolList.value
})

watch(
  [
    () => form.first_name,
    () => form.last_name,
    () => form.gender,
    () => form.state,
    () => form.city,
    () => form.level,
    () => form.grade,
    () => form.school,
    () => username.value,
  ],
  async () => {
    if (formRef.value) {
      const { valid } = await formRef.value.validate()
      isFormValid.value = valid
    }
  },
  { deep: true },
)

// Validation rules
const usernameRules = [
  (v: string) => !!v || 'Username is required',
  (v: string) => v.length >= 3 || 'Username must be at least 3 characters',
  (v: string) => v.length <= 20 || 'Username must be less than 20 characters',
  (v: string) =>
    /^[a-zA-Z0-9_]+$/.test(v)
    || 'Username can only contain letters, numbers, and underscores',
]

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

const genderRules = [
  (v: number) => (v !== null && v !== undefined) || 'Gender is required',
]

const stateRules = [
  (v: string | number | null) =>
    (v !== null && v !== undefined && v !== '') || 'State is required',
]

const cityRules = [
  (v: string | number | null) =>
    (v !== null && v !== undefined && v !== '') || 'City is required',
]

const levelRules = [
  (v: string | number | null) =>
    (v !== null && v !== undefined && v !== '') || 'Board is required',
]

const gradeRules = [
  (v: string | number | null) =>
    (v !== null && v !== undefined && v !== '') || 'Grade is required',
]

const _schoolRules = [
  (v: string | number | null) =>
    (v !== null && v !== undefined && v !== '') || 'School is required',
]

const countryRules = [
  (v: string | number | null) =>
    (v !== null && v !== undefined && v !== '') || 'Country is required',
]

const avatarInput = ref<HTMLInputElement>()
const schoolSearchInput = ref<HTMLInputElement>()

const getUserInfo = async () => {
  try {
    const apiUrl
      = userType.value === 5
        ? '/api/v1/teachers/dashboard'
        : '/api/v1/students/dashboard'
    const response = await useApiService.get(apiUrl)

    const profileRes = await useApiService.get('/api/v2/identities/profiles')
    console.log('profileRes', profileRes.data)

    const userData = response.data.user
    avatarUrl.value = userData.avatar
    username.value = userData.username

    // Populate form with existing data
    if (userData.first_name) form.first_name = userData.first_name
    if (userData.last_name) form.last_name = userData.last_name
    if (userData.sex) form.gender = Number(userData.sex)
    if (profileRes.data.countryId) form.country = profileRes.data.countryId
    if (profileRes.data.stateId) form.state = profileRes.data.stateId
    if (profileRes.data.cityId) form.city = profileRes.data.cityId
    if (profileRes.data.schoolId) form.school = profileRes.data.schoolId

    if (userData.section) form.level = userData.section
    if (userData.grade) form.grade = userData.grade

    // Fetch dependent location data if we have country/state/city IDs
    if (profileRes.data.countryId) {
      await fetchStates(profileRes.data.countryId)
      if (profileRes.data.stateId) {
        await fetchCities(profileRes.data.stateId)
      }
    }
  }
  catch (err: unknown) {
    const error = err as { response?: { data?: { message?: string } } }
    $toast.error(
      error.response?.data?.message || 'Failed to load user information',
    )
  }
}

const submitProfile = async () => {
  const { valid } = await formRef.value.validate()
  isFormValid.value = valid

  if (valid) {
    isSubmitting.value = true
    try {
      const profilePayload = {
        countryId: form.country,
        stateId: form.state,
        cityId: form.city,
        schoolId: form.school,
        username: username.value,
        first_name: form.first_name,
        last_name: form.last_name,
        gender: form.gender,
        section: form.level,
        grade: form.grade,
        avatar: form.avatar,
      }
      const profileResponse = await useApiService.put(
        '/api/v2/identities/profiles',
        profilePayload,
      )
      if (profileResponse.succeeded) {
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
      isSubmitting.value = false
    }
  }
}

const getTypeList = async (type: string, parent: string | number = '') => {
  try {
    const params: Record<string, string | number> = { type }

    if (type === 'base') params.section_id = parent
    if (type === 'school') {
      params.section_id = form.level
      // params.area_id = form.area // Removed as area doesn't exist in UserForm
    }

    const res = await useApiService.get('/api/v1/types/list', params)
    console.log('res.data')
    console.log(res.data)

    switch (type) {
      case 'country':
        countryList.value = res.data
        break
      case 'section':
        levelList.value = res.data
        break
      case 'base':
        gradeList.value = res.data
        break
      case 'state':
        stateList.value = res.data
        break
      case 'school':
        schoolList.value = res.data
        break
    }
  }
  catch (err: unknown) {
    const error = err as { response?: { data?: { message?: string } } }
    $toast.error(
      error.response?.data?.message || `Failed to load ${type} list`,
    )
  }
}

const selectAvatar = () => {
  avatarInput.value?.click()
}

const uploadAvatar = () => {
  const file = form.avatar
  if (file) {
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      $toast.error('File size must be less than 5MB')
      return
    }

    cropAvatarLoading.value = true
    cropAvatarUrl.value = URL.createObjectURL(file)
    cropperDialog.value = true
  }
}

const confirmCrop = (url: Blob) => {
  avatarUrl.value = URL.createObjectURL(url)
  cropAvatarLoading.value = false
  cropperDialog.value = false
}

watch(
  () => form.level,
  (val) => {
    if (val) {
      getTypeList('base', val)
      form.grade = null // Reset grade when level changes
      form.school = null // Reset school when level changes
      if (form.city) {
        fetchSchools(true)
      }
    }
  },
)

watch(
  () => form.city,
  (val) => {
    if (val && form.level) {
      fetchSchools(true)
    }
    form.school = null // Reset school when city changes
  },
)

watch(
  () => schoolList.value,
  () => {
    if (schoolList.value.length === 0) {
      // Reset search query when school list is empty
      schoolSearchQuery.value = ''
    }
  },
)

async function handleCountryChange(countryId: number) {
  form.state = null
  form.city = null
  states.value = []
  cities.value = []
  if (countryId) {
    await fetchStates(countryId)
  }
}

async function handleStateChange(stateId: number) {
  form.city = null
  cities.value = []
  if (stateId) {
    await fetchCities(stateId)
  }
}

async function fetchCountries() {
  loadingCountries.value = true
  try {
    const response = await useApiService.get('/api/v2/locations/countries', {
      'PagingDto.PageFilter.Skip': 0,
      'PagingDto.PageFilter.Size': 1000,
      'PagingDto.PageFilter.ReturnTotalRecordsCount': true,
    })
    if (response.succeeded) {
      countries.value = response.data.list
    }
  }
  catch (error) {
    console.error('Failed to fetch countries:', error)
  }
  finally {
    loadingCountries.value = false
  }
}

async function fetchStates(countryId: number) {
  if (!countryId) return
  loadingStates.value = true
  try {
    const response = await useApiService.get(
      `/api/v2/locations/states/${countryId}`,
      {
        'PagingDto.PageFilter.Skip': 0,
        'PagingDto.PageFilter.Size': 1000,
        'PagingDto.PageFilter.ReturnTotalRecordsCount': true,
      },
    )
    if (response.succeeded) {
      states.value = response.data.list
    }
  }
  catch (error) {
    console.error('Failed to fetch states:', error)
  }
  finally {
    loadingStates.value = false
  }
}

async function fetchCities(stateId: number) {
  if (!stateId) return
  loadingCities.value = true
  try {
    const response = await useApiService.get(
      `/api/v2/locations/cities/${stateId}`,
      {
        'PagingDto.PageFilter.Skip': 0,
        'PagingDto.PageFilter.Size': 1000,
        'PagingDto.PageFilter.ReturnTotalRecordsCount': true,
      },
    )
    if (response.succeeded) {
      cities.value = response.data.list
    }
  }
  catch (error) {
    console.error('Failed to fetch cities:', error)
  }
  finally {
    loadingCities.value = false
  }
}

async function fetchSchools(reset = false) {
  if (!form.city || !form.level) return

  if (reset) {
    schoolPage.value = 1
    schoolList.value = []
    schoolHasMore.value = true
  }

  if (!schoolHasMore.value || loadingSchools.value) return

  loadingSchools.value = true
  try {
    const params = {
      'PagingDto.PageFilter.Skip': (schoolPage.value - 1) * schoolPerPage.value,
      'PagingDto.PageFilter.Size': schoolPerPage.value,
      'PagingDto.PageFilter.ReturnTotalRecordsCount': true,
      'CityId': form.city,
      'section': form.level,
    }

    // Add search parameter if search query exists
    if (schoolSearchQuery.value.trim()) {
      params.Name = schoolSearchQuery.value.trim()
    }

    const response = await useApiService.get('/api/v2/schools', params)

    if (response.succeeded) {
      const newSchools = response.data.list || []
      if (reset) {
        schoolList.value = newSchools
      }
      else {
        schoolList.value = [...schoolList.value, ...newSchools]
      }

      schoolTotalCount.value = response.data.totalCount || 0
      schoolHasMore.value = newSchools.length === schoolPerPage.value
    }
  }
  catch (error) {
    console.error('Failed to fetch schools:', error)
  }
  finally {
    loadingSchools.value = false
  }
}

watch(schoolSearchQuery, async (_newQuery) => {
  if (!form.city || !form.level) return

  if (searchTimeout.value) {
    clearTimeout(searchTimeout.value)
  }

  searchTimeout.value = setTimeout(async () => {
    schoolPage.value = 1
    schoolList.value = []
    schoolHasMore.value = true
    await fetchSchools(true)
  }, 300)
})
watch(
  () => [form.city, form.level],
  ([city, level]) => {
    if (city && level && schoolList.value.length === 0) {
      fetchSchools(true)
    }
  },
  { immediate: true },
)

function focusSchoolSearch() {
  schoolSearchInput.value?.focus()
}

onMounted(() => {
  fetchCountries()
  // getTypeList('country');
  getTypeList('section')
  // getTypeList('state');
  getUserInfo()
})

onUnmounted(() => {
  if (searchTimeout.value) {
    clearTimeout(searchTimeout.value)
  }
})
</script>

<style scoped>
.pointer {
  cursor: pointer;
}

.v-text-field :deep(.v-field--error) {
  --v-field-border-color: rgb(var(--v-theme-error));
}

.v-autocomplete :deep(.v-field--error) {
  --v-field-border-color: rgb(var(--v-theme-error));
}

/* Fix alignment for prepend and append elements */
.v-text-field :deep(.v-field__prepend-inner) {
  align-items: center;
  display: flex;
}

.v-text-field :deep(.v-field__append-inner) {
  align-items: center;
  display: flex;
}

/* Ensure consistent height for prepend/append elements */
.v-text-field :deep(.v-field__prepend-inner),
.v-text-field :deep(.v-field__append-inner) {
  height: 100%;
  min-height: 40px;
}
</style>
