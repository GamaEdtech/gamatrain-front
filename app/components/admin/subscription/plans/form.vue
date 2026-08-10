<template>
  <div class="w-100 d-flex flex-column pa-4">
    <v-form
      v-model="isFormValid"
      class="w-100 d-flex flex-column align-start ga-2"
    >
      <div class="w-100 d-flex flex-column align-start justify-start ga-1">
        <div class="text-h6 text-grey700 ml-2">
          Title
        </div>
        <v-text-field
          v-model="form.title"
          rounded="lg"
          density="compact"
          placeholder="Title"
          variant="outlined"
          autocomplete="off"
          persistent-clear
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

      <div class="w-100 d-flex align-center justify-start ga-4 flex-wrap">
        <v-checkbox
          v-model="form.isActive"
          color="primary"
          class="text-h4"
          hide-details
          false-icon="md:check_box_outline_blank"
          true-icon="md:check_box"
        >
          <template #label>
            <span class="text-h5 text-grey700 text-no-wrap ml-1">Is Active</span>
          </template>
        </v-checkbox>

        <v-checkbox
          v-model="form.highlight"
          color="primary"
          class="text-h4"
          hide-details
          false-icon="md:check_box_outline_blank"
          true-icon="md:check_box"
        >
          <template #label>
            <span class="text-h5 text-grey700 text-no-wrap ml-1">Highlight</span>
          </template>
        </v-checkbox>
      </div>

      <div class="w-100 d-flex flex-column align-start justify-start ga-2 mt-2">
        <div class="w-100 d-flex align-center justify-space-between ga-2">
          <div class="text-h6 text-grey700 ml-2">
            Polygon
          </div>
          <v-btn
            icon
            flat
            size="24"
            color="primary"
            @click="addPolygonPoint"
          >
            <v-icon
              color="white"
              size="20"
            >
              md:add
            </v-icon>
          </v-btn>
        </div>

        <div
          v-for="(point, index) in form.polygon"
          :key="index"
          class="w-100 d-flex align-start justify-start ga-2"
        >
          <v-text-field
            v-model.number="point.latitude"
            type="number"
            rounded="lg"
            density="compact"
            placeholder="Latitude"
            variant="outlined"
            base-color="grey200"
            color="primary"
            active-color="primary"
            bg-color="white"
            class="w-50"
            :rules="[numeric]"
          />
          <v-text-field
            v-model.number="point.longitude"
            type="number"
            rounded="lg"
            density="compact"
            placeholder="Longitude"
            variant="outlined"
            base-color="grey200"
            color="primary"
            active-color="primary"
            bg-color="white"
            class="w-50"
            :rules="[numeric]"
          />
          <v-btn
            icon
            flat
            variant="outlined"
            color="lightError"
            size="28"
            class="d-flex align-center justify-center mt-2"
            @click="removePolygonPoint(index)"
          >
            <v-icon
              size="20"
              color="lightError"
            >
              md:delete
            </v-icon>
          </v-btn>
        </div>
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
  </div>
</template>

<script setup lang="ts">
import type {
  AddAdminSubscriptionPlanDTO,
  AdminSubscriptionPlanDTO,
} from '@/types'

interface PlanFormProps {
  mode: 'add' | 'edit'
  initialValue?: AdminSubscriptionPlanDTO | null
  loading?: boolean
  dataLoading?: boolean
}

const props = withDefaults(defineProps<PlanFormProps>(), {
  initialValue: null,
  loading: false,
  dataLoading: false,
})

const emit = defineEmits<{
  submit: [payload: AddAdminSubscriptionPlanDTO]
}>()

const { required, numeric } = useValidationRules()

const form = reactive<AddAdminSubscriptionPlanDTO>({
  title: '',
  polygon: [],
  isActive: false,
  highlight: false,
})

const isFormValid = ref(false)

const fillForm = (value: AdminSubscriptionPlanDTO | null) => {
  if (!value) return

  form.title = value.title
  form.polygon = value.polygon?.length
    ? value.polygon.map(point => ({
        latitude: point.latitude,
        longitude: point.longitude,
      }))
    : [{ latitude: 0, longitude: 0 }]
  form.isActive = value.isActive
  form.highlight = value.highlight
}

watch(
  () => props.initialValue,
  value => fillForm(value),
  { immediate: true },
)

const addPolygonPoint = () => {
  form.polygon.push({
    latitude: 0,
    longitude: 0,
  })
}

const removePolygonPoint = (index: number) => {
  form.polygon.splice(index, 1)
}

const submit = () => {
  if (!isFormValid.value) return

  emit('submit', {
    title: form.title,
    polygon: form.polygon.map(point => ({
      latitude: Number(point.latitude),
      longitude: Number(point.longitude),
    })),
    isActive: form.isActive,
    highlight: form.highlight,
  })
}
</script>
