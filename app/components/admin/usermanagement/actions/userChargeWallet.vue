<template>
  <div class="w-100 d-flex flex-column pa-4">
    <v-form
      v-model="isFormValid"
      class="w-100 d-flex flex-column align-start ga-1"
    >
      <div class="w-100 d-flex flex-column align-start justify-start ga-1">
        <div class="text-h6 text-grey700 ml-2">
          Point
        </div>
        <v-text-field
          v-model="point"
          rounded="lg"
          density="compact"
          placeholder="Point"
          variant="outlined"
          autocomplete="off"
          persistent-clear
          base-color="grey200"
          color="primary"
          active-color="primary"
          bg-color="white"
          class="w-100"
          type="number"
          :rules="[required, numeric, min(1)]"
        />
      </div>

      <div class="w-100 d-flex flex-column align-start justify-start ga-1">
        <div class="text-h6 text-grey700 ml-2">
          Description
        </div>
        <v-text-field
          v-model="description"
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
      :disabled="!isFormValid"
      :loading="loadingAddItem"
      flat
      @click="charge"
    >
      Charge
    </v-btn>
  </div>
</template>

<script setup lang="ts">
interface IUserChargeWallet {
  id: string
}

const props = defineProps<IUserChargeWallet>()
const emit = defineEmits(['chargeWalletSuccessFull'])

const { required, numeric, min } = useValidationRules()
const { addItem,
  loadingAddItem } = useTransactionAdmin()

const isFormValid = ref(false)
const point = ref(null)
const description = ref('')

const charge = async () => {
  if (!isFormValid.value) return

  const response = await addItem({
    userId: props.id,
    isDebit: false,
    points: Number(point.value!),
    description: description.value,
  })
  if (response.succeeded) {
    emit('chargeWalletSuccessFull')
  }
}
</script>

<style scoped>
</style>
