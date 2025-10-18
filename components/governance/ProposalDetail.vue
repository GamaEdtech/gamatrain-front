<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<template>
  <div>
    <v-dialog
      v-model="visible"
      max-width="480"
      :fullscreen="!smAndUp"
      @after-leave="handleAfterLeave"
    >
      <template #default="{ isActive }">
        <v-card>
          <div class="d-flex justify-space-between px-4 pt-4">
            <v-chip
              :color="proposalStatus.color"
              variant="flat"
              density="compact"
              class="text-capitalize font-weight-bold text-h6 "
            >
              {{ proposalStatus.title }}
            </v-chip>
            <div
              class="d-flex justify-end cursor-pointer"
              @click="isActive.value = false"
            >
              <v-icon color="#D0D5DD">
                mdi-close
              </v-icon>
            </div>
          </div>

          <v-card-text>
            <governance-proposal-details-content
              :proposal="proposal"
              :for-percentage="forPercentage"
            />
          </v-card-text>
        </v-card>
      </template>
    </v-dialog>

    <v-bottom-sheet
      v-model="visibleBottomSheet"
      scrollable
    >
      <v-card
        class=" rounded-t-xl"
        max-height="600"
      >
        <v-card-text>
          <div class="d-flex justify-space-between align-center py-2">
            <v-chip
              :color="proposalStatus.color"
              variant="flat"
              density="compact"
              class="text-capitalize font-weight-bold text-h6 "
            >
              {{ proposalStatus.title }}
            </v-chip>
            <div class="">
              <div
                class="d-flex justify-end cursor-pointer"
                @click="handleClose"
              >
                <v-icon color="#98A2B3">
                  mdi-close
                </v-icon>
              </div>
            </div>
          </div>

          <governance-proposal-details-content
            :proposal="proposal"
            :for-percentage="forPercentage"
          />
        </v-card-text>
      </v-card>
    </v-bottom-sheet>
  </div>
</template>

<script setup lang="ts">
import { useDisplay } from 'vuetify'
import { governance, useGovernance } from '~/composables/useGovernance'
import { useWorkspace } from '~/composables/useWorkspace'
import { PublicKey } from '@solana/web3.js'

const { smAndUp } = useDisplay()
const { isProposalExpired } = useGovernance()

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
  proposal: {
    type: Object,
    default: null,
  },
  userPublicKey: {
    type: Object,
    default: null,
  },
})

const emits = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'vote', payload: { agree: boolean }): void
  (e: 'walletRequired'): void
}>()

const visible = ref(false)
const visibleBottomSheet = ref(false)
// const voteLoading = ref<'for' | 'against' | null>(null)
const hasVoted = ref(false)
const userVoteStatus = ref<string | null>(null)

// Computed properties
const isExpired = computed(() => {
  if (!props.proposal?.account?.expiresAt) return false
  return isProposalExpired(props.proposal.account)
})

// const canVote = computed(() => {
// Allow voting buttons to be clickable even without wallet connection
// The actual wallet check happens in handleVote function
// return !isExpired.value && !hasVoted.value
// })

const totalVotes = computed(() => {
  if (!props.proposal?.account) return new BN(0)
  const agreeVotes = props.proposal.account.agreeVotes || new BN(0)
  const disagreeVotes = props.proposal.account.disagreeVotes || new BN(0)
  return agreeVotes.add(disagreeVotes)
})

const forPercentage = computed(() => {
  const totalVotesNum = totalVotes.value.toNumber()
  if (totalVotesNum === 0) return 0
  const agreeVotes = props.proposal?.account?.agreeVotes || new BN(0)
  return Math.round((agreeVotes.toNumber() / totalVotesNum) * 100)
})

const proposalStatus = computed(() => {
  if (isExpired.value) {
    return forPercentage.value > 50
      ? {
          title: 'passed',
          color: '#2e90fa',
        }
      : {
          title: 'rejected',
          color: '#f04438',
        }
  }
  return {
    title: 'Active',
    color: '#27ae60',
  }
})

// const timeRemaining = computed(() => {
//   if (!props.proposal?.account?.expiresAt) return '0 Days'
//   const now = Math.floor(Date.now() / 1000)
//   const expiresAt = props.proposal.account.expiresAt.toNumber()
//   const diffSeconds = expiresAt - now

//   if (diffSeconds <= 0) return '0 Days'

//   const days = Math.floor(diffSeconds / (24 * 60 * 60))
//   const hours = Math.floor((diffSeconds % (24 * 60 * 60)) / (60 * 60))

//   if (days > 0) {
//     return `${days} Day${days > 1 ? 's' : ''}`
//   }
//   return `${hours} Hour${hours > 1 ? 's' : ''}`
// })

// Watchers - simplified approach
watch(
  () => props.modelValue,
  (val: boolean) => {
    if (smAndUp.value) {
      visible.value = val
    }
    else {
      visibleBottomSheet.value = val
    }
  },
  { immediate: true },
)

// Emit updates when visibility changes
watch([visible, visibleBottomSheet], ([dialogVisible, sheetVisible]) => {
  const isVisible = smAndUp.value ? dialogVisible : sheetVisible
  emits('update:modelValue', isVisible)
})

const handleClose = () => {
  visible.value = false
  visibleBottomSheet.value = false
  emits('update:modelValue', false)
}

const handleAfterLeave = () => {
  visible.value = false
  visibleBottomSheet.value = false
  emits('update:modelValue', false)
}

// Function to check vote status
const checkVoteStatus = async () => {
  if (!props.userPublicKey || !props.proposal) {
    hasVoted.value = false
    userVoteStatus.value = null
    return
  }

  try {
    const workspace = useWorkspace()
    const program = workspace.program?.value

    if (program) {
      const voteRecord = await governance.getVoteRecord(
        program,
        new PublicKey(props.proposal.publicKey),
        new PublicKey(props.userPublicKey),
      )

      hasVoted.value = voteRecord.hasVoted
      if (voteRecord.voteRecord) {
        userVoteStatus.value
          = voteRecord.voteRecord.vote === 'true' ? 'For' : 'Against'
      }
    }
  }
  catch (error) {
    console.warn('Failed to check vote status:', error)
    hasVoted.value = false
    userVoteStatus.value = null
  }
}

// Check vote status on mount
onMounted(async () => {
  await checkVoteStatus()
})

// Watch for changes in proposal or userPublicKey
watch(
  () => props.proposal,
  async () => {
    await checkVoteStatus()
  },
)

watch(
  () => props.userPublicKey,
  async () => {
    await checkVoteStatus()
  },
)
</script>
