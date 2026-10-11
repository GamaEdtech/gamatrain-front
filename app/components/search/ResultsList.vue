<template>
  <v-infinite-scroll
    ref="infiniteScroll"
    class="w-100 search-results-infinite"
    mode="intersect"
    side="end"
    margin="80"
    @load="loadNextResults"
  >
    <v-row class="w-100 my-0 mx-0 justify-start flex-0-1">
      <template v-if="isInitialLoading">
        <v-col
          v-for="item in 4"
          :key="item"
          cols="12"
          class="px-0"
        >
          <search-card-skeleton />
        </v-col>
      </template>

      <template v-else>
        <v-col
          v-if="firstLoadedPage > 1"
          cols="12"
          class="d-flex justify-center"
        >
          <v-btn
            flat
            rounded="lg"
            color="grey200"
            class="text-grey700"
            :loading="isPreviousLoading"
            @click="emit('loadPrevious')"
          >
            <v-icon
              color="grey500"
              size="20"
              class="mr-1"
            >
              md:keyboard_arrow_up
            </v-icon>
            Load previous results
          </v-btn>
        </v-col>

        <template v-if="isPreviousLoading">
          <v-col
            v-for="item in 2"
            :key="`previous-${item}`"
            cols="12"
            class="px-0"
          >
            <search-card-skeleton />
          </v-col>
        </template>

        <v-col
          v-if="items.length === 0 && isAllDataLoaded"
          cols="12"
        >
          <div class="w-100 d-flex flex-column align-center justify-center ga-4 pa-8 rounded-lg empty-results">
            <span class="text-h4 font-weight-bold text-grey700 text-center">
              Be the first to add content to this category.
            </span>
            <v-btn
              color="primary"
              rounded="pill"
              flat
              width="250"
              class="text-none text-h5 font-weight-bold"
              @click="publishContent"
            >
              <v-icon color="brandNavy">
                md:add
              </v-icon>
              Publish
            </v-btn>
          </div>
        </v-col>

        <v-col
          v-for="item in items"
          :key="item.id"
          cols="12"
          class="px-0"
        >
          <search-card :information="item" />
        </v-col>
      </template>
    </v-row>

    <template #loading>
      <v-row
        v-if="items.length > 0 && !isInitialLoading"
        class="w-100 my-1 mx-0 justify-start flex-0-1"
      >
        <v-col
          v-for="item in 2"
          :key="item"
          cols="12"
          class="px-0"
        >
          <search-card-skeleton />
        </v-col>
      </v-row>
    </template>

    <template #error="{ props: errorProps }">
      <div class="w-100 d-flex justify-center my-4">
        <v-btn
          v-bind="errorProps"
          flat
          rounded="lg"
          color="grey200"
          class="text-grey700"
        >
          Couldn't load more results. Try again
        </v-btn>
      </div>
    </template>

    <template #empty>
      <div />
    </template>
  </v-infinite-scroll>
</template>

<script setup lang="ts">
import type { SearchResourceItem, SearchServiceId } from '@/types/search'

type InfiniteScrollStatus = 'ok' | 'empty' | 'loading' | 'error'

interface InfiniteScrollLoadOptions {
  done: (status: InfiniteScrollStatus) => void
}

const infiniteScroll = ref<{ reset: () => void } | null>(null)
const router = useRouter()
const route = useRoute()
const auth = useAuth()

const props = defineProps<{
  items: SearchResourceItem[]
  isInitialLoading: boolean
  isPaginationLoading: boolean
  isPreviousLoading: boolean
  isAllDataLoaded: boolean
  firstLoadedPage: number
  activeService: SearchServiceId
}>()

const emit = defineEmits<{
  loadNext: [done: (status: InfiniteScrollStatus) => void]
  loadPrevious: []
}>()

const loadNextResults = async ({ done }: InfiniteScrollLoadOptions) => {
  if (props.isInitialLoading || props.isPaginationLoading || props.items.length === 0) {
    done('ok')
    return
  }

  if (props.isAllDataLoaded) {
    done('empty')
    return
  }

  emit('loadNext', done)
}

const reset = () => {
  infiniteScroll.value?.reset()
}

const createLinksByService: Partial<Record<SearchServiceId, string>> = {
  'paper': '/user/paper/create',
  'study-materials': '/user/multimedia/create',
  'tutorial': '/user/paper/create',
  'quizhub': '/test-maker/create',
  'forum': '/user/question/create',
}

const publishContent = () => {
  if (!auth.isAuthenticated.value) {
    router.push({
      query: {
        ...route.query,
        auth_form: 'login',
      },
    })
    return
  }

  router.push(createLinksByService[props.activeService] || '/user/paper/create')
}

defineExpose({
  reset,
})
</script>

<style scoped>
:deep(.search-results-infinite .v-infinite-scroll__side) {
  padding: 0;
}

.empty-results {
  min-height: 220px;
  border: 1px solid rgb(var(--v-theme-grey200));
}
</style>
