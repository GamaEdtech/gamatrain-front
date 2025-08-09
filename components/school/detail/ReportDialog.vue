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
              icon
              variant="text"
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
                  mdi-alert
                </v-icon>
              </div>
            </div>
            <div
              class="mt-4 primary-gray-700 font-weight-bold font-size-18 text-center"
            >
              Report Form
            </div>
          </div>
        </div>

        <div class="mt-4 bg-primary-gray-100 px-6 pb-3 pt-7">
          <div class="w-md-80 mx-md-auto">
            <div class="mb-3 primary-gray-900 font-size-16">
              Description
            </div>
            <v-textarea
              v-model="reportForm.description"
              bg-color="white"
              variant="outlined"
              placeholder="Enter here..."
              :rules="[
                (v) => v.length >= 25 || 'Enter at least 25 characters.',
              ]"
              hint="Enter at least 25 characters."
              persistent-hint
              rows="5"
            />
          </div>
        </div>

        <v-card-actions class="bg-primary-gray-100 pt-5 pb-8">
          <div class="w-md-50 w-80 mx-auto d-flex justify-center">
            <v-btn
              block
              rounded
              color="primary"
              :disabled="
                !reportForm.description || reportForm.description.length < 25
              "
              :loading="reportSubmitLoader"
              variant="flat"
              @click="submitReport"
            >
              Send
            </v-btn>
          </div>
        </v-card-actions>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useNuxtApp } from '#app'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  schoolId: {
    type: String,
    required: true,
  },
})
const emit = defineEmits(['update:modelValue', 'open-auth-dialog'])

const reportForm = ref({ description: '' })
const reportSubmitLoader = ref(false)

const dialogVisible = computed({
  get: () => props.modelValue,
  set: value => emit('update:modelValue', value),
})

const nuxtApp = useNuxtApp()

function closeDialog() {
  dialogVisible.value = false
}

async function submitReport() {
  if (
    !reportForm.value.description
    || reportForm.value.description.length < 25
  ) {
    nuxtApp.$toast?.error(
      'Please provide a description with at least 25 characters',
    )
    return
  }
  reportSubmitLoader.value = true
  const reportData = { description: reportForm.value.description }
  try {
    const response = await useApiService.post(
      `/api/v2/schools/${props.schoolId}/issues`,
      reportData,
    )

    if (response.succeeded) {
      nuxtApp.$toast?.success('Thanks for your report!')
      dialogVisible.value = false
      reportForm.value.description = ''
    }
    else {
      nuxtApp.$toast?.error(
        response?.errors?.[0]?.message
        || 'Something went wrong, please try again.',
      )
    }
  }
  catch (err) {
    if (err?.response?.status === 401 || err?.response?.status === 403) {
      emit('open-auth-dialog', 'login')
      nuxtApp.$toast?.error('Please login to submit a report')
    }
    else {
      nuxtApp.$toast?.error('Something went wrong, please try again.')
    }
    // Optionally log error
    // console.error('Error submitting report:', err);
  }
  finally {
    reportSubmitLoader.value = false
  }
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
</style>
