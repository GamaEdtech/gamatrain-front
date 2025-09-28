<template>
  <v-dialog
    v-model="dialogVisible"
    transition="dialog-bottom-transition"
    max-width="780"
    class="toast-dialog-notif"
  >
    <v-card>
      <v-card-text class="px-0 py-0">
        <div class="py-6 py-md-1 px-4">
          <div class="d-flex justify-space-between align-center">
            <div class="gtext-h5 primary-gray-700" />
            <v-btn
              variant="text"
              icon
              @click="closeDialog"
            >
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </div>

          <div class="">
            <div class="d-flex align-center justify-center">
              <div class="report-icon-alert">
                <v-icon
                  size="60"
                  color="primary"
                  class=""
                >
                  mdi-link
                </v-icon>
              </div>
            </div>
            <div
              class="mt-4 primary-gray-700 font-weight-bold font-size-18 text-center"
            >
              You can change slug
            </div>
          </div>
        </div>

        <div class="mt-6 bg-primary-gray-100 px-6 pb-3 pt-7">
          <div class="w-md-80 mx-md-auto">
            <v-textarea
              v-model="localSlug"
              class="dialog-input"
              background-color="white"
              variant="outlined"
              rounded
              placeholder="Enter The Slug..."
              :rules="[(v) => v.length >= 4 || 'Enter at least 4 characters.']"
              persistent-hint
              rows="2"
            />
          </div>
        </div>

        <v-card-actions class="bg-primary-gray-100 pt-2 pb-4">
          <div class="w-md-50 w-80 mx-auto d-flex justify-center">
            <v-btn
              block
              rounded
              color="primary"
              :disabled="!localSlug || localSlug.length < 4 || !slugValid"
              :loading="submitLoader"
              variant="flat"
              @click="saveSlug"
            >
              Save
            </v-btn>
          </div>
        </v-card-actions>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
  value: {
    type: Boolean,
    default: false,
  },
  slug: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['update:modelValue', 'save'])
const { $toast } = useNuxtApp()

// State
const localSlug = ref(props.slug)
const submitLoader = ref(false)
const slugValid = ref(false)
let _slugDebounce = null

// Computed
const dialogVisible = computed({
  get: () => props.value,
  set: value => emit('update:modelValue', value),
})

// Watchers
watch(
  () => props.slug,
  (newVal) => {
    localSlug.value = newVal
  },
)

watch(
  () => props.value,
  (val) => {
    if (val) localSlug.value = props.slug
  },
)

watch(localSlug, async (newVal) => {
  if (_slugDebounce) clearTimeout(_slugDebounce)

  if (!newVal || newVal.length < 4) {
    slugValid.value = false
    return
  }

  if (newVal === props.slug) {
    slugValid.value = true
    return
  }

  _slugDebounce = setTimeout(async () => {
    try {
      const { data: response } = await useFetch(
        '/api/v2/blogs/slugs/validate',
        {
          params: { slug: newVal },
          headers: {
            Authorization: `Bearer ${localStorage.getItem('v2_token')}`,
          },
        },
      )

      if (response.value && response.value.succeeded) {
        if (response.value.data === true) {
          slugValid.value = true
        }
        else {
          slugValid.value = false
          $toast.error('Slug already exists.')
        }
      }
      else {
        slugValid.value = false
      }
    }
    catch {
      slugValid.value = false
    }
  }, 400)
})

// Methods
const closeDialog = () => {
  dialogVisible.value = false
}

const saveSlug = async () => {
  if (localSlug.value === props.slug) {
    dialogVisible.value = false
    return
  }

  if (!localSlug.value || localSlug.value.length < 4) {
    $toast.error('Enter at least 4 characters for the slug.')
    return
  }

  submitLoader.value = true
  try {
    const { data: response } = await useFetch('/api/v2/blogs/slugs/generate', {
      params: { title: localSlug.value },
      headers: {
        Authorization: `Bearer ${localStorage.getItem('v2_token')}`,
      },
    })

    if (response.value && response.value.succeeded && response.value.data) {
      emit('save', response.value.data)
      dialogVisible.value = false
    }
    else {
      $toast.error('Failed to generate slug.')
    }
  }
  catch {
    $toast.error('Failed to generate slug.')
  }
  submitLoader.value = false
}
</script>

<style scoped>
.report-icon-alert {
  background: #f2f4f7;
  width: 100px;
  height: 100px;
  border-radius: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px;
}

.dialog-input {
  border-radius: 16px !important;
}

.dialog-input :deep(.v-input__slot) {
  border-color: #e4e7ec !important;
}
</style>
