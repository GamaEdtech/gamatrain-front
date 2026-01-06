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
            <span class="text-h5 text-grey500">Your Reward :</span>
            <template v-if="userStakeInformation != null ">
              <span class="text-h5 font-weight-bold text-success">{{ $numberFormat(Math.ceil(userStakeInformation.pendingRewards ?? 0)) }}</span>
            </template>
            <template v-else>
              <span class="text-h5 font-weight-bold text-grey700">Connect Wallet</span>
            </template>
          </template>
        </div>
        <div class="d-flex flex-column ga-1 align-center align-sm-end justify-center">
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
        <v-btn
          :size="mdAndUp ? 'large' : 'default'"
          color="#344054"
          variant="text"
          rounded
        >
          See more
        </v-btn>

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
          color="#1D2939"
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

    <Teleport to="body">
      <div
        v-if="showWalletModal"
        class="figma-modal-overlay"
        @click="showWalletModal = false"
      >
        <div
          class="figma-modal"
          @click.stop
        >
          <div class="figma-modal-header">
            <h3>Connect Your Wallet</h3>
            <p>Choose a wallet to connect and participate in governance</p>
          </div>

          <div class="figma-modal-content">
            <ClientOnly>
              <div class="d-flex justify-center">
                <AsyncWalletMultiButton />
              </div>
            </ClientOnly>
          </div>

          <div class="figma-modal-actions">
            <button
              class="figma-cancel-button"
              @click="showWalletModal = false"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </Teleport>
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
/* Wallet Modal Styles */
.figma-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.figma-modal {
  background: #ffffff;
  border-radius: 16px;
  padding: 24px;
  max-width: 400px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
}

.figma-modal-header {
  text-align: center;
  margin-bottom: 24px;
}

.figma-modal-header h3 {
  font-size: 20px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0 0 8px 0;
}

.figma-modal-header p {
  font-size: 14px;
  color: #666666;
  margin: 0;
}

.figma-modal-content {
  margin-bottom: 24px;
}

.figma-modal-actions {
  display: flex;
  justify-content: center;
  gap: 12px;
}

.figma-cancel-button {
  background: #f5f5f5;
  border: none;
  border-radius: 8px;
  padding: 12px 24px;
  font-size: 14px;
  font-weight: 500;
  color: #666666;
  cursor: pointer;
  transition: background-color 0.2s;
}

.figma-cancel-button:hover {
  background: #e5e5e5;
}
</style>
