<script setup>
const props = defineProps({
  modelValue: Boolean,
  searchType: String,
})

const searchVar = ref('')
const searchStartDate = ref('')
const searchEndDate = ref('')
const emit = defineEmits([
  'update:modelValue',
  'search',
])

const startMenu = ref(false)
const endMenu = ref(false)

const handleSearch = () => {
  if (props.searchType === 'Name' || props.searchType === 'Email') {
    emit('search', { type: props.searchType, value: searchVar.value })
    searchVar.value = ''
  }
  else {
    // convert to ISO before emitting
    const startISO = searchStartDate.value ? new Date(searchStartDate.value).setHours(0, 0, 0, 0) : null
    const endISO = searchEndDate.value ? new Date(searchEndDate.value).setHours(23, 59, 59, 999) : null

    emit('search', { type: props.searchType, start: startISO ? new Date(startISO).toISOString() : null,
      end: endISO ? new Date(endISO).toISOString() : null })
    searchStartDate.value = ''
    searchEndDate.value = ''
  }
  emit('update:modelValue', false) // close dialog after search
}
</script>

<template>
  <div>
    <v-dialog
      :model-value="modelValue"
      width="500"
      @click:outside="$emit('update:modelValue', false)"
    >
      <v-card class="bg-primary-gray-200 rounded-xl">
        <v-card-title
          class="gtext-t4 bg-white flex-column d-flex align-center pt-12"
        >
          <p class="primary-gray-700 gtext-t3 font-weight-semibold mb-2">
            Search by {{ props.searchType }}
          </p>
        </v-card-title>
        <v-card-text v-if="searchType == 'Name' || searchType == 'Email'">
          <label class="primary-gray-700 gtext-t6 font-weight-medium">
            {{ type }}
          </label>
          <v-text-field
            v-model="searchVar"
            variant="solo"
            density="comfortable"
            class="mt-1"
          />
        </v-card-text>
        <v-card-text v-else>
          <label class="primary-gray-700 gtext-t6 font-weight-medium">
            Start Date
          </label>
          <v-menu
            v-model="startMenu"
            :close-on-content-click="false"
            transition="scale-transition"
            offset-y
          >
            <template #activator="{ props }">
              <v-text-field
                v-model="searchStartDate"
                readonly
                variant="solo"
                density="comfortable"
                class="mt-1"
                v-bind="props"
              />
            </template>
            <v-date-picker
              v-model="searchStartDate"
              color="primary"
              @update:model-value="() => startMenu = false"
            />
          </v-menu>
          <label class="primary-gray-700 gtext-t6 font-weight-medium">
            End Date
          </label>
          <v-menu
            v-model="endMenu"
            :close-on-content-click="false"
            transition="scale-transition"
            offset-y
          >
            <template #activator="{ props }">
              <v-text-field
                v-model="searchEndDate"
                readonly
                variant="solo"
                density="comfortable"
                class="mt-1"
                v-bind="props"
              />
            </template>
            <v-date-picker
              v-model="searchEndDate"
              color="primary"
              @update:model-value="() => endMenu = false"
            />
          </v-menu>
        </v-card-text>
        <v-card-actions class="px-0 justify-center">
          <v-btn
            class="closeBtn"
            variant="plain"
            @click="$emit('update:modelValue', false)"
          >
            <span class="mdi mdi-close gtext-t1" />
          </v-btn>
          <v-btn
            variant="outlined"
            class="searchBtn"
            :disabled="
              (searchType === 'Name' || searchType === 'Email') && !searchVar
                || searchType === 'Date' && (!searchStartDate || !searchEndDate)
            "
            @click="handleSearch"
          >
            Search
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<style scoped>
:deep(.v-field__input) {
  font-family: Inter, sans-serif;
  font-size: 1.4rem;
  line-height: 1rem;
  font-weight: 400;
}
:deep(.v-field) {
  border-radius: 16px;
  border: 1px solid #c6c6c6;
  box-shadow: none;
}
.v-input {
  font-family: Inter, sans-serif !important;
  font-size: 1.2rem !important;
  line-height: 1.8rem !important;
  font-weight: 400 !important;
}

:deep(.v-btn__content span) {
  font-family: Inter, sans-serif !important;
  font-size: 1.4rem;
  font-style: normal;
  font-weight: 700;
  line-height: 0 !important;
}
:deep(.v-btn__content) {
  font-family: Inter, sans-serif !important;
  font-size: 1.4rem;
  font-style: normal;
  font-weight: 700;
  line-height: 0 !important;
  align-items: center;
}
.closeBtn {
  width: 24px !important;
  min-width: 24px !important;
  height: 24px !important;
  color: #919191;
  position: absolute;
  top: 16px;
  left: 16px;
  padding: 0px !important;
  &:hover {
    color: #f04438;
    transition: 300ms;
  }
}
.searchBtn{
  width: 200px;
  border-width: 0px;
  color: black;
  margin-bottom: 14px;
  background-color: #ffb300;
  border-radius: 8px;
}
</style>
