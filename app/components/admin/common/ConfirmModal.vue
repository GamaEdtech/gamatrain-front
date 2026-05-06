<template>
  <admin-common-modal
    v-model:show-dialog="dialogModel"
    title="Confirm"
  >
    <div class="w-100 d-flex flex-column pa-4">
      <span class="text-center text-h5 font-weight-bold text-grey700">{{ text }}</span>

      <v-btn
        color="success"
        rounded="xl"
        variant="outlined"
        height="40"
        width="200"
        class="text-h5 mt-8 mx-auto"
        :loading="loading"
        flat
        @click="confirm"
      >
        Confirm
      </v-btn>
    </div>
  </admin-common-modal>
</template>

<script setup lang="ts">
interface IDeleteModal {
  text: string
  modelValue: boolean
  loading?: boolean
}

const props = withDefaults(defineProps<IDeleteModal>(), {
  loading: false,
})
const emit = defineEmits(['update:modelValue', 'confirm'])
const dialogModel = computed({
  get: () => props.modelValue,
  set: value => emit('update:modelValue', value),
})

const confirm = async () => {
  emit('confirm')
}
</script>

<style scoped>
</style>
