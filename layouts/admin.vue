<script setup>
import { useDisplay } from 'vuetify'

const { mobile } = useDisplay()
const drawer = ref(true)

// Automatically open drawer on desktop, close on mobile
watch(mobile, (isMobile) => {
  drawer.value = !isMobile
}, { immediate: true })

const isPermanent = computed(() => !mobile.value)
const isTemporary = computed(() => mobile.value)

const router = useRouter()
const route = useRoute()

const captionMenuItems = [
  { title: 'Type', link: '/admin/type', icon: 'mdi-basket' },
  { title: 'Blogs', link: '/admin/blogs', icon: 'mdi-book-open-outline' },
  { title: 'My Stock', link: '/admin/stock', icon: 'mdi-finance' },
  { title: 'Analysis', link: '/admin/analysis', icon: 'mdi-chart-line' },
  { title: 'Contact Us', link: '/admin/contact-us', icon: 'mdi-archive-arrow-down-outline' },
  { title: 'User Managment ', link: '/admin/users', icon: 'mdi-account-group-outline' },
]
const typeManagementMenuItems = [
  { title: 'Location', link: '/admin/Locations' },
]

const navigate = (link) => {
  router.push(link)
  if (mobile.value) drawer.value = false // auto-close drawer on mobile after navigation
}

function isActive(link) {
  return route.path === link
}
</script>

<template>
  <v-app>
    <v-navigation-drawer
      v-model="drawer"
      :permanent="isPermanent"
      :temporary="isTemporary"
      app
      color="#1d2939"
    >
      <div class="text--white font-weight-semibold pa-4 gtext-t2 mb-6">
        Dashboard
      </div>
      <div class="d-flex ga-3 py-1 px-4 w-100 align-center gtext-t3 font-weight-medium primary-gray-300 mb-2">
        <img
          class="rounded-pill"
          style="width: 36px; height: 36px;"
          src="/images/adminAuth.png"
          alt=""
        >
        Admin Panel
      </div>
      <v-list>
        <h4 class="px-5 primary-gray-400 gtext-t5 font-weight-semibold mt-2">
          Caption
        </h4>
        <v-list-item
          v-for="item in captionMenuItems"
          :key="item.link"
          link
          class="px-6 py-0"
          @click="navigate(item.link)"
        >
          <div
            class="d-flex align-center ga-3 py-2 px-5"
            :class="{ 'active-tab': isActive(item.link) }"
          >
            <v-list-item-icon>
              <v-icon class="primary-gray-400">
                {{ item.icon }}
              </v-icon>
            </v-list-item-icon>
            <v-list-item-title class="primary-gray-400 gtext-t5">
              {{ item.title }}
            </v-list-item-title>
          </div>
        </v-list-item>
      </v-list>
      <v-list>
        <h4 class="px-5 primary-gray-400 gtext-t5 font-weight-semibold">
          Type Managment
        </h4>
        <v-list-item
          v-for="item in typeManagementMenuItems"
          :key="item.link"
          link
          class="px-6 py-0"
          @click="navigate(item.link)"
        >
          <div
            class="d-flex align-center ga-3 py-2 px-5"
            :class="{ 'active-tab': isActive(item.link) }"
          >
            <v-list-item-icon>
              <v-icon class="primary-gray-400 mdi mdi-circle text-button" />
            </v-list-item-icon>
            <v-list-item-title class="primary-gray-400 gtext-t5">
              {{ item.title }}
            </v-list-item-title>
          </div>
        </v-list-item>
      </v-list>
      <div
        class="d-flex align-center ga-2"
        style="position: absolute;bottom: 20px; left: 20px;"
      >
        <img
          class="rounded-pill"
          style="width: 36px; height: 36px;border: 1px solid white;"
          src="/images/adminAuth.png"
          alt=""
        >
        <div>
          <p class="gtext-t5 font-weight-medium">
            shelina Shay
          </p>
          <p class="gtext-t6 primary-gray-400">
            Admin@Gama
          </p>
        </div>
      </div>
    </v-navigation-drawer>

    <v-app-bar
      app
      color="#1d2939"
      dark
    >
      <v-app-bar-nav-icon
        v-if="mobile"
        @click="drawer = !drawer"
      />
    </v-app-bar>

    <v-main>
      <NuxtPage class="pa-5" />
    </v-main>
    <AppGlobalSnackbar />
  </v-app>
</template>

<style scoped>
.user {
  display: flex;
  align-items: center;
  margin-top: auto;
  margin-bottom: 10px;
}
.profile {
  width: 40px;
  height: 40px;
  border-radius: 50%;
}
.v-container {
  flex: 1 1 0%;
  min-height: 0;
  overflow-y: auto;
}
:deep(.v-navigation-drawer--left){
  border-width: 0px !important;
}

.active-tab > .v-list-item-title, .active-tab > v-list-item-icon > i{
  color:#2E90FA ;
}
:deep(.v-list-item:hover > .v-list-item__overlay){
  opacity: 0;
}
:deep(.v-list-item:hover > .v-list-item__content > div){
  background-color: #EFF8FF;
  border-radius: 30px;
  opacity: 0.6;
}
:deep(.v-list-item:hover > .v-list-item__content > div > div),
:deep(.v-list-item:hover > .v-list-item__content > div > v-list-item-icon > i){
  color: #2E90FA;
}
:deep(.v-list-item:hover > .v-list-item__content > .active-tab), .active-tab{
  background-color: #EFF8FF !important;
  border-radius: 30px;
  opacity: 1 !important;
  color: #2E90FA !important;
}
</style>
