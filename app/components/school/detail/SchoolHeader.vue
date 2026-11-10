<template>
  <header class="d-flex flex-column ga-3">
    <nav aria-label="Breadcrumb">
      <v-breadcrumbs
        :items="crumbs"
        density="compact"
        class="pa-0 text-grey500 crumbs flex-wrap"
      >
        <template #divider>
          <v-icon
            size="16"
            aria-hidden="true"
          >
            mdi-chevron-right
          </v-icon>
        </template>
      </v-breadcrumbs>
    </nav>

    <school-detail-school-title :content="content" />

    <p
      v-if="locationLine"
      class="ma-0 text-grey600 school-header__location"
    >
      {{ locationLine }}
    </p>

    <div class="d-flex flex-wrap align-center ga-2 school-header__rating">
      <a
        v-if="reviewCount"
        href="#reviews"
        class="d-inline-flex align-center ga-1 text-grey800 text-decoration-none"
      >
        <v-icon
          size="18"
          color="primary"
          aria-hidden="true"
        >
          mdi-star
        </v-icon>
        <b>{{ averageRate.toFixed(1) }}</b>
        <span class="text-grey500">({{ reviewCount }} {{ reviewCount === 1 ? 'review' : 'reviews' }})</span>
      </a>
      <template v-else>
        <span class="text-grey500">No reviews yet</span>
        <v-btn
          variant="text"
          color="info"
          size="small"
          class="text-none gtext-t5 px-1"
          @click="emit('leave-comment')"
        >
          Write the first review
        </v-btn>
      </template>
    </div>

    <school-detail-school-chips :content-data="content" />

    <div
      class="school-header__actions mt-1"
      role="group"
      aria-label="Quick actions"
    >
      <v-btn
        v-for="action in actions"
        :key="action.key"
        :href="action.href"
        :target="action.external ? '_blank' : undefined"
        :rel="action.external ? 'noopener nofollow' : undefined"
        :prepend-icon="action.icon"
        color="grey800"
        class="text-none"
        variant="outlined"
        rounded="lg"
        height="64"
        stacked
        @click="action.onClick?.()"
      >
        {{ action.label }}
      </v-btn>
    </div>
  </header>
</template>

<script setup lang="ts">
import type { SchoolDetailDTO, SchoolRatingDTO } from '@/types'

interface QuickAction {
  key: string
  icon: string
  label: string
  href?: string
  external?: boolean
  onClick?: () => void
}

const props = defineProps<{
  content: SchoolDetailDTO
  ratingData?: SchoolRatingDTO | null
}>()

// Picks for the side-by-side comparison, shared with the school list.
const compare = useSchoolCompare()
const inCompare = computed(() => compare.has(props.content.id))
const emit = defineEmits<{
  'leave-comment': []
}>()
const nuxtApp = useNuxtApp()

const crumbs = computed(() => [
  { title: 'Schools', to: '/school' },
  ...([
    { scope: 'country', title: props.content.countryTitle },
    { scope: 'state', title: props.content.stateTitle },
    { scope: 'city', title: props.content.cityTitle },
  ] as const)
    .filter(crumb => crumb.title)
    .map(crumb => ({ title: crumb.title as string, to: buildSchoolListUrl(crumb.scope, props.content) })),
])

const locationLine = computed(() => {
  const place = [props.content.cityTitle, props.content.stateTitle, props.content.countryTitle]
    .filter(Boolean)
    .join(', ')
  return [props.content.schoolType?.name, place].filter(Boolean).join(' · ')
})

const averageRate = computed(() => Number(props.ratingData?.averageRate) || 0)
const reviewCount = computed(() => props.ratingData?.totalCount || 0)

const firstPhone = computed(() =>
  (props.content.phoneNumber || '').split('/').map(p => p.trim()).find(Boolean) || '')

const websiteUrl = computed(() => schoolWebsiteUrl(props.content.webSite))

const directionsUrl = computed(() => {
  const { latitude, longitude, address } = props.content
  if (latitude && longitude) return `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`
  if (address) {
    const query = [props.content.name, address, props.content.cityTitle, props.content.countryTitle].filter(Boolean).join(', ')
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`
  }
  return ''
})

const share = async () => {
  const url = window.location.href.split('#')[0] ?? window.location.href
  if (navigator.share) {
    try {
      await navigator.share({ title: props.content.name ?? undefined, url })
    }
    catch {
      // The visitor closed the share sheet.
    }
    return
  }
  try {
    await navigator.clipboard.writeText(url)
    nuxtApp.$toast?.success('Link copied')
  }
  catch {
    nuxtApp.$toast?.error('Couldn\'t copy the link. Copy it from the address bar instead.')
  }
}

// Only actions that work are shown. Missing details are asked for in the "Fill in the gaps" card further
// down: up here a dashed "Add phone" read as a broken button and sent first-time visitors to sign in.
const actions = computed<QuickAction[]>(() => [
  directionsUrl.value && { key: 'directions', icon: 'mdi-directions', label: 'Directions', href: directionsUrl.value, external: true },
  firstPhone.value && { key: 'call', icon: 'mdi-phone-outline', label: 'Call', href: `tel:${firstPhone.value}` },
  websiteUrl.value && { key: 'website', icon: 'mdi-web', label: 'Website', href: websiteUrl.value, external: true },
  {
    key: 'compare',
    icon: inCompare.value ? 'md:check' : 'md:compare_arrows',
    label: inCompare.value ? 'Comparing' : 'Compare',
    onClick: () => compare.toggle({ id: props.content.id, name: props.content.name ?? '', slug: props.content.slug }),
  },
  { key: 'share', icon: 'mdi-share-variant-outline', label: 'Share', onClick: share },
].filter((action): action is QuickAction => !!action))
</script>

<style scoped>
.crumbs {
  font-size: 14px;
}

.crumbs :deep(.v-breadcrumbs-item--link) {
  color: inherit;
}

.school-header__location {
  font-size: 15px;
}

.school-header__rating {
  font-size: 14px;
}

.school-header__actions {
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: minmax(0, 124px);
  gap: 8px;
}

.school-header__actions .v-btn {
  font-size: 13px;
  letter-spacing: normal;
  border-color: rgb(var(--v-theme-grey200));
}
</style>
