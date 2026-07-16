<template>
  <div v-if="dialogModel">
    <lazy-common-modal-base
      v-model:show-dialog="showLoginModal"
      title="Sign in"
    >
      <common-modal-auth-login
        @login-successfull="handleLoginSuccessfull"
        @open-register="openRegisterModal"
        @open-register-otp="openOTPModalForRegister"
        @open-forget-password="openForgetPasswordModal"
        @open-otp-code="openOTPModalForLogin"
        @close="closeAuthFlow"
      />
    </lazy-common-modal-base>

    <lazy-common-modal-base
      v-model:show-dialog="showRegisterModal"
      title="Register"
    >
      <common-modal-auth-register
        @open-login="openLoginModal"
        @open-otp-code="openOTPModalForRegister"
        @close="closeAuthFlow"
      />
    </lazy-common-modal-base>

    <lazy-common-modal-base
      v-model:show-dialog="showForgetPasswordModal"
      title="Forget"
    >
      <common-modal-auth-forget-password
        @open-login="openLoginModal"
        @open-register="openRegisterModal"
        @open-otp-code="openOTPModalForForgetPassword"
        @close="closeAuthFlow"
      />
    </lazy-common-modal-base>

    <lazy-common-modal-base
      v-model:show-dialog="showOTPModal"
      title="Code"
    >
      <common-modal-auth-otp
        :password="passwordForAuth"
        :identity="identityForAuth"
        :mode="modeOTP"
        @login-successfull="handleLoginSuccessfull"
        @open-login="openLoginModal"
        @open-register="openRegisterModal"
        @open-forget-password="openForgetPasswordModal"
        @register-code-confirmed="openConfirmPasswordModal('register')"
        @forget-password-code-confirmed="openConfirmPasswordModal('forgetPassword')"
      />
    </lazy-common-modal-base>

    <lazy-common-modal-base
      v-model:show-dialog="showConfirmPasswordModal"
      title="Password"
    >
      <common-modal-auth-confirm-password
        :identity="identityForAuth"
        :mode="confirmPasswordMode"
        @open-login="openLoginModal"
        @close="closeAuthFlow"
      />
    </lazy-common-modal-base>
  </div>
</template>

<script setup lang="ts">
import type { ConfirmPasswordMode, OTPMode } from '@/types'

interface IAuthFlow {
  showDialog?: boolean
}

const props = withDefaults(defineProps<IAuthFlow>(), {
  showDialog: false,
})
const emit = defineEmits(['update:showDialog', 'loginSuccessfull'])

const { $toast } = useNuxtApp()

const showLoginModal = ref(false)
const showRegisterModal = ref(false)
const showForgetPasswordModal = ref(false)
const showOTPModal = ref(false)
const showConfirmPasswordModal = ref(false)
const passwordForAuth = ref('')
const identityForAuth = ref('')
const modeOTP = ref<OTPMode>('login')
const confirmPasswordMode = ref<ConfirmPasswordMode>('register')
const hasOpenModal = computed(() =>
  showLoginModal.value
  || showRegisterModal.value
  || showForgetPasswordModal.value
  || showOTPModal.value
  || showConfirmPasswordModal.value,
)

const dialogModel = computed({
  get: () => props.showDialog,
  set: value => emit('update:showDialog', value),
})

const resetAuthData = () => {
  identityForAuth.value = ''
  passwordForAuth.value = ''
  modeOTP.value = 'login'
  confirmPasswordMode.value = 'register'
}

const closeAllModals = () => {
  showLoginModal.value = false
  showRegisterModal.value = false
  showForgetPasswordModal.value = false
  showOTPModal.value = false
  showConfirmPasswordModal.value = false
}

const openOTPModalForLogin = (identity: string, password: string) => {
  identityForAuth.value = identity
  passwordForAuth.value = password
  modeOTP.value = 'login'
  closeAllModals()
  showOTPModal.value = true
}

const openOTPModalForRegister = (identity: string) => {
  identityForAuth.value = identity
  passwordForAuth.value = ''
  modeOTP.value = 'register'
  closeAllModals()
  showOTPModal.value = true
}

const openOTPModalForForgetPassword = (identity: string) => {
  identityForAuth.value = identity
  passwordForAuth.value = ''
  modeOTP.value = 'forgetPassword'
  closeAllModals()
  showOTPModal.value = true
}

const openConfirmPasswordModal = (mode: ConfirmPasswordMode) => {
  confirmPasswordMode.value = mode
  closeAllModals()
  showConfirmPasswordModal.value = true
}

const closeAuthFlow = () => {
  dialogModel.value = false
  closeAllModals()
  resetAuthData()
}

const openLoginModal = () => {
  closeAllModals()
  showLoginModal.value = true
}

const openRegisterModal = () => {
  closeAllModals()
  showRegisterModal.value = true
}

const openForgetPasswordModal = () => {
  closeAllModals()
  showForgetPasswordModal.value = true
}

const handleLoginSuccessfull = () => {
  closeAuthFlow()
  $toast.success('You have signed in successfully.')
  emit('loginSuccessfull')
}

watch(
  () => props.showDialog,
  (showDialog) => {
    if (showDialog) {
      openLoginModal()
    }
    else {
      closeAllModals()
    }
  },
  { immediate: true },
)

watch(
  hasOpenModal,
  (isOpen) => {
    if (dialogModel.value && !isOpen) {
      closeAuthFlow()
    }
  },
)
</script>
