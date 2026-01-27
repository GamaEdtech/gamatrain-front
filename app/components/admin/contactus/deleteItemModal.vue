<template>
  <div class="w-100 d-flex flex-column pa-4">
    <span class="text-center text-h5 font-weight-bold text-grey700">Are you sure you want to delete this item?</span>

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
import type {
  ApiResult,
  AppError,
  ResponseListDTO,
} from '~/types/api'

interface IDeleteItemModal {
  id: string
}

const props = defineProps<IDeleteItemModal>()
const emit = defineEmits(['deleteSuccessFull'])
const { $toast } = useNuxtApp()

const loading = ref(false)
const confirm = async () => {
  try {
    loading.value = true
    const response = await useApiService.remove<
      ApiResult<ResponseListDTO<unknown>>
    >(
      `/api/v2/admin/contacts/${props.id}`,
    )
    if (response.succeeded) {
      $toast.success('Message deleted successfully!')
      emit('deleteSuccessFull')
    }
    else {
      $toast.error('The operation failed. Please try again later.')
    }
  }
  catch (err: unknown) {
    const error = err as AppError
    if (error.response?.status === 400) {
      $toast.error(error.response.data?.message || '')
    }
  }
  finally {
    loading.value = false
  }
}
</script>

<style scoped>

</style>
