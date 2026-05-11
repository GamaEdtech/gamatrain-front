<template>
  <v-dialog
    v-model="dialogModel"
    :fullscreen="!mdAndUp"
    max-width="400"
    @click="clickOnOverlay"
  >
    <div
      class="w-100 d-flex flex-column overflow-y-auto bg-white pa-6 rounded-xl mobile-style"
      @click="clickOnModal"
    >
      <v-row class="d-flex align-center">
        <v-col cols="10">
          <span class="text-h4">Photo Source</span>
        </v-col>
        <v-col
          cols="2"
          class="d-flex align-center justify-end ga-2"
        >
          <v-icon
            size="x-large"
            color="#D0D5DD"
            @click="closeModal"
          >
            md:close
          </v-icon>
        </v-col>
      </v-row>

      <div class="w-100 d-flex flex-column align-center justify-center mt-8 ga-6">
        <span class="w-100 text-start text-h5 font-weight-medium text-grey700">Choose how you want to upload your photo.</span>
        <div class="w-100 d-flex justify-center ga-4">
          <div class="d-flex flex-column align-center justify-center ga-1 text-h6 font-weight-bold text-grey700">
            <div
              class="option-div cursor-pointer bg-primary rounded-lg d-flex align-center justify-center pa-2"
              @click="openCamera"
            >
              <v-icon
                color="grey700"
                size="30"
              >
                md:mobile_camera
              </v-icon>
            </div>
            Camera
          </div>
          <div class="d-flex flex-column align-center justify-center ga-1 text-h6 font-weight-bold text-grey700">
            <div
              class="option-div cursor-pointer bg-primary rounded-lg d-flex align-center justify-center pa-2"
              @click="openFile"
            >
              <v-icon
                color="grey700"
                size="30"
              >
                md:file_present
              </v-icon>
            </div>
            File
          </div>
        </div>
      </div>
    </div>
    <input
      ref="cameraInput"
      type="file"
      accept="image/*"
      capture="environment"
      class="d-none"
      @change="handleFileChange"
    >
  </v-dialog>
</template>

<script setup lang="ts">
import { useDisplay } from 'vuetify'

interface IPhotoSourceSelector {
  showDialog: boolean
}

const { mdAndUp } = useDisplay()

const props = defineProps<IPhotoSourceSelector>()
const emit = defineEmits(['update:showDialog', 'openFileSystem', 'sendFileCamera'])

const dialogModel = computed({
  get: () => props.showDialog,
  set: value => emit('update:showDialog', value),
})

const closeModal = () => {
  emit('update:showDialog', false)
}

const clickOnOverlay = () => {
  if (!mdAndUp.value) {
    emit('update:showDialog', false)
  }
}

const clickOnModal = (event: MouseEvent) => {
  event.stopPropagation()
}

const cameraInput = ref<HTMLInputElement | null>(null)

const openFile = () => {
  emit('openFileSystem')
  emit('update:showDialog', false)
}
const openCamera = async () => {
  try {
    cameraInput.value?.click()
  }
  catch (error) {
    emit('openFileSystem')
    emit('update:showDialog', false)
    console.log(error)
  }
}

const handleFileChange = (event: Event): void => {
  const target = event.target as HTMLInputElement

  if (!target.files || !target.files[0]) {
    return
  }

  const file = target.files[0]
  emit('sendFileCamera', file)
  emit('update:showDialog', false)
}
</script>

<style scoped>
@media only screen and (max-width: 960px) {
  .mobile-style {
    max-height: 100%;
    position: absolute;
    bottom: 0;
    border-radius: 24px 24px 0 0 !important;
  }
}
</style>
