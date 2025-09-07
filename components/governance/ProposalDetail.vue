<template>
  <div>
    <v-dialog
      v-model="visible"
      max-width="480"
      :fullscreen="!smAndUp"
      @after-leave="handleAfterLeave"
    >
      <template #default="{ isActive }">
        <v-card>
          <div class="px-4 py-4">
            <div
              class="d-flex justify-end cursor-pointer"
              @click="isActive.value = false"
            >
              <v-icon color="#D0D5DD">
                mdi-close
              </v-icon>
            </div>
          </div>

          <v-card-text>
            <div class="governance-proposals__badge active">
              Active
            </div>

            <div class="governance-proposals__title primary-gray-700">
              Increase Block Rewards by 15%
            </div>

            <div
              class="governance-proposals__subtitle primary-gray-500 mt-2 mb-10"
            >
              Proposal to increase mining rewards to improve network security
              and incentivize more validators.Proposal to increase mining
              rewards to improve network security and incentivize more
              validators.Proposal to increase mining rewards to improve network
              security and incentivize more validators.Proposal to increase
              mining rewards to improve network security and incentivize more
              validators.
            </div>

            <v-progress-linear
              model-value="70.3"
              color="#667085"
              height="8"
              class="vote-progress"
              rounded
            />

            <div class="governance-proposals__stats primary-gray-500">
              <span><span class="font-weight-bold text-black">75%</span> Quorum
              </span>
              <span>
                <span class="font-weight-bold text-black">4,050</span> Total
                Votes</span>
            </div>

            <div
              class="d-flex flex-wrap align-center governance-proposals__values mt-7"
            >
              <div class="time primary-gray-500 w-50 mb-3">
                <v-icon color="#98A2B3">
                  mdi-account
                </v-icon>
                <span class="font-weight-bold text-black pl-1">0X12...9F</span>
                Proposal Creator
              </div>
              <div class="time primary-gray-500 w-50 mb-3">
                <v-icon color="#98A2B3">
                  mdi-calendar-minus-outline
                </v-icon>
                <span class="font-weight-bold text-black pl-1">02/02/2025</span>
                Created on
              </div>
              <div class="time primary-gray-500 w-50 mb-3">
                <v-icon color="#98A2B3">
                  mdi-timer-outline
                </v-icon>
                <span class="font-weight-bold text-black pl-1">2 Days</span>
                Remaining
              </div>
            </div>

            <div class="d-flex mt-7">
              <v-btn
                size="large"
                prepend-icon="mdi-arrow-up-thin"
                color="green"
                rounded
                class="w-50"
                variant="flat"
              >
                Vote For
              </v-btn>
              <v-btn
                size="large"
                prepend-icon="mdi-arrow-down-thin"
                color="red"
                rounded
                class="ml-3 w-50"
                variant="flat"
              >
                Vote Against
              </v-btn>
            </div>
          </v-card-text>
        </v-card>
      </template>
    </v-dialog>

    <v-bottom-sheet
      v-model="visibleBottomSheet"
      scrollable
    >
      <v-card class="detail-bottom-sheet">
        <v-card-text>
          <div class="d-flex justify-space-between align-center py-2">
            <div class="governance-proposals__badge active">
              Active
            </div>
            <div class="">
              <div
                class="d-flex justify-end cursor-pointer"
                @click="handleClose"
              >
                <v-icon color="#98A2B3">
                  mdi-close
                </v-icon>
              </div>
            </div>
          </div>

          <div class="governance-proposals__title primary-gray-700">
            Increase Block Rewards by 15%
          </div>

          <div
            class="governance-proposals__subtitle primary-gray-500 mt-2 mb-10"
          >
            Proposal to increase mining rewards to improve network security and
            incentivize more validators.Proposal to increase mining rewards to
            improve network security and incentivize more validators.Proposal to
            increase mining rewards to improve network security and incentivize
            more validators.Proposal to increase mining rewards to improve
            network security and incentivize more validators.
          </div>

          <v-progress-linear
            model-value="70.3"
            color="#667085"
            height="8"
            class="vote-progress"
            rounded
          />

          <div class="governance-proposals__stats primary-gray-500">
            <span><span class="font-weight-bold text-black">75%</span> Quorum
            </span>
            <span>
              <span class="font-weight-bold text-black">4,050</span> Total
              Votes</span>
          </div>

          <div
            class="d-flex flex-wrap align-center governance-proposals__values mt-7"
          >
            <div class="time primary-gray-500 w-50 mb-3 line-clamp-1">
              <v-icon color="#98A2B3">
                mdi-account
              </v-icon>
              <span class="font-weight-bold text-black pl-1">0X12...9F</span>
              Proposal Creator
            </div>
            <div class="time primary-gray-500 w-50 mb-3 line-clamp-1">
              <v-icon color="#98A2B3">
                mdi-calendar-minus-outline
              </v-icon>
              <span class="font-weight-bold text-black pl-1">02/02/2025</span>
              Created on
            </div>
            <div class="time primary-gray-500 w-50 mb-3 line-clamp-1">
              <v-icon color="#98A2B3">
                mdi-timer-outline
              </v-icon>
              <span class="font-weight-bold text-black pl-1">2 Days</span>
              Remaining
            </div>
          </div>

          <div class="d-flex mt-7">
            <v-btn
              size="large"
              prepend-icon="mdi-arrow-up-thin"
              color="green"
              rounded
              class="w-50"
              variant="flat"
            >
              Vote For
            </v-btn>
            <v-btn
              size="large"
              prepend-icon="mdi-arrow-down-thin"
              color="red"
              rounded
              class="ml-3 w-50"
              variant="flat"
            >
              Vote Against
            </v-btn>
          </div>
        </v-card-text>
      </v-card>
    </v-bottom-sheet>
  </div>
</template>

<script setup lang="ts">
import { useDisplay } from 'vuetify'

const { smAndUp } = useDisplay()
const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
})
const emits = defineEmits(['update:modelValue'])
const visible = ref(props.modelValue)
const visibleBottomSheet = ref(false)

watch(
  () => props.modelValue,
  (val) => {
    if (!smAndUp.value) {
      visibleBottomSheet.value = val
    }
    else {
      visible.value = val
    }
  },
)

const handleClose = () => {
  visibleBottomSheet.value = false
  emits('update:modelValue', false)
}
const handleAfterLeave = () => {
  emits('update:modelValue', false)
}
</script>

<style scoped>
.detail-bottom-sheet {
  height: 600px;
  max-height: 600px;
  border-radius: 24px 24px 0 0 !important;
  overflow-y: hidden !important;
}
.governance-proposals__values {
  font-size: 12px;
}
.governance-proposals__badge {
  display: inline-block;

  color: white;
  font-size: 12px;
  font-weight: 600;
  padding: 2px 10px;
  border-radius: 12px;
}
.governance-proposals__badge.active {
  background: #27ae60;
}
.governance-proposals__badge.pending {
  background: #f79009;
}
.governance-proposals__badge.rejected {
  background: #f04438;
}
.governance-proposals__badge.passed {
  background: #2e90fa;
}

.governance-proposals__title {
  font-size: 16px;
  font-weight: 699;
  margin-top: 8px;
}

.governance-proposals__subtitle {
  font-size: 12px;
  margin-bottom: 12px;
}

.vote-progress {
  margin-bottom: 10px;
}

.governance-proposals__stats {
  font-weight: 400;
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  margin-bottom: 6px;
}
</style>
