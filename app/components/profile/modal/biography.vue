<template>
  <v-form
    v-model="isFormValid"
    class="w-100 d-flex flex-column pa-4"
  >
    <div class="w-100 d-flex flex-column align-start">
      <div class="w-100 d-flex flex-column align-start justify-start ga-1">
        <div class="text-h6 text-grey700 font-weight-bold ml-2">
          Bio
        </div>
        <v-text-field
          v-model="biography"
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
          :rules="biographyRules"
          :counter="200"
        />
      </div>
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
  </v-form>
</template>

<script setup lang="ts">
interface IModalBiography {
  bio: string
}

const props = defineProps<IModalBiography>()
const emit = defineEmits(['close', 'success'])

const {
  requiredWithMessage,
  maxLength,
} = useValidationRules()
const { editItem, loadingEditItem } = useProfile()

const biography = ref(props.bio)
const biographyRules = [
  requiredWithMessage('Biography is required'),
  maxLength(200),
]
const isFormValid = ref(false)

const closeModal = () => {
  emit('close')
}

const save = async () => {
  const response = await editItem({
    biography: biography.value.trim(),
  })

  if (response?.succeeded) {
    emit('success', {
      biography: biography.value.trim(),
    })
    emit('close')
  }
}
</script>

<style scoped>
</style>
