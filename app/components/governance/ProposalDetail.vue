<template>
  <v-dialog
    v-model="dialogModel"
    max-width="550"
    :fullscreen="!mdAndUp"
    persistent
    @click="clickOnOverlay"
  >
    <div
      class="w-100 d-flex flex-column bg-white pa-6 rounded-xl overflow-y-auto overflow-x-hidden mobile-style"
      @click="clickOnModal"
    >
      <div class="w-100 d-flex align-center justify-space-between">
        <v-chip
          :color="proposalStatus.color"
          variant="flat"
          density="compact"
          class="text-capitalize font-weight-bold text-h6 "
        >
          {{ proposalStatus.title }}
        </v-chip>
        <v-icon
          size="x-large"
          color="grey400"
          @click="closeModal"
        >
          md:close
        </v-icon>
      </div>
      <div class="w-100 d-flex flex-column mt-2">
        <span class="text-h4 font-weight-bold text-grey700">
          {{ proposal?.account?.title || "Loading..." }}
        </span>

        <span class="text-h5 text-grey500 mt-2 mb-10">
          {{ proposal?.account?.brief || "Loading proposal description..." }}
          <a
            v-if="proposal?.account?.reference"
            class="text-decoration-none font-weight-bold text-h5 text-primary"
            target="_blank"
            :href="proposal?.account?.reference"
          >
            See More
          </a>
        </span>

        <span
          v-if="proposal.account.amount && proposal.account.amount > 0"
          class="text-h4 font-weight-bold text-grey700 mb-4"
        >
          {{ $numberFormat(proposal.account.amount) }} $GET
        </span>

        <div class="w-100 d-flex align-center justify-space-between">
          <span class="text-success font-weight-bold">
            ⬆ For: {{ $numberFormat(proposal.account.agreeVotes/1000000) }} ({{
              forPercentage
            }}%)
          </span>
          <span class="text-error font-weight-bold">
            ⬇ Against: {{ $numberFormat(proposal.account.disagreeVotes/1000000) }} ({{
              againstPercentage
            }}%)
          </span>
        </div>
        <v-progress-linear
          :model-value="forPercentage"
          color="success"
          bg-color="#e74c3c"
          height="8"
          class="mb-3 mt-2"
          rounded
        />

        <div class="w-100 d-flex justify-space-between align-center text-h6 text-grey500">
          <span><span class="font-weight-bold text-black">{{ forPercentage }}%</span>
            Quorum
          </span>
          <span>
            <span class="font-weight-bold text-black">
              {{ $numberFormat(totalVotes/1000000) }}</span>
            Total Votes</span>
        </div>

        <div
          class="d-flex flex-wrap align-center mt-7"
        >
          <div class="d-flex align-center text-grey500 w-100 w-sm-50 mb-3">
            <v-icon color="grey500">
              md:person
            </v-icon>
            <span class="font-weight-bold text-black ml-2 mr-1">{{
              proposal?.account?.owner.toString().slice(0, 4) + "..."+ proposal?.account?.owner.toString().slice(-4)
            }}</span>
            Proposal Creator
          </div>
          <div class="d-flex align-center text-grey500 w-100 w-sm-50 mb-3">
            <v-icon color="grey500">
              md:calendar_month_outlined
            </v-icon>
            <span class="font-weight-bold text-black ml-2 mr-1">{{
              formatDate(proposal?.account?.createdAt)
            }}</span>
            Created on
          </div>
          <div class="d-flex align-center text-grey500 w-100 w-sm-50 mb-3">
            <v-icon color="grey500">
              md:timer_outlined
            </v-icon>
            <span class="font-weight-bold text-black ml-2 mr-1">{{
              timeRemaining
            }}</span>
            Remaining
          </div>
        </div>

        <v-alert
          v-if="!isExpired &&(userStakeInformation == null || userStakeInformation?.stakedAmount == 0)"
          type="warning"
          variant="tonal"
          class="mt-4"
        >
          You need to stake $GET to vote.
        </v-alert>

        <v-alert
          v-if="!isExpired && publicKey == null"
          type="warning"
          variant="tonal"
          class="mt-4"
        >
          You must connect your wallet to vote.
        </v-alert>

        <div
          v-if="!isExpired"
          class="d-flex ga-2 mt-7"
        >
          <v-btn
            size="large"
            prepend-icon="md:north"
            color="success"
            rounded="lg"
            class="w-50 text-h5 font-weight-bold"
            :disabled="hasVoted || publicKey == null || (laodingVoteProcess && disableVoteButton ==`againt`)"
            variant="flat"
            :loading="(laodingVoteProcess && disableVoteButton ==`for`) || loadingGetVoteInformation"
            @click="handleVote(true)"
          >
            Vote For
          </v-btn>
          <v-btn
            size="large"
            prepend-icon="md:south"
            color="error"
            rounded="lg"
            class="w-50 text-h5 font-weight-bold"
            :disabled="hasVoted || publicKey == null || (laodingVoteProcess && disableVoteButton ==`for`)"
            variant="flat"
            :loading="(laodingVoteProcess && disableVoteButton ==`againt`) || loadingGetVoteInformation"
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
            color="success"
            variant="outlined"
            rounded="xl"
            class="mt-2 text-h5 font-weight-bold"
          >
            Request to fund
          </v-btn>
        </div>
      </div>
    </div>
  </v-dialog>
</template>

<script setup lang="ts">
import type { Proposal } from '~/types/governance'
import type { BN as BigNumber } from '@coral-xyz/anchor'
import { useDisplay } from 'vuetify'
import { useGovernance } from '~/composables/governance/useGovernance'
import { computed } from 'vue'

const { $numberFormat, $toast } = useNuxtApp()
const { mdAndUp } = useDisplay()
const { BN, getVoteInformationProposal, publicKey, userStakeInformation, voteProppsal, laodingVoteProcess, getProposal, loadingGetVoteInformation, getStatsInformation } = useGovernance()

const props = defineProps<{
  proposal: Proposal
  showDialog: boolean
}>()

const emit = defineEmits(['update:showDialog', 'close'])

const dialogModel = computed({
  get: () => props.showDialog,
  set: value => emit('update:showDialog', value),
})

const closeModal = () => {
  emit('close')
  emit('update:showDialog', false)
}

const clickOnOverlay = () => {
  if (!mdAndUp.value) {
    emit('close')
    emit('update:showDialog', false)
  }
}

const clickOnModal = (event: Event) => {
  event.stopPropagation()
}

const isProposalExpired = (expiresAt: BigNumber): boolean => {
  const now = Math.floor(Date.now() / 1000)
  return expiresAt.toNumber() < now
}

const isExpired = computed(() => {
  if (!props.proposal?.account?.expiresAt) return false
  return isProposalExpired(props.proposal.account.expiresAt)
})

const isOwner = computed(() => {
  if (!publicKey.value || !props.proposal?.account?.owner) return false
  return props.proposal.account.owner.equals(publicKey.value)
})

const totalVotes = computed(() => {
  if (!props.proposal?.account) return 0
  const agreeVotes = props.proposal.account.agreeVotes || new BN.value(0)
  const disagreeVotes = props.proposal.account.disagreeVotes || new BN.value(0)
  return agreeVotes.add(disagreeVotes).toNumber()
})

const forPercentage = computed(() => {
  const totalVotesNum = totalVotes.value
  if (totalVotesNum === 0) return 0
  const agreeVotes = props.proposal?.account?.agreeVotes || new BN.value(0)
  return Math.round((agreeVotes.toNumber() / totalVotesNum) * 100)
})

const againstPercentage = computed(() => {
  if (totalVotes.value === 0) return 0
  return 100 - forPercentage.value
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

const formatDate = (timestamp: number): string => {
  if (!timestamp) return '00/00/0000'
  const date = new Date(timestamp * 1000)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
}

const hasVoted = ref(true)
const disableVoteButton = ref('')

const handleVote = async (agree: boolean) => {
  if (userStakeInformation.value && userStakeInformation.value.stakedAmount > 0) {
    disableVoteButton.value = agree ? `for` : `againt`
    const response = await voteProppsal(props.proposal.publicKey, agree)
    if (response.success) {
      $toast.success(response.message)
      emit('close')
      emit('update:showDialog', false)
      getProposal()
      getStatsInformation()
    }
    else {
      $toast.error(response.message)
    }
    disableVoteButton.value = ''
  }
  else {
    $toast.error(' You need to stake $GET to vote.')
  }
}

onMounted(async () => {
  if (!isExpired.value) {
    const dataVote = await getVoteInformationProposal(props.proposal.publicKey)
    if (dataVote) {
      hasVoted.value = dataVote.hasVoted
    }
    else {
      hasVoted.value = false
    }
  }
})
</script>

<style scoped>
@media only screen and (max-width: 960px) {
  .mobile-style {
    max-height: 90%;
    position: absolute;
    bottom: 0;
    border-radius: 24px 24px 0 0 !important;
  }
}
</style>
