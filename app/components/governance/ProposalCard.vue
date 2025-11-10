<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<template>
  <div
    class="proposal-card"
    @click="handleClick()"
  >
    <!-- Status Badge -->
    <div
      class="governance-proposals__badge"
      :class="proposalStatus"
    >
      {{ proposalStatusText }}
    </div>

    <!-- Delete Button (only for owner) -->
    <div
      v-if="isOwner && !isExpired"
      class="delete-button"
    >
      <v-btn
        icon
        variant="text"
        color="error"
        @click.stop="handleDelete"
      >
        <v-icon>mdi-delete</v-icon>
      </v-btn>
    </div>

    <!-- Proposal Content -->
    <div class="governance-proposals__title primary-gray-700">
      {{ proposal.account.title }}
    </div>

    <div class="governance-proposals__subtitle primary-gray-500 mt-2">
      {{ proposal.account.brief }}
    </div>

    <!-- Category and Amount -->
    <div class="proposal-meta mt-2">
      <v-chip
        color="primary"
        variant="outlined"
        density="comfortable"
        class="text-subtitle-1 font-weight-bold"
      >
        {{ proposal.account.cate }}
      </v-chip>
      <span
        v-if="proposal.account.amount && proposal.account.amount > 0"
        class="amount primary-gray-600"
      >
        {{ $numberFormat(proposal.account.amount) }} $GET
      </span>
    </div>

    <!-- Voting Results -->
    <div v-if="!isExpired">
      <div class="vote-row">
        <span class="for">
          ⬆ For: {{ formatVotes(proposal.account.agreeVotes) }} ({{
            forPercentage
          }}%)
        </span>
        <span class="against">
          ⬇ Against: {{ formatVotes(proposal.account.disagreeVotes) }} ({{
            againstPercentage
          }}%)
        </span>
      </div>

      <v-progress-linear
        :model-value="forPercentage"
        color="#27ae60"
        bg-color="#e74c3c"
        height="8"
        class="vote-progress"
        rounded
      />

      <div class="governance-proposals__stats primary-gray-500">
        <span>Total Votes: {{ totalVotes }}</span>
        <span v-if="userVoteStatus">You voted: {{ userVoteStatus }}</span>
      </div>
    </div>

    <!-- Footer with Time and Actions -->
    <div class="governance-proposals__footer mt-3">
      <div class="time primary-gray-500">
        <v-icon
          size="small"
          color="#98A2B3"
        >
          mdi-timer-outline
        </v-icon>
        <span class="pl-1">{{ timeRemaining }}</span>
      </div>

      <div>
        <div
          v-if="!isExpired && !hasVoted"
        >
          <v-btn
            size="small"
            prepend-icon="mdi-arrow-up-thin"
            color="green"
            variant="outlined"
            rounded="xl"
            class="mr-1 text-subtitle-2"
            :disabled="!canVote"
            @click.stop="handleVote(true)"
          >
            Vote For
          </v-btn>
          <v-btn
            size="small"
            prepend-icon="mdi-arrow-down-thin"
            color="red"
            variant="outlined"
            rounded="xl"
            class="text-subtitle-2"
            :disabled="!canVote"
            @click.stop="handleVote(false)"
          >
            Vote Against
          </v-btn>
        </div>
        <div
          v-else-if="isOwner && isExpired && forPercentage > 50 "
        >
          <v-btn
            size="small"
            color="green"
            variant="outlined"
            rounded="xl"
            style="font-size: 10px"
            @click.stop="requestFund()"
          >
            Request to fund
          </v-btn>
        </div>

        <div
          v-else-if="hasVoted "
          class="voted-indicator"
        >
          <v-chip
            :color="userVoteStatus === 'For' ? 'green' : '#f04438'"
            variant="flat"
            density="comfortable"
            style="font-size: 10px"
          >
            Voted {{ userVoteStatus }}
          </v-chip>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Dialog -->
    <v-dialog
      v-model="deleteDialog"
      max-width="400"
    >
      <v-card>
        <v-card-title>Delete Proposal</v-card-title>
        <v-card-text>
          Are you sure you want to delete this proposal? This action cannot be
          undone.
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            text
            @click="deleteDialog = false"
          >
            Cancel
          </v-btn>
          <v-btn
            color="error"
            variant="flat"
            :loading="deleteLoading"
            @click="confirmDelete"
          >
            Delete
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { governance, useGovernance } from '~/composables/useGovernance'
import { useWorkspace } from '~/composables/useWorkspace'

let BN: unknown
type BNType = unknown // optional, you can refine later with typeof import

onMounted(async () => {
  // Dynamically import Anchor only on client side (Nuxt 4 SSR-safe)
  if (import.meta.client) {
    const anchor = await import('@coral-xyz/anchor')
    BN = anchor.BN
  }
})

const props = defineProps<{
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  proposal: any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  userPublicKey?: any
}>()

const emits = defineEmits(['select', 'vote', 'delete', 'walletRequired', 'requestFund'])

// State
const deleteDialog = ref(false)
const deleteLoading = ref(false)
const hasVoted = ref(false)
const userVoteStatus = ref<string | null>(null)
const { isProposalExpired } = useGovernance()

// Computed properties
const isExpired = computed(() => {
  if (!props.proposal?.account?.expiresAt) return false
  return isProposalExpired(props.proposal.account)
})

const isOwner = computed(() => {
  if (!props.userPublicKey || !props.proposal?.account?.owner) return false
  return props.proposal.account.owner.equals(props.userPublicKey)
})

const totalVotes = computed(() => {
  const agreeVotes = props.proposal?.account?.agreeVotes || new BN(0)
  const disagreeVotes = props.proposal?.account?.disagreeVotes || new BN(0)
  return agreeVotes.add(disagreeVotes).toNumber()
})

const forPercentage = computed(() => {
  if (totalVotes.value === 0) return 0
  const agreeVotes = props.proposal?.account?.agreeVotes || new BN(0)
  return Math.round((agreeVotes.toNumber() / totalVotes.value) * 100)
})

const againstPercentage = computed(() => {
  if (totalVotes.value === 0) return 0
  return 100 - forPercentage.value
})

const proposalStatus = computed(() => {
  if (isExpired.value) {
    return forPercentage.value > 50 ? 'passed' : 'rejected'
  }
  return 'active'
})

const proposalStatusText = computed(() => {
  if (isExpired.value) {
    return forPercentage.value > 50 ? 'Passed' : 'Rejected'
  }
  return 'Active'
})

const timeRemaining = computed(() => {
  if (!props.proposal?.account?.expiresAt) return 'No expiry set'

  const expiryTime = props.proposal.account.expiresAt.toNumber() * 1000
  const now = Date.now()
  const diff = expiryTime - now

  if (diff <= 0) return 'Expired'

  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))

  if (days > 0) return `${days} day${days > 1 ? 's' : ''} remaining`
  if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} remaining`
  return 'Less than 1 hour remaining'
})

const canVote = computed(() => {
  // Allow voting buttons to be clickable even without wallet connection
  // The actual wallet check happens in handleVote function
  return !isExpired.value && !hasVoted.value
})

// Methods
const formatVotes = (votes: BNType) => {
  if (!votes) return '0'
  const num = votes.toNumber()
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
  return num.toString()
}

const handleClick = () => {
  emits('select', props.proposal)
}

const handleVote = async (agree: boolean) => {
  if (!canVote.value) return

  // Check if user has wallet connected
  if (!props.userPublicKey) {
    emits('walletRequired')
    return
  }

  try {
    emits('vote', { proposal: props.proposal, agree })
  }
  catch (error) {
    console.error('Vote failed:', error)
  }
}

const requestFund = async () => {
  // Check if user has wallet connected
  if (!props.userPublicKey) {
    emits('walletRequired')
    return
  }

  try {
    emits('requestFund')
  }
  catch (error) {
    console.error('Request fund failed:', error)
  }
}

const handleDelete = () => {
  deleteDialog.value = true
}

const confirmDelete = async () => {
  if (!isOwner.value) return

  deleteLoading.value = true
  try {
    const workspace = useWorkspace()
    const program = workspace.program?.value
    const userPk = props.userPublicKey

    if (!program || !userPk) {
      throw new Error('Wallet or program not ready')
    }

    await governance.deleteProposal(program, userPk, props.proposal.publicKey)

    // Show success message
    const { $toast } = useNuxtApp()
    $toast.success('Proposal deleted successfully')

    deleteDialog.value = false
    emits('delete', props.proposal)
  }
  catch (error) {
    console.error('Delete failed:', error)
    const { $toast } = useNuxtApp()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    $toast.error((error as any).message || 'Failed to delete proposal')
  }
  finally {
    deleteLoading.value = false
  }
}

// Check vote status on mount
onMounted(async () => {
  if (!props.userPublicKey || !props.proposal) return

  try {
    const workspace = useWorkspace()
    const program = workspace.program?.value

    if (program) {
      const voteRecord = await governance.getVoteRecord(
        program,
        props.proposal.publicKey,
        props.userPublicKey,
      )

      hasVoted.value = voteRecord.hasVoted
      if (voteRecord.voteRecord) {
        userVoteStatus.value
          = voteRecord.voteRecord.vote === 'agree' ? 'For' : 'Against'
      }
    }
  }
  catch (error) {
    console.warn('Failed to check vote status:', error)
  }
})
</script>

<style lang="scss" scoped>
.proposal-card {
  border-radius: 16px;
  padding: 12px;
  position: relative;
  border: 1px solid #ced0d25a;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    transform: scale(1.01);
    box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
    border-color: #f7900967;
  }

  .governance-proposals__badge {
    position: absolute;
    top: -9px;
    right: 12px;
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

  .delete-button {
    position: absolute;
    top: 18px;
    right: 8px;
    z-index: 1;
  }

  .governance-proposals__title {
    font-size: 16px;
    font-weight: 699;
    margin-top: 8px;
  }

  .proposal-meta {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 22px;

    .amount {
      font-size: 12px;
      font-weight: 600;
    }
  }

  .voted-indicator {
    display: flex;
    align-items: center;
  }

  .governance-proposals__subtitle {
    font-size: 12px;
    margin-bottom: 12px;
    word-break: break-all;
  }

  .vote-row {
    display: flex;
    justify-content: space-between;
    font-size: 10px;
    margin-bottom: 6px;

    .for {
      color: #27ae60;
      font-weight: 600;
    }
    .against {
      color: #e74c3c;
      font-weight: 600;
    }
  }

  .vote-progress {
    margin-bottom: 10px;
  }

  .governance-proposals__stats {
    font-weight: 400;
    display: flex;
    justify-content: space-between;
    font-size: 10px;
    margin-bottom: 6px;
  }

  .governance-proposals__footer {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .time {
      font-size: 10px;
      display: flex;
      align-items: center;
    }

  }
}
</style>
