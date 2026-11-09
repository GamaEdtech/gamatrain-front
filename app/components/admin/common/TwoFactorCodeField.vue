<template>
  <div class="w-100 d-flex flex-column align-start">
    <span class="text-body-1 text-grey600 mt-4 mb-1">Authenticator code</span>
    <v-otp-input
      v-model="code"
      length="6"
      type="number"
      variant="outlined"
      class="px-0"
      :disabled="disabled"
      @finish="emit('finish')"
    />
    <span class="text-caption font-weight-medium text-grey400">
      The 6-digit code from your authenticator app.
      <nuxt-link
        to="/admin/two-factor"
        class="text-primary"
      >Not set up yet?</nuxt-link>
    </span>
  </div>
</template>

<script setup lang="ts">
// Step-up code for sensitive admin actions (user delete, enable/disable, roles and permissions, payouts, refunds).
defineProps<{ disabled?: boolean }>()
const emit = defineEmits(['finish'])
const code = defineModel<string>({ default: '' })
</script>
