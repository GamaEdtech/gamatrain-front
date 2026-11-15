<template>
  <v-container class="d-flex flex-column ga-4 admin-activities">
    <div>
      <h1 class="text-h5 font-weight-bold text-grey900">
        Reads and listens
      </h1>
      <p class="ma-0 mt-1 text-body-2 text-grey600">
        What signed-in users read and listened to. A user counts once per post, however many days they came back.
        This is personal reading history, so only admins can see it.
      </p>
    </div>

    <v-card
      flat
      rounded="lg"
      border
      tag="section"
      class="pa-4 admin-activities__card"
      aria-labelledby="top-posts-title"
    >
      <div class="d-flex flex-wrap align-center justify-space-between ga-3">
        <h2
          id="top-posts-title"
          class="text-h6 font-weight-bold text-grey900"
        >
          Most-read posts
        </h2>
        <v-btn-toggle
          v-model="topDays"
          mandatory
          density="comfortable"
          variant="outlined"
          divided
          color="primary"
          aria-label="Period"
        >
          <v-btn
            v-for="option in PERIODS"
            :key="option"
            :value="option"
            class="text-none"
          >
            {{ option }} days
          </v-btn>
        </v-btn-toggle>
      </div>

      <v-skeleton-loader
        v-if="loadingTopPosts && !topPosts.length"
        type="table-tbody"
        class="mt-3"
      />
      <p
        v-else-if="!topPosts.length"
        class="ma-0 mt-4 text-body-2 text-grey600"
      >
        No reads in the last {{ topDays }} days.
      </p>
      <v-table
        v-else
        density="comfortable"
        class="mt-3"
      >
        <thead>
          <tr>
            <th>Post</th>
            <th class="text-end">
              Readers
            </th>
            <th class="text-end">
              Podcast listeners
            </th>
            <th class="text-end">
              Heard to the end
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="post in topPosts"
            :key="post.postId"
          >
            <td>
              <nuxt-link
                :to="contentPath('post', post.postId)"
                target="_blank"
              >
                {{ post.title || `Post ${post.postId}` }}
              </nuxt-link>
            </td>
            <td class="text-end font-weight-bold">
              {{ post.readers }}
            </td>
            <td class="text-end">
              {{ post.listeners }}
            </td>
            <td class="text-end">
              {{ post.fullListens }}
            </td>
          </tr>
        </tbody>
      </v-table>
    </v-card>

    <v-card
      flat
      rounded="lg"
      border
      tag="section"
      class="pa-4 admin-activities__card"
      aria-labelledby="user-activity-title"
    >
      <h2
        id="user-activity-title"
        class="text-h6 font-weight-bold text-grey900"
      >
        A user's reads and listens
      </h2>
      <v-form
        class="d-flex flex-wrap align-start ga-4 mt-3"
        @submit.prevent="lookUpUser"
      >
        <v-text-field
          v-model.number="userId"
          label="User id"
          type="number"
          variant="outlined"
          density="comfortable"
          hide-details="auto"
          class="admin-activities__field"
          :rules="[v => (Number(v) > 0) || 'Enter a user id']"
        />
        <v-select
          v-model="userDays"
          :items="PERIODS.map(value => ({ title: `Last ${value} days`, value }))"
          label="Period"
          variant="outlined"
          density="comfortable"
          hide-details
          class="admin-activities__field"
        />
        <v-btn
          type="submit"
          color="primary"
          size="large"
          class="text-none font-weight-bold"
          :loading="loadingUserActivity"
          :disabled="!(Number(userId) > 0)"
        >
          Show
        </v-btn>
      </v-form>

      <template v-if="userItems">
        <p
          v-if="!userItems.length"
          class="ma-0 mt-4 text-body-2 text-grey600"
        >
          No reads or listens in the last {{ shownDays }} days.
        </p>
        <v-table
          v-else
          density="comfortable"
          class="mt-3"
        >
          <thead>
            <tr>
              <th>Day</th>
              <th>What</th>
              <th>Post</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(item, index) in userItems"
              :key="`${item.postId}-${item.type}-${index}`"
            >
              <td class="text-no-wrap">
                {{ formatLocal(item.day, 'YYYY-MM-DD') }}
              </td>
              <td>
                <v-chip
                  size="small"
                  variant="tonal"
                  :color="KINDS[item.type]?.color"
                >
                  {{ KINDS[item.type]?.label ?? item.type }}
                </v-chip>
              </td>
              <td>
                <nuxt-link
                  :to="contentPath('post', item.postId)"
                  target="_blank"
                >
                  {{ item.title || `Post ${item.postId}` }}
                </nuxt-link>
              </td>
            </tr>
          </tbody>
        </v-table>
      </template>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import type { PostActivityDTO, UserActivityItemDTO, UserActivityKind } from '@/types'

definePageMeta({
  layout: 'admin',
  middleware: ['auth', 'admin'],
})

useHead({
  title: 'Reads and listens',
})

const PERIODS = [7, 30, 90] as const
const KINDS: Record<UserActivityKind, { label: string, color: string }> = {
  PostRead: { label: 'Read', color: 'primaryStrong' },
  PodcastPlay: { label: 'Podcast started', color: 'teal' },
  PodcastListen: { label: 'Podcast heard to the end', color: 'success' },
}

const { getTopPosts, getUserActivity, loadingTopPosts, loadingUserActivity } = useAdminActivity()
const { formatLocal } = useDateTime()

const topDays = ref<number>(30)
const topPosts = ref<PostActivityDTO[]>([])

const loadTopPosts = async () => {
  const response = await getTopPosts({ days: topDays.value })
  topPosts.value = response.succeeded && response.data ? response.data : []
}

watch(topDays, loadTopPosts)
onMounted(loadTopPosts)

const userId = ref<number | null>(null)
const userDays = ref<number>(30)
const shownDays = ref<number>(30)
const userItems = ref<UserActivityItemDTO[] | null>(null)

const lookUpUser = async () => {
  if (!(Number(userId.value) > 0)) return
  const response = await getUserActivity({ userId: Number(userId.value), days: userDays.value })
  shownDays.value = userDays.value
  userItems.value = response.succeeded && response.data ? response.data : null
}
</script>

<style scoped>
.admin-activities {
  max-width: 1000px;
}

.admin-activities__card {
  border-color: rgb(var(--v-theme-borderSubtle)) !important;
}

.admin-activities__field {
  flex: 1 1 220px;
  min-width: 0;
}
</style>
