<template>
  <div class="w-100 h-100 d-flex flex-wrap align-start justify-start">
    <h2 class="w-100 text-h3 font-weight-bold text-grey700 mb-4">
      Application Setting
    </h2>

    <div
      v-for="field in fields"
      :key="field.key"
      :class="`${field.type == 'text' ? `w-100 w-sm-50`:`w-100`} d-flex flex-column align-start justify-start ga-1 px-1`"
    >
      <div class="text-h6 text-grey700 ml-2">
        {{ field.label }}
      </div>

      <v-text-field
        v-if="field.type === 'text'"
        v-model="form[field.key]"
        rounded="lg"
        density="compact"
        variant="outlined"
        autocomplete="off"
        persistent-clear
        base-color="grey400"
        color="primary"
        active-color="primary"
        bg-color="white"
        class="w-100"
      >
        <template #prepend-inner>
          <v-progress-circular
            v-if="loading"
            indeterminate
            size="20"
            color="primary"
            class="mr-2"
          />
        </template>
      </v-text-field>

      <v-textarea
        v-else
        v-model="form[field.key]"
        rounded="lg"
        density="compact"
        variant="outlined"
        autocomplete="off"
        persistent-clear
        base-color="grey400"
        color="primary"
        active-color="primary"
        bg-color="white"
        class="w-100"
        no-resize
      >
        <template #prepend-inner>
          <v-progress-circular
            v-if="loading"
            indeterminate
            size="20"
            color="primary"
            class="mr-2"
          />
          <v-btn
            v-if="!loading"
            icon
            flat
            color="primary"
            width="30"
            height="30"
            @click="openPreviewModal(field)"
          >
            <v-icon color="grey700">
              md:preview
            </v-icon>
          </v-btn>
        </template>
      </v-textarea>
    </div>

    <div class="w-100 d-flex align-center justify-center mt-4">
      <v-btn
        color="success"
        rounded="xl"
        variant="outlined"
        height="40"
        width="200"
        class="text-h5 mt-8 mx-auto"
        :loading="loadingSave"
        flat
        @click="save"
      >
        Save
      </v-btn>
    </div>

    <admin-common-modal
      v-model:show-dialog="showModalPreview"
      title="Preview"
    >
      <div class="w-100 d-flex flex-column pa-4">
        <span class="text-h5 font-weight-bold text-grey700 mb-4">You can preview the email content.</span>
        <div class="w-100 d-flex align-start justify-start">
          <div v-html="previewMessageHtml" />
        </div>
      </div>
    </admin-common-modal>
  </div>
</template>

<script setup lang="ts">
import type {
  AdminAppSettingsDTO,
} from '@/types'

type FieldType = 'text' | 'textarea'

interface FieldConfig {
  key: keyof AdminAppSettingsDTO
  label: string
  type: FieldType
  valueType: 'string' | 'number'
}

definePageMeta({
  layout: 'admin',
  middleware: ['auth', 'admin'],
})

const {
  getSettings,
  loadingGetSettings: loading,
  updateSettings,
  loadingUpdateSettings: loadingSave,
} = useAppSettingAdmin()
const form = reactive<AdminAppSettingsDTO>({
  gridPageSize: undefined,
  defaultTimeZoneId: '',

  schoolContributionPoints: undefined,
  schoolImageContributionPoints: undefined,
  schoolCommentContributionPoints: undefined,
  postContributionPoints: undefined,
  schoolIssuesContributionPoints: undefined,
  removeSchoolImageContributionPoints: undefined,

  easterEggBronzePoints: undefined,
  easterEggSilverPoints: undefined,
  easterEggGoldPoints: undefined,

  testTimeCorrectSubmissionPoints: undefined,
  testTimeIncorrectSubmissionPoints: undefined,
  examCorrectTestSubmissionPoints: undefined,
  examIncorrectTestSubmissionPoints: undefined,

  schoolCommentContributionConfirmationEmailTemplate: '',
  schoolImageContributionConfirmationEmailTemplate: '',
  schoolImageContributionRejectionEmailTemplate: '',
  removeSchoolImageContributionConfirmationEmailTemplate: '',
  schoolContributionConfirmationEmailTemplate: '',
  schoolContributionRejectionEmailTemplate: '',
  schoolIssuesContributionConfirmationEmailTemplate: '',
  postContributionConfirmationEmailTemplate: '',
  ticketConfirmationEmailTemplate: '',
  registrationEmailTemplate: '',
  initializeDeletingAccountEmailTemplate: '',
  startDeletingAccountEmailTemplate: '',
  finishedDeletingAccountEmailTemplate: '',
  adminTransactionCreationEmailTemplate: '',
})
const fields: FieldConfig[] = [
  { key: 'gridPageSize', label: 'Grid Page Size', type: 'text', valueType: 'number' },
  { key: 'defaultTimeZoneId', label: 'Default Time Zone', type: 'text', valueType: 'string' },

  { key: 'schoolContributionPoints', label: 'School Contribution Points', type: 'text', valueType: 'number' },
  { key: 'schoolImageContributionPoints', label: 'School Image Points', type: 'text', valueType: 'number' },
  { key: 'schoolCommentContributionPoints', label: 'School Comment Points', type: 'text', valueType: 'number' },
  { key: 'postContributionPoints', label: 'Post Contribution Points', type: 'text', valueType: 'number' },
  { key: 'schoolIssuesContributionPoints', label: 'School Issues Points', type: 'text', valueType: 'number' },
  { key: 'removeSchoolImageContributionPoints', label: 'Remove Image Points', type: 'text', valueType: 'number' },

  { key: 'easterEggBronzePoints', label: 'Easter Egg Bronze', type: 'text', valueType: 'number' },
  { key: 'easterEggSilverPoints', label: 'Easter Egg Silver', type: 'text', valueType: 'number' },
  { key: 'easterEggGoldPoints', label: 'Easter Egg Gold', type: 'text', valueType: 'number' },

  { key: 'testTimeCorrectSubmissionPoints', label: 'Test Time Correct', type: 'text', valueType: 'number' },
  { key: 'testTimeIncorrectSubmissionPoints', label: 'Test Time Incorrect', type: 'text', valueType: 'number' },
  { key: 'examCorrectTestSubmissionPoints', label: 'Exam Correct', type: 'text', valueType: 'number' },
  { key: 'examIncorrectTestSubmissionPoints', label: 'Exam Incorrect', type: 'text', valueType: 'number' },

  { key: 'schoolCommentContributionConfirmationEmailTemplate', label: 'School Comment Email', type: 'textarea', valueType: 'string' },
  { key: 'schoolImageContributionConfirmationEmailTemplate', label: 'School Image Confirmation Email', type: 'textarea', valueType: 'string' },
  { key: 'schoolImageContributionRejectionEmailTemplate', label: 'School Image Rejection Email', type: 'textarea', valueType: 'string' },
  { key: 'removeSchoolImageContributionConfirmationEmailTemplate', label: 'Remove Image Email', type: 'textarea', valueType: 'string' },
  { key: 'schoolContributionConfirmationEmailTemplate', label: 'School Contribution Email', type: 'textarea', valueType: 'string' },
  { key: 'schoolContributionRejectionEmailTemplate', label: 'School Contribution Rejection Email', type: 'textarea', valueType: 'string' },
  { key: 'schoolIssuesContributionConfirmationEmailTemplate', label: 'School Issues Email', type: 'textarea', valueType: 'string' },
  { key: 'postContributionConfirmationEmailTemplate', label: 'Post Contribution Email', type: 'textarea', valueType: 'string' },
  { key: 'ticketConfirmationEmailTemplate', label: 'Ticket Email', type: 'textarea', valueType: 'string' },
  { key: 'registrationEmailTemplate', label: 'Registration Email', type: 'textarea', valueType: 'string' },

  { key: 'initializeDeletingAccountEmailTemplate', label: 'Initialize Deleting Account Email Template', type: 'textarea', valueType: 'string' },
  { key: 'startDeletingAccountEmailTemplate', label: 'Start Deleting Account Email Template', type: 'textarea', valueType: 'string' },
  { key: 'finishedDeletingAccountEmailTemplate', label: 'Finished Deleting Account Email Template', type: 'textarea', valueType: 'string' },
  { key: 'adminTransactionCreationEmailTemplate', label: 'Admin Transaction Creation Email Template', type: 'textarea', valueType: 'string' },
]
const showModalPreview = ref(false)
const previewMessageHtml = ref('')

const getData = async () => {
  const response = await getSettings()

  if (response.data) {
    Object.assign(form, response.data)
    if (form.defaultTimeZoneId == null) {
      form.defaultTimeZoneId = ''
    }
  }
}

const buildPayload = () => {
  const payload: Record<string, string | number | undefined> = { ...form }

  for (const field of fields) {
    if (field.valueType === 'number') {
      const value = payload[field.key]

      payload[field.key]
        = value === '' || value == null
          ? 0
          : Number(value)
    }
  }

  return payload
}
const save = async () => {
  const payload = buildPayload()
  await updateSettings(payload)
}

const openPreviewModal = (field: FieldConfig) => {
  previewMessageHtml.value = form[field.key] as string
  showModalPreview.value = true
}

onMounted(async () => {
  await getData()
})
</script>

<style scoped>

</style>
