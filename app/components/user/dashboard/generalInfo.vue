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
              v-if="userData?.avatarUri"
              size="60"
            >
              <v-img
                :src="userData.avatarUri"
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
            <template v-if="userData?.firstName || userData?.lastName">
              {{ userData?.firstName }} {{ userData?.lastName }}
            </template>
            <template v-else>
              No name
            </template>
          </p>
          <span
            class="text-h5 text-sm-h4 font-weight-bold text-grey300 d-flex align-center"
          >
            <template v-if="userData.handle">
              <nuxt-link :to="`profile/${userData.handle}`">@{{ userData.handle }}</nuxt-link>
            </template>
            <template v-else>
              Choose username
            </template>
            <v-btn
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
        :username="userData.handle"
        @close="showUsernameModal = false"
        @success="emit('updateUsername', $event)"
      />
    </lazy-common-modal-base>
  </div>
</template>

<script setup lang="ts">
import type { UserDashboardDTO, DashboardProfileCompletionDTO } from '@/types'

interface IGeneralInfo {
  userData: UserDashboardDTO
  progressData: DashboardProfileCompletionDTO
}
const props = defineProps<IGeneralInfo>()
const emit = defineEmits<{
  updateUsername: [data: string]
}>()

const ringColor = computed(() => (props.userData.roles.includes('Teacher') ? 'primary' : 'secondary'))

const showUsernameModal = ref(false)

const level = computed(() => useLevel(props.userData.points || 0))

const initials = computed(() => {
  const first = props.userData.firstName?.[0] || ''
  const last = props.userData.lastName?.[0] || ''
  return (first + last).toUpperCase() || '?'
})

const nextSteps = computed(() => {
  const notComplete = props.progressData.notComplete || []
  return notComplete.slice(0, 3).map(field => ({
    label: `Add your ${field}`,
    to: '/user/profile',
  }))
})
</script>
