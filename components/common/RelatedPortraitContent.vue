<template>
  <div class="mx-4">
    <div
      class="d-flex mb-3"
      style="gap: 8px"
    >
      <h1
        class="gtext-t4 font-weight-semibold"
        style="color: #344054"
      >
        Related {{ pageName }}
      </h1>
    </div>
    <v-slide-group
      show-arrows
      class="related-content"
      :style="{ height: `${CardHeight}` }"
    >
      <template #prev>
        <v-btn
          icon
          size="sm"
        >
          <v-icon>mdi-chevron-left</v-icon>
        </v-btn>
      </template>

      <template #next>
        <v-btn
          icon
          size="sm"
        >
          <v-icon>mdi-chevron-right</v-icon>
        </v-btn>
      </template>

      <v-slide-group-item
        v-for="item in data"
        :key="item.id"
      >
        <nuxt-link :to="`/${pageType}/${item.id}/${item.title_url}`">
          <common-related-portrait-content-card
            :card-picture="item.thumb_pic || fallbackImage"
            :card-title="item.title"
            :score="item.referee_score || item.type_title"
            :show-score-label="!!item.referee_score"
          />
        </nuxt-link>
      </v-slide-group-item>
    </v-slide-group>
  </div>
</template>

<script setup>
const props = defineProps({
  pageType: String,
  pageName: String,
  source: String,
  request: String,
})

const route = useRoute()

const data = ref(null)
const relatedId = route.params.id ? route.params.id : route.params.slug[0]
const fallbackImage = '/images/GamaBag.webp'

const getRelatedContent = async () => {
  try {
    const response = await $fetch('/api/v1/recommendations/related', {
      method: 'GET',
      params: {
        source: props.source,
        request: props.request,
        id: relatedId,
      },
    })
    const arrays = response.data
    for (const key in arrays) {
      if (Array.isArray(arrays[key]) && arrays[key].length > 0) {
        data.value = arrays[key]
        break
      }
    }

    if (!data.value) {
      data.value = []
    }
  }
  catch (error) {
    console.error('Search error:', error)
  }
}

onMounted(() => {
  console.log(relatedId)
  getRelatedContent()
})

const CardHeight = computed(() => {
  if (props.pageType === 'paper') {
    return '243px'
  }
  else if (props.pageType === 'multimedia') {
    return '120px'
  }
  return 'auto'
})
</script>

<style>
.v-slide-group__content {
  margin-top: 10px !important;
}
.related-content:hover > .v-slide-group__prev,
.related-content:hover > .v-slide-group__next {
  opacity: 1;
  visibility: visible;
  position: absolute;
}

.related-content > .v-slide-group__wrapper {
  order: 1;
  width: 100%;
  align-items: center;
}

.related-content > .v-slide-group__prev,
.related-content > .v-slide-group__next {
  order: 2;
  margin-top: 12px;
  background-color: #344054cc;
  border-radius: 50%;
  width: 40px !important;
  height: 40px !important;
  min-width: 40px !important;
  border: 1px solid #e4e7ec;
  color: white;
  opacity: 0;
  visibility: hidden;
  transition: opacity 300ms ease, visibility 300ms ease;
}
.related-content > .v-slide-group__prev > i,
.related-content > .v-slide-group__next > i {
  color: white !important;
}

.related-content
  > .v-slide-group__prev
  > .theme--light.v-icon.v-icon.v-icon--disabled,
.related-content
  > .v-slide-group__next
  > .theme--light.v-icon.v-icon.v-icon--disabled {
  color: rgba(255, 255, 255, 0.1) !important;
}

.related-content > .v-slide-group__prev > .v-slide-group__prev--disabled,
.v-slide-group__prev--disabled,
.related-content > .v-slide-group__next > .v-slide-group__next--disabled,
.v-slide-group__next--disabled {
  pointer-events: unset !important;
  opacity: 0.6 !important;
  transition: opacity 300ms ease, visibility 300ms ease;
}

.related-content > .v-slide-group__prev {
  position: absolute;
  margin-top: 90px;
  left: 10%;
  z-index: 10;
}
.related-content > .v-slide-group__next {
  position: absolute;
  margin-top: 90px;
  right: 10%;
  z-index: 10;
}
</style>
