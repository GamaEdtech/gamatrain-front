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
          <div class="px-4 py-4">
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
            <div :class="`governance-proposals__badge ${proposalStatusText}`">
              {{
                proposalStatusText === "active"
                  ? "Active"
                  : proposalStatusText === "passed"
                    ? "Passed"
                    : "Rejected"
              }}
            </div>

            <div class="governance-proposals__title primary-gray-700">
              {{ proposal?.account?.title || "Loading..." }}
            </div>

            <div
              class="governance-proposals__subtitle primary-gray-500 mt-2 mb-10"
            >
              {{
                proposal?.account?.brief || "Loading proposal description..."
              }}
              <a
                v-if="proposal?.account?.reference"
                class="text-decoration-none font-weight-bold text-h5 color-link"
                target="_blank"
                :href="proposal?.account?.reference"
              >
                See More
              </a>
            </div>

            <div
              v-if="proposal.account.amount && proposal.account.amount > 0"
              class="governance-proposals__title primary-gray-700 mb-2"
            >
              {{ formatAmount(proposal.account.amount) }} $GET
            </div>

            <v-progress-linear
              :model-value="forPercentage"
              color="#667085"
              height="8"
              class="vote-progress"
              rounded
            />

            <div class="governance-proposals__stats primary-gray-500">
              <span><span class="font-weight-bold text-black">{{ forPercentage }}%</span>
                Quorum
              </span>
              <span>
                <span class="font-weight-bold text-black">{{
                  formatVotes(totalVotes)
                }}</span>
                Total Votes</span>
            </div>

            <div
              class="d-flex flex-wrap align-center governance-proposals__values mt-7"
            >
              <div class="time primary-gray-500 w-50 mb-3">
                <v-icon color="#98A2B3">
                  mdi-account
                </v-icon>
                <span class="font-weight-bold text-black pl-1">{{
                  formatOwner(proposal?.account?.owner)
                }}</span>
                Proposal Creator
              </div>
              <div class="time primary-gray-500 w-50 mb-3">
                <v-icon color="#98A2B3">
                  mdi-calendar-minus-outline
                </v-icon>
                <span class="font-weight-bold text-black pl-1">{{
                  formatDate(proposal?.account?.createdAt)
                }}</span>
                Created on
              </div>
              <div class="time primary-gray-500 w-50 mb-3">
                <v-icon color="#98A2B3">
                  mdi-timer-outline
                </v-icon>
                <span class="font-weight-bold text-black pl-1">{{
                  timeRemaining
                }}</span>
                Remaining
              </div>
            </div>

            <div class="d-flex mt-7">
              <v-btn
                size="large"
                prepend-icon="mdi-arrow-up-thin"
                color="green"
                rounded
                class="w-50"
                variant="flat"
                :disabled="!canVote || hasVoted"
                :loading="voteLoading === 'for'"
                @click="handleVote(true)"
              >
                Vote For
              </v-btn>
              <v-btn
                size="large"
                prepend-icon="mdi-arrow-down-thin"
                color="red"
                rounded
                class="ml-3 w-50"
                variant="flat"
                :disabled="!canVote || hasVoted"
                :loading="voteLoading === 'against'"
                @click="handleVote(false)"
              >
                Vote Against
              </v-btn>
            </div>
          </v-card-text>
        </v-card>
      </template>
    </v-dialog>

    <v-bottom-sheet
      v-model="visibleBottomSheet"
      scrollable
    >
      <v-card class="detail-bottom-sheet">
        <v-card-text>
          <div class="d-flex justify-space-between align-center py-2">
            <div :class="`governance-proposals__badge ${proposalStatusText}`">
              {{
                proposalStatusText === "active"
                  ? "Active"
                  : proposalStatusText === "passed"
                    ? "Passed"
                    : "Rejected"
              }}
            </div>
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

          <div class="governance-proposals__title primary-gray-700">
            {{ proposal?.account?.title || "Loading..." }}
          </div>

          <div
            class="governance-proposals__subtitle primary-gray-500 mt-2 mb-10"
          >
            {{ proposal?.account?.brief || "Loading proposal description..." }}

            <a
              v-if="proposal?.account?.reference"
              class="text-decoration-none font-weight-bold text-h5 color-link"
              target="_blank"
              :href="proposal?.account?.reference"
            >
              See More
            </a>
          </div>

          <div
            v-if="proposal.account.amount && proposal.account.amount > 0"
            class="governance-proposals__title primary-gray-700 mb-2"
          >
            {{ formatAmount(proposal.account.amount) }} $GET
          </div>

          <v-progress-linear
            :model-value="forPercentage"
            color="#667085"
            height="8"
            class="vote-progress"
            rounded
          />

          <div class="governance-proposals__stats primary-gray-500">
            <span><span class="font-weight-bold text-black">{{ forPercentage }}%</span>
              Quorum
            </span>
            <span>
              <span class="font-weight-bold text-black">{{
                formatVotes(totalVotes)
              }}</span>
              Total Votes</span>
          </div>

          <div
            class="d-flex flex-wrap align-center governance-proposals__values mt-7"
          >
            <div class="time primary-gray-500 w-50 mb-3 line-clamp-1">
              <v-icon color="#98A2B3">
                mdi-account
              </v-icon>
              <span class="font-weight-bold text-black pl-1">{{
                formatOwner(proposal?.account?.owner)
              }}</span>
              Proposal Creator
            </div>
            <div class="time primary-gray-500 w-50 mb-3 line-clamp-1">
              <v-icon color="#98A2B3">
                mdi-calendar-minus-outline
              </v-icon>
              <span class="font-weight-bold text-black pl-1">{{
                formatDate(proposal?.account?.createdAt)
              }}</span>
              Created on
            </div>
            <div class="time primary-gray-500 w-50 mb-3 line-clamp-1">
              <v-icon color="#98A2B3">
                mdi-timer-outline
              </v-icon>
              <span class="font-weight-bold text-black pl-1">{{
                timeRemaining
              }}</span>
              Remaining
            </div>
          </div>

          <div class="d-flex mt-7">
            <v-btn
              size="large"
              prepend-icon="mdi-arrow-up-thin"
              color="green"
              rounded
              class="w-50"
              variant="flat"
              :disabled="!canVote || hasVoted"
              :loading="voteLoading === 'for'"
              @click="handleVote(true)"
            >
              Vote For
            </v-btn>
            <v-btn
              size="large"
              prepend-icon="mdi-arrow-down-thin"
              color="red"
              rounded
              class="ml-3 w-50"
              variant="flat"
              :disabled="!canVote || hasVoted"
              :loading="voteLoading === 'against'"
              @click="handleVote(false)"
            >
              Vote Against
            </v-btn>
          </div>
        </v-card-text>
      </v-card>
    </v-bottom-sheet>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useDisplay } from 'vuetify'
import * as anchor from '@coral-xyz/anchor'
import type { BN as BNType } from '@coral-xyz/anchor'
import { governance, useGovernance } from '~/composables/useGovernance'
import { useWorkspace } from '~/composables/useWorkspace'
import { PublicKey } from '@solana/web3.js'

const { BN } = anchor
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
const voteLoading = ref<'for' | 'against' | null>(null)
const hasVoted = ref(false)
const userVoteStatus = ref<string | null>(null)

// Computed properties
const isExpired = computed(() => {
  if (!props.proposal?.account?.expiresAt) return false
  return isProposalExpired(props.proposal.account)
})

const canVote = computed(() => {
  // Allow voting buttons to be clickable even without wallet connection
  // The actual wallet check happens in handleVote function
  return !isExpired.value && !hasVoted.value
})

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

const proposalStatusText = computed(() => {
  if (isExpired.value) {
    return forPercentage.value > 50 ? 'passed' : 'rejected'
  }
  return 'active'
})

const timeRemaining = computed(() => {
  if (!props.proposal?.account?.expiresAt) return '0 Days'
  const now = Math.floor(Date.now() / 1000)
  const expiresAt = props.proposal.account.expiresAt.toNumber()
  const diffSeconds = expiresAt - now

  if (diffSeconds <= 0) return '0 Days'

  const days = Math.floor(diffSeconds / (24 * 60 * 60))
  const hours = Math.floor((diffSeconds % (24 * 60 * 60)) / (60 * 60))

  if (days > 0) {
    return `${days} Day${days > 1 ? 's' : ''}`
  }
  return `${hours} Hour${hours > 1 ? 's' : ''}`
})

// Methods
const formatVotes = (votes: BNType | number) => {
  if (!votes) return '0'
  const num = typeof votes === 'number' ? votes : votes.toNumber()
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
  return num.toString()
}

const formatDate = (timestamp: BNType) => {
  if (!timestamp) return '00/00/0000'
  const date = new Date(timestamp.toNumber() * 1000)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const formatOwner = (owner: any) => {
  if (!owner) return '0X00...00'
  const address = owner.toBase58()
  return `${address.slice(0, 4)}...${address.slice(-2)}`
}

const formatAmount = (amount: BNType) => {
  if (!amount) return '0'
  const num = amount.toNumber()
  return num.toLocaleString()
}

const handleVote = async (agree: boolean) => {
  if (!canVote.value) return

  // Check if user has wallet connected
  if (!props.userPublicKey) {
    emits('walletRequired')
    return
  }

  voteLoading.value = agree ? 'for' : 'against'
  try {
    // Emit the vote event to parent component
    emits('vote', { agree })

    // Note: The parent component will handle closing the modal after successful vote
    // and refreshing the data, so we don't need to do anything else here
  }
  catch (error) {
    console.error('Vote handling error:', error)
    voteLoading.value = null
  }
  finally {
    // Reset loading state after a short delay to allow for parent processing
    setTimeout(() => {
      voteLoading.value = null
    }, 1000)
  }
}

// Watchers - simplified approach
watch(
  () => props.modelValue,
  (val) => {
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

<style scoped>
.color-link {
  color: #ffb300;
}
.detail-bottom-sheet {
  height: 600px;
  max-height: 600px;
  border-radius: 24px 24px 0 0 !important;
  overflow-y: hidden !important;
}
.governance-proposals__values {
  font-size: 12px;
}
.governance-proposals__badge {
  display: inline-block;

  color: white;
  font-size: 12px;
  font-weight: 600;
  padding: 2px 10px;
  border-radius: 12px;
}
.governance-proposals__badge.active {
  background: #27ae60;
}
.governance-proposals__badge.pending {
  background: #f79009;
}
.governance-proposals__badge.rejected {
  background: #f04438;
}
.governance-proposals__badge.passed {
  background: #2e90fa;
}

.governance-proposals__title {
  font-size: 16px;
  font-weight: 699;
  margin-top: 8px;
}

.governance-proposals__subtitle {
  font-size: 12px;
  margin-bottom: 12px;
}

.vote-progress {
  margin-bottom: 10px;
}

.governance-proposals__stats {
  font-weight: 400;
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  margin-bottom: 6px;
}
</style>
