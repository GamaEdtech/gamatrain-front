<template>
  <div class="w-100 d-flex flex-column pa-4">
    <v-form
      v-model="isFormValid"
      class="w-100 d-flex flex-column align-start ga-2"
    >
      <common-gombo-box
        v-model="form.subscriptionPlanPriceId"
        label="Price"
        :items="priceItems"
        :data-loading="loadingPrices"
        rounded="lg"
        density="compact"
        base-color="grey200"
        color="primary"
        :defalut-lable="false"
        :rules="[required]"
      />

      <common-gombo-box
        v-model="form.gateway"
        label="Gateway"
        :items="gatewayItems"
        rounded="lg"
        density="compact"
        base-color="grey200"
        color="primary"
        :defalut-lable="false"
        :rules="[required]"
      />

      <div class="w-100 d-flex flex-column align-start justify-start ga-1">
        <div class="text-h6 text-grey700 ml-2">
          External Product ID
        </div>
        <v-text-field
          v-model="form.externalProductId"
          rounded="lg"
          density="compact"
          placeholder="External Product ID"
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
          External Plan ID
        </div>
        <v-text-field
          v-model="form.externalPlanId"
          rounded="lg"
          density="compact"
          placeholder="External Plan ID"
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
  AddAdminSubscriptionGatewayMappingDTO,
  AdminSubscriptionGatewayMappingDTO,
} from '@/types'

interface GatewayMappingFormProps {
  mode: 'add' | 'edit'
  initialValue?: AdminSubscriptionGatewayMappingDTO | null
  loading?: boolean
}

interface GatewayMappingFormDTO {
  subscriptionPlanPriceId: number | string
  gateway: string
  externalProductId: string
  externalPlanId: string
}

const props = withDefaults(defineProps<GatewayMappingFormProps>(), {
  initialValue: null,
  loading: false,
})

const emit = defineEmits<{
  submit: [payload: AddAdminSubscriptionGatewayMappingDTO]
}>()

const { required } = useValidationRules()
const {
  data: prices,
  getData: getPrices,
  loadingGetData: loadingPrices,
} = useSubscriptionPriceAdmin()

const gatewayItems = [
  { id: 'GamaTrain', title: 'GamaTrain' },
  { id: 'Stripe', title: 'Stripe' },
]

const form = reactive<GatewayMappingFormDTO>({
  subscriptionPlanPriceId: '',
  gateway: '',
  externalProductId: '',
  externalPlanId: '',
})

const priceItems = computed(() => {
  return prices.value.map(price => ({
    id: price.id,
    title: `#${price.id} / Plan ${price.subscriptionPlanId} / ${price.countryCode} / ${price.currency} ${price.price}`,
  }))
})

const isFormValid = ref(false)

const fillForm = (value: AdminSubscriptionGatewayMappingDTO | null) => {
  if (!value) return

  form.subscriptionPlanPriceId = value.subscriptionPlanPriceId
  form.gateway = value.gateway
  form.externalProductId = value.externalProductId
  form.externalPlanId = value.externalPlanId
}

watch(
  () => props.initialValue,
  value => fillForm(value),
  { immediate: true },
)

onMounted(async () => {
  await getPrices({
    page: 1,
    pageSize: 1000,
  })
})

const submit = () => {
  if (!isFormValid.value) return

  emit('submit', {
    subscriptionPlanPriceId: Number(form.subscriptionPlanPriceId),
    gateway: form.gateway,
    externalProductId: form.externalProductId,
    externalPlanId: form.externalPlanId,
  })
}
</script>
