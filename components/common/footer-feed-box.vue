<template>
  <v-card
    min-height="680"
    :class="'feed-card ' + feed.class"
  >
    <v-list style="width: 100% !important">
      <nuxt-link :to="feed.more_link">
        <v-subheader
          v-if="feed.header"
          class="d-none d-md-flex align-center feed-header"
        >
          <span
            :class="
              'd-flex align-center me-2 icon icong-'
                + feed.icon
                + ' icon'
                + feed.class
            "
          />
          {{ feed.header }}
        </v-subheader>
      </nuxt-link>
      <v-list-item
        v-for="(item, index) in feed.contentItemList"
        :key="index"
        class="feed_item align-self-start"
      >
        <v-card
          width="100%"
          flat
          class="d-inline-block"
        >
          <v-list-item-content class="pt-0 pr-1">
            <nuxt-link
              :to="`${feed.main_link}/${item.id}`"
              class="pb-2 feed-title"
            >{{ item.title }}</nuxt-link>
            <v-list-item-subtitle
              class="feed-subtitle d-flex justify-space-between"
            >
              <div class="d-flex align-center">
                <v-list-item-avatar class="ma-0 ms-1 mr-3 avatar-parent">
                  <v-img :src="item.avatar" />
                </v-list-item-avatar>
                <span v-if="feed.main_link == 'qa'">{{ item.first_name }} {{ item.last_name }}</span>
                <nuxt-link
                  v-if="
                    feed.main_link == 'multimedia' || feed.main_link == 'papers'
                  "
                  :to="`/teacher/@${item.username}`"
                >
                  {{ item.first_name }} {{ item.last_name }}
                </nuxt-link>
              </div>
              <div class="d-flex align-center">
                <i class="fa-solid fa-calendar-days mx-3" />
                <span class="d-flex align-center">
                  {{ $dayjs(item.subdate).format("MMM DD") }}
                </span>
              </div>
            </v-list-item-subtitle>
          </v-list-item-content>
          <v-divider />
        </v-card>
      </v-list-item>
      <!-- <v-divider></v-divider> -->
      <div
        class="d-flex justify-space-between align-center pt-2 feed-card-footer"
      >
        <nuxt-link :to="feed.more_link">
          <v-list-item>
            <span class="footer-text">More</span>
          </v-list-item>
        </nuxt-link>
        <v-tooltip location="bottom">
          <template #activator="{ props }">
            <v-btn
              v-if="
                feed.class == 'learning'
                  || feed.class == 'question'
                  || feed.class == 'news'
                  || feed.class == 'test'
              "
              rounded
              v-bind="props"
              :color="feed.add_link_color"
              dark
              min-width="20"
              :to="feed.add_link"
              class="add-file"
            >
              <i class="fa-solid fa-plus" />
            </v-btn>
          </template>
          <span>{{ feed.add_link_title }}</span>
        </v-tooltip>
      </div>
    </v-list>
  </v-card>
</template>

<script>
export default {
  props: {
    feed: Object,
  },
  data() {
    return {}
  },
}
</script>

<style>
.avatar-parent {
  border-radius: 0.8rem;
}

.feed_item {
  min-height: 14rem !important;
  max-height: 14rem !important;
}
</style>
