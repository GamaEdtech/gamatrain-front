<template>
  <div class="mt-10">
    <div class="w-100 d-flex flex-column align-center justify-center ga-4 mb-md-4">
      <div
        class="text-center text-h4 text-md-h3 font-weight-bold text-grey700"
      >
        Active Proposals
      </div>
      <div class="w-100 d-flex flex-column ga-4 flex-sm-row align-center  justify-center justify-sm-space-between px-4">
        <div class="d-flex align-center justify-center justify-sm-start ga-2">
          <template v-if="loadingStakeInformation">
            <v-skeleton-loader
              width="100"
              height="14"
              class="rounded-pill"
            />
            <v-skeleton-loader
              width="70"
              height="20"
              class="rounded-pill"
            />
          </template>
          <template v-else>
            <span class="text-h5 text-grey500">Your Pending Reward :</span>
            <template v-if="userStakeInformation != null ">
              <span class="text-h5 font-weight-bold text-success">{{ $numberFormat(Math.ceil(userStakeInformation.pendingRewards ?? 0)) }} $GET</span>
            </template>
            <template v-else>
              <span class="text-h5 font-weight-bold text-grey700">Connect Wallet</span>
            </template>
          </template>
        </div>
        <div class="d-flex flex-column ga-1 align-center align-sm-end justify-center set-z-index">
          <ClientOnly>
            <AsyncWalletMultiButton />
          </ClientOnly>
          <v-btn
            v-if="connected"
            width="181"
            height="48"
            variant="outlined"
            color="error"
            class="text-h5 font-weight-bold rounded-lg d-block d-sm-none"
            @click="manualDisconnectWallet"
          >
            <v-icon class="mr-2">
              md:signal_disconnected
            </v-icon>
            Disconnect
          </v-btn>
        </div>
      </div>
    </div>
    <div
      v-if="loadingGetProposal"
      class="text-center my-10"
    >
      <div class="d-block">
        <v-slide-group
          class="center-slide-group"
          center-active
          show-arrows
        >
          <v-slide-group-item
            v-for="i in 10"
            :key="i"
          >
            <div class="my-5 mx-1 proposal-slide__card">
              <governance-proposal-card-skeleton />
            </div>
          </v-slide-group-item>
        </v-slide-group>
      </div>
    </div>

    <div
      v-else-if="latestProposals?.length === 0"
      class="text-center my-10"
    >
      <p>No active proposals found. Be the first to create one!</p>
    </div>

    <div
      v-else
      class="mt-6 mt-sm-1"
    >
      <div class="d-block">
        <v-slide-group
          class="center-slide-group"
          center-active
          show-arrows
        >
          <v-slide-group-item
            v-for="proposal in latestProposals"
            :key="proposal.publicKey.toBase58()"
          >
            <div class="my-5 mx-1 proposal-slide__card">
              <governance-proposal-card
                :proposal="proposal"
                @click="openProposalDetail(proposal)"
              />
            </div>
          </v-slide-group-item>
        </v-slide-group>
      </div>
    </div>

    <div class="mt-10 d-flex justify-center">
      <ClientOnly>
        <!-- <v-btn
          :size="mdAndUp ? 'large' : 'default'"
          color="#344054"
          variant="text"
          rounded
        >
          See more
        </v-btn> -->

        <v-btn
          :size="mdAndUp ? 'large' : 'default'"
          color="primary"
          variant="flat"
          rounded
          class="ml-3"
          @click="
            connected
              ? openStakeModal()
              : (showWalletModal = true)
          "
        >
          Stake
        </v-btn>

        <v-btn
          :size="mdAndUp ? 'large' : 'default'"
          color="grey800"
          variant="flat"
          rounded
          class="ml-3"
          @click="
            connected
              ? openCreateProposalModal()
              : (showWalletModal = true)
          "
        >
          Create Proposal
        </v-btn>
      </ClientOnly>
    </div>

    <governance-create-proposal
      v-model:show-dialog="showModalCreateProposal"
    />
    <governance-stake v-model:show-dialog="showModalStake" />
    <governance-proposal-detail
      v-if="selectedProposal"
      v-model:show-dialog="showModalProposalDetail"
      :proposal="selectedProposal"
      @close="closeDetail"
    />

    <modals-connect-wallet v-model:show-dialog="showWalletModal" />
  </div>
</template>

<script setup lang="ts">
import { useDisplay } from 'vuetify'
import { useGovernance } from '~/composables/governance/useGovernance'
import type { Proposal } from '~/types/governance'

const AsyncWalletMultiButton = defineAsyncComponent(async () => {
  const mod = await import('solana-wallets-vue')
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (mod as any).WalletMultiButton
})

const { mdAndUp } = useDisplay()
const { fetchTokenBalance, connected, userStakeInformation, getUserStakeInformation, latestProposals, loadingGetProposal, manualDisconnectWallet, loadingStakeInformation } = useGovernance()

const showModalStake = ref(false)
const showWalletModal = ref(false)

const openStakeModal = () => {
  showModalStake.value = true
  fetchTokenBalance()
  if (userStakeInformation.value == null) {
    getUserStakeInformation()
  }
}

const showModalCreateProposal = ref(false)

const openCreateProposalModal = () => {
  showModalCreateProposal.value = true
}

const selectedProposal = ref<Proposal | null>(null)
const showModalProposalDetail = ref(false)

const openProposalDetail = (proposal: Proposal) => {
  selectedProposal.value = proposal
  showModalProposalDetail.value = true
}

const closeDetail = () => {
  selectedProposal.value = null
}
</script>

<style>
.swv-button{
  column-gap: 8px;
}

.proposal-slide__card {
  width: 310px;
}
.swv-modal {
  z-index: 10000 !important;
}
.set-z-index{
  z-index: 1;
}
</style>
