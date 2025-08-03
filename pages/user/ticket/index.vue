<template>
  <div>
    <v-card class="ticket_list">
      <v-card-text>
        <v-tabs
          v-model="ticket_tab"
          class="mb-3"
          background-color="transparent"
          color="teal"
          grow
        >
          <v-tab
            v-for="item in tab_items"
            :key="item"
          >
            {{ item }}
          </v-tab>
        </v-tabs>

        <v-row>
          <v-col cols="12">
            <v-text-field
              v-model="user_direct"
              filled
              height="40"
              outlined
              shaped
              readonly
              dense
            >
              <template #append>
                <v-btn
                  icon
                  class="pointer"
                  color="teal"
                  @click="copyUrl"
                >
                  <v-icon class="search-icon pb-2">
                    mdi-content-copy
                  </v-icon>
                </v-btn>
              </template>
            </v-text-field>
          </v-col>
        </v-row>

        <!-- Message list -->
        <v-card
          ref="ticketList"
          max-height="500"
          class="overflow-y-auto"
          flat
          @scroll="onScroll"
        >
          <v-card-text ref="ticketListContent">
            <v-row
              v-for="(message, index) in messages"
              :key="message.id"
              align="center"
              class="spacer mt-6"
              no-gutters
            >
              <v-col
                cols="3"
                sm="2"
                md="1"
                class="text-center"
              >
                <nuxt-link :to="`/direct/${message.username}`">
                  <v-avatar size="56px">
                    <!-- <img
                    alt="Avatar"
                    :src="require('assets/images/gama_user_avatar.png')"
                  > -->
                  </v-avatar>
                </nuxt-link>
              </v-col>

              <v-col
                cols="7"
                sm="6"
                md="5"
              >
                <p>
                  <nuxt-link :to="`/user/ticket/detail/${message.id}`">
                    <span
                      class="ticket_title"
                      :class="message.unread > 0 ? 'unread_ticket' : ''"
                      v-html="message.title"
                    />
                  </nuxt-link>
                </p>
                <p class="mt-2 text-h5">
                  {{ message.body }}
                </p>
                <p class="d-md-none mt-2">
                  <span>
                    <i class="fa fa-calendar-alt" />
                    {{ $dayjs(message.up_date).format("MMM,DD YYYY") }}
                  </span>
                </p>
              </v-col>

              <v-col
                class="text-no-wrap text-right"
                cols="2"
                md="6"
              >
                <p class="mb-2">
                  <span class="d-none d-md-inline">
                    <i class="fa fa-calendar-alt ml-2" />
                    {{ $dayjs(message.up_date).format("MMM,DD YYYY") }}
                  </span>
                  <span class="d-none d-md-inline ml-2 font-weight-regular">
                    {{ $dayjs(message.up_date).format("h:mm A") }}
                  </span>
                </p>
                <v-chip
                  v-if="message.unread"
                  :color="calcColor(message.status_message, 'font')"
                  class="ml-0 mr-2 text-white"
                  small
                >
                  {{ message.unread }}
                </v-chip>
                <v-chip
                  small
                  class="font-weight-bold d-none d-md-inline-flex"
                  :text-color="calcColor(message.status_message, 'font')"
                  label
                  :color="calcColor(message.status_message, 'bg')"
                >
                  {{ message.status_message }}
                </v-chip>
                <v-tooltip
                  v-if="message.deleteable"
                  location="bottom"
                >
                  <template #activator="{ props }">
                    <v-btn
                      icon
                      color="error"
                      small
                      v-bind="props"
                      @click="openDeleteConfirmDialog(message.id)"
                    >
                      <v-icon small>
                        mdi-delete
                      </v-icon>
                    </v-btn>
                  </template>
                  <span>Delete</span>
                </v-tooltip>
              </v-col>

              <v-col cols="12">
                <v-divider
                  v-show="messages && messages.length !== index + 1"
                  class="mt-2"
                />
              </v-col>
            </v-row>
            <v-row v-show="page_loading === false && messages.length === 0">
              <v-col
                cols="12"
                class="text-center"
              >
                <p>Oops! no data found</p>
              </v-col>
            </v-row>
            <v-row v-show="page_loading">
              <v-col
                cols="12"
                class="text-center"
              >
                <v-progress-circular
                  :size="30"
                  :width="3"
                  class="mt-12 mb-12"
                  color="orange"
                  indeterminate
                />
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-card-text>
    </v-card>
    <div class="mt-8">
      <v-row>
        <v-col
          cols="12"
          class="text-right"
        >
          <div class="new_msg_btn">
            <v-btn
              to="/user/ticket/create"
              x-large
              color="teal"
              class="text-white"
            >
              <i class="fa fa-comment-alt fa-2xl mr-2" />
              New
            </v-btn>
          </div>
        </v-col>
      </v-row>
    </div>

    <!-- Delete dialog -->
    <v-dialog
      v-model="deleteConfirmDialog"
      max-width="290"
    >
      <v-card>
        <v-card-title class="text-h5">
          Are you sure?
        </v-card-title>

        <v-card-text>
          <p>If you are sure to delete, click Yes.</p>
        </v-card-text>

        <v-card-actions>
          <v-spacer />

          <v-btn
            text
            @click="deleteConfirmDialog = false"
          >
            No
          </v-btn>

          <v-btn
            color="green darken-1"
            text
            :loading="delete_loading"
            @click="deleteItem()"
          >
            Yes
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- End delete dialog -->
  </div>
</template>

<script>
export default {
  name: 'TicketList',
  layout: 'dashboard_layout',
  data() {
    return {
      ticket_tab: 0,
      tab_items: [
        'All messages',
        'Unread',
        'General',
        'Sent',
        'Received',
        'Block list',
      ],
      messages: [],
      user_direct: `gamatrain.com/direct/${this.$auth.user.username}`,

      // Paginate section
      page_loading: false,
      page: 1,
      all_tickets_loaded: false,
      timer: null,
      // End paginate section

      // Delete section
      deleteConfirmDialog: false,
      delete_ticket_id: null,
      delete_loading: false,
    }
  },
  head() {
    return {
      title: 'Ticket manage',
    }
  },
  mounted() {
    this.getMsgList()
    // this.scroll();
  },
  methods: {
    getMsgList() {
      if (!this.all_tickets_loaded) {
        this.page_loading = true
        this.$fetch
          .$get('/api/v1/tickets', {
            params: {
              perpage: 15,
              page: this.page,
            },
          })
          .then((response) => {
            this.messages.push(...response.data.list)

            if (response.data.list.length === 0)
              // For terminate auto load request
              this.all_tickets_loaded = true
          })
          .catch((err) => {
            console.log(err)
            if (err.response.status == 403) this.$auth.logout()
            this.$toast.error(err.response.data.message)
          })
          .finally(() => {
            this.page_loading = false
          })
      }
    },
    copyUrl() {
      navigator.clipboard.writeText(this.user_direct)
      this.$toast.success('Copied')
    },

    onScroll() {
      const scrollPosition = this.$refs.ticketList.$el.scrollTop
      const contentHeight = this.$refs.ticketListContent.clientHeight

      // Avoid the number of requests
      if (this.timer) {
        clearTimeout(this.timer)
        this.timer = null
      }

      if (
        scrollPosition > contentHeight - 1000
        && this.all_tickets_loaded === false
      )
        this.timer = setTimeout(() => {
          // this.loading.message_list = true;
          this.page++
          this.getMsgList()
        }, 800)
    },
    calcColor(status, type) {
      if (status == 'new' && type == 'bg') return 'blue lighten-4'
      else if (status == 'new' && type == 'font') return 'blue'
      //
      else if (status == 'inprogress' && type == 'bg')
        return '#FF9800 lighten-4'
      else if (status == 'inprogress' && type == 'font') return '#FF9800'
      //
      else if (status == 'closed' && type == 'bg') return 'red lighten-4'
      else if (status == 'closed' && type == 'font') return 'red'
      //
      else if (status == 'answered' && type == 'bg') return 'green lighten-4'
      else if (status == 'answered' && type == 'font') return 'green'
      //
      else if (status == 'user-reply' && type == 'bg') return 'blue lighten-4'
      else if (status == 'user-reply' && type == 'font') return 'blue'
      //
      else if (status == 'admin' && type == 'bg') return 'brown lighten-4'
      else if (status == 'admin' && type == 'font') return 'brown'
      //
      else if (status == 'direct' && type == 'bg') return '#E91E63 lighten-4'
      else if (status == 'direct' && type == 'font') return '#E91E63'
      //
      else if (status == 'broadcast' && type == 'bg')
        return '#8c2500 lighten-4'
      else if (status == 'broadcast' && type == 'font') return '#8c2500'
    },

    openDeleteConfirmDialog(item_id) {
      this.delete_ticket_id = item_id
      this.deleteConfirmDialog = true
    },
    async deleteItem() {
      this.delete_loading = true
      await this.$fetch
        .$delete(`/api/v1/tickets/${this.delete_ticket_id}`)
        .then((_response) => {
          this.delete_ticket_id = null
          this.deleteConfirmDialog = false

          this.$toast.success('Deleted successfully')

          this.page = 1
          this.messages = []
          this.getMsgList()
        })
        .catch((_e) => {
          this.delete_paper_id = null
          this.deleteConfirmDialog = false
        })
        .finally(() => {
          this.delete_loading = false
        })
    },
  },
}
</script>

<style>
.ticket_list .v-tab {
  font-size: 1.2rem !important;
}

.ticket_list span,
p,
strong {
  font-size: 1.4rem;
}

.new_msg_btn {
  position: relative;
}

.new_msg_btn::before {
  content: "";
  position: absolute;
  width: 0;
  height: 0;
  border-left: 12px solid transparent !important;
  border-right: 10px solid transparent !important;
  bottom: -15px;
  right: 10px;
  z-index: 1;
  border-top: 20px solid #009688;
  background-color: transparent !important;
}

.ticket_title {
  font-size: 1.8rem !important;
}
.unread_ticket {
  font-weight: 1000 !important;
}
</style>
