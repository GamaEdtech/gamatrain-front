<template>
  <v-container
    class="mt-16 d-flex justify-center w-100"
  >
    <div
      class="pa-8 bg-grey100 rounded-lg box-login w-100"
    >
      <div class="d-flex flex-column align-center mb-6">
        <v-img
          src="/images/adminAuth.png"
          alt="Gama"
          width="100"
          height="100"
        />
        <h1 class="text-h4 text-grey900 font-weight-bold mt-4">
          Admin Login
        </h1>
      </div>

      <v-form
        v-model="isFormValid"
        @submit.prevent="submit"
      >
        <div class="text-h6 text-grey700 font-weight-medium mb-1">
          Email
        </div>
        <v-text-field
          v-model="form.email"
          placeholder="Enter email"
          variant="solo"
          density="comfortable"
          rounded="pill"
          flat
          bg-color="white"
          base-color="grey200"
          color="primary"
          :rules="[required]"
          class="mb-6"
        />

        <div class="text-h6 text-grey700 font-weight-medium mb-1">
          Password
        </div>
        <v-text-field
          v-model="form.password"
          :append-inner-icon="passwordShow ? 'md:visibility' : 'md:visibility_off'"
          placeholder="Enter password"
          variant="solo"
          density="comfortable"
          rounded="pill"
          flat
          bg-color="white"
          base-color="grey200"
          color="primary"
          :rules="[required]"
          :type="passwordShow ? 'text' : 'password'"
          class="mb-6"
          @click:append-inner="passwordShow = !passwordShow"
        />

        <v-btn
          rounded="pill"
          block
          height="42"
          color="primary"
          class="text-grey800 text-h5 font-weight-semibold"
          :loading="loading"
          :disabled="!isFormValid"
          type="submit"
        >
          Login
        </v-btn>
      </v-form>
    </div>
  </v-container>
</template>

<script setup lang="ts">
definePageMeta({
  name: 'admin-auth',
  layout: 'default',
  auth: false,
})

const router = useRouter()
const { $toast } = useNuxtApp()
const { login, setUserToken } = useAuth()
const { getProfile, setUser } = useUser()
const { required } = useValidationRules()

const isFormValid = ref(false)
const passwordShow = ref(false)
const loading = ref(false)

const form = reactive({
  email: '',
  password: '',
})

const submit = async () => {
  try {
    loading.value = true
    const response = await login({
      identity: form.email,
      password: form.password,
      type: 'request',
    })

    if (!response.succeeded || !response.data?.token) {
      $toast.error(response.errors[0].message || 'We could not sign you in. Please check your email and password, then try again.')
      return
    }

    setUserToken(response.data.token)

    const profileData = await getProfile(response.data.token)
    if (!profileData.data?.data) {
      $toast.error('You are signed in, but we could not load your profile details. Please try again.')
      return
    }

    setUser(profileData.data.data)
    await router.push('/admin/contact-us')
  }
  catch (error) {
    console.error('Admin login error:', error)
    $toast.error('An error occurred during login. Please try again.')
  }
  finally {
    loading.value = false
  }
}
</script>

<style scoped>
.box-login{
  max-width : 600px
}
</style>
