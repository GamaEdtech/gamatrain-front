<script setup>
const _props = defineProps({
  modelValue: Boolean,
})

const searchParams = reactive({
  name: null,
  email: null,
  startDate: null,
  endDate: null,
})

const emit = defineEmits([
  'update:modelValue',
  'search',
])

const startMenu = ref(false)
const endMenu = ref(false)

const handleSearch = () => {
  // Convert dates to ISO (or keep null if not selected)
  const startISO = searchParams.startDate
    ? new Date(searchParams.startDate).setHours(0, 0, 0, 0)
    : null
  const endISO = searchParams.endDate
    ? new Date(searchParams.endDate).setHours(23, 59, 59, 999)
    : null

  const payload = {
    name: searchParams.name || null,
    email: searchParams.email || null,
    startDate: startISO ? new Date(startISO).toISOString() : null,
    endDate: endISO ? new Date(endISO).toISOString() : null,
  }

  emit('search', payload)

  searchParams.name = null
  searchParams.email = null
  searchParams.startDate = null
  searchParams.endDate = null

  emit('update:modelValue', false)
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
            Search
          </p>
        </v-card-title>
        <v-card-text>
          <label class="primary-gray-700 gtext-t6 font-weight-medium">
            Name
          </label>
          <v-text-field
            v-model="searchParams.name"
            variant="solo"
            density="comfortable"
            class="mt-1"
          />
          <label class="primary-gray-700 gtext-t6 font-weight-medium">
            Email
          </label>
          <v-text-field
            v-model="searchParams.email"
            variant="solo"
            density="comfortable"
            class="mt-1"
          />
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
                v-model="searchParams.startDate"
                readonly
                variant="solo"
                density="comfortable"
                class="mt-1"
                v-bind="props"
              />
            </template>
            <v-date-picker
              v-model="searchParams.startDate"
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
                v-model="searchParams.endDate"
                readonly
                variant="solo"
                density="comfortable"
                class="mt-1"
                v-bind="props"
              />
            </template>
            <v-date-picker
              v-model="searchParams.endDate"
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
