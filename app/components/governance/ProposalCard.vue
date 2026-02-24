<template>
  <div
    class="proposal-card"
  >
    <div
      class="governance-proposals__badge"
      :class="proposalStatus"
    >
      {{ proposalStatusText }}
    </div>

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
        <v-icon>md:delete_outlined</v-icon>
      </v-btn>
    </div>

    <div class="governance-proposals__title text-grey700">
      {{ proposal.account.title }}
    </div>

    <div class="governance-proposals__subtitle text-grey500 mt-2">
      {{ proposal.account.brief }}
    </div>

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
        class="amount text-grey500"
      >
        {{ $numberFormat(proposal.account.amount) }} $GET
      </span>
    </div>

    <div v-if="!isExpired">
      <div class="vote-row">
        <span class="for">
          ⬆ For: {{ $numberFormat(proposal.account.agreeVotes/1000000) }} ({{
            forPercentage
          }}%)
        </span>
        <span class="against">
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
        class="vote-progress"
        rounded
      />

      <div class="governance-proposals__stats text-grey500">
        <span>Total Votes: {{ $numberFormat(totalVotes/1000000) }}</span>
      </div>
    </div>

    <div class="governance-proposals__footer mt-3">
      <div class="time text-grey500">
        <v-icon
          size="small"
          color="grey500"
        >
          md:timer_outlined
        </v-icon>
        <span class="pl-1">{{ timeRemaining }}</span>
      </div>

      <div
        v-if="isOwner && isExpired && forPercentage > 50 "
      >
        <v-btn
          size="small"
          color="success"
          variant="outlined"
          rounded="xl"
          style="font-size: 10px"
          @click.stop="requestFund()"
        >
          Request to fund
        </v-btn>
      </div>

      <v-dialog
        v-model="deleteDialog"
        max-width="500"
        :fullscreen="!mdAndUp"
        @click="clickOnOverlay"
      >
        <div
          class="w-100 d-flex flex-wrap flex-column bg-white pa-6 rounded-xl mobile-style"
          @click="clickOnModal"
        >
          <v-row class="d-flex align-center">
            <v-col cols="10">
              <span class="text-h4">Delete Proposal</span>
            </v-col>
            <v-col
              cols="2"
              class="d-flex align-center justify-end ga-2"
            >
              <v-icon
                size="x-large"
                color="grey400"
                @click="closeModal"
              >
                md:close
              </v-icon>
            </v-col>
          </v-row>
          <span class="text-h5 mt-6">Are you sure you want to delete this proposal? This action cannot be
            undone.</span>
          <div class="w-100 mt-4 d-flex ga-2 align-center justify-center">
            <v-btn
              color="black"
              flat
              variant="text"
              rounded="lg"
              max-width="200"
              class="w-50 font-weight-bold text-h5 mt-4 mx-auto"
              @click="closeModal"
            >
              Cancel
            </v-btn>
            <v-btn
              color="error"
              flat
              rounded="lg"
              max-width="200"
              class="w-50 font-weight-bold text-h5 mt-4 mx-auto"
              :loading="loadingDeleteProposal"
              @click="confirmDelete"
            >
              Delete
            </v-btn>
          </div>
        </div>
      </v-dialog>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Proposal } from '~/types/governance'
import type { BN as BigNumber } from '@coral-xyz/anchor'
import { useGovernance } from '~/composables/governance/useGovernance'
import { useDisplay } from 'vuetify'

const props = defineProps<{
  proposal: Proposal
}>()

const { $toast } = useNuxtApp()
const { mdAndUp } = useDisplay()
const { BN, publicKey, loadingDeleteProposal, deleteProposal, getProposal, getStatsInformation } = useGovernance()

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
  const agreeVotes = props.proposal?.account?.agreeVotes || new BN.value(0)
  const disagreeVotes = props.proposal?.account?.disagreeVotes || new BN.value(0)
  return agreeVotes.add(disagreeVotes).toNumber()
})

const forPercentage = computed(() => {
  if (totalVotes.value === 0) return 0
  const agreeVotes = props.proposal?.account?.agreeVotes || new BN.value(0)
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

const requestFund = async () => {
}

const deleteDialog = ref(false)

const closeModal = () => {
  deleteDialog.value = false
}

const clickOnOverlay = () => {
  deleteDialog.value = false
}

const clickOnModal = (event: Event) => {
  event.stopPropagation()
}

const handleDelete = () => {
  deleteDialog.value = true
}

const confirmDelete = async () => {
  if (!isOwner.value) {
    $toast.error('Only owner has permission delete proposal.')
  }

  const response = await deleteProposal(props.proposal.publicKey)
  deleteDialog.value = false
  if (response.success) {
    $toast.success(response.message)
    getProposal()
    getStatsInformation()
  }
  else {
    $toast.error(response.message)
  }
}
</script>

<style lang="scss" scoped>
@media only screen and (max-width: 960px) {
  .mobile-style {
    position: absolute;
    bottom: 0;
    border-radius: 24px 24px 0 0 !important;
  }
}
.proposal-card {
  border-radius: 16px;
  padding: 12px;
  position: relative;
  border: 1px solid  rgb(var(--v-theme-grey100));
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    transform: scale(1.01);
    box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
    border-color: rgb(var(--v-theme-primary));
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
    background: rgb(var(--v-theme-success));
  }
  .governance-proposals__badge.pending {
    background: rgb(var(--v-theme-warning));
  }
  .governance-proposals__badge.rejected {
    background: rgb(var(--v-theme-error));
  }
  .governance-proposals__badge.passed {
    background: rgb(var(--v-theme-info));
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
      color:  rgb(var(--v-theme-success));
      font-weight: 600;
    }
    .against {
      color: rgb(var(--v-theme-error));
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
