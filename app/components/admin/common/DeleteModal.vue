<template>
  <admin-common-modal
    v-model:show-dialog="dialogModel"
    title="Delete"
  >
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
  </admin-common-modal>
</template>

<script setup lang="ts">
interface IDeleteModal {
  modelValue: boolean
}

const props = defineProps<IDeleteModal>()
const emit = defineEmits(['update:modelValue', 'confirm'])
const dialogModel = computed({
  get: () => props.modelValue,
  set: value => emit('update:modelValue', value),
})

const loading = ref(false)
const confirm = async () => {
  emit('confirm')
  emit('update:modelValue', false)
}
</script>

<style scoped>
</style>
