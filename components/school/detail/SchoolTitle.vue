<template>
  <h1 class="gtext-h4 gtext-sm-h4 gtext-lg-h4">
    <div class="d-flex align-center flex-wrap">
      <div v-show="!generalDataEditMode.name">
        {{ contentData.name }}
      </div>
      <v-btn
        v-if="!generalDataEditMode.name"
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
      <div class="w-70 w-md-100">
        <v-text-field
          v-if="generalDataEditMode.name"
          v-model="form.name"
          placeholder="Name"
          :rules="[(v) => !!v || 'Name is required']"
          variant="underlined"
        >
          <template #append-inner>
            <v-btn
              :loading="nameSubmitLoader"
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
        </v-text-field>
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
const nameSubmitLoader = ref(false)
const generalDataEditMode = reactive({
  name: false,
})
const form = reactive({
  name: '',
})
function handleEdit() {
  form.name = contentData.value.name || ''
  generalDataEditMode.name = true
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
  if (!isRequired(form.name)) {
    nuxtApp.$toast?.error('Please enter a valid Name')
    return
  }
  generalDataEditMode.name = false
  formData = { name: form.name ?? null }
  nameSubmitLoader.value = true
  useApiService
    .post(`/api/v2/schools/${route.params.id}/contributions`, formData)
    .then(async (response) => {
      if (response.succeeded) {
        nuxtApp.$toast?.success(
          'Your contribution has been successfully submitted',
        )
        contentData.value.name = form.name
        emit('update', form.value)
      }
      else {
        nuxtApp.$toast?.error(response?.errors[0]?.message)
      }
    })
    .catch((err) => {
      if (err?.response?.status == 401 || err?.response?.status == 403) {
        nuxtApp.$toast?.error('Please login to update school name')
      }
      else nuxtApp.$toast?.error(err?.response?.data?.message)
    })
    .finally(() => {
      form.name = null
      nameSubmitLoader.value = false
    })
}
</script>
