<template>
  <v-row class="w-100 ma-0 align-stretch">
    <v-col
      cols="9"
      sm="10"
    >
      <v-card
        flat
        :to="contentPath('post', post.id, post.slug)"
        class="post-card rounded-lg ma-auto bg-transparent"
        :hover="false"
      >
        <div class="d-flex flex-column flex-sm-row ga-4">
          <v-img
            :src="secureImageUrl(post.imageUri)"
            :alt="post.title"
            cover
            class="post-image rounded-lg"
          >
            <template #default>
              <div class="d-flex d-sm-none h-100 align-end">
                <v-card-title class="w-100 background-title text-white text-h6 font-weight-bold py-2">
                  {{ post.title }}
                </v-card-title>
              </div>
            </template>
          </v-img>
          <div class="d-none d-sm-flex flex-column ga-3 pa-2">
            <h2 class="text-h5 text-md-h4 font-weight-bold text-grey700">
              {{ post.title }}
            </h2>
            <p class="text-subtitle-1 text-md-h6 font-weight-medium text-grey600 mb-0">
              {{ summary }}
              <span class="text-primary font-weight-bold">Read more</span>
            </p>
          </div>
          <p class="d-block d-sm-none text-h6 font-weight-medium text-grey600 mb-0">
            {{ mobileSummary }}
            <span class="text-primary font-weight-bold">Read more</span>
          </p>
        </div>
      </v-card>
    </v-col>

    <v-col
      cols="3"
      sm="2"
      class="d-flex flex-column align-center ga-2 date-container position-relative"
    >
      <v-divider
        :thickness="2"
        class="border-opacity-100 h-100 position-absolute divider-position"
        color="grey100"
        vertical
      />
      <span
        v-if="showYear"
        class="text-grey400 text-h6 font-weight-bold date-container"
      >
        {{ formatLocal(post.publishDate, 'YYYY') }}
      </span>
      <v-sheet
        color="grey100"
        rounded="lg"
        class="post-date d-flex flex-column align-center justify-center date-container"
      >
        <span class="text-h6 text-sm-h5 font-weight-bold text-grey900">
          {{ formatLocal(post.publishDate, 'DD') }}
        </span>
        <span class="text-caption text-grey500 text-uppercase">
          {{ formatLocal(post.publishDate, 'MMM') }}
        </span>
      </v-sheet>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import { contentPath } from '@/utils/contentPath'
import { htmlToText, secureImageUrl, truncateText } from '@/utils/postCard'
import type { PostDTO } from '@/types'

const props = defineProps<{
  post: PostDTO
  showYear: boolean
}>()

const { formatLocal } = useDateTime()
const plainSummary = computed(() => htmlToText(props.post.summary))
const summary = computed(() => truncateText(plainSummary.value, 150))
const mobileSummary = computed(() => truncateText(plainSummary.value, 100))
</script>

<style scoped lang="scss">
@use 'sass:map';
@use 'vuetify/settings' as vuetify;

.post-card {
  width: 100%;
}

.post-image {
  flex: 0 0 180px;
  width: 180px;
  max-width: 180px;
  height: 135px;
}

.post-date {
  width: 62px;
  height: 62px;
}

.background-title{
  background-color: rgba(var(--v-theme-inverseSurface), 0.6);
  backdrop-filter: blur(10px);
}
.date-container{
  z-index : 2
}
.divider-position{
  right : 50%
}

@media #{map.get(vuetify.$display-breakpoints, 'xs')} {
  .post-card {
    width: 240px;
  }

  .post-image {
    width: 240px;
    max-width: 240px;
    height: 160px;
  }

  .post-date {
    width: 52px;
    height: 52px;
  }
}
</style>
