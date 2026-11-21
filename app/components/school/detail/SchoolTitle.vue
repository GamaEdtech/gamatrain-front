<template>
  <div class="school-title">
    <template v-if="!isEditing">
      <h1 class="name">
        {{ contentData.name }}
      </h1>
      <v-btn
        icon
        size="small"
        variant="text"
        color="grey500"
        aria-label="Suggest a correction to the school name"
        @click="startEdit"
      >
        <v-icon size="20">
          mdi-pencil-outline
        </v-icon>
      </v-btn>
    </template>
    <form
      v-else
      class="name-form"
      @submit.prevent="handleUpdate"
    >
      <v-text-field
        v-model="form.name"
        label="School name"
        :rules="[(v) => !!v?.trim() || 'Name is required']"
        variant="outlined"
        density="comfortable"
        autofocus
        hide-details="auto"
      />
      <v-btn
        type="submit"
        :loading="nameSubmitLoader"
        color="primary"
        variant="flat"
        class="text-none gtext-t5"
      >
        Submit
      </v-btn>
      <v-btn
        variant="text"
        class="text-none gtext-t5"
        @click="isEditing = false"
      >
        Cancel
      </v-btn>
    </form>
  </div>
</template>

<script setup>
const emit = defineEmits(['update'])
const props = defineProps({
  content: {
    type: Object,
    required: true,
  },
})
const nuxtApp = useNuxtApp()
const route = useRoute()
const contentData = ref(props.content)
const nameSubmitLoader = ref(false)
const isEditing = ref(false)
const form = reactive({
  name: '',
})

const { requireSignIn } = useContributeGate()

function startEdit() {
  if (!requireSignIn()) return
  form.name = contentData.value.name || ''
  isEditing.value = true
}

function handleUpdate() {
  const name = form.name?.trim()
  if (!name) {
    nuxtApp.$toast?.error('Please enter a valid Name')
    return
  }
  if (name === contentData.value.name?.trim()) {
    nuxtApp.$toast?.info('Nothing changed.')
    isEditing.value = false
    return
  }
  nameSubmitLoader.value = true
  useApiService
    .post(`/api/v2/schools/${route.params.id}/contributions`, { name })
    .then((response) => {
      if (response.succeeded) {
        nuxtApp.$toast?.success(
          'Thank you! Your contribution has been submitted and is pending review.',
        )
        isEditing.value = false
        emit('update', name)
      }
      else {
        nuxtApp.$toast?.error(response?.errors[0]?.message)
      }
    })
    .catch((err) => {
      if (err?.response?.status == 401 || err?.response?.status == 403) {
        nuxtApp.$toast?.error('Please login to update school name')
      }
      else nuxtApp.$toast?.error(err?.response?.data?.message)
    })
    .finally(() => {
      nameSubmitLoader.value = false
    })
}

defineExpose({ startEdit })
</script>

<style scoped>
.school-title {
  display: flex;
  align-items: flex-start;
  gap: 4px;
}

.name {
  margin: 0;
  font-size: 26px;
  line-height: 1.25;
  font-weight: 700;
  letter-spacing: -0.01em;
  color: rgb(var(--v-theme-grey900));
  text-wrap: balance;
}

@media (min-width: 960px) {
  .name {
    font-size: 32px;
  }
}

.name-form {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  gap: 8px;
  width: 100%;
  max-width: 640px;
}

.name-form .v-text-field {
  flex: 1 1 260px;
}

.name-form .v-btn {
  height: 48px;
}
</style>
