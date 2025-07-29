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
            class="d-flex pointer"
            outlined
            fab
            x-large
            @click="selectAvatar"
          >
            <v-icon>mdi-account-outline</v-icon>
          </v-btn>
          <div class="pa-3">
            <p
              class="text-h4 pointer"
              @click="selectAvatar"
            >
              <v-icon>mdi-pencil</v-icon>
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
                      <span class="mt-1">@</span>
                    </template>
                  </v-text-field>
                </v-col>
                <v-col
                  md="2"
                  sm="3"
                  cols="4"
                  class="pl-0"
                >
                  <v-btn
                    color="orange-darken-2"
                    size="large"
                    width="100%"
                    class="default mt-3"
                    type="submit"
                    absolute
                  >
                    Choose
                  </v-btn>
                </v-col>
              </v-row>
            </form>
          </v-col>
        </v-row>
      </v-col>
    </v-row>

    <form @submit.prevent="submitProfile">
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
            required
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
            required
          />
        </v-col>

        <v-col
          cols="12"
          md="4"
        >
          <v-autocomplete
            v-model="form.gender"
            dense
            density="compact"
            :rules="genderRules"
            :error-messages="genderErrors"
            :items="genderList"
            item-value="id"
            item-text="title"
            label="Gender"
            variant="outlined"
            required
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
            :items="countryList"
            item-text="title"
            item-value="id"
            :rules="countryRules"
            :error-messages="countryErrors"
            label="Country"
            variant="outlined"
            required
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
            :items="stateList"
            item-text="title"
            item-value="id"
            :rules="stateRules"
            :error-messages="stateErrors"
            :disabled="!form.country"
            label="State"
            variant="outlined"
            required
          />
        </v-col>

        <v-col
          cols="12"
          md="4"
        >
          <v-autocomplete
            v-model="form.area"
            dense
            density="compact"
            :items="areaList"
            item-text="title"
            item-value="id"
            :rules="areaRules"
            :error-messages="areaErrors"
            label="Area"
            variant="outlined"
            required
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
            required
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
            required
            :disabled="!form.level"
          />
        </v-col>

        <v-col
          cols="12"
          md="4"
        >
          <v-autocomplete
            v-model="form.school"
            dense
            density="compact"
            :items="schoolList"
            item-value="id"
            item-text="title"
            :error-messages="schoolErrors"
            label="School"
            variant="outlined"
            required
            :disabled="!form.area || !form.level"
          />
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
    </form>
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
  area: number | null
  level: number | null
  grade: number | null
  school: number | null
  avatar: File | null
  country: number | null
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
  state: null,
  area: null,
  level: null,
  grade: null,
  school: null,
  avatar: null,
  country: null,
})

const username = ref('')
const avatarUrl = ref('')
const cropAvatarUrl = ref('')
const cropAvatarLoading = ref(false)
const cropperDialog = ref(false)
const isSubmitting = ref(false)
const stencilProps = ref(() => ({ width: 180, height: 180 }))

// Lists
const genderList = ref<ListItem[]>([
  { id: 1, title: 'Male' },
  { id: 2, title: 'Female' },
])

const levelList = ref<ListItem[]>([])
const gradeList = ref<ListItem[]>([])
const schoolList = ref<ListItem[]>([])
const stateList = ref<ListItem[]>([])
const areaList = ref<ListItem[]>([])
const countryList = ref<ListItem[]>([])

// Error messages
const usernameErrors = ref<string[]>([])
const firstNameErrors = ref<string[]>([])
const lastNameErrors = ref<string[]>([])
const genderErrors = ref<string[]>([])
const stateErrors = ref<string[]>([])
const areaErrors = ref<string[]>([])
const levelErrors = ref<string[]>([])
const gradeErrors = ref<string[]>([])
const schoolErrors = ref<string[]>([])
const countryErrors = ref<string[]>([])

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
  (v: number) => (v !== null && v !== undefined) || 'State is required',
]

const areaRules = [
  (v: number) => (v !== null && v !== undefined) || 'Area is required',
]

const levelRules = [
  (v: number) => (v !== null && v !== undefined) || 'Board is required',
]

const gradeRules = [
  (v: number) => (v !== null && v !== undefined) || 'Grade is required',
]

const schoolRules = [
  (v: number) => (v !== null && v !== undefined) || 'School is required',
]

const countryRules = [
  (v: number) => (v !== null && v !== undefined) || 'Country is required',
]

// Computed
const _isUsernameValid = computed(() => {
  return (
    username.value.length >= 3
    && username.value.length <= 20
    && /^[a-zA-Z0-9_]+$/.test(username.value)
  )
})

const _fieldValid = computed(() => {
  return (
    form.first_name.length >= 2
    && form.last_name.length >= 2
    && form.gender !== null
    && form.state !== null
    && form.area !== null
    && form.level !== null
    && form.grade !== null
    && form.school !== null
    && form.country !== null
  )
})

const isFormValid = computed(() => {
  return (
    form.first_name.length >= 2
    && form.last_name.length >= 2
    && form.gender !== null
    && form.state !== null
    && form.area !== null
    && form.level !== null
    && form.grade !== null
  )
  //  form.school !== null;
})

// Template refs
const avatarInput = ref<HTMLInputElement>()

// Methods
const validateField = (field: string, value: string | number | null) => {
  const errorArrays: { [key: string]: Ref<string[]> } = {
    username: usernameErrors,
    first_name: firstNameErrors,
    last_name: lastNameErrors,
    gender: genderErrors,
    state: stateErrors,
    area: areaErrors,
    level: levelErrors,
    grade: gradeErrors,
    school: schoolErrors,
  }

  const rules: {
    [key: string]: ((value: string | number | null) => true | string)[]
  } = {
    username: usernameRules,
    first_name: firstNameRules,
    last_name: lastNameRules,
    gender: genderRules,
    state: stateRules,
    area: areaRules,
    level: levelRules,
    grade: gradeRules,
    school: schoolRules,
  }

  const errors: string[] = []
  const fieldRules = rules[field]

  if (fieldRules) {
    fieldRules.forEach(
      (rule: (value: string | number | null) => true | string) => {
        const result = rule(value)
        if (result !== true) {
          errors.push(result)
        }
      },
    )
  }

  errorArrays[field].value = errors
  return errors.length === 0
}

const getUserInfo = async () => {
  try {
    const apiUrl
      = userType.value === 5
        ? '/api/v1/teachers/dashboard'
        : '/api/v1/students/dashboard'
    const response = await useApiService.get(apiUrl)

    console.log(response)

    const userData = response.data.user
    avatarUrl.value = userData.avatar
    username.value = userData.username

    // Populate form with existing data
    if (userData.first_name) form.first_name = userData.first_name
    if (userData.last_name) form.last_name = userData.last_name
    if (userData.gender) form.gender = userData.gender
    if (userData.state) form.state = userData.state
    if (userData.area) form.area = userData.area
    if (userData.level) form.level = userData.level
    if (userData.grade) form.grade = userData.grade
    if (userData.school) form.school = userData.school
  }
  catch (err: unknown) {
    const error = err as { response?: { data?: { message?: string } } }
    $toast.error(
      error.response?.data?.message || 'Failed to load user information',
    )
  }
}

const submitProfile = async () => {
  // Validate all fields
  const isValid = true
  Object.keys(form).forEach((key) => {
    if (key !== 'avatar') {
      const _fieldValid = validateField(key, form[key as keyof UserForm])
      // if (!_fieldValid) isValid = false;
    }
  })

  if (!isValid) {
    $toast.error('Please fix the validation errors')
    return
  }

  isSubmitting.value = true
  $toast.success('Profile updated successfully')
  isSubmitting.value = false

  // try {
  //   const apiUrl = userType.value === 5 ? "/api/v1/teachers/profile" : "/api/v1/students/profile";
  //   await useApiService.patch(apiUrl, {
  //     body: form
  //   });

  //   $toast.success("Profile updated successfully");
  //   // Redirect or update UI as needed
  // } catch (err: any) {
  //   $toast.error(err.response?.data?.message || "Failed to update profile");
  // } finally {
  //   isSubmitting.value = false;
  // }
}

// const updateUsername = async () => {
//   if (!validateField('username', username.value)) {
//     return;
//   }

//   try {
//     await useApiService.post('/api/v1/user/username', {
//       body: { username: username.value }
//     });

//     $toast.success("Username updated successfully");
//   } catch (err: any) {
//     $toast.error(err.response?.data?.message || "Failed to update username");
//   }
// };

const getTypeList = async (type: string, parent: string | number = '') => {
  try {
    const params: Record<string, string | number> = { type }

    if (type === 'base') params.section_id = parent
    if (type === 'area') params.state_id = parent
    if (type === 'school') {
      params.section_id = form.level
      params.area_id = form.area
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
      case 'area':
        areaList.value = res.data
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

// Watchers
watch(
  () => form.level,
  (val) => {
    if (val) {
      getTypeList('base', val)
      form.grade = null // Reset grade when level changes
      if (form.area) getTypeList('school')
    }
  },
)

watch(
  () => form.state,
  (val) => {
    console.log('it changed')

    if (val) {
      getTypeList('area', val)
      form.area = null // Reset area when state changes
    }
  },
)

watch(
  () => form.area,
  (val) => {
    if (val && form.level) {
      getTypeList('school')
    }
    form.school = null // Reset school when area changes
  },
)

// Watch for form changes and validate
watch(
  () => form.first_name,
  val => validateField('first_name', val),
)
watch(
  () => form.last_name,
  val => validateField('last_name', val),
)
watch(
  () => form.gender,
  val => validateField('gender', val),
)
watch(
  () => form.state,
  val => validateField('state', val),
)
watch(
  () => form.area,
  val => validateField('area', val),
)
watch(
  () => form.level,
  val => validateField('level', val),
)
watch(
  () => form.grade,
  val => validateField('grade', val),
)
watch(
  () => form.school,
  val => validateField('school', val),
)
watch(
  () => username.value,
  val => validateField('username', val),
)

// Lifecycle
onMounted(() => {
  getTypeList('country')
  getTypeList('section')
  getTypeList('state')
  getUserInfo()
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
</style>
