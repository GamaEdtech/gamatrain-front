<template>
  <v-card
    flat
    class="dashboard-hero bg-grey900 rounded-lg pa-6"
  >
    <div class="d-flex justify-space-between align-start flex-wrap ga-4">
      <div class="d-flex align-center ga-4">
        <NuxtLink to="/user/profile">
          <v-progress-circular
            :model-value="level.percent"
            :size="72"
            :width="3"
            :color="ringColor"
            bg-color="rgba(255,255,255,0.15)"
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
        <div>
          <p class="gama-text-h4 font-weight-bold text-white mb-1">
            <template v-if="user?.first_name || user?.last_name">
              {{ user?.first_name }} {{ user?.last_name }}
            </template>
            <template v-else>
              No name
            </template>
          </p>
          <p class="gama-text-body1 text-grey400 mb-0">
            {{ userInfoData?.section_title }} {{ userInfoData?.school_name }}
          </p>

          <!-- Choose username -->
          <v-form
            v-if="userInfoData.username && userInfoData.username === '0'"
            class="mt-3"
            style="max-width: 300px;"
            @submit.prevent="updateUsername"
          >
            <v-text-field
              v-model="username"
              bg-color="white"
              density="compact"
              variant="solo"
              rounded="lg"
              hide-details="auto"
              :rules="usernameRules"
              label="Choose username"
            >
              <template #append-inner>
                <v-btn
                  class="dashboard-btn"
                  color="primary"
                  variant="flat"
                  rounded="pill"
                  size="small"
                  :disabled="!username || username.length < 6"
                  @click="updateUsername"
                >
                  Choose
                </v-btn>
              </template>
            </v-text-field>
          </v-form>
        </div>
      </div>

      <div class="d-flex flex-column align-end ga-2">
        <v-chip
          class="bg-white-14 text-primary50 gama-text-body2"
          variant="flat"
          prepend-icon="mdi-trophy-outline"
        >
          Level {{ level.level }} · {{ level.title }}
        </v-chip>
        <p class="gama-text-caption text-grey400 mb-0">
          {{ level.xpIntoLevel }} / {{ level.xpPerLevel }} XP to Level {{ level.level + 1 }}
        </p>
      </div>
    </div>

    <v-divider
      class="border-opacity-15 my-4"
      color="white"
    />

    <div>
      <p class="gama-text-caption text-uppercase font-weight-bold text-grey500 mb-2">
        Next steps
      </p>
      <div class="d-flex flex-wrap ga-2">
        <v-chip
          v-for="step in nextSteps"
          :key="step.label"
          class="bg-white-10 text-white gama-text-body2"
          variant="flat"
          :to="step.to"
          prepend-icon="mdi-arrow-right-circle-outline"
        >
          {{ step.label }}
        </v-chip>
        <v-chip
          v-if="!nextSteps.length"
          class="bg-white-10 text-white gama-text-body2"
          variant="flat"
          prepend-icon="mdi-check-circle-outline"
        >
          Your profile is all set
        </v-chip>
      </div>
    </div>
  </v-card>
</template>

<script setup>
const props = defineProps({
  userData: {
    type: Object,
    default: () => ({}),
  },
  progressData: {
    type: Object,
    default: () => ({}),
  },
})

const { user } = useUser()
const userType = computed(() => user.value?.group)
const ringColor = computed(() => (userType.value === 5 ? 'secondary' : 'primary'))

const userInfoData = ref({})
const progressInfoData = ref({})
const username = ref('')
const errors = ref([])

const usernameRules = [
  v => !!v || 'Username is required',
  v => (v && v.length >= 6) || 'Username must be at least 6 characters',
]

watch(
  () => props.userData,
  (newValue) => {
    if (newValue) userInfoData.value = newValue
  },
  { immediate: true, deep: true },
)

watch(
  () => props.progressData,
  (newValue) => {
    if (newValue) progressInfoData.value = newValue
  },
  { immediate: true, deep: true },
)

const level = computed(() => useLevel(userInfoData.value?.score))

const initials = computed(() => {
  const first = user.value?.first_name?.[0] || ''
  const last = user.value?.last_name?.[0] || ''
  return (first + last).toUpperCase() || '?'
})

// Real signal from the API: field names still missing from the user's profile.
// We don't know the full set of possible values, so keep the label as-is
// (matches the previous behaviour) and route every step to the profile page.
const nextSteps = computed(() => {
  const notComplete = progressInfoData.value?.notComplete || []
  return notComplete.slice(0, 3).map(field => ({
    label: `Add your ${field}`,
    to: '/user/profile',
  }))
})

const updateUsername = async () => {
  if (!username.value || username.value.length < 6) return
  try {
    await useApiService.put('/api/v1/users/username', {
      username: username.value,
    })
    userInfoData.value.username = username.value
    errors.value = []
  }
  catch (error) {
    errors.value = [error.response?.data?.message || 'An error occurred']
  }
}
</script>

<style scoped>
/* Vuetify has no 16px card-radius preset; the real homepage hero sections
   (see app/pages/index.vue #ai-learn-banner) hand-roll the same 1rem radius. */
.dashboard-hero {
  border-radius: 1rem;
}

/* Vuetify 3 sizes v-btn/v-chip text via --v-btn-size on a scale tuned for a
   16px root; this project forces html { font-size: 10px }, so even the
   largest preset renders too small. Override directly. */
.dashboard-btn {
  font-size: 1.4rem !important;
}

.bg-white-14 {
  background: rgba(255, 255, 255, 0.14) !important;
}

.bg-white-10 {
  background: rgba(255, 255, 255, 0.1) !important;
}
</style>
