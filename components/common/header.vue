<script setup>
import CommonLogin from '~/components/common/login.vue'
import CommonRegister from '~/components/common/register.vue'
import CommonRecover from '~/components/common/pass-recover.vue'
import { useAuth } from '~/composables/useAuth'
import { useUser } from '~/composables/useUser'
import { useCookie } from 'nuxt/app'

const auth = useAuth()
const isAuthModalOpen = ref(false)
const currentAuthComponent = ref('login')

const loginDialogVisible = ref(false)

const currentAuthComponentMap = {
  login: CommonLogin,
  register: CommonRegister,
  recover: CommonRecover,
}

function switchTo(name) {
  currentAuthComponent.value = name
}
const sidebar = ref(false)
const _dialog = ref(false)
const _logo = ref('mainlogo-gamatrain.png')
const _avatar = ref('dexter-morse.png')
const notificationComponent = ref(null)
const menuItems = [
  {
    title: 'About us',
    link: '/about-us',
    icon: 'mdi-account-multiple',
    icon_color: '',
  },
  {
    title: 'Services',
    link: '/services',
    icon: 'mdi-view-module',
    icon_color: '',
  },
  {
    title: 'Faq',
    link: '/faq',
    icon: 'mdi-information',
    icon_color: '',
  },
  {
    title: '$GET Token',
    link: '/get-token',
    icon: 'mdi-currency-usd',
    icon_color: '',
  },

  // {
  //   title: "Offers",
  //   link: "/offers",
  //   icon: "mdi-wallet-giftcard",
  //   icon_color: 'primary'
  // },
]
const _selectedItem = 1
const _socialList = [
  { link: 'telegram', icon: 'fa-telegram' },
  { link: 'twitter', icon: 'fa-twitter' },
  { link: 'instagram', icon: 'fa-instagram' },
  { link: 'Youtube', icon: 'fa-youtube' },
]

const menuLink = [
  {
    title: 'Home',
    link: '/',
    icon: '',
  },
  {
    title: 'About us',
    link: '/about-us',
    icon: '',
  },
  {
    title: 'Services',
    link: '/services',
    icon: '',
  },
  {
    title: 'FAQ',
    link: '/faq',
    icon: '',
  },
  {
    title: '$GET Token',
    link: '/get-token',
    icon: '',
  },
  // {
  //   title: 'Offers',
  //   link: '/offers',
  //   icon: 'mdi-wallet-giftcard'
  // },
]
const currentOpenDialog = ref('')
const mobileSearchSheet = ref(false)
const mobileSearchSheetConfig = ref({
  isDragging: false,
  startDragY: 0,
  sheetHeight: 70,
})
const searchFilterItems = [
  {
    title: 'Past Papers',
    key: 'paper',
  },
  {
    title: 'Multimedia',
    key: 'multimedia',
  },
  {
    title: 'QuizHub',
    key: 'exam',
  },
  {
    title: 'Forum',
    key: 'q-a',
  },
  {
    title: 'Tutorial',
    key: 'tutorial',
  },
  {
    title: 'Teacher',
    key: 'teacher',
  },
  {
    title: 'Student',
    key: 'student',
  },
]
const mobileSearchFilter = ref('')
const _keyword = ref('')

const user_profile_items = [
  {
    title: 'Dashboard',
    icon: 'mdi-view-dashboard',
    link: '/user',
  },
  {
    title: 'Messages',
    icon: 'mdi-email-outline',
    link: '/user/ticket',
  },
  {
    title: 'Edit Profile',
    icon: 'mdi-account-outline',
    link: '/user/profile',
  },
  {
    title: 'Change Password',
    icon: 'mdi-key',
    link: '/user/edit-pass',
  },
]
const notificationListDialog = ref(false)
const notificationItems = [
  {
    icon: 'mdi-table-furniture',
    date: 'Today, 11:48 am',
    title: 'Sample Question uploded',
    describe:
      'Satisfied course question sample has been uploaded for your level of education.',
  },
  {
    icon: 'mdi-map-marker-check',
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

// Search section
const searchResults = ref([])
const searchCount = ref('...')
const searchKey = ref('')
const _searchCate = ref('')
const searchLoading = ref(true)
const pageNum = ref(1)
const timer = ref(0)
const searchResultsSection = ref(false)
const allDataLoaded = ref(false)
// End search section

const route = useRoute()
const router = useRouter()

const _cookieToken = useCookie('authToken')
const { user, _setUser, cleanUser } = useUser()

const logout = () => {
  cleanUser()
  auth.logout()
}

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
    || route.name == 'terms'
    || route.name == 'about-us'
    || route.name == 'earn-money'
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
    || route.name == 'terms'
    || route.name == 'about-us'
    || route.name == 'earn-money'
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
const _setActiveFilter = (val) => {
  mobileSearchFilter.value = val
}

// Search section
const mobileSearchResult = ref(null)
const lineSpecifierLoadMoreMobileRef = ref(null)
const checkSearchScroll = () => {
  const targetDiv = lineSpecifierLoadMoreMobileRef.value
  const rect = targetDiv.getBoundingClientRect()
  const isDivInView = rect.top >= 0 && rect.bottom <= window.innerHeight

  if (isDivInView && !searchLoading.value && !allDataLoaded.value) {
    pageNum.value++
    search()
  }
}

const search = () => {
  searchLoading.value = true
  if (timer.value) {
    clearTimeout(timer.value)
    timer.value = null
  }

  timer.value = setTimeout(async () => {
    if (searchKey.value && allDataLoaded.value == false) {
      try {
        const params = {
          query: searchKey.value,
          page: pageNum.value,
        }
        const response = await $fetch('/api/v1/search/text', {
          params,
        })
        if (response.data) {
          searchCount.value = response.data.num
          searchResults.value.push(...response.data.list)

          if (response.data.list.length < 20) {
            allDataLoaded.value = true
          }
        }
      }
      catch (error) {
        console.log(error)
      }
      finally {
        searchLoading.value = false
      }
    }
  }, 800)
}

const closeSearch = () => {
  searchResultsSection.value = false
  searchKey.value = ''
}
const calcPath = (type) => {
  if (type == 'gama_tests') return 'paper'
  else if (type == 'gama_learnfiles' || type == 'gama_files')
    return 'multimedia'
  else if (type == 'gama_azmoons') return 'exams'
  else if (type == 'gama_questions') return 'qa'
  else if (type == 'gama_dars') return 'tutorial'
  else if (type == 'gama_teachers') return 'teacher'
  else if (type == 'gama_schools') return 'school'
  else if (type == 'gama_live') return 'live'
  else if (type == 'gama_students') return 'student'
  else return '/'
}

const startDrag = (e) => {
  mobileSearchSheetConfig.value.isDragging = true
  mobileSearchSheetConfig.value.startDragY = e.touches[0].clientY
}
const handleDrag = () => {
  if (mobileSearchSheetConfig.value.isDragging) {
    e.preventDefault()

    const currentY = e.touches[0].clientY
    const dragDistance = mobileSearchSheetConfig.value.startDragY - currentY
    const viewportHeight = window.innerHeight

    const currentHeight = mobileSearchSheetConfig.value.sheetHeight
    const newHeightVH = currentHeight + (dragDistance / viewportHeight) * 100

    // Limit the newHeightVH to reasonable values
    const newHeight = Math.min(Math.max(newHeightVH, 10), 100) // 10vh to 100vh

    mobileSearchSheetConfig.value.sheetHeight = newHeight
    mobileSearchSheetConfig.value.startDragY = currentY
  }
}
const endDrag = (_e) => {
  mobileSearchSheetConfig.value.isDragging = false
  if (mobileSearchSheetConfig.value.sheetHeight < 30)
    mobileSearchSheet.value = false
}
// End search section
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
      // login_modal.value.login_dialog = true;
      openLoginDialog()
      router.push({ query: {} })
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
    mobileSearchSheet.value = false

    if (
      val == 'index'
      || val == 'smart-learning'
      || val == 'services'
      || val == 'school-service'
      || val == 'faq'
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

watch(
  () => searchKey.value,
  (val) => {
    if (val.trim() === '') {
      searchResultsSection.value = false
    }
    else {
      searchResultsSection.value = true
    }
    pageNum.value = 1
    searchCount.value = '...'
    allDataLoaded.value = false
    searchResults.value = []
    search()
  },
)

watch(
  () => mobileSearchSheet.value,
  (val) => {
    if (val == true) mobileSearchSheetConfig.value.sheetHeight = 70
  },
)
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
        class="d-none d-lg-block"
      >
        <v-container class="px-0">
          <v-row>
            <v-col
              cols="6"
              md="9"
              lg="9"
              xl="9"
            >
              <div class="d-flex">
                <nuxt-link to="/">
                  <img
                    id="main-logo"
                    alt="Gamatrain"
                    :src="`/images/${menuSetting.logo}`"
                  >
                </nuxt-link>

                <div class="pt-2">
                  <v-btn
                    v-for="(link, i) in menuLink"
                    :key="i"
                    tile
                    :to="link.link"
                    :color="menuSetting.linkColor"
                    text
                    class="mx-2 mx-md-0 mx-lg-2 text-transform-none gtext-t4"
                  >
                    <v-icon
                      v-if="link.icon"
                      class="mb-2 mr-1"
                      color="#FFB300"
                    >
                      {{ link.icon }}
                    </v-icon>
                    {{ link.title }}
                  </v-btn>
                </div>
              </div>
            </v-col>
            <v-col
              cols="4"
              md="3"
              lg="3"
              xl="3"
              class="text-right mt-md-1"
            >
              <div
                v-if="auth.isAuthenticated.value"
                class="d-flex text-right align-md-center"
              >
                <v-spacer />
                <v-menu
                  transition="slide-x-transition"
                  offset-y
                  min-width="150"
                >
                  <template #activator="{ props }">
                    <div
                      v-bind="props"
                      class="d-flex"
                    >
                      <div
                        :id="
                          menuSetting.bgColor == '#fff'
                            ? 'header-username-dark'
                            : 'header-username-light'
                        "
                        class="gama-text-subtitle1"
                      >
                        {{ user?.first_name || user?.last_name || "NO NAME" }}
                      </div>
                      <v-avatar
                        v-if="user?.avatar"
                        size="32"
                      >
                        <v-img
                          :src="user?.avatar"
                          alt="user avatar"
                        />
                      </v-avatar>
                      <v-icon
                        v-else
                        :color="menuSetting.linkColor"
                      >
                        mdi-account
                      </v-icon>
                    </div>
                  </template>
                  <v-list>
                    <v-list-item
                      v-for="(item, i) in user_profile_items"
                      :key="i"
                      :to="item.link"
                    >
                      <template #prepend>
                        <v-icon
                          size="small"
                          class="mr-0 nt"
                        >
                          {{ item.icon }}
                        </v-icon>
                      </template>
                      <v-list-item-title>
                        {{ item.title }}
                      </v-list-item-title>
                    </v-list-item>
                    <v-list-item
                      class="pointer"
                      @click="logout"
                    >
                      <template #prepend>
                        <v-icon
                          size="small"
                          class="mr-0"
                        >
                          mdi-logout
                        </v-icon>
                      </template>
                      <v-list-item-title> Logout </v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-menu>

                <div class="wallet-div">
                  <v-btn
                    to="/user/wallet"
                    icon
                    variant="text"
                    class="wallet-icon pt-1"
                    :color="menuSetting.linkColor"
                    size="small"
                  >
                    <v-icon>mdi-wallet-outline</v-icon>
                  </v-btn>
                </div>

                <!-- Desktop version -->
                <common-notification-component
                  ref="notificationComponent"
                  :menu-setting="menuSetting"
                  class="d-none d-lg-block"
                />
              </div>
              <div v-else />
              <div>
                <v-btn
                  v-if="!auth.isAuthenticated.value"
                  rounded
                  class="primary text-transform-none black--text"
                  large
                  @click="openLoginDialog()"
                >
                  Sign in
                </v-btn>
              </div>
            </v-col>
          </v-row>
        </v-container>
      </v-app-bar>

      <div>
        <!-- Login component -->
        <component
          :is="currentAuthComponentMap[currentAuthComponent]"
          v-model:dialog="loginDialogVisible"
          @switch-to-login="switchTo('login')"
          @switch-to-register="switchTo('register')"
          @switch-to-recover="switchTo('recover')"
        />
        <!-- End login component -->

        <!-- Register component -->
        <!-- <common-register
          ref="register_modal"
          :switchToLogin.sync="currentOpenDialog"
        /> -->
        <!-- End register component -->

        <!-- Recover password component -->
        <!-- <common-pass-recover
          ref="pass_recover_modal"
          :switchToLogin.sync="currentOpenDialog"
          :switchToRegister.sync="currentOpenDialog"
        /> -->
        <!-- End recover password component -->
      </div>
      <!-- End desktop menu -->

      <v-navigation-drawer
        v-model="sidebar"
        :model-value="sidebar"
        temporary
        location="left"
        class="hidden-lg-and-up main-sidebar"
        :mobile="true"
      >
        <v-list density="compact">
          <!-- Profile Info -->
          <v-list-group
            v-if="auth.isAuthenticated.value"
            active-class="menu_group_active"
          >
            <template #activator="{ props }">
              <v-list-item v-bind="props">
                <v-icon icon="mdi-account-outline" />
                <v-list-item-title>
                  {{ user?.first_name || user?.last_name || "No name" }}
                </v-list-item-title>
              </v-list-item>
            </template>

            <v-list-item
              v-for="(item, i) in user_profile_items"
              :key="i"
              link
            >
              <template #prepend>
                <v-icon :icon="item.icon" />
              </template>
              <v-list-item-title>{{ item.title }}</v-list-item-title>
            </v-list-item>

            <v-list-item @click="logout">
              <template #prepend>
                <v-icon icon="mdi-exit-to-app" />
              </template>
              <v-list-item-title>Logout</v-list-item-title>
            </v-list-item>
          </v-list-group>

          <!-- Notifications -->
          <v-list-item
            v-if="auth.isAuthenticated.value"
            @click="notificationListDialog = true"
          >
            <template #prepend>
              <v-badge
                overlap
                content="3"
              >
                <v-icon icon="mdi-bell-outline" />
              </v-badge>
            </template>
            <v-list-item-title> Notification </v-list-item-title>
          </v-list-item>

          <!-- Login Button -->
          <v-list-item
            v-if="!auth.isAuthenticated.value"
            @click="openLoginDialog()"
          >
            <template #prepend>
              <v-icon icon="mdi-account-outline" />
            </template>
            <v-list-item-title>
              <span class="primary--text">Sign in</span> / Sign up
            </v-list-item-title>
          </v-list-item>

          <!-- Menu Items -->
          <div
            v-for="(item, index) in menuItems"
            :key="index"
          >
            <!-- Normal Items -->
            <v-list-item
              v-if="!item.subMenuList"
              :to="item.link"
            >
              <template #prepend>
                <v-icon
                  :icon="item.icon"
                  :color="item.icon_color"
                />
              </template>
              <v-list-item-title>{{ item.title }}</v-list-item-title>
            </v-list-item>

            <!-- Submenu Items -->
            <v-list-group
              v-else
              active-class="menu_group_active"
              no-action
            >
              <template #activator="{ props }">
                <v-list-item v-bind="props">
                  <v-list-item-title>{{ item.title }}</v-list-item-title>
                </v-list-item>
              </template>

              <v-list-item
                v-for="(subMenuItem, subIndex) in item.subMenuList"
                :key="subIndex"
                :to="subMenuItem.link"
              >
                <v-list-item-title>{{ subMenuItem.title }}</v-list-item-title>
              </v-list-item>
            </v-list-group>
          </div>
        </v-list>
      </v-navigation-drawer>

      <!-- End:  show sidebar menu in mobile -->

      <!--   Start: navbar   main-container -->

      <!-- Mobile nav -->
      <v-app-bar
        class="d-block d-lg-none mobile_bar top-0 px-5"
        fixed
        flat
        :class="menuSetting.class"
      >
        <v-icon
          class="px-2"
          :class="menuSetting.bgColor == '#fff' ? '' : 'text-white'"
          @click="sidebar = !sidebar"
        >
          mdi-menu
        </v-icon>
        <!-- Logo section -->
        <nuxt-link to="/">
          <img
            id="main-logo"
            :src="`/images/${menuSetting.logo}`"
          >
        </nuxt-link>
        <!-- End logo section -->

        <v-spacer />

        <!--   hamburgers-icon in mobile -->

        <div class="text-center">
          <v-bottom-sheet v-model="mobileSearchSheet">
            <template #activator="{ props }">
              <v-icon
                v-bind="props"
                :color="menuSetting.linkColor"
                class="pa-23"
              >
                mdi-magnify
              </v-icon>
            </template>
            <v-sheet
              id="mobile-search-sheet"
              :height="`${mobileSearchSheetConfig.sheetHeight}vh`"
            >
              <div
                id="search-sheet-handler-holder"
                @touchstart="startDrag"
                @touchend="endDrag"
                @touchmove="handleDrag"
              >
                <div id="search-sheet-handler" />
              </div>

              <v-slide-group
                id="search-cate-slide"
                v-model="mobileSearchFilter"
                show-arrows
                class="pt-1"
              >
                <v-slide-group-item
                  v-for="(item, n) in searchFilterItems"
                  :key="n"
                  v-slot="{ isSelected, toggle }"
                  :value="item.key"
                >
                  <div
                    class="ma-4"
                    @click="toggle"
                  >
                    <div
                      :class="`${
                        isSelected
                          ? `active-avatar active-${item.key}-avatar`
                          : ``
                      }`"
                    >
                      <div :class="`avatar ${item.key}-avatar`">
                        <span :class="`icon icon-${item.key}`" />
                      </div>
                    </div>
                    <div class="gama-text-caption">
                      {{ item.title }}
                    </div>
                  </div>
                </v-slide-group-item>
              </v-slide-group>
              <v-card flat>
                <v-card flat>
                  <div id="keyword-card">
                    <v-row>
                      <v-col
                        cols="12"
                        class="pb-0 px-6"
                      >
                        <v-text-field
                          v-model="searchKey"
                          label="Ex: Paper Summer Session"
                          prepend-inner-icon="mdi-magnify"
                          glow
                          variant="outlined"
                          color="#FFB600"
                          icon-color="#FFB600"
                          density="compact"
                          rounded="xl"
                          clearable
                          autocomplete="off"
                          class="w-100"
                          @click:clear="closeSearch"
                        >
                          <template #append-inner>
                            <v-icon
                              class="mr-n3"
                              color="#FFB600"
                              width="70"
                              height="30"
                              rounded="xl"
                            >
                              mdi-close-circle
                            </v-icon>
                          </template>
                          <template #append-outer>
                            <v-btn
                              dense
                              color="#FFB300"
                              class="text-white"
                            >
                              <v-icon>mdi-magnify</v-icon>
                            </v-btn>
                          </template>
                        </v-text-field>
                      </v-col>
                      <v-col
                        cols="12"
                        class="pt-0"
                      >
                        <div
                          v-if="searchResultsSection"
                          id="mobile-search-result-container"
                        >
                          <div
                            id="search-result"
                            ref="mobileSearchResult"
                            @scroll="checkSearchScroll"
                          >
                            <div id="result-stat">
                              <span class="gama-text-overline">
                                Search result
                              </span>
                              <span class="gama-text-button">
                                {{ searchCount }}
                              </span>
                            </div>
                            <div v-if="searchCount > 0">
                              <v-row
                                v-for="(item, index) in searchResults"
                                :key="index"
                                class="list-item"
                              >
                                <v-col cols="1">
                                  <nuxt-link
                                    :to="`/${calcPath(item.type)}/${item.id}`"
                                  >
                                    <div
                                      v-if="item.type == 'gama_tests'"
                                      class="avatar paper-avatar"
                                    >
                                      <span class="icon icon-paper" />
                                    </div>
                                    <div
                                      v-else-if="
                                        item.type == 'gama_learnfiles'
                                          || item.type == 'gama_files'
                                      "
                                      class="avatar multimedia-avatar"
                                    >
                                      <span class="icon icon-multimedia" />
                                    </div>
                                    <div
                                      v-else-if="item.type == 'gama_azmoons'"
                                      class="avatar exam-avatar"
                                    >
                                      <span class="icon icon-exam" />
                                    </div>
                                    <div
                                      v-else-if="item.type == 'gama_questions'"
                                      class="avatar qa-avatar"
                                    >
                                      <span class="icon icon-q-a" />
                                    </div>
                                    <div
                                      v-else-if="item.type == 'gama_dars'"
                                      class="avatar tutorial-avatar"
                                    >
                                      <span class="icon icon-tutorial" />
                                    </div>
                                    <div
                                      v-else-if="item.type == 'gama_teachers'"
                                      class="avatar teacher-avatar"
                                    >
                                      <span class="icon icon-teacher" />
                                    </div>
                                    <div
                                      v-else-if="item.type == 'gama_schools'"
                                      class="avatar school-avatar"
                                    >
                                      <span class="icon icon-school" />
                                    </div>
                                    <div
                                      v-else-if="item.type == 'gama_live'"
                                      class="avatar live-avatar"
                                    >
                                      <span class="icon icon-live" />
                                    </div>
                                    <div
                                      v-else-if="item.type == 'gama_students'"
                                      class="avatar student-avatar"
                                    >
                                      <span class="icon icon-live" />
                                    </div>
                                  </nuxt-link>
                                </v-col>
                                <v-col cols="11">
                                  <div class="gama-text-button ml-2">
                                    <nuxt-link
                                      :to="`/${calcPath(item.type)}/${item.id}`"
                                    >{{ item.title }}</nuxt-link>
                                  </div>
                                  <div class="chip-container ml-2">
                                    <div
                                      v-if="item.lesson_title"
                                      class="chip"
                                    >
                                      <nuxt-link
                                        :to="`/search?type=test&section=${item.section}&base=${item.base}&lesson=${item.lesson}`"
                                      >{{ item.lesson_title }}</nuxt-link>
                                    </div>
                                    <div
                                      v-if="item.base_title"
                                      class="chip"
                                    >
                                      <nuxt-link
                                        :to="`/search?type=test&section=${item.section}&base=${item.base}`"
                                      >{{ item.base_title }}</nuxt-link>
                                    </div>
                                    <div
                                      v-if="item.section_title"
                                      class="chip"
                                    >
                                      <nuxt-link
                                        :to="`/search?type=test&section=${item.section}`"
                                      >{{ item.section_title }}</nuxt-link>
                                    </div>
                                  </div>
                                </v-col>
                              </v-row>
                              <div
                                ref="lineSpecifierLoadMoreMobileRef"
                                class="line-specifier-load-more"
                              />
                              <v-row
                                v-if="allDataLoaded == false"
                                class="list-item"
                              >
                                <v-col cols="12">
                                  <v-skeleton-loader type="list-item-avatar" />
                                </v-col>
                              </v-row>
                            </div>
                            <div
                              v-else-if="
                                searchCount == 0 && searchLoading == false
                              "
                              class="text-center"
                            >
                              <span class="gama-text-button">
                                Opps! no data found
                              </span>
                            </div>
                            <div v-else>
                              <v-row
                                v-for="i in 3"
                                :key="i"
                                class="list-item"
                              >
                                <v-col cols="12">
                                  <v-skeleton-loader type="list-item-avatar" />
                                </v-col>
                              </v-row>
                            </div>
                          </div>
                        </div>
                      </v-col>
                    </v-row>
                  </div>
                </v-card>
              </v-card>
            </v-sheet>
          </v-bottom-sheet>
        </div>

        <v-btn
          v-if="!auth.isAuthenticated.value"
          id="mobile-signin-btn"
          rounded
          class="primary gama-btn"
          @click="openLoginDialog()"
        >
          Sign in
        </v-btn>
        <common-notification-component
          v-if="auth.isAuthenticated.value"
          ref="notificationComponent"
          :menu-setting="menuSetting"
          class="d-block d-lg-none"
        />
        <nuxt-link
          to="/user/wallet"
          class="wallet-div wallet-mobile"
        >
          <v-icon
            class="wallet-icon"
            :color="menuSetting.linkColor"
          >mdi-wallet-outline</v-icon>
        </nuxt-link>
        <v-menu
          v-if="auth.isAuthenticated.value"
          transition="slide-x-transition"
          offset-y
          min-width="150"
        >
          <template #activator="{ props }">
            <div v-bind="props">
              <v-avatar
                v-if="auth?.user?.avatar"
                class="ml-2"
              >
                <v-img
                  :src="auth?.user?.avatar"
                  alt="user avatar"
                />
              </v-avatar>
              <v-icon
                v-else
                class="ml-2"
                :color="menuSetting.linkColor"
              >
                mdi-account
              </v-icon>
            </div>
          </template>
          <v-list>
            <v-list-item
              v-for="(item, i) in user_profile_items"
              :key="i"
              :to="item.link"
            >
              <template #prepend>
                <v-icon
                  class="mr-0 nt"
                  :icon="item.icon"
                  size="small"
                />
              </template>

              <v-list-item-title>
                {{ item.title }}
              </v-list-item-title>
            </v-list-item>
            <v-list-item
              class="pointer"
              @click="logout"
            >
              <template #prepend>
                <v-icon
                  small
                  class="mr-0"
                >
                  mdi-logout
                </v-icon>
              </template>
              <v-list-item-title> Logout </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
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
              <v-icon>mdi-close</v-icon>
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
  </div>
</template>

<style>
.line-specifier-load-more {
  width: 100%;
  height: 4px;
}
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
  .v-icon {
    font-size: 2rem;
  }

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

#main-logo {
  margin-left: 1.6rem !important;
  width: 8.0551rem !important;
  height: 2rem !important;
}

#mobile-signin-btn {
  margin-left: 1.6rem;
}

#mobile-search-sheet {
  height: 70vh;
  border-radius: 3rem 3rem 0 0;
  justify-content: center;
  align-items: center;
  background: #f6f8fa;
  position: relative;
  padding-top: 3.6rem;

  #search-sheet-handler-holder {
    position: absolute;
    width: 100%;
    height: 6.4rem;
    border-radius: 10rem;
    opacity: 0.4;
    top: 0;
    left: 0;
    right: 0;
    background: transparent;
    margin: auto;
    #search-sheet-handler {
      position: absolute;
      width: 3.2rem;
      height: 0.4rem;
      border-radius: 10rem;
      opacity: 0.4;
      top: 1.6rem;
      left: 0;
      right: 0;
      background: var(--m-3-sys-light-outline, #79747e);
      margin: auto;
    }
  }

  #search-cate-slide {
    .avatar {
      width: 3.2rem;
      height: 3.2rem;
      border-radius: 2.6rem;
      display: flex;
      justify-content: center;
      align-items: center;
      margin: 0.8rem auto 0.8rem auto;

      .icon {
        font-size: 2.13rem;
        color: #ffffff;
      }
    }

    .paper-avatar {
      background: #01c8c8;
    }

    .multimedia-avatar {
      background: #8800b8;
    }

    .exam-avatar {
      background: #7b61ff;
    }

    .q-a-avatar {
      background: #ff50a6;
    }

    .tutorial-avatar {
      background: #2a91ff;
    }

    .student-avatar {
      background: #ff9400;
    }

    .teacher-avatar {
      background: #1cb423;
    }

    .school-avatar {
      background: #a15801;
    }

    .live-avatar {
      background: #ff0000;
    }

    .gama-text-caption {
      color: rgba(36, 41, 47, 0.5);
    }
    .active-avatar {
      width: 5.6rem;
      height: 5.6rem;
      border-radius: 50%;
      display: flex;
      justify-content: center;
      align-items: center;
      margin: 0 auto 0.8rem auto;
    }

    .active-paper-avatar {
      background: #bbe9bd;
    }

    .active-multimedia-avatar {
      background: #dcb3ea;
    }

    .active-exam-avatar {
      background: #d8d0ff;
    }

    .active-q-a-avatar {
      background: #ffcbe4;
    }

    .active-tutorial-avatar {
      background: #c0deff;
    }

    .active-student-avatar {
      background: #ffdfb3;
    }

    .active-teacher-avatar {
      background: #1cb4234d;
    }

    .active-school-avatar {
      background: #e3cdb3;
    }

    .active-live-avatar {
      background: #ffb3b3;
    }

    .gama-text-caption {
      color: rgba(36, 41, 47, 0.8);
      text-align: center;
      font-family: Inter;
      font-size: 1.4rem;
      font-style: normal;
      font-weight: 400;
      line-height: 2.4rem;
    }
  }

  .v-card {
    background: transparent;

    .v-skeleton-loader__list-item-avatar {
      background: transparent;
    }

    .v-icon {
      font-size: 2.4rem;
      color: #ff9400;
    }

    #keyword-card {
      .v-text-field {
        width: 42.8rem;
        min-height: auto;
        height: 4rem !important;
        border-radius: 3.8rem 0.4rem 0.4rem 3.8rem;

        margin: 1.6rem auto 1.6rem auto;

        .v-input__control > .v-input__slot {
          min-height: auto;
          height: 4rem !important;

          &:before {
            border-style: none;
          }
        }

        .v-input__append-outer {
          margin: 0 0 0 0.8rem !important;

          .v-btn {
            min-width: auto;
            width: 3.9rem !important;
            height: 3.9rem;
            border-radius: 0.4rem 3.8rem 3.8rem 0.4rem;

            .v-icon {
              color: #000;
              font-size: 2.2rem;
            }
          }
        }
      }
    }
  }

  #mobile-search-result-container {
    display: block;
    margin: auto;
    z-index: 4;
    min-height: 40vh;
    height: 40vh;
    overflow: hidden;

    #search-result {
      max-height: 40vh;
      overflow-x: hidden;
      overflow-y: scroll;
      position: relative;

      #result-stat {
        padding: 1.6rem;
        text-align: right;
        position: sticky;
        background: #f6f8fa;
        top: 0;

        .gama-text-button {
          color: #57b947;
          text-align: right;
        }

        .gama-text-overline {
          color: rgba(36, 41, 47, 0.3);
          margin-right: 0.22rem;
        }
      }

      .list-item {
        height: 11.9rem;
        padding: 1.6rem;

        a {
          text-decoration: none;
          color: unset;
        }

        .gama-text-button {
          color: rgba(36, 41, 47, 0.8);
          margin-bottom: 1.7rem;
          white-space: nowrap;
          width: inherit;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .avatar {
          width: 3.2rem;
          height: 3.2rem;
          border-radius: 2.6rem;
          display: flex;
          justify-content: center;
          align-items: center;

          .icon {
            font-size: 2.13rem;
            color: #ffffff;
          }
        }

        .paper-avatar {
          background: #01c8c8;
        }

        .multimedia-avatar {
          background: #8800b8;
        }

        .exam-avatar {
          background: #7b61ff;
        }

        .qa-avatar {
          background: #ff50a6;
        }

        .tutorial-avatar {
          background: #2a91ff;
        }

        .student-avatar {
          background: #ff9400;
        }

        .teacher-avatar {
          background: #1cb423;
        }

        .school-avatar {
          background: #a15801;
        }

        .live-avatar {
          background: #ff0000;
        }

        .chip-container {
          display: flex;

          .chip {
            height: 2.4rem;
            padding: 0.2rem 0.8rem 0.2rem 0.8rem;
            width: max-content;
            border-radius: 2rem;
            background: rgba(36, 41, 47, 0.05);
            margin-right: 0.8rem;

            color: rgba(36, 41, 47, 0.8);
            font-family: Inter;
            font-size: 1.2rem;
            font-style: normal;
            font-weight: 400;
            line-height: 2rem;
            max-width: 18.4rem;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
        }

        .v-skeleton-loader__list-item-avatar {
          background: transparent;
        }
      }

      .list-item:nth-child(even) {
        background: rgba(36, 41, 47, 0.05);
      }
    }
  }
}

@media (min-width: 600px) {
  #main-header {
    .v-icon {
      font-size: 2.4rem;
    }

    .v-avatar {
      min-width: 2.4rem !important;
      width: 2.4rem !important;
      height: 2.4rem !important;
    }
  }

  #mobile-signin-btn {
    margin-left: 1.6rem;
  }

  #main-logo {
    margin-left: 3rem !important;
    width: 1.6458rem;
    height: 1.6511rem;
  }

  #mobile-search-sheet {
    height: 50vh;
    border-radius: 3rem 3rem 0 0;
    justify-content: center;
    align-items: center;

    .v-icon {
      font-size: 2.4rem;
      color: #ff9400;
    }

    .title {
      margin-top: 0.2rem;
      color: #424a53;
      text-align: center;
      font-size: 1.2rem;
      font-style: normal;
      font-weight: 300;
      line-height: 1.6rem;
    }

    #keyword-card {
      .v-icon {
        font-size: 2.4rem;
        color: #000000;
      }

      .primary--text {
        color: #000 !important;
      }
    }
  }
}

@media (min-width: 960px) {
  #main-header {
    .menu-item:hover {
      border-bottom: 3px solid rgb(0, 139, 139);
    }

    .v-icon {
      font-size: 2.8rem;
    }

    .v-avatar {
      min-width: 2.8rem;
      width: 2.8rem;
      height: 2.8rem;
    }

    #header-username-light {
      color: #fff;
      margin-top: 0.2rem;
      min-width: 6.2rem;
      margin-right: 1rem;
    }

    #header-username-dark {
      color: #000;
      margin-top: 0.2rem;
      min-width: 6.2rem;
      margin-right: 1rem;
    }

    #main-menu {
      z-index: 1001;
      padding-bottom: 0.4rem;
      height: 6.4rem !important;

      .v-btn {
        font-size: 1.8rem;
        font-style: normal;
        font-weight: 400;
        font-family: "Inter";
        line-height: normal;
        padding-bottom: 0.1rem !important;
      }
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

    .mobile_bar .fa-bell {
      line-height: 3rem !important;
      font-size: 2.8rem !important;
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

      .v-icon {
        font-size: 2.4rem;
        color: #ffb600 !important;
      }
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
.wallet-div {
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
}

@media (min-width: 1264px) {
  #main-logo {
    width: 12.0827rem !important;
    height: 3.2rem !important;
    margin-top: 0.6rem;
    margin-right: 6.4rem;
    margin-left: 0 !important;
  }
  .wallet-div {
    margin: 0 0 0 20px;
  }
}
</style>
