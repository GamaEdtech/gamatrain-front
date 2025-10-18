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
</template>

<script setup lang="ts">
// import * as anchor from '@coral-xyz/anchor'
import type { BN as BNType } from '@coral-xyz/anchor'

// const { BN } = anchor

const props = defineProps({
  proposal: {
    type: Object,
    default: null,
  },
  userPublicKey: {
    type: Object,
    default: null,
  },
  forPercentage: {
    type: Number,
    default: 0,
  },
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
