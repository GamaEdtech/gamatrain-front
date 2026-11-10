<template>
  <v-container class="compare-page mt-16 pt-4 pb-16">
    <v-breadcrumbs
      :items="[{ title: 'Schools', to: '/school' }, { title: 'Compare', disabled: true }]"
      density="compact"
      class="px-0 text-caption text-grey600"
    />
    <div class="d-flex flex-wrap align-center ga-3 mb-4">
      <h1 class="text-h5 text-md-h4 font-weight-bold text-grey900 ma-0 flex-grow-1">
        Compare schools
      </h1>
      <v-switch
        v-model="onlyDifferences"
        color="primaryStrong"
        density="compact"
        hide-details
        inset
        label="Only show differences"
        class="flex-grow-0"
      />
      <v-btn
        variant="outlined"
        color="grey700"
        rounded="pill"
        class="text-none"
        prepend-icon="md:link"
        @click="copyLink"
      >
        <span class="text-grey800">Copy link</span>
      </v-btn>
    </div>

    <v-alert
      v-if="!home"
      type="info"
      variant="tonal"
      rounded="lg"
      density="compact"
      class="mb-4"
    >
      Set your home on the
      <nuxt-link to="/school">
        school list
      </nuxt-link>
      to compare distance and travel time too.
    </v-alert>

    <v-skeleton-loader
      v-if="status === 'pending'"
      type="table"
    />

    <v-empty-state
      v-else-if="!schools.length"
      icon="md:compare_arrows"
      title="No schools to compare yet"
      text="Press Compare on two to four schools in the list, then come back here."
    >
      <template #actions>
        <v-btn
          to="/school"
          color="primary"
          rounded="pill"
          class="text-none"
        >
          Find schools
        </v-btn>
      </template>
    </v-empty-state>

    <v-card
      v-else
      variant="flat"
      border
      rounded="lg"
    >
      <v-table
        class="compare-table"
        fixed-header
      >
        <thead>
          <tr>
            <th
              scope="col"
              class="compare-table__label"
            >
              <span class="d-sr-only">Detail</span>
            </th>
            <th
              v-for="school in schools"
              :key="school.id"
              scope="col"
              class="compare-table__school"
            >
              <v-img
                v-if="school.defaultImageUri"
                :src="school.defaultImageUri.replace(/^http:\/\//, 'https://')"
                :alt="school.name"
                height="96"
                cover
                class="rounded-lg mb-2 bg-grey100"
              />
              <div class="d-flex align-start ga-1">
                <nuxt-link
                  :to="`/school/${school.id}/${school.slug}`"
                  class="text-subtitle-1 font-weight-bold text-grey900 compare-table__name"
                >
                  {{ school.name }}
                </nuxt-link>
                <v-btn
                  icon="md:close"
                  size="x-small"
                  variant="text"
                  :aria-label="`Remove ${school.name}`"
                  @click="removeSchool(school.id)"
                />
              </div>
              <div class="text-caption text-grey600 font-weight-regular">
                {{ [schoolTypeLabel(school.schoolType), school.cityTitle || school.stateTitle].filter(Boolean).join(' · ') }}
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          <template
            v-for="group in visibleGroups"
            :key="group.title"
          >
            <tr class="compare-table__group">
              <th
                :colspan="schools.length + 1"
                scope="colgroup"
              >
                {{ group.title }}
              </th>
            </tr>
            <tr
              v-for="row in group.rows"
              :key="row.label"
            >
              <th
                scope="row"
                class="compare-table__label"
              >
                {{ row.label }}
              </th>
              <td
                v-for="(cell, index) in row.cells"
                :key="index"
                :class="{ 'compare-table__best': cell.best }"
              >
                <template v-if="cell.missing">
                  <span class="text-grey500">Not listed</span>
                  <nuxt-link
                    :to="`/school/${schools[index]?.id}/${schools[index]?.slug}`"
                    class="ml-1 text-caption"
                  >Add it</nuxt-link>
                </template>
                <template v-else>
                  {{ cell.text }}
                  <v-icon
                    v-if="cell.best"
                    size="16"
                    color="success"
                    class="ml-1"
                    aria-label="Best"
                  >
                    md:check_circle
                  </v-icon>
                </template>
              </td>
            </tr>
          </template>
        </tbody>
      </v-table>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import type { SchoolDetailDTO, SchoolRatingDTO } from '@/types'
import { SCHOOL_COMMENT_RATE_LIST } from '@/constants/school'

interface CompareSchool extends SchoolDetailDTO {
  latitude?: number | null
  longitude?: number | null
  tags?: { id: number, name: string }[] | null
  boards?: { id: number, title?: string | null }[] | null
  tuition?: number | null
  rating?: number | null
}

interface CompareEntry {
  school: CompareSchool
  rate: SchoolRatingDTO | null
}

interface Cell {
  text: string
  best?: boolean
  missing?: boolean
}

const route = useRoute()
const router = useRouter()
const compare = useSchoolCompare()
const { home, tripFromHome } = useSchoolHome()
const { $toast } = useNuxtApp()

const ids = computed(() => String(route.query.ids ?? '')
  .split(',')
  .map(Number)
  .filter(id => Number.isInteger(id) && id > 0)
  .slice(0, SCHOOL_COMPARE_MAX))

const { data, status } = await useAsyncData(
  'school-compare',
  () => (ids.value.length
    ? useApiService.get<{ data?: CompareEntry[] }>('/api/v2/schools/compare', { ids: ids.value }, { public: true })
        .then(response => response?.data ?? [])
        .catch(() => [])
    : Promise.resolve([] as CompareEntry[])),
  { watch: [ids] },
)

const entries = computed(() => data.value ?? [])
const schools = computed(() => entries.value.map(entry => entry.school))

// A shared link becomes this visitor's picks, so the tray and the list agree with what they see.
onMounted(() => {
  watch(entries, (value) => {
    if (!value.length) return
    compare.clear()
    value.forEach(entry => compare.add({ id: entry.school.id, name: entry.school.name ?? '', slug: entry.school.slug }))
  }, { immediate: true })
})

const removeSchool = (id: number) => {
  compare.remove(id)
  router.replace({ query: { ids: ids.value.filter(item => item !== id).join(',') || undefined } })
}

const copyLink = async () => {
  try {
    await navigator.clipboard.writeText(window.location.href)
    $toast?.success('Link copied')
  }
  catch {
    $toast?.error('Couldn\'t copy the link. Copy it from the address bar instead.')
  }
}

const onlyDifferences = ref(false)

const missing = (): Cell => ({ text: '', missing: true })

/** Marks the best numeric value(s) of a row; ties all count as best, a row where all agree has none. */
const withBest = (values: (number | null)[], cells: Cell[], higherIsBetter: boolean): Cell[] => {
  const known = values.filter((value): value is number => value != null)
  if (known.length < 2) return cells
  const best = higherIsBetter ? Math.max(...known) : Math.min(...known)
  if (known.every(value => value === best)) return cells
  return cells.map((cell, index) => ({ ...cell, best: values[index] === best }))
}

const groups = computed(() => {
  const list = schools.value
  const rates = entries.value.map(entry => entry.rate)
  const trips = list.map(school => tripFromHome(school.latitude, school.longitude))
  const tagNames = list.map(school => (school.tags ?? []).map(tag => tag.name))
  const allTags = [...new Set(tagNames.flat())].sort()

  const gettingThere = home.value
    ? [
        {
          label: 'Distance from home',
          cells: withBest(trips.map(trip => trip?.meters ?? null), trips.map(trip => (trip ? { text: trip.distance } : missing())), false),
        },
        { label: 'Walk / drive (estimate)', cells: trips.map(trip => (trip ? { text: [trip.walk && `${trip.walk} walk`, trip.drive && `${trip.drive} drive`].filter(Boolean).join(' / ') || 'Too far' } : missing())) },
      ]
    : []
  gettingThere.push({
    label: 'School bus',
    cells: tagNames.map(names => ({ text: names.includes(SCHOOL_BUS_TAG_NAME) ? 'Yes' : 'Not listed', best: names.includes(SCHOOL_BUS_TAG_NAME) && !tagNames.every(other => other.includes(SCHOOL_BUS_TAG_NAME)) })),
  })

  const ratingRows = SCHOOL_COMMENT_RATE_LIST.filter(item => item.key !== 'averageRate').map((item) => {
    const values = rates.map(rate => (rate?.totalCount ? Number(rate[item.key as keyof SchoolRatingDTO]) || null : null))
    return {
      label: item.title,
      cells: withBest(values, values.map(value => (value ? { text: `${value.toFixed(1)} / 5` } : { text: '–' })), true),
    }
  })
  const overall = rates.map(rate => (rate?.totalCount ? Number(rate.averageRate) || null : null))

  return [
    { title: 'Getting there', rows: gettingThere },
    {
      title: 'Parents\' ratings',
      rows: [
        {
          label: 'Overall',
          cells: withBest(overall, overall.map((value, index) => (value ? { text: `${value.toFixed(1)} (${rates[index]?.totalCount} reviews)` } : { text: 'No reviews yet' })), true),
        },
        ...ratingRows,
      ],
    },
    {
      title: 'Basics',
      rows: [
        { label: 'Type', cells: list.map(school => (schoolTypeLabel(school.schoolType) ? { text: schoolTypeLabel(school.schoolType) } : missing())) },
        { label: 'Curriculum', cells: list.map(school => (school.boards?.length ? { text: school.boards.map(board => board.title).filter(Boolean).join(', ') } : missing())) },
        { label: 'Tuition per year', cells: list.map(school => (school.tuition ? { text: school.tuition.toLocaleString('en-US') } : missing())) },
        { label: 'Location', cells: list.map(school => ({ text: [school.cityTitle, school.stateTitle, school.countryTitle].filter(Boolean).join(', ') || '–' })) },
      ],
    },
    {
      title: 'Facilities',
      rows: allTags.filter(name => name !== SCHOOL_BUS_TAG_NAME).map(name => ({
        label: name,
        cells: tagNames.map(names => ({ text: names.includes(name) ? 'Yes' : '–' })),
      })),
    },
    {
      title: 'Contact',
      rows: [
        { label: 'Phone', cells: list.map(school => (school.phoneNumber ? { text: school.phoneNumber } : missing())) },
        { label: 'Email', cells: list.map(school => (school.email ? { text: school.email } : missing())) },
        { label: 'Website', cells: list.map(school => (school.webSite ? { text: school.webSite } : missing())) },
      ],
    },
  ]
})

const visibleGroups = computed(() => groups.value
  .map(group => ({
    ...group,
    rows: onlyDifferences.value
      ? group.rows.filter(row => new Set(row.cells.map(cell => (cell.missing ? '' : cell.text))).size > 1)
      : group.rows,
  }))
  .filter(group => group.rows.length))

useHead({
  title: computed(() => (schools.value.length ? `Compare ${schools.value.map(school => school.name).join(' vs ')}` : 'Compare schools')),
  meta: [{ name: 'robots', content: 'noindex, follow' }],
})
</script>

<style scoped>
.compare-page {
  max-width: 1280px;
}

.compare-table :deep(table) {
  min-width: 640px;
}

.compare-table__label {
  width: 200px;
  color: rgb(var(--v-theme-grey600));
  font-weight: 500;
  text-align: left;
}

.compare-table__school {
  vertical-align: top;
  padding-top: 12px !important;
  padding-bottom: 12px !important;
  min-width: 200px;
}

.compare-table__name {
  text-decoration: none;
  line-height: 1.3;
}

.compare-table__group th {
  background: rgb(var(--v-theme-grey50));
  font-weight: 700;
  color: rgb(var(--v-theme-grey800));
  text-align: left;
}

.compare-table__best {
  background: rgba(var(--v-theme-success), 0.1);
  font-weight: 600;
}
</style>
