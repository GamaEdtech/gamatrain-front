<script setup>
const _props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
  itemType: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['update:modelValue', 'confirm', 'close'])

const newItem = ref({
  title: '',
  date: new Date().toISOString().split('T')[0], // Default to today's date
})

function _handleDelete() {
  emit('confirm', { ...newItem.value })
  close()
}

function close() {
  emit('update:modelValue', false)
}

function onDialogInput(val) {
  if (!val) {
    emit('close')
  }
}
</script>

<template>
  <v-dialog
    :model-value="modelValue"
    max-width="600px"
    @update:model-value="$emit('update:modelValue', $event)"
    @input="onDialogInput"
    @click:outside="close"
  >
    <v-card class="boxs">
      <div class="d-flex flex-column align-center justify-center pt-6 mb-6">
        <div class="icon-container">
          <v-icon
            color="red"
            style="font-size: 48px !important"
          >
            mdi-delete
          </v-icon>
        </div>
        <v-card-title class="gtext-t3 primary-gray-700 font-bold">
          Are you Sure?
        </v-card-title>
      </div>

      <div class="text-box">
        <v-card-text class="d-flex align-center justify-center">
          <span class="gtext-t5 primary-gray-700">Do you want to delete this item?</span>
        </v-card-text>

        <v-card-actions class="action-buttons">
          <v-btn
            class="w-50 rounded-pill primary-gray-900 gtext-t5"
            style="background-color: white; border: 1px solid #e4e7ec"
            @click="close"
          >
            Cancel
          </v-btn>

          <v-btn
            class="w-50 rounded-pill text-white gtext-t5"
            style="background-color: #f04438"
            @click="$emit('confirm')"
          >
            Delete
          </v-btn>
        </v-card-actions>
      </div>
    </v-card>
  </v-dialog>
</template>

<style scoped>
.boxs {
  max-width: 600px;
  padding: 0;
  margin: 0;
  overflow: hidden;
}

.icon-container {
  background-color: #f2f4f7;
  width: 100px;
  height: 100px;
  border-radius: 50%;
  margin-top: 15px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 16px;
}

.text-box {
  background-color: #f2f4f7;
  width: 100%;
  margin: 0;
  padding: 30px 60px;
}

.text-box span {
  font-size: 16px;
  color: #101828;
  font-weight: 500;
  margin: 10px 0;
}

.action-buttons {
  display: flex;
  gap: 16px;
}
</style>
