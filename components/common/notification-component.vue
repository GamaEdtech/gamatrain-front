<template>
  <v-menu
    transition="slide-x-transition"
    offset-y
    class="notification-box"
    min-width="150"
  >
    <template #activator="{ props }">
      <div
        v-bind="props"
        class="notice-btn align-center mr-3 ml-5"
      >
        <v-chip
          v-show="notifications.length"
          x-small
          color="red"
          text-color="white"
          class="px-1"
        >
          {{ notifications.length }}
        </v-chip>
        <v-icon
          :color="menuSetting.linkColor"
          class="topbar-bell"
        >
          mdi-bell-outline
        </v-icon>
      </div>
    </template>
    <v-card
      height="400"
      width="256"
      class="mx-auto"
    >
      <v-list-item>
        <v-row class="fill-height">
          <v-col
            cols="auto"
            class="align-self-center"
          >
            <v-list-item-title class="text-h5">
              Notifications
            </v-list-item-title>
          </v-col>
          <v-col
            cols="auto"
            class="align-self-center ml-auto"
          >
            <v-btn
              v-show="notifications.length"
              small
              outlined
              color="red"
              class="unread-btn"
              :loading="loading.mark_read_all"
              @click="markAllRead()"
            >
              Mark All AS Read
            </v-btn>
          </v-col>
        </v-row>
      </v-list-item>

      <v-divider />

      <v-list
        dense
        nav
      >
        <v-list-item
          v-for="item in notifications"
          :key="item.id"
          @click="openNotification(item.id)"
        >
          <template #prepend>
            <div class="mr-2 mt-1">
              <v-icon
                color="rgb(255, 193, 7)"
                large
                class="mt-4"
              >
                mdi-email
              </v-icon>
            </div>
          </template>

          <v-list-item-title class="font-weight-bold">
            {{ item.title }}
          </v-list-item-title>
          <v-list-item-subtitle>
            <div
              class="font-size-14 mb-1 black--text"
              v-html="item.body"
            />
            <div class="font-size-10">
              {{ item.subdate }}
            </div>
          </v-list-item-subtitle>
        </v-list-item>
        <v-list-item v-show="!notifications.length">
          <div class="mt-5 mx-auto">
            There are no new notifications
          </div>
        </v-list-item>
      </v-list>
    </v-card>
  </v-menu>
</template>

<script>
export default {
  name: 'NotificationComponent',
  props: {
    menuSetting: {
      type: Object,
      default: () => ({
        logo: 'gamatrain-logo-black.svg',
        bgColor: '#fff',
        linkColor: '#424A53',
      }),
    },
  },
  data() {
    return {
      notifications: [],
      getNoticeCalled: 0, // Flag for prevent repeat call getNotifications
      loading: {
        mark_read_all: false,
      },
    }
  },
  mounted() {},
  methods: {
    async getNotifications() {
      // Get notifications
      if (this.$auth.loggedIn)
        await this.$fetch
          .$get('/api/v1/notifications/unreads')
          .then((response) => {
            this.notifications = response.data.list
          })
          .catch((err) => {
            if (err.response.status == 403) this.$auth.logout()
            else if (err.response.status == 400)
              this.$toast.error(err.response.data.message)
          })
          .finally(() => {
            this.getNoticeCalled++
          })
      // End get notifications
    },

    openNotification(id) {
      this.$fetch
        .$get(`/api/v1/notifications/read/${id}`)
        .then((_response) => {
          if (_response.status) {
            this.$router.push({
              path: _response.data.url.replace(/^https?:\/\/[^/]+/, '/user'),
            })
            if (this.getNoticeCalled > 0) this.getNotifications()
          }
        })
        .catch((_err) => {
          console.log(_err)
        })
    },

    async markAllRead() {
      this.loading.mark_read_all = true
      this.$fetch
        .$get('/api/v1/notifications/readall')
        .then((_response) => {
          this.getNotifications()
        })
        .catch((_err) => {
          this.$toast.error('An error occurred')
        })
        .finally(() => {
          this.loading.mark_read_all = false
        })
    },
  },
}
</script>

<style>
.unread-btn.v-btn.v-size--small {
  font-size: 0.9rem !important;
  font-weight: 800;
}

.notice-btn {
  position: relative;

  .v-icon {
    font-size: 2rem;
  }
}

.notice-btn .v-chip {
  position: absolute;
  top: 0rem;
  right: 1.8rem;
}

@media screen and (min-width: 600px) {
  .notice-btn {
    .v-icon {
      font-size: 2.4rem;
    }
  }
}

@media screen and (min-width: 960px) {
  .notice-btn {
    .v-icon {
      font-size: 2.8rem !important;
    }
  }
}
</style>
