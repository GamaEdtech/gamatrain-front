<template>
  <nuxt-link
    :to="`/blog/${data.id}/${data.slug}`"
    class="d-flex flex-column align-start justify-start pa-2 card-blog"
    :aria-label="data.slug"
  >
    <div class="d-flex position-relative">
      <v-img
        width="260"
        height="180"
        class="rounded-lg"
        cover
        :src="data.imageUri.replace(/^http:\/\//, 'https://')"
        :alt="data.title"
      />
      <div class="w-100 rounded-b-lg title-box-div position-absolute bottom-0 left-0 pa-2">
        <span class="text-white text-h4 font-weight-bold title-box">
          {{ data.title }}
        </span>
      </div>
    </div>
    <span class="description text-h5 font-weight-normal text-grey500 pa-2 w-100">
      {{ truncateBody(data.summary) }}
      <span
        class="text-primary"
      >Read more</span>
    </span>
  </nuxt-link>
</template>

<script setup lang="ts">
import type {
  BlogDTO,
} from '~/types/api'
import { useDisplay } from 'vuetify'

interface IBlogCard {
  data: BlogDTO
}

defineProps<IBlogCard>()
const { sm, xs } = useDisplay()

const truncateBody = (text: string) => {
  let cutLength = 40
  if (sm.value) cutLength = 42
  else if (xs.value) cutLength = 38
  return text.length > cutLength
    ? text.slice(0, cutLength) + '...'
    : text + '...'
}
</script>

<style scoped>
.card-blog{
  max-width: 274px;
  text-decoration: none;
}
.title-box-div{
  -webkit-backdrop-filter: blur(7.5px);
  backdrop-filter: blur(7.5px);
  background: rgba(var(--v-theme-grey700), 0.5);
}
.title-box{
  text-wrap: wrap;
  display: -webkit-box;
  overflow: hidden;
  text-overflow: ellipsis;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  height : 48px
}
.description{
  word-break: break-word;
}
</style>
