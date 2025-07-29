<template>
  <v-list density="compact">
    <div
      v-for="(item, index) in items"
      :key="item.title"
    >
      <v-list-item
        v-show="!item.subMenuList"
        link
        :to="item.link"
        class="py-2"
      >
        <!-- <template v-slot:prepend>
          <v-icon size="20" class="mr-2">{{ item.icon }}</v-icon>
        </template> -->
        <div class="d-flex align-center">
          <v-icon
            size="20"
            class="mr-2"
          >
            {{ item.icon }}
          </v-icon>
          <v-list-item-title>{{ item.title }}</v-list-item-title>
        </div>
      </v-list-item>
      <v-list-group
        v-show="item.subMenuList"
        :key="item.title"
        active-class="menu_group_active"
        :value="openGroups[index]"
        @click="toggleGroup(index)"
      >
        <template #activator="{ props }">
          <v-list-item
            v-bind="props"
            class="py-2"
          >
            <!-- <template v-slot:prepend>
              <v-icon size="20" class="mr-2">{{ item.icon }}</v-icon>
            </template> -->
            <div class="d-flex align-center">
              <v-icon
                size="20"
                class="mr-2"
              >
                {{ item.icon }}
              </v-icon>
              <v-list-item-title>{{ item.title }}</v-list-item-title>
            </div>
          </v-list-item>
        </template>

        <v-list-item
          v-for="(subMenuItem, side) in item.subMenuList"
          :key="side.title"
          class="pl-7 py-2"
          active-class="menu_active"
          :to="subMenuItem.link"
          :disabled="subMenuItem.status"
        >
          <v-list-item-title>{{ subMenuItem.title }}</v-list-item-title>
        </v-list-item>
      </v-list-group>
    </div>
  </v-list>
</template>

<script setup>
import { ref } from 'vue'
import { useUser } from '~/composables/useUser'

const { user } = useUser()
const openGroups = ref({})

const toggleGroup = (index) => {
  openGroups.value[index] = !openGroups.value[index]
}

const items = ref([
  {
    title: 'Contents',
    icon: 'mdi-plus-circle-outline',
    machine_name: 'add_content',
    subMenuList: [
      {
        title: 'Paper',
        link: '/user/paper',
        icon: 'icong-test',
        icon_type: 'custom',
        status: user.value.group_id == 5 ? false : true,
      },
      {
        title: 'Multimedia',
        link: '/user/multimedia',
        icon: 'icong-test',
        icon_type: 'custom',
        status: user.value.group_id == 5 ? false : true,
      },
      {
        title: 'Q & A',
        link: '/user/question',
        icon: 'icong-test',
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
    subMenuList: [
      {
        title: 'Results',
        link: '/exam/results',
        icon: 'icong-test',
        icon_type: 'custom',
      },
      {
        title: 'Exam maker',
        link: '/user/exam',
        icon: 'icong-test',
        icon_type: 'custom',
      },
    ],
  },
  {
    title: 'Financial',
    icon: 'mdi-credit-card-outline',
    subMenuList: [
      { title: 'Wallet', link: '/user/wallet' },
      { title: 'Top Up Wallet', link: '/user/charge-wallet' },
      { title: 'Payments', link: '/user/payments' },
      { title: 'Sell Report', link: '/user/sell-report' },
      // { title: "Withdrawal", link: "/user/withdrawal" },
    ],
  },
  { title: 'Messages', icon: 'mdi-email-outline', link: '/user/ticket' },
  {
    title: 'Profile',
    icon: 'mdi-account-outline',
    link: '',
    subMenuList: [
      { title: 'Edit Profile', link: '/user/profile' },
      { title: 'Confirm Identity', link: '/user/identity-confirmation' },
      { title: 'Change Password', link: '/user/edit-pass' },
      { title: 'Settings', link: '/user/setting' },
    ],
  },
])
</script>

<style scoped>
.v-list-item__prepend {
  margin-right: 12px !important;
}

.menu_active {
  background-color: rgba(var(--v-theme-primary), 0.1);
  color: rgb(var(--v-theme-primary));
  border-radius: 4px;
}

.menu_group_active {
  background-color: transparent;
}

.v-list-group__items .v-list-item {
  padding-left: 12px;
  min-height: 40px;
}

.v-list-item {
  min-height: 44px;
}
</style>
