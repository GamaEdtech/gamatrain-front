import type {
  AdminDashboardOverviewDTO,
  AdminDashboardSummaryDTO,
  AdminReferralReportDTO,
  ApiResult,
  AttentionKey,
  DashboardRange,
} from '@/types'

const BASE_URL = '/api/v2/admin/dashboard'
const SUMMARY_REFRESH_MS = 2 * 60 * 1000

// Shared by the dashboard and the admin menu badges: one request, refreshed every 2 minutes while any admin page is open.
// The backend caches it for a minute, so this never costs more than a cheap cache read.
const summary = ref<AdminDashboardSummaryDTO | null>(null)
const loadingSummary = ref(false)
let summaryRequest: Promise<void> | null = null
let summaryTimer: ReturnType<typeof setInterval> | null = null
let summarySubscribers = 0

/** The admin dashboard (backend docs/business/admin-dashboard.md). */
export const useAdminDashboard = () => {
  const { handleApiResponseError, handleApiCatchError } = useApiErrorHandler()

  const overview = ref<AdminDashboardOverviewDTO | null>(null)
  const loadingOverview = ref(false)
  const referrals = ref<AdminReferralReportDTO | null>(null)
  const loadingReferrals = ref(false)

  const fetchSummary = async (showErrors = false) => {
    if (summaryRequest) return summaryRequest
    loadingSummary.value = !summary.value
    summaryRequest = (async () => {
      try {
        const response = await useApiService.get<ApiResult<AdminDashboardSummaryDTO>>(`${BASE_URL}/summary`)
        if (response.succeeded && response.data) summary.value = response.data
        else if (showErrors) handleApiResponseError(response)
      }
      catch (err: unknown) {
        if (showErrors) handleApiCatchError(err)
      }
      finally {
        loadingSummary.value = false
        summaryRequest = null
      }
    })()
    return summaryRequest
  }

  /** Starts the shared 2-minute refresh; call stopSummaryRefresh when the component unmounts. */
  const startSummaryRefresh = () => {
    summarySubscribers++
    void fetchSummary()
    if (!summaryTimer) summaryTimer = setInterval(() => void fetchSummary(), SUMMARY_REFRESH_MS)
  }

  const stopSummaryRefresh = () => {
    summarySubscribers = Math.max(0, summarySubscribers - 1)
    if (summarySubscribers === 0 && summaryTimer) {
      clearInterval(summaryTimer)
      summaryTimer = null
    }
  }

  const attentionCount = (key: AttentionKey) => summary.value?.items.find(t => t.key === key)?.count ?? 0

  const rangeQuery = (range: DashboardRange) => ({ StartDate: range.startDate, EndDate: range.endDate })

  const fetchOverview = async (range: DashboardRange) => {
    loadingOverview.value = true
    try {
      const response = await useApiService.get<ApiResult<AdminDashboardOverviewDTO>>(`${BASE_URL}/overview`, rangeQuery(range))
      if (response.succeeded && response.data) overview.value = response.data
      else handleApiResponseError(response)
    }
    catch (err: unknown) {
      handleApiCatchError(err)
    }
    finally {
      loadingOverview.value = false
    }
  }

  const fetchReferrals = async (range: DashboardRange) => {
    loadingReferrals.value = true
    try {
      const response = await useApiService.get<ApiResult<AdminReferralReportDTO>>(`${BASE_URL}/referrals`, rangeQuery(range))
      if (response.succeeded && response.data) referrals.value = response.data
      else handleApiResponseError(response)
    }
    catch (err: unknown) {
      handleApiCatchError(err)
    }
    finally {
      loadingReferrals.value = false
    }
  }

  return {
    summary,
    loadingSummary,
    fetchSummary,
    startSummaryRefresh,
    stopSummaryRefresh,
    attentionCount,
    overview,
    loadingOverview,
    fetchOverview,
    referrals,
    loadingReferrals,
    fetchReferrals,
  }
}
