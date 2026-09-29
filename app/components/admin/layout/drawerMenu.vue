<template>
  <v-navigation-drawer
    v-model="drawerModel"
    :temporary="mdAndDown"
    expand-on-hover
    :class="`d-block bg-grey800 navigation-height-top`"
  >
    <v-list
      v-model:opened="openedGroups"
      density="compact"
      nav
      class="main-list"
    >
      <div class="w-100 d-flex justify-space-between align-center mt-2 px-2">
        <span class="text-h3 text-white font-weight-bold">Dashboard</span>
        <v-icon
          class="cursor-pointer d-flex d-lg-none"
          size="24"
          color="white"
          @click="closeNavigation"
        >
          md:close
        </v-icon>
      </div>

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
          :disabled="item.status"
        >
          <template #prepend>
            <v-icon
              size="24"
              color="white"
            >
              {{ item.icon }}
            </v-icon>
          </template>

          <v-list-item-title
            class="text-h5 font-weight-bold text-white text-item-height"
          >
            {{ item.title }}
          </v-list-item-title>
        </v-list-item>
        <v-list-group
          v-show="item.subMenuList"
          :key="item.title"
          :value="item.value"
        >
          <template #activator="{ props: activeMenuItem, isOpen }">
            <v-list-item
              v-bind="activeMenuItem"
              :class="`${
                isParentActive(item) ? 'custom-list-item' : ''
              }
                ${isParentActive(item) ? 'custom-list-item' : ''}
               rounded-lg mt-3`"
              role="listitem"
            >
              <template #prepend>
                <v-icon
                  color="white"
                  size="24"
                >
                  {{ item.icon }}
                </v-icon>
              </template>

              <v-list-item-title
                class="text-h5 font-weight-bold text-white text-item-height"
              >
                {{ item.title }}
              </v-list-item-title>

              <template #append>
                <v-icon
                  color="white"
                  size="20"
                >
                  {{ isOpen ? 'md:expand_less' : 'md:expand_more' }}
                </v-icon>
              </template>
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
              <v-icon
                color="white"
                size="24"
              >
                {{ subMenuItem.icon }}
              </v-icon>
            </template>
            <v-list-item-title
              class="text-h5 font-weight-bold text-white text-item-height"
            >
              {{ subMenuItem.title }}
            </v-list-item-title>
          </v-list-item>
        </v-list-group>
      </div>

      <div class="d-flex justify-space-between align-center ga-3 position-extra-link">
        <div class="d-flex align-center ga-1">
          <v-avatar
            v-if="user && user.avatarUri"
            :image="user.avatarUri"
            size="30"
            class="border-image"
          />
          <v-avatar
            v-else
            size="30"
            color="white"
          >
            <span
              v-if="user"
              class="text-h5 text-grey800"
            >{{
              user?.firstName ? user.firstName[0].toUpperCase() : "A"
            }}</span>
          </v-avatar>
          <div class="d-flex flex-column align-start justify-start">
            <span
              v-if="user"
              class="text-h5 font-weight-medium text-white text-truncate name-user-span"
            >
              {{ !user.firstName && !user.lastName ? `Admin` : (user.firstName ? user.firstName : "") + " "+ (user.lastName ? user.lastName : "") }}
            </span>
            <span class="text-h6 text-grey400">
              Admin@Gamatrain
            </span>
          </div>
        </div>
        <v-btn
          flat
          icon
          color="error"
          size="small"
          @click="logout"
        >
          <v-icon
            color="white"
            size="24"
          >
            md:exit_to_app
          </v-icon>
        </v-btn>
      </div>
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

const items = computed(() => [
  {
    title: 'Users',
    icon: 'md:user_attributes_outlined',
    value: 'users',
    subMenuList: [
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
      { title: 'Tags ', link: '/admin/tags', icon: 'md:sell_outlined' },
    ],
  },
  {
    title: 'Billing',
    icon: 'md:add_card_outlined',
    value: 'billing',
    subMenuList: [
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
  {
    title: 'Subscription',
    icon: 'md:card_membership_outlined',
    value: 'subscription',
    subMenuList: [
      {
        title: 'Users',
        link: '/admin/subscription/users',
        icon: 'md:manage_accounts_outlined',
      },
      {
        title: 'Usage',
        link: '/admin/subscription/usage',
        icon: 'md:query_stats',
      },
      {
        title: 'Commission ',
        link: '/admin/commission',
        icon: 'md:percent_outlined',
      },
    ],
  },
  {
    title: 'Blog',
    icon: 'md:article_outlined',
    value: 'blog',
    subMenuList: [
      { title: 'Blogs ', link: '/admin/blogs', icon: 'md:post_outlined' },
      { title: 'Comments ', link: '/admin/blogs/comments', icon: 'md:comment_outlined' },
    ],
  },
  {
    title: 'Type Managment',
    icon: 'md:ballot_outlined',
    value: 'typeManagment',
    subMenuList: [
      { title: 'Location', link: '/admin/Locations', icon: 'md:location_on_outlined' },
    ],
  },
  {
    title: 'School',
    icon: 'md:school_outlined',
    value: 'school',
    subMenuList: [
      {
        title: 'General ',
        link: '/admin/schools/contributions',
        icon: 'md:account_balance_outlined',
      },
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
  {
    title: 'Setting',
    icon: 'md:settings_outlined',
    value: 'setting',
    subMenuList: [
      {
        title: 'General',
        link: '/admin/settings',
        icon: 'md:settings_outlined',
      },
      {
        title: 'Languages',
        link: '/admin/languages',
        icon: 'md:language_outlined',
      },
      {
        title: 'Subscription',
        link: '/admin/subscription',
        icon: 'md:subscriptions_outlined',
      },
      {
        title: 'Nudge Email',
        link: '/admin/nudge-email',
        icon: 'md:mark_email_read_outlined',
      },
    ],
  },
  {
    title: 'Home',
    icon: 'md:home_outlined',
    value: 'home',
    link: '/',
  },
  {
    title: 'Dashboard',
    icon: 'md:dashboard_outlined',
    value: 'dashboard',
    link: '/admin',
  },
])

const openedGroups = ref([])

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
.v-navigation-drawer__scrim{
  min-height: 100vh;
}
.main-list {
  min-height: 100%;
}
:deep(.v-list-item__prepend .v-list-item__spacer) {
  width: 16px !important;
}

:deep(.main-list .v-list-item--active){
  background-color: rgb(var(--v-theme-grey500));
}
:deep(.main-list .v-list-item:hover) {
  background-color: rgb(var(--v-theme-grey400)) !important;
}
.text-item-height {
  line-height: 26px !important;
}
.custom-list-item {
  background-color: rgb(var(--v-theme-grey500));
}
.name-user-span{
  max-width : 150px;
}
.border-image {
  border: 2px solid rgb(var(--v-theme-white));
}
.position-extra-link {
  height: 20px;
  position: absolute;
  bottom: 20px;
}
</style>
