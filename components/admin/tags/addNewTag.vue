<script setup>
const _props = defineProps({
  modelValue: Boolean,
})

const { $toast } = useNuxtApp()

const emit = defineEmits([
  'update:modelValue',
  'fetchTags',
])

const newTag = reactive({
  name: '',
  icon: '',
  tagType: '',
})

const rules = {
  required: v => !!v || 'Field is required',
}

const isValid = computed(() => {
  return (
    !!newTag.name
    && !!newTag.tagType
    && !!newTag.icon
  )
})

const createNewTag = async () => {
  if (!isValid.value) {
    return
  }
  try {
    const res = await useApiService.post(`/api/v2/admin/tags`, {
      name: newTag.name,
      icon: newTag.icon,
      tagType: newTag.tagType,
    })
    if (res.succeeded === true) {
      $toast.success('Tag created successfully!')
      emit('update:modelValue', false)
      emit('fetchTags')
    }
    else
      $toast.error(res.errors[0].message)
  }
  catch (err) {
    if (err.response?.status === 400) {
      $toast.error(err.response.data.message)
    }
  }
}
</script>

<template>
  <div class="text-center">
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
            Add New Tag
          </p>
        </v-card-title>
        <div class="pa-3">
          <div class="d-flex flex-column w-100 ga-2 flex-sm-row">
            <div class="w-100">
              <label class="primary-gray-700 gtext-t6 font-weight-medium">
                Name
              </label>
              <v-text-field
                v-model="newTag.name"
                variant="solo"
                density="comfortable"
                class="mt-1"
                :rules="[rules.required]"
              />
            </div>
            <div class="w-100">
              <label class="primary-gray-700 gtext-t6 font-weight-medium">
                Tag Type
              </label>
              <v-select
                v-model="newTag.tagType"
                variant="solo"
                density="comfortable"
                class="mt-1"
                :items="['Post', 'School', 'Feature']"
                :rules="[rules.required]"
              />
            </div>
          </div>

          <label class="primary-gray-700 gtext-t6 font-weight-medium">
            Icon
          </label>
          <v-text-field
            v-model="newTag.icon"
            variant="solo"
            density="comfortable"
            class="mt-1"
            :rules="[rules.required]"
          />
        </div>

        <div class="pa-3 bg-white">
          <v-card-actions class="px-0 justify-center">
            <v-btn
              class="closeBtn"
              variant="plain"
              @click="$emit('update:modelValue', false)"
            >
              <span class="mdi mdi-close gtext-t1" />
            </v-btn>
            <v-btn
              variant="plain"
              class="createBtn"
              rounded
              :disabled="!isValid"
              @click="createNewTag()"
            >
              Create New Tag
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

.createBtn{
    opacity: 1 !important;
    background-color: #12b76a;
    color: white;
    padding: 8px !important;
    &:hover {
        background-color: #0c9253;
        transition: 300ms;
    }
    &:disabled{
        opacity: 0.5 !important;
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
