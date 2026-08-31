<template>
  <div class="w-100 d-flex flex-column pa-4 rounded-lg bg-grey700">
    <div class="w-100 d-flex flex-column flex-sm-row justify-space-between align-start align-sm-center ga-4">
      <div class="d-flex align-center ga-2">
        <NuxtLink to="/user/profile">
          <v-progress-circular
            :model-value="level.percent"
            :size="72"
            :width="3"
            :color="ringColor"
            bg-color="grey25"
          >
            <v-avatar
              v-if="user?.avatarUri"
              size="60"
            >
              <v-img
                :src="user.avatarUri"
                alt="user avatar"
              />
            </v-avatar>
            <v-avatar
              v-else
              size="60"
              :color="ringColor"
            >
              <span class="text-grey900 font-weight-bold gama-text-h6">{{ initials }}</span>
            </v-avatar>
          </v-progress-circular>
        </NuxtLink>
        <div class="d-flex flex-column ga-1">
          <p class="text-h4 text-sm-h3 font-weight-bold text-white mb-1">
            <template v-if="user?.firstName || user?.lastName">
              {{ user?.firstName }} {{ user?.lastName }}
            </template>
            <template v-else>
              No name
            </template>
          </p>
          <span
            class="text-h5 text-sm-h4 font-weight-bold text-grey300 d-flex align-center"
          >
            <template v-if="userData.username && userData.username !== '0'">
              @{{ userData.username }}
            </template>
            <template v-else>
              Choose username
            </template>
            <v-btn
              v-if="userData.username && userData.username === '0'"
              flat
              color="white"
              size="20"
              class="ml-2"
              @click="showUsernameModal = true"
            >
              <v-icon
                color="grey500"
                size="16"
              >
                md:edit
              </v-icon>
            </v-btn>
          </span>
        </div>
      </div>
      <div class="d-flex flex-column align-end ga-2">
        <v-chip
          class="bg-white text-primary text-h6 font-weight-bold"
          flat
          prepend-icon="md:trophy_outlined"
        >
          Level {{ level.level }} · {{ level.title }}
        </v-chip>
        <p class="text-h5 text-grey300">
          {{ level.xpIntoLevel }} / {{ level.xpPerLevel }} XP to Level {{ level.level + 1 }}
        </p>
      </div>
    </div>
    <v-divider
      class="border-opacity-50 my-4"
      color="grey300"
    />
    <div class="d-flex flex-column">
      <p class="text-h5 text-uppercase font-weight-bold text-grey200 mb-4">
        Next steps
      </p>
      <div class="d-flex flex-wrap ga-2">
        <v-chip
          v-for="step in nextSteps"
          :key="step.label"
          class="bg-grey200 text-grey700 text-h6 font-weight-bold"
          variant="flat"
          :to="step.to"
          prepend-icon="md:arrow_circle_right_outlined"
        >
          {{ step.label }}
        </v-chip>
        <v-chip
          v-if="!nextSteps.length"
          class="bg-success text-h6 font-weight-bold"
          variant="flat"
          prepend-icon="md:check_circle_outlined"
        >
          Your profile is all set
        </v-chip>
      </div>
    </div>

    <lazy-common-modal-base
      v-model:show-dialog="showUsernameModal"
      title="Username"
    >
      <lazy-user-dashboard-modal-username
        :username="userData.username"
        @close="showUsernameModal = false"
        @success="emit('updateUsername', $event)"
      />
    </lazy-common-modal-base>
  </div>
</template>

<script setup lang="ts">
import type { EditUsernameDTO } from '@/types'

interface IGeneralInfo {
  userData: {
    id: string
    username: string
    first_name: string
    last_name: string
    phone: string | null
    avatar: string
    sex: string
    active: string
    credit: string
    active_package: string
    group_id: number
    score: string
    section: string | null
    base: string | null
    course: string
    area: string | null
    school: string | null
    score_check_info: string
    state: string | null
    city: string | null
  }
  progressData: {
    total: number
    num: number
    notComplete: string[]
  }
}
const props = defineProps<IGeneralInfo>()
const emit = defineEmits<{
  updateUsername: [data: EditUsernameDTO]
}>()

const { user } = useUser()
const userType = computed(() => user.value?.group)
const ringColor = computed(() => (userType.value === 5 ? 'secondary' : 'primary'))

const showUsernameModal = ref(false)

const level = computed(() => useLevel(Number(props.userData.score) || 0))

const initials = computed(() => {
  const first = user.value?.firstName[0] || ''
  const last = user.value?.lastName[0] || ''
  return (first + last).toUpperCase() || '?'
})

// Real signal from the API: field names still missing from the user's profile.
// We don't know the full set of possible values, so keep the label as-is
// (matches the previous behaviour) and route every step to the profile page.
const nextSteps = computed(() => {
  const notComplete = props.progressData.notComplete || []
  return notComplete.slice(0, 3).map(field => ({
    label: `Add your ${field}`,
    to: '/user/profile',
  }))
})
</script>
