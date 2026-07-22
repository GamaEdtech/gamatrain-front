<template>
  <v-menu
    transition="slide-x-transition"
    offset-y
    :close-on-content-click="false"
  >
    <template #activator="{ props }">
      <div
        v-bind="props"
        class="d-none d-lg-flex align-center"
      >
        <div
          :class="`text-h5 font-weight-medium mr-2 mt-1 ${
            menuSetting.bgColor == '#FFFFFF'
              ? 'text-grey800'
              : 'text-white'
          }`"
        >
          {{ user?.firstName || user?.lastName }}
        </div>
        <v-avatar
          v-if="user?.avatarUri"
          size="32"
        >
          <v-img
            :src="user?.avatarUri"
            alt="user avatar"
          />
        </v-avatar>
        <v-icon
          v-else
          :color="menuSetting.linkColor"
        >
          md:account_circle
        </v-icon>
      </div>
      <div
        v-bind="props"
        class="d-flex d-lg-none"
      >
        <v-avatar
          v-if="user?.avatarUri"
          size="26"
        >
          <v-img
            :src="user?.avatarUri"
            alt="user avatar"
          />
        </v-avatar>
        <v-icon
          v-else
          :color="menuSetting.linkColor"
        >
          md:account_circle
        </v-icon>
      </div>
    </template>
    <v-list
      v-model:opened="openedGroups"
      density="compact"
      min-width="250"
      nav
      bg-color="#f9fafb"
      class="rounded-lg"
    >
      <div
        v-for="item in items"
        :key="item.title"
      >
        <v-list-item
          v-show="!item.subMenuList"
          link
          :to="item.link"
          class="rounded-lg mt-3"
          :disabled="item.status"
        >
          <template #prepend>
            <span
              v-if="item.icon_type && item.icon_type == `custom`"
              :class="`primary-gray-500 size-custom-icon ${item.icon}`"
            />
            <v-icon
              v-else
              class="primary-gray-600"
              size="18"
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
                  size="18"
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
                size="18"
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

      <v-list-item
        link
        class="rounded-lg mt-1"
        @click="logout"
      >
        <template #prepend>
          <v-icon
            class="primary-gray-600"
            size="18"
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
    </v-list>
  </v-menu>
</template>

<script setup>
defineProps({
  menuSetting: {
    type: Object,
    default: () => {},
  },
})

const { user } = useUser()
const auth = useAuth()

const openedGroups = ref([])
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
        status: user.value && user.value.group === 5 ? false : true,
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
      // {
      //   title: 'Top Up Wallet',
      //   link: '/user/charge-wallet',
      //   icon: 'md:groups',
      //   status: true,
      // },
      // { title: 'Payments', link: '/user/payments', icon: 'md:shopping_bag', status: true },
      {
        title: 'Sell Report',
        link: '/user/sell-report',
        icon: 'md:account_balance',
        status: true,
      },
    ],
  },
  {
    title: 'Messages',
    icon: 'md:mail',
    link: '/user/ticket',
    value: 'messages',
    status: true,
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

const logout = async () => {
  try {
    await auth.logout()
  }
  catch (error) {
    console.error('Logout failed:', error)
  }
}
</script>

<style scoped>
:deep(.v-list-item__prepend .v-list-item__spacer) {
  width: 16px !important;
}

.size-custom-icon {
  font-size: 18px;
  width: 18px;
  height: 18px;
  opacity: 0.8;
}
.text-item-height {
  line-height: 26px !important;
}
.badge-messages {
  width: 24px;
  height: 24px;
  background-color: #f50e0e;
  top: 10px;
  right: 6px;
}
</style>
