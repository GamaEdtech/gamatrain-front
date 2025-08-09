<template>
  <v-row v-if="progressInfoData?.num < 10 || userInfoData?.username === '0'">
    <v-col
      cols="12"
      md="8"
    >
      <div
        v-if="progressInfoData?.num < 10"
        class="d-flex pb-0"
      >
        <NuxtLink to="/user/profile">
          <img
            v-if="userInfoData?.avatar"
            width="72"
            height="72"
            :src="userInfoData?.avatar"
          >
          <v-btn
            v-else
            class="d-flex"
            outlined
            fab
            x-large
          >
            <v-icon> mdi-account-outline </v-icon>
          </v-btn>
        </NuxtLink>
        <div class="pa-3">
          <p class="text-h4">
            <strong v-if="user?.first_name || user?.last_name">
              {{ user?.first_name }} {{ user?.last_name }}
            </strong>
            <strong v-else> No name </strong>
          </p>
          <p class="text-h5">
            {{ userInfoData?.section_title }} {{ userInfoData?.school_name }}
          </p>
        </div>
      </div>
    </v-col>
    <v-col
      cols="12"
      md="4"
      class="text-right pb-0"
    >
      <!-- Choose username -->
      <v-row v-if="userInfoData.username && userInfoData.username === '0'">
        <v-col
          cols="12"
          md="12"
          class="pa-0 pa-md-3"
        >
          <v-form @submit="updateUsername">
            <v-text-field
              v-model="username"
              filled
              dense
              :rules="usernameRules"
              class="mt-4 mb-0"
              label="Choose username"
              type="text"
            >
              <template #append-inner>
                <v-btn
                  class="default"
                  :disabled="!username || username.length < 6"
                  absolute
                  @click="updateUsername"
                >
                  choose
                </v-btn>
              </template>
            </v-text-field>
          </v-form>
        </v-col>
      </v-row>
      <!-- End choose username -->
    </v-col>

    <!-- Profile complete progress -->
    <v-col
      v-if="progressInfoData?.num < 10"
      cols="12"
      class="pt-0"
    >
      <NuxtLink to="/user/profile">
        <p class="text-h5 font-weight-bold mt-3 mb-3">
          Profile complete: {{ progressInfoData?.num * 10 }}% | Now complete
          <span class="text-capitalize text-green">
            {{ progressInfoData?.notComplete?.[0] || "" }}
          </span>
        </p>
      </NuxtLink>
      <v-progress-linear
        color="teal"
        height="8"
        buffer-value="0"
        :model-value="progressInfoData?.num * 10"
        stream
      />
    </v-col>
    <!-- End profile complete progress -->
  </v-row>
</template>

<script setup>
const _auth = useAuth()
// Define props using defineProps
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

// Get auth user
const { user } = useUser()

// Reactive state
const userInfoData = ref({})
const progressInfoData = ref({})
const username = ref('')
const errors = ref([])

// Vuetify validation rules
const usernameRules = [
  v => !!v || 'Username is required',
  v => (v && v.length >= 6) || 'Username must be at least 6 characters',
]

// Watch for props changes
watch(
  () => props.userData,
  (newValue) => {
    if (newValue) {
      userInfoData.value = newValue
    }
  },
  { immediate: true, deep: true },
)

watch(
  () => props.progressData,
  (newValue) => {
    if (newValue) {
      progressInfoData.value = newValue
    }
  },
  { immediate: true, deep: true },
)

// Methods
const updateUsername = async () => {
  if (!username.value || username.value.length < 6) return
  try {
    const { _data } = await useApiService.put('/api/v1/users/username', {
      username: username.value,
    })
    userInfoData.value.username = username.value
    errors.value = []
  }
  catch (error) {
    errors.value = [error.response?.data?.message || 'An error occurred']
  }
}

// Lifecycle hook
onMounted(() => {
  // Initialize component
})
</script>

<style scoped></style>
