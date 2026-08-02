<template>
  <div class="w-100 d-flex align-center justify-space-between">
    <div class="ga-1 d-flex align-center">
      <v-img
        width="48"
        height="48"
        :src="contentData?.avatar"
        class="rounded-circle"
        alt="user profile"
      />
      <p class="text-grey700 text-h5 font-weight-bold">
        {{ contentData?.first_name }} {{ contentData?.last_name }}
      </p>
    </div>
    <span class="text-h5 d-flex align-center text-info ga-1">
      <v-icon color="info">md:notifications_outlined</v-icon>
      follow
    </span>
  </div>

  <div
    :class="`w-100 text-h5 mt-4 position-relative ${
      seeCompleteDescription ? `open-description` : `close-description`
    }`"
  >
    <div
      ref="descriptionContent"
      v-html="contentData?.description"
    />

    <div
      v-if="hasOverflow && !seeCompleteDescription"
      class="blur-div position-absolute left-0 bottom-0 w-100"
    />
  </div>
  <button
    v-if="hasOverflow"
    type="button"
    class="w-100 pa-0 bg-transparent border-0 text-left cursor-pointer text-h5 d-flex align-center ga-1 mt-1"
    :aria-expanded="seeCompleteDescription"
    @click="seeCompleteDescription = !seeCompleteDescription"
  >
    <span class="text-info">{{ seeCompleteDescription ? `See Less` : `See More` }}</span>
    <v-icon color="info">
      {{ seeCompleteDescription ? 'md:keyboard_arrow_up' : 'md:keyboard_arrow_down' }}
    </v-icon>
  </button>

  <div
    v-if="contentData.collectionList && contentData.collectionList.length > 0"
    class="w-100 bg-grey100 mt-2 rounded-lg container-chapter-book overflow-y-auto pa-4"
  >
    <span class="text-h5 font-weight-bold text-grey700">Book chapters</span>
    <ul
      class="pl-4 mt-2"
      style="list-style-type: none"
    >
      <li
        v-for="(item, index) in contentData.collectionList"
        :key="index"
      >
        <span class="text-h5 font-weight-medium text-grey700">{{ item.title }}</span>
        <ul
          v-if="item.chapters && item.chapters.length"
          style="list-style-type: none"
        >
          <li
            v-for="(chapter, chapterIndex) in item.chapters"
            :key="chapterIndex"
          >
            <span class="text-h6 font-weight-regular text-grey700">{{ chapter.title }}</span>
          </li>
        </ul>
      </li>
    </ul>
  </div>
  <div class="w-100 d-flex align-center justify-space-between mt-4">
    <span class="text-h5 d-flex align-center text-grey600 ga-1">
      <v-icon color="grey600">md:files_outlined</v-icon>
      {{ contentData?.content_type_title }}
    </span>
    <span class="text-h5 d-flex align-center text-grey600 ga-1">
      <v-icon color="grey600">md:update</v-icon>
      {{ fromNowLocal(contentData?.up_date) }}
    </span>
  </div>

  <div class="w-100 d-flex flex-wrap ga-2 mt-3">
    <v-chip
      class="bg-grey100"
      :small="mdAndDown"
      :to="`/search?type=multimedia&section=${contentData?.section}`"
      flat
    >
      <span class="text-grey500 text-h6 font-weight-bold">
        {{ contentData?.section_title }}</span>
    </v-chip>
    <v-chip
      class="bg-grey100"
      flat
      :small="mdAndDown"
      :to="`/search?type=multimedia&section=${contentData?.section}&base=${contentData?.base}`"
    >
      <span class="text-grey500 text-h6 font-weight-bold">
        {{ contentData?.base_title }}</span>
    </v-chip>
    <v-chip
      class="bg-grey100"
      flat
      :small="mdAndDown"
      :to="`/search?type=multimedia&section=${contentData?.section}&base=${contentData?.base}&lesson=${contentData?.lesson}`"
    >
      <span class="text-grey500 text-h6 font-weight-bold">
        {{ contentData?.lesson_title }}</span>
    </v-chip>
  </div>
</template>

<script setup lang="ts">
import type { MultimediaDetailDTO } from '@/types'
import { useDisplay } from 'vuetify'

const props = defineProps<{
  contentData: MultimediaDetailDTO
}>()

const { fromNowLocal } = useDateTime()
const { mdAndDown } = useDisplay()

const seeCompleteDescription = ref(false)
const descriptionContent = ref<HTMLElement | null>(null)
const hasOverflow = ref(false)
const collapsedDescriptionHeight = 70
let descriptionResizeObserver: ResizeObserver | null = null

function updateDescriptionOverflow() {
  hasOverflow.value = (descriptionContent.value?.scrollHeight ?? 0) > collapsedDescriptionHeight
}

onMounted(async () => {
  await nextTick()
  updateDescriptionOverflow()

  if (descriptionContent.value && typeof ResizeObserver !== 'undefined') {
    descriptionResizeObserver = new ResizeObserver(updateDescriptionOverflow)
    descriptionResizeObserver.observe(descriptionContent.value)
  }
})

watch(
  () => props.contentData?.description,
  async () => {
    seeCompleteDescription.value = false
    await nextTick()
    updateDescriptionOverflow()
  },
)

onBeforeUnmount(() => {
  descriptionResizeObserver?.disconnect()
})
</script>

<style scoped>
.open-description {
  height: unset;
  min-height: 70px;
  overflow: unset;
}
.close-description {
  max-height: 70px;
  overflow: hidden;
}
.blur-div {
  height: 40px;
  pointer-events: none;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, #ffffff 80%);
}
.container-chapter-book{
  height: 160px;
}
</style>
