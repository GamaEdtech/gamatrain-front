<template>
  <section
    id="reviews"
    class="detail-section reviews"
    aria-labelledby="reviews-title"
  >
    <div class="section-head">
      <h2
        id="reviews-title"
        class="section-title"
      >
        Reviews
      </h2>
    </div>

    <v-sheet
      v-if="!totalCount"
      color="grey50"
      rounded="lg"
      class="empty-reviews d-flex flex-wrap align-center ga-4 pa-5"
    >
      <v-icon
        size="32"
        color="primary"
        aria-hidden="true"
      >
        mdi-star-outline
      </v-icon>
      <div>
        <p class="empty-title">
          No reviews yet
        </p>
        <p class="empty-text">
          Studied, taught or sent your child here? Your review helps other families choose.
        </p>
      </div>
      <v-btn
        color="secondary"
        variant="flat"
        rounded
        class="text-none gtext-t5"
        @click="emit('leave-comment')"
      >
        Write a review
      </v-btn>
    </v-sheet>

    <div
      v-else
      class="summary"
    >
      <div class="overall">
        <span class="average">{{ averageRate.toFixed(1) }}</span>
        <v-rating
          :model-value="averageRate"
          color="primary"
          active-color="primary"
          half-increments
          readonly
          density="compact"
          size="20"
          :aria-label="`Rated ${averageRate.toFixed(1)} out of 5`"
        />
        <span class="count">{{ totalCount }} {{ totalCount === 1 ? 'review' : 'reviews' }}</span>
        <v-btn
          color="secondary"
          variant="flat"
          rounded
          class="text-none gtext-t5 mt-3"
          @click="emit('leave-comment')"
        >
          Write a review
        </v-btn>
      </div>
      <ul class="categories">
        <li
          v-for="category in categories"
          :key="category.key"
        >
          <span class="label">{{ category.label }}</span>
          <v-progress-linear
            :model-value="(category.value / 5) * 100"
            color="primary"
            bg-color="grey100"
            bg-opacity="1"
            height="8"
            rounded
            aria-hidden="true"
          />
          <span class="value">{{ category.value ? category.value.toFixed(1) : '–' }}</span>
        </li>
      </ul>
    </div>
  </section>
</template>

<script setup>
const props = defineProps({
  ratingData: {
    type: Object,
    default: null,
  },
})
const emit = defineEmits(['leave-comment'])

const averageRate = computed(() => Number(props.ratingData?.averageRate) || 0)
const totalCount = computed(() => props.ratingData?.totalCount || 0)

// Same categories, in the same order, as the review form (LeaveCommentDialog).
const categories = computed(() => [
  { key: 'classesQualityRate', label: 'Classroom quality' },
  { key: 'educationRate', label: 'Teachers\' expertise' },
  { key: 'itTrainingRate', label: 'Tech accessibility' },
  { key: 'safetyAndHappinessRate', label: 'Safety & environment' },
  { key: 'behaviorRate', label: 'Staff behavior' },
  { key: 'tuitionRatioRate', label: 'Value for tuition' },
  { key: 'facilitiesRate', label: 'Sports facilities' },
  { key: 'artisticActivitiesRate', label: 'Art & counseling' },
].map(category => ({ ...category, value: Number(props.ratingData?.[category.key]) || 0 })))
</script>

<style scoped>
.reviews {
  scroll-margin-top: 80px;
}

.empty-reviews > div {
  flex: 1 1 220px;
  min-width: 0;
}

.empty-title {
  margin: 0;
  font-size: 15px;
  font-weight: 600;
  color: rgb(var(--v-theme-grey900));
}

.empty-text {
  margin: 2px 0 0;
  font-size: 14px;
  color: rgb(var(--v-theme-grey600));
}

.summary {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 20px;
}

@media (min-width: 700px) {
  .summary {
    grid-template-columns: 200px minmax(0, 1fr);
    gap: 32px;
  }
}

.overall {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 2px;
}

.average {
  font-size: 40px;
  line-height: 1;
  font-weight: 700;
  color: rgb(var(--v-theme-grey900));
  font-variant-numeric: tabular-nums;
}

.count {
  font-size: 13px;
  color: rgb(var(--v-theme-grey500));
}

.categories {
  display: grid;
  gap: 10px;
  list-style: none;
  padding: 0;
  margin: 0;
}

.categories li {
  display: grid;
  grid-template-columns: minmax(120px, 170px) minmax(0, 1fr) 32px;
  align-items: center;
  gap: 12px;
  font-size: 14px;
  color: rgb(var(--v-theme-grey700));
}

.value {
  text-align: right;
  font-weight: 600;
  color: rgb(var(--v-theme-grey900));
  font-variant-numeric: tabular-nums;
}
</style>
