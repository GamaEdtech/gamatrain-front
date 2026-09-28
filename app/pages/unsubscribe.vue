<template>
  <v-container class="w-100 d-flex justify-center py-16">
    <div class="w-100 d-flex flex-column align-center justify-start ga-6 rounded-lg pa-6 pa-sm-10">
      <v-progress-circular
        v-if="status === 'loading'"
        indeterminate
        color="primary"
        size="48"
        width="5"
        class="mb-6"
      />

      <v-icon
        v-else
        :color="statusContent[status].iconColor"
        size="56"
      >
        {{ statusContent[status].icon }}
      </v-icon>

      <h1 class="text-h4 text-grey800 font-weight-bold text-center">
        {{ statusContent[status].title }}
      </h1>

      <p class="text-h6 text-grey700 font-weight-regular text-center mb-2">
        {{ errorMessage || statusContent[status].description }}
      </p>

      <div class="d-flex flex-column flex-sm-row ga-3 justify-center">
        <v-btn
          rounded="pill"
          color="primary"
          class="text-grey900 text-h5 font-weight-bold"
          height="36"
          min-width="160"
          flat
          to="/"
        >
          Go to home
        </v-btn>

        <v-btn
          v-if="status === 'error'"
          rounded="pill"
          variant="outlined"
          color="primary"
          height="36"
          min-width="160"
          class="text-h5 font-weight-bold"
          :loading="loadingUnsubscribe"
          :disabled="!hasRequiredParams()"
          @click="submitUnsubscribe"
        >
          Try again
        </v-btn>
      </div>
    </div>
  </v-container>
</template>

<script setup lang="ts">
type UnsubscribeStatus = 'loading' | 'success' | 'error' | 'missingParams'

definePageMeta({
  auth: false,
})

useSeoMeta({
  title: 'Unsubscribe from Email Notifications',
  description: 'Manage your GamaTrain email notification preferences.',
  ogTitle: 'Unsubscribe from Email Notifications',
  ogDescription: 'Manage your GamaTrain email notification preferences.',
})

const route = useRoute()
const { unsubscribe, loadingUnsubscribe } = useNudge()

const status = ref<UnsubscribeStatus>('loading')
const errorMessage = ref('')

const statusContent = {
  loading: {
    title: 'Unsubscribing you',
    description: 'Please wait while we update your notification preferences.',
    icon: '',
    iconColor: 'primary',
  },
  success: {
    title: 'You\'ve unsubscribed from these emails',
    description: 'You will no longer receive these nudge email notifications from GamaTrain.',
    icon: 'md:check_circle',
    iconColor: 'success',
  },
  error: {
    title: 'Invalid unsubscribe email link',
    description: 'This unsubscribe link is invalid or has expired.',
    icon: 'md:error',
    iconColor: 'error',
  },
  missingParams: {
    title: 'Invalid unsubscribe email link',
    description: 'This link is missing required information. Please use the unsubscribe link from your email.',
    icon: 'md:link_off',
    iconColor: 'error',
  },
}

const getSingleQueryValue = (value: unknown) => {
  if (Array.isArray(value)) {
    return typeof value[0] === 'string' ? value[0] : ''
  }

  return typeof value === 'string' ? value : ''
}

const getQueryParams = () => ({
  userId: getSingleQueryValue(route.query.userId).trim(),
  token: getSingleQueryValue(route.query.token).trim(),
})

const hasRequiredParams = () => {
  const params = getQueryParams()
  return Boolean(params.userId && params.token)
}

const submitUnsubscribe = async () => {
  const params = getQueryParams()

  if (!params.userId || !params.token) {
    status.value = 'missingParams'
    return
  }

  status.value = 'loading'
  errorMessage.value = ''

  const result = await unsubscribe(params)

  if (result.succeeded && result.data) {
    status.value = 'success'
    return
  }

  status.value = 'error'
}

onMounted(() => {
  submitUnsubscribe()
})
</script>
