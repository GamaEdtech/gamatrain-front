<template>
  <div class="d-flex flex-column ga-1">
    <img
      v-if="preview"
      :src="preview"
      :alt="label"
      class="question-image"
    >
    <div class="d-flex align-center flex-wrap ga-2">
      <v-file-input
        :model-value="pending"
        :label="preview ? `Replace ${label.toLowerCase()}` : `Add ${label.toLowerCase()}`"
        accept="image/png,image/jpeg,image/gif,image/webp"
        prepend-icon="md:image"
        variant="outlined"
        density="compact"
        hide-details
        clearable
        class="image-input"
        @update:model-value="pick"
      />
      <v-btn
        v-if="preview && !pending"
        variant="text"
        color="error"
        size="small"
        prepend-icon="md:delete"
        @click="emit('change', null)"
      >
        Remove
      </v-btn>
      <v-btn
        v-if="change !== undefined"
        variant="text"
        size="small"
        @click="emit('change', undefined)"
      >
        Undo
      </v-btn>
    </div>
  </div>
</template>

<script setup lang="ts">
// One of a question's separate images (gama-api's way: one image file per text). The change is only queued here
// (a file, null to remove, undefined for none); the page sends it when the question is saved.
const props = defineProps<{
  label: string
  url: string | null | undefined
  change: File | null | undefined
}>()

const emit = defineEmits<{ change: [File | null | undefined] }>()

const pending = computed(() => (props.change instanceof File ? props.change : null))
const objectUrl = ref<string | null>(null)

watch(pending, (file) => {
  if (objectUrl.value) URL.revokeObjectURL(objectUrl.value)
  objectUrl.value = file ? URL.createObjectURL(file) : null
})

onBeforeUnmount(() => {
  if (objectUrl.value) URL.revokeObjectURL(objectUrl.value)
})

const preview = computed(() => (props.change === null ? null : objectUrl.value ?? props.url ?? null))

const pick = (value: File | File[] | null) => {
  const file = Array.isArray(value) ? value[0] : value
  emit('change', file ?? undefined)
}
</script>

<style scoped>
.question-image {
  max-width: 320px;
  max-height: 180px;
  object-fit: contain;
  align-self: flex-start;
}

.image-input {
  max-width: 320px;
}
</style>
