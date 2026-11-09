<template>
  <admin-common-modal
    v-model:show-dialog="dialogModel"
    title="Delete"
  >
    <div class="w-100 d-flex flex-column pa-4">
      <span class="text-center text-body-1 font-weight-bold text-grey700">Are you sure you want to delete this item?</span>

      <admin-common-two-factor-code-field
        v-if="requireCode"
        v-model="code"
        :disabled="loading"
        @finish="confirm"
      />

      <v-btn
        color="error"
        rounded="xl"
        variant="outlined"
        height="40"
        width="200"
        class="text-body-1 mt-8 mx-auto"
        :loading="loading"
        :disabled="requireCode && !/^\d{6}$/.test(code)"
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
  loading?: boolean
  /** Ask for the admin's authenticator code (step-up) and emit it with `confirm`. */
  requireCode?: boolean
}

const props = withDefaults(defineProps<IDeleteModal>(), {
  loading: false,
  requireCode: false,
})
const emit = defineEmits(['update:modelValue', 'confirm'])
const dialogModel = computed({
  get: () => props.modelValue,
  set: value => emit('update:modelValue', value),
})

const code = ref('')
// A code works once, so it is cleared whenever the dialog closes or opens again.
watch(() => props.modelValue, () => {
  code.value = ''
})

const confirm = async () => {
  if (props.requireCode && !/^\d{6}$/.test(code.value)) return
  emit('confirm', code.value)
  code.value = ''
}
</script>

<style scoped>
</style>
