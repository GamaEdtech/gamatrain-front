<script setup>
import { useDisplay } from 'vuetify'

const { mobile } = useDisplay()
const drawer = ref(true)

// Automatically open drawer on desktop, close on mobile
watch(
  mobile,
  (isMobile) => {
    drawer.value = !isMobile
  },
  { immediate: true },
)

const isPermanent = computed(() => !mobile.value)
const isTemporary = computed(() => mobile.value)

const router = useRouter()
const route = useRoute()
const menuItems = [
  {
    Caption: [
      {
        title: 'Contact Us',
        link: '/admin/contact-us',
        icon: 'md:archive_outlined',
      },
      {
        title: 'User Managment ',
        link: '/admin/users',
        icon: 'md:groups_3_outlined',
      },
      { title: 'Blogs ', link: '/admin/blogs', icon: 'md:post_outlined' },
      { title: 'Tags ', link: '/admin/tags', icon: 'md:sell_outlined' },
      {
        title: 'Transactions ',
        link: '/admin/transactions',
        icon: 'md:price_change_outlined',
      },
      {
        title: 'Payments ',
        link: '/admin/payments',
        icon: 'md:payments_outlined',
      },
    ],
  },
  { 'Type Managment': [{ title: 'Location', link: '/admin/Locations', icon: 'md:location_on_outlined' }] },
  {
    School: [
      {
        title: 'Images ',
        link: '/admin/schools/images',
        icon: 'md:image_outlined',
      },
      {
        title: 'Image Issues',
        link: '/admin/schools/image-issues',
        icon: 'md:reset_image_outlined',
      },
      {
        title: 'Comments ',
        link: '/admin/schools/comments',
        icon: 'md:comment_outlined',
      },
    ],
  },
]

const navigate = (link) => {
  router.push(link)
  if (mobile.value) drawer.value = false // auto-close drawer on mobile after navigation
}

function isActive(link) {
  return route.path === link
}

const { isOnline } = useNetwork()
</script>

<template>
  <v-app>
    <error-temp
      v-if="!isOnline"
      status-code="disconnect"
    />
    <template v-else>
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
        <div
          class="d-flex ga-3 py-1 px-4 w-100 align-center gtext-t3 font-weight-medium primary-gray-300 mb-2"
        >
          <img
            class="rounded-pill"
            style="width: 36px; height: 36px"
            src="/images/adminAuth.png"
            alt=""
          >
          Admin Panel
        </div>
        <div class="sideBar">
          <v-list
            v-for="(group, index) in menuItems"
            :key="group.id || index"
          >
            <h4 class="px-5 primary-gray-400 gtext-t5 font-weight-semibold">
              {{ Object.keys(group)[0] }}
            </h4>
            <v-list-item
              v-for="item in Object.values(group)[0]"
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
                  <v-icon
                    class="primary-gray-400"
                  >
                    {{ item.icon }}
                  </v-icon>
                </v-list-item-icon>
                <v-list-item-title class="primary-gray-400 gtext-t5">
                  {{ item.title }}
                </v-list-item-title>
              </div>
            </v-list-item>
          </v-list>
        </div>

        <div
          class="d-flex align-center ga-2"
          style="position: absolute; bottom: 20px; left: 20px"
        >
          <img
            class="rounded-pill"
            style="width: 36px; height: 36px; border: 1px solid white"
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
    </template>
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
:deep(.v-navigation-drawer--left) {
  border-width: 0px !important;
}

.active-tab > .v-list-item-title,
.active-tab > v-list-item-icon > i {
  color: #2e90fa;
}
:deep(.v-list-item:hover > .v-list-item__overlay) {
  opacity: 0;
}
:deep(.v-list-item:hover > .v-list-item__content > div) {
  background-color: #eff8ff;
  border-radius: 30px;
  opacity: 0.6;
}
:deep(.v-list-item:hover > .v-list-item__content > div > div),
:deep(.v-list-item:hover > .v-list-item__content > div > v-list-item-icon > i) {
  color: #2e90fa;
}
:deep(.v-list-item:hover > .v-list-item__content > .active-tab),
.active-tab {
  background-color: #eff8ff !important;
  border-radius: 30px;
  opacity: 1 !important;
  color: #2e90fa !important;
}
:deep(.sideBar) {
  max-height: 450px !important;
  padding-top: 14px !important;
  overflow-y: scroll;
}
/* Scrollbar width */
:deep(.sideBar::-webkit-scrollbar) {
  width: 6px;
}

/* Scrollbar track (background) */
:deep(.sideBar::-webkit-scrollbar-track) {
  background: #1d2939;
  border-radius: 8px;
}

/* Scrollbar thumb (the draggable part) */
:deep(.sideBar::-webkit-scrollbar-thumb) {
  background: #dedede;
  border-radius: 8px;
}
</style>
