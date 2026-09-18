<template>
  <div class="w-100 d-flex flex-column pa-4">
    <v-form
      v-model="isFormValid"
      class="w-100 d-flex flex-column align-start ga-2"
    >
      <common-gombo-box
        v-model="form.nudgeType"
        label="Nudge Type"
        :items="nudgeType.map((item) => {
          return {
            id: item,
            title: item,
          }
        })"
        rounded="lg"
        density="compact"
        base-color="grey200"
        color="primary"
        :defalut-lable="false"
        :loading-value="dataLoading"
        :rules="[required]"
      />

      <div class="w-100 d-flex flex-column align-start justify-start ga-1">
        <div class="text-h6 text-grey700 ml-2">
          Subject
        </div>
        <v-text-field
          v-model="form.subject"
          rounded="lg"
          density="compact"
          placeholder="Subject"
          variant="outlined"
          base-color="grey200"
          color="primary"
          active-color="primary"
          bg-color="white"
          class="w-100"
          :rules="[required]"
        >
          <template #prepend-inner>
            <v-progress-circular
              v-if="dataLoading"
              indeterminate
              size="20"
              color="primary"
              class="mr-2"
            />
          </template>
        </v-text-field>
      </div>
      <div class="w-100 d-flex flex-column align-start justify-start ga-1">
        <div class="text-h6 text-grey700 ml-2">
          CTA Label
        </div>
        <v-text-field
          v-model="form.ctaLabel"
          rounded="lg"
          density="compact"
          placeholder="CTA Label"
          variant="outlined"
          base-color="grey200"
          color="primary"
          active-color="primary"
          bg-color="white"
          class="w-100"
          :rules="[required]"
        >
          <template #prepend-inner>
            <v-progress-circular
              v-if="dataLoading"
              indeterminate
              size="20"
              color="primary"
              class="mr-2"
            />
          </template>
        </v-text-field>
      </div>

      <div class="w-100 d-flex flex-column align-start justify-start ga-1">
        <div class="text-h6 text-grey700 ml-2">
          CTA Url
        </div>
        <v-text-field
          v-model="form.ctaUrl"
          rounded="lg"
          density="compact"
          placeholder="CTA Url"
          variant="outlined"
          base-color="grey200"
          color="primary"
          active-color="primary"
          bg-color="white"
          class="w-100"
          :rules="[required]"
        >
          <template #prepend-inner>
            <v-progress-circular
              v-if="dataLoading"
              indeterminate
              size="20"
              color="primary"
              class="mr-2"
            />
          </template>
        </v-text-field>
      </div>

      <div class="w-100 d-flex flex-column align-start justify-start ga-1">
        <div class="text-h6 text-grey700 ml-2">
          Body
        </div>
        <v-textarea
          v-model="form.body"
          rounded="lg"
          density="compact"
          placeholder="Body"
          variant="outlined"
          base-color="grey200"
          color="primary"
          active-color="primary"
          bg-color="white"
          class="w-100"
          no-resize
          rows="7"
          :rules="[required]"
        >
          <template #prepend-inner>
            <v-progress-circular
              v-if="dataLoading"
              indeterminate
              size="20"
              color="primary"
              class="mr-2"
            />
            <v-btn
              v-if="!dataLoading"
              icon
              flat
              color="primary"
              width="30"
              height="30"
              @click="showModalPreview = true"
            >
              <v-icon color="grey700">
                md:preview
              </v-icon>
            </v-btn>
          </template>
        </v-textarea>
      </div>

      <div class="w-100 d-flex flex-column align-start justify-start ga-1">
        <v-checkbox
          v-model="form.isActive"
          color="primary"
          class="text-h4"
          hide-details
          false-icon="md:check_box_outline_blank"
          true-icon="md:check_box"
        >
          <template #label>
            <span class="text-h6 text-grey700 text-no-wrap ml-2">Is Active</span>
          </template>
        </v-checkbox>
      </div>
    </v-form>

    <v-btn
      color="success"
      rounded="xl"
      variant="outlined"
      height="40"
      width="200"
      class="text-h5 mt-8 mx-auto"
      :loading="loading"
      :disabled="!isFormValid || loading || dataLoading"
      flat
      @click="submit"
    >
      {{ mode === 'add' ? 'Add' : 'Edit' }}
    </v-btn>

    <admin-common-modal
      v-model:show-dialog="showModalPreview"
      title="Preview"
    >
      <div class="w-100 d-flex flex-column pa-4">
        <span class="text-h5 font-weight-bold text-grey700 mb-4">You can preview the email content.</span>
        <div class="w-100 d-flex align-start justify-start">
          <div v-html="form.body" />
        </div>
      </div>
    </admin-common-modal>
  </div>
</template>

<script setup lang="ts">
import type {
  AdminNudgeTemplateDetailDTO,
  AddAdminNudgeTemplateDTO,
  NudgeType,
} from '@/types'

interface NudgeFormProps {
  mode: 'add' | 'edit'
  initialValue?: AdminNudgeTemplateDetailDTO | null
  loading?: boolean
  dataLoading?: boolean
}

const props = withDefaults(defineProps<NudgeFormProps>(), {
  initialValue: null,
  loading: false,
  dataLoading: false,
})

const emit = defineEmits<{
  submit: [payload: AddAdminNudgeTemplateDTO]
}>()

const { required } = useValidationRules()
const nudgeType: NudgeType[] = ['RoleMissing', 'AvatarMissing', 'NameMissing', 'BioMissing', 'SkillsMissing', 'ExperienceMissing']
const form = reactive<Omit<AddAdminNudgeTemplateDTO, 'nudgeType'> & {
  nudgeType: NudgeType | ''
}>({
  nudgeType: '',
  subject: '',
  body: '',
  ctaLabel: '',
  ctaUrl: '',
  isActive: false,
})

const isFormValid = ref(false)
const showModalPreview = ref(false)

const fillForm = (value: AdminNudgeTemplateDetailDTO | null) => {
  if (!value) return

  form.nudgeType = value.nudgeType
  form.subject = value.subject
  form.body = value.body
  form.ctaLabel = value.ctaLabel
  form.ctaUrl = value.ctaUrl
  form.isActive = value.isActive
}

watch(
  () => props.initialValue,
  value => fillForm(value),
  { immediate: true },
)

const submit = () => {
  if (!isFormValid.value) return

  emit('submit', form as AddAdminNudgeTemplateDTO)
}
</script>
