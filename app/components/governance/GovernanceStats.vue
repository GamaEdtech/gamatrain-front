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
            v-if="stat.loading && stat.dynamic"
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
              {{ $numberFormat(Math.ceil(stat.title ?? 0)) }}
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
import { useGovernance } from '~/composables/governance/useGovernance'

const statsKey = ref(0)
// Stats from blockchain
// const blockchainStats = ref<{
//   totalProposals: number
//   activeVoters: number
//   proposalsPassed: number
//   treasuryBalance: number
//   totalStaked: number
//   totalRewards: number
// } | null>(null)

const { userStakeInformation, loadingStakeInformation } = useGovernance()

// const stats = computed(() => {
//   // Force re-computation by accessing statsKey
//   const _ = statsKey.value

//   return [
//     {
//       title: blockchainStats.value?.treasuryBalance || '0',
//       subtitle: '$GET',
//       value: 'Treasury Balance',
//       class: 'tl',
//       dynamic: true,
//     },
//     {
//       title: userStakedAmount.value,
//       subtitle: '$GET',
//       value: 'Your Staked',
//       class: 'tr',
//       dynamic: true,
//     },
//     {
//       title: blockchainStats.value?.totalProposals || 0,
//       subtitle: '',
//       value: 'Total Proposals',
//       class: 'bl',
//       dynamic: true,
//     },
//     {
//       title: blockchainStats.value?.activeVoters || 'N/A',
//       subtitle: '',
//       value: 'Active Voters',
//       class: 'br',
//       dynamic: true,
//     },
//     {
//       title: blockchainStats.value?.totalRewards || 'N/A',
//       subtitle: '',
//       value: 'Total Rewards',
//       class: 'br',
//       dynamic: true,
//     },
//     {
//       title: userPendingRewards.value,
//       subtitle: '$GET',
//       value: 'Your Rewards',
//       class: 'last',
//       dynamic: true,
//     },
//   ]
// })
const stats = computed(() => {
  // Force re-computation by accessing statsKey
  const _ = statsKey.value

  return [
    {
      title: 0,
      subtitle: '$GET',
      value: 'Treasury Balance',
      class: 'tl',
      dynamic: true,
      loading: true,
    },
    {
      title: userStakeInformation.value?.stakedAmount,
      subtitle: '$GET',
      value: 'Your Staked',
      class: 'tr',
      dynamic: true,
      loading: loadingStakeInformation.value,
    },
    {
      title: 0,
      subtitle: '',
      value: 'Total Proposals',
      class: 'bl',
      dynamic: true,
      loading: true,
    },
    {
      title: 0,
      subtitle: '',
      value: 'Active Voters',
      class: 'br',
      dynamic: true,
      loading: true,
    },
    {
      title: 0,
      subtitle: '',
      value: 'Total Rewards',
      class: 'br',
      dynamic: true,
      loading: true,
    },
    {
      title: 0,
      subtitle: '$GET',
      value: 'Your Rewards',
      class: 'last',
      dynamic: true,
      loading: true,
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
