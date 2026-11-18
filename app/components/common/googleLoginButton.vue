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
      <span class="font-weight-bold text-body-1 text-grey700">Loading Google sign-in</span>
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
const { loginByGoogle, loadingLoginByGoogle, completeSignIn } = useAuth()

const googleLoginBtn = ref<HTMLElement | null>(null)
const handleCredentialResponse = async (response: GoogleLoginTokenDTO) => {
  if (!response.credential) {
    $toast.error('Google sign-in did not return a valid credential. Please try again.')
    return
  }

  const answer = await loginByGoogle(response.credential)
  if (!answer.succeeded || !answer.data?.token) {
    $toast.error(answer.message || 'We could not sign you in with Google. Please try again.')
    return
  }

  if (await completeSignIn(answer.data.token)) {
    emit('loginSuccessfull')
    return
  }

  $toast.error('Google sign-in succeeded, but we could not load your profile. Refresh the page to continue.')
}

onMounted(() => {
  initGoogleLogin({
    buttonEl: googleLoginBtn.value,
    // The new backend's Google client (Authentication:Google:ClientId): its sign-in only accepts tokens issued for it.
    clientId: '563411954301-m7nh8q1bcb7i617p1b2mp93qkjfvnfe3.apps.googleusercontent.com',
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

/* Google's button is a light-scheme iframe. Under a dark color-scheme page the browser paints an
   opaque white backdrop behind it; matching the scheme keeps the iframe transparent. */
.google-login-button {
  color-scheme: light;
}
</style>
