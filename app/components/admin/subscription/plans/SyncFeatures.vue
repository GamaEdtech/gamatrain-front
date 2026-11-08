<template>
  <div class="w-100 d-flex flex-column pa-2">
    <template v-if="!result">
      <div class="w-100 d-flex flex-column ga-1 bg-grey100 rounded-lg pa-3">
        <span class="text-body-1 text-grey700 font-weight-bold">
          Plan: {{ plan.title }}
        </span>
        <span class="text-caption font-weight-medium text-grey600">
          Every active subscriber on this plan who is missing one of its saved features gets it now:
        </span>
        <ul class="text-caption font-weight-medium text-grey600 pl-5">
          <li>A feature added to a shared quota joins the subscriber's existing quota and uses its remaining balance.</li>
          <li>A new standalone feature gets its own quota at this plan's limit for the subscriber's billing interval.</li>
        </ul>
        <span class="text-caption font-weight-medium text-grey600">
          Existing limits and usage are never changed and nothing is removed. Running it again changes nothing.
        </span>
      </div>

      <span class="text-body-1 text-grey600 mt-4 mb-1">Authenticator code</span>
      <v-otp-input
        v-model="code"
        length="6"
        type="number"
        variant="outlined"
        class="px-0"
        :disabled="loadingSyncFeatures"
        @finish="submit"
      />
      <span class="text-caption font-weight-medium text-grey400">
        The 6-digit code from your authenticator app.
        <nuxt-link
          to="/admin/two-factor"
          class="text-primary"
        >Not set up yet?</nuxt-link>
      </span>

      <v-btn
        color="primary"
        :disabled="!isValid"
        :loading="loadingSyncFeatures"
        rounded="xl"
        height="40"
        flat
        class="text-body-1 mt-6"
        @click="submit"
      >
        Apply to current subscribers
      </v-btn>
    </template>

    <template v-else>
      <v-alert
        :type="result.subscriptionCount > 0 ? 'success' : 'info'"
        variant="tonal"
        rounded="lg"
        class="text-body-1"
      >
        <template v-if="result.subscriptionCount > 0">
          Updated {{ result.subscriptionCount }} {{ result.subscriptionCount === 1 ? 'subscription' : 'subscriptions' }}:
          {{ result.featureCount }} {{ result.featureCount === 1 ? 'feature' : 'features' }} added,
          {{ result.quotaCount }} new {{ result.quotaCount === 1 ? 'quota' : 'quotas' }}.
        </template>
        <template v-else>
          All active subscribers on this plan already have its features. Nothing changed.
        </template>
      </v-alert>

      <v-btn
        color="primary"
        variant="outlined"
        rounded="xl"
        height="40"
        flat
        class="text-body-1 mt-6"
        @click="emit('close')"
      >
        Close
      </v-btn>
    </template>
  </div>
</template>

<script setup lang="ts">
import type { AdminSubscriptionPlanDTO, SyncAdminSubscriptionPlanFeaturesDTO } from '@/types'

const props = defineProps<{
  plan: AdminSubscriptionPlanDTO
}>()

const emit = defineEmits<{
  close: []
}>()

const { syncFeatures, loadingSyncFeatures } = useSubscriptionPlanAdmin()

const code = ref('')
const result = ref<SyncAdminSubscriptionPlanFeaturesDTO | null>(null)

const isValid = computed(() => /^\d{6}$/.test(code.value))

const submit = async () => {
  if (!isValid.value || loadingSyncFeatures.value) return

  const response = await syncFeatures(props.plan.id, code.value)
  if (response.succeeded && response.data) {
    result.value = response.data
    return
  }

  // A used or wrong code can't be retried.
  code.value = ''
}
</script>
