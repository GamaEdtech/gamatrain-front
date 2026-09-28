<template>
  <div class="w-100 d-flex flex-column pa-4 ga-4">
    <div class="w-100 d-flex flex-column ga-1">
      <span class="text-h5 text-grey700 font-weight-bold">
        Plan : {{ plan.title }}
      </span>
      <span class="text-h6 text-grey500">
        {{ selectedFeatureGroups.length }} selected feature groups
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
        v-if="selectedFeatureGroups.length === 0"
        class="w-100 d-flex align-center justify-center py-4 bg-grey100 rounded-lg"
      >
        <span class="text-grey500 text-h6 font-weight-semibold">
          No features selected.
        </span>
      </div>

      <div
        v-for="(group, index) in selectedFeatureGroups"
        :key="index"
        class="w-100 d-flex align-center justify-space-between ga-2 border rounded-lg pa-2"
      >
        <div class="d-flex flex-column align-start justify-start overflow-hidden ga-1">
          <div class="d-flex align-center ga-1">
            <span class="text-grey700 text-h6 font-weight-bold text-truncate">
              {{ group.features.map(feature => feature.featureName).join(', ') }}
            </span>
            <span
              v-if="editingIndex === index"
              class="text-primary text-h6 font-weight-bold"
            >
              (editing)
            </span>
          </div>
          <span class="text-grey500 text-h6 text-truncate">
            {{ group.features.map(feature => feature.featureCode).join(', ') }}
          </span>
          <span class="text-grey500 text-h6 text-truncate">
            {{ formatLimits(group.limits) }}
          </span>
          <span
            v-if="group.description"
            class="text-grey500 text-h6"
          >
            {{ group.description }}
          </span>
        </div>

        <div class="d-flex align-center ga-1">
          <v-btn
            icon
            flat
            @click="startEditFeatureGroup(index)"
          >
            <v-icon
              size="20"
              color="grey800"
            >
              md:edit
            </v-icon>
          </v-btn>

          <v-btn
            icon
            flat
            @click="removeFeatureGroup(index)"
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
    </div>

    <v-divider class="w-100" />

    <v-form
      v-model="isAddFormValid"
      class="w-100 d-flex flex-column ga-2"
    >
      <div class="w-100 d-flex flex-column ga-1">
        <div class="w-100 d-flex align-center justify-space-between">
          <div class="text-h6 text-grey700 ml-2">
            {{ isEditing ? 'Edit Feature Group' : 'Features' }}
          </div>

          <v-btn
            v-if="isEditing"
            variant="text"
            size="small"
            color="grey700"
            @click="cancelEditFeatureGroup"
          >
            Cancel
          </v-btn>
        </div>

        <v-select
          v-model="selectedFeatureIds"
          :items="featureSelectItems"
          item-title="title"
          item-value="id"
          multiple
          chips
          closable-chips
          :loading="loadingGetFeatureOptions"
          density="compact"
          variant="outlined"
          base-color="grey200"
          color="primary"
          rounded="lg"
          :rules="[requiredFeatureSelection]"
        />
      </div>

      <div class="w-100 d-flex flex-column ga-2">
        <div class="text-h6 text-grey700 ml-2">
          Limit per Billing Interval
        </div>

        <div
          v-for="interval in planIntervals"
          :key="interval"
          class="w-100 d-flex flex-column align-start justify-start ga-1 border rounded-lg pa-2"
        >
          <div class="w-100 d-flex align-center justify-space-between">
            <span class="text-h6 text-grey700 font-weight-bold">{{ interval }}</span>

            <v-checkbox
              v-model="intervalLimits[interval].unlimited"
              color="primary"
              hide-details
              density="compact"
              false-icon="md:check_box_outline_blank"
              true-icon="md:check_box"
            >
              <template #label>
                <span class="text-h6 text-grey700 text-no-wrap">Unlimited</span>
              </template>
            </v-checkbox>
          </div>

          <v-text-field
            v-model.number="intervalLimits[interval].limit"
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
            :disabled="intervalLimits[interval].unlimited"
            :rules="intervalLimits[interval].unlimited ? [] : [required, positiveNumber]"
          />
        </div>
      </div>

      <div class="w-100 d-flex flex-column align-start justify-start ga-1">
        <div class="text-h6 text-grey700 ml-2">
          Description
        </div>
        <v-textarea
          v-model="newDescription"
          rounded="lg"
          density="compact"
          placeholder="Description"
          variant="outlined"
          base-color="grey200"
          color="primary"
          active-color="primary"
          bg-color="white"
          class="w-100"
          no-resize
          rows="3"
          :disabled="!isDescriptionRequired"
          :rules="isDescriptionRequired ? [required] : []"
        />
      </div>

      <v-btn
        color="primary"
        rounded="xl"
        variant="outlined"
        height="40"
        class="text-h5"
        :disabled="!isAddFormValid || selectedFeatureIds.length === 0"
        flat
        @click="addFeature"
      >
        {{ isEditing ? 'Update Feature' : 'Add Feature' }}
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
import { BILLING_INTERVALS } from '@/constants'
import type {
  AdminSubscriptionFeatureDTO,
  AdminSubscriptionPlanDTO,
  AdminSubscriptionPlanFeatureGroupDTO,
  AdminSubscriptionPlanFeatureLimitDTO,
  BillingInterval,
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

type IntervalLimitState = Record<BillingInterval, { unlimited: boolean, limit: number | null }>

const createDefaultIntervalLimits = (): IntervalLimitState => {
  return BILLING_INTERVALS.reduce((state, interval) => {
    state[interval] = { unlimited: true, limit: null }
    return state
  }, {} as IntervalLimitState)
}

const selectedFeatureGroups = ref<AdminSubscriptionPlanFeatureGroupDTO[]>([])
const selectedFeatureIds = ref<number[]>([])
const newDescription = ref('')
const intervalLimits = reactive<IntervalLimitState>(createDefaultIntervalLimits())
const isAddFormValid = ref(false)
const editingIndex = ref<number | null>(null)
const isEditing = computed(() => editingIndex.value !== null)

// Only the intervals this plan is actually sold at - falls back to the full list when the plan has no
// prices yet, so the limit form is never left with nothing to fill in.
const planIntervals = computed<BillingInterval[]>(() => {
  const soldIntervals = new Set(props.plan.prices.map(price => price.billingInterval))
  const intervals = BILLING_INTERVALS.filter(interval => soldIntervals.has(interval))
  return intervals.length > 0 ? intervals : BILLING_INTERVALS
})

const featureSelectItems = computed(() => {
  return featureOptions.value.map(feature => ({
    id: feature.id,
    title: `${feature.name} (${feature.code})`,
  }))
})

const isDescriptionRequired = computed(() => selectedFeatureIds.value.length > 1)

const requiredFeatureSelection = (value: unknown) => {
  return (Array.isArray(value) && value.length > 0) || 'This field is required.'
}

const formatLimits = (limits: AdminSubscriptionPlanFeatureLimitDTO[]) => {
  return limits
    .map(({ billingInterval, limit }) => `${billingInterval}: ${limit == null ? 'Unlimited' : limit}`)
    .join(' · ')
}

onMounted(async () => {
  await Promise.all([
    getFeatures(props.plan.id),
    getFeatureOptions({
      page: 1,
      pageSize: 1000,
    }),
  ])

  selectedFeatureGroups.value = planFeatures.value.map(group => ({
    features: group.features.map(feature => ({ ...feature })),
    limits: group.limits.map(limit => ({ ...limit })),
    description: group.description,
  }))
})

const resetAddForm = () => {
  selectedFeatureIds.value = []
  newDescription.value = ''
  Object.assign(intervalLimits, createDefaultIntervalLimits())
  editingIndex.value = null
}

// Loads an existing group's features/limits/description back into the add-form so it can be
// resubmitted in place, turning the "Add Feature" flow into an "Update Feature" one.
const startEditFeatureGroup = (index: number) => {
  const group = selectedFeatureGroups.value[index]
  if (!group) return

  editingIndex.value = index
  selectedFeatureIds.value = group.features.map(feature => feature.featureId)
  newDescription.value = group.description ?? ''

  const nextIntervalLimits = createDefaultIntervalLimits()
  group.limits.forEach((limit) => {
    nextIntervalLimits[limit.billingInterval] = {
      unlimited: limit.limit == null,
      limit: limit.limit,
    }
  })
  Object.assign(intervalLimits, nextIntervalLimits)
}

const cancelEditFeatureGroup = () => {
  resetAddForm()
}

const addFeature = () => {
  const hasMissingLimit = planIntervals.value.some(
    interval => !intervalLimits[interval].unlimited && intervalLimits[interval].limit === null,
  )

  if (
    !isAddFormValid.value
    || selectedFeatureIds.value.length === 0
    || hasMissingLimit
    || (isDescriptionRequired.value && !newDescription.value)
  ) {
    $toast.error('Complete form correctly.')
    return
  }

  const selectedIds = selectedFeatureIds.value.map(Number)
  const isDuplicateFeature = selectedFeatureGroups.value.some((group, index) => {
    if (index === editingIndex.value) return false
    return group.features.some(feature => selectedIds.includes(feature.featureId))
  })

  if (isDuplicateFeature) {
    $toast.error('Duplicate items are not allowed.')
    return
  }

  const selectedFeatures = selectedIds
    .map((featureId) => {
      return featureOptions.value.find(feature => feature.id === featureId) ?? null
    })
    .filter((feature): feature is AdminSubscriptionFeatureDTO => feature !== null)

  const featureGroup: AdminSubscriptionPlanFeatureGroupDTO = {
    features: selectedFeatures.map(feature => ({
      featureId: feature.id,
      featureCode: feature.code,
      featureName: feature.name,
    })),
    limits: planIntervals.value.map(interval => ({
      billingInterval: interval,
      limit: intervalLimits[interval].unlimited ? null : Number(intervalLimits[interval].limit),
    })),
    description: isDescriptionRequired.value ? newDescription.value : '',
  }

  if (editingIndex.value !== null) {
    selectedFeatureGroups.value.splice(editingIndex.value, 1, featureGroup)
  }
  else {
    selectedFeatureGroups.value.push(featureGroup)
  }

  resetAddForm()
}

const removeFeatureGroup = (index: number) => {
  selectedFeatureGroups.value.splice(index, 1)

  if (editingIndex.value === index) {
    cancelEditFeatureGroup()
  }
  else if (editingIndex.value !== null && index < editingIndex.value) {
    editingIndex.value -= 1
  }
}

const saveFeatures = async () => {
  const response = await editFeatures(props.plan.id, {
    featureGroups: selectedFeatureGroups.value.map(group => ({
      featureIds: group.features.map(feature => feature.featureId),
      limits: group.limits,
      description: group.description,
    })),
  })

  if (response.succeeded) {
    emit('FeaturesSuccessFull')
  }
}
</script>
