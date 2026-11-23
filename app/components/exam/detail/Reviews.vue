<template>
  <section
    id="reviews"
    class="d-flex flex-column ga-4"
    aria-labelledby="reviews-title"
  >
    <div class="d-flex flex-column">
      <h2
        id="reviews-title"
        class="text-h6 font-weight-bold text-grey800"
      >
        Reviews
      </h2>
      <span class="text-caption text-grey500">From students who took this exam</span>
    </div>

    <!-- The rating summary: average, count and how many gave each number of stars. -->
    <v-card
      rounded="xl"
      border
      elevation="0"
      class="pa-4 d-flex flex-column flex-sm-row ga-4 ga-sm-8"
    >
      <div class="d-flex flex-column align-center justify-center summary">
        <span class="text-h3 font-weight-bold text-grey800">{{ summary?.average?.toFixed(1) ?? '–' }}</span>
        <v-rating
          :model-value="summary?.average ?? 0"
          half-increments
          readonly
          density="compact"
          size="small"
          color="warning"
          active-color="warning"
        />
        <span class="text-caption text-grey500">{{ countLabel }}</span>
      </div>
      <div class="d-flex flex-column justify-center ga-1 flex-grow-1">
        <div
          v-for="stars in [5, 4, 3, 2, 1]"
          :key="stars"
          class="d-flex align-center ga-2"
        >
          <span class="text-caption text-grey600 stars-label">{{ stars }} ★</span>
          <v-progress-linear
            :model-value="share(stars)"
            color="warning"
            bg-color="grey200"
            rounded
            height="8"
          />
          <span class="text-caption text-grey500 stars-count">{{ summary?.distribution?.[stars - 1] ?? 0 }}</span>
        </div>
      </div>
    </v-card>

    <!-- The caller's own review: write it once they finished the exam; change it for 30 minutes after posting. -->
    <v-card
      v-if="summary?.canReview || summary?.mine"
      rounded="xl"
      border
      elevation="0"
      class="pa-4 d-flex flex-column ga-3"
    >
      <span class="text-subtitle-1 font-weight-bold text-grey700">{{ summary?.mine ? 'Your review' : 'Rate this exam' }}</span>
      <v-alert
        v-if="summary?.mine?.status === 'Rejected'"
        type="warning"
        variant="tonal"
        density="compact"
      >
        Your review is hidden{{ summary.mine.rejectionComment ? `: ${summary.mine.rejectionComment}` : '.' }}
      </v-alert>
      <!-- Posted and no longer changeable: shown as it stands. -->
      <template v-if="locked">
        <v-rating
          :model-value="summary?.mine?.rating ?? 0"
          readonly
          density="compact"
          color="warning"
          active-color="warning"
          aria-label="Your rating"
        />
        <p
          v-if="summary?.mine?.comment"
          class="text-body-2 text-grey700 comment"
        >
          {{ summary.mine.comment }}
        </p>
      </template>
      <template v-else>
        <v-rating
          v-model="rating"
          hover
          color="warning"
          active-color="warning"
          aria-label="Your rating"
        />
        <v-textarea
          v-model="comment"
          label="What did you think? (optional)"
          variant="outlined"
          rounded="lg"
          rows="3"
          auto-grow
          counter="1000"
          maxlength="1000"
          hide-details="auto"
        />
        <div class="d-flex flex-wrap align-center ga-3">
          <v-btn
            color="primary"
            rounded="lg"
            class="text-none"
            :disabled="!rating"
            :loading="saving"
            @click="save"
          >
            {{ summary?.mine ? 'Update review' : 'Post review' }}
          </v-btn>
          <span class="text-caption text-grey500">{{ windowHint }}</span>
        </div>
      </template>
    </v-card>
    <span
      v-else-if="!isAuthenticated"
      class="text-body-2 text-grey600"
    >
      Took this exam?
      <nuxt-link :to="{ query: { ...route.query, auth_form: 'login', auth_noredirect: 'true' } }">Sign in</nuxt-link>
      to rate it.
    </span>

    <!-- The comments, newest first. -->
    <div
      v-if="items.length"
      class="d-flex flex-column ga-3"
    >
      <v-card
        v-for="item in items"
        :key="item.id"
        rounded="xl"
        border
        elevation="0"
        class="pa-4 d-flex ga-3"
      >
        <v-avatar
          size="36"
          color="grey200"
        >
          <v-img
            v-if="item.avatarUrl"
            :src="item.avatarUrl"
            :alt="item.name || 'Student'"
          />
          <span
            v-else
            class="text-body-2 font-weight-bold text-grey600"
          >{{ (item.name || 'S').charAt(0) }}</span>
        </v-avatar>
        <div class="d-flex flex-column ga-1 flex-grow-1 min-w-0">
          <div class="d-flex flex-wrap align-center ga-2">
            <span class="text-body-2 font-weight-bold text-grey800">{{ item.name || 'Student' }}</span>
            <v-rating
              :model-value="item.rating"
              readonly
              density="compact"
              size="x-small"
              color="warning"
              active-color="warning"
            />
            <span class="text-caption text-grey500">{{ formatDate(item.date) }}</span>
          </div>
          <p class="text-body-2 text-grey700 comment">
            {{ item.comment }}
          </p>
        </div>
      </v-card>
      <v-btn
        v-if="items.length < (summary?.commentCount ?? 0)"
        variant="tonal"
        rounded="lg"
        class="text-none align-self-start"
        :loading="loadingMore"
        @click="loadMore"
      >
        More reviews
      </v-btn>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { ExamReviewDTO, ExamReviewsDTO } from '@/types'

const props = defineProps<{
  examId: string | number
  /** The public summary, rendered on the server (also the page's structured data). */
  initial: ExamReviewsDTO | null
}>()

const emit = defineEmits<{ changed: [] }>()

const route = useRoute()
const { isAuthenticated } = useAuth()
const { getReviews, saveReview, saving } = useExamReviews()
const { $toast } = useNuxtApp()

const summary = ref<ExamReviewsDTO | null>(props.initial)
const items = ref<ExamReviewDTO[]>(props.initial?.items ?? [])
const page = ref(1)
const loadingMore = ref(false)
const rating = ref(0)
const comment = ref('')

// A review can be changed for 30 minutes after posting, then it stands (and can't be deleted). `now` ticks so the form
// closes on its own when the window ends.
const now = ref(Date.now())
let timer: ReturnType<typeof setInterval> | undefined
const editableUntil = computed(() => {
  const until = summary.value?.mine?.editableUntil
  return until ? new Date(until).getTime() : null
})
const locked = computed(() => !!summary.value?.mine && (editableUntil.value === null || editableUntil.value <= now.value))
const windowHint = computed(() => {
  if (!summary.value?.mine || editableUntil.value === null) return 'You can change it for 30 minutes after posting.'
  const minutes = Math.max(1, Math.ceil((editableUntil.value - now.value) / 60000))
  return minutes === 1 ? 'You can change it for 1 more minute.' : `You can change it for ${minutes} more minutes.`
})

const countLabel = computed(() => {
  const count = summary.value?.count ?? 0
  return count === 1 ? '1 rating' : `${count.toLocaleString('en-US')} ratings`
})

const share = (stars: number) => {
  const count = summary.value?.count ?? 0
  return count ? ((summary.value?.distribution?.[stars - 1] ?? 0) / count) * 100 : 0
}

const formatDate = (value: string) => new Date(value).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })

// With a token: the caller's own review and whether they may write one (never part of the cached page).
const refresh = async () => {
  const data = await getReviews(props.examId, 1)
  if (!data) return
  summary.value = data
  items.value = data.items
  page.value = 1
  rating.value = data.mine?.rating ?? 0
  comment.value = data.mine?.comment ?? ''
}

const loadMore = async () => {
  loadingMore.value = true
  const data = await getReviews(props.examId, page.value + 1)
  if (data) {
    page.value++
    items.value = [...items.value, ...data.items]
  }
  loadingMore.value = false
}

const save = async () => {
  if (await saveReview(props.examId, rating.value, comment.value)) {
    $toast.success('Thanks for your review!')
    await refresh()
    emit('changed')
  }
}

onMounted(() => {
  if (isAuthenticated.value) void refresh()
  timer = setInterval(() => (now.value = Date.now()), 30000)
})
onBeforeUnmount(() => clearInterval(timer))
watch(isAuthenticated, (signedIn) => {
  if (signedIn) void refresh()
})
</script>

<style scoped>
.summary {
  min-width: 140px;
}

.stars-label {
  width: 32px;
}

.stars-count {
  width: 32px;
  text-align: end;
}

.comment {
  white-space: pre-wrap;
  overflow-wrap: anywhere;
}
</style>
