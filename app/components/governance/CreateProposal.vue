<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<template>
  <div>
    <v-dialog
      v-model="visible"
      max-width="500"
      :fullscreen="!smAndUp"
      @after-leave="handleAfterLeave"
    >
      <template #default="{ isActive }">
        <v-form
          ref="formRef"
          v-model="formIsValid"
          class="min-h-full"
          @submit.prevent="onSubmit"
        >
          <v-card>
            <div class="px-4 py-4 d-none d-sm-block">
              <div
                class="d-flex justify-end cursor-pointer"
                style="justify-self: end"
                @click="isActive.value = false"
              >
                <v-icon color="#bb6b62">
                  mdi-close
                </v-icon>
              </div>
            </div>
            <div
              class="d-flex align-center create-proposal__head py-5 px-4 d-sm-none"
            >
              <div @click="isActive.value = false">
                <v-icon
                  size="large"
                  color="#344054"
                >
                  mdi-chevron-right
                </v-icon>
              </div>
              <div class="pl-2 text-h5 primary-gray-700 font-weight-regular">
                Creat Proposal
              </div>
            </div>
            <div>
              <div
                class="text-h5 primary-gray-500 font-weight-bold pb-4 pl-6 d-none d-sm-block"
              >
                Creat Proposal
              </div>
            </div>
            <v-card-text>
              <h6 class="text-h4 font-weight-bold">
                You are creating a proposal
              </h6>

              <div class="text-h6 text-md-button mt-4 mt-sm-4">
                <span>
                  <v-icon
                    size="x-large"
                    :color="isWalletReady ? '#4CAF50' : '#98A2B3'"
                  >mdi-wallet</v-icon></span>
                <span
                  class="pl-2 primary-gray-400"
                  style="display: inline-block"
                >Wallet
                </span>
                <span
                  v-if="isWalletReady"
                  class="pl-1 primary-blue-500"
                  style="display: inline-block"
                >
                  {{
                    workspace?.publicKey?.value?.toBase58?.()?.slice(0, 4)
                  }}...{{
                    workspace?.publicKey?.value?.toBase58?.()?.slice(-4)
                  }}
                </span>
                <span
                  v-else
                  class="pl-1 text-error"
                > Not Connected </span>
              </div>

              <!-- Staking Status (v2.0) -->
              <v-alert
                v-if="isWalletReady && !hasStakedTokens"
                type="warning"
                variant="tonal"
                class="mt-4"
              >
                <div class="text-body-2">
                  <v-icon
                    icon="mdi-alert"
                    size="small"
                    class="mr-2"
                  />
                  You must stake $GET tokens to create proposals. Please stake
                  tokens first.
                </div>
              </v-alert>

              <v-alert
                v-else-if="isWalletReady && hasStakedTokens"
                type="success"
                variant="tonal"
                class="mt-4"
              >
                <div class="text-body-2">
                  <v-icon
                    icon="mdi-check-circle"
                    size="small"
                    class="mr-2"
                  />
                  Staked:
                  {{ $numberFormat(userStakeInfo?.stakedAmount || 0) }} $GET
                </div>
              </v-alert>

              <div class="mt-10">
                <div class="mb-4">
                  <div class="mb-1 primary-gray-700 text-h6">
                    Title *
                  </div>
                  <v-text-field
                    v-model="form.title"
                    :rules="[rules.required, rules.maxLength(100)]"
                    density="compact"
                    variant="outlined"
                    rounded
                    placeholder="Enter proposal title"
                    counter="100"
                  />
                </div>

                <div class="mb-4">
                  <div class="mb-1 primary-gray-700 text-h6">
                    Description *
                  </div>
                  <v-textarea
                    v-model="form.brief"
                    :rules="[rules.required, rules.maxLength(500)]"
                    density="compact"
                    variant="outlined"
                    rounded
                    placeholder="Describe your proposal in detail"
                    counter="500"
                    rows="4"
                  />
                </div>

                <div class="mb-4">
                  <div class="mb-1 primary-gray-700 text-h6">
                    Category *
                  </div>
                  <v-select
                    v-model="form.cate"
                    :items="categoryOptions"
                    :rules="[rules.required]"
                    density="compact"
                    variant="outlined"
                    rounded
                    placeholder="Select category"
                  />
                </div>

                <div class="mb-4">
                  <div class="mb-1 primary-gray-700 text-h6">
                    Reference URL
                  </div>
                  <v-text-field
                    v-model="form.reference"
                    :rules="[rules.url]"
                    density="compact"
                    variant="outlined"
                    rounded
                    placeholder="https://example.com/proposal-details"
                    hint="Optional: Link to detailed proposal documentation"
                  />
                </div>

                <div class="mb-4">
                  <div class="mb-1 primary-gray-700 text-h6">
                    Requested Amount (GET tokens)
                  </div>
                  <v-text-field
                    v-model.number="form.amount"
                    :rules="[rules.positiveNumber]"
                    type="number"
                    density="compact"
                    variant="outlined"
                    rounded
                    placeholder="0"
                    hint="Amount of GET tokens requested for this proposal"
                    step="1"
                    min="0"
                  />
                </div>
              </div>
            </v-card-text>

            <v-card-actions class="mb-5 mx-5">
              <v-btn
                variant="text"
                size="large"
                class="w-30"
                rounded
                @click="isActive.value = false"
              >
                Cancel
              </v-btn>
              <v-btn
                type="submit"
                variant="flat"
                size="large"
                color="#FFB600"
                rounded
                class="flex-1 w-70"
                :loading="isSubmitting"
                :disabled="isWalletReady && !hasStakedTokens"
              >
                {{
                  !isWalletReady
                    ? "Connect Wallet"
                    : !hasStakedTokens
                      ? "Stake Tokens Required"
                      : "Submit"
                }}
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-form>
      </template>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import { useDisplay } from 'vuetify'

const { smAndUp } = useDisplay()
const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
})
const emits = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'created'): void
  // eslint-disable-next-line @typescript-eslint/unified-signatures
  (e: 'walletRequired'): void
}>()
const rules = {
  required: (v: unknown) => !!v || 'This field is required',
  maxLength: (max: number) => (v: string) =>
    !v || v.length <= max || `Maximum ${max} characters allowed`,
  url: (v: string) =>
    !v
    || /^https?:\/\/.+/.test(v)
    || 'Must be a valid URL starting with http:// or https://',
  positiveNumber: (v: number) =>
    v === null || v === undefined || v >= 0 || 'Must be a positive number',
}

const categoryOptions = [
  { title: 'General', value: 'general' },
  { title: 'Development', value: 'development' },
  { title: 'Marketing', value: 'marketing' },
  { title: 'Community', value: 'community' },
  { title: 'Finance', value: 'finance' },
  { title: 'Education', value: 'education' },
  { title: 'Infrastructure', value: 'infrastructure' },
]

const formIsValid = ref(false)

const formRef = ref(null)
const isSubmitting = ref(false)

const form = ref({
  title: '',
  brief: '',
  cate: 'general',
  reference: '',
  amount: 0,
})
const visible = ref(props.modelValue)

// Wallet connection state
const workspace = useWorkspace()
const isWalletReady = computed(() => {
  return (
    workspace?.connected?.value
    && workspace?.publicKey?.value
    && workspace?.program?.value
  )
})

// Check if user has staked tokens (v2.0 requirement)
const userStakeInfo = ref<{ stakedAmount: number } | null>(null)
const hasStakedTokens = computed(() => {
  return userStakeInfo.value && userStakeInfo.value.stakedAmount > 0
})

// Fetch user stake info
const fetchUserStakeInfo = async () => {
  if (!isWalletReady.value) return

  try {
    const { getStakeAccount } = useGovernance()
    const program = workspace?.program?.value
    const userPk = workspace?.publicKey?.value

    if (!program || !userPk) return

    const info = await getStakeAccount(program, userPk)
    userStakeInfo.value = info
  }
  catch (error) {
    console.error('Failed to fetch user stake info:', error)
  }
}

// Watch for wallet changes
watch(
  () => isWalletReady.value,
  (ready) => {
    if (ready) {
      fetchUserStakeInfo()
    }
  },
  { immediate: true },
)

watch(
  () => props.modelValue,
  (val) => {
    visible.value = val
  },
)

async function onSubmit() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { valid } = await (formRef.value as any).validate()

  if (valid) {
    // Check if wallet is connected first
    if (!isWalletReady.value) {
      emits('walletRequired')
      return
    }

    // Check if user has staked tokens (v2.0 requirement)
    if (!hasStakedTokens.value) {
      const { $toast } = useNuxtApp()
      $toast.error('You must stake $GET tokens to create proposals')
      return
    }

    try {
      isSubmitting.value = true
      const workspace = useWorkspace()
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const program = workspace?.program?.value as any
      const userPk = workspace?.publicKey?.value

      if (!program) {
        throw new Error(
          'Blockchain program not ready. Please try refreshing the page.',
        )
      }

      if (!userPk) {
        throw new Error(
          'Wallet address not available. Please reconnect your wallet.',
        )
      }
      await governance.createProposal(program, userPk, {
        title: String(form.value.title || ''),
        brief: String(form.value.brief || ''),
        cate: String(form.value.cate || 'general'),
        reference: String(form.value.reference || ''),
        amount: Number(form.value.amount || 0),
      })

      // Show success message
      const { $toast } = useNuxtApp()
      $toast.success('Proposal created successfully!')

      emits('created')
      emits('update:modelValue', false)

      // Reset form
      form.value = {
        title: '',
        brief: '',
        cate: 'general',
        reference: '',
        amount: 0,
      }
    }
    catch (e) {
      console.error('Failed to create proposal:', e)

      // Show error message
      const { $toast } = useNuxtApp()
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      $toast.error((e as any).message || 'Failed to create proposal')
    }
    finally {
      isSubmitting.value = false
    }
  }
}

const handleAfterLeave = () => {
  emits('update:modelValue', false)
}
</script>

<style scoped>
.create-proposal__head {
  box-shadow: 0px 0px 20px 0px #1018280d;
}
</style>
