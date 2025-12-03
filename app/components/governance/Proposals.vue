<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<template>
  <div class="mt-10">
    <div class="proposals-header mb-md-4">
      <div
        class="proposals-title text-h4 text-md-h3 font-weight-bold primary-gray-700"
      >
        Active Proposals
      </div>
      <div class="wallet-button-container">
        <ClientOnly>
          <AsyncWalletMultiButton />
        </ClientOnly>
      </div>
    </div>

    <!-- 1. State: Loading proposals -->
    <div
      v-if="isLoading"
      class="text-center my-10"
    >
      <v-progress-circular
        indeterminate
        size="64"
        color="primary"
      />
      <p class="mt-4">
        Loading proposals from the blockchain...
      </p>
    </div>

    <!-- 2. State: No proposals found -->
    <div
      v-else-if="proposals.length === 0"
      class="text-center my-10"
    >
      <p>No active proposals found. Be the first to create one!</p>
    </div>

    <!-- 3. State: Display proposals -->
    <div
      v-else
      class="mt-6 mt-sm-1"
    >
      <div class="d-block">
        <!-- <v-slide-group
          v-model="selected"
          class="center-slide-group"
          center-active
          show-arrows
        >
          <v-slide-group-item
            v-for="proposal in proposals"
            :key="proposal.publicKey.toBase58()"
          >
            <div class="my-5 mx-1 proposal-slide__card">
              <governance-proposal-card
                :proposal="proposal"
                :user-public-key="publicKey"
                @select="handleProposalClick"
                @vote="handleVote"
                @delete="handleProposalDeleted"
                @wallet-required="handleWalletRequired"
                @request-fund="handleRequestFund(proposal)"
              />
            </div>
          </v-slide-group-item>
        </v-slide-group> -->
      </div>
    </div>

    <!-- Buttons -->
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

        <!-- <v-btn
          :size="mdAndUp ? 'large' : 'default'"
          color="#1D2939"
          variant="flat"
          rounded
          class="ml-3"
          @click="
            connected
              ? (visibleCreateProposal = true)
              : (showWalletModal = true)
          "
        >
          Create Proposal
        </v-btn> -->
      </ClientOnly>
    </div>

    <!-- Dialogs -->
    <!-- <governance-create-proposal
      v-model="visibleCreateProposal"
      @created="handleProposalCreated"
      @wallet-required="handleWalletRequired"
    /> -->
    <governance-stake v-model:show-dialog="visibleStake" />
    <!-- <governance-proposal-detail
      v-if="selectedProposal"
      v-model="visibleProposalDetail"
      :proposal="selectedProposal"
      :user-public-key="publicKey"
      @vote="({ agree }) => handleVote({ proposal: selectedProposal, agree })"
      @wallet-required="handleWalletRequired"
      @request-fund="handleRequestFund(selectedProposal)"
    /> -->

    <!-- Wallet Connection Modal -->
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
              <div class="wallet-connection-container">
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
// Intentionally avoid calling useWallet() during SSR; we'll access it in onMounted

const { mdAndUp } = useDisplay()
const AsyncWalletMultiButton = defineAsyncComponent(async () => {
  const mod = await import('solana-wallets-vue')
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (mod as any).WalletMultiButton
})

const { fetchTokenBalance, connected, userStakeInformation, getUserStakeInformation } = useGovernance()

const visibleStake = ref(false)

const openStakeModal = () => {
  visibleStake.value = true
  fetchTokenBalance()
  if (userStakeInformation.value == null) {
    getUserStakeInformation()
  }
}

// const { $toast } = useNuxtApp()

// --- STATE ---
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const proposals = ref<any[]>([])
const isLoading = ref(true)
// const selected = ref(null)

// const selectedProposal = ref<any | null>(null)
// const visibleCreateProposal = ref(false)

// const visibleProposalDetail = ref(false)
const showWalletModal = ref(false)

// Get governance composable (includes workspace internally)
// const { workspace, fetchUserStakeInfo } = useGovernance()

// Reactive refs from workspace
// const connected = computed(() => workspace?.connected?.value || false)
// const publicKey = computed(() => workspace?.publicKey?.value)
// const program = computed(() => workspace?.program?.value)

// --- LIFECYCLE HOOK ---
// onMounted(async () => {
//   // Workspace is now handled internally by useGovernance
//   // Fetch proposals when program is ready
//   // if (program.value) {
//   //   console.log("proposal, mounted, fetchProposalsData");
//   //   await fetchProposalsData();
//   // }
// });

// Watch for program changes
// watch(
//   () => program.value,
//   (prog) => {
//     if (prog) {
//       console.log('proposal, watch, fetchProposalsData')
//       fetchProposalsData()
//     }
//   },
//   { immediate: true },
// )

// --- DATA FETCHING ---
// const fetchProposalsData = async () => {
//   if (!program.value) return
//   isLoading.value = true
//   try {
//     console.log('function fetchProposalsData')
//     proposals.value = await governance.fetchLatestProposals()
//   }
//   finally {
//     isLoading.value = false
//   }
// }

// // --- WALLET MODAL HANDLERS ---
// const handleWalletRequired = async () => {
//   showWalletModal.value = true
// }

// // ---Request to release fund after proposal passed ---
// const handleRequestFund = async (proposal: unknown) => {
//   // Show wallet modal if not connected
//   if (!connected.value) {
//     showWalletModal.value = true
//     return
//   }

//   try {
//     const { PublicKey } = await import('@solana/web3.js')
//     const proposalPubkey = new PublicKey(proposal.publicKey)

//     await governance.requestFund(proposalPubkey)

//     // Show success message
//     $toast.success(`Request submitted successfully!`)

//     // Close the proposal detail modal
//     visibleProposalDetail.value = false
//     selectedProposal.value = null
//   }
//   catch (e) {
//     console.error('Request failed:', e)
//     // eslint-disable-next-line @typescript-eslint/no-explicit-any
//     $toast.error((e as any).message || 'Failed to submit request')
//   }
// }

// // --- WATCHER ---

// // Watch wallet connection changes
// watch(
//   () => connected.value,
//   (isConnected) => {
//     if (isConnected) {
//       showWalletModal.value = false
//       // Fetch user stake info when wallet connects
//       console.log('proposal, watch, fetchUserStakeInfo')
//       fetchUserStakeInfo()
//     }
//   },
//   { immediate: true },
// )

// // --- HANDLERS ---
// // eslint-disable-next-line @typescript-eslint/no-explicit-any
// const handleProposalClick = (proposal: any) => {
//   selectedProposal.value = proposal
//   visibleProposalDetail.value = true
// }

// const handleProposalCreated = async () => {
//   visibleCreateProposal.value = false
//   // Refresh the list to show the new proposal
//   await fetchProposalsData()

//   // Wait a bit for blockchain to update, then refresh rewards
//   setTimeout(async () => {
//     // Refresh user stake info to show updated rewards
//     await fetchUserStakeInfo()

//     // Refresh governance stats
//     if (import.meta.client) {
//       const win = window as Window & {
//         __refreshGovernanceStats?: () => Promise<void>
//       }
//       if (win.__refreshGovernanceStats) {
//         await win.__refreshGovernanceStats()
//       }
//     }
//   }, 1500)
// }

// const handleVote = async ({
//   proposal,
//   agree,
// }: {
//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   proposal: any
//   agree: boolean
// }) => {
//   // Show wallet modal if not connected
//   if (!connected.value) {
//     showWalletModal.value = true
//     return
//   }

//   try {
//     if (!program.value || !publicKey.value) {
//       $toast.error('Please connect your wallet to vote')
//       return
//     }

//     const { PublicKey } = await import('@solana/web3.js')
//     const proposalPubkey = new PublicKey(proposal.publicKey)

//     // Get user's vote power before voting
//     const { calculateVotePower } = useGovernance()
//     const votePower = await calculateVotePower()

//     // Calculate reward (1% of vote power)
//     const reward = votePower * 0.01

//     await governance.vote(proposalPubkey, agree)

//     // Show success message with reward info
//     $toast.success(
//       `Vote ${agree ? 'for' : 'against'} submitted successfully! 🎉\n`
//       + `You earned ${reward.toFixed(2)} $GET as reward! 💰`,
//       { duration: 5000 },
//     )

//     // Close the proposal detail modal
//     visibleProposalDetail.value = false
//     selectedProposal.value = null

//     // Refresh proposals to show updated vote counts
//     await fetchProposalsData()

//     // Wait a bit for blockchain to update, then refresh rewards
//     setTimeout(async () => {
//       // Refresh user stake info to show updated rewards
//       await fetchUserStakeInfo()

//       // Refresh governance stats
//       if (import.meta.client) {
//         const win = window as Window & {
//           __refreshGovernanceStats?: () => Promise<void>
//         }
//         if (win.__refreshGovernanceStats) {
//           await win.__refreshGovernanceStats()
//         }
//       }
//     }, 1500)
//   }
//   catch (e) {
//     console.error('Vote failed:', e)
//     // eslint-disable-next-line @typescript-eslint/no-explicit-any
//     $toast.error((e as any).message || 'Failed to submit vote')
//   }
// }

// const handleProposalDeleted = async () => {
//   // Close the proposal detail modal
//   visibleProposalDetail.value = false
//   selectedProposal.value = null

//   // Refresh the proposals list when a proposal is deleted
//   await fetchProposalsData()

//   // Wait a bit for blockchain to update, then refresh rewards
//   // (Deleting a proposal may reduce rewards if they were given for creating it)
//   setTimeout(async () => {
//     // Refresh user stake info to show updated rewards
//     await fetchUserStakeInfo()

//     // Refresh governance stats
//     if (import.meta.client) {
//       const win = window as Window & {
//         __refreshGovernanceStats?: () => Promise<void>
//       }
//       if (win.__refreshGovernanceStats) {
//         await win.__refreshGovernanceStats()
//       }
//     }
//   }, 1500)
// }
</script>

<style>
.proposals-header {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  width: 100%;
}

.proposals-title {
  text-align: center;
  flex: 1;
}

.wallet-button-container {
  position: absolute;
  right: 0;
  display: flex;
  align-items: center;
  gap: 12px;
}

.rewards-badge {
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.rotating {
  animation: rotate 1s linear infinite;
}

@media only screen and (max-width: 600px) {
  .proposals-header {
    flex-direction: column;
    gap: 1rem;
  }

  .wallet-button-container {
    position: static;
    flex-direction: column;
  }
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

.wallet-connection-container {
  display: flex;
  justify-content: center;
}
</style>
