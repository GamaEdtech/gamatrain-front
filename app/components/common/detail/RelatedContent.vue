<template>
  <div
    v-if="loading || pastpaper.length > 0"
    class="mx-4"
  >
    <div class="d-flex align-center mb-6 ga-2">
      <div
        class="d-flex align-center justify-center rounded-circle pa-2"
        :style="`background-color : ${infoMap[`paper`].color}`"
      >
        <span :class="`icon-title ${infoMap[`paper`].icon}`" />
      </div>
      <h1 class="text-h4 font-weight-semibold primary-gray-700">
        Related Past Papers
      </h1>
    </div>
    <v-slide-group v-if="loading">
      <v-slide-group-item
        v-for="item in 10"
        :key="item"
      >
        <lazy-common-detail-related-content-card-skeleton type="paper" />
      </v-slide-group-item>
    </v-slide-group>
    <v-slide-group
      v-else
      show-arrows
      class="related-content position-relative"
      :style="{ height: `${CardHeight}` }"
    >
      <template #prev>
        <v-btn
          icon
          size="sm"
        >
          <v-icon color="#000000">
            md:chevron_backward
          </v-icon>
        </v-btn>
      </template>

      <template #next>
        <v-btn
          icon
          size="sm"
        >
          <v-icon color="#000000">
            md:chevron_forward
          </v-icon>
        </v-btn>
      </template>

      <v-slide-group-item
        v-for="item in pastpaper"
        :key="item.id"
      >
        <nuxt-link :to="`/paper/${item.id}/${item.title_url}`">
          <lazy-common-detail-related-content-card
            :picture="item.thumb_pic || fallbackImage"
            :title="item.title"
            :score="item.referee_score || item.type_title"
            :avatar="item.avatar"
            :first-name="item.first_name"
            :last-name="item.last_name"
            type="paper"
          />
        </nuxt-link>
      </v-slide-group-item>
    </v-slide-group>
  </div>

  <div
    v-if="loading || tutorials.length > 0"
    class="mx-4 my-8"
  >
    <div class="d-flex align-center mb-6 ga-2">
      <div
        class="d-flex align-center justify-center rounded-circle pa-2"
        :style="`background-color : ${infoMap[`tutorial`].color}`"
      >
        <span :class="`icon-title ${infoMap[`tutorial`].icon}`" />
      </div>
      <h1 class="text-h4 font-weight-semibold primary-gray-700">
        Related Tutorials
      </h1>
    </div>
    <div
      v-if="loading"
      class="w-100 d-flex flex-column justify-start ga-8 pl-4"
    >
      <div
        v-for="i in 5"
        :key="i"
        class="d-flex align-center ga-2"
      >
        <v-skeleton-loader
          class="rounded-lg"
          width="20"
          height="20"
        />
        <v-skeleton-loader
          class="rounded-lg"
          width="200"
          height="20"
        />
      </div>
    </div>
    <div
      v-else
      class="w-100 d-flex flex-column justify-start ga-8 pl-4"
    >
      <nuxt-link
        v-for="(tutorial, index) in tutorials"
        :key="index"
        :to="`/tutorial/${tutorial.id}/${tutorial.title_url}`"
        class="d-flex align-center ga-2"
      >
        <div class="square-div" />
        <span class="text-h5 primary-gray-500 text-truncate">
          {{ tutorial.title }}
        </span>
      </nuxt-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ApiResult, RelatedContentDTO, ContentItemDTO } from '@/types'

type sourceType
  = | 'test'
    | 'file'
    | 'question'
    | 'exam'
    | 'examTest'
    | 'tutorial'
type requestType = 'test' | 'file' | 'exam' | 'question' | 'tutorial'
// type content = 'paper' | 'exam' | 'question' | 'tutorial'

interface IRelatedPortraitContent {
  source: sourceType
  request: requestType[]
  id: string
}

const props = defineProps<IRelatedPortraitContent>()

const infoMap = {
  paper: {
    icon: 'icon-paper',
    color: '#2e90fa',
    keyResponse: 'tests',
  },
  exam: {
    icon: 'icon-paper',
    color: '#2e90fa',
    keyResponse: 'tests',
  },
  question: {
    icon: 'icon-paper',
    color: '#2e90fa',
    keyResponse: 'tests',
  },
  tutorial: {
    icon: 'icon-tutorial',
    color: '#2e90fa',
    keyResponse: 'tutorials',
  },
}
const pastpaper = ref<ContentItemDTO[]>([])
const tutorials = ref<ContentItemDTO[]>([])

const loading = ref(true)
const fallbackImage = '/images/GamaBag.webp'

const getRelatedContent = async () => {
  try {
    loading.value = true
    const params = {
      source: props.source,
      request: props.request.join(','),
      id: props.id,
    }
    const response = await useApiService.get<ApiResult<RelatedContentDTO>>(
      '/api/v1/recommendations/related',
      params,
      {
        public: true,
      },
    )
    const related = response.data
    if (related) {
      pastpaper.value
        = related[infoMap['paper'].keyResponse as keyof RelatedContentDTO]
      tutorials.value
        = related[infoMap['tutorial'].keyResponse as keyof RelatedContentDTO]
    }
  }
  catch (error) {
    console.error('Search error:', error)
  }
  finally {
    loading.value = false
  }
}

onMounted(async () => {
  await getRelatedContent()
})

const CardHeight = computed(() => {
  // if (props.type === "paper") {
  //   return "243px";
  // }
  // else if (props.type === "multimedia") {
  //   return "120px";
  // }
  return 'auto'
})
</script>

<style scoped>
.icon-title {
  color: white;
}

:deep(.related-content:hover > .v-slide-group__prev),
:deep(.related-content:hover > .v-slide-group__next) {
  opacity: 1;
  visibility: visible;
  position: absolute;
}

:deep(.related-content > .v-slide-group__wrapper) {
  order: 1;
  width: 100%;
  align-items: center;
}

:deep(.related-content > .v-slide-group__prev),
:deep(.related-content > .v-slide-group__next) {
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

:deep(.related-content > .v-slide-group__prev > i),
:deep(.related-content > .v-slide-group__next > i) {
  color: white !important;
}

:deep(
    .related-content
      > .v-slide-group__prev
      > .theme--light.v-icon.v-icon.v-icon--disabled
  ),
:deep(
    .related-content
      > .v-slide-group__next
      > .theme--light.v-icon.v-icon.v-icon--disabled
  ) {
  color: rgba(255, 255, 255, 0.1) !important;
}

:deep(.related-content > .v-slide-group__prev > .v-slide-group__prev--disabled),
:deep(.v-slide-group__prev--disabled),
:deep(.related-content > .v-slide-group__next > .v-slide-group__next--disabled),
:deep(.v-slide-group__next--disabled) {
  pointer-events: unset !important;
  opacity: 0.6 !important;
  transition: opacity 300ms ease, visibility 300ms ease;
}

:deep(.related-content > .v-slide-group__prev) {
  position: absolute;
  margin-top: 90px;
  left: 20px;
  z-index: 10;
}

:deep(.related-content > .v-slide-group__next) {
  position: absolute;
  margin-top: 90px;
  right: 20px;
  z-index: 10;
}

.square-div {
  min-width: 20px;
  min-height: 20px;
  background-color: #b2ddff;
  border-radius: 8px;
}
</style>
