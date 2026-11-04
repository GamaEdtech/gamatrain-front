<template>
  <!-- Hidden while empty; it's asked for in the "Fill in the gaps" card, which opens the editor here. -->
  <section
    :class="['detail-section', { 'd-none': !hasTuition && !isEditMode }]"
    aria-labelledby="tuition-title"
  >
    <div class="section-head">
      <h2
        id="tuition-title"
        class="section-title"
      >
        Tuition fee
      </h2>
      <v-btn
        v-if="!isEditMode"
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
      v-if="isEditMode"
      class="tuition-form"
      @submit.prevent="handleUpdate"
    >
      <v-text-field
        v-model="tuitionFee"
        :rules="tuitionRule"
        label="Yearly tuition in USD (0 if free)"
        variant="outlined"
        density="comfortable"
        type="number"
        min="0"
        hide-spin-buttons
        prepend-inner-icon="mdi-currency-usd"
        autofocus
        hide-details="auto"
      />
      <v-btn
        type="submit"
        :loading="submitLoader"
        color="primary"
        variant="flat"
        class="text-none gtext-t5"
      >
        Submit
      </v-btn>
      <v-btn
        variant="text"
        class="text-none gtext-t5"
        @click="isEditMode = false"
      >
        Cancel
      </v-btn>
    </form>
    <p
      v-else-if="hasTuition"
      class="tuition-value"
    >
      {{ Number(tuition) === 0 ? 'Free' : `$${Number(tuition).toLocaleString('en-US')}` }}
    </p>
  </section>
</template>

<script setup>
const props = defineProps({
  contentData: {
    type: Object,
    required: true,
  },
})

const nuxtApp = useNuxtApp()
const route = useRoute()
const { requireSignIn } = useContributeGate()

const tuition = ref(props.contentData.tuition)
const hasTuition = computed(() => tuition.value !== null && tuition.value !== undefined)
const isEditMode = ref(false)
const submitLoader = ref(false)
const tuitionFee = ref('')
const tuitionRule = [
  v => (v !== '' && v !== null) || 'Tuition fee is required',
  v => /^\d+$/.test(v) || 'Please enter only numbers',
]

function startEdit() {
  if (!requireSignIn()) return
  tuitionFee.value = hasTuition.value ? String(tuition.value) : ''
  isEditMode.value = true
}

function handleUpdate() {
  if (!/^\d+$/.test(tuitionFee.value)) {
    nuxtApp.$toast?.error('Please enter a valid Tuition Fee')
    return
  }
  submitLoader.value = true
  useApiService
    .post(`/api/v2/schools/${route.params.id}/contributions`, { tuition: tuitionFee.value })
    .then((response) => {
      if (response.succeeded) {
        nuxtApp.$toast?.success(
          'Thank you! Your contribution has been submitted and is pending review.',
        )
        tuition.value = Number(tuitionFee.value)
        isEditMode.value = false
      }
      else {
        nuxtApp.$toast?.error(response?.errors[0]?.message)
      }
    })
    .catch((err) => {
      if (err?.response?.status == 401 || err?.response?.status == 403) {
        nuxtApp.$toast?.error('Please login to update tuition information')
      }
      else nuxtApp.$toast?.error(err?.response?.data?.message)
    })
    .finally(() => {
      submitLoader.value = false
    })
}

defineExpose({ startEdit })
</script>

<style scoped>
.tuition-value {
  margin: 0;
  font-size: 20px;
  font-weight: 700;
  color: rgb(var(--v-theme-grey900));
  font-variant-numeric: tabular-nums;
}

.tuition-form {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  gap: 8px;
  max-width: 560px;
}

.tuition-form .v-text-field {
  flex: 1 1 240px;
}

.tuition-form .v-btn {
  height: 48px;
}
</style>
