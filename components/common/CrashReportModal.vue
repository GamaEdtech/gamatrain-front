<template>
  <v-dialog
    v-model="dialogModel"
    max-width="500"
    :fullscreen="!mdAndUp"
    @click="clickOnOverlay"
  >
    <div
      class="w-100 d-flex flex-wrap flex-column bg-white pa-6 rounded-xl mobile-style"
      @click="clickOnModal"
    >
      <v-row>
        <v-col
          cols="8"
          class="d-flex align-center"
        >
          <span class="text-h4 text-sm-h3">Crash report</span>
        </v-col>
        <v-col
          cols="4"
          class="d-flex align-center justify-end ga-2"
        >
          <v-icon
            class="ml-4"
            size="x-large"
            color="#D0D5DD"
            @click="closeModal"
          >
            md:cancel
          </v-icon>
        </v-col>
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
            @click="closeModal"
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
    </div>
  </v-dialog>
</template>

<script setup lang="ts">
import { useDisplay } from 'vuetify'

interface ICrashReportModal {
  showDialog?: boolean
  typeCrashReport: string
  id: string
}
interface ApiErrorResponse {
  status?: number
  data?: {
    error?: string
    status?: number
    message?: string
  }
}

interface AppError {
  response?: ApiErrorResponse
  message?: string
}

const { mdAndUp } = useDisplay()
const { $toast } = useNuxtApp()
const router = useRouter()

const props = withDefaults(defineProps<ICrashReportModal>(), {
  showDialog: false,
})

const emit = defineEmits(['update:showDialog'])

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

const clickOnModal = (event: Event) => {
  event.stopPropagation()
}

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
    closeModal()
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
.size-icon {
  font-size: 24px;
  margin-right: 12px;
}
@media only screen and (max-width: 960px) {
  .mobile-style {
    position: absolute;
    bottom: 0;
    border-radius: 24px 24px 0 0 !important;
  }
}
</style>
