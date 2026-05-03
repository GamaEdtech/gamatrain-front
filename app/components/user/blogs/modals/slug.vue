<template>
  <v-dialog
    v-model="dialogModel"
    max-width="500"
    :fullscreen="!mdAndUp"
    @click="clickOnOverlay"
  >
    <div
      class="w-100 d-flex flex-column overflow-y-auto bg-white pa-6 rounded-xl mobile-style"
      @click="clickOnModal"
    >
      <v-row class="d-flex align-center">
        <v-col cols="10">
          <span class="text-h4">Slug</span>
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
      <div class="w-100 d-flex flex-column align-start justify-start mt-4">
        <span class="text-h5 font-weight-medium text-grey700">You can change slug</span>
        <v-text-field
          v-model="slug"
          rounded="lg"
          density="default"
          placeholder="Slug"
          variant="outlined"
          autocomplete="off"
          persistent-clear
          base-color="grey200"
          color="primary"
          active-color="primary"
          bg-color="white"
          class="w-100 mt-2"
          @update:model-value="onSlugUpdate"
        >
          <template #prepend-inner>
            <v-progress-circular
              v-if="isChecking"
              indeterminate
              size="20"
              color="primary"
              class="mr-2"
            />
          </template>
        </v-text-field>
        <v-btn
          color="success"
          rounded="pill"
          variant="flat"
          class="text-white font-weight-medium text-h5 mx-auto"
          width="150"
          :loading="loadingSaveSlug"
          :disabled="!canSubmit"
          @click="save"
        >
          Save
        </v-btn>
      </div>
    </div>
  </v-dialog>
</template>

<script setup lang="ts">
import { useDisplay } from 'vuetify'
import { computed } from 'vue'

interface ISlug {
  showDialog: boolean
  slug?: string
}

const { mdAndUp } = useDisplay()
const { validateSlug, saveSlug, loadingSaveSlug } = useBlog()

const props = withDefaults(defineProps<ISlug>(), {
  slug: '',
})

const emit = defineEmits(['update:showDialog', 'saveSlugSuccessfull'])

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
const clickOnModal = (event: Event) => {
  event.stopPropagation()
}

const slug = ref(props.slug)
const isChecking = ref(false)
const isValid = ref(false)

let debounceTimer: ReturnType<typeof setTimeout> | null = null
const hasMinLength = computed(() => slug.value.length >= 4)

const checkSlug = async (value: string) => {
  isChecking.value = true
  const response = await validateSlug(value)
  isValid.value = response
  isChecking.value = false
}

const onSlugUpdate = (value: string) => {
  isValid.value = false
  if (debounceTimer) {
    clearTimeout(debounceTimer)
  }
  if (value.length < 4) {
    return
  }

  debounceTimer = setTimeout(() => {
    checkSlug(value)
  }, 500)
}

const canSubmit = computed(() => {
  return hasMinLength.value && isValid.value && !isChecking.value
})

const save = async () => {
  const response = await saveSlug(slug.value)
  if (response.succeeded) {
    emit('saveSlugSuccessfull', response.data)
    emit('update:showDialog', false)
  }
}
</script>

<style scoped>
@media only screen and (max-width: 960px) {
  .mobile-style {
    max-height: 90%;
    position: absolute;
    bottom: 0;
    border-radius: 24px 24px 0 0 !important;
  }
}
</style>
