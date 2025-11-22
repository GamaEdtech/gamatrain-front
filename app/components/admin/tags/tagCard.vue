<script setup>
const props = defineProps({
  modelValue: Boolean,
  selectedTag: Object,
})

const { $toast } = useNuxtApp()

const emit = defineEmits([
  'update:modelValue',
  'fetchTags',
])

const selectedTag = reactive(props.selectedTag)

const editEnable = ref(false)

const rules = {
  required: v => !!v || 'Field is required',
}

const isValid = computed(() => {
  return (
    !!props.selectedTag.name
    && !!props.selectedTag.tagType
    && !!props.selectedTag.icon
  )
})

const EditTag = async () => {
  if (!isValid.value) {
    return
  }
  try {
    const res = await useApiService.put(`/api/v2/admin/tags/${selectedTag.id}`, {
      name: selectedTag.name,
      icon: selectedTag.icon,
      tagType: selectedTag.tagType,
    })
    if (res.succeeded === true) {
      $toast.success('Tag Updated successfully!')
      emit('fetchTags')
      emit('update:modelValue', false)
    }
    else
      $toast.error(res.errors[0].message)
  }
  catch (err) {
    if (err.response?.status === 400) {
      $toast.error(err.response.data.message)
    }
  }
  finally {
    editEnable.value = !editEnable.value
  }
}

const closeDialog = () => {
  editEnable.value = false
  emit('update:modelValue', false)
}
</script>

<template>
  <div class="text-center">
    <v-dialog
      :model-value="modelValue"
      width="500"
      @click:outside="closeDialog"
    >
      <v-card class="bg-primary-gray-200 rounded-xl">
        <v-card-title
          class="gtext-t4 bg-white flex-column d-flex align-center pt-12"
        >
          <p class="primary-gray-700 gtext-t3 font-weight-semibold mb-2">
            Tag Card
          </p>
        </v-card-title>
        <div class="pa-3">
          <div class="d-flex flex-column w-100 ga-2 flex-sm-row">
            <div class="w-100">
              <label class="primary-gray-700 gtext-t6 font-weight-medium">
                Name
              </label>
              <v-text-field
                v-model="selectedTag.name"
                variant="solo"
                density="comfortable"
                class="mt-1"
                :disabled="!editEnable"
                :rules="[rules.required]"
              />
            </div>
            <div class="w-100">
              <label class="primary-gray-700 gtext-t6 font-weight-medium">
                Tag Type
              </label>
              <v-select
                v-model="selectedTag.tagType"
                variant="solo"
                density="comfortable"
                class="mt-1"
                :items="['Post', 'School', 'Feature']"
                :disabled="!editEnable"
                :rules="[rules.required]"
              />
            </div>
          </div>

          <label class="primary-gray-700 gtext-t6 font-weight-medium">
            Icon
          </label>
          <v-text-field
            v-model="selectedTag.icon"
            variant="solo"
            density="comfortable"
            class="mt-1"
            :disabled="!editEnable"
            :rules="[rules.required]"
          />
        </div>

        <div class="pa-3 bg-white">
          <v-card-actions class="px-0">
            <v-btn
              class="closeBtn"
              variant="plain"
              @click="closeDialog"
            >
              <span class="mdi mdi-close gtext-t1" />
            </v-btn>
            <v-btn
              v-if="!editEnable"
              variant="plain"
              class="editBtn"
              @click="editEnable = !editEnable"
            >
              <v-icon
                small
                class="gtext-t1"
              >
                mdi-pencil
              </v-icon>
              <v-tooltip
                activator="parent"
                location="top"
              >
                Edit
              </v-tooltip>
            </v-btn>
            <v-btn
              v-else
              variant="plain"
              class="editBtn"
              @click="EditTag(selectedTag.id)"
            >
              <v-icon
                small
                class="gtext-t1"
              >
                mdi-check
              </v-icon>
              <v-tooltip
                activator="parent"
                location="top"
              >
                Save
              </v-tooltip>
            </v-btn>
          </v-card-actions>
        </div>
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

.editBtn {
  width: 24px !important;
  min-width: 24px !important;
  height: 24px !important;
  color: #919191;
  position: absolute;
  top: 16px;
  right: 16px;
  padding: 0px !important;
  &:hover {
    color: #ffb600;
    transition: 300ms;
  }
}

:deep(.v-btn__content) {
  font-family: Inter, sans-serif !important;
  font-size: 1.4rem;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
}

/* Firefox support */
.v-dialog .v-card {
  scrollbar-width: thin;
  scrollbar-color: rgba(0, 0, 0, 0.3) transparent;
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
</style>
