<template>
  <v-dialog
    v-model="dialogModel"
    max-width="500"
    :fullscreen="!mdAndUp"
    @click="clickOnOverlay"
  >
    <div
      class="w-100 d-flex align-center flex-wrap flex-column bg-white pa-2 pa-sm-6 rounded-xl mobile-style"
      @click="clickOnModal"
    >
      <div class="w-100 d-none d-md-flex align-center justify-end">
        <v-icon
          class="ml-4"
          size="x-large"
          color="#D0D5DD"
          @click="closeModal"
        >
          md:cancel
        </v-icon>
      </div>
      <div class="w-100 d-flex justify-center align-center mt-4 pa-2 pa-md-4">
        <SchoolCardSchool :school="schoolInformation" />
      </div>

      <v-divider
        :thickness="2"
        class="w-100 mt-4 mb-6 border-opacity-100 max-width-contianer-modal"
        color="#E4E7EC"
      />

      <span
        class="w-100 text-h5 font-weight-bold primary-gray-700 max-width-contianer-modal"
      >A matching school was found!</span>

      <div class="w-100 d-flex justify-center align-center ga-2 mt-4">
        <v-btn
          color="#E4E7EC"
          variant="outlined"
          flat
          rounded="xl"
          height="40"
          max-width="180"
          class="w-50 text-h5"
          @click="newSchool"
        >
          <span class="primary-gray-700">New School</span>
        </v-btn>
        <v-btn
          color="#ffb600"
          flat
          rounded="xl"
          height="40"
          max-width="180"
          class="w-50 text-h5"
          :to="`/school/${schoolInformation.id}/${$slugGenerator(
            schoolInformation.name,
          )}`"
        >
          Edit School
        </v-btn>
      </div>
    </div>
  </v-dialog>
</template>

<script setup>
import { useDisplay } from 'vuetify'

const { $slugGenerator } = useNuxtApp()
const { mdAndUp } = useDisplay()

const props = defineProps({
  showDialog: {
    type: Boolean,
    default: false,
  },
  schoolInformation: {
    type: Object,
  },
})

const emit = defineEmits(['update:showDialog', 'newSchool'])

// Start Section Handle Status Modal
const dialogModel = computed({
  get: () => props.showDialog,
  set: value => emit('update:showDialog', value),
})

const closeModal = () => {
  emit('update:showDialog', false)
}
// End Section Handle Status Modal

const clickOnOverlay = () => {
  if (!mdAndUp.value) {
    emit('update:showDialog', false)
  }
}

const clickOnModal = (event) => {
  event.stopPropagation()
}

const newSchool = () => {
  emit('newSchool')
}
</script>

<style scoped>
.max-width-contianer-modal {
  max-width: 360px;
}
@media only screen and (max-width: 960px) {
  .mobile-style {
    position: absolute;
    bottom: 0;
    border-radius: 24px 24px 0 0 !important;
  }
}
</style>
