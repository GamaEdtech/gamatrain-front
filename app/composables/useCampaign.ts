import type { ApiResult, CampaignDTO, CampaignTheme } from '@/types'
import { CAMPAIGN_THEMES, campaignThemeName } from '@/constants'

// The longest setTimeout browsers keep (~24.8 days); a page is never open that long.
const MAX_TIMEOUT = 2_147_483_647

let timers: ReturnType<typeof setTimeout>[] = []

/**
 * The sale campaign the site shows (gamatrain-back GET campaigns/current, docs/business/campaigns.md). Fetched once per
 * visit in the browser only: the home page is edge-cached for hours, so a campaign must never be rendered into the
 * server's HTML. Timers switch it on at startsAt and off at endsAt, so an open page changes on time without a reload.
 * The discount itself is decided by the backend at checkout; this only decides what is shown.
 */
export const useCampaign = () => {
  const campaign = useState<CampaignDTO | null>('campaign', () => null)
  const requested = useState('campaign-requested', () => false)
  const now = useState('campaign-now', () => 0)

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

  const load = async () => {
    if (import.meta.server || requested.value) return
    requested.value = true
    now.value = Date.now()
    try {
      const response = await useApiService.get<ApiResult<CampaignDTO | null>>('/api/v2/campaigns/current')
      campaign.value = response.succeeded ? response.data ?? null : null
      schedule()
    }
    catch {
      // No campaign is the safe answer: the site looks as it always does.
      campaign.value = null
    }
  }

  const isLive = computed(() => {
    if (!campaign.value || now.value === 0) return false
    return Date.parse(campaign.value.startsAt) <= now.value && now.value < Date.parse(campaign.value.endsAt)
  })

  const theme = computed<CampaignTheme>(() => campaignThemeName(campaign.value?.theme))
  const style = computed(() => CAMPAIGN_THEMES[theme.value])

  /** Fills `{percent}` and `{title}` in a theme's text. */
  const fill = (text: string) => text
    .replaceAll('{percent}', String(campaign.value?.discountPercent ?? ''))
    .replaceAll('{title}', campaign.value?.title ?? '')

  return { campaign, isLive, theme, style, fill, load }
}

/** Days, hours, minutes and seconds left until `endsAt`, ticking every second while mounted. */
export const useCampaignCountdown = (endsAt: MaybeRefOrGetter<string | null | undefined>) => {
  const now = ref(Date.now())
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
