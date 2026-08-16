<template>
  <div class="google-login-container w-100 d-flex align-center justify-center">
    <div
      v-show="googleLoginLoading || loadingLoginByGoogle"
      class="login-google px-3"
    >
      <v-progress-circular
        color="primary"
        class="mr-2"
        size="20"
        width="2"
        indeterminate
      />
      <span class="font-weight-bold text-h5 text-grey700">Loading google sign in</span>
    </div>

    <div
      v-show="!googleLoginLoading && !loadingLoginByGoogle"
      ref="googleLoginBtn"
      class="google-login-button w-100"
    />
  </div>
</template>

<script setup lang="ts">
import type { GoogleLoginTokenDTO } from '@/types'

const emit = defineEmits(['loginSuccessfull'])

const { $toast } = useNuxtApp()
const {
  loading: googleLoginLoading,
  initGoogleLogin,
} = useGoogleLogin()
const { loginByGoogle, loadingLoginByGoogle, setUserToken } = useAuth()
const { getProfile, setUser } = useUser()

const googleLoginBtn = ref<HTMLElement | null>(null)
const handleCredentialResponse = async (response: GoogleLoginTokenDTO) => {
  if (response.credential) {
    const resposeLogin = await loginByGoogle(response.credential)
    if (resposeLogin.succeeded && resposeLogin.data && resposeLogin.data.token) {
      setUserToken(resposeLogin.data.token)
      const profileData = await getProfile(resposeLogin.data.token)
      if (profileData.data) {
        const profile = profileData.data.data!
        setUser(profile)
        emit('loginSuccessfull')
      }
      else {
        $toast.error('Google sign-in succeeded, but we could not load your profile. Please try again.')
      }
    }
    else {
      $toast.error('We could not sign you in with Google. Please try again.')
    }
  }
  else {
    $toast.error('Google sign-in did not return a valid credential. Please try again.')
  }
}

onMounted(() => {
  initGoogleLogin({
    buttonEl: googleLoginBtn.value,
    clientId: '231452968451-rd7maq3v4c8ce6d1e36uk3qacep20lp8.apps.googleusercontent.com',
    callback: handleCredentialResponse,
  })
})
</script>

<style scoped>
.login-google{
  width: 100%;
  min-height: 44px;
  border : 1px solid rgb(var(--v-theme-grey200));
  border-radius: 9999px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.google-login-container,
.google-login-button {
  min-height: 44px;
}
</style>
