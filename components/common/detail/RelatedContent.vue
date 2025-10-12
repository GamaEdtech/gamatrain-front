<template>
  <div class="mx-4">
    <div class="d-flex align-center mb-6 ga-2">
      <div
        class="d-flex align-center justify-center rounded-circle pa-2"
        :style="`background-color : ${infoMap[type].color}`"
      >
        <span :class="`icon-title ${infoMap[type].icon}`" />
      </div>
      <h1 class="text-h4 font-weight-semibold primary-gray-700">
        Related {{ title }}
      </h1>
    </div>
    <v-slide-group v-if="loading">
      <v-slide-group-item
        v-for="item in 10"
        :key="item"
      >
        <CommonDetailRelatedContentCardSkeleton :type="type" />
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
            mdi-chevron-left
          </v-icon>
        </v-btn>
      </template>

      <template #next>
        <v-btn
          icon
          size="sm"
        >
          <v-icon color="#000000">
            mdi-chevron-right
          </v-icon>
        </v-btn>
      </template>

      <v-slide-group-item
        v-for="item in data"
        :key="item.id"
      >
        <nuxt-link :to="`/${type}/${item.id}/${item.title_url}`">
          <common-detail-related-content-card
            :picture="item.thumb_pic || fallbackImage"
            :title="item.title"
            :score="item.referee_score || item.type_title"
            :avatar="item.avatar"
            :first-name="item.first_name"
            :last-name="item.last_name"
            :type="type"
          />
        </nuxt-link>
      </v-slide-group-item>
    </v-slide-group>
  </div>
</template>

<script setup lang="ts">
interface ApiResponse<T> {
  data: T
  succeeded: boolean
  status: number
  errors: {
    message: string
    code: string
    reference: string
    info: string
    value: string
  }[]
}
interface ContentItemDTO {
  id: string
  title: string
  title_url: string
  thumb_pic?: string
  avatar: string
  edu_month: string
  first_name: string
  last_name: string
  q_file_pages?: string
  referee_score: string
  smart: boolean
  test_type: string
  type_title?: string
}

interface RelatedContentDTO {
  exams: ContentItemDTO[]
  files: ContentItemDTO[]
  questions: ContentItemDTO[]
  tests: ContentItemDTO[]
  tutorials: ContentItemDTO[]
}

type sourceType = 'test'
type requestType = 'test'
type content = 'paper'

interface IRelatedPortraitContent {
  type: content
  title: string
  source: sourceType
  request: requestType
}

const props = defineProps<IRelatedPortraitContent>()
const route = useRoute()

const infoMap = {
  paper: {
    icon: 'icon-paper',
    color: '#2e90fa',
    keyResponse: 'tests',
  },
}
const data = ref<ContentItemDTO[]>([])
const loading = ref(true)
const relatedId = route.params.id ? route.params.id : route.params.slug[0]
const fallbackImage = '/images/GamaBag.webp'

const getRelatedContent = async () => {
  try {
    loading.value = true
    const params = {
      source: props.source,
      request: props.request,
      id: relatedId as string,
    }
    const response = await useApiService.get<ApiResponse<RelatedContentDTO>>(
      '/api/v1/recommendations/related',
      params,
    )
    const related = response.data

    data.value
      = related[infoMap[props.type].keyResponse as keyof RelatedContentDTO]
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
  if (props.type === 'paper') {
    return '243px'
  }
  else if (props.type === 'multimedia') {
    return '120px'
  }
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
</style>
