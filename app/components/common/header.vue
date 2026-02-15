<script setup>
import CommonLogin from '~/components/common/login.vue'
import CommonRegister from '~/components/common/register.vue'
import CommonRecover from '~/components/common/pass-recover.vue'
import { useAuth } from '~/composables/useAuth'
import { useCookie } from 'nuxt/app'
import { useDisplay } from 'vuetify'

defineProps({
  isUserDashboard: {
    type: Boolean,
    default: false,
  },
})

const auth = useAuth()
const { mdAndDown } = useDisplay()
const isAuthModalOpen = ref(false)
const currentAuthComponent = ref('')

const loginDialogVisible = ref(false)
const showSearchBottomSheet = ref(false)

const currentAuthComponentMap = {
  login: CommonLogin,
  register: CommonRegister,
  recover: CommonRecover,
}

function switchTo(name) {
  currentAuthComponent.value = name
}
const _dialog = ref(false)
const _logo = ref('mainlogo-gamatrain.png')
const _avatar = ref('dexter-morse.png')
const notificationComponent = ref(null)

const menuLink = [
  {
    title: 'Home',
    link: '/',
    icon: '',
  },
  {
    title: 'AI Assistant',
    link: '/ai',
    icon: 'md:smart_toy_outlined',
    badge: 'Beta',
  },
  {
    title: 'Leader Board',
    link: '/leader-board',
    icon: '',
  },
  {
    title: '$GET Token',
    link: '/get-token',
    icon: '',
  },
  {
    title: 'Governance',
    link: '/governance',
    icon: '',
  },
]
const currentOpenDialog = ref('')

const notificationListDialog = ref(false)
const notificationItems = [
  {
    icon: 'md:table_restaurant',
    date: 'Today, 11:48 am',
    title: 'Sample Question uploded',
    describe:
      'Satisfied course question sample has been uploaded for your level of education.',
  },
  {
    icon: 'md:where_to_vote',
    date: 'Today, 11:48 am',
    title: 'Sample Question uploded',
    describe:
      'Satisfied course question sample has been uploaded for your level of education.',
  },
]

const menuSetting = ref({
  logo: 'gamatrain-logo-black.svg',
  bgColor: '#fff',
  fixedStatus: false,
  linkColor: '#424A53',
  class: '',
})

const route = useRoute()
const router = useRouter()

const _cookieToken = useCookie('authToken')

onMounted(async () => {
  // if (window.innerWidth <= 960 && this.$auth.loggedIn) {
  //   this.$refs["notification-section"].getNotifications();
  // }
  if (
    route.name == 'index'
    || route.name == 'smart-learning'
    || route.name == 'services'
    || route.name == 'school-service'
    || route.name == 'faq'
    || route.name == 'governance'
    || route.name == 'terms'
    || route.name == 'about-us'
    || route.name == 'earn-money'
    || route.name == 'leader-board'
    || route.name == 'get-token'
  ) {
    if (window.scrollY > 60) {
      menuSetting.value = {
        logo: 'gamatrain-logo-black.svg',
        bgColor: '#fff',
        fixedStatus: true,
        linkColor: '#424A53',
        class: '',
      }
    }
    else {
      menuSetting.value = {
        logo: 'gamatrain-logo.svg',
        bgColor: '#000',
        fixedStatus: true,
        linkColor: '#fff',
        class: 'transparentMenu',
      }
    }
  }
  window.addEventListener('scroll', handleScroll)

  if (mdAndDown.value) {
    isDrawerOpen.value = false
  }
  else {
    isDrawerOpen.value = true
  }
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll)
})
const login_modal = ref(null)
const openLoginDialog = (componentName = 'login') => {
  currentAuthComponent.value = componentName
  isAuthModalOpen.value = true
  loginDialogVisible.value = true
}
const _openRegisterDialog = () => {
  register_modal.value.register_dialog = true
}

const handleScroll = () => {
  if (
    route.name == 'index'
    || route.name == 'smart-learning'
    || route.name == 'services'
    || route.name == 'school-service'
    || route.name == 'faq'
    || route.name == 'governance'
    || route.name == 'terms'
    || route.name == 'about-us'
    || route.name == 'earn-money'
    || route.name == 'leader-board'
    || route.name == 'get-token'
  )
    if (window.scrollY > 60) {
      menuSetting.value = {
        logo: 'gamatrain-logo-black.svg',
        bgColor: '#fff',
        fixedStatus: true,
        linkColor: '#424A53',
        class: '',
      }
    }
    else {
      menuSetting.value = {
        logo: 'gamatrain-logo.svg',
        bgColor: '#000',
        fixedStatus: true,
        linkColor: '#fff',
        class: 'transparentMenu',
      }
    }
}

watch(currentOpenDialog, (val) => {
  if (val === 'login') {
    register_modal.value.register_dialog = false
    pass_recover_modal.value.pass_recover_dialog = false
    login_modal.value.login_dialog = true
  }
  else if (val === 'register') {
    login_modal.value.login_dialog = false
    pass_recover_modal.value.pass_recover_dialog = false
    register_modal.value.register_dialog = true
  }
  else if (val === 'pass_recover') {
    login_modal.value.login_dialog = false
    register_modal.value.register_dialog = false
    pass_recover_modal.value.pass_recover_dialog = true
  }
  else {
    login_modal.value.login_dialog = false
    login_modal.value.register_dialog = false
    pass_recover_modal.value.pass_recover_dialog = false
  }
})

// Handle auth form from all of section
watch(
  () => route.query.auth_form,
  (val) => {
    if (val === 'login') {
      const noRedirect = !!route.query.auth_noredirect
      openLoginDialog()
      if (!noRedirect) router.push({ query: {} })
    }
    else if (val == 'register') {
      register_modal.value.register_dialog = true
      router.push({ query: {} })
    }
  },
)

watch(
  () => route.name,
  (val) => {
    if (
      val == 'index'
      || val == 'smart-learning'
      || val == 'services'
      || val == 'school-service'
      || val == 'faq'
      || val == 'governance'
      || val == 'terms'
      || val == 'about-us'
      || val == 'earn-money'
    ) {
      menuSetting.value = {
        logo: 'gamatrain-logo.svg',
        bgColor: '#000',
        fixedStatus: true,
        linkColor: '#fff',
        class: 'transparentMenu',
      }
    }
    else {
      menuSetting.value = {
        logo: 'gamatrain-logo-black.svg',
        bgColor: '#fff',
        fixedStatus: false,
        linkColor: '#424A53',
        class: '',
      }
    }
  },
)

const isDrawerOpen = ref(false)

const openNavigationMenu = () => {
  isDrawerOpen.value = true
}

const isAddOptionOpen = ref(false)

const openAddOption = () => {
  if (auth.isAuthenticated.value) {
    isAddOptionOpen.value = true
  }
  else {
    router.push({ query: { auth_form: 'login' } })
  }
}
</script>

<template>
  <div>
    <header id="main-header">
      <!-- Desktop menu -->

      <v-app-bar
        id="main-menu"
        flat
        :fixed="menuSetting.fixedStatus"
        :class="menuSetting.class"
        class="d-none d-md-block"
      >
        <v-container class="px-0">
          <v-row>
            <v-col
              cols="6"
              md="9"
              lg="10"
              xl="10"
            >
              <div class="d-flex align-center">
                <nuxt-link
                  to="/"
                  aria-label="Home Link"
                  class="pr-4 pl-4"
                >
                  <img
                    width="120"
                    height="32"
                    alt="Gamatrain"
                    :src="`/images/${menuSetting.logo}`"
                  >
                </nuxt-link>

                <div class="d-flex align-center">
                  <v-btn
                    v-for="(link, i) in menuLink"
                    :key="i"
                    tile
                    :to="link.link"
                    :color="menuSetting.linkColor"
                    text
                    class="text-transform-none text-h5 px-3"
                  >
                    <v-icon
                      v-if="link.icon"
                      class="mr-1"
                      size="20"
                      color="#FFB300"
                    >
                      {{ link.icon }}
                    </v-icon>
                    {{ link.title }}
                    <v-chip
                      v-if="link.badge"
                      color="primary"
                      class="ml-1"
                      density="compact"
                    >
                      {{ link.badge }}
                    </v-chip>
                  </v-btn>

                  <v-btn
                    tile
                    :color="menuSetting.linkColor"
                    text
                    class="text-transform-none text-h5 px-3"
                    @click="openAddOption"
                  >
                    <v-icon
                      class="mr-1"
                      size="20"
                      color="#FFB300"
                    >
                      md:add
                    </v-icon>
                    Add
                  </v-btn>
                </div>
              </div>
            </v-col>
            <v-col
              cols="4"
              md="3"
              lg="2"
              xl="2"
              class="d-flex align-center justify-end text-right"
            >
              <div
                v-if="auth.isAuthenticated.value"
                class="d-flex align-center justify-end"
              >
                <lazy-common-dropdown-menu :menu-setting="menuSetting" />

                <div class="wallet-div d-flex align-start justify-center">
                  <v-btn
                    to="/user/wallet"
                    variant="text"
                    color="transparent"
                    class="wallet-icon"
                    size="small"
                    aria-label="Wallet"
                    max-width="28"
                    height="28"
                  >
                    <v-icon
                      :color="menuSetting.linkColor"
                      size="24"
                    >
                      md:account_balance_wallet_outlined
                    </v-icon>
                  </v-btn>
                </div>

                <!-- Desktop version -->
                <lazy-common-notification-component
                  ref="notificationComponent"
                  :menu-setting="menuSetting"
                  class="d-none d-lg-block"
                />
              </div>
              <div v-else>
                <v-btn
                  rounded="pill"
                  height="36"
                  class="primary text-transform-none black--text mr-2 text-h5 font-weight-bold"
                  @click="openLoginDialog()"
                >
                  Sign in
                </v-btn>
              </div>
            </v-col>
          </v-row>
        </v-container>
      </v-app-bar>

      <div v-if="currentAuthComponent.length > 0 && loginDialogVisible">
        <component
          :is="currentAuthComponentMap[currentAuthComponent]"
          v-model:dialog="loginDialogVisible"
          @switch-to-login="switchTo('login')"
          @switch-to-register="switchTo('register')"
          @switch-to-recover="switchTo('recover')"
        />
      </div>
      <!-- End desktop menu -->

      <!-- Start:  show sidebar menu -->
      <lazy-dashboard-drawer-menu
        v-model:show-drawer="isDrawerOpen"
        :is-user-dashboard="isUserDashboard"
      />
      <!-- End:  show sidebar menu -->

      <!--   Start: navbar   main-container -->

      <!-- Mobile nav -->
      <v-app-bar
        class="d-block d-md-none mobile_bar top-0 px-5"
        fixed
        flat
        :class="menuSetting.class"
      >
        <v-icon
          class="pa-5"
          :class="menuSetting.bgColor == '#fff' ? '' : 'text-white'"
          role="button"
          aria-label="Open menu"
          @click="openNavigationMenu"
        >
          md:menu
        </v-icon>
        <!-- Logo section -->
        <nuxt-link
          to="/"
          aria-label="Home Link"
          class="py-4"
        >
          <img
            width="80"
            height="20"
            class="ml-2"
            alt="GamaTrain"
            :src="`/images/${menuSetting.logo}`"
          >
        </nuxt-link>
        <!-- End logo section -->

        <v-spacer />

        <!--   hamburgers-icon in mobile -->

        <div class="text-center mr-3">
          <v-icon
            :color="menuSetting.linkColor"
            class="pa-23"
            role="button"
            aria-label="Search"
            @click="showSearchBottomSheet = true"
          >
            md:search
          </v-icon>

          <lazy-common-general-search-mobile
            v-model:show-search-bottom-sheet="showSearchBottomSheet"
          />
        </div>

        <v-btn
          v-if="!auth.isAuthenticated.value"
          rounded="pill"
          height="36"
          class="primary text-transform-none black--text mr-2 text-h5 font-weight-bold"
          @click="openLoginDialog()"
        >
          Sign in
        </v-btn>
        <lazy-common-notification-component
          v-if="auth.isAuthenticated.value"
          ref="notificationComponent"
          :menu-setting="menuSetting"
          class="d-block d-lg-none"
        />
        <nuxt-link
          v-if="auth.isAuthenticated.value"
          to="/user/wallet"
          class="wallet-div wallet-mobile mr-3"
          aria-label="Wallet"
        >
          <v-icon
            class="wallet-icon"
            :color="menuSetting.linkColor"
          >md:account_balance_wallet_outlined</v-icon>
        </nuxt-link>
        <lazy-common-dropdown-menu
          v-if="auth.isAuthenticated.value"
          :menu-setting="menuSetting"
        />
      </v-app-bar>
      <!-- End mobile nav -->

      <!--   End: navbar   -->
    </header>

    <v-dialog
      v-model="notificationListDialog"
      fullscreen
      transition="dialog-bottom-transition"
      scrollable
    >
      <v-card id="notificationListCard">
        <v-card-text>
          <v-toolbar flat>
            <h2 class="main-title">
              Notifications
            </h2>
            <v-spacer />

            <v-btn
              icon
              @click="notificationListDialog = false"
            >
              <v-icon>md:close</v-icon>
            </v-btn>
          </v-toolbar>
          <v-list three-line>
            <v-list-item
              v-for="(item, index) in notificationItems"
              :key="index"
            >
              <template #prepend>
                <v-icon :icon="item.icon" />
              </template>

              <v-list-item>
                <div class="date">
                  {{ item.date }}
                </div>
                <v-list-item-title
                  class="title"
                  :title="item.title"
                />
                <v-list-item-subtitle
                  class="describe"
                  :title="item.describe"
                />
              </v-list-item>
            </v-list-item>
          </v-list>
        </v-card-text>
      </v-card>
    </v-dialog>

    <lazy-menu-add-option-bottom-menu
      v-if="isAddOptionOpen"
      @close="isAddOptionOpen = false"
    />
  </div>
</template>

<style scoped>
.v-application .primary {
  background-color: #ffb300 !important;
  border-color: #ffb300 !important;
}

.v-application .primary--text {
  color: #ffb300 !important;
}

.transparentMenu {
  background: transparent !important;
}

#main-header {
  .v-avatar {
    min-width: 2rem !important;
    width: 2rem !important;
    height: 2rem !important;
  }
}

.mobile_bar {
  z-index: 1005 !important;
}

.main-sidebar {
  z-index: 1006 !important;
}

@media (min-width: 600px) {
  #main-header {
    .v-avatar {
      min-width: 2.4rem !important;
      width: 2.4rem !important;
      height: 2.4rem !important;
    }
  }
}

@media (min-width: 960px) {
  #main-header {
    .menu-item:hover {
      border-bottom: 3px solid rgb(0, 139, 139);
    }
    .v-avatar {
      min-width: 2.8rem;
      width: 2.8rem;
      height: 2.8rem;
    }

    #main-menu {
      z-index: 1001;
      padding-bottom: 0.4rem;
      height: 6.4rem !important;

      .v-btn--active {
        .v-btn__overlay {
          opacity: 0;
        }
      }
      .v-btn--active:not(.wallet-icon) {
        border-bottom: 0.2rem solid #ffb300 !important;

        .v-btn__overlay {
          opacity: 0;
        }
      }
    }

    .menu_active {
      border-bottom: 4px solid white !important;
      background-color: rgba(255, 179, 0, 0.1) !important;
      color: #ffb300f3 !important;
    }

    .menu_group_active {
      border-bottom: 4px solid white !important;
      background-color: #e1e2e3;
      color: #000 !important;
    }

    .mobile_bar .v-toolbar__content {
      background: transparent;
      padding: 0 1.4rem 0 0.5rem !important;
    }
  }

  #notificationListCard {
    .main-title {
      color: #424a53;
      font-size: 1.6rem !important;
      font-style: normal;
      font-weight: 750;
      line-height: 4.4rem;
    }

    .v-list-item__icon {
      margin-right: 1rem;
    }

    .title {
      color: #424a53;
      font-size: 1.4rem;
      font-style: normal;
      font-weight: 500;
      line-height: 2rem;
    }

    .describe {
      color: #6e7781;
      font-size: 1.2rem;
      font-style: normal;
      font-weight: 300;
      line-height: 2rem;
    }

    .date {
      color: #6e7781;
      font-size: 1rem;
      font-style: normal;
      font-weight: 500;
    }
  }
}
</style>
