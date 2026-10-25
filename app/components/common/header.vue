<template>
  <header
    class="w-100 position-fixed top-0 main-header d-flex align-center justify-center"
    :style="{ backgroundColor: menuSetting.bgColor, boxShadow: menuSetting.boxShadow }"
  >
    <v-container class="d-flex align-center justify-space-between">
      <div class="logo-link d-flex align-center ga-4">
        <v-icon
          :color="menuSetting.linkColor"
          role="button"
          aria-label="Open menu"
          class="cursor-pointer d-flex d-md-none"
          @click="openNavigationMenu"
        >
          md:menu
        </v-icon>
        <nuxt-link
          to="/"
          aria-label="Home Link"
        >
          <img
            width="120"
            height="32"
            alt="Gamatrain"
            class="logo-image"
            :src="`/images/${menuSetting.logo}`"
          >
        </nuxt-link>

        <div class="d-none d-md-flex align-end">
          <template
            v-for="(link, i) in menuLink"
            :key="i"
          >
            <nuxt-link
              v-if="link.link"
              :to="link.link"
              class="text-transform-none text-h5 px-3 d-flex align-end ga-2 position-relative py-2 rounded-sm cursor-pointer"
              active-class="nav-link-active"
            >
              <v-icon
                v-if="link.icon"
                size="20"
                color="primary"
              >
                {{ link.icon }}
              </v-icon>
              <span :style="{ color: menuSetting.linkColor }">{{ link.title }}</span>
              <!-- <span
                v-if="link.badge"
                class="text-primary text-subtitle-2 py-1 px-2 rounded-pill badge-header"
              >
                {{ link.badge }}
              </span> -->
            </nuxt-link>

            <span
              v-else
              class="text-transform-none text-h5 px-3 d-flex align-end ga-2 position-relative py-2 rounded-sm cursor-pointer"
              @click="link.action && link.action()"
            >
              <v-icon
                v-if="link.icon"
                size="20"
                color="primary"
              >
                {{ link.icon }}
              </v-icon>
              <span :style="{ color: menuSetting.linkColor }">{{ link.title }}</span>
              <!-- <span
                v-if="link.badge"
                class="text-primary text-subtitle-2 py-1 px-2 rounded-pill badge-header"
              >
                {{ link.badge }}
              </span> -->
            </span>
          </template>
        </div>
      </div>
      <div class="d-flex align-center ga-3 action-button">
        <v-icon
          :color="menuSetting.linkColor"
          role="button"
          aria-label="Open Search"
          class="cursor-pointer d-flex d-md-none"
          @click="showSearchBottomSheet = true"
        >
          md:search
        </v-icon>
        <template v-if="isAuthenticated">
          <lazy-common-dropdown-menu :menu-setting="menuSetting" />

          <nuxt-link
            to="/user/ticket"
            aria-label="Notification"
          >
            <v-icon
              :color="menuSetting.linkColor"
              size="24"
            >
              md:notifications_outlined
            </v-icon>
          </nuxt-link>
        </template>
        <v-btn
          v-else
          rounded="pill"
          height="36"
          color="primary"
          flat
          class="text-black text-h5 font-weight-bold "
          @click="openLoginDialog"
        >
          Sign in
        </v-btn>
      </div>
    </v-container>

    <lazy-common-modal-auth
      v-if="shouldMountAuthModal"
      v-model:show-dialog="showAuthModal"
      @login-successfull="goToRedirectAfterLogin"
    />

    <lazy-common-modal-base
      v-model:show-dialog="isAddOptionOpen"
      title="What would you like to publish?"
      :max-width="560"
    >
      <menu-add-option-bottom-menu
        @close="isAddOptionOpen = false"
      />
    </lazy-common-modal-base>

    <ClientOnly>
      <lazy-dashboard-drawer-menu
        v-if="shouldMountDrawer"
        v-model:show-drawer="isDrawerOpen"
        :is-user-dashboard="isUserDashboard"
      />
    </ClientOnly>
    <lazy-common-general-search-mobile
      v-if="showSearchBottomSheet"
      v-model:show-search-bottom-sheet="showSearchBottomSheet"
    />
  </header>
</template>

<script setup lang="ts">
import { useTheme, useDisplay } from 'vuetify'

interface IHeader {
  isUserDashboard?: boolean
}
interface MenuSetting {
  logo: string
  bgColor: string
  boxShadow: string
  linkColor: string
}

const route = useRoute()
const router = useRouter()
const theme = useTheme()
const { isAuthenticated } = useAuth()
const { mdAndDown } = useDisplay()

const props = withDefaults(defineProps<IHeader>(), {
  isUserDashboard: false,
})

const menuLink = [
  {
    title: 'Home',
    link: '/',
    icon: '',
  },
  {
    title: 'About us',
    link: '/about-us',
  },
  {
    title: 'FAQ',
    link: '/faq',
  },
  {
    title: 'Services',
    link: '/services',
  },
  // {
  // title: 'AI Assistant',
  // link: '/ai',
  // icon: 'md:smart_toy_outlined',
  // badge: 'Beta',
  // },
  // {
  //   title: 'Leader Board',
  //   link: '/leader-board',
  //   icon: '',
  // },
  // {
  // title: 'Governance',
  // link: '/governance',
  // icon: '',
  // },
  {
    title: 'Add',
    icon: 'md:add',
    action: () => openAddOption(),
  },
]
const blackMenuSetting: MenuSetting = {
  logo: 'gamatrain-logo.svg',
  bgColor: 'transparent',
  boxShadow: '',
  linkColor: theme.current.value.colors['white']!,
}
const whiteMenuSetting: MenuSetting = {
  logo: 'gamatrain-logo-black.svg',
  bgColor: theme.current.value.colors['white']!,
  boxShadow: '0px 1px 10px 0px #424A5340',
  linkColor: theme.current.value.colors['grey800']!,
}
const menuSetting = ref<MenuSetting>(whiteMenuSetting)

const routeNeedChangeMenuSetting = ['index', 'smart-learning', 'services', 'school-service', 'faq', 'governance', 'terms', 'about-us', 'earn-money', 'leader-board', 'get-token']

const handleChnageMenuSetting = () => {
  if (routeNeedChangeMenuSetting.includes(route.name as string)) {
    menuSetting.value = window.scrollY > 60 ? whiteMenuSetting : blackMenuSetting
  }
  else {
    menuSetting.value = whiteMenuSetting
  }
}

const showAuthModal = ref(false)
const shouldMountAuthModal = ref(false)

const openLoginDialog = async () => {
  shouldMountAuthModal.value = true
  await nextTick()
  showAuthModal.value = true
}

// A button that needs sign-in opens the dialog by setting ?auth_form=login (with auth_noredirect, which keeps it).
// Closing the dialog left it in the URL, so the next click set the same query, nothing changed, and the dialog never
// opened again. Drop it on close; the rest of the query stays.
watch(showAuthModal, (open) => {
  if (open || !route.query.auth_form) return
  const { auth_form: _form, auth_noredirect: _noRedirect, ...query } = route.query
  router.replace({ query })
})

const isAddOptionOpen = ref(false)
const openAddOption = () => {
  if (isAuthenticated.value) {
    isAddOptionOpen.value = true
  }
  else {
    router.push({ query: { auth_form: 'login' } })
  }
}

const isDrawerOpen = ref(false)
const openNavigationMenu = () => {
  isDrawerOpen.value = true
}
const syncDrawerWithDisplay = () => {
  isDrawerOpen.value = props.isUserDashboard && !mdAndDown.value
}
const shouldMountDrawer = computed(() => {
  if (props.isUserDashboard) {
    if (mdAndDown.value) {
      return isDrawerOpen.value
    }
    return true
  }

  return mdAndDown.value && isDrawerOpen.value
})

const showSearchBottomSheet = ref(false)

watch(
  () => route.name,
  () => {
    handleChnageMenuSetting()
  },
)

// Where to send the user after they sign in, when the auth middleware sent them here from a protected page.
const redirectAfterLogin = ref<string | null>(null)

const handleAuthFormQuery = () => {
  if (route.query.auth_form !== 'login') return
  const noRedirect = !!route.query.auth_noredirect
  redirectAfterLogin.value = getSafeAuthRedirect(route.query[AUTH_REDIRECT_QUERY_KEY])
  openLoginDialog()
  if (!noRedirect) router.push({ query: {} })
}

const goToRedirectAfterLogin = () => {
  const target = redirectAfterLogin.value
  redirectAfterLogin.value = null
  if (target) router.push(target)
}

watch(
  () => route.query.auth_form,
  handleAuthFormQuery,
)

watch(
  mdAndDown,
  syncDrawerWithDisplay,
  { immediate: true },
)

onMounted(async () => {
  handleChnageMenuSetting()
  // A page can load with ?auth_form=login already set (the auth middleware redirect), which the watcher never sees.
  handleAuthFormQuery()
  window.addEventListener('scroll', handleChnageMenuSetting)

  requestIdleCallback?.(() => {
    import('@/components/common/modal/auth/index.vue')
  })
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleChnageMenuSetting)
})
</script>

<style scoped>
.main-header{
  height : 64px;
  z-index : 1005;
}
.badge-header{
  background-color : rgba(var(--v-theme-primary), 0.2)
}
.nav-link-active{
  background-color : rgba(var(--v-theme-grey400), 0.3)
}
.nav-link-active::after {
  content: "";
  position: absolute;
  left: 0;
  bottom : 0;
  width: 100%;
  height: 2px;
  background-color: rgb(var(--v-theme-primary));
}
.logo-image{
  width: 120px;
  height : 32px
}
@media (max-width: 960px) {
  .logo-image{
    width: 80px;
    height : 20px
  }
  .main-header{
   z-index : 1003;
  }
}
</style>
