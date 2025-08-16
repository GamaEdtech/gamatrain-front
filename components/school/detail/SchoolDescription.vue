<template>
  <div>
    <div class="mb-4">
      Description
    </div>
    <h1 class="text-h6 text-md-h5">
      <div class="d-flex align-center flex-wrap">
        <div
          v-if="!generalDataEditMode.description"
          class="d-flex align-center"
        >
          <div>
            {{ contentData.description || defaultDescription }}
          </div>
          <v-btn
            class="ml-4"
            icon
            color="blue-grey"
            variant="text"
            @click="handleEdit"
          >
            <v-icon size="large">
              mdi-pencil
            </v-icon>
          </v-btn>
        </div>
        <div class="w-70 w-md-100">
          <v-textarea
            v-if="generalDataEditMode.description"
            v-model="form.description"
            variant="outlined"
            label="Description"
            :rules="[(v) => !!v || 'Description is required']"
          >
            <template #append-inner>
              <v-btn
                :loading="decSubmitLoader"
                color="success"
                variant="flat"
                size="x-small"
                icon
                @click="handleUpdate"
              >
                <v-icon size="large">
                  mdi-check
                </v-icon>
              </v-btn>
            </template>
          </v-textarea>
        </div>
      </div>
      <span v-show="contentData.school_type_title">
        ,
        {{ contentData.school_type_title }}
      </span>
      <span v-show="contentData.section_title">
        , {{ contentData.section_title }}
      </span>
      <span v-show="contentData.area_title">
        , {{ contentData.area_title }}
      </span>
    </h1>
  </div>
</template>

<script setup>
const emit = defineEmits(['edit', 'update'])
const props = defineProps({
  content: {
    type: Object,
    required: true,
  },
})
const nuxtApp = useNuxtApp()
const route = useRoute()
const contentData = ref(props.content)

function generateDefaultDescription(data) {
  try {
    const name = data?.name || ''
    const city = data?.cityTitle || ''
    const state = data?.stateTitle || ''
    const country = data?.countryTitle || ''
    const location = [city, state, country].filter(Boolean).join(', ')

    const facilities = Array.isArray(data?.tags)
      ? data.tags
          .map(t => (typeof t === 'string' ? t : t?.title || t?.name))
          .filter(t => typeof t === 'string' && t.trim().length > 0)
          .join(', ')
      : ''

    const phone = data?.phoneNumber || ''
    const site = data?.webSite || ''

    const parts = []
    parts.push(`Discover ${name} in ${location}`)
    if (facilities) {
      parts.push(`— offering ${facilities} for students`)
    }

    const contactBits = []
    if (phone) contactBits.push(`Call ${phone}`)
    if (site) contactBits.push(`visit ${site}`)
    if (contactBits.length > 0) {
      parts.push(`. ${contactBits.join(' or ')}`)
    }

    let sentence = parts.join('')
    if (!sentence.endsWith('.')) sentence = `${sentence}.`
    return sentence
  }
  catch {
    return 'Discover this school.'
  }
}

const defaultDescription = computed(() =>
  generateDefaultDescription(contentData.value),
)
const decSubmitLoader = ref(false)
const generalDataEditMode = reactive({
  description: false,
})
const form = reactive({
  description: '',
})
function handleEdit() {
  form.description
    = contentData.value.description || defaultDescription.value || ''
  generalDataEditMode.description = true
}
function isRequired(value) {
  try {
    return !!value.trim()
  }
  catch {
    return false
  }
}
function handleUpdate() {
  let formData = {}
  if (!isRequired(form.description)) {
    nuxtApp.$toast?.error('Please enter a valid Description')
    return
  }
  generalDataEditMode.description = false
  formData = { description: form.description ?? null }
  decSubmitLoader.value = true
  useApiService
    .post(`/api/v2/schools/${route.params.id}/contributions`, formData)
    .then(async (response) => {
      if (response.succeeded) {
        nuxtApp.$toast?.success(
          'Your contribution has been successfully submitted',
        )
        const newDescription = response?.data?.description ?? form.description
        contentData.value.description = newDescription
        emit('update', newDescription)
      }
      else {
        nuxtApp.$toast?.error(response?.errors[0]?.message)
      }
    })
    .catch((err) => {
      if (err?.response?.status == 401 || err?.response?.status == 403) {
        nuxtApp.$toast?.error('Please login to update school description')
      }
      else nuxtApp.$toast?.error(err?.response?.data?.message)
    })
    .finally(() => {
      form.description = null
      decSubmitLoader.value = false
    })
}

watch(
  () => form.description,
  (val) => {
    if (generalDataEditMode.description) emit('edit', val ?? '')
  },
)
</script>
