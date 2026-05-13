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
        />
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
        />
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
const emit = defineEmits(['AddItemSuccessFull'])

const { addItem, loadingAddItem, getCultures, loadingGetCultures, cultures } = useLanguageAdmin()

onMounted(async () => {
  await getCultures()
})

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

const add = async () => {
  if (!isFormValid.value) return

  const response = await addItem(newItem)
  if (response.succeeded) {
    newItem.name = ''
    newItem.code = ''
    newItem.icon = ''
    newItem.isEnable = false
    newItem.isDefault = false
    emit('AddItemSuccessFull')
  }
}
</script>

<style scoped>
</style>
