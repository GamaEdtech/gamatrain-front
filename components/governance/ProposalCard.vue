<template>
  <div
    class="proposal-card"
    @click="handleClick()"
  >
    <div class="governance-proposals__badge active">
      Active
    </div>

    <div class="governance-proposals__title primary-gray-700">
      Increase Block Rewards by 15%
    </div>

    <div class="governance-proposals__subtitle primary-gray-500 mt-2">
      Proposal to increase mining rewards to improve network security and
      incentivize more validators.
    </div>

    <div>
      <div class="vote-row">
        <span class="for">⬆ For: 2,847 (70.3%)</span>
        <span class="against">⬇ Against: 1,203 (29.7%)</span>
      </div>

      <v-progress-linear
        model-value="70.3"
        color="#667085"
        height="8"
        class="vote-progress"
        rounded
      />

      <div class="governance-proposals__stats primary-gray-500">
        <span>Quorum: 75%</span>
        <span>4,050 Total Votes</span>
      </div>
    </div>

    <div class="governance-proposals__footer mt-3">
      <div class="time primary-gray-500">
        <span>
          <v-icon
            size="small"
            color="#98A2B3"
          >mdi-timer-outline</v-icon></span>
        <span class="pl-1">2 Days Remaining</span>
      </div>
      <div class="buttons">
        <v-btn
          size="small"
          prepend-icon="mdi-arrow-up-thin"
          color="green"
          variant="outlined primary-gray-500"
        >
          Vote For
        </v-btn>
        <v-btn
          size="small"
          prepend-icon="mdi-arrow-down-thin"
          color="red"
          variant="outlined primary-gray-500"
        >
          Vote Against
        </v-btn>
      </div>
    </div>
  </div>
</template>

<script setup>
const emits = defineEmits(['select'])

const handleClick = () => {
  emits('select', {})
}
</script>

<style lang="scss" scoped>
.proposal-card {
  border-radius: 16px;
  padding: 12px;
  position: relative;
  border: 2px solid #f2f4f7;
  cursor: pointer;

  &:hover {
    border-color: #f79009;
  }

  .governance-proposals__badge {
    position: absolute;
    top: -9px;
    right: 12px;
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

  .vote-row {
    display: flex;
    justify-content: space-between;
    font-size: 10px;
    margin-bottom: 6px;

    .for {
      color: #27ae60;
      font-weight: 600;
    }
    .against {
      color: #e74c3c;
      font-weight: 600;
    }
  }

  .vote-progress {
    margin-bottom: 10px;
  }

  .governance-proposals__stats {
    font-weight: 400;
    display: flex;
    justify-content: space-between;
    font-size: 10px;
    margin-bottom: 6px;
  }

  .governance-proposals__footer {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .time {
      font-size: 10px;
      display: flex;
      align-items: center;
    }

    .buttons {
      display: flex;
      gap: 4px;

      .v-btn {
        border-radius: 20px;
        font-weight: 600;
        text-transform: none;
      }
    }
  }
}
</style>
