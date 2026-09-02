<template>
  <div>
    <template v-if="loader">
      <v-row>
        <v-col
          cols="12"
          md="12"
        >
          <v-skeleton-loader height="200" />
        </v-col>
        <v-col
          cols="12"
          md="12"
        >
          <v-skeleton-loader height="200" />
        </v-col>
      </v-row>
    </template>
    <template v-else>
      <div class="d-flex flex-column ga-5">
        <user-dashboard-general-info
          :user-data="userInfo?.user || {}"
          :progress-data="userInfo?.profileCompletion || {}"
          @update-username="updateUsername"
        />
        <user-dashboard-subscription-banner />
        <user-dashboard-badges-strip :earned-badge-ids="userInfo.badges" />
        <user-dashboard-statistics
          :score="userInfo.user.score || 0"
          :unread-message="userInfo.unreadMessages.total || 0"
        />
        <v-row>
          <v-col
            v-if="userType === 6"
            cols="12"
            md="8"
          >
            <user-dashboard-exam-section :exam-data="userInfo?.examSuggestions" />
          </v-col>
          <v-col
            cols="12"
            md="4"
          >
            <user-dashboard-support-widget />
          </v-col>
        </v-row>

        <!-- Content type -->
        <div>
          <p class="text-h5 text-sm-h4 font-weight-bold text-grey900 mb-4">
            {{ userType === 5 ? 'Create & Share' : 'Get Involved' }}
          </p>
          <user-dashboard-create-content-button
            :data="userInfo?.stats || {}"
          />
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
const { $toast } = useNuxtApp()

definePageMeta({
  layout: 'dashboard-layout',
  middleware: ['auth', 'user-type'],
})

useHead({
  title: 'Dashboard',
})

const { user } = useUser()
const loader = ref(true)
const userInfo = ref({})
const userType = computed(() => user.value?.group)

const updateUsername = (data) => {
  userInfo.value = {
    ...userInfo.value,
    user: {
      ...userInfo.value.user,
      username: data.username,
    },
  }
}

const getUserInfo = async () => {
  try {
    loader.value = true
    const apiUrl
      = userType.value === 5
        ? '/api/v1/teachers/dashboard'
        : '/api/v1/students/dashboard'

    const data = await useApiService.get(apiUrl)

    if (data.data) {
      userInfo.value = data.data
    }
    loader.value = false
  }
  catch (error) {
    // if (error.response?.status === 403) {
    //   useAuth().logout()
    // }
    $toast.error(error.response.data.message)
  }
}

onMounted(() => {
  getUserInfo()
})
</script>
