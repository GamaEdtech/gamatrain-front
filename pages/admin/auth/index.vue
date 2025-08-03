<script setup>
definePageMeta({
  name: 'admin-auth',
  layout: 'default',
  auth: false,
})

const router = useRouter()

const isFormValid = ref(false)
const passwordShow = ref(false)

const emailRules = [v => !!v || 'Email or username is required']
const passwordRules = [
  v => !!v || 'Password is required',
  v => (v && v.length >= 4) || 'Password must be at least 4 characters',
]

const form = reactive({
  email: '',
  password: '',
})

// No API to sign in via token yet
const rememberMe = ref(false)

const Btnloading = ref(false)
const loginError = ref(null)

const submit = async () => {
  const auth = useAuth()
  try {
    Btnloading.value = true

    const result = await useApiService.post(
      '/api/v2/identities/tokens', {
        username: form.email,
        password: form.password,
      })

    if (result.succeeded == true) {
      localStorage.setItem('v2_token', result.data.token)
      auth.setUserToken(result.data.token)
      router.push('/admin/contact-us')
    }
    else {
      const errorMessage = result?.errors?.[0]?.message
      switch (errorMessage) {
        case 'WrongUsernameOrPassword':
          loginError.value = 'Invalid username or password. Please try again.'
          break
        case 'UserLockedOut':
          loginError.value = 'Your account has been locked due to multiple failed login attempts. Please contact an administrator.'
          break
        default:
          loginError.value = errorMessage || 'Login failed. Please try again.'
      }
    }
  }
  catch (err) {
    console.error('Login error:', err)
    loginError.value = 'An error occurred during login. Please try again.'
  }
  finally {
    Btnloading.value = false
  }
}
</script>

<template>
  <v-container
    class="fill-height my-9"
    fluid
  >
    <v-row
      align="center"
      justify="center"
    >
      <v-col
        cols="12"
        sm="8"
        md="6"
        lg="5"
      >
        <v-card
          class="pa-8"
          elevation="0"
          color="#F2F4F7"
          rounded="lg"
        >
          <div class="text-center mb-6">
            <img
              src="/images/adminAuth.png"
              alt="Gama"
              class="wh-100"
            >
            <h1 class="font-size-18 primary-gray-900 font-weight-bold mt-4">
              Admin Login
            </h1>
          </div>

          <v-alert
            v-if="loginError"
            type="error"
            dense
            text
            dismissible
            class="mb-4 login-error-alert"
            @click="loginError = ''"
          >
            {{ loginError }}
          </v-alert>

          <v-form
            ref="adminForm"
            v-model="isFormValid"
            class="soft-form__inputs-border"
          >
            <label class="primary-gray-700 gtext-t6 font-weight-medium">
              User Name / Email
            </label>
            <v-text-field
              v-model="form.email"
              placeholder="Enter User Name or Email"
              variant="solo"
              density="comfortable"
              :rules="emailRules"
              class="mb-9 mt-1"
            />

            <label class="primary-gray-700 gtext-t6 font-weight-medium">
              Password
            </label>
            <v-text-field
              v-model="form.password"
              :append-inner-icon="passwordShow ? 'mdi-eye' : 'mdi-eye-off'"
              placeholder="Enter Password"
              variant="solo"
              density="comfortable"
              :rules="passwordRules"
              :type="passwordShow ? 'text' : 'password'"
              class="mb-4 mt-1"
              @click:append-inner="passwordShow = !passwordShow"
            />

            <div class="d-flex align-center justify-space-between mb-4">
              <v-checkbox
                v-model="rememberMe"
                label="Remember me"
                hide-details
                class="gtext-t5"
                color="primary"
              />
              <v-btn
                variant="plain"
                color="#FFB600"
                class="gtext-t5 pa-0 font-weight-semibold"
              >
                Forgot Password?
              </v-btn>
            </div>

            <v-btn
              rounded
              block
              height="42"
              color="#FFB600"
              class="primary-gray-800 gtext-t4 font-weight-semibold mb-9"
              :loading="Btnloading"
              :disabled="!isFormValid"
              @click="submit"
            >
              Login
            </v-btn>
          </v-form>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.wh-100{
  width: 100px;
  height: 100px;
}

:deep(.v-field__input){
  padding: 16px 20px;
  font-family: Inter, sans-serif;
  font-size: 1.4rem;
  line-height: 1.8rem;
  font-weight: 400;
}
:deep(.v-field){
  border-radius: 30px;
  border: 1px solid #E4E7EC;
  box-shadow: none;
}

:deep(.v-label--clickable){
  font-family: Inter, sans-serif !important;
  font-size: 1.4rem !important;
  line-height: 2.4rem !important;
  font-weight: 400;
  color: #1D2939;
}

:deep(.v-btn--variant-plain){
  opacity: 0.7 !important;
  &:hover{
    opacity: 1 !important;
  }
}

:deep(.v-btn--disabled){
  opacity: 0.7 !important;
}

.login-error-alert {
  border-radius: 8px;
  padding: 10px !important;
  word-break: break-word;
  font-size: 14px;
}

@media (max-width: 600px) {
  .login-error-alert {
    padding: 8px !important;
    font-size: 13px;
  }
}
</style>
