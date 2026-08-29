<template>
  <div class="w-100 d-flex flex-column pa-4">
    <v-form
      v-model="isFormValid"
      class="w-100 d-flex flex-column align-start ga-2"
    >
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
        v-model="form.countryCode"
        label="Country"
        :items="countryItems"
        :data-loading="loadingCountries"
        rounded="lg"
        density="compact"
        base-color="grey200"
        color="primary"
        :defalut-lable="false"
        :rules="[required]"
      />

      <div class="w-100 d-flex flex-column align-start justify-start ga-1">
        <common-gombo-box
          v-model="form.currency"
          label="Currency"
          :items="currencies.map((item) => {
            return {
              id: item,
              title: item,
            }
          })"
          rounded="
          lg"
          density="compact"
          base-color="grey200"
          color="primary"
          :defalut-lable="false"
          :rules="[required]"
        />
      </div>

      <div class="w-100 d-flex flex-column align-start justify-start ga-1">
        <common-gombo-box
          v-model="form.billingInterval"
          label="Billing Interval"
          :items="billingIntervals.map((item) => {
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
          :has-search="false"
          :rules="[required]"
        />
      </div>

      <div class="w-100 d-flex flex-column align-start justify-start ga-1">
        <div class="text-h6 text-grey700 ml-2">
          Price
        </div>
        <v-text-field
          v-model.number="form.price"
          type="number"
          rounded="lg"
          density="compact"
          placeholder="Price"
          variant="outlined"
          base-color="grey200"
          color="primary"
          active-color="primary"
          bg-color="white"
          class="w-100"
          :rules="[required, positiveNumber]"
        />
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
  AddAdminSubscriptionPriceDTO,
  AdminSubscriptionPriceDTO,
  BillingInterval,
  SubscriptionCurrency,
} from '@/types'
import { BILLING_INTERVALS } from '@/constants'

interface PriceFormProps {
  mode: 'add' | 'edit'
  initialValue?: AdminSubscriptionPriceDTO | null
  loading?: boolean
}

const props = withDefaults(defineProps<PriceFormProps>(), {
  initialValue: null,
  loading: false,
})

const emit = defineEmits<{
  submit: [payload: AddAdminSubscriptionPriceDTO]
}>()

const { required, positiveNumber } = useValidationRules()
const { countries, getCountries, loadingCountries } = useLocation()
const {
  data: plans,
  getData: getPlans,
  loadingGetData: loadingPlans,
} = useSubscriptionPlanAdmin()

const currencies: SubscriptionCurrency[] = ['SOL', 'USDC', 'GET', 'USDT', 'USD']
const worldwideCountryCode = 'worldwide'
const billingIntervals = BILLING_INTERVALS

interface SubscriptionPriceFormDTO {
  subscriptionPlanId: number | string
  countryCode: string
  currency: SubscriptionCurrency | ''
  billingInterval: BillingInterval | ''
  price: number | null
}

const form = reactive<SubscriptionPriceFormDTO>({
  subscriptionPlanId: '',
  countryCode: '',
  currency: '',
  billingInterval: '',
  price: null,
})

const planItems = computed(() => {
  return plans.value.map(plan => ({
    id: plan.id,
    title: plan.title,
  }))
})

const countryItems = computed(() => {
  return [
    {
      id: worldwideCountryCode,
      title: worldwideCountryCode,
    },
    ...countries.value.map(country => ({
      id: country.code,
      title: country.title,
    })),
  ]
})

const isFormValid = ref(false)

const fillForm = (value: AdminSubscriptionPriceDTO | null) => {
  if (!value) return

  form.subscriptionPlanId = value.subscriptionPlanId
  form.countryCode = value.countryCode ?? worldwideCountryCode
  form.currency = value.currency
  form.billingInterval = value.billingInterval
  form.price = value.price
}

watch(
  () => props.initialValue,
  value => fillForm(value),
  { immediate: true },
)

onMounted(async () => {
  await Promise.all([
    getCountries(),
    getPlans({
      page: 1,
      pageSize: 1000,
    }),
  ])
})

const submit = () => {
  if (!isFormValid.value) return

  emit('submit', {
    subscriptionPlanId: Number(form.subscriptionPlanId),
    countryCode: form.countryCode === worldwideCountryCode ? null : form.countryCode,
    currency: form.currency as SubscriptionCurrency,
    price: Number(form.price),
    billingInterval: form.billingInterval as BillingInterval,
  })
}
</script>
