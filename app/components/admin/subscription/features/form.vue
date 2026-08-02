<template>
  <div class="w-100 d-flex flex-column pa-4">
    <v-form
      v-model="isFormValid"
      class="w-100 d-flex flex-column align-start ga-2"
    >
      <div class="w-100 d-flex flex-column align-start justify-start ga-1">
        <common-gombo-box
          v-model="form.code"
          label="Code"
          :items="featurCodes.map((item) => ({
            id: item,
            title: item,
          }))"
          :data-loading="loadingGetFeatureCodes"
          rounded="lg"
          density="compact"
          base-color="grey200"
          color="primary"
          :defalut-lable="false"
          :rules="[required]"
        />
      </div>

      <div class="w-100 d-flex flex-column align-start justify-start ga-1">
        <div class="text-h6 text-grey700 ml-2">
          Name
        </div>
        <v-text-field
          v-model="form.name"
          rounded="lg"
          density="compact"
          placeholder="Name"
          variant="outlined"
          autocomplete="off"
          persistent-clear
          base-color="grey200"
          color="primary"
          active-color="primary"
          bg-color="white"
          class="w-100"
          :rules="[required]"
        />
      </div>

      <div class="w-100 d-flex flex-column align-start justify-start ga-1">
        <div class="text-h6 text-grey700 ml-2">
          Description
        </div>
        <v-textarea
          v-model="form.description"
          rounded="lg"
          density="compact"
          placeholder="Description"
          variant="outlined"
          autocomplete="off"
          persistent-clear
          base-color="grey200"
          color="primary"
          active-color="primary"
          bg-color="white"
          class="w-100"
          rows="3"
          auto-grow
          :rules="[required]"
        />
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
      :disabled="!isFormValid || loading"
      flat
      @click="submit"
    >
      {{ mode === 'add' ? 'Add' : 'Edit' }}
    </v-btn>
  </div>
</template>

<script setup lang="ts">
import type {
  AddAdminSubscriptionFeatureDTO,
  AdminSubscriptionFeatureDTO,
} from '@/types'

interface FeatureFormProps {
  mode: 'add' | 'edit'
  initialValue?: AdminSubscriptionFeatureDTO | null
  loading?: boolean
}

const props = withDefaults(defineProps<FeatureFormProps>(), {
  initialValue: null,
  loading: false,
})

const emit = defineEmits<{
  submit: [payload: AddAdminSubscriptionFeatureDTO]
}>()

const { required } = useValidationRules()
const { featurCodes,
  loadingGetFeatureCodes,
  getFeatureCodes } = useSubscriptionFeatureAdmin()

const form = reactive<AddAdminSubscriptionFeatureDTO>({
  code: '',
  name: '',
  description: '',
  isActive: true,
})

const isFormValid = ref(false)

const fillForm = (value: AdminSubscriptionFeatureDTO | null) => {
  if (!value) return

  form.code = value.code
  form.name = value.name
  form.description = value.description
  form.isActive = value.isActive
}

watch(
  () => props.initialValue,
  value => fillForm(value),
  { immediate: true },
)

const submit = () => {
  if (!isFormValid.value) return

  emit('submit', {
    code: form.code,
    name: form.name,
    description: form.description,
    isActive: form.isActive,
  })
}

onMounted(() => {
  getFeatureCodes()
})
</script>
