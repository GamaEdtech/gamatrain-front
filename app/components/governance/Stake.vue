<template>
  <v-dialog
    v-model="dialogModel"
    max-width="600"
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
                v-if="userStakeInformation"
                type="info"
                variant="tonal"
                class="mb-4"
              >
                <div class="gama-text-body2">
                  <div class="d-flex justify-space-between mb-2">
                    <span class="font-size-12">Currently Staked:</span>
                    <span class="font-weight-bold font-size-12">{{ $numberFormat(userStakeInformation?.stakedAmount ?? 0) }} $GET</span>
                  </div>
                  <div class="d-flex justify-space-between mb-2">
                    <span class="font-size-12">Your Vote Power:</span>
                    <span class="font-weight-bold font-size-14">{{
                      $numberFormat(userStakeInformation?.stakedAmount ?? 0)
                    }}</span>
                  </div>
                  <div
                    v-if="userStakeInformation.pendingRewards && userStakeInformation.pendingRewards > 0"
                    class="d-flex justify-space-between"
                  >
                    <span class="font-size-12 text-success">🎁 Pending Rewards:</span>
                    <span class="font-weight-bold font-size-12 text-success">{{ $numberFormat(userStakeInformation.pendingRewards) }} $GET</span>
                  </div>
                  <div
                    v-if="!userStakeInformation.pendingRewards || userStakeInformation.pendingRewards === 0"
                    class="d-flex justify-space-between"
                  >
                    <span class="font-size-12 text-grey">💡 Tip: Vote on proposals to earn rewards!</span>
                  </div>
                </div>
              </v-alert>

              <v-form
                v-model="stakeFormValid"
                @submit.prevent="handleStake"
              >
                <v-text-field
                  v-model.number="stakeAmount"
                  label="Amount to Stake"
                  variant="outlined"
                  rounded="lg"
                  type="number"
                  :rules="[rules.required, rules.positive, customRules.maxBalance]"
                  :hint="`Available: ${$numberFormat(tokenBalance ?? 0)} $GET`"
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
                  rounded="lg"
                  block
                  :loading="loadinStakeProccess"
                  :disabled="!stakeFormValid"
                  class="mt-4 text-h5 font-weight-bold"
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

              <v-alert
                v-if="userStakeInformation"
                type="warning"
                variant="tonal"
                class="mb-4"
              >
                <div class="gama-text-body2">
                  <div class="d-flex justify-space-between mb-2">
                    <span class="font-size-12">Currently Staked:</span>
                    <span class="font-weight-bold font-size-12">{{ $numberFormat(userStakeInformation.stakedAmount) }} $GET</span>
                  </div>
                  <div
                    v-if="userStakeInformation.pendingUnstake > 0"
                    class="d-flex justify-space-between mb-2"
                  >
                    <span class="font-size-12">Pending Unstake:</span>
                    <span class="font-weight-bold font-size-12">{{ $numberFormat(userStakeInformation.pendingUnstake) }} $GET</span>
                  </div>
                  <div
                    v-if="userStakeInformation.pendingRewards && userStakeInformation.pendingRewards > 0"
                    class="d-flex justify-space-between"
                  >
                    <span class="font-size-12 text-success">🎁 Pending Rewards:</span>
                    <span class="font-weight-bold font-size-12 text-success">{{ $numberFormat(userStakeInformation.pendingRewards) }} $GET</span>
                  </div>
                </div>
              </v-alert>
              <v-form
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
                    userStakeInformation?.stakedAmount || 0,
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
                  color="primary"
                  size="large"
                  rounded="lg"
                  block
                  :loading="loadingUnstakeProcess"
                  :disabled="
                    !unstakeFormValid
                      || !userStakeInformation
                      || userStakeInformation.stakedAmount === 0
                  "
                  class="mt-4 text-h5 font-weight-bold"
                >
                  Initiate Unstake
                </v-btn>
              </v-form>
            </v-card-text>
          </v-card>
        </v-window-item>

        <!-- Claim Tab -->
        <v-window-item value="claim">
          <!-- <v-card flat>
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
          </v-card> -->
        </v-window-item>
      </v-window>
    </v-sheet>
  </v-dialog>
</template>

<script setup lang="ts">
import { useValidationRules } from '~/composables/useValidationRules'
import { useGovernance } from '~/composables/governance/useGovernance'

const { userStakeInformation, tokenBalance, stakeToken, loadinStakeProccess, getUserStakeInformation, getStatsInformation, loadingUnstakeProcess, unstakeToken } = useGovernance()
const { $toast } = useNuxtApp()
const tab = ref('stake')

const props = defineProps({
  showDialog: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['update:showDialog'])
const dialogModel = computed({
  get: () => props.showDialog,
  set: value => emit('update:showDialog', value),
})

const stakeAmount = ref<number>(0)
const stakeFormValid = ref(false)
const rules = useValidationRules()
const customRules = {
  maxBalance: (v: number) => rules.maxBalance(tokenBalance.value ?? 0)(v),
  maxStaked: (v: number) => {
    const maxValue = userStakeInformation.value?.stakedAmount || 0
    return v <= maxValue || `Cannot unstake more than staked amount`
  },
}

const handleStake = async () => {
  const response = await stakeToken(stakeAmount.value)
  if (response.success) {
    console.log('Stake success:', response.signature)
    $toast.success(response.message)
    emit('update:showDialog', false)
    await getUserStakeInformation()
    await getStatsInformation()
  }
  else {
    $toast.error(response.message)
  }
}

const unstakeAmount = ref<number>(0)
const unstakeFormValid = ref(false)

const handleUnstake = async () => {
  console.log('handleUnstake')
  const response = await unstakeToken(unstakeAmount.value)
  if (response.success) {
    console.log('unStake success:', response)
    $toast.success(response.message)
    emit('update:showDialog', false)
    await getUserStakeInformation()
  }
  else {
    $toast.error(response.message)
  }
}

// import { useErrorHandler } from '~/composables/useErrorHandler'
// import { useValidationRules } from '~/composables/useValidationRules'
// import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '~/constants/governance'
// import type { StakeAccount } from '~/types/governance'

// // Toast notification
// const { $toast } = useNuxtApp()

// // Error handler
// const { handleError, handleSuccess } = useErrorHandler()

// const emit = defineEmits<{
//   (e: 'update:modelValue', value: boolean): void
//   (e: 'staked' | 'unstaked' | 'claimed'): void
// }>()

// // Local state
// const tab = ref('stake')
// const stakeAmount = ref<number>(0)
// const unstakeAmount = ref<number>(0)
// const stakeFormValid = ref(false)
// const unstakeFormValid = ref(false)
// const stakeFormRef = ref()
// const unstakeFormRef = ref()
// const isStaking = ref(false)
// const isUnstaking = ref(false)
// const isClaiming = ref(false)
// const stakeInfo = ref<StakeAccount | null>(null)
// const tokenBalance = ref(0)

// // Governance composable (includes workspace internally)
// const {
//   isWalletReady,
//   getStakeAccount,
//   isCooldownComplete,
//   getRemainingCooldown,
//   getProgram,
//   getPublicKey,
//   getConnection,
// } = useGovernance()

// // Computed
// const cooldownComplete = computed(() => {
//   if (!stakeInfo.value || stakeInfo.value.pendingUnstake === 0) return false
//   return isCooldownComplete(stakeInfo.value.unstakeRequestedAt)
// })

// const cooldownStatus = computed(() => {
//   if (!stakeInfo.value || stakeInfo.value.pendingUnstake === 0)
//     return 'No cooldown'
//   return getRemainingCooldown(stakeInfo.value.unstakeRequestedAt)
// })

// const handleClaim = async () => {
//   if (!isWalletReady.value) {
//     $toast.error(ERROR_MESSAGES.WALLET_NOT_CONNECTED)
//     return
//   }

//   try {
//     isClaiming.value = true
//     const program = getProgram()
//     const userPk = getPublicKey()
//     if (!program || !userPk) throw new Error('Wallet not connected')

//     // Get token accounts
//     const { PublicKey } = await import('@solana/web3.js')
//     const { getAssociatedTokenAddress } = await import('@solana/spl-token')
//     const { getTokenMint, getVaultAddress, getTokenProgramId } = await import(
//       '~/composables/useGovernance'
//     )

//     const tokenMint = new PublicKey(getTokenMint())
//     const vaultAddressStr = await getVaultAddress() // Async PDA calculation
//     const vaultAddress = new PublicKey(vaultAddressStr)
//     const TOKEN_2022_PROGRAM_ID = new PublicKey(getTokenProgramId())

//     const userTokenAccount = await getAssociatedTokenAddress(
//       tokenMint,
//       userPk,
//       false,
//       TOKEN_2022_PROGRAM_ID,
//     )

//     const vaultTokenAccount = await getAssociatedTokenAddress(
//       tokenMint,
//       vaultAddress,
//       true,
//       TOKEN_2022_PROGRAM_ID,
//     )

//     await governance.claimUnstake(
//       userTokenAccount,
//       vaultTokenAccount,
//       tokenMint,
//     )

//     handleSuccess(SUCCESS_MESSAGES.TOKENS_CLAIMED)
//     emit('claimed')

//     // Refresh data
//     await fetchStakeInfo()
//     await fetchTokenBalance()

//     // Refresh governance stats
//     if (import.meta.client) {
//       const win = window as Window & {
//         __refreshGovernanceStats?: () => Promise<void>
//       }
//       if (win.__refreshGovernanceStats) {
//         await win.__refreshGovernanceStats()
//       }
//     }
//   }
//   catch (e: unknown) {
//     handleError(e, 'Failed to claim tokens')
//   }
//   finally {
//     isClaiming.value = false
//   }
// }
</script>

<style scoped>
.v-window-item {
  min-height: 400px;
}
</style>
