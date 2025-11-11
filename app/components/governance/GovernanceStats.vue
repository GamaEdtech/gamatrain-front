<template>
  <div class="governance-stats">
    <div class="stats-flex">
      <div
        v-for="(stat, index) in stats"
        :key="index"
        class="governance-stat-item"
      >
        <v-card class="stat-card" :class="stat.class" elevation="0">
          <div
            v-if="isLoading && stat.dynamic"
            class="d-flex justify-center align-center"
            style="height: 100%"
          >
            <v-progress-circular indeterminate color="primary" />
          </div>
          <div v-else>
            <div
              class="governance-stat-value primary-gray-700 text-h6 text-md-h5"
            >
              {{ stat.title }}
              <span class="unit primary-gray-500 text-subtitle-1">
                {{ stat.subtitle }}</span
              >
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
import { ref, onMounted, watch, computed } from "vue";
import { useWorkspace } from "~/composables/useWorkspace";
import { governance } from "~/composables/useGovernance";
// import type { Program } from '@coral-xyz/anchor'
import type { Ref } from "vue";

// --- STATE ---
const program: Ref<Program | null> = ref(null);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const wallet: Ref<any | null> = ref(null);
const isLoading = ref(true);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const allProposals = ref<any[]>([]);

// --- LIFECYCLE HOOK ---
onMounted(() => {
  // Only call useWorkspace when the component is mounted in the browser.
  const workspace = useWorkspace();

  // Watch workspace changes
  watch(
    () => workspace.program.value,
    (prog) => {
      program.value = prog;
    },
    { immediate: true }
  );

  watch(
    () => workspace.wallet.value,
    (w) => {
      wallet.value = w;
    },
    { immediate: true }
  );
});

// --- DATA FETCHING ---
const fetchStatsData = async () => {
  if (!program.value) return;
  isLoading.value = true;
  try {
    allProposals.value = await governance.fetchProposals(program.value);
  } finally {
    isLoading.value = false;
  }
};

// --- WATCHER ---
// Trigger data fetching when the user connects their wallet.
watch(
  () => wallet.value?.publicKey,
  (newPublicKey) => {
    if (newPublicKey) {
      fetchStatsData();
    } else {
      // Clear data and stop loading when wallet disconnects
      allProposals.value = [];
      isLoading.value = false;
    }
  },
  { deep: true }
);

// Also watch for program changes
watch(
  () => program.value,
  (prog) => {
    if (prog && wallet.value?.publicKey) {
      fetchStatsData();
    } else if (!prog) {
      allProposals.value = [];
      isLoading.value = false;
    }
  }
);

// --- COMPUTED PROPERTIES ---
const totalProposals = computed(() => allProposals.value.length);
const proposalsPassed = computed(
  () =>
    allProposals.value.filter(
      (p) => p.account.agreeVotes > p.account.disagreeVotes
    ).length
);

// User stake info
const userStakeInfo = ref<{ stakedAmount: number } | null>(null);

// Fetch user stake info
const fetchUserStakeInfo = async () => {
  if (!program.value || !wallet.value?.publicKey) return;

  try {
    const { getStakeAccount } = useGovernance();
    const info = await getStakeAccount(program.value, wallet.value.publicKey);
    userStakeInfo.value = info;
  } catch (error) {
    console.error("Failed to fetch user stake info:", error);
  }
};

// Watch for wallet changes to fetch stake info
watch(
  () => wallet.value?.publicKey,
  (newPublicKey) => {
    if (newPublicKey && program.value) {
      fetchUserStakeInfo();
    }
  },
  { deep: true }
);

const stats = computed(() => [
  {
    title: "2.1M",
    subtitle: "$GET",
    value: "Treasury Balance",
    class: "tl",
    dynamic: false,
  },
  {
    title: userStakeInfo.value
      ? userStakeInfo.value.stakedAmount.toLocaleString()
      : "0",
    subtitle: "$GET",
    value: "Your Staked",
    class: "tr",
    dynamic: true,
  },
  {
    title: totalProposals.value,
    subtitle: "",
    value: "Total Proposals",
    class: "bl",
    dynamic: true,
  },
  {
    title: "N/A",
    subtitle: "",
    value: "Active Voters",
    class: "br",
    dynamic: false,
  },
  {
    title: proposalsPassed.value,
    subtitle: "",
    value: "Proposals Passed",
    class: "last",
    dynamic: true,
  },
]);
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
