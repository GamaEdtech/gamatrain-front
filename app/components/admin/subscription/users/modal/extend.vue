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

      <div class="w-100 d-flex flex-column align-start justify-start ga-1">
        <div class="text-h6 text-grey700 ml-2">
          Current Expiration
        </div>
        <v-text-field
          :model-value="formatDate(subscription.expirationDate)"
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

      <div class="w-100 d-flex flex-column align-start justify-start ga-1">
        <div class="text-h6 text-grey700 ml-2">
          Days
        </div>
        <v-text-field
          v-model.number="form.days"
          type="number"
          rounded="lg"
          density="compact"
          placeholder="Days"
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
      :loading="loadingExtendItem"
      :disabled="!isFormValid || loadingExtendItem"
      flat
      @click="submit"
    >
      Extend
    </v-btn>
  </div>
</template>

<script setup lang="ts">
import type {
  AdminUserSubscriptionListDTO,
} from '@/types'

interface IExtendModal {
  subscription: AdminUserSubscriptionListDTO
}

const props = defineProps<IExtendModal>()
const emit = defineEmits<{
  extendSuccessFull: []
}>()

const { formatLocal } = useDateTime()
const { required, positiveNumber } = useValidationRules()
const {
  extendItem,
  loadingExtendItem,
} = useUserSubscriptionAdmin()

const form = reactive<{
  days: number | null
}>({
  days: null,
})

const isFormValid = ref(false)

const formatDate = (value: string | null) => {
  return value ? formatLocal(value, 'DD/MM/YYYY HH:mm') : '-'
}

const submit = async () => {
  if (!isFormValid.value || !form.days) return

  const response = await extendItem(
    props.subscription.id,
    {
      days: Number(form.days),
    },
  )

  if (response.succeeded) {
    emit('extendSuccessFull')
  }
}
</script>
