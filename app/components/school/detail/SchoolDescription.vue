<template>
  <!-- Hidden while empty; it's asked for in the "Fill in the gaps" card, which opens the editor here. -->
  <section
    :class="['detail-section', { 'd-none': !description && !isEditing }]"
    aria-labelledby="about-title"
  >
    <div class="section-head">
      <h2
        id="about-title"
        class="section-title"
      >
        About
      </h2>
      <v-btn
        v-if="!isEditing"
        variant="text"
        color="info"
        size="small"
        class="text-none gtext-t5 px-2 section-action"
        @click="startEdit"
      >
        Edit
      </v-btn>
    </div>
    <form
      v-if="isEditing"
      class="description-form"
      @submit.prevent="handleUpdate"
    >
      <v-textarea
        v-model="form.description"
        variant="outlined"
        label="Describe the school: its history, programs, what makes it different"
        :rules="[(v) => !!v?.trim() || 'Description is required']"
        auto-grow
        rows="4"
        autofocus
        hide-details="auto"
      />
      <div class="form-buttons">
        <v-btn
          type="submit"
          :loading="decSubmitLoader"
          color="primary"
          variant="flat"
          class="text-none gtext-t5"
        >
          Submit
        </v-btn>
        <v-btn
          variant="text"
          class="text-none gtext-t5"
          @click="cancel"
        >
          Cancel
        </v-btn>
      </div>
    </form>
    <p
      v-else-if="description"
      class="description"
    >
      {{ description }}
    </p>
  </section>
</template>

<script setup>
const emit = defineEmits(['edit', 'update'])
const props = defineProps({
  content: {
    type: Object,
    required: true,
  },
})
const nuxtApp = useNuxtApp()
const route = useRoute()
const { requireSignIn } = useContributeGate()

const description = computed(() => props.content.description?.trim() || '')
const decSubmitLoader = ref(false)
const isEditing = ref(false)
const form = reactive({
  description: '',
})

function startEdit() {
  if (!requireSignIn()) return
  form.description = description.value
  isEditing.value = true
}

function cancel() {
  isEditing.value = false
  emit('edit', '')
}

function handleUpdate() {
  const value = form.description?.trim()
  if (!value) {
    nuxtApp.$toast?.error('Please enter a valid Description')
    return
  }
  decSubmitLoader.value = true
  useApiService
    .post(`/api/v2/schools/${route.params.id}/contributions`, { description: value })
    .then((response) => {
      if (response.succeeded) {
        nuxtApp.$toast?.success(
          'Thank you! Your contribution has been submitted and is pending review.',
        )
        isEditing.value = false
        emit('update', response?.data?.description ?? value)
      }
      else {
        nuxtApp.$toast?.error(response?.errors[0]?.message)
      }
    })
    .catch((err) => {
      if (err?.response?.status == 401 || err?.response?.status == 403) {
        nuxtApp.$toast?.error('Please login to update school description')
      }
      else nuxtApp.$toast?.error(err?.response?.data?.message)
    })
    .finally(() => {
      decSubmitLoader.value = false
    })
}

watch(
  () => form.description,
  (val) => {
    if (isEditing.value) emit('edit', val ?? '')
  },
)

defineExpose({ startEdit })
</script>

<style scoped>
.description {
  margin: 0;
  max-width: 68ch;
  font-size: 15px;
  line-height: 1.65;
  color: rgb(var(--v-theme-grey700));
  white-space: pre-line;
}

.description-form {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-buttons {
  display: flex;
  gap: 4px;
}
</style>
