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
      <!-- Profile section -->
      <v-row>
        <v-col
          cols="12"
          class="px-0 px-md-2"
        >
          <v-card :flat="display.xs.value">
            <v-card-text class="px-8 px-sm-8 pa-md-3">
              <v-row>
                <!-- General info -->
                <v-col cols="12">
                  <dashboard-general-info-dashboard
                    ref="generalInfoRef"
                    :user-data="userInfo?.user || {}"
                    :progress-data="userInfo?.profileCompletion || {}"
                  />
                </v-col>
                <!-- End general info -->

                <!-- Statistics section -->
                <v-col
                  cols="12"
                  class="px-0 px-md-4"
                >
                  <dashboard-statistics :user-info="userInfo" />
                </v-col>
                <!-- End Statistics section -->
              </v-row>

              <!-- Content type -->
              <dashboard-create-content-button
                ref="createContentRef"
                :statistics="userInfo?.stats || {}"
              />
              <!-- End content type -->
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
      <!-- End profile section -->

      <!-- Exams section -->
      <dashboard-exam-section :exam-data="userInfo?.examSuggestions" />
      <!-- End exam section -->
    </template>
  </div>
</template>

<script setup>
import { useDisplay } from 'vuetify'
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
const userType = computed(() => user.value?.group_id)
const display = useDisplay()
const getUserInfo = async () => {
  try {
    loader.value = true
    const apiUrl
      = userType.value == '5'
        ? '/api/v1/teachers/dashboard'
        : '/api/v1/students/dashboard'

    const data = await useApiService.get(apiUrl)

    if (data.data) {
      userInfo.value = data.data
    }
    loader.value = false
  }
  catch (error) {
    if (error.response?.status === 403) {
      useAuth().logout()
    }
    $toast.error(error.response.data.message)
  }
}

onMounted(() => {
  getUserInfo()
})
</script>

<style scoped>
.teaching-request-details i {
  font-size: 1.5rem;
  margin-right: 0.5rem;
}

.teaching-request-details span {
  font-size: 1.5rem;
}
</style>
