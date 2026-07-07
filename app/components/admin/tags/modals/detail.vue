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
        >
          <template #prepend-inner>
            <v-progress-circular
              v-if="loadingGetItemById"
              indeterminate
              size="20"
              color="#ffb300"
              class="mr-2"
            />
          </template>
        </v-text-field>
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
          :loading-value="loadingGetItemById"
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
        >
          <template #prepend-inner>
            <v-progress-circular
              v-if="loadingGetItemById"
              indeterminate
              size="20"
              color="#ffb300"
              class="mr-2"
            />
          </template>
        </v-text-field>
      </div>
    </v-form>

    <v-btn
      color="success"
      rounded="xl"
      variant="outlined"
      height="40"
      width="200"
      class="text-h5 mt-8 mx-auto"
      :loading="loadingEditItem"
      :disabled="!isFormValid || loadingGetItemById"
      flat
      @click="edit"
    >
      Edit
    </v-btn>
  </div>
</template>

<script setup lang="ts">
import { TAG_TYPE_LIST } from '@/constants'
import type { AddAdminTagDTO } from '@/types'

interface IDetailModal {
  id: string
}

const props = defineProps<IDetailModal>()
const emit = defineEmits(['EditItemSuccessFull'])
const { getItemById, loadingGetItemById, editItem, loadingEditItem } = useTagAdmin()
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

onMounted(async () => {
  const response = await getItemById(props.id)

  if (response.succeeded && response.data) {
    newItem.name = response.data.name
    newItem.icon = response.data.icon
    newItem.tagType = response.data.tagType
  }
})

const edit = async () => {
  if (!isFormValid.value) return

  const response = await editItem(newItem, props.id)

  if (response.succeeded) {
    emit('EditItemSuccessFull')
    resetForm()
  }
}
</script>

<style scoped>
</style>
