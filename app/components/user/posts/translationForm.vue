<template>
  <div
    class="main-translation-div d-flex flex-column ga-1 border-solid border-md border-grey600 rounded-lg pa-8 mt-2 mx-auto"
  >
    <div class="w-100 d-flex align-center justify-space-between mb-4">
      <span class="text-h4 text-md-h3 font-weight-bold text-grey700">New translation</span>
      <v-btn
        icon
        flat
        variant="text"
        color="white"
        @click="onDelete"
      >
        <v-icon
          size="large"
          color="error"
        >
          md:delete
        </v-icon>
      </v-btn>
    </div>
    <div
      class="w-100 d-flex flex-column align-start justify-start ga-1 mb-4"
    >
      <span class="text-h4 font-weight-bold text-grey700 ml-2">
        Language
      </span>
      <common-gombo-box
        v-model="localData.languageId"
        label=""
        :items="languages.map((item) => ({
          id: item.id,
          title: item.name + ',' + item.code,
        }))"
        rounded="lg"
        base-color="grey200"
        color="primary"
        :data-loading="loadingLanguages"
        :defalut-lable="false"
        :clearable="false"
        @update:model-value="emitUpdate"
      />
    </div>
    <div class="w-100 d-flex flex-column align-start justify-start ga-1">
      <div class="text-h4 font-weight-bold text-grey700 ml-2">
        <v-badge
          floating
          location="top right"
          color="transparent"
          overlap
        >
          <template #badge>
            <v-icon
              size="large"
              color="error"
            >
              md:star
            </v-icon>
          </template>
          <span>Title</span>
        </v-badge>
      </div>
      <v-text-field
        v-model="localData.title"
        :rules="[required]"
        rounded="lg"
        density="default"
        placeholder="Title"
        variant="outlined"
        autocomplete="off"
        persistent-clear
        base-color="grey200"
        color="primary"
        active-color="primary"
        bg-color="white"
        class="w-100"
        @update:model-value="emitUpdate"
      />
    </div>
    <div class="w-100 d-flex flex-column align-start justify-start ga-1">
      <div class="text-h4 font-weight-bold text-grey700 ml-2">
        <v-badge
          floating
          location="top right"
          color="transparent"
          overlap
        >
          <template #badge>
            <v-icon
              size="large"
              color="error"
            >
              md:star
            </v-icon>
          </template>
          <span>Abstract</span>
        </v-badge>
      </div>
      <v-textarea
        v-model="localData.summary"
        :rules="[required]"
        rounded="lg"
        density="default"
        placeholder="Enter Here..."
        variant="outlined"
        autocomplete="off"
        persistent-clear
        base-color="grey200"
        color="primary"
        active-color="primary"
        bg-color="white"
        class="w-100"
        no-resize
        rows="10"
        @update:model-value="emitUpdate"
      />
    </div>

    <div class="w-100 d-flex flex-column align-start justify-start ga-1">
      <div class="text-h4 font-weight-bold text-grey700 ml-2">
        <v-badge
          floating
          location="top right"
          color="transparent"
          overlap
        >
          <template #badge>
            <v-icon
              size="large"
              color="error"
            >
              md:star
            </v-icon>
          </template>
          <span>Main</span>
        </v-badge>
      </div>
      <common-rich-editor
        v-model="localData.content"
        mode="full"
        :rules="[required]"
        @update:model-value="emitUpdate"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { AdminLanguageDTO, TranslationDTO } from '@/types'

const props = defineProps<{
  modelValue: TranslationDTO
  languages: AdminLanguageDTO[]
  loadingLanguages?: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: TranslationDTO): void
  (e: 'delete'): void
}>()

const { required } = useValidationRules()
const localData = ref<TranslationDTO>({
  languageId: '',
  title: '',
  summary: '',
  content: '',
})

watch(
  () => props.modelValue,
  (val) => {
    if (val) {
      localData.value = { ...val }
    }
  },
  { immediate: true },
)

const emitUpdate = () => {
  emit('update:modelValue', { ...localData.value })
}

const onDelete = () => {
  emit('delete')
}
</script>

<style scoped>
.main-translation-div{
  width : calc(100% - 64px)
}
</style>
