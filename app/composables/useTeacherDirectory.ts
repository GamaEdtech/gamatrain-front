import type { LocationQueryRaw } from 'vue-router'
import type { GetTeacherProfilesParams, TeacherProfileSortFilter } from '@/types'
import { canonicalListUrl } from '@/utils/canonicalListUrl'

const PAGE_SIZE = 12
const INPUT_DEBOUNCE_MS = 400
const DEFAULT_SORT = 'recent'
const OG_IMAGE = 'https://gamatrain.com/images/og-home.jpg'

const SORT_FILTERS: Record<string, TeacherProfileSortFilter> = {
  'name-asc': { sortType: 'Asc', column: 'FullName' },
  'name-desc': { sortType: 'Desc', column: 'FullName' },
}

export const TEACHER_SORT_ITEMS = [
  { title: 'Recently active', value: DEFAULT_SORT },
  { title: 'Name A-Z', value: 'name-asc' },
  { title: 'Name Z-A', value: 'name-desc' },
]

export const TEACHER_BREADCRUMBS = [
  { text: 'Home', disabled: false, href: '/' },
  { text: 'Teachers', disabled: true, href: '/teacher' },
]

/**
 * The teacher list. The URL holds the whole state (page, filters, sort), so every view is a real link: pages render
 * on the server, can be shared, and come back as they were after opening a profile. `ready` resolves once the
 * first list has loaded; await it in the page.
 */
export const useTeacherDirectory = () => {
  const route = useRoute()
  const router = useRouter()
  const event = useRequestEvent()
  const { getData } = useTeachers()
  const { organizationSchema, createWebPageSchema, createBreadcrumbSchema } = useSeoSchema()
  const host = useRequestURL().host

  const queryText = (key: string) => {
    const value = route.query[key]
    return typeof value === 'string' ? value.trim() : ''
  }

  const page = computed(() => {
    const value = Number(route.query.page)
    return Number.isInteger(value) && value > 0 ? value : 1
  })

  const params = computed<GetTeacherProfilesParams>(() => {
    const sortFilter = SORT_FILTERS[queryText('sort')]
    return {
      page: page.value,
      pageSize: PAGE_SIZE,
      fullName: queryText('fullName'),
      skill: queryText('skill'),
      sortFilter: sortFilter ? [sortFilter] : undefined,
    }
  })

  const asyncData = useAsyncData('teacher-directory', () => getData(params.value), { watch: [params] })
  const { data, status, refresh } = asyncData

  // The API leaves out teachers with no name; this guards against one slipping through, since a card needs a name.
  const teachers = computed(() => (data.value?.data?.list ?? []).filter(teacher => teacher.fullName?.trim()))
  const total = computed(() => data.value?.data?.totalRecordsCount ?? 0)
  const pageCount = computed(() => Math.ceil(total.value / PAGE_SIZE))
  const isUpdating = computed(() => status.value === 'pending')
  const hasFailed = computed(() => data.value?.succeeded === false)
  const isFiltered = computed(() => Boolean(params.value.fullName || params.value.skill || params.value.sortFilter))

  // Empty values leave the URL, so "no filter" has a single address.
  const withQuery = (changes: Record<string, string>): LocationQueryRaw => {
    return Object.fromEntries(Object.entries({ ...route.query, ...changes }).filter(([, value]) => value))
  }

  const pageLink = (pageNumber: number) => ({
    query: withQuery({ page: pageNumber > 1 ? String(pageNumber) : '' }),
    hash: '#teachers',
  })

  const applyFilters = (changes: Record<string, string>) => {
    return router.replace({ query: withQuery({ ...changes, page: '' }) })
  }

  const sort = computed({
    get: () => (SORT_FILTERS[queryText('sort')] ? queryText('sort') : DEFAULT_SORT),
    set: value => applyFilters({ sort: value === DEFAULT_SORT ? '' : value }),
  })

  const fullName = ref(queryText('fullName'))
  const skill = ref(queryText('skill'))
  let inputTimer: ReturnType<typeof setTimeout> | undefined

  watch([fullName, skill], () => {
    clearTimeout(inputTimer)
    inputTimer = setTimeout(() => {
      const changes = { fullName: fullName.value?.trim() ?? '', skill: skill.value?.trim() ?? '' }
      if (changes.fullName !== queryText('fullName') || changes.skill !== queryText('skill')) {
        applyFilters(changes)
      }
    }, INPUT_DEBOUNCE_MS)
  })

  // The browser's back button changes the URL without touching the fields.
  watch(() => route.query, () => {
    fullName.value = queryText('fullName')
    skill.value = queryText('skill')
  })

  onBeforeUnmount(() => clearTimeout(inputTimer))

  const title = computed(() => {
    return `Find a Teacher on GamaTrain${page.value > 1 ? ` - Page ${page.value}` : ''}`
  })
  const description = computed(() => {
    const count = !isFiltered.value && total.value ? `${total.value} ` : ''
    return `Browse ${count}teachers on GamaTrain. Search by name, then open a profile to see each teacher's skills, experience and biography.`
  })
  const canonical = computed(() => {
    return canonicalListUrl(host, '/teacher', { page: page.value > 1 ? String(page.value) : '' }, ['page'])
  })

  useSeoMeta({
    title,
    description,
    ogTitle: title,
    ogDescription: description,
    ogImage: OG_IMAGE,
    twitterCard: 'summary_large_image',
    // Filtered and sorted views repeat the same teachers; their links are still worth following.
    robots: () => (isFiltered.value || teachers.value.length === 0 ? 'noindex, follow' : undefined),
  })

  const schema = computed(() => {
    const url = canonical.value
    const firstPosition = (page.value - 1) * PAGE_SIZE
    return {
      '@context': 'https://schema.org',
      '@graph': [
        organizationSchema,
        {
          ...createWebPageSchema({ dto: null, url, title: title.value, description: description.value }, '#teachers'),
          '@type': 'CollectionPage',
          'description': description.value,
        },
        {
          '@type': 'ItemList',
          '@id': `${url}#teachers`,
          'numberOfItems': total.value,
          'itemListElement': teachers.value.map((teacher, index) => ({
            '@type': 'ListItem',
            'position': firstPosition + index + 1,
            'url': `https://${host}/profile/${teacher.handle}`,
          })),
        },
        createBreadcrumbSchema(TEACHER_BREADCRUMBS),
      ],
    }
  })

  useHead({
    titleTemplate: '%s',
    link: [{ rel: 'canonical', href: canonical }],
    script: [{
      key: 'json-ld-schema',
      type: 'application/ld+json',
      innerHTML: () => JSON.stringify(schema.value),
    }],
  })

  // A failed render must not reach the edge cache, which stores only successful pages.
  const ready = asyncData.then(() => {
    if (event && hasFailed.value) setResponseStatus(event, 503)
  })

  return {
    ready,
    page,
    teachers,
    total,
    pageCount,
    isUpdating,
    hasFailed,
    isFiltered,
    fullName,
    skill,
    sort,
    pageLink,
    refresh,
    clearFilters: () => {
      fullName.value = ''
      skill.value = ''
      return router.replace({ query: {} })
    },
  }
}
