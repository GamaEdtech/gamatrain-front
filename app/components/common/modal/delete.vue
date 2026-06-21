<template>
  <div class="w-100 d-flex flex-column pa-4">
    <span class="text-center text-h5 font-weight-bold text-grey700">{{ text }}</span>

    <v-btn
      color="error"
      rounded="xl"
      variant="outlined"
      height="40"
      width="200"
      class="text-h5 mt-8 mx-auto"
      :loading="loading"
      flat
      @click="confirm"
    >
      Delete
    </v-btn>
  </div>
</template>

<script setup lang="ts">
interface IDeleteModal {
  text?: string
  loading?: boolean
}

withDefaults(defineProps<IDeleteModal>(), {
  text: 'Are you sure you want to delete this item?',
  loading: false,
})
const emit = defineEmits(['confirm'])

const confirm = async () => {
  emit('confirm')
}
</script>

<style scoped>
</style>
