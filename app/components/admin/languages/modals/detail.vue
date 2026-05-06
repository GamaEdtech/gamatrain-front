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
          :rules="[rules.required]"
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
          v-model="newItem.code"
          label="Culture"
          :items="cultures.map((item) => ({
            id: item.code,
            title: item.displayName,
          }))"
          :data-loading="!loadingGetCultures"
          rounded="lg"
          density="compact"
          base-color="grey200"
          color="primary"
          :defalut-lable="false"
          :loading-value="loadingGetItemById"
          :rules="[rules.required]"
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
          :rules="[rules.required]"
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
        <v-checkbox
          v-model="newItem.isEnable"
          color="primary"
          class="text-h4"
          hide-details
          false-icon="md:check_box_outline_blank"
          true-icon="md:check_box"
        >
          <template #label>
            <span class="text-h6 text-grey700 text-no-wrap ml-2">Is Enable</span>
          </template>
        </v-checkbox>
      </div>

      <div class="w-100 d-flex flex-column align-start justify-start ga-1">
        <v-checkbox
          v-model="newItem.isDefault"
          color="primary"
          class="text-h4"
          hide-details
          false-icon="md:check_box_outline_blank"
          true-icon="md:check_box"
        >
          <template #label>
            <span class="text-h6 text-grey700 text-no-wrap ml-2">Is Default</span>
          </template>
        </v-checkbox>
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
import type {
  AdminLanguageDTO,
} from '~/types/api'

interface IDetailModal {
  id: string
}

const props = defineProps<IDetailModal>()
const emit = defineEmits(['EditItemSuccessFull'])

const { getItemById, loadingGetItemById, getCultures, loadingGetCultures, cultures, editItem, loadingEditItem } = useLanguages()

const newItem = reactive({
  name: '',
  code: '',
  icon: '',
  isEnable: false,
  isDefault: false,
})

const isFormValid = ref(false)

const rules = {
  required: (v: string) => !!v || 'This field is required',
}

onMounted(async () => {
  getCultures()
  const response = await getItemById(props.id)
  if (response.succeeded && response.data) {
    newItem.name = (response.data as AdminLanguageDTO).name
    newItem.code = (response.data as AdminLanguageDTO).code
    newItem.icon = (response.data as AdminLanguageDTO).icon
    newItem.isEnable = (response.data as AdminLanguageDTO).isEnable
    newItem.isDefault = (response.data as AdminLanguageDTO).isDefault
  }
})

const edit = async () => {
  if (!isFormValid.value) return

  const response = await editItem(newItem, props.id)
  if (response.succeeded) {
    newItem.name = ''
    newItem.code = ''
    newItem.icon = ''
    newItem.isEnable = false
    newItem.isDefault = false
    emit('EditItemSuccessFull')
  }
}
</script>

<style scoped>
</style>
