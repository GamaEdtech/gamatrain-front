<template>
  <v-dialog
    :model-value="isOpen"
    max-width="600px"
    style="height: 404px !important"
    @update:model-value="$emit('update:isOpen', $event)"
    @click:outside="closeModal"
  >
    <v-card class="boxs">
      <div class="d-flex flex-column align-center justify-center pt-6">
        <div class="icon-container">
          <v-icon
            color="red"
            large
          >
            mdi-delete
          </v-icon>
        </div>
        <v-card-title class="font-size-18 primary-gray-700 font-bold">
          Are you Sure?
        </v-card-title>
      </div>

      <div class="text-box">
        <v-card-text class="d-flex align-center justify-center">
          <span>Do you want to delete this item?</span>
        </v-card-text>

        <v-card-actions class="action-buttons">
          <v-btn
            variant="flat"
            color="error"
            class="w-50 rounded-pill white--text"
            @click="emit('confirm')"
          >
            Delete
          </v-btn>

          <v-btn
            variant="flat"
            color="bg-white"
            class="w-50 rounded-pill black--text"
            @click="closeModal"
          >
            Not Yet
          </v-btn>
        </v-card-actions>
      </div>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref } from 'vue'

defineProps({
  isOpen: {
    type: Boolean,
    required: true,
  },
  itemType: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['update:isOpen', 'confirm', 'close'])

const _newItem = ref({
  title: '',
  date: new Date().toISOString().split('T')[0], // Default to today's date
})

const closeModal = () => {
  emit('update:isOpen', false)
}

const _onDialogInput = (val) => {
  if (!val) {
    emit('close')
  }
}
</script>

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
