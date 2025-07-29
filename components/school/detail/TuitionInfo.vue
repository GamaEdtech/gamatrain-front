<template>
  <div class="d-flex mt-11 mb-9">
    <div class="gtext-h5 gtext-md-h5 primary-gray-600">
      Tuition fee
    </div>
    <v-spacer />
    <div class="gtext-t2 font-weight-heavy primary-gray-800">
      <span v-if="contentData.tuition && !isEditMode">
        <span class="gtext-t6">$</span>
        {{ contentData.tuition.toLocaleString() }}
      </span>
      <span
        v-if="!contentData.tuition && !isEditMode"
        class="gtext-t4 primary-blue-500 align-self-center pointer"
        @click="handleEdit"
      >
        Contribute
      </span>
      <template v-if="!isEditMode && contentData.tuition">
        <v-btn
          class="ml-2"
          icon
          color="blue-grey"
          variant="text"
          @click="handleEdit"
        >
          <v-icon size="large">
            mdi-pencil
          </v-icon>
        </v-btn>
      </template>
      <v-text-field
        v-if="isEditMode"
        v-model="tuitionFee"
        :rules="tuitionRule"
        width="200"
        placeholder="Tuition fee"
        variant="underlined"
        type="number"
        hide-spin-buttons
        prepend-inner-icon="mdi-currency-usd"
      >
        <template #append>
          <v-btn
            :loading="submitLoader"
            color="success"
            variant="flat"
            width="30"
            height="30"
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
</template>

<script setup>
const props = defineProps({
  contentData: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['update:contentData'])
const nuxtApp = useNuxtApp()
const route = useRoute()

const isEditMode = ref(false)
const submitLoader = ref(false)
const tuitionFee = ref(0)
const tuitionRule = [
  v => !!v || 'Tuition fee is required',
  v => /^\d+$/.test(v) || 'Please enter only numbers',
]

const handleEdit = () => {
  tuitionFee.value = props.contentData.tuition ? props.contentData.tuition : 0
  isEditMode.value = true
}

function isValid(value) {
  return /^\d+$/.test(value)
}
const handleUpdate = () => {
  let formData = {}
  if (!isValid(tuitionFee.value)) {
    nuxtApp.$toast?.error('Please enter a valid Tuition Fee')
    return
  }
  formData = { tuition: tuitionFee.value ?? null }
  submitLoader.value = true

  useApiService
    .post(`/api/v2/schools/${route.params.id}/contributions`, formData)
    .then(async (response) => {
      if (response.succeeded) {
        nuxtApp.$toast?.success(
          'Thank you! Your contribution has been successfully submitted and is pending admin approval.',
        )
        emit('update:contentData', { ...props.contentData, tuition: Number(tuitionFee.value) })
      }
      else {
        nuxtApp.$toast?.error(response?.errors[0]?.message)
      }
    })
    .catch((err) => {
      console.log('err', err)

      if (err?.response?.status == 401 || err?.response?.status == 403) {
        nuxtApp.$toast?.error('Please login to update tuition information')
      }
      else nuxtApp.$toast?.error(err?.response?.data?.message)
    })
    .finally(() => {
      isEditMode.value = false
      submitLoader.value = false
    })
}
</script>
