<template>
  <div class="w-100 d-flex flex-column align-start justify-start ga-6 pt-4">
    <p class="text-h5 text-grey600 font-weight-medium mb-0">
      {{ text }}
    </p>

    <v-alert
      v-if="errorMessage"
      type="error"
      variant="tonal"
      density="comfortable"
      class="w-100"
    >
      {{ errorMessage }}
    </v-alert>

    <div class="w-100 d-flex align-center justify-center ga-3 flex-wrap">
      <v-btn
        rounded="pill"
        variant="outlined"
        color="grey500"
        height="40"
        min-width="110"
        class="text-h5 font-weight-bold"
        :disabled="loading"
        @click="back"
      >
        Back
      </v-btn>

      <v-btn
        rounded="pill"
        :color="confirmColor"
        height="40"
        min-width="110"
        class="text-h5 font-weight-bold text-white"
        flat
        :loading="loading"
        @click="confirm"
      >
        Yes
      </v-btn>
    </div>
  </div>
</template>

<script setup lang="ts">
interface ISubscriptionConfirmModal {
  text: string
  confirmColor: string
  loading?: boolean
  errorMessage?: string | null
}

withDefaults(defineProps<ISubscriptionConfirmModal>(), {
  loading: false,
  errorMessage: null,
})

const emit = defineEmits(['back', 'confirm'])

const back = () => {
  emit('back')
}

const confirm = () => {
  emit('confirm')
}
</script>

<style scoped>
</style>
