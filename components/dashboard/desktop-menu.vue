<template>
  <v-navigation-drawer
    v-model:rail="drawerRail"
    expand-on-hover
    class="bg-primary-gray-200 navigation-height-top"
    @update:rail="railchange"
  >
    <v-list
      v-model:opened="openedGroups"
      density="compact"
      nav
    >
      <v-list-group :value="itemsProfile.value">
        <template #activator="{ props }">
          <v-list-item
            v-bind="props"
            class="custom-list-item rounded-lg mt-3 py-2"
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
                  user.first_name[0].toUpperCase()
                }}</span>
              </v-avatar>
            </template>

            <v-list-item-title
              class="text-h5 font-weight-bold primary-gray-500 line-height"
            >
              {{ user.first_name + " " + user.last_name }}
            </v-list-item-title>
          </v-list-item>
        </template>

        <v-list-item
          v-for="(subMenuItem, side) in itemsProfile.subMenuList"
          :key="side.title"
          class="pl-1 py-2 item-list-profile rounded-lg"
          active-class="menu_active"
          :to="subMenuItem.link"
          :disabled="subMenuItem.status"
        >
          <template #prepend>
            <span
              v-if="subMenuItem.icon_type && subMenuItem.icon_type == `custom`"
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
            class="text-h5 font-medium primary-gray-600 line-height"
          >
            {{ subMenuItem.title }}
          </v-list-item-title>
        </v-list-item>
      </v-list-group>

      <div class="w-100 d-flex justify-center align-center mt-3 mb-10">
        <v-icon
          v-if="drawerRail"
          class="primary-gray-600"
          size="24"
        >
          md:search
        </v-icon>

        <v-text-field
          v-if="!drawerRail"
          v-model="searchText"
          placeholder="Search..."
          variant="outlined"
          density="compact"
          hide-details
          rounded="lg"
          class="w-100"
          base-color="#475467"
          color="#475467"
          active-color="#475467"
          autocomplete="off"
        >
          <template #prepend-inner>
            <v-icon
              class="primary-gray-600"
              size="24"
            >
              md:search
            </v-icon>
          </template>
        </v-text-field>
      </div>

      <div
        v-for="item in items"
        :key="item.title"
      >
        <v-list-item
          v-show="!item.subMenuList"
          link
          :to="item.link"
          class="custom-list-item rounded-lg mt-3"
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
            class="text-h5 font-medium primary-gray-500 line-height"
          >
            {{ item.title }}
          </v-list-item-title>
        </v-list-item>
        <v-list-group
          v-show="item.subMenuList"
          :key="item.title"
          :value="item.value"
        >
          <template #activator="{ props }">
            <v-list-item
              v-bind="props"
              class="custom-list-item rounded-lg mt-3"
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
                class="text-h5 font-medium primary-gray-500 line-height"
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
              class="text-h5 font-medium primary-gray-600 line-height"
            >
              {{ subMenuItem.title }}
            </v-list-item-title>
          </v-list-item>
        </v-list-group>
      </div>

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

const { user } = useUser()

const items = ref([
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
        status: user.value.group_id == 5 ? false : true,
      },
      {
        title: 'Multimedia',
        link: '/user/multimedia',
        icon: 'icon-multimedia',
        icon_type: 'custom',
        status: user.value.group_id == 5 ? false : true,
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
])

const itemsProfile = ref({
  title: 'Profile',
  value: 'profile',
  subMenuList: [
    { title: 'Edit Profile', link: '/user/profile', icon: 'md:edit' },
    {
      title: 'Confirm Identity',
      link: '/user/identity-confirmation',
      icon: 'md:fingerprint',
    },
    { title: 'Security', link: '/user/edit-pass', icon: 'md:password' },
    { title: 'Settings', link: '/user/setting', icon: 'md:settings' },
  ],
})

const openedGroups = ref([])
const drawerRail = ref(false)
const searchText = ref('')

const railchange = () => {
  if (drawerRail.value) {
    openedGroups.value = []
  }
}

onMounted(() => {
  drawerRail.value = true
  openedGroups.value = []
})
</script>

<style scoped>
.dashboard-menu-container {
  background-color: #fff;
  border-right: 1px solid rgba(0, 0, 0, 0.12);
  height: 100%;
}

.navigation-height-top {
  top: 64px !important;
  height: 100% !important;
}
@media (min-width: 960px) {
  .navigation-height-top {
    top: 6.4rem !important;
    height: 100% !important;
  }
}

:deep(.v-list-item__prepend .v-list-item__spacer) {
  width: 16px !important;
}
.line-height {
  line-height: 26px;
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
</style>
