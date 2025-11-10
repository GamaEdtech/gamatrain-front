<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<template>
  <div>
    <v-dialog
      v-model="visible"
      max-width="480"
      :fullscreen="!smAndUp"
      @after-leave="handleClose"
    >
      <template #default="{ isActive }">
        <v-card>
          <div class="d-flex justify-space-between px-4 pt-4">
            <v-chip
              :color="proposalStatus.color"
              variant="flat"
              density="compact"
              class="text-capitalize font-weight-bold text-h6 "
            >
              {{ proposalStatus.title }}
            </v-chip>
            <v-btn
              class="d-flex justify-end"
              variant="plain"
              icon="md:close"
              @click="isActive.value = false"
            />
          </div>

          <v-card-text>
            <governance-proposal-details-content
              :proposal="proposal"
              :for-percentage="forPercentage"
              :is-expired="isExpired"
              :total-votes="totalVotes"
              :user-public-key="userPublicKey"
              @vote="(payload) => emits('vote', payload)"
              @wallet-required="() => emits('walletRequired')"
              @request-fund="() => emits('requestFund')"
            />
          </v-card-text>
        </v-card>
      </template>
    </v-dialog>

    <v-bottom-sheet
      v-model="visibleBottomSheet"
      scrollable
    >
      <v-card
        class=" rounded-t-xl"
        max-height="600"
      >
        <v-card-text>
          <div class="d-flex justify-space-between align-center py-2">
            <v-chip
              :color="proposalStatus.color"
              variant="flat"
              density="compact"
              class="text-capitalize font-weight-bold text-h6 "
            >
              {{ proposalStatus.title }}
            </v-chip>
            <div class="">
              <v-btn
                class="d-flex justify-end "
                variant="plain"
                icon="md:close"
                @click="handleClose"
              />
            </div>
          </div>

          <governance-proposal-details-content
            :proposal="proposal"
            :for-percentage="forPercentage"
            :is-expired="isExpired"
            :total-votes="totalVotes"
            :user-public-key="userPublicKey"
            @vote="(payload) => emits('vote', payload)"
            @wallet-required="() => emits('walletRequired')"
            @request-fund="() => emits('requestFund')"
          />
        </v-card-text>
      </v-card>
    </v-bottom-sheet>
  </div>
</template>

<script setup lang="ts">
import { useDisplay } from 'vuetify'

const BN = ref<unknown>(null)

onMounted(async () => {
  if (import.meta.client) {
    const anchor = await import('@coral-xyz/anchor')
    BN.value = anchor.BN
  }
})
const { smAndUp } = useDisplay()
const { isProposalExpired } = useGovernance()

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
  proposal: {
    type: Object,
    default: null,
  },
  userPublicKey: {
    type: Object,
    default: null,
  },
})

// Computed properties
const isExpired = computed(() => {
  if (!props.proposal?.account?.expiresAt) return false
  return isProposalExpired(props.proposal.account)
})

const totalVotes = computed(() => {
  if (!props.proposal?.account) return new BN(0)
  const agreeVotes = props.proposal.account.agreeVotes || new BN(0)
  const disagreeVotes = props.proposal.account.disagreeVotes || new BN(0)
  return agreeVotes.add(disagreeVotes)
})

const emits = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'vote', payload: { agree: boolean }): void
  (e: 'walletRequired' | 'requestFund'): void
}>()

const visible = ref(false)
const visibleBottomSheet = ref(false)

const forPercentage = computed(() => {
  const totalVotesNum = totalVotes.value.toNumber()
  if (totalVotesNum === 0) return 0
  const agreeVotes = props.proposal?.account?.agreeVotes || new BN(0)
  return Math.round((agreeVotes.toNumber() / totalVotesNum) * 100)
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

// Watchers - simplified approach
watch(
  () => props.modelValue,
  (val: boolean) => {
    if (smAndUp.value) {
      visible.value = val
    }
    else {
      visibleBottomSheet.value = val
    }
  },
  { immediate: true },
)

// Emit updates when visibility changes
watch([visible, visibleBottomSheet], ([dialogVisible, sheetVisible]) => {
  const isVisible = smAndUp.value ? dialogVisible : sheetVisible
  emits('update:modelValue', isVisible)
})

const handleClose = () => {
  visible.value = false
  visibleBottomSheet.value = false
  emits('update:modelValue', false)
}
</script>
