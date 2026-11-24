import type { ApiResult, CampaignDTO, CampaignTheme } from '@/types'
import { CAMPAIGN_THEMES, campaignThemeName } from '@/constants'

// The longest setTimeout browsers keep (~24.8 days); a page is never open that long.
const MAX_TIMEOUT = 2_147_483_647

let timers: ReturnType<typeof setTimeout>[] = []

/** The campaign, null for none, or undefined when the request failed (then whatever is shown stays). */
const fetchCampaign = async (): Promise<CampaignDTO | null | undefined> => {
  try {
    // The same answer for every visitor: no token or cookie, so one cached copy (Cloudflare, 60 s) serves everyone.
    const response = await useApiService.get<ApiResult<CampaignDTO | null>>('/api/v2/campaigns/current', {}, { public: true, credentials: 'omit' })
    return response.succeeded ? response.data ?? null : undefined
  }
  catch {
    return undefined
  }
}

/**
 * The sale campaign the site shows (gamatrain-back GET campaigns/current, docs/business/campaigns.md).
 *
 * The home hero loads it during SSR (`loadForPage`), so the page arrives already themed: no swap after paint, no layout
 * shift. That HTML can be an hours-old copy from the edge cache, so it carries the campaign's dates and the browser
 * decides what shows: `now` starts as the render time (the same on server and client, so hydration matches), then the
 * browser sets the real time, re-checks the campaign once (`refresh`) and sets timers that switch the theme on at
 * startsAt and off at endsAt without a reload. An upcoming campaign (starting within a week) is in the cached HTML too,
 * so it switches on by itself. The discount itself is decided by the backend at checkout; this only decides what shows.
 */
export const useCampaign = () => {
  const campaign = useState<CampaignDTO | null>('campaign', () => null)
  const refreshed = useState('campaign-refreshed', () => false)
  const now = useState('campaign-now', () => Date.now())

  const schedule = () => {
    timers.forEach(clearTimeout)
    timers = []
    if (!campaign.value) return
    for (const at of [Date.parse(campaign.value.startsAt), Date.parse(campaign.value.endsAt)]) {
      const delay = at - Date.now()
      if (delay > 0 && delay < MAX_TIMEOUT) {
        timers.push(setTimeout(() => {
          now.value = Date.now()
        }, delay + 50))
      }
    }
  }

  /** For the home hero: loads during SSR (and on client navigation), into the shared state. */
  // The fetch writes the shared state itself: watchers don't run during SSR, so copying the result over afterwards would
  // leave the server's HTML without the campaign. The state goes to the browser in the payload with the page.
  const loadForPage = () => useAsyncData('campaign-current', async () => {
    const value = await fetchCampaign()
    if (value !== undefined) campaign.value = value
    return value ?? null
  })

  /** In the browser: the real time, one re-check of the campaign (the page may be a cached copy), and the timers. */
  const refresh = async () => {
    if (import.meta.server) return
    now.value = Date.now()
    schedule()
    if (refreshed.value) return
    refreshed.value = true
    const fresh = await fetchCampaign()
    if (fresh !== undefined) campaign.value = fresh
    now.value = Date.now()
    schedule()
  }

  const isLive = computed(() => {
    if (!campaign.value) return false
    return Date.parse(campaign.value.startsAt) <= now.value && now.value < Date.parse(campaign.value.endsAt)
  })

  const theme = computed<CampaignTheme>(() => campaignThemeName(campaign.value?.theme))
  const style = computed(() => CAMPAIGN_THEMES[theme.value])

  /** Fills `{percent}` and `{title}` in a theme's text. */
  const fill = (text: string) => text
    .replaceAll('{percent}', String(campaign.value?.discountPercent ?? ''))
    .replaceAll('{title}', campaign.value?.title ?? '')

  return { campaign, isLive, theme, style, fill, loadForPage, refresh }
}

/** Days, hours, minutes and seconds left until `endsAt`, ticking every second while mounted. */
export const useCampaignCountdown = (endsAt: MaybeRefOrGetter<string | null | undefined>) => {
  // Starts from the page's render time (the server's, sent in the payload) so the HTML and the first browser render
  // agree, then ticks from the browser's clock once mounted.
  const now = ref(useState('campaign-now', () => Date.now()).value)
  let timer: ReturnType<typeof setInterval> | undefined

  onMounted(() => {
    now.value = Date.now()
    timer = setInterval(() => {
      now.value = Date.now()
    }, 1000)
  })
  onBeforeUnmount(() => clearInterval(timer))

  return computed(() => {
    const end = Date.parse(toValue(endsAt) ?? '')
    let left = Number.isNaN(end) ? 0 : Math.max(0, Math.floor((end - now.value) / 1000))
    const days = Math.floor(left / 86400)
    left -= days * 86400
    const hours = Math.floor(left / 3600)
    left -= hours * 3600
    const minutes = Math.floor(left / 60)
    const seconds = left - minutes * 60
    const pad = (n: number) => String(n).padStart(2, '0')
    return {
      units: [
        { value: pad(days), label: 'days' },
        { value: pad(hours), label: 'hours' },
        { value: pad(minutes), label: 'min' },
        { value: pad(seconds), label: 'sec' },
      ],
      short: `${days}d ${pad(hours)}:${pad(minutes)}:${pad(seconds)}`,
    }
  })
}
