<template>
  <div class="governance-proposals__title primary-gray-700">
    {{ proposal?.account?.title || "Loading..." }}
  </div>
  <div
    class="governance-proposals__subtitle primary-gray-500 mt-2 mb-10"
  >
    <span>
      {{ proposal?.account?.brief || "Loading proposal description..." }}
    </span>
    <a
      v-if="proposal?.account?.reference"
      class="text-decoration-none font-weight-bold text-h5 text-primary"
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
    {{ $numberFormat(proposal.account.amount) }} $GET
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
      <span class="font-weight-bold text-black">
        {{ $numberFormat(totalVotes/1000000) }}</span>
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

  <div
    v-if="!isExpired && !hasVoted"
    class="d-flex mt-7"
  >
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
  <div
    v-else-if="isOwner && isExpired && forPercentage > 50 "
    class="float-right"
  >
    <v-btn
      size="large"
      color="green"
      variant="flat"
      rounded
      @click.stop="requestFund()"
    >
      Request to fund
    </v-btn>
  </div>
</template>

<script setup lang="ts">
import { PublicKey } from '@solana/web3.js'

interface Props {
  proposal?: Record<string, unknown> | null
  userPublicKey?: Record<string, unknown> | null
  forPercentage?: number
  isExpired?: boolean
  totalVotes?: number
}

const props = withDefaults(defineProps<Props>(), {
  proposal: null,
  userPublicKey: null,
  forPercentage: 0,
  isExpired: false,
  totalVotes: 0,
})

const voteLoading = ref<'for' | 'against' | null>(null)
const hasVoted = ref(false)
const userVoteStatus = ref<string | null>(null)

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

const {
  canVote: checkCanVote,
  formatDate,
  formatAddress,
  isProposalOwner,
} = useGovernance()

const canVote = computed(() => {
  return checkCanVote(props.isExpired || false, hasVoted.value)
})

const isOwner = computed(() => {
  return isProposalOwner(props.proposal?.account?.owner, props.userPublicKey)
})

const formatOwner = formatAddress

const emits = defineEmits<{
  (e: 'vote', payload: { agree: boolean }): void
  (e: 'walletRequired' | 'requestFund'): void
}>()

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

    // Wait a bit for blockchain to update, then check vote status
    setTimeout(async () => {
      await checkVoteStatus()
      voteLoading.value = null
    }, 2000)
  }
  catch (error) {
    console.error('Vote handling error:', error)
    voteLoading.value = null
  }
}

const requestFund = async () => {
  // Check if user has wallet connected
  if (!props.userPublicKey) {
    emits('walletRequired')
    return
  }

  try {
    // Emit the request fund to parent component
    emits('requestFund')

    // Note: The parent component will handle closing the modal after successful vote
    // and refreshing the data, so we don't need to do anything else here
  }
  catch (error) {
    console.error('request funding error:', error)
  }
}

// Function to check vote status
const checkVoteStatus = async () => {
  if (!props.userPublicKey || !props.proposal) {
    hasVoted.value = false
    userVoteStatus.value = null
    return
  }

  try {
    const { workspace } = useGovernance()
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
