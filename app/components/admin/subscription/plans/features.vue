<template>
  <div class="w-100 d-flex flex-column pa-4 ga-4">
    <div class="w-100 d-flex flex-column ga-1">
      <span class="text-h5 text-grey700 font-weight-bold">
        Plan : {{ plan.title }}
      </span>
      <span class="text-h6 text-grey500">
        {{ selectedFeatures.length }} selected features
      </span>
    </div>

    <div
      v-if="loadingGetFeatures"
      class="w-100 d-flex flex-column align-center justify-center ga-2"
    >
      <div
        v-for="i in 2"
        :key="i"
        class="w-100 d-flex align-center justify-space-between ga-2 border rounded-lg pa-2"
      >
        <div class="d-flex flex-column align-start justify-start overflow-hidden ga-1">
          <v-skeleton-loader
            width="160"
            height="10"
            class="rounded-pill"
          />
          <v-skeleton-loader
            width="180"
            height="10"
            class="rounded-pill"
          />
        </div>

        <v-skeleton-loader
          width="40"
          height="40"
          class="rounded-circle"
        />
      </div>
    </div>

    <div
      v-else
      class="w-100 d-flex flex-column ga-2"
    >
      <div
        v-if="selectedFeatures.length === 0"
        class="w-100 d-flex align-center justify-center py-4 bg-grey100 rounded-lg"
      >
        <span class="text-grey500 text-h6 font-weight-semibold">
          No features selected.
        </span>
      </div>

      <div
        v-for="feature in selectedFeatures"
        :key="feature.featureId"
        class="w-100 d-flex align-center justify-space-between ga-2 border rounded-lg pa-2"
      >
        <div class="d-flex flex-column align-start justify-start overflow-hidden">
          <span class="text-grey700 text-h6 font-weight-bold text-truncate">
            {{ feature.featureName }}
          </span>
          <span class="text-grey500 text-h6 text-truncate">
            {{ feature.featureCode }} / Limit: {{ feature.limit }}
          </span>
        </div>

        <v-btn
          icon
          flat
          @click="removeFeature(feature.featureId)"
        >
          <v-icon
            size="20"
            color="grey800"
          >
            md:delete
          </v-icon>
        </v-btn>
      </div>
    </div>

    <v-divider class="w-100" />

    <v-form
      v-model="isAddFormValid"
      class="w-100 d-flex flex-column ga-2"
    >
      <common-gombo-box
        v-model="selectedFeatureId"
        label="Feature"
        :items=" featureOptions.map(feature => ({
          id: feature.id,
          title: `${feature.name} (${feature.code})`,
        }))"
        :data-loading="loadingGetFeatureOptions"
        rounded="lg"
        density="compact"
        base-color="grey200"
        color="primary"
        :defalut-lable="false"
        :rules="[required]"
        @update:model-value="setSelectedFeature"
      />

      <div class="w-100 d-flex flex-column align-start justify-start ga-1">
        <div class="text-h6 text-grey700 ml-2">
          Limit
        </div>
        <v-text-field
          v-model.number="newLimit"
          type="number"
          rounded="lg"
          density="compact"
          placeholder="Limit"
          variant="outlined"
          base-color="grey200"
          color="primary"
          active-color="primary"
          bg-color="white"
          class="w-100"
          :rules="[required, positiveNumber]"
        />
      </div>

      <v-btn
        color="primary"
        rounded="xl"
        variant="outlined"
        height="40"
        class="text-h5"
        :disabled="!isAddFormValid || !selectedFeature"
        flat
        @click="addFeature"
      >
        Add Feature
      </v-btn>
    </v-form>

    <v-btn
      color="success"
      rounded="xl"
      variant="outlined"
      height="40"
      width="200"
      class="text-h5 mt-2 mx-auto"
      :loading="loadingEditFeatures"
      :disabled="loadingGetFeatures || loadingEditFeatures"
      flat
      @click="saveFeatures"
    >
      Save Changes
    </v-btn>
  </div>
</template>

<script setup lang="ts">
import type {
  AdminSubscriptionFeatureDTO,
  AdminSubscriptionPlanDTO,
  AdminSubscriptionPlanFeatureDTO,
} from '@/types'

interface PlanFeaturesProps {
  plan: AdminSubscriptionPlanDTO
}

const props = defineProps<PlanFeaturesProps>()
const emit = defineEmits(['FeaturesSuccessFull'])

const {
  planFeatures,
  getFeatures,
  loadingGetFeatures,
  editFeatures,
  loadingEditFeatures,
} = useSubscriptionPlanAdmin()

const {
  featureOptions,
  getFeatureOptions,
  loadingGetFeatureOptions,
} = useSubscriptionFeatureAdmin()

const { $toast } = useNuxtApp()
const { required, positiveNumber } = useValidationRules()

const selectedFeatures = ref<AdminSubscriptionPlanFeatureDTO[]>([])
const selectedFeatureId = ref('')
const selectedFeature = ref<AdminSubscriptionFeatureDTO | null>(null)
const newLimit = ref<number | null>(null)
const isAddFormValid = ref(false)

onMounted(async () => {
  await Promise.all([
    getFeatures(props.plan.id),
    getFeatureOptions({
      page: 1,
      pageSize: 1000,
    }),
  ])

  selectedFeatures.value = planFeatures.value.map(feature => ({ ...feature }))
})

const setSelectedFeature = (featureId: string | number) => {
  selectedFeature.value = featureOptions.value.find(feature => feature.id === Number(featureId)) ?? null
}

const resetAddForm = () => {
  selectedFeatureId.value = ''
  selectedFeature.value = null
  newLimit.value = null
}

const addFeature = () => {
  if (!isAddFormValid.value || !selectedFeature.value || newLimit.value === null) return

  const isDuplicateFeature = selectedFeatures.value.some((feature) => {
    return feature.featureId === selectedFeature.value?.id
  })

  if (isDuplicateFeature) {
    $toast.error('Duplicate items are not allowed.')
    return
  }

  selectedFeatures.value.push({
    featureId: selectedFeature.value.id,
    featureCode: selectedFeature.value.code,
    featureName: selectedFeature.value.name,
    limit: Number(newLimit.value),
  })

  resetAddForm()
}

const removeFeature = (featureId: number) => {
  selectedFeatures.value = selectedFeatures.value.filter(feature => feature.featureId !== featureId)
}

const saveFeatures = async () => {
  const response = await editFeatures(props.plan.id, {
    features: selectedFeatures.value.map(feature => ({
      featureId: feature.featureId,
      limit: feature.limit,
    })),
  })

  if (response.succeeded) {
    emit('FeaturesSuccessFull')
  }
}
</script>
