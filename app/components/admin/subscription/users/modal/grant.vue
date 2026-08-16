<template>
  <div class="w-100 d-flex flex-column pa-4">
    <v-form
      v-model="isFormValid"
      class="w-100 d-flex flex-column align-start ga-2"
    >
      <div class="w-100 d-flex flex-column align-start justify-start ga-1">
        <div class="text-h6 text-grey700 ml-2">
          User ID
        </div>
        <v-text-field
          :model-value="subscription.userId"
          rounded="lg"
          density="compact"
          variant="outlined"
          base-color="grey200"
          color="primary"
          bg-color="white"
          class="w-100"
          disabled
        />
      </div>

      <common-gombo-box
        v-model="form.subscriptionPlanId"
        label="Plan"
        :items="planItems"
        :data-loading="loadingPlans"
        rounded="lg"
        density="compact"
        base-color="grey200"
        color="primary"
        :defalut-lable="false"
        :rules="[required]"
      />

      <common-gombo-box
        v-model="form.billingInterval"
        label="Billing Interval"
        :items="billingIntervals.map((item) => ({
          id: item,
          title: item,
        }))"
        rounded="lg"
        density="compact"
        base-color="grey200"
        color="primary"
        :defalut-lable="false"
        :has-search="false"
        :rules="[required]"
      />
    </v-form>

    <v-btn
      color="success"
      rounded="xl"
      variant="outlined"
      height="40"
      width="200"
      class="text-h5 mt-8 mx-auto"
      :loading="loadingGrantItem"
      :disabled="!isFormValid || loadingGrantItem"
      flat
      @click="submit"
    >
      Grant
    </v-btn>
  </div>
</template>

<script setup lang="ts">
import type {
  AdminUserSubscriptionListDTO,
  BillingInterval,
} from '@/types'

interface IGrantModal {
  subscription: AdminUserSubscriptionListDTO
}

const props = defineProps<IGrantModal>()
const emit = defineEmits<{
  grantSuccessFull: []
}>()

const { required } = useValidationRules()
const {
  data: plans,
  getData: getPlans,
  loadingGetData: loadingPlans,
} = useSubscriptionPlanAdmin()
const {
  grantItem,
  loadingGrantItem,
} = useUserSubscriptionAdmin()

const billingIntervals: BillingInterval[] = [
  'Daily',
  'Weekly',
  'Monthly',
  'Seasonally',
  'Yearly',
]

const form = reactive<{
  subscriptionPlanId: string
  billingInterval: BillingInterval | ''
}>({
  subscriptionPlanId: '',
  billingInterval: '',
})

const isFormValid = ref(false)

const planItems = computed(() => {
  return plans.value.map(plan => ({
    id: plan.id,
    title: plan.title,
  }))
})

onMounted(async () => {
  await getPlans({
    page: 1,
    pageSize: 1000,
  })
})

const submit = async () => {
  if (!isFormValid.value) return

  const response = await grantItem({
    userId: props.subscription.userId,
    subscriptionPlanId: Number(form.subscriptionPlanId),
    billingInterval: form.billingInterval as BillingInterval,
  })

  if (response.succeeded && response.data) {
    emit('grantSuccessFull')
  }
}
</script>
