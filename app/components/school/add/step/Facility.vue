<template>
  <div
    class="w-100 d-flex flex-column align-center justify-space-between ga-1 max-width-container"
  >
    <div class="w-100 d-flex flex-column align-center justify-start ga-2">
      <div class="w-100 text-h4 primary-gray-500">
        School Facilities
      </div>

      <div class="w-100 d-flex flex-wrap">
        <template v-for="loader in 6">
          <div
            v-if="isLoadingTag"
            :key="loader"
            class="w-100 w-sm-50 d-flex align-center pt-6 pb-6 ga-2"
          >
            <v-skeleton-loader
              width="48"
              height="48"
              class="bg-transparent rounded-circle"
            />

            <v-skeleton-loader
              width="90"
              height="16"
              class="bg-transparent rounded-lg"
            />
          </div>
        </template>
        <template v-if="!isLoadingTag">
          <div
            v-for="(tag, index) in tags"
            :key="index"
            class="w-100 w-sm-50 d-flex align-center pt-6 pb-6 ga-2"
            @click="chooseTag(tag)"
          >
            <v-btn
              icon
              flat
              :color="selectedTags.includes(tag.id) ? `#344054` : `#D0D5DD`"
              width="48"
              height="48"
            >
              <v-icon
                size="x-large"
                color="#ffffff"
              >
                {{ "md:" + tag.icon }}
              </v-icon>
            </v-btn>
            <span class="font-weight-bold text-h5 primary-gray-900">{{
              tag.name
            }}</span>
          </div>
        </template>
      </div>

      <div class="w-100 d-flex flex-wrap">
        <span class="w-100 text-h4 text-grey500">Boards</span>
        <div
          v-if="isLoadingBoard"
          class="w-100 d-flex flex-wrap align-center my-6 ga-2"
        >
          <v-skeleton-loader
            width="100"
            height="48"
            class="bg-transparent rounded-lg"
          />
          <v-skeleton-loader
            width="110"
            height="48"
            class="bg-transparent rounded-lg"
          />
          <v-skeleton-loader
            width="90"
            height="48"
            class="bg-transparent rounded-lg"
          />
          <v-skeleton-loader
            width="120"
            height="48"
            class="bg-transparent rounded-lg"
          />
          <v-skeleton-loader
            width="90"
            height="48"
            class="bg-transparent rounded-lg"
          />
          <v-skeleton-loader
            width="84"
            height="48"
            class="bg-transparent rounded-lg"
          />
        </div>
        <template v-else>
          <div
            class="w-100 d-flex flex-wrap align-center my-6 ga-2"
          >
            <v-btn
              v-for="(board, index) in boards"
              :key="index"
              flat
              :color="selectedBoards.includes(board.id) ? `grey700` : `grey300`"
              height="48"
              rounded="lg"
              @click="chooseBoard(board)"
            >
              <img
                :src="board.img"
                :alt="board.title"
                width="26"
                height="26"
                class="mr-1"
              >
              <span :class="`font-weight-bold text-h5 ${selectedBoards.includes(board.id) ? `text-grey300`:`text-grey900`}`">{{
                board.title
              }}</span>
            </v-btn>
          </div>
        </template>
      </div>

      <div class="w-100 d-flex flex-column align-start justify-start ga-1">
        <div
          class="d-flex align-center justify-center w-100 container-image-school rounded-lg mt-2 ml-2"
        >
          <template v-if="schoolImage">
            <div
              class="w-100 h-100 d-flex align-center justify-center position-relative"
            >
              <img
                class="w-100 h-100 rounded-lg"
                :src="previewImageSchool"
                alt="School image Preview"
              >
              <div
                class="upload-overlay w-100 h-100 d-flex align-center justify-center rounded-lg position-absolute px-3"
              >
                <v-btn
                  icon
                  color="error"
                  size="small"
                  @click="clearImageSchool"
                >
                  <v-icon size="x-large">
                    md:delete_forever
                  </v-icon>
                </v-btn>
              </div>
            </div>
          </template>
          <template v-else>
            <div
              class="w-100 h-100 d-flex flex-column align-center justify-center pointer"
              @click="openSchoolImgInput"
            >
              <v-icon
                size="x-large"
                class="primary-blue-500 mb-4"
              >
                md:cloud_upload
              </v-icon>
              <div class="text-h5 font-weight-bold primary-blue-500">
                Upload Image
              </div>
              <div
                class="text-h6 font-weight-normal text-center mt-2 primary-gray-400"
              >
                Accepted formats: JPG, PNG, WebP
              </div>
            </div>
          </template>
        </div>

        <v-file-input
          ref="schoolImgRef"
          class="d-none"
          accept="image/jpeg, image/png, image/jpg, image/webp"
          hide-details
          @update:model-value="validateAndProcessImage"
        />
        <common-cropper-dialog
          v-model="showCropperDialog"
          :file-url="cropFileUrl"
          @cropped-data="croppedData"
        />
      </div>
    </div>

    <div class="w-100 d-flex align-center justify-center ga-3 mt-6">
      <v-btn
        size="x-small"
        variant="text"
        class="text-h5"
        @click="cancel"
      >
        Cancel
      </v-btn>
      <v-btn
        icon
        color="#1D2939"
        height="40"
        width="40"
        flat
        @click="preStep"
      >
        <v-icon size="x-large">
          md:arrow_back
        </v-icon>
      </v-btn>
      <v-btn
        color="#ffb600"
        flat
        rounded="xl"
        height="40"
        max-width="180"
        class="w-100 text-h5"
        :disabled="!isFormValid"
        @click="submitForm"
      >
        Confirm
      </v-btn>
    </div>
  </div>
</template>

<script setup>
const nuxtApp = useNuxtApp()
const router = useRouter()
const { boardImgs } = useBoard()

const emit = defineEmits(['nextStep', 'prevStep'])

onMounted(async () => {
  await Promise.allSettled([
    getTags(),
    getBoards(),
  ])
})

const isLoadingTag = ref(true)
const selectedTags = ref([])
const tags = ref([])

const getTags = async () => {
  try {
    isLoadingTag.value = true
    const endpoint = '/api/v2/tags/School'
    const response = await useApiService.get(endpoint)
    tags.value = response.data
  }
  catch (err) {
    console.error('Error fetching location data:', err)
  }
  finally {
    isLoadingTag.value = false
  }
}

const chooseTag = (tag) => {
  if (selectedTags.value.includes(tag.id)) {
    selectedTags.value = selectedTags.value.filter(id => id !== tag.id)
  }
  else {
    selectedTags.value.push(tag.id)
  }
}

const isLoadingBoard = ref(true)
const selectedBoards = ref([])
const boards = ref([])

const getBoards = async () => {
  try {
    isLoadingBoard.value = true
    const responseBoard = await useApiService.get(
      '/api/v1/types/list/?type=section',
    )
    if (responseBoard.data) {
      boards.value = responseBoard.data.map((item, index) => ({
        ...item,
        img: boardImgs[index % boardImgs.length],
      }))
    }
  }
  catch (error) {
    console.error('error', error)
  }
  finally {
    isLoadingBoard.value = false
  }
}

const chooseBoard = (board) => {
  if (selectedBoards.value.includes(board.id)) {
    selectedBoards.value = selectedBoards.value.filter(id => id !== board.id)
  }
  else {
    selectedBoards.value.push(board.id)
  }
}

const schoolImage = ref(null)
const schoolImgRef = ref(null)
const previewImageSchool = ref(null)

const showCropperDialog = ref(false)
const cropFileUrl = ref('')

const croppedData = (data) => {
  showCropperDialog.value = false
  const timestamp = new Date().getTime()
  const fileType = 'image/webp'
  const fileExt = 'webp'
  const filename = `image_${timestamp}.${fileExt}`
  const file = new File([data], filename, { type: fileType })
  schoolImage.value = file
  previewImageSchool.value = URL.createObjectURL(file)
}

const validateAndProcessImage = (file) => {
  if (!file) return
  const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp']

  if (!validTypes.includes(file.type)) {
    nuxtApp.$toast?.error(
      'Invalid file type. Please use JPG, PNG or WebP images.',
    )
    schoolImage.value = null
    return
  }
  const maxSize = 5 * 1024 * 1024
  if (file.size > maxSize) {
    nuxtApp.$toast?.error('File too large. Maximum size is 5MB.')
    schoolImage.value = null
    return
  }
  cropFileUrl.value = URL.createObjectURL(file)
  showCropperDialog.value = true
}
const openSchoolImgInput = () => {
  if (schoolImgRef.value) {
    schoolImgRef.value.click()
  }
}
const clearImageSchool = () => {
  schoolImage.value = null
  previewImageSchool.value = null
}

const isFormValid = computed(() => {
  return true
  // return schoolImage.value != null
})
const submitForm = () => {
  if (isFormValid.value) {
    const facilityStepInfo = {
      tags: [...selectedTags.value],
      file: schoolImage.value,
      BoardCodes: [...selectedBoards.value],
    }
    emit('nextStep', facilityStepInfo)
  }
}

const preStep = () => {
  emit('prevStep')
}

const cancel = () => {
  router.push('/school')
}
</script>

<style scoped>
.max-width-container {
  max-width: 500px;
}
.container-image-school {
  max-width: 260px;
  height: 180px;
  background-color: #d0d5dd;
}
.upload-overlay {
  background-color: rgba(0, 0, 0, 0.4);
}
</style>
