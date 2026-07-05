<template>
  <div class="w-100 d-flex flex-column pa-4">
    <v-form
      v-model="isFormValid"
      class="w-100 d-flex flex-column align-start ga-1"
    >
      <div class="w-100 d-flex flex-column align-start justify-start ga-1">
        <div class="text-h6 text-grey700 ml-2">
          Name
        </div>
        <v-text-field
          v-model="newItem.name"
          rounded="lg"
          density="compact"
          placeholder="Name"
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

      <div class="w-100 d-flex flex-column align-start justify-start ga-1">
        <common-gombo-box
          v-model="newItem.tagType"
          label="Tag Type"
          :items="TAG_TYPE_LIST.map((item) => ({
            id: item,
            title: item,
          }))"
          rounded="lg"
          density="compact"
          base-color="grey200"
          color="primary"
          :defalut-lable="false"
          :rules="[required]"
        />
      </div>

      <div class="w-100 d-flex flex-column align-start justify-start ga-1 mt-2">
        <div class="text-h6 text-grey700 ml-2">
          Icon
        </div>
        <v-text-field
          v-model="newItem.icon"
          rounded="lg"
          density="compact"
          placeholder="Icon"
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
      :loading="loadingAddItem"
      :disabled="!isFormValid || loadingAddItem"
      flat
      @click="add"
    >
      Add
    </v-btn>
  </div>
</template>

<script setup lang="ts">
import { TAG_TYPE_LIST } from '@/constants'
import type { AddAdminTagDTO } from '@/types'

const emit = defineEmits(['AddItemSuccessFull'])
const { addItem, loadingAddItem } = useTagAdmin()
const { required } = useValidationRules()

const newItem = reactive<AddAdminTagDTO>({
  name: '',
  icon: '',
  tagType: '',
})

const isFormValid = ref(false)

const resetForm = () => {
  newItem.name = ''
  newItem.icon = ''
  newItem.tagType = ''
}

const add = async () => {
  if (!isFormValid.value) return

  const response = await addItem(newItem)

  if (response.succeeded) {
    emit('AddItemSuccessFull')
    resetForm()
  }
}
</script>

<style scoped>
</style>
