<template>
  <v-dialog
    v-model="visible"
    max-width="600"
    @after-leave="handleAfterLeave"
  >
    <v-sheet class="rounded-lg">
      <v-tabs
        v-model="tab"
        fixed-tabs
        bg-color="grey-lighten-4"
      >
        <v-tab value="stake">
          Stake
        </v-tab>
        <v-tab value="unstake">
          Unstake
        </v-tab>
        <v-tab value="claim">
          Claim
        </v-tab>
      </v-tabs>

      <v-divider />

      <v-window v-model="tab">
        <!-- Stake Tab -->
        <v-window-item value="stake">
          <v-card flat>
            <v-card-text class="pa-6">
              <div class="mb-4">
                <h3 class="text-h5 font-weight-bold mb-2">
                  Stake $GET Tokens
                </h3>
                <p class="font-size-12 text-grey-darken-1 font-weight-medium ">
                  Stake your $GET tokens to participate in governance voting and
                  proposal creation.
                </p>
              </div>

              <!-- Stake Info -->
              <v-alert
                v-if="stakeInfo"
                type="info"
                variant="tonal"
                class="mb-4"
              >
                <div class="gama-text-body2">
                  <div class="d-flex justify-space-between mb-2">
                    <span class="font-size-12">Currently Staked:</span>
                    <span class="font-weight-bold font-size-12">{{ $numberFormat(stakeInfo.stakedAmount) }} $GET</span>
                  </div>
                  <div class="d-flex justify-space-between">
                    <span class="font-size-12">Your Vote Power:</span>
                    <span class="font-weight-bold font-size-14">{{
                      $numberFormat(stakeInfo.stakedAmount)
                    }}</span>
                  </div>
                </div>
              </v-alert>

              <v-form
                ref="stakeFormRef"
                v-model="stakeFormValid"
                @submit.prevent="handleStake"
              >
                <v-text-field
                  v-model.number="stakeAmount"
                  label="Amount to Stake"
                  variant="outlined"
                  type="number"
                  :rules="[rules.required, rules.positive, customRules.maxBalance]"
                  :hint="`Available: ${$numberFormat(tokenBalance)} $GET`"
                  persistent-hint
                >
                  <template #prepend-inner>
                    <v-img
                      src="/GET-Token/QmRU6u4TAG1sHW9V8GZyZCn3Qp2ztkYzhhWawzZQEwQaEU.png"
                      width="24"
                      height="24"
                      class="mr-2"
                      cover
                    />
                  </template>
                </v-text-field>

                <v-btn
                  type="submit"
                  color="primary"
                  size="large"
                  block
                  :loading="isStaking"
                  :disabled="!isWalletReady || !stakeFormValid"
                  class="mt-4"
                >
                  Stake Tokens
                </v-btn>
              </v-form>
            </v-card-text>
          </v-card>
        </v-window-item>

        <!-- Unstake Tab -->
        <v-window-item value="unstake">
          <v-card flat>
            <v-card-text class="pa-6">
              <div class="mb-4">
                <h3 class="text-h5 font-weight-bold mb-2">
                  Unstake $GET Tokens
                </h3>
                <p
                  class="font-size-12 text-grey-darken-1 font-weight-medium"
                >
                  Initiate unstaking process. Tokens will be available to claim
                  after a 3-day cooldown period.
                </p>
              </div>

              <!-- Stake Info -->
              <v-alert
                v-if="stakeInfo"
                type="warning"
                variant="tonal"
                class="mb-4"
              >
                <div class="gama-text-body2">
                  <div class="d-flex justify-space-between mb-2">
                    <span class="font-size-12">Currently Staked:</span>
                    <span class="font-weight-bold font-size-12">{{ $numberFormat(stakeInfo.stakedAmount) }} $GET</span>
                  </div>
                  <div
                    v-if="stakeInfo.pendingUnstake > 0"
                    class="d-flex justify-space-between"
                  >
                    <span class="font-size-12">Pending Unstake:</span>
                    <span class="font-weight-bold font-size-12">{{ $numberFormat(stakeInfo.pendingUnstake) }} $GET</span>
                  </div>
                </div>
              </v-alert>
              <v-form
                ref="unstakeFormRef"
                v-model="unstakeFormValid"
                @submit.prevent="handleUnstake"
              >
                <v-text-field
                  v-model.number="unstakeAmount"
                  label="Amount to Unstake"
                  variant="outlined"
                  type="number"
                  :rules="[rules.required, rules.positive, customRules.maxStaked]"
                  :hint="`Staked: ${$numberFormat(
                    stakeInfo?.stakedAmount || 0,
                  )} $GET`"
                  persistent-hint
                >
                  <template #prepend-inner>
                    <v-img
                      src="/GET-Token/QmRU6u4TAG1sHW9V8GZyZCn3Qp2ztkYzhhWawzZQEwQaEU.png"
                      width="24"
                      height="24"
                      class="mr-2"
                      cover
                    />
                  </template>
                </v-text-field>

                <v-btn
                  type="submit"
                  color="warning"
                  size="large"
                  block
                  :loading="isUnstaking"
                  :disabled="
                    !isWalletReady
                      || !unstakeFormValid
                      || !stakeInfo
                      || stakeInfo.stakedAmount === 0
                  "
                  class="mt-4"
                >
                  Initiate Unstake
                </v-btn>
              </v-form>
            </v-card-text>
          </v-card>
        </v-window-item>

        <!-- Claim Tab -->
        <v-window-item value="claim">
          <v-card flat>
            <v-card-text class="pa-6">
              <div class="mb-4">
                <h3 class="text-h5 font-weight-bold mb-2">
                  Claim Unstaked Tokens
                </h3>
                <p class="font-size-12 text-grey-darken-2">
                  Claim your unstaked tokens after the cooldown period has
                  completed.
                </p>
              </div>

              <!-- Cooldown Status -->
              <v-alert
                v-if="stakeInfo && stakeInfo.pendingUnstake > 0"
                :type="cooldownComplete ? 'success' : 'warning'"
                variant="tonal"
                class="mb-4"
              >
                <div class="gama-text-body2">
                  <div class="d-flex justify-space-between mb-2">
                    <span class="font-size-12">Pending Unstake:</span>
                    <span class="font-weight-bold font-size-12">{{ $numberFormat(stakeInfo.pendingUnstake) }} $GET</span>
                  </div>
                  <div class="d-flex justify-space-between">
                    <span class="font-size-12">Cooldown Status:</span>
                    <span
                      class="font-weight-bold font-size-12"
                      :class="
                        cooldownComplete ? 'text-success' : 'text-warning'
                      "
                    >
                      {{ cooldownStatus }}
                    </span>
                  </div>
                </div>
              </v-alert>

              <v-alert
                v-else
                type="info"
                variant="tonal"
                class="mb-4"
              >
                <div class="gama-text-body2">
                  <span class="font-size-14">No pending unstake found. Unstake tokens first to claim
                    them later.</span>
                </div>
              </v-alert>

              <v-btn
                color="success"
                size="large"
                block
                :loading="isClaiming"
                :disabled="
                  !isWalletReady
                    || !cooldownComplete
                    || !stakeInfo
                    || stakeInfo.pendingUnstake === 0
                "
                @click="handleClaim"
              >
                Claim Tokens
              </v-btn>
            </v-card-text>
          </v-card>
        </v-window-item>
      </v-window>
    </v-sheet>
  </v-dialog>
</template>

<script setup lang="ts">
import { useErrorHandler } from '~/composables/useErrorHandler'
import { useValidationRules } from '~/composables/useValidationRules'
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '~/constants/governance'
import type { StakeAccount } from '~/types/governance'

// Toast notification
const { $toast } = useNuxtApp()

// Error handler
const { handleError, handleSuccess } = useErrorHandler()

// Props & Emits
const props = defineProps<{ modelValue: boolean }>()
const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'staked' | 'unstaked' | 'claimed'): void
}>()

// Two-way binding for v-model
const visible = computed({
  get: () => props.modelValue,
  set: (val: boolean) => emit('update:modelValue', val),
})

// Local state
const tab = ref('stake')
const stakeAmount = ref<number>(0)
const unstakeAmount = ref<number>(0)
const stakeFormValid = ref(false)
const unstakeFormValid = ref(false)
const stakeFormRef = ref()
const unstakeFormRef = ref()
const isStaking = ref(false)
const isUnstaking = ref(false)
const isClaiming = ref(false)
const stakeInfo = ref<StakeAccount | null>(null)
const tokenBalance = ref(0)

// Governance composable (includes workspace internally)
const { workspace, getStakeAccount, isCooldownComplete, getRemainingCooldown }
  = useGovernance()

// Wallet state
const isWalletReady = computed(
  () =>
    workspace?.connected?.value
    && workspace?.publicKey?.value
    && workspace?.program?.value,
)

// Computed
const cooldownComplete = computed(() => {
  if (!stakeInfo.value || stakeInfo.value.pendingUnstake === 0) return false
  return isCooldownComplete(stakeInfo.value.unstakeRequestedAt)
})

const cooldownStatus = computed(() => {
  if (!stakeInfo.value || stakeInfo.value.pendingUnstake === 0)
    return 'No cooldown'
  return getRemainingCooldown(stakeInfo.value.unstakeRequestedAt)
})

// Validation rules
const rules = useValidationRules()
const customRules = {
  maxBalance: rules.maxBalance(tokenBalance),
  maxStaked: (v: number) => {
    const maxValue = stakeInfo.value?.stakedAmount || 0
    return v <= maxValue || `Cannot unstake more than staked amount`
  },
}

// Methods
const fetchStakeInfo = async () => {
  if (!isWalletReady.value) return

  try {
    const info = await getStakeAccount()
    stakeInfo.value = info
  }
  catch (error) {
    handleError(error, 'Failed to fetch stake info', false)
  }
}

const fetchTokenBalance = async () => {
  if (!isWalletReady.value) return

  try {
    const { fetchTokenBalance } = await import('~/composables/useSolanaClient')
    const { getTokenMint } = await import('~/composables/useGovernance')
    const tokenMint = getTokenMint()
    const userPk = workspace.publicKey?.value

    if (!userPk) return

    const balance = await fetchTokenBalance({
      owner: userPk.toBase58(),
      mint: tokenMint,
      commitment: 'confirmed',
    })

    tokenBalance.value = balance.uiAmount || 0
  }
  catch (error) {
    handleError(error, 'Failed to fetch token balance', false)
  }
}

const handleStake = async () => {
  if (!stakeFormRef.value) return

  const { valid } = await (stakeFormRef.value as unknown).validate()
  if (!valid) return

  if (!isWalletReady.value) {
    $toast.error(ERROR_MESSAGES.WALLET_NOT_CONNECTED)
    return
  }

  try {
    isStaking.value = true
    const program = workspace.program?.value
    const userPk = workspace.publicKey?.value
    if (!program || !userPk) throw new Error('Wallet not connected')

    // Get token accounts
    const { PublicKey } = await import('@solana/web3.js')
    const { getAssociatedTokenAddress } = await import('@solana/spl-token')
    const { getTokenMint, getVaultAddress, getTokenProgramId } = await import(
      '~/composables/useGovernance'
    )

    const tokenMint = new PublicKey(getTokenMint())
    const vaultAddressStr = await getVaultAddress() // Async PDA calculation
    const vaultAddress = new PublicKey(vaultAddressStr)
    const TOKEN_2022_PROGRAM_ID = new PublicKey(getTokenProgramId())

    const userTokenAccount = await getAssociatedTokenAddress(
      tokenMint,
      userPk,
      false,
      TOKEN_2022_PROGRAM_ID,
    )

    const vaultTokenAccount = await getAssociatedTokenAddress(
      tokenMint,
      vaultAddress,
      true,
      TOKEN_2022_PROGRAM_ID,
    )

    // Check if vault token account exists
    const connection = workspace.connection?.value
    if (connection) {
      const vaultAccountInfo = await connection.getAccountInfo(
        vaultTokenAccount,
      )

      if (!vaultAccountInfo) {
        console.error('❌ Vault token account does not exist!')
        console.log('Vault Token Account:', vaultTokenAccount.toBase58())
        console.log('Vault Authority:', vaultAddress.toBase58())
        console.log('\n📋 To initialize the vault, the team needs to run:')
        console.log(
          '   node scripts/initialize-vault.mjs /path/to/keypair.json',
        )
        console.log('\nSee VAULT_INITIALIZATION_REQUIRED.md for details.\n')

        throw new Error(
          'Staking is not yet available on devnet. The vault needs to be initialized by the team first. Please contact support.',
        )
      }
      else {
        console.log('✅ Vault token account exists')
      }
    }

    await governance.stake(
      program,
      userPk,
      stakeAmount.value,
      userTokenAccount,
      vaultTokenAccount,
      tokenMint,
    )

    handleSuccess(SUCCESS_MESSAGES.TOKENS_STAKED)
    emit('staked')

    // Refresh data
    await fetchStakeInfo()
    await fetchTokenBalance()

    // Refresh governance stats
    if (import.meta.client) {
      const win = window as Window & {
        __refreshGovernanceStats?: () => Promise<void>
      }
      if (win.__refreshGovernanceStats) {
        await win.__refreshGovernanceStats()
      }
    }

    stakeAmount.value = 0
  }
  catch (e: unknown) {
    handleError(e, 'Failed to stake tokens')
  }
  finally {
    isStaking.value = false
  }
}

const handleUnstake = async () => {
  if (!unstakeFormRef.value) return

  const { valid } = await (unstakeFormRef.value as unknown).validate()
  if (!valid) return

  if (!isWalletReady.value) {
    $toast.error(ERROR_MESSAGES.WALLET_NOT_CONNECTED)
    return
  }

  try {
    isUnstaking.value = true
    const program = workspace.program?.value
    const userPk = workspace.publicKey?.value
    if (!program || !userPk) throw new Error('Wallet not connected')

    await governance.unstake(program, userPk, unstakeAmount.value)

    handleSuccess(SUCCESS_MESSAGES.UNSTAKE_INITIATED)
    emit('unstaked')

    // Refresh data
    await fetchStakeInfo()

    // Refresh governance stats with a small delay to ensure blockchain state is updated
    setTimeout(async () => {
      if (import.meta.client) {
        // Try window method
        const win = window as Window & {
          __refreshGovernanceStats?: () => Promise<void>
        }
        if (win.__refreshGovernanceStats) {
          await win.__refreshGovernanceStats()
        }
        // Also emit event
        const nuxtApp = useNuxtApp()
        await nuxtApp.callHook('governance:refresh')
      }
    }, 1000)

    unstakeAmount.value = 0
    tab.value = 'claim' // Switch to claim tab
  }
  catch (e: unknown) {
    handleError(e, 'Failed to unstake tokens')
  }
  finally {
    isUnstaking.value = false
  }
}

const handleClaim = async () => {
  if (!isWalletReady.value) {
    $toast.error(ERROR_MESSAGES.WALLET_NOT_CONNECTED)
    return
  }

  try {
    isClaiming.value = true
    const program = workspace.program?.value
    const userPk = workspace.publicKey?.value
    if (!program || !userPk) throw new Error('Wallet not connected')

    // Get token accounts
    const { PublicKey } = await import('@solana/web3.js')
    const { getAssociatedTokenAddress } = await import('@solana/spl-token')
    const { getTokenMint, getVaultAddress, getTokenProgramId } = await import(
      '~/composables/useGovernance'
    )

    const tokenMint = new PublicKey(getTokenMint())
    const vaultAddressStr = await getVaultAddress() // Async PDA calculation
    const vaultAddress = new PublicKey(vaultAddressStr)
    const TOKEN_2022_PROGRAM_ID = new PublicKey(getTokenProgramId())

    const userTokenAccount = await getAssociatedTokenAddress(
      tokenMint,
      userPk,
      false,
      TOKEN_2022_PROGRAM_ID,
    )

    const vaultTokenAccount = await getAssociatedTokenAddress(
      tokenMint,
      vaultAddress,
      true,
      TOKEN_2022_PROGRAM_ID,
    )

    await governance.claimUnstake(
      program,
      userPk,
      userTokenAccount,
      vaultTokenAccount,
      tokenMint,
    )

    handleSuccess(SUCCESS_MESSAGES.TOKENS_CLAIMED)
    emit('claimed')

    // Refresh data
    await fetchStakeInfo()
    await fetchTokenBalance()

    // Refresh governance stats
    if (import.meta.client) {
      const win = window as Window & {
        __refreshGovernanceStats?: () => Promise<void>
      }
      if (win.__refreshGovernanceStats) {
        await win.__refreshGovernanceStats()
      }
    }
  }
  catch (e: unknown) {
    handleError(e, 'Failed to claim tokens')
  }
  finally {
    isClaiming.value = false
  }
}

const handleAfterLeave = () => emit('update:modelValue', false)

// Watchers
watch(
  () => isWalletReady.value,
  (ready) => {
    if (ready) {
      fetchStakeInfo()
      fetchTokenBalance()
    }
  },
  { immediate: true },
)

// Lifecycle
onMounted(() => {
  if (isWalletReady.value) {
    fetchStakeInfo()
    fetchTokenBalance()
  }
})
</script>

<style scoped>
.v-window-item {
  min-height: 400px;
}
</style>
