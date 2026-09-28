<template>
  <v-form
    v-model="isFormValid"
    class="w-100 d-flex flex-column pa-4"
  >
    <div class="w-100 d-flex flex-column align-start">
      <div class="w-100 d-flex flex-column align-start justify-start ga-1">
        <div class="text-h6 text-grey700 font-weight-bold ml-2">
          Title
        </div>
        <v-text-field
          v-model="title"
          rounded="lg"
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
          :rules="[required]"
        />
      </div>
    </div>
    <div class="w-100 d-flex flex-column align-start justify-start ga-1">
      <div class="text-h6 text-grey700 font-weight-bold ml-2">
        Description
      </div>
      <v-textarea
        v-model="description"
        rounded="lg"
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
        no-resize
        rows="7"
        :rules="[required, minLength(70)]"
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
        :disabled="loadingEditItem"
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
interface IModalEditMultimedia {
  id: string
  title: string
  description: string
}

const props = defineProps<IModalEditMultimedia>()
const emit = defineEmits(['close', 'success'])

const { editItem, loadingEditItem } = useMultimedia()
const {
  required, minLength,
} = useValidationRules()

const title = ref(props.title)
const description = ref(props.description)

const isFormValid = ref(false)

const closeModal = () => {
  emit('close')
}

const save = async () => {
  const response = await editItem(props.id, {
    title: title.value,
    description: description.value,
  })

  if (response.status === 1 && response.data != null && response.data.id !== 0) {
    emit('success', {
      title: title.value,
      description: description.value,
    })
    emit('close')
  }
}
</script>

<style scoped>
</style>
