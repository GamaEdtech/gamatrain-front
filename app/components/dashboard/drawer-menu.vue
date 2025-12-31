<template>
  <v-navigation-drawer
    v-model="drawerModel"
    v-model:rail="drawerRail"
    :temporary="mdAndDown"
    expand-on-hover
    :class="`bg-primary-gray-200 navigation-height-top ${
      isUserDashboard ? `` : `d-block d-lg-none`
    }`"
    @update:rail="railchange"
  >
    <v-list
      v-model:opened="openedGroups"
      density="compact"
      nav
      class="main-list"
    >
      <div class="w-100 d-flex d-lg-none justify-end align-center mt-2 px-2">
        <v-icon
          class="cursor-pointer primary-gray-600"
          size="24"
          @click="closeNavigation"
        >
          md:close
        </v-icon>
      </div>

      <v-list-item
        v-if="auth.isAuthenticated.value"
        class="rounded-lg mt-3 py-2"
        role="listitem"
      >
        <template #prepend>
          <v-avatar
            v-if="user && user.avatar"
            :image="user.avatar"
            class="border-image"
          />
          <v-avatar
            v-else
            color="#667085"
          >
            <span class="text-h5">{{
              user?.firstName ? user.firstName[0].toUpperCase() : "U"
            }}</span>
          </v-avatar>
        </template>

        <v-list-item-title
          class="text-h5 font-weight-bold primary-gray-500 text-item-height"
        >
          {{ user ? user.firstName + " " + user.lastName : "User" }}
        </v-list-item-title>
      </v-list-item>

      <template v-if="auth.isAuthenticated.value">
        <div
          v-for="item in items"
          :key="item.title"
        >
          <v-list-item
            v-show="!item.subMenuList"
            link
            :to="item.link"
            class="rounded-lg mt-3"
            role="listitem"
          >
            <template #prepend>
              <span
                v-if="item.icon_type && item.icon_type == `custom`"
                :class="`primary-gray-500 size-custom-icon ${item.icon}`"
              />
              <v-icon
                v-else
                class="primary-gray-600"
                size="24"
              >
                {{ item.icon }}
              </v-icon>
            </template>

            <v-list-item-title
              class="text-h5 font-medium primary-gray-500 text-item-height"
            >
              {{ item.title }}
              <!-- <div
              v-if="item.value == `messages`"
              class="badge-messages d-flex align-center justify-center rounded-circle text-white text-h5 font-weight-bold position-absolute"
            >
              4
            </div> -->
            </v-list-item-title>
          </v-list-item>
          <v-list-group
            v-show="item.subMenuList"
            :key="item.title"
            :value="item.value"
          >
            <template #activator="{ props: activeMenuItem }">
              <v-list-item
                v-bind="activeMenuItem"
                :class="`${
                  !drawerRail && isParentActive(item) ? 'custom-list-item' : ''
                }
                ${drawerRail && isParentActive(item) ? 'custom-list-item' : ''}
               rounded-lg mt-3`"
                role="listitem"
              >
                <template #prepend>
                  <span
                    v-if="item.icon_type && item.icon_type == `custom`"
                    :class="`primary-gray-500 size-custom-icon ${item.icon}`"
                  />
                  <v-icon
                    v-else
                    class="primary-gray-600"
                    size="24"
                  >
                    {{ item.icon }}
                  </v-icon>
                </template>

                <v-list-item-title
                  class="text-h5 font-medium primary-gray-500 text-item-height"
                >
                  {{ item.title }}
                </v-list-item-title>
              </v-list-item>
            </template>

            <v-list-item
              v-for="(subMenuItem, side) in item.subMenuList"
              :key="side.title"
              class="pl-1 py-2"
              :to="subMenuItem.link"
              :disabled="subMenuItem.status"
              role="listitem"
            >
              <template #prepend>
                <span
                  v-if="
                    subMenuItem.icon_type && subMenuItem.icon_type == `custom`
                  "
                  :class="`primary-gray-500 size-custom-icon ${subMenuItem.icon}`"
                />
                <v-icon
                  v-else
                  class="primary-gray-600"
                  size="24"
                >
                  {{ subMenuItem.icon }}
                </v-icon>
              </template>
              <v-list-item-title
                class="text-h5 font-medium primary-gray-600 text-item-height"
              >
                {{ subMenuItem.title }}
              </v-list-item-title>
            </v-list-item>
          </v-list-group>
        </div>
      </template>

      <div
        v-for="item in mobileItems"
        :key="item.title"
        class="d-block d-lg-none"
      >
        <v-list-item
          link
          :to="item.link"
          class="rounded-lg mt-3"
          role="listitem"
        >
          <template #prepend>
            <v-icon
              class="primary-gray-600"
              size="24"
            >
              {{ item.icon }}
            </v-icon>
          </template>

          <v-list-item-title
            class="text-h5 font-medium primary-gray-500 text-item-height"
          >
            {{ item.title }}
          </v-list-item-title>
        </v-list-item>
      </div>

      <v-list-item
        v-if="auth.isAuthenticated.value"
        link
        class="rounded-lg mt-3 mb-14"
        role="listitem"
        @click="logout"
      >
        <template #prepend>
          <v-icon
            class="primary-gray-600"
            size="24"
          >
            md:exit_to_app
          </v-icon>
        </template>

        <v-list-item-title
          class="text-h5 font-medium primary-gray-500 text-item-height"
        >
          Logout
        </v-list-item-title>
      </v-list-item>

      <!-- <div
        class="w-100 d-flex d-lg-none align-center justify-start position-extra-link pa-2"
      >
        <v-btn
          v-for="item in extraLink"
          icon
          :to="item.link"
          :key="item.value"
          class="bg-transparent"
          flat
        >
          <v-icon class="primary-gray-500" size="34">
            {{ item.icon }}
          </v-icon>
        </v-btn>
      </div> -->

      <!-- <div
        v-if="!drawerRail"
        class="w-100 buy-more-div d-flex flex-column justify-center align-center rounded-lg mt-10 ga-2"
      >
        <span class="text-h5 font-weight-bold primary-gray-500">Buy More Storage</span>
        <v-btn
          color="#2E90FA"
          rounded="xl"
          width="120"
          height="40"
          class="text-h6 text-white"
          flat
        >
          Upgrade Pro
        </v-btn>
      </div> -->
    </v-list>
  </v-navigation-drawer>
</template>

<script setup>
import { ref } from 'vue'
import { useUser } from '~/composables/useUser'
import { useDisplay } from 'vuetify'
import { useRoute } from 'vue-router'
import { useAuth } from '~/composables/useAuth'

const props = defineProps({
  showDrawer: { type: Boolean, default: true },
  isUserDashboard: { type: Boolean, default: false },
})
const emit = defineEmits(['update:showDrawer'])

const drawerModel = computed({
  get: () => props.showDrawer,
  set: value => emit('update:showDrawer', value),
})

const { user } = useUser()
const { mdAndDown } = useDisplay()
const route = useRoute()
const auth = useAuth()

const items = [
  {
    title: 'Dashboard',
    icon: 'md:dashboard',
    link: '/user',
    value: 'dashboard',
  },
  {
    title: 'Contents',
    icon: 'md:ballot',
    machine_name: 'add_content',
    value: 'contents',
    subMenuList: [
      {
        title: 'Paper',
        link: '/user/paper',
        icon: 'icon-paper',
        icon_type: 'custom',
        status: user.value && user.value.group == 5 ? false : true,
      },
      {
        title: 'Multimedia',
        link: '/user/multimedia',
        icon: 'icon-multimedia',
        icon_type: 'custom',
        status: user.value && user.value.group == 5 ? false : true,
      },
      {
        title: 'Q & A',
        link: '/user/question',
        icon: 'icon-q-a',
        icon_type: 'custom',
      },
      {
        title: 'Blogs',
        link: '/user/blogs',
        icon: 'md:art_track',
      },
    ],
  },
  {
    title: 'Online Exam',
    icon: 'icon-exam',
    icon_type: 'custom',
    value: 'exam',
    subMenuList: [
      {
        title: 'Results',
        link: '/exam/results',
        icon: 'md:fact_check',
      },
      {
        title: 'Exam maker',
        link: '/user/exam',
        icon: 'md:library_add',
      },
    ],
  },
  {
    title: 'Financial',
    icon: 'md:account_balance',
    value: 'financial',
    subMenuList: [
      { title: 'Wallet', link: '/user/wallet', icon: 'md:shopping_cart' },
      {
        title: 'Top Up Wallet',
        link: '/user/charge-wallet',
        icon: 'md:groups',
      },
      { title: 'Payments', link: '/user/payments', icon: 'md:shopping_bag' },
      {
        title: 'Sell Report',
        link: '/user/sell-report',
        icon: 'md:account_balance',
      },
    ],
  },
  {
    title: 'Messages',
    icon: 'md:mail',
    link: '/user/ticket',
    value: 'messages',
  },
  {
    title: 'Settings',
    icon: 'md:settings',
    value: 'settings',
    subMenuList: [
      { title: 'Edit Profile', link: '/user/profile', icon: 'md:edit' },
      // {
      //   title: 'Confirm Identity',
      //   link: '/user/identity-confirmation',
      //   icon: 'md:fingerprint',
      // },
      { title: 'Security', link: '/user/edit-pass', icon: 'md:password' },
    ],
  },
]

const mobileItems = [
  {
    title: 'Home Page',
    icon: 'md:home',
    link: '/',
    value: 'HomePage',
  },
  {
    title: 'About us',
    icon: 'md:supervisor_account',
    link: '/about-us',
    value: 'aboutUs',
  },
  {
    title: 'Services',
    icon: 'md:apps',
    link: '/services',
    value: 'services',
  },
  {
    title: 'Faq',
    icon: 'md:quiz',
    link: '/faq',
    value: 'faq',
  },
  {
    title: '$GET Token',
    icon: 'md:attach_money',
    link: '/get-token',
    value: 'getToken',
  },
  {
    title: 'Leader Board',
    icon: 'md:poll',
    link: '/leader-board',
    value: 'getToken',
  },
  {
    title: 'Governance',
    icon: 'md:policy',
    link: '/governance',
    value: 'governance',
  },
  {
    title: 'AI Assistant',
    icon: 'md:smart_toy',
    link: '/ai',
    value: 'aiAssistant',
  },
]

// const extraLink = [
//   {
//     icon: 'md:gavel',
//     link: '/terms',
//     value: 'Terms',
//   },
// ]

const openedGroups = ref([])
const internalRail = ref(true)
const drawerRail = computed({
  get() {
    return mdAndDown.value ? false : internalRail.value
  },
  set(val) {
    internalRail.value = val
  },
})

watch(
  () => openedGroups.value,
  () => {
    if (drawerRail.value && openedGroups.value.length > 0) {
      openedGroups.value = []
    }
  },
)

const railchange = () => {
  if (drawerRail.value) {
    openedGroups.value = []
  }
}

const isParentActive = (item) => {
  if (!item.subMenuList) return false
  return item.subMenuList.some(sub => route.path.startsWith(sub.link))
}

const logout = () => {
  auth.logout()
}

const closeNavigation = () => {
  emit('update:showDrawer', false)
}
</script>

<style scoped>
.dashboard-menu-container {
  background-color: #fff;
  border-right: 1px solid rgba(0, 0, 0, 0.12);
  height: 100%;
}

.navigation-height-top {
  top: 0px !important;
  height: 100% !important;
}
@media (min-width: 1280px) {
  .navigation-height-top {
    top: 6.4rem !important;
    height: 100% !important;
  }
}

:deep(.v-list-item__prepend .v-list-item__spacer) {
  width: 16px !important;
}
.text-item-height {
  line-height: 26px !important;
}
.custom-list-item {
  background-color: #d0d5dd;
}

.size-custom-icon {
  font-size: 24px;
  width: 24px;
  height: 24px;
  opacity: 0.8;
}
.border-image {
  border: 2px solid white;
}
.item-list-profile {
  background-color: white;
}

.buy-more-div {
  height: 200px;
  border: 2px solid #d0d5dd;
}
.main-list {
  min-height: 100%;
}
.position-extra-link {
  height: 20px;
  position: absolute;
  bottom: 20px;
}
.badge-messages {
  width: 24px;
  height: 24px;
  background-color: #f50e0e;
  top: 10px;
  right: 6px;
}
</style>
