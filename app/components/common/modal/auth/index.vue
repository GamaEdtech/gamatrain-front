<template>
  <div v-if="dialogModel">
    <lazy-common-modal-base
      v-model:show-dialog="showLoginModal"
      title="Sign in"
    >
      <common-modal-auth-login
        :email="emailForAuth"
        @login-successfull="handleLoginSuccessfull"
        @open-register="openRegisterModal"
        @open-forget-password="openForgetPasswordModal"
        @code-sent="(email: string, notice: string) => openCodeModal('login', email, notice)"
      />
    </lazy-common-modal-base>

    <lazy-common-modal-base
      v-model:show-dialog="showRegisterModal"
      title="Create your account"
    >
      <common-modal-auth-register
        :email="emailForAuth"
        @open-login="openLoginModal"
        @login-successfull="handleLoginSuccessfull"
        @code-sent="openCodeModal('register', $event)"
      />
    </lazy-common-modal-base>

    <lazy-common-modal-base
      v-model:show-dialog="showForgetPasswordModal"
      title="Reset your password"
    >
      <common-modal-auth-forget-password
        :email="emailForAuth"
        @open-login="openLoginModal"
        @code-sent="openCodeModal('forgetPassword', $event)"
      />
    </lazy-common-modal-base>

    <lazy-common-modal-base
      v-model:show-dialog="showOTPModal"
      title="Check your email"
    >
      <common-modal-auth-otp
        :email="emailForAuth"
        :mode="codeMode"
        :notice="codeNotice"
        @change-email="changeEmail"
        @code-confirmed="openPasswordModal"
        @login-successfull="handleLoginSuccessfull"
      />
    </lazy-common-modal-base>

    <lazy-common-modal-base
      v-model:show-dialog="showConfirmPasswordModal"
      :title="codeMode === 'register' ? 'Create a password' : 'Set a new password'"
    >
      <common-modal-auth-confirm-password
        :email="emailForAuth"
        :code="codeForAuth"
        :mode="codeMode"
        @login-successfull="handleLoginSuccessfull"
        @restart="codeMode === 'register' ? openRegisterModal(emailForAuth) : openForgetPasswordModal(emailForAuth)"
      />
    </lazy-common-modal-base>
  </div>
</template>

<script setup lang="ts">
import type { AuthCodeMode } from '@/types'

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
// Carried from step to step, so nobody types their email twice.
const emailForAuth = ref('')
const codeForAuth = ref('')
const codeMode = ref<AuthCodeMode>('register')
// Why the code screen opened, when it wasn't asked for (a wrong password).
const codeNotice = ref('')
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
  emailForAuth.value = ''
  codeForAuth.value = ''
  codeMode.value = 'register'
}

const closeAllModals = () => {
  showLoginModal.value = false
  showRegisterModal.value = false
  showForgetPasswordModal.value = false
  showOTPModal.value = false
  showConfirmPasswordModal.value = false
}

const keepEmail = (email?: string) => {
  if (typeof email === 'string') emailForAuth.value = email
}

const openCodeModal = (mode: AuthCodeMode, email: string, notice = '') => {
  codeMode.value = mode
  codeNotice.value = notice
  emailForAuth.value = email
  codeForAuth.value = ''
  closeAllModals()
  showOTPModal.value = true
}

const openPasswordModal = (code: string) => {
  codeForAuth.value = code
  closeAllModals()
  showConfirmPasswordModal.value = true
}

// "Change" on the code screen goes back to the step the email came from.
const changeEmail = (email: string) => {
  if (codeMode.value === 'register') openRegisterModal(email)
  else if (codeMode.value === 'forgetPassword') openForgetPasswordModal(email)
  else openLoginModal(email)
}

const closeAuthFlow = () => {
  dialogModel.value = false
  closeAllModals()
  resetAuthData()
}

const openLoginModal = (email?: string) => {
  keepEmail(email)
  closeAllModals()
  showLoginModal.value = true
}

const openRegisterModal = (email?: string) => {
  keepEmail(email)
  closeAllModals()
  showRegisterModal.value = true
}

const openForgetPasswordModal = (email?: string) => {
  keepEmail(email)
  closeAllModals()
  showForgetPasswordModal.value = true
}

const handleLoginSuccessfull = () => {
  closeAuthFlow()
  $toast.success('You are signed in.')
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
