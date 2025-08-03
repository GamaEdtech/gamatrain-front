<template>
  <div>
    <header class="main-header">
      <WidgetsTopbar ref="header_topbar" />

      <!--   Start: navbar   main-container -->
      <v-container class="pa-0">
        <div class="d-flex align-center justify-space-between">
          <div class="d-flex align-center navbar-items">
            <!-- Start:  show sidebar menu in mobile -->
            <v-navigation-drawer
              v-model="sidebar"
              app
              class="hidden-md-and-up main-sidebar"
            >
              <!-- Start:  Menu items -->
              <v-list
                dense
                shaped
                class="pl-1"
              >
                <!-- Profile info -->
                <div
                  v-if="$auth.loggedIn"
                  class="sidemenu-profile d-flex flex-column justify-space-around mb-5"
                >
                  <nuxt-link to="/user">
                    <v-avatar size="40">
                      <v-img
                        :src="$loadAvatar.currentUser($auth)"
                        alt="Avatar"
                      />
                    </v-avatar>
                  </nuxt-link>

                  <div class="profile-info">
                    <nuxt-link
                      :to="'/user'"
                      class="profile-name"
                    >{{ $auth.user?.first_name }} {{ $auth.user.last_name }}
                    </nuxt-link>

                    <div
                      class="profile-wallet d-flex justify-space-between mr-2"
                    >
                      <div class="d-flex">
                        <p class="wallet">
                          Wallet:
                        </p>
                        <p class="mx-3 wallet-balance">
                          ${{ $auth.user.credit }}
                        </p>
                      </div>
                      <nuxt-link to="/user">
                        <i
                          class="fa-solid fa-angle-right ml-4 profile-wallet-arrow"
                        />
                      </nuxt-link>
                    </div>
                  </div>
                </div>
                <div
                  v-else
                  class="d-flex align-center"
                >
                  <v-btn
                    plain
                    @click="openLoginDialog"
                  >
                    <i class="fa-solid fa-sign-in mr-1" />
                    Login
                  </v-btn>

                  <v-btn
                    plain
                    @click="openRegisterDialog"
                  >
                    <i class="fa-solid fa-user-plus mr-1" />
                    Register
                  </v-btn>
                </div>
                <v-divider class="mb-2" />
                <!-- End Profile info -->

                <!-- Mobile menu items -->
                <div
                  v-for="(item, side) in menuItems"
                  :key="side"
                >
                  <v-list-item
                    v-if="!item.subMenuList"
                    class="py-2"
                    active-class="menu_active"
                    :to="item.link"
                  >
                    <v-list-item-title
                      class="menu-title"
                    >
                      {{ item.title }}
                    </v-list-item-title>
                  </v-list-item>

                  <v-list-group
                    v-else
                    :key="item.title"
                    active-class="menu_group_active"
                    no-action
                    :value="false"
                  >
                    <template #activator>
                      <v-list-item-title
                        class="py-2"
                      >
                        {{ item.title }}
                      </v-list-item-title>
                    </template>

                    <v-list-item
                      v-for="(subMenuItem, sideIndex) in item.subMenuList"
                      :key="sideIndex"
                      class="pl-7"
                      active-class="menu_active"
                      :to="subMenuItem.link"
                    >
                      <v-list-item-content class="py-2">
                        <v-list-item-title>{{ subMenuItem.title }}</v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>
                  </v-list-group>
                </div>
                <v-divider class="my-3" />
                <div
                  v-if="$auth.loggedIn"
                  class="logout d-flex align-center my-4"
                  @click="$auth.logout()"
                >
                  <v-icon>mdi-logout</v-icon>
                  <p class="logout-item mx-2">
                    Logout
                  </p>
                </div>
              </v-list>
              <!-- End:  Menu items -->

              <!-- Start:  Social link -->
              <v-list dense>
                <v-list-item-group
                  class="d-flex justify-center align-center mt-5"
                >
                  <a
                    v-for="(socialItem, i) in socialList"
                    :key="i"
                    :href="socialItem.link"
                    class="d-flex justify-center align-center px-3"
                  >
                    <span
                      :class="' side-icon fa-2xl fa-brands ' + socialItem.icon"
                    />
                  </a>
                </v-list-item-group>
              </v-list>
              <!-- End:  Social link  -->
            </v-navigation-drawer>
            <!-- End:  show sidebar menu in mobile -->

            <!-- Mobile nav -->
            <v-app-bar
              class="d-block d-md-none mobile_bar"
              fixed
            >
              <!--   hamburgers-icon in mobile -->
              <v-btn
                icon
                @click="sidebar = !sidebar"
              >
                <v-icon large>
                  mdi-menu
                </v-icon>
              </v-btn>
              <v-spacer />

              <!-- Logo section -->
              <nuxt-link to="/">
                <v-img
                  class="logo"
                  :src="require('@/assets/images/' + logo)"
                  max-width="100"
                />
              </nuxt-link>
              <!-- End logo section -->

              <v-spacer />
              <nuxt-link to="">
                <i class="fa-regular fa-bell fa-2xl ml-4" />
              </nuxt-link>
            </v-app-bar>
            <!-- End mobile nav -->
          </div>
        </div>
      </v-container>
      <!--   End: navbar   -->
    </header>
  </div>
</template>

<script>
import WidgetsTopbar from '../widgets/WidgetsTopbar'

export default {
  name: 'TestMakerHeader',
  components: {
    WidgetsTopbar,
  },
  data() {
    return {
      sidebar: false,
      dialog: false,
      logo: 'mainlogo-gamatrain.png',
      avatar: 'dexter-morse.png',
      menuItems: [
        {
          title: 'Home',
          link: '/',
          icon: '',
        },
        {
          title: 'Announcement',
          link: '',
          icon: 'fa-angle-down',
          subMenuList: [
            { title: 'Terms and Conditions', link: '' },
            { title: 'Privacy Policy', link: '' },
            { title: 'FAQs', link: '/faq' },
          ],
        },
        {
          title: 'Olympiad',
          link: '',
          icon: 'fa-angle-down',
          subMenuList: [
            { title: 'International Mathematical Olympiad (IMO)', link: '' },
            { title: 'International Physics Olympiad (IPhO)', link: '' },
            { title: 'International Chemistry Olympiad (IChO)', link: '' },
          ],
        },
        {
          title: 'High-level',
          link: '',
          icon: 'fa-angle-down',
          subMenuList: [
            { title: 'Fourth grade entrance exam', link: '' },
            { title: 'Fifth grade entrance exam', link: '' },
            { title: 'Sixth grade entrance exam', link: '' },
          ],
        },
        {
          title: 'Books',
          link: '',
          icon: 'fa-angle-down',
          subMenuList: [
            { title: 'Primary school period', link: '' },
            { title: 'First year of high school', link: '' },
            { title: 'Second year of high school', link: '' },
          ],
        },
        {
          title: 'Suggestions',
          link: '',
          icon: 'fa-angle-down',
          subMenuList: [
            { title: '9th coordinated exam', link: '' },
            { title: '6th coordinated exam', link: '' },
            { title: '12th Coordinated Exams', link: '' },
          ],
        },
      ],
      selectedItem: 1,
      socialList: [
        { link: 'telegram', icon: 'fa-telegram' },
        { link: 'twitter', icon: 'fa-twitter' },
        { link: 'instagram', icon: 'fa-instagram' },
        { link: 'Youtube', icon: 'fa-youtube' },
      ],
    }
  },
  methods: {
    openLoginDialog() {
      this.$refs.header_topbar.openLoginDialog()
    },
    openRegisterDialog() {
      this.$refs.header_topbar.openRegisterDialog()
    },
  },
}
</script>

<style>
.menu-item:hover {
  border-bottom: 3px solid rgb(0, 139, 139);
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
  padding: 0 1.4rem 0 0.5rem !important;
}
</style>
