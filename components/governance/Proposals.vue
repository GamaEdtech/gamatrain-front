<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<template>
  <div class="mt-10">
    <h1
      class="text-h4 text-md-h3 mb-md-4 font-weight-bold primary-gray-700 text-center"
    >
      Active Proposals
    </h1>

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
        <v-slide-group
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
        </v-slide-group>
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
      </ClientOnly>
      <ClientOnly>
        <v-btn
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
        </v-btn>
      </ClientOnly>
    </div>

    <!-- Dialogs -->
    <governance-creat-proposal
      v-model="visibleCreateProposal"
      @created="handleProposalCreated"
      @wallet-required="handleWalletRequired"
    />
    <governance-proposal-detail
      v-if="selectedProposal"
      v-model="visibleProposalDetail"
      :proposal="selectedProposal"
      :user-public-key="publicKey"
      @vote="({ agree }) => handleVote({ proposal: selectedProposal, agree })"
      @wallet-required="handleWalletRequired"
      @request-fund="handleRequestFund(selectedProposal)"
    />

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
import { ref, onMounted, watch, defineAsyncComponent } from 'vue'
import { useDisplay } from 'vuetify/lib/composables/display'
import { useWorkspace } from '~/composables/useWorkspace'
import { governance } from '~/composables/useGovernance'
import type { Program } from '@coral-xyz/anchor'
// Intentionally avoid calling useWallet() during SSR; we'll access it in onMounted

const { mdAndUp } = useDisplay()
const AsyncWalletMultiButton = defineAsyncComponent(async () => {
  const mod = await import('solana-wallets-vue')
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (mod as any).WalletMultiButton
})

const { $toast } = useNuxtApp()

// --- STATE ---
const program: Ref<Program | null> = ref(null)
const connected = ref(false)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const publicKey = ref<any | null>(null)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const proposals = ref<any[]>([])
const isLoading = ref(true)
const selected = ref(null)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const selectedProposal = ref<any | null>(null)
const visibleCreateProposal = ref(false)
const visibleProposalDetail = ref(false)
const showWalletModal = ref(false)

// --- LIFECYCLE HOOK ---
onMounted(async () => {
  const workspace = useWorkspace()
  if (!workspace) {
    console.error('❌ Workspace not available')
    return
  }

  // Force workspace initialization if not already done
  if (!workspace.connection.value && import.meta.client) {
    // Wait a bit for the DOM to be ready
    setTimeout(async () => {
      try {
        // Manually import and initialize wallet
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { useAnchorWallet, useWallet } = await import(
          'solana-wallets-vue'
        )
      }
      catch (error) {
        console.error('❌ Manual initialization failed:', error)
      }
    }, 500)
  }

  // Watch workspace state changes and update local state
  watch(
    () => workspace.connected.value,
    (val) => {
      connected.value = val
    },
    { immediate: true },
  )

  watch(
    () => workspace.publicKey.value,
    (pk) => {
      publicKey.value = pk
    },
    { immediate: true },
  )

  watch(
    () => workspace.program.value,
    (prog) => {
      program.value = prog as unknown as Program
    },
    { immediate: true },
  )
})

// --- DATA FETCHING ---
const fetchProposalsData = async () => {
  if (!program.value) return
  isLoading.value = true
  try {
    proposals.value = await governance.fetchLatestProposals(program.value)
  }
  finally {
    isLoading.value = false
  }
}

// --- WALLET MODAL HANDLERS ---
const handleWalletRequired = async () => {
  showWalletModal.value = true
}

// ---Request to release fund after proposal passed ---
const handleRequestFund = async (proposal: unknown) => {
// Show wallet modal if not connected
  if (!connected.value) {
    showWalletModal.value = true
    return
  }

  try {
    if (!program.value || !publicKey.value) {
      $toast.error('Please connect your wallet to request')
      return
    }

    const { PublicKey } = await import('@solana/web3.js')
    const proposalPubkey = new PublicKey(proposal.publicKey)

    await governance.requestFund(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      program.value as any,
      publicKey.value,
      proposalPubkey,
    )

    // Show success message
    $toast.success(`Request submitted successfully!`)

    // Close the proposal detail modal
    visibleProposalDetail.value = false
    selectedProposal.value = null
  }
  catch (e) {
    console.error('Request failed:', e)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    $toast.error((e as any).message || 'Failed to submit request')
  }
}

// --- WATCHER ---
// Always fetch proposals when program is available, regardless of wallet connection
watch(
  () => program.value,
  (prog) => {
    if (prog) {
      fetchProposalsData()
    }
  },
  { immediate: true },
)

// Watch wallet connection changes
watch(
  () => connected.value,
  (isConnected) => {
    if (isConnected) {
      showWalletModal.value = false
    }
  },
  { immediate: true },
)

// --- HANDLERS ---
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const handleProposalClick = (proposal: any) => {
  selectedProposal.value = proposal
  visibleProposalDetail.value = true
}

const handleProposalCreated = () => {
  visibleCreateProposal.value = false
  // Refresh the list to show the new proposal
  fetchProposalsData()
}

const handleVote = async ({
  proposal,
  agree,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  proposal: any
  agree: boolean
}) => {
  // Show wallet modal if not connected
  if (!connected.value) {
    showWalletModal.value = true
    return
  }

  try {
    if (!program.value || !publicKey.value) {
      $toast.error('Please connect your wallet to vote')
      return
    }

    const { PublicKey } = await import('@solana/web3.js')
    const proposalPubkey = new PublicKey(proposal.publicKey)

    await governance.vote(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      program.value as any,
      publicKey.value,
      proposalPubkey,
      agree,
    )

    // Show success message
    $toast.success(`Vote ${agree ? 'for' : 'against'} submitted successfully!`)

    // Close the proposal detail modal
    visibleProposalDetail.value = false
    selectedProposal.value = null

    // Refresh proposals to show updated vote counts
    await fetchProposalsData()
  }
  catch (e) {
    console.error('Vote failed:', e)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    $toast.error((e as any).message || 'Failed to submit vote')
  }
}

const handleProposalDeleted = () => {
  // Close the proposal detail modal
  visibleProposalDetail.value = false
  selectedProposal.value = null

  // Refresh the proposals list when a proposal is deleted
  fetchProposalsData()
}
</script>

<style>
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
