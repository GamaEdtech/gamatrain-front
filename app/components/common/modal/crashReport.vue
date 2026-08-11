<template>
  <v-row>
    <v-col cols="12">
      <v-radio-group
        v-model="reportType"
        label="Issue type"
        :rules="reportTypeRules"
        required
      >
        <template #label>
          <span class="text-h5 font-weight-bold">Issue type</span>
        </template>
        <v-radio
          v-for="(type, index) in reportTypeList"
          :key="index"
          :value="type.value"
          color="primary"
        >
          <template #label>
            <span class="text-h5">{{ type.label }}</span>
          </template>
        </v-radio>
      </v-radio-group>
    </v-col>

    <v-col cols="12">
      <v-textarea
        v-model="textReport"
        label="Description"
        variant="outlined"
        :rules="textReportRules"
        hint="You must enter at least 25 characters"
        persistent-hint
        required
        counter="500"
        rows="4"
        rounded="lg"
        color="#ffb300"
        no-resize
      />
    </v-col>
    <div class="w-100 d-flex align-center justify-center ga-3">
      <v-btn
        variant="text"
        class="text-h5"
        @click="emit('close')"
      >
        Discard
      </v-btn>
      <v-btn
        color="#ffb600"
        rounded="xl"
        height="40"
        width="180"
        class="text-h5"
        flat
        :disabled="!isValid"
        :loading="loading"
        @click="sendReport"
      >
        Send
      </v-btn>
    </div>
  </v-row>
</template>

<script setup lang="ts">
import type { AppError } from '@/types'

interface ICrashReportModal {
  typeCrashReport: string
  id: string
}

const { $toast } = useNuxtApp()
const router = useRouter()

const props = defineProps<ICrashReportModal>()
const emit = defineEmits(['close'])

const reportTypeList = [
  {
    value: 1,
    label: 'The file cannot be downloaded',
  },
  {
    value: 2,
    label: 'The file is wrong',
  },
  {
    value: 3,
    label: 'The content of the file is inappropriate or incorrect.',
  },
]
const reportTypeRules = [
  (v: number) =>
    (v !== null && v !== undefined) || 'Please select an issue type',
]
const reportType = ref(null)

const textReport = ref('')
const textReportRules = [
  (v: string) => !!v || 'Description is required',
  (v: string) =>
    (v && v.length >= 25) || 'Description must be at least 25 characters',
  (v: string) =>
    (v && v.length <= 500) || 'Description must be less than 500 characters',
]
const isValid = computed(() => {
  const isReportTypeValid
    = reportType.value !== null && reportType.value !== undefined
  const textLength = textReport.value.trim().length
  const isTextValid = textLength >= 25 && textLength <= 500

  return isReportTypeValid && isTextValid
})
const loading = ref(false)

const sendReport = async () => {
  if (!isValid.value) return

  loading.value = true
  try {
    const payload = new URLSearchParams({
      id: props.id,
      type: props.typeCrashReport,
      report_type: reportType.value!,
      message: textReport.value.trim(),
    }) as unknown
    await useApiService.post('/api/v1/reports', payload as SearchParameters)

    $toast.success('Report sent successfully')
    emit('close')
    reportType.value = null
    textReport.value = ''
  }
  catch (err: unknown) {
    const error = err as AppError
    if (error.response?.status === 403) {
      router.push({ query: { auth_form: 'login' } })
    }
    else if (error.response?.status === 400) {
      $toast.error(error.response?.data?.message || '')
      console.error('❌', error.response?.data?.message)
    }
    else {
      console.error('❌ Unknown error', error)
    }
  }
  finally {
    loading.value = false
  }
}
</script>

<style scoped>
</style>
