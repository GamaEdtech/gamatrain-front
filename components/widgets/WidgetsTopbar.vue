<template>
  <div class="topbar d-none d-md-block">
    <v-container class="align-center justify-space-between topbar-items">
      <v-row>
        <v-col
          md="4"
          lg="2"
        >
          <nuxt-link
            to="/"
            class="float-md-left pt-5"
          >
            <v-img
              class="logo"
              :src="require('@/assets/images/' + logo)"
              max-width="150"
            />
          </nuxt-link>
        </v-col>
        <v-col
          md="5"
          lg="3"
        >
          <!--  Start:  Search and logo in header  -->
          <search-box class="ml-lg-4 mt-4" />
          <v-spacer />
          <!--  End:  Search and logo in header  -->
        </v-col>
        <v-col
          md="3"
          lg="7"
        >
          <v-spacer />
          <div class="float-md-right pt-5">
            <div
              v-if="$auth.loggedIn"
              class="d-flex align-center"
            >
              <v-menu
                transition="slide-x-transition"
                offset-y
                min-width="150"
              >
                <template #activator="{ on, attrs }">
                  <div
                    v-bind="attrs"
                    v-on="on"
                  >
                    <v-avatar size="32">
                      <v-img
                        :src="$loadAvatar.currentUser($auth)"
                        alt="user avatar"
                      />
                    </v-avatar>
                    <span class="pointer pa-2">{{
                      $auth.user?.first_name
                    }}</span>
                  </div>
                </template>
                <v-list>
                  <v-list-item
                    v-for="(item, i) in user_profile_items"
                    :key="i"
                    :to="item.link"
                  >
                    <v-list-item-title class="user_menu_title">
                      <v-icon small>
                        {{ item.icon }}
                      </v-icon>
                      {{ item.title }}
                    </v-list-item-title>
                  </v-list-item>
                  <v-list-item
                    class="pointer"
                    @click="$auth.logout()"
                  >
                    <v-list-item-title class="user_menu_title">
                      <v-icon small>
                        mdi-logout
                      </v-icon>
                      Logout
                    </v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>

              <!-- Desktop version -->
              <notification-component
                ref="notification-component"
                class="d-none d-md-block"
              />
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
          </div>
        </v-col>
      </v-row>
    </v-container>

    <div>
      <!-- Login component -->
      <login
        ref="login_modal"
        v-model:switch-to-register="currentOpenDialog"
        v-model:switch-to-pass-recover="currentOpenDialog"
      />
      <!-- End login component -->

      <!-- Register component -->
      <register
        ref="register_modal"
        v-model:switch-to-login="currentOpenDialog"
      />
      <!-- End register component -->

      <!-- Recover password component -->
      <pass-recover
        ref="pass_recover_modal"
        v-model:switch-to-login="currentOpenDialog"
        v-model:switch-to-register="currentOpenDialog"
      />
      <!-- End recover password component -->
    </div>
  </div>
</template>

<script>
import Login from '@/components/common/login'
import Register from '@/components/common/register'
import SearchBox from '@/components/common/search-box'
import PassRecover from '@/components/common/pass-recover'
import NotificationComponent from '~/components/common/notification-component.vue'

export default {
  name: 'TopBar',
  components: {
    NotificationComponent,
    PassRecover,
    SearchBox,
    Register,
    Login,
  },
  data() {
    return {
      logo: 'mainlogo-gamatrain.png',
      avatar: 'dexter-morse.png',
      items: [
        { title: 'Dashboard', icon: 'mdi-view-dashboard' },
        { title: 'Photos', icon: 'mdi-image' },
        { title: 'About', icon: 'mdi-help-box' },
      ],

      user_profile_items: [
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
      ],
      right: null,
      currentOpenDialog: '',
    }
  },
  watch: {
    currentOpenDialog(val) {
      if (val === 'login') {
        this.$refs.register_modal.register_dialog = false
        this.$refs.pass_recover_modal.pass_recover_dialog = false
        this.$refs.login_modal.login_dialog = true
      }
      else if (val === 'register') {
        this.$refs.login_modal.login_dialog = false
        this.$refs.pass_recover_modal.pass_recover_dialog = false
        this.$refs.register_modal.register_dialog = true
      }
      else if (val === 'pass_recover') {
        this.$refs.login_modal.login_dialog = false
        this.$refs.register_modal.register_dialog = false
        this.$refs.pass_recover_modal.pass_recover_dialog = true
      }
      else {
        this.$refs.login_modal.login_dialog = false
        this.$refs.login_modal.register_dialog = false
        this.$refs.pass_recover_modal.pass_recover_dialog = false
      }
    },

    // Handle auth form from all of section
    '$route.query.auth_form'(val) {
      if (val === 'login') {
        this.$refs.login_modal.login_dialog = true
        this.$router.push({ query: {} })
      }
      else if (val == 'register') {
        this.$refs.register_modal.register_dialog = true
        this.$router.push({ query: {} })
      }
    },
  },
  mounted() {
    if (window.innerWidth > 960 && this.$auth.loggedIn) {
      this.$refs['notification-component'].getNotifications()
    }
    if (this.$route.query.access === 'denied') {
      this.$refs.login_modal.login_dialog = true
    }
  },
  methods: {
    openLoginDialog() {
      this.$refs.login_modal.login_dialog = true
    },
    openRegisterDialog() {
      this.$refs.register_modal.register_dialog = true
    },
  },
}
</script>

<style>
.user_menu_title {
  font-size: 1.2rem !important;
  padding: 1rem !important;
}
</style>
