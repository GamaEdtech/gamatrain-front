<template>
  <div
    :class="`timeline-column position-relative d-flex flex-column align-center text-center h-100 ${
      !isLoading && timeline.length == 0 ? 'hide-line' : ''
    }`"
  >
    <div
      v-if="isLoading"
      class="d-flex flex-column align-center w-100"
    >
      <v-skeleton-loader
        v-for="(item, index) in 3"
        :key="index"
        class="time-line-box-skeleton"
        type="image"
      />
    </div>
    <div
      v-for="(yearData, yearIndex) in timeline"
      v-else
      :key="yearIndex"
      class="d-flex justify-center mb-6"
    >
      <div
        class="timeline-year"
        :style="{
          top: `${getMarkerPosition(yearData.positions[0], yearIndex)}px`,
        }"
      >
        {{ yearData.year }}
      </div>
      <div
        v-for="(month, monthIndex) in yearData.months"
        :key="monthIndex"
        class="timeline-box"
        :style="{
          top: `${getMarkerPosition(
            yearData.positions[monthIndex],
            yearIndex,
            monthIndex,
          )}px`,
        }"
      >
        {{ month }}
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  timeline: {
    type: Array,
    required: true,
  },
  isLoading: {
    type: Boolean,
    default: true,
  },
})

const getMarkerPosition = (itemIndex, yearIndex, monthIndex = 0) => {
  const heightSizeTableElement
    = window.innerWidth > 960 ? 52 : window.innerWidth > 768 ? 177.5 : 169
  const extraSizeForHeaderTable = yearIndex == 0 && monthIndex == 0 ? 0 : 56
  return itemIndex * heightSizeTableElement + extraSizeForHeaderTable
}
</script>

<style scoped>
.timeline-column::before {
  content: "";
  position: absolute;
  top: 28px;
  bottom: 0;
  left: 50%;
  width: 2px;
  background-color: #e4e7ec;
  transform: translateX(-50%);
  z-index: 0;
}
.hide-line::before {
  display: none;
}

.timeline-year {
  font-size: 12px;
  color: #98a2b3;
  background: #fff;
  position: absolute;
}
.timeline-year::after {
  content: "";
  position: absolute;
  bottom: -7px;
  left: 50%;
  transform: translateX(-50%);
  width: 7px;
  height: 7px;
  background-color: #e4e7ec;
  border-radius: 50%;
  z-index: 2;
}

.timeline-box {
  background-color: #f2f4f7;
  border-radius: 8px;
  margin-top: 35px;
  min-width: 82px;
  min-height: 82px;
  text-align: center;
  box-shadow: 0px 1px 2px rgba(16, 24, 40, 0.05);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-weight: 600;
  font-size: 14px;
  color: #101828;
  position: absolute;
}
.time-line-box-skeleton {
  border-radius: 8px;
  margin-top: 35px;
  width: 82px;
  height: 82px;
  overflow: hidden;
}

@media screen and (max-width: 600px) {
  .timeline-box {
    min-width: 62px;
    min-height: 62px;
    font-size: 12px;
  }
  .time-line-box-skeleton {
    width: 62px;
    height: 62px;
  }
}
</style>
