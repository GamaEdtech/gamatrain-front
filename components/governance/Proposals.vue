<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<template>
  <div class="mt-10">
    <ClientOnly>
      <div class="wallet-connection-container">
        <AsyncWalletMultiButton />
      </div>
    </ClientOnly>
    <h1 class="text-h4 text-md-h3 mb-md-4 font-weight-bold primary-gray-700 text-center">
      Active Proposals
    </h1>

    <!-- 1. State: Wallet not connected -->
    <div
      v-if="!connected"
      class="text-center my-10"
    >
      <p>Please connect your wallet to see active proposals.</p>
    </div>

    <!-- 2. State: Loading proposals -->
    <div
      v-else-if="isLoading"
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

    <!-- 3. State: No proposals found -->
    <div
      v-else-if="proposals.length === 0"
      class="text-center my-10"
    >
      <p>No active proposals found. Be the first to create one!</p>
    </div>

    <!-- 4. State: Display proposals -->
    <div
      v-else
      class="mt-6 mt-sm-1"
    >
      <div class="d-none d-sm-block">
        <v-slide-group
          v-model="selected"
          class="center-slide-group"
          :show-arrows="false"
          center-active
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
              />
            </div>
          </v-slide-group-item>
        </v-slide-group>
      </div>
      <div class="d-block d-sm-none">
        <div
          v-for="proposal in proposals"
          :key="proposal.publicKey.toBase58()"
          class="mb-4"
        >
          <governance-proposal-card
            :proposal="proposal"
            :user-public-key="publicKey"
            @select="handleProposalClick"
            @vote="handleVote"
            @delete="handleProposalDeleted"
          />
        </div>
      </div>
    </div>

    <!-- Buttons -->
    <div class="mt-10 d-flex justify-center">
      <ClientOnly>
        <v-btn
          :size="isMdAndUp ? 'large' : 'default'"
          color="#344054"
          variant="text"
          rounded
        >
          See more
        </v-btn>
      </ClientOnly>
      <ClientOnly>
        <v-btn
          :size="isMdAndUp ? 'large' : 'default'"
          color="#1D2939"
          variant="flat"
          rounded
          class="ml-3"
          :disabled="!canCreateProposal"
          @click="visibleCreateProposal = true"
        >
          Create Proposal
        </v-btn>
      </ClientOnly>
    </div>

    <!-- Dialogs -->
    <governance-creat-proposal
      v-model="visibleCreateProposal"
      @created="handleProposalCreated"
    />
    <governance-proposal-detail
      v-if="selectedProposal"
      v-model="visibleProposalDetail"
      :proposal="selectedProposal"
      :user-public-key="publicKey"
      @vote="({ agree }) => handleVote({ proposal: selectedProposal, agree })"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed, defineAsyncComponent } from 'vue'
import { useDisplay } from 'vuetify/lib/composables/display'
import { useWorkspace } from '~/composables/useWorkspace'
import { governance } from '~/composables/useGovernance'
import type { Program } from '@coral-xyz/anchor'
import type { Ref } from 'vue'
// Intentionally avoid calling useWallet() during SSR; we'll access it in onMounted

const display = useDisplay()
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isMdAndUp = computed(() => (display as any)?.mdAndUp?.value ?? false)
const AsyncWalletMultiButton = defineAsyncComponent(async () => {
  const mod = await import('solana-wallets-vue')
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (mod as any).WalletMultiButton
})

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
        const { useAnchorWallet, useWallet } = await import('solana-wallets-vue')
      }
      catch (error) {
        console.error('❌ Manual initialization failed:', error)
      }
    }, 500)
  }

  // Watch workspace state changes and update local state
  watch(() => workspace.connected.value, (val) => {
    connected.value = val
  }, { immediate: true })

  watch(() => workspace.publicKey.value, (pk) => {
    publicKey.value = pk
  }, { immediate: true })

  watch(() => workspace.program.value, (prog) => {
    program.value = prog as unknown as Program
  }, { immediate: true })
})

// --- DATA FETCHING ---
const fetchProposalsData = async () => {
  if (!program.value) return
  isLoading.value = true
  try {
    proposals.value = await governance.fetchProposals(program.value)
  }
  finally {
    isLoading.value = false
  }
}

// --- COMPUTED ---
const canCreateProposal = computed(() => {
  return connected.value && publicKey.value && program.value
})

// --- WATCHER ---
watch(() => publicKey.value, (newPublicKey) => {
  if (newPublicKey) {
    fetchProposalsData()
  }
  else {
    proposals.value = [] // Clear proposals on disconnect
    isLoading.value = false // Stop loading when disconnected
  }
}, { deep: true })

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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const handleVote = async ({ proposal, agree }: { proposal: any, agree: boolean }) => {
  try {
    if (!program.value || !publicKey.value) {
      const { $toast } = useNuxtApp()
      $toast.error('Please connect your wallet to vote')
      return
    }

    const { PublicKey } = await import('@solana/web3.js')
    const proposalPubkey = new PublicKey(proposal.publicKey)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await governance.vote(program.value as any, publicKey.value, proposalPubkey, agree)

    // Show success message
    const { $toast } = useNuxtApp()
    $toast.success(`Vote ${agree ? 'for' : 'against'} submitted successfully!`)

    // Close the proposal detail modal
    visibleProposalDetail.value = false
    selectedProposal.value = null

    // Refresh proposals to show updated vote counts
    await fetchProposalsData()
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  catch (e: any) {
    console.error('Vote failed:', e)
    const { $toast } = useNuxtApp()
    $toast.error(e.message || 'Failed to submit vote')
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

<style scoped>
.proposal-slide__card {
  width: 310px;
}
</style>
