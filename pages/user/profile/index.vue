<template>
  <v-container class="w-100 d-flex flex-column margin-top-handle">
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

        <img
          v-if="userInformation.avatarUrl"
          width="72"
          height="72"
          class="pointer rounded-pill"
          :src="userInformation.avatarUrl"
          @click="changeUserAvatar"
        >
        <v-btn
          v-if="!userInformation.avatarUrl"
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
          v-model="userInformation.first_name"
          density="compact"
          variant="outlined"
          :rules="firstNameRules"
          label="First name"
          outlined
          rounded="lg"
          color="#FFB600"
        />
      </v-col>

      <v-col
        cols="12"
        md="4"
      >
        <v-text-field
          v-model="userInformation.last_name"
          density="compact"
          variant="outlined"
          :rules="lastNameRules"
          label="Last name"
          outlined
          rounded="lg"
          color="#FFB600"
        />
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
        />
        <!-- <v-select
          v-model="userInformation.gender"
          density="compact"
          :rules="genderRules"
          :items="genderList"
          item-value="id"
          item-title="title"
          label="Gender"
          variant="outlined"
          rounded="lg"
          color="#FFB600"
        /> -->
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
import { CommonCustomSelectField } from '#components'

interface ListItem {
  id: number
  title: string
}
interface UserInfo {
  avatarFile: File | null
  avatarUrl: string | null
  first_name: string
  last_name: string
  gender: ListItem | null
}

const { $toast } = useNuxtApp()

const userInformation = ref<UserInfo>({
  avatarFile: null,
  avatarUrl: null,
  first_name: '',
  last_name: '',
  gender: null,
})

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

// const genderRules = [
//   (v: number) => (v !== null && v !== undefined) || 'Gender is required',
// ]

const genderList = ref<ListItem[]>([
  { id: 1, title: 'Male' },
  { id: 2, title: 'Female' },
])

const avatarInputRef = ref<HTMLInputElement | null>(null)
const cropAvatarUrl = ref('')
const showCropperDialog = ref(false)
const stencilProps = { width: 180, height: 180, resizable: true }
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
</script>

<style scoped>
.margin-top-handle {
  margin-top: 64px;
}

@media (min-width: 960px) {
  .margin-top-handle {
    margin-top: 6.4rem;
  }
}
</style>
