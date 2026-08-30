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
        <!-- Profile + level -->
        <dashboard-general-info-dashboard
          ref="generalInfoRef"
          :user-data="userInfo?.user || {}"
          :progress-data="userInfo?.profileCompletion || {}"
        />

        <!-- Subscription -->
        <dashboard-subscription-banner />

        <!-- Achievements -->
        <dashboard-badges-strip />

        <!-- Statistics -->
        <dashboard-statistics :user-info="userInfo" />

        <!-- Exams & progress (students) / Support -->
        <v-row v-if="userType === 6">
          <v-col
            cols="12"
            md="8"
          >
            <dashboard-exam-section :exam-data="userInfo?.examSuggestions" />
          </v-col>
          <v-col
            cols="12"
            md="4"
          >
            <dashboard-support-widget />
          </v-col>
        </v-row>
        <v-row v-else>
          <v-col
            cols="12"
            md="4"
          >
            <dashboard-support-widget />
          </v-col>
        </v-row>

        <!-- Content type -->
        <div>
          <p class="gama-text-h6 font-weight-bold text-grey900 mb-4">
            {{ userType === 5 ? 'Create & Share' : 'Get Involved' }}
          </p>
          <dashboard-create-content-button
            ref="createContentRef"
            :statistics="userInfo?.stats || {}"
          />
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { useAuth } from '@/composables/useAuth'

const { $toast } = useNuxtApp()
const auth = useAuth()
const _authToken = auth.getUserToken()

definePageMeta({
  layout: 'dashboard-layout',
  middleware: ['auth', 'user-type'],
})

useHead({
  title: 'Dashboard',
})

const { user } = useUser()
const generalInfoRef = ref(null)
const createContentRef = ref(null)
const loader = ref(true)
const userInfo = ref({})
const userType = computed(() => user.value?.group)

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
