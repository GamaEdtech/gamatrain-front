<template>
  <!-- Dashboard mobile menu -->
  <v-row class="d-block d-md-none mobile_dashboard_menu">
    <v-col
      cols="12"
      class="px-0 pb-0 mb-0"
    >
      <v-tabs
        v-model="activeTab"
        bg-color="white"
        centered
        active-class="tab_actived"
        class="fixed-tabs-bar"
      >
        <v-tab
          v-for="(item, index) in items"
          :key="index"
          :value="index"
          @click="openLink(item)"
        >
          <div class="d-flex flex-column align-center">
            <v-icon class="mb-1">
              {{ item.icon }}
            </v-icon>
            <span>{{ item.title }}</span>
          </div>
        </v-tab>
      </v-tabs>
    </v-col>

    <v-bottom-sheet v-model="sheet">
      <v-list>
        <v-list-item
          v-for="subItem in subList"
          :key="subItem.title"
          :to="subItem.link"
          :disabled="subItem.status === false"
          @click="sheet = false"
        >
          <template #prepend>
            <v-icon
              v-if="subItem.icon_type === 'custom'"
              :class="subItem.icon"
            />
            <v-icon v-else>
              {{ subItem.icon }}
            </v-icon>
          </template>
          <v-list-item-title class="text-subtitle-1">
            {{ subItem.title }}
          </v-list-item-title>
        </v-list-item>
      </v-list>
    </v-bottom-sheet>
  </v-row>
  <!-- End dashboard mobile menu -->
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '#imports'

const router = useRouter()
const auth = useAuth()

const activeTab = ref(0)
const sheet = ref(false)
const subList = ref([])

const items = reactive([
  {
    title: 'Contents',
    icon: 'mdi-plus-circle-outline',
    link: '',
    machine_name: 'add_content',
    subMenuList: [
      {
        title: 'Paper',
        link: '/user/paper',
        icon: 'icong-test',
        icon_type: 'custom',
        status: auth.user?.group_id == '5' ? false : true,
      },
      {
        title: 'Multimedia',
        link: '/user/multimedia',
        icon: 'icong-learnfiles',
        icon_type: 'custom',
        status: auth.user?.group_id == '5' ? false : true,
      },
      {
        title: 'Q & A',
        link: '/user/question',
        icon: 'icong-qa',
        icon_type: 'custom',
      },
      {
        title: 'Blogs',
        link: '/user/blogs',
        icon: 'mdi-newspaper',
        icon_type: 'custom',
      },
    ],
  },
  {
    title: 'Online Exam',
    icon: 'mdi-laptop',
    link: '/test-maker',
    subMenuList: [
      {
        title: 'Results',
        link: '/exam/results',
        icon: 'mdi-chart-timeline',
        icon_type: 'custom',
      },
      {
        title: 'Exam maker',
        link: '/user/exam',
        icon: 'icong-azmoon',
        icon_type: 'custom',
      },
    ],
  },
  {
    title: 'Financial',
    icon: 'mdi-credit-card-outline',
    subMenuList: [
      {
        title: 'Wallet',
        link: '/user/wallet',
        icon: 'mdi-wallet',
      },
      {
        title: 'Top Up Wallet',
        icon: 'mdi-credit-card-plus-outline',
        link: '/user/charge-wallet',
      },
      { title: 'Payments', icon: 'mdi-link', link: '/user/payments' },
      {
        title: 'Sell Report',
        icon: 'mdi-chart-line',
        link: '/user/sell-report',
      },
      // { title: "Withdrawal", icon: "mdi-cash", link: "/user/withdrawal" },
    ],
  },
  { title: 'Messages', icon: 'mdi-email-outline', link: '/user/ticket' },
  {
    title: 'Profile',
    icon: 'mdi-account-outline',
    link: '',
    subMenuList: [
      {
        title: 'Edit Profile',
        link: '/user/profile',
        icon: 'mdi-account-outline',
      },
      {
        title: 'Confirm Identity',
        link: '/user/identity-confirmation',
        icon: 'mdi-card-account-details',
      },
      {
        title: 'Change Password',
        link: '/user/edit-pass',
        icon: 'mdi-key',
      },
      {
        title: 'Settings',
        link: '/user/setting',
        icon: 'mdi-account-cog-outline',
      },
    ],
  },
])

const openLink = (item) => {
  if (!item.subMenuList) {
    router.push(item.link)
  }
  else {
    subList.value = item.subMenuList
    sheet.value = true
  }
}
</script>

<style>
.fixed-tabs-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 2;
  border-top: 1px solid rgba(0, 0, 0, 0.12);
}

.tab_actived {
  color: #009688 !important;
}
</style>
