<template>
  <div class="contact-us-page">
    <v-container class="mt-16 main">
      <v-row>
        <v-col
          cols="12"
          sm="6"
          md="4"
        >
          <div class="pt-4 mb-6 mb-md-0 mr-0 mr-md-12 d-flex flex-column">
            <v-form
              ref="form"
              v-model="isFormValid"
              class="form"
            >
              <!-- Name Input -->
              <div>
                <label class="label">Name*</label>

                <v-text-field
                  v-model="formsData.name"
                  rounded
                  placeholder="Enter your full name"
                  variant="outlined"
                  height="48"
                  :rules="[rules.required]"
                />
              </div>

              <!-- Email Input -->
              <div>
                <label class="label">Email*</label>

                <v-text-field
                  v-model="formsData.email"
                  rounded
                  variant="outlined"
                  placeholder="Enter your email address"
                  outlined
                  height="48"
                  :rules="[rules.required, rules.emailStrict]"
                />
              </div>

              <!-- Subject Input -->
              <div>
                <label class="label">Subject*</label>

                <v-text-field
                  v-model="formsData.subject"
                  rounded
                  variant="outlined"
                  placeholder="Enter your Subject"
                  outlined
                  class="rounded-pill mb-5"
                  height="48"
                  :rules="[rules.required]"
                />
              </div>

              <!-- Message textarea -->
              <div>
                <label class="label">Discription*</label>

                <v-textarea
                  v-model="formsData.message"
                  rounded
                  variant="outlined"
                  outlined
                  name="input-7-4"
                  hint="Enter at least 25 characters."
                  placeholder="Write something..."
                  no-resize
                  height="155"
                  :rules="[rules.required, customRules.min25]"
                />
              </div>

              <v-btn
                variant="flat"
                color="primary"
                size="x-large"
                type="submit"
                rounded
                class="primary-gray-800"
                height="42"
                block
                :disabled="!isFormValid"
                :loading="formLoading"
                @click.prevent="submitForm"
              >
                Send
              </v-btn>
            </v-form>
          </div>
        </v-col>
        <v-col
          class="map-container"
          cols="12"
          sm="6"
          md="8"
        >
          <div class="address">
            <v-icon
              size="x-large"
              color="#97A2B2"
              class="icon"
              icon="mdi-map-marker"
            />
            <span> 2419 West 53rd Street, Apt 5B, New York, NY 10019 </span>
          </div>
          <Map
            :initial-center="[41.050652, 28.894283]"
            :highlight-location="[41.050652, 28.894283]"
            :show-highlight-location="true"
            :initial-zoom="zoom"
            :border-radius="20"
            :zoom-enabled="false"
          />
        </v-col>
      </v-row>
      <div />
    </v-container>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRecaptcha } from '~/composables/useRecapcha'
import useApiService from '~/composables/useApiService'
import Map from '@/components/common/Map.client.vue'
import { useValidationRules } from '~/composables/useValidationRules'

useSeoMeta({
  title: `Contact us`,
  ogTitle: `Contact us`,
})

const { $toast } = useNuxtApp()

const zoom = ref(20)
const rules = useValidationRules()
const customRules = {
  min25: rules.minLength(25),
}
const formsData = reactive({
  name: '',
  email: '',
  message: '',
  subject: '',
})
const isFormValid = ref<boolean>(false)
const formLoading = ref<boolean>(false)

const form = ref<HTMLFormElement | null>(null)
const { getToken, initCaptcha, isLoaded } = useRecaptcha()

const submitForm = async () => {
  formLoading.value = true

  if (isFormValid.value) {
    try {
      if (!isLoaded()) {
        throw new Error('reCAPTCHA not loaded yet. Please try again.')
      }

      const token = await getToken('submit')

      const formData = new FormData()
      formData.append('Captcha', token)
      formData.append('FullName', formsData.name)
      formData.append('Email', formsData.email)
      formData.append('Subject', formsData.subject)
      formData.append('Body', formsData.message)

      const res: { succeeded: boolean, errors?: Array<{ message: string }> }
        = await useApiService.post('/api/v2/tickets', formData)

      if (res.succeeded) {
        $toast.success('Your message has been sent successfully.')
      }
      else {
        res.errors?.forEach((error: { message: string }) => {
          $toast.error(error.message)
        })
      }

      // Reset form
      if (form.value) {
        form.value.reset()
      }
    }
    catch (error: unknown) {
      console.log(error)
      formLoading.value = false
      $toast.error('An error occurred. Please try again.')
    }
    finally {
      formLoading.value = false
    }
  }
  else {
    formLoading.value = false
  }
}

onMounted(() => {
  initCaptcha()
})
</script>

<style scoped>
.form {
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  gap: 1.5rem;
}

.label {
  display: block;
  margin-bottom: 1rem;
  font-weight: 600;
}

.map-container {
  position: relative;
  min-height: 400px;
}

.address {
  width: calc(100% - 24px);
  background-color: #f2f4f7;
  margin: 0 24px;
  padding: 1rem 2rem;
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  transform: translate(-1.2rem, -1.2rem);
  z-index: 1000;
  border-radius: 0 0 2rem 2rem;
}

.address span {
  font-size: 2rem;
  font-weight: 600;
  color: #334053;
}
</style>
