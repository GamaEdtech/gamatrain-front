<template>
  <v-form
    v-model="isFormValid"
    class="w-100 d-flex flex-column pa-4"
  >
    <div class="w-100 d-flex flex-column align-start">
      <div class="w-100 d-flex align-center justify-center">
        <div class="image-div rounded-circle position-relative d-flex align-center justify-center">
          <v-file-input
            ref="avatarInputRef"
            v-model="user.avatarFile"
            class="d-none"
            accept="image/png,image/webp,image/jpeg"
            @change="uploadAvatar"
          />
          <img
            :src="user.avatarUrl ? user.avatarUrl : `/images/default-user.svg`"
            alt="Profile Avatar"
            class="profile-img rounded-circle"
            width="90"
            height="90"
          >

          <v-btn
            color="grey700"
            flat
            icon
            size="32"
            class="position-absolute camera-button"
            @click="changeUserAvatar"
          >
            <v-icon
              color="white"
              size="14"
            >
              md:photo_camera
            </v-icon>
          </v-btn>
        </div>
      </div>
      <div class="w-100 d-flex flex-column align-start justify-start ga-1 mt-6">
        <div class="text-h6 text-grey700 font-weight-medium ml-2">
          Handle
        </div>
        <v-text-field
          v-model="user.handle"
          rounded="pill"
          height="48"
          placeholder="Enter..."
          variant="outlined"
          autocomplete="off"
          persistent-clear
          base-color="grey200"
          color="primary"
          active-color="primary"
          bg-color="white"
          class="w-100"
          :rules="[required, minLength(2), maxLength(50)]"
        />
      </div>
      <div class="w-100 d-flex flex-column align-start justify-start ga-1 mt-6">
        <div class="text-h6 text-grey700 font-weight-medium ml-2">
          First name
        </div>
        <v-text-field
          v-model="user.firstName"
          rounded="pill"
          height="48"
          placeholder="Enter..."
          variant="outlined"
          autocomplete="off"
          persistent-clear
          base-color="grey200"
          color="primary"
          active-color="primary"
          bg-color="white"
          class="w-100"
          :rules="[required, minLength(2), maxLength(50), alphabetic]"
        />
      </div>
      <div class="w-100 d-flex flex-column align-start justify-start ga-1">
        <div class="text-h6 text-grey700 font-weight-medium ml-2">
          Last name
        </div>
        <v-text-field
          v-model="user.lastName"
          rounded="pill"
          height="48"
          placeholder="Enter..."
          variant="outlined"
          autocomplete="off"
          persistent-clear
          base-color="grey200"
          color="primary"
          active-color="primary"
          bg-color="white"
          class="w-100"
          :rules="[required, minLength(2), maxLength(50), alphabetic]"
        />
      </div>

      <div class="w-100 d-flex flex-column align-start justify-start ga-1">
        <div class="text-h6 text-grey700 font-weight-medium ml-2">
          Gender
        </div>
        <div class="btn-gender-container w-100 flex align-center justify-center ga-1 bg-grey100 pa-1 rounded-pill">
          <v-btn
            v-for="gender in genderList"
            :key="gender"
            rounded="pill"
            :color="gender == user.gender ? `white`:`transparent`"
            flat
            height="26"
            class="w-50"
            @click="changeGender(gender as Gender)"
          >
            <v-icon
              size="16"
              :color="`${gender == user.gender ? `grey700`:`grey400`}`"
            >
              {{ gender == 'Male' ? 'md:man':'md:woman' }}
            </v-icon>
          </v-btn>
        </div>
      </div>

      <span class="text-h5 text-grey500 font-weight-regular mt-12 d-flex align-center ga-4">
        <v-icon size="16">md:location_on</v-icon>
        Location
      </span>

      <div class="w-100 d-flex flex-column align-start justify-start ga-1 mt-4">
        <common-gombo-box
          v-model="user.country"
          label="Country"
          :items="countries"
          :data-loading="loadingCountries"
          rounded="pill"
          height="48"
          base-color="grey200"
          color="primary"
          :defalut-lable="false"
          @update:model-value="countyChange"
        />
      </div>

      <div class="w-100 d-flex flex-column align-start justify-start ga-1 mt-4">
        <common-gombo-box
          v-model="user.state"
          label="State"
          :items="states"
          :data-loading="loadingStates || loadingCountries"
          rounded="pill"
          height="48"
          base-color="grey200"
          color="primary"
          :defalut-lable="false"
          :disabled="!user.country || loadingCountries"
          @update:model-value="stateChange"
        />
      </div>

      <div class="w-100 d-flex flex-column align-start justify-start ga-1 mt-4">
        <common-gombo-box
          v-model="user.city"
          label="City"
          :items="cities"
          :data-loading="loadingCities || loadingStates || loadingCountries"
          rounded="pill"
          height="48"
          base-color="grey200"
          color="primary"
          :defalut-lable="false"
          :disabled="!user.state || loadingCountries || loadingStates"
          @update:model-value="cityChange"
        />
      </div>

      <span class="text-h5 text-grey500 font-weight-regular mt-12 d-flex align-center ga-4">
        <v-icon size="16">md:school</v-icon>
        School category
      </span>

      <div class="w-100 d-flex flex-column align-start justify-start ga-1 mt-4">
        <common-gombo-box
          v-model="user.board"
          label="Board"
          :items="boards?.map((board) => {
            return {
              id: board.code,
              title: board.title,
            }
          })"
          :data-loading="loadingBoards"
          rounded="pill"
          height="48"
          base-color="grey200"
          color="primary"
          :defalut-lable="false"
          @update:model-value="boardChange"
        />
      </div>

      <div class="w-100 d-flex flex-column align-start justify-start ga-1 mt-4">
        <common-gombo-box
          v-model="user.grade"
          label="Grade"
          :items="grades?.map((item) => {
            return {
              id: item.id,
              title: item.title,
            }
          })"
          :data-loading="loadingBoards || loadingGrade"
          rounded="pill"
          height="48"
          base-color="grey200"
          color="primary"
          :defalut-lable="false"
          :disabled="!user.board || loadingGrade"
          @update:model-value="gradeChange"
        />
      </div>
    </div>
    <div class="w-100 d-flex flex-column align-start justify-start ga-1 mt-4">
      <common-gombo-box
        v-model="user.school"
        label="School"
        :items="schools.map((item) => {
          return {
            id: item.id,
            title: item.name,
          }
        })"
        :data-loading="loadingSchools || loadingCities || loadingCountries || loadingStates"
        rounded="pill"
        height="48"
        base-color="grey200"
        color="primary"
        :defalut-lable="false"
        :disabled="!user.city || loadingCities"
        :infinite-loading="true"
        :loading-more="loadingMoreSchool"
        :has-more-items="hasMoreItemsSchool"
        @load-more="loadMoreSchool"
      />
    </div>
    <div class="w-100 d-flex justify-center align-center ga-2 mt-16">
      <v-btn
        color="grey200"
        variant="outlined"
        rounded="pill"
        height="38"
        width="80"
        class="text-h5 font-weight-medium"
        flat
        :loading="loadingEditItem"
        @click="closeModal"
      >
        <span class="text-grey800">
          Discard
        </span>
      </v-btn>
      <v-btn
        color="primary"
        rounded="pill"
        height="38"
        width="220"
        class="text-h5 text-grey800 font-weight-medium"
        flat
        :loading="loadingEditItem"
        :disabled="!isFormValid"
        @click="save"
      >
        Submit
      </v-btn>
    </div>
    <common-cropper-dialog
      v-model="showCropperDialog"
      :file-url="cropAvatarUrl"
      :stencil-props="stencilProps"
      @cropped-data="confirmCrop"
    />
  </v-form>
</template>

<script setup lang="ts">
import type { User, Gender, EditProfileDTO } from '@/types'

interface IModalPersonal {
  data: User | null
}
interface IPersonalData {
  avatarFile: File | null
  avatarUrl: string
  handle: string
  firstName: string
  lastName: string
  gender: string
  country: string | number
  state: string | number
  city: string | number
  board: string | number
  grade: string | number
  school: string | number
}

const props = defineProps<IModalPersonal>()
const emit = defineEmits(['close', 'success'])

const { $toast } = useNuxtApp()
const {
  required,
  minLength,
  maxLength,
  alphabetic,
} = useValidationRules()
const { editItem, loadingEditItem } = useProfile()
const { countries,
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
  loadingGetData: loadingBoards, data: boards, getData: getBoards, resetBoards, getGrades, grades, loadingGrade, resetGrades,
} = useBoard()

const pageSchool = ref(1)
const pageSizeSchool = 50
const { loadingGetData: loadingSchools, data: schools, getData: getSchools, resetData: resetSchools, loadingMore: loadingMoreSchool, hasMoreItems: hasMoreItemsSchool } = useSchool()

const isFormValid = ref(false)

const closeModal = () => {
  emit('close')
}

const user = ref<IPersonalData>({
  avatarFile: null,
  avatarUrl: props.data?.avatarUri ?? '',
  handle: props.data?.handle ?? '',
  firstName: props.data?.firstName ?? '',
  lastName: props.data?.lastName ?? '',
  gender: props.data?.gender ?? 'Male',
  country: props.data?.countryId ?? '',
  state: props.data?.stateId ?? '',
  city: props.data?.cityId ?? '',
  board: props.data?.board ?? '',
  grade: props.data?.grade ?? '',
  school: props.data?.schoolId ?? '',
})
const avatarInputRef = ref<HTMLInputElement | null>(null)
const cropAvatarUrl = ref('')
const showCropperDialog = ref(false)
const stencilProps = { width: 100, height: 100, resizable: true }
const genderList = ['Male', 'Female']

const changeGender = (gender: Gender) => {
  user.value.gender = gender
}

const changeUserAvatar = () => {
  avatarInputRef.value?.click()
}
const uploadAvatar = () => {
  const file = user.value.avatarFile
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
  user.value.avatarUrl = URL.createObjectURL(dataCroped)
  showCropperDialog.value = false
  const timestamp = new Date().getTime()
  const fileType = 'image/webp'
  const fileExt = 'webp'
  const filename = `image_${timestamp}.${fileExt}`
  const file = new File([dataCroped], filename, { type: fileType })
  user.value.avatarFile = file
}

// Location Info
const countyChange = async (countryId: number | string) => {
  user.value.country = countryId
  user.value.state = ''
  user.value.city = ''
  user.value.school = ''
  resetStates()
  resetCities()
  resetSchools()

  if (countryId) {
    await getStates(countryId)
  }
}

const stateChange = async (stateId: number | string) => {
  user.value.state = stateId
  user.value.city = ''
  user.value.school = ''
  resetCities()
  resetSchools()

  if (stateId) {
    await getCities(stateId)
  }
}

const cityChange = async (cityId: number | string) => {
  user.value.city = cityId
  user.value.school = ''
  resetSchools()
  if (cityId) {
    await getSchools({
      page: pageSchool.value,
      pageSize: pageSizeSchool,
      countryId: user.value.country as number,
      stateId: user.value.state as number,
      cityId: Number(cityId),
    })
  }
}

const boardChange = async (boardId: number | string) => {
  user.value.board = boardId
  user.value.grade = ''
  resetGrades()
  if (boardId) {
    await getGrades(boardId)
  }
}

const gradeChange = async (gradeId: number | string) => {
  user.value.grade = gradeId
}

const loadMoreSchool = async () => {
  pageSchool.value += 1
  await getSchools({
    page: pageSchool.value,
    pageSize: pageSizeSchool,
    countryId: user.value.country as number,
    stateId: user.value.state as number,
    cityId: user.value.city as number,
  }, { append: true })
}

onMounted(async () => {
  await getCountries()
  if (user.value.country) {
    await getStates(user.value.country)
  }
  if (user.value.state) {
    await getCities(user.value.state)
  }

  await getBoards()
  if (user.value.board) {
    await getGrades(user.value.board)
  }
  if (user.value.city) {
    await getSchools({
      page: pageSchool.value,
      pageSize: pageSizeSchool,
      countryId: user.value.country as number,
      stateId: user.value.state as number,
      cityId: user.value.city as number,
    })
  }
})

onUnmounted(() => {
  resetCountries()
  resetStates()
  resetCities()
  resetBoards()
  resetGrades()
  resetSchools()
})

const save = async () => {
  const data: EditProfileDTO = {
    countryId: user.value.country as number,
    stateId: user.value.state as number,
    cityId: user.value.city as number,
    schoolId: user.value.school as number,
    handle: user.value.handle,
    firstName: user.value.firstName,
    lastName: user.value.lastName,
    board: user.value.board as number,
    grade: user.value.grade as number,
    gender: user.value.gender as Gender,
  }
  if (user.value.avatarFile) {
    data.avatar = user.value.avatarFile
  }
  const response = await editItem(data)

  if (response?.succeeded) {
    emit('success', data)
    emit('close')
  }
}
</script>

<style scoped>
.image-div{
  width : 100px;
  height : 100px;
  border : 2px solid transparent;
  background : linear-gradient(180deg,rgb(var(--v-theme-white)) 50%, rgb(var(--v-theme-white)) 50%) padding-box,
  linear-gradient(to right, rgb(var(--v-theme-grey700)) ,rgb(var(--v-theme-primary))) border-box
}
.camera-button{
  bottom : -16px
}
.btn-gender-container{
  height : 34px;
  max-width : 420px;
}
</style>
