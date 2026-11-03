<template>
  <v-container class="d-flex flex-column align-center mt-16 px-2">
    <PostListFeatured
      v-if="isLoadingFeatured || featuredPosts.length > 0"
      :posts="featuredPosts"
      :loading="isLoadingFeatured"
    />

    <PostListFilters
      :title="filters.title"
      :tag-id="filters.tagId"
      :categories="categories"
      :loading-categories="isLoadingCategories"
      @update:title="handleTitleInput"
      @update:tag-id="handleTagChanged"
    />

    <PostListItems
      ref="postList"
      :posts="posts"
      :first-loaded-page="firstLoadedPage"
      :loading-filters="isLoadingFilters"
      :loading-previous="isLoadingPreviousPage"
      :load-previous-error="loadPreviousError"
      :all-data-loaded="isAllDataLoaded"
      :load-error="loadError"
      @load="loadNextPage"
      @load-previous="loadPreviousPage"
      @retry="reloadPosts"
    />
  </v-container>
</template>

<script setup lang="ts">
import type { GetPostListParams, PostDTO, TagDTO } from '@/types'

type InfiniteScrollStatus = 'ok' | 'empty' | 'loading' | 'error'
type FetchResult = 'ok' | 'error' | 'stale'
type UpdateMode = 'reset' | 'append' | 'prepend'

interface InfiniteScrollLoadOptions {
  done: (status: InfiniteScrollStatus) => void
}

interface PostListComponent {
  reset: () => void
}

const route = useRoute()
const router = useRouter()
const { getPosts, getCategories } = usePostList()

const PAGE_SIZE = 15
const INPUT_DEBOUNCE_MS = 800
let inputTimer: ReturnType<typeof setTimeout> | null = null
let filtersVersion = 0

const queryString = (value: unknown) => typeof value === 'string' ? value : ''
const queryNumber = (value: unknown, fallback: number) => {
  const parsed = Number(queryString(value))
  return Number.isInteger(parsed) && parsed >= 0 ? parsed : fallback
}

const initialPage = Math.max(1, queryNumber(route.query.page, 1))
const filters = reactive({
  title: queryString(route.query.keyword),
  tagId: queryNumber(route.query.cat, 0),
})

const posts = ref<PostDTO[]>([])
const featuredPosts = ref<PostDTO[]>([])
const categories = ref<TagDTO[]>([])
const page = ref(initialPage)
const firstLoadedPage = ref(initialPage)
const lastLoadedPage = ref(initialPage)
const isAllDataLoaded = ref(false)
const isLoadingFeatured = ref(true)
const isLoadingCategories = ref(true)
const isLoadingFilters = ref(false)
const isLoadingPreviousPage = ref(false)
const isLoadingNextPage = ref(false)
const loadError = ref(false)
const loadPreviousError = ref(false)
const postList = ref<PostListComponent | null>(null)

const postListHost = useRequestURL().host
useHead(() => ({
  title: 'Exploring the Latest Insights in K12 Education | GamaTrain Post',
  link: [{ rel: 'canonical', href: canonicalListUrl(postListHost, '/post', route.query, ['cat']) }],
  meta: [
    { name: 'apple-mobile-web-app-title', content: 'Exploring the Latest Insights in K12 Education | GamaTrain Post' },
    { name: 'og:title', content: 'Exploring the Latest Insights in K12 Education | GamaTrain Post' },
    { name: 'og:site_name', content: 'GamaTrain' },
    { name: 'description', content: 'Stay informed and inspired with GamaTrain\'s insightful post, featuring thought-provoking articles on the latest trends and best practices in K12 education.' },
    { name: 'og:description', content: 'Stay informed and inspired with GamaTrain\'s insightful post, featuring thought-provoking articles on the latest trends and best practices in K12 education.' },
  ],
}))

const getParams = (pageNumber: number): GetPostListParams => ({
  page: pageNumber,
  pageSize: PAGE_SIZE,
  title: filters.title,
  tagId: filters.tagId || undefined,
})

const uniquePostsById = (items: PostDTO[]) => {
  const seenIds = new Set<number>()

  return items.filter((item) => {
    if (seenIds.has(item.id)) return false

    seenIds.add(item.id)
    return true
  })
}

const updatePosts = (items: PostDTO[], mode: UpdateMode) => {
  if (mode === 'reset') {
    posts.value = uniquePostsById(items)
  }
  else if (mode === 'prepend') {
    posts.value = uniquePostsById([...items, ...posts.value])
  }
  else {
    posts.value = uniquePostsById([...posts.value, ...items])
  }

  if (mode !== 'prepend') isAllDataLoaded.value = items.length < PAGE_SIZE
}

const fetchPosts = async (pageNumber: number, mode: UpdateMode): Promise<FetchResult> => {
  const version = filtersVersion

  const response = await getPosts(getParams(pageNumber))
  if (version !== filtersVersion) return 'stale'
  if (!response.succeeded) return 'error'

  updatePosts(response.data?.list ?? [], mode)
  return 'ok'
}

const updateQuery = async () => {
  const query: Record<string, string> = {}
  if (page.value > 1) query.page = String(page.value)
  if (filters.title) query.keyword = filters.title
  if (filters.tagId) query.cat = String(filters.tagId)
  await router.replace({ query })
}

const reloadPosts = async (pageNumber = firstLoadedPage.value) => {
  filtersVersion++
  const requestVersion = filtersVersion
  loadError.value = false
  loadPreviousError.value = false
  isLoadingFilters.value = true

  const result = await fetchPosts(pageNumber, 'reset')

  // A newer search or category change owns the loading state and scroll reset.
  if (result === 'stale' || requestVersion !== filtersVersion) return

  isLoadingFilters.value = false
  loadError.value = result === 'error'

  // Let Vue render the complete first page before observing the end sentinel again.
  await nextTick()
  postList.value?.reset()
}

const applyFilters = async (syncQuery = true, pageNumber = 1) => {
  filtersVersion++
  page.value = pageNumber
  firstLoadedPage.value = pageNumber
  lastLoadedPage.value = pageNumber
  posts.value = []
  isAllDataLoaded.value = false
  // Keep the infinite scroll from loading page 2 of the new filter while the
  // empty list waits for the query update.
  isLoadingFilters.value = true

  if (syncQuery) {
    await updateQuery()
  }

  await reloadPosts(pageNumber)
}

const handleTitleInput = (value: string) => {
  filters.title = value
  filtersVersion++
  isLoadingFilters.value = true
  if (inputTimer) clearTimeout(inputTimer)
  inputTimer = setTimeout(applyFilters, INPUT_DEBOUNCE_MS)
}

const handleTagChanged = (value: number) => {
  filters.tagId = value
  if (inputTimer) clearTimeout(inputTimer)
  applyFilters()
}

watch(
  () => [route.query.keyword, route.query.cat, route.query.page],
  async ([keyword, category, pageQuery]) => {
    const title = queryString(keyword)
    const tagId = queryNumber(category, 0)
    const pageNumber = Math.max(1, queryNumber(pageQuery, 1))

    // Query changes made by this page already match the local state and must
    // not start a second request.
    if (title === filters.title && tagId === filters.tagId && pageNumber === page.value) return

    if (inputTimer) {
      clearTimeout(inputTimer)
      inputTimer = null
    }

    // A link, an edited URL or back/forward: show exactly what the URL asks for.
    filters.title = title
    filters.tagId = tagId
    await applyFilters(false, pageNumber)
  },
)

const loadPreviousPage = async () => {
  if (firstLoadedPage.value <= 1 || isLoadingPreviousPage.value || isLoadingNextPage.value) return

  isLoadingPreviousPage.value = true
  loadPreviousError.value = false
  const previousPage = firstLoadedPage.value - 1
  const result = await fetchPosts(previousPage, 'prepend')
  isLoadingPreviousPage.value = false
  loadPreviousError.value = result === 'error'
  if (result !== 'ok') return

  firstLoadedPage.value = previousPage
  page.value = previousPage
  await updateQuery()
}

const loadNextPage = async ({ done }: InfiniteScrollLoadOptions) => {
  if (isLoadingFilters.value) {
    // Stop observing the short skeleton state. reloadPosts resets it after the
    // filtered results have been rendered.
    done('empty')
    return
  }
  if (isLoadingPreviousPage.value || isLoadingNextPage.value) {
    done('ok')
    return
  }
  if (isAllDataLoaded.value || loadError.value) {
    done('empty')
    return
  }

  isLoadingNextPage.value = true
  const nextPage = lastLoadedPage.value + 1
  const result = await fetchPosts(nextPage, 'append')
  isLoadingNextPage.value = false

  if (result === 'stale') return done('empty')
  if (result === 'error') return done('error')

  lastLoadedPage.value = nextPage
  page.value = nextPage
  await updateQuery()
  done(isAllDataLoaded.value ? 'empty' : 'ok')
}

const [{ data: featuredResponse }, { data: initialPosts }, { data: categoryResponse }] = await Promise.all([
  useAsyncData('post-featured', () => getPosts({ page: 1, pageSize: 6, isFeatured: true })),
  useAsyncData(
    `post-list-${initialPage}-${filters.title}-${filters.tagId}`,
    () => getPosts(getParams(initialPage)),
  ),
  useAsyncData('post-list-categories', () => getCategories()),
])
if (featuredResponse.value?.succeeded) {
  featuredPosts.value = featuredResponse.value.data?.list ?? []
}

if (initialPosts.value?.succeeded) updatePosts(initialPosts.value.data?.list ?? [], 'reset')
else loadError.value = true

if (categoryResponse.value?.succeeded) categories.value = categoryResponse.value.data ?? []
isLoadingFeatured.value = false
isLoadingCategories.value = false

onBeforeUnmount(() => {
  if (inputTimer) clearTimeout(inputTimer)
})
</script>
