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
interface IDeleteItemModal {
  id: string
}

const props = defineProps<IDeleteItemModal>()
const emit = defineEmits(['deleteSuccessFull'])
const {
  deleteItem,
  loadingDeleteItem: loading,
} = useContactUsAdmin()

const confirm = async () => {
  const response = await deleteItem(props.id)

  if (response.succeeded) {
    emit('deleteSuccessFull')
  }
}
</script>

<style scoped>

</style>
