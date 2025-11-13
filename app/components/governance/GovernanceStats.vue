<template>
  <div
    :key="statsKey"
    class="governance-stats"
  >
    <div class="stats-flex">
      <div
        v-for="(stat, index) in stats"
        :key="index"
        class="governance-stat-item"
      >
        <v-card
          class="stat-card"
          :class="stat.class"
          elevation="0"
        >
          <div
            v-if="isLoading && stat.dynamic"
            class="d-flex justify-center align-center"
            style="height: 100%"
          >
            <v-progress-circular
              indeterminate
              color="primary"
            />
          </div>
          <div v-else>
            <div
              class="governance-stat-value primary-gray-700 text-h6 text-md-h5"
            >
              {{ stat.title }}
              <span class="unit primary-gray-500 text-subtitle-1">
                {{ stat.subtitle }}</span>
            </div>
            <div
              class="governance-stat-label primary-gray-500 text-subtitle-2 text-md-h6"
            >
              {{ stat.value }}
            </div>
          </div>
        </v-card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed, nextTick, triggerRef } from 'vue'
import { useWorkspace } from '~/composables/useWorkspace'
import { governance } from '~/composables/useGovernance'
import type { Ref } from 'vue'

// --- STATE ---
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const program: Ref<any | null> = ref(null)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const wallet: Ref<any | null> = ref(null)
const isLoading = ref(true)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const allProposals = ref<any[]>([])
const userStakeInfo = ref<{ stakedAmount: number } | null>(null)
const userStakedAmount = ref<number>(0)

// Create a reactive key to force re-render
const statsKey = ref(0)
const forceRefresh = () => {
  statsKey.value++
}
const treasuryBalance = ref<number>(0)

// Get workspace
const workspace = useWorkspace()

// Expose refresh method for external use
const refreshStats = async () => {
  console.log('🔄 Refreshing governance stats...')
  await fetchStatsData()
  console.log(
    '✅ Stats refreshed. New stake:',
    userStakeInfo.value?.stakedAmount,
  )
}

// Make it available globally via provide/inject or window
if (import.meta.client) {
  const win = window as Window & {
    __refreshGovernanceStats?: () => Promise<void>
  }
  win.__refreshGovernanceStats = refreshStats

  // Also listen to custom event
  const nuxtApp = useNuxtApp()
  nuxtApp.hook('governance:refresh', refreshStats)
}

defineExpose({
  refreshStats,
})

// --- LIFECYCLE HOOK ---
onMounted(() => {
  // Watch workspace changes
  watch(
    () => workspace.program.value,
    (prog) => {
      program.value = prog
    },
    { immediate: true },
  )

  watch(
    () => workspace.wallet.value,
    (w) => {
      wallet.value = w
    },
    { immediate: true },
  )
})

// --- DATA FETCHING ---
const fetchStatsData = async () => {
  if (!program.value) return
  isLoading.value = true
  try {
    allProposals.value = await governance.fetchProposals(program.value)
    await fetchTreasuryBalance()
    // Also fetch user stake if wallet is connected
    const userPk = workspace.publicKey?.value
    if (userPk) {
      await fetchUserStakeInfo()
    }
  }
  finally {
    isLoading.value = false
  }
}

// --- WATCHER ---
// Fetch public data when program is ready (no wallet needed)
watch(
  () => program.value,
  (prog) => {
    if (prog) {
      fetchStatsData()
    }
    else {
      allProposals.value = []
      treasuryBalance.value = 0
      isLoading.value = false
    }
  },
  { immediate: true },
)

// Fetch user-specific data when wallet connects
watch(
  () => workspace.publicKey?.value,
  (newPublicKey) => {
    if (newPublicKey && workspace.program?.value) {
      fetchUserStakeInfo()
    }
    else {
      userStakeInfo.value = null
    }
  },
  { deep: true, immediate: true },
)

// --- COMPUTED PROPERTIES ---
const totalProposals = computed(() => allProposals.value.length)
const proposalsPassed = computed(
  () =>
    allProposals.value.filter(
      p => p.account.agreeVotes > p.account.disagreeVotes,
    ).length,
)

// Fetch treasury balance (vault balance)
const fetchTreasuryBalance = async () => {
  if (!program.value) return

  try {
    const { getVaultAddress } = await import('~/composables/useGovernance')
    const { PublicKey } = await import('@solana/web3.js')
    const { getAssociatedTokenAddress } = await import('@solana/spl-token')
    const { getTokenMint, getTokenProgramId } = await import('~/composables/useGovernance')

    const vaultAddressStr = await getVaultAddress()
    const vaultAddress = new PublicKey(vaultAddressStr)
    const tokenMint = new PublicKey(getTokenMint())
    const TOKEN_2022_PROGRAM_ID = new PublicKey(getTokenProgramId())

    const vaultTokenAccount = await getAssociatedTokenAddress(
      tokenMint,
      vaultAddress,
      true,
      TOKEN_2022_PROGRAM_ID,
    )

    const connection = program.value.provider.connection
    const accountInfo = await connection.getTokenAccountBalance(
      vaultTokenAccount,
    )

    treasuryBalance.value = accountInfo.value.uiAmount || 0
  }
  catch (error) {
    console.error('Failed to fetch treasury balance:', error)
    treasuryBalance.value = 0
  }
}

// Fetch user stake info
const fetchUserStakeInfo = async () => {
  const userPk = workspace.publicKey?.value
  const prog = workspace.program?.value

  if (!prog || !userPk) return

  try {
    const { getStakeAccount } = useGovernance()
    const info = await getStakeAccount(prog, userPk)
    console.log('📊 Fetched stake info:', {
      stakedAmount: info?.stakedAmount,
      pendingUnstake: info?.pendingUnstake,
    })

    // Force reactivity by creating a new object
    userStakeInfo.value = info ? { ...info } : null
    userStakedAmount.value = info?.stakedAmount || 0

    // Force Vue to detect the change
    triggerRef(userStakedAmount)
    forceRefresh()

    // Force Vue to update
    await nextTick()

    console.log('💡 userStakedAmount updated to:', userStakedAmount.value)
  }
  catch (error) {
    console.error('Failed to fetch user stake info:', error)
  }
}

const stats = computed(() => {
  // Force re-computation by accessing statsKey
  const _ = statsKey.value

  return [
    {
      title: treasuryBalance.value
        ? treasuryBalance.value.toLocaleString()
        : '0',
      subtitle: '$GET',
      value: 'Treasury Balance',
      class: 'tl',
      dynamic: true,
    },
    {
      title: userStakedAmount.value.toLocaleString(),
      subtitle: '$GET',
      value: 'Your Staked',
      class: 'tr',
      dynamic: true,
    },
    {
      title: totalProposals.value,
      subtitle: '',
      value: 'Total Proposals',
      class: 'bl',
      dynamic: true,
    },
    {
      title: 'N/A',
      subtitle: '',
      value: 'Active Voters',
      class: 'br',
      dynamic: false,
    },
    {
      title: proposalsPassed.value,
      subtitle: '',
      value: 'Proposals Passed',
      class: 'last',
      dynamic: true,
    },
  ]
})
</script>

<style scoped>
.governance-stats {
  margin-top: -7rem;
  margin-bottom: 2rem;
}

.stats-flex {
  display: flex;
  width: 100%;
}

.governance-stat-item {
  flex: 1;
  min-width: 0;
}

.stat-card {
  background: linear-gradient(113.59deg, #ffffff 0%, #f9fafb 100%);
  border: 1px solid rgba(22, 44, 45, 0.06);
  box-shadow: 0 1px 2px rgba(16, 24, 40, 0.04);
  padding: 15px 24px;
  text-align: center;
  height: 100%;
}

.stat-card .governance-stat-value {
  color: #0f172a;
  font-weight: 800;
  font-size: 44px;
  line-height: 1.2;
}

.stat-card .unit {
  font-weight: 700;
  font-size: 18px;
}

.stat-card .governance-stat-label {
  margin-top: 6px;
}

.stat-card.tl {
  border-radius: 34px 0 0 0;
}

.stat-card.tr {
  border-radius: 0 34px 0 0;
}

.stat-card.bl {
  border-radius: 0 0 0 34px;
}

.stat-card.br {
  border-radius: 0 0 34px 0;
}

.stat-card.last {
  border-radius: 34px;
  width: 50%;
  margin: 0 auto;
}

.bottom-center {
  border-radius: 34px;
  width: 360px;
  max-width: 100%;
  margin-top: 16px;
}

@media only screen and (max-width: 599px) {
  .stats-flex {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0;
    width: 100%;
  }

  .governance-stat-item:last-child {
    grid-column: 1 / -1;
    display: flex;
    justify-content: center;
  }

  .stat-card {
    padding: 10px 16px;
  }

  .stat-card .governance-stat-value {
    font-size: 32px;
  }
}

@media only screen and (min-width: 600px) {
  .stat-card.tl {
    border-radius: 44px 0 0 44px;
  }

  .stat-card.tr,
  .stat-card.bl,
  .stat-card.br {
    border-radius: 0;
  }

  .stat-card.last {
    border-radius: 0 44px 44px 0;
    width: 100%;
    margin: auto;
  }
}

@media only screen and (min-width: 960px) {
  .governance-stats {
    margin-top: -7rem;
    margin-bottom: 2rem;
  }

  .stat-card {
    padding: 25px 24px;
  }

  .stat-card .governance-stat-value {
    font-size: 30px;
  }

  .stat-card.tl {
    border-radius: 44px 0 0 44px;
  }

  .stat-card.tr,
  .stat-card.bl,
  .stat-card.br {
    border-radius: 0;
  }

  .stat-card.last {
    border-radius: 0 44px 44px 0;
  }
}
</style>
