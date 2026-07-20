<template>
  <v-skeleton-loader
    v-if="isLoadingPapers"
    type="table"
  />
  <template v-else>
    <!-- Start Desktop View  -->
    <v-data-table
      v-if="!isMobile && !isTablet"
      :headers="desktopHeader"
      :items="data"
      class="elevation-0 custom-table"
      disable-pagination
      hide-default-footer
      items-per-page="-1"
      :item-class="rowClass"
    >
      <template #[`header.title`]="{ header }">
        {{ header.title }}
      </template>
      <!-- Column Classification -->
      <template #[`item.name`]="{ item }">
        <NuxtLink
          :to="`/paper/${item.id}/${item.title_url}`"
          class="font-weight-medium text-grey-darken-2"
        >{{
          item.variant && item.variant != "0"
            ? item.test_type_title
              + (item.variant_title == "nv" ? "" : item.variant_title)
            : item.test_type_title
        }}</NuxtLink>
      </template>

      <!-- Column Year -->
      <template #[`item.year`]="{ item }">
        <span class="font-weight-medium text-grey-darken-2">{{
          item.edu_year
        }}</span>
      </template>

      <!-- Column Month -->
      <template #[`item.term`]="{ item }">
        <span class="font-weight-medium text-grey-darken-2">{{
          getMonthName(item.edu_month)
        }}</span>
      </template>

      <!-- Column Download Files -->
      <template #[`item.downloadFilesContains`]="{ item }">
        <div class="d-flex flex-wrap justify-center">
          <v-chip
            small
            class="ma-1 chip-pill position-relative"
            color="#F04438"
            :disabled="!item.q_file"
            @click="handleDownload('pdf', item)"
          >
            <template v-if="isDownloading(item, 'pdf')">
              <v-progress-circular
                :model-value="getDownloadProgress(item, 'pdf')"
                size="20"
                width="2"
                color="white"
                class="position-absolute"
              />
            </template>
            <span :class="{ 'text-transparent': isDownloading(item, 'pdf') }">qp</span>
          </v-chip>
          <v-chip
            small
            class="ma-1 chip-pill position-relative"
            color="#12B76A"
            :disabled="!item.a_file"
            @click="handleDownload('answer', item)"
          >
            <template v-if="isDownloading(item, 'answer')">
              <v-progress-circular
                :model-value="getDownloadProgress(item, 'answer')"
                size="20"
                width="2"
                color="white"
                class="position-absolute"
              />
            </template>
            <span :class="{ 'text-transparent': isDownloading(item, 'answer') }">ms</span>
          </v-chip>

          <v-chip
            small
            class="ma-1 chip-pill position-relative"
            color="#F79009"
            :disabled="!item.sf_file"
            @click="handleDownload('sf_file', item)"
          >
            <template v-if="isDownloading(item, 'sf_file')">
              <v-progress-circular
                :model-value="getDownloadProgress(item, 'sf_file')"
                size="20"
                width="2"
                color="white"
                class="position-absolute"
              />
            </template>
            <span
              :class="{ 'text-transparent': isDownloading(item, 'sf_file') }"
            >sf</span>
          </v-chip>

          <v-chip
            small
            class="ma-1 chip-pill position-relative"
            color="#8F4949"
            :disabled="!item.in_file"
            @click="handleDownload('in_file', item)"
          >
            <template v-if="isDownloading(item, 'in_file')">
              <v-progress-circular
                :model-value="getDownloadProgress(item, 'in_file')"
                size="20"
                width="2"
                color="white"
                class="position-absolute"
              />
            </template>
            <span
              :class="{ 'text-transparent': isDownloading(item, 'in_file') }"
            >in</span>
          </v-chip>
        </div>
      </template>

      <!-- Column ExamHub -->
      <template #[`item.examHubIcon`]="{ item }">
        <div class="d-flex justify-center">
          <template v-if="item.exam_id">
            <v-chip
              v-for="(exam, index) in safeParseArray(item.exam_id)"
              :key="index"
              class="d-flex align-center justify-center v-chip--link"
              color="#7F56D9"
              link
              :to="`/exam/${exam}`"
            >
              <v-icon
                size="x-large"
                color="#7F56D9"
              >
                mdi-clipboard-text-outline
              </v-icon>
            </v-chip>
          </template>
          <v-chip
            v-if="!item.exam_id"
            class="d-flex align-center justify-center v-chip--link"
            color="#7F56D9"
            :disabled="true"
          >
            <v-icon
              size="x-large"
              color="#7F56D9"
            >
              mdi-clipboard-text-outline
            </v-icon>
          </v-chip>
        </div>
      </template>
    </v-data-table>
    <!-- Start Desktop View  -->

    <!-- Start Tablet & Mobile Views -->
    <div
      v-else
      class="mobile-data-table-wrapper"
      :class="{ 'tablet-view': isTablet }"
    >
      <div class="mobile-headers">
        <div
          v-for="(header, index) in mobileHeaders"
          :key="index"
          class="mobile-header-item"
        >
          <div class="d-flex align-center">
            {{ header.title }}
            <v-icon small>
              mdi-menu-down
            </v-icon>
          </div>
        </div>
      </div>

      <div class="mobile-content">
        <v-data-table
          :items="data"
          class="elevation-0 mobile-table-cards"
          hide-default-header
          hide-default-footer
          disable-pagination
          items-per-page="-1"
        >
          <template #item="{ item, index }">
            <div class="mobile-card">
              <div class="paper-info">
                <NuxtLink
                  :to="`/paper/${item.id}/${item.title_url}`"
                  class="paper-info-part"
                >{{
                  item.variant && item.variant != "0"
                    ? item.test_type_title
                      + (item.variant_title == "nv" ? "" : item.variant_title)
                    : item.test_type_title
                }}</NuxtLink>
              </div>
              <div class="paper-info">
                <span class="paper-info-part">{{ item.edu_year }}</span>
              </div>
              <div class="paper-info">
                <span class="paper-info-part">{{
                  getMonthName(item.edu_month)
                }}</span>
              </div>
              <div class="paper-chips">
                <!-- QP Chip -->
                <v-chip
                  x-small
                  class="chip-pill position-relative"
                  color="#F04438"
                  :disabled="!item.q_file"
                  @click="handleDownload('pdf', item)"
                >
                  <template v-if="isDownloading(item, 'pdf')">
                    <v-progress-circular
                      :model-value="getDownloadProgress(item, 'pdf')"
                      size="16"
                      width="2"
                      color="white"
                      class="position-absolute"
                    />
                  </template>
                  <span
                    :class="{
                      'text-transparent': isDownloading(item, 'pdf'),
                    }"
                  >qp</span>
                </v-chip>
                <!-- MS Chip -->
                <v-chip
                  x-small
                  class="chip-pill position-relative"
                  color="#12B76A"
                  :disabled="!item.a_file"
                  @click="handleDownload('answer', item)"
                >
                  <template v-if="isDownloading(item, 'answer')">
                    <v-progress-circular
                      :model-value="getDownloadProgress(item, 'answer')"
                      size="16"
                      width="2"
                      color="white"
                      class="position-absolute"
                    />
                  </template>
                  <span
                    :class="{
                      'text-transparent': isDownloading(item, 'answer'),
                    }"
                  >ms</span>
                </v-chip>
                <!-- SF Chip -->
                <v-chip
                  x-small
                  class="chip-pill position-relative"
                  color="#F79009"
                  :disabled="!item.sf_file"
                  @click="handleDownload('sf_file', item)"
                >
                  <template v-if="isDownloading(item, 'sf_file')">
                    <v-progress-circular
                      :model-value="getDownloadProgress(item, 'sf_file')"
                      size="16"
                      width="2"
                      color="white"
                      class="position-absolute"
                    />
                  </template>
                  <span
                    :class="{
                      'text-transparent': isDownloading(item, 'sf_file'),
                    }"
                  >sf</span>
                </v-chip>

                <!-- IN Chip -->
                <v-chip
                  x-small
                  class="chip-pill position-relative"
                  color="#8F4949"
                  :disabled="!item.in_file"
                  @click="handleDownload('in_file', item)"
                >
                  <template v-if="isDownloading(item, 'in_file')">
                    <v-progress-circular
                      :model-value="getDownloadProgress(item, 'in_file')"
                      size="16"
                      width="2"
                      color="white"
                      class="position-absolute"
                    />
                  </template>
                  <span
                    :class="{
                      'text-transparent': isDownloading(item, 'in_file'),
                    }"
                  >in</span>
                </v-chip>

                <!-- ExamHub Chip -->
                <template v-if="item.exam_id">
                  <v-chip
                    v-for="(exam, examIndex) in safeParseArray(item.exam_id)"
                    :key="examIndex"
                    class="exam-hub-chip"
                    color="#7F56D9"
                    link
                    x-small
                    :to="`/exam/${exam}`"
                  >
                    <v-icon
                      size="large"
                      color="#7F56D9"
                    >
                      mdi-clipboard-text-outline
                    </v-icon>
                  </v-chip>
                </template>
                <v-chip
                  v-if="!item.exam_id"
                  class="exam-hub-chip"
                  color="#7F56D9"
                  x-small
                  :disabled="true"
                >
                  <v-icon
                    size="large"
                    color="#7F56D9"
                  >
                    mdi-clipboard-text-outline
                  </v-icon>
                </v-chip>
              </div>
              <div
                v-if="index < data.length - 1"
                class="separator"
              />
            </div>
          </template>
        </v-data-table>
      </div>
    </div>
    <!-- End Tablet & Mobile Views -->

    <div
      ref="lineDetectLoadMorePaperRef"
      class="line-infinite-loading"
    />
    <div
      v-if="isLoadingInfiniteScroll"
      class="w-100 d-flex flex-row align-start justify-space-around justify-lg-space-between"
    >
      <v-skeleton-loader
        v-if="!isMobile && !isTablet"
        class="w-100"
        type="table-tbody"
      />
      <div
        v-else
        class="w-100 d-flex flex-column align-start"
      >
        <v-skeleton-loader
          v-for="(item, index) in 3"
          :key="index"
          class="w-50 min-width-200"
          type="subtitle"
        />
        <div class="d-flex">
          <v-skeleton-loader
            v-for="(item, index) in 3"
            :key="index"
            type="avatar"
          />
        </div>
        <div class="separator" />
      </div>
    </div>
  </template>

  <!-- Coin Payment Modal -->
  <lazy-modals-coin-payment-modal
    v-if="showCoinPaymentModal"
    v-model:show-dialog="showCoinPaymentModal"
    :is-processing="isLoading || isProcessingPayment"
    :user-balance="balance"
    :amount-to-pay="PRICE_FILE"
    @close="handleCoinPaymentClose"
  />

  <!-- Coin Consumption Animation -->
  <lazy-common-coin-consumption-animation
    v-model:is-visible="showCoinAnimation"
    @animation-complete="handleAnimationComplete"
  />

  <lazy-test-counting-wallet-animation
    :is-start-animation="isStartWalletAnimation"
    :direction="-1"
    :delta-price="5"
    @complete-animation="completeWalletAnimation"
  />
  <lazy-common-modal-base
    v-model:show-dialog="downloadIssue"
    :max-width="600"
    title="Download"
  >
    <lazy-common-modal-download-file
      :link="downloadIssueLink"
      @close="downloadIssue = false"
    />
  </lazy-common-modal-base>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

const PRICE_FILE = 5
const props = defineProps({
  desktopHeader: {
    type: Array,
    required: true,
  },
  mobileHeaders: {
    type: Array,
    required: true,
  },
  isLoadingPapers: {
    type: Boolean,
    default: false,
  },
  isLoadingInfiniteScroll: {
    type: Boolean,
    default: false,
  },
  isAllDataLoaded: {
    type: Boolean,
    default: false,
  },
  data: {
    type: Array,
    required: true,
  },
})

const emit = defineEmits(['loadNextPageData'])

const nuxtApp = useNuxtApp()
const { downloadFile } = useDownload()

onMounted(() => {
  checkScreenSize()
  window.addEventListener('resize', checkScreenSize)
  window.addEventListener('scroll', detectNeedLoadMoreData)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', checkScreenSize)
  window.removeEventListener('scroll', detectNeedLoadMoreData)
})

const isMobile = ref(false)
const isTablet = ref(false)

const checkScreenSize = () => {
  const width = window.innerWidth
  isMobile.value = width < 768
  isTablet.value = width >= 768 && width < 960
}

const rowClass = (_item, index) => {
  return (index + 1) % 3 === 0 ? 'my-4' : ''
}

const safeParseArray = (stringList) => {
  try {
    const parsed = JSON.parse(stringList)
    return Array.isArray(parsed) ? parsed : []
  }
  catch {
    return []
  }
}

// Track download progress for each button
const downloadProgress = ref({})
const downloadingItems = ref(new Set())
const auth = useAuth()
const router = useRouter()
const { balance, isLoading } = useCoinBalance()
const showCoinPaymentModal = ref(false)
const showCoinAnimation = ref(false)
const isProcessingPayment = ref(false)
const isStartWalletAnimation = ref(false)
const downloadIssue = ref(false)
const downloadIssueLink = ref('')

const handleCoinPaymentClose = () => {
  showCoinPaymentModal.value = false
}

const handleAnimationComplete = async () => {
  // Close everything immediately when animation completes
  showCoinAnimation.value = false
  isStartWalletAnimation.value = true
}

const completeWalletAnimation = () => {
  downloadIssue.value = true
  isStartWalletAnimation.value = false
}

const handleDownload = async (type, item) => {
  const downloadKey = `${item.id}-${type}`

  downloadingItems.value.add(downloadKey)
  downloadProgress.value[downloadKey] = 0
  if (auth.isAuthenticated.value) {
    startDownload(type, item, downloadKey)
  }
  else {
    downloadingItems.value.delete(downloadKey)
    Reflect.deleteProperty(downloadProgress.value, downloadKey)
    router.push({})
    setTimeout(() => {
      router.push({ query: { auth_form: 'login', auth_noredirect: 'true' } })
    }, 100)
  }
}

const startDownload = async (type, item, downloadKey) => {
  let extraId = undefined
  if (type === 'sf_file')
    extraId = item.sf_file_id
  if (type === 'in_file')
    extraId = item.in_file_id

  try {
    // Simulate progressive loading for API call
    const progressInterval = setInterval(() => {
      if (downloadProgress.value[downloadKey] < 50) {
        downloadProgress.value[downloadKey] += Math.random() * 15
      }
    }, 100)

    const response = await downloadFile({
      contentType: 'PastPaper',
      fileType: type == 'in_file' || type == 'sf_file' ? 'extra' : type,
      id: Number(item.id),
      extraId: extraId ? Number(extraId) : undefined,
    })

    // Update progress to 60% after API response
    downloadProgress.value[downloadKey] = 60
    clearInterval(progressInterval)

    // Create a custom fetch with progress tracking
    if (response.succeeded && response.data) {
      if (response.data.url) {
        const xhr = new XMLHttpRequest()
        xhr.open('GET', response.data.url, true)
        xhr.responseType = 'blob'

        xhr.onprogress = (event) => {
          if (event.lengthComputable) {
            const percentComplete = 60 + (event.loaded / event.total) * 40
            downloadProgress.value[downloadKey] = Math.min(percentComplete, 100)
          }
        }

        xhr.onload = () => {
          if (xhr.status === 200) {
            downloadProgress.value[downloadKey] = 100

            const blob = xhr.response
            const url = window.URL.createObjectURL(blob)

            const a = document.createElement('a')
            a.href = url
            a.download = response.data?.name || 'file.pdf'
            document.body.appendChild(a)
            a.click()

            a.remove()
            window.URL.revokeObjectURL(url)
            downloadIssueLink.value = response.data?.url || ''
            if (response.data?.spent) {
              showCoinAnimation.value = true
            }
            else {
              downloadIssue.value = true
            }

            setTimeout(() => {
              downloadingItems.value.delete(downloadKey)
              Reflect.deleteProperty(downloadProgress.value, downloadKey)
            }, 1000)
          }
        }

        xhr.onerror = () => {
          downloadingItems.value.delete(downloadKey)
          Reflect.deleteProperty(downloadProgress.value, downloadKey)
          $toast.error('Download failed. Please try again.')
        }

        xhr.send()
      }
      if (response.data.upgradeSuggestions && response.data.upgradeSuggestions.length > 0) {
        showCoinPaymentModal.value = true
      }
    }
    else {
      if (response.errors && response.errors.length > 0) {
        const messgage = response.errors[0].message
        if (messgage == 'InsufficientBalance') {
          showCoinPaymentModal.value = true
        }
      }
      downloadingItems.value.delete(downloadKey)
      Reflect.deleteProperty(downloadProgress.value, downloadKey)
    }
  }
  catch (err) {
    console.error('Download failed:', err)
    downloadingItems.value.delete(downloadKey)
    Reflect.deleteProperty(downloadProgress.value, downloadKey)
    $toast.error('Download failed. Please try again.')
  }
}

const isDownloading = (item, type) => {
  const downloadKey = `${item.id}-${type}`
  return downloadingItems.value.has(downloadKey)
}

const getDownloadProgress = (item, type) => {
  const downloadKey = `${item.id}-${type}`
  return downloadProgress.value[downloadKey] || 0
}

const lineDetectLoadMorePaperRef = ref(null)

const detectNeedLoadMoreData = () => {
  const targetDiv = lineDetectLoadMorePaperRef.value
  if (targetDiv) {
    const rect = targetDiv.getBoundingClientRect()
    const isDivInView = rect.top >= 0 && rect.bottom <= window.innerHeight

    if (
      isDivInView
      && !props.isLoadingInfiniteScroll
      && !props.isLoadingPapers
      && !props.isAllDataLoaded
    ) {
      emit('loadNextPageData')
    }
  }
}

function getMonthName(monthNumber) {
  return nuxtApp
    .$dayjs()
    .month(Number(monthNumber) - 1)
    .format('MMMM')
}
</script>

<style scoped>
.custom-table th {
  background-color: var(--primary-grey-100, #f2f4f7);
  color: #344054;
  font-family: Inter;
  font-size: 1.3rem;
  font-style: normal;
  font-weight: 500;
  line-height: 2.6rem;
  border-bottom: unset;
}

.custom-table tr:hover {
  background-color: #f9f5ff9f;
  cursor: pointer;
  border: unset;
}

.v-chip--link {
  width: 30px !important;
  height: 30px !important;
  border-radius: 100%;
  cursor: pointer;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  margin: auto;
}

.chip-pill {
  width: 30px !important;
  height: 30px !important;
  border-radius: 16px;
  font-size: 12px !important;
  font-weight: 500;
  cursor: pointer;
  display: flex !important;
  align-items: center;
  justify-content: center;
}

/* Mobile and Tablet Styles */
.mobile-data-table-wrapper {
  display: flex;
  flex-direction: column;
  width: 100%;
  background-color: #fff;
  margin-block: 1rem;
}

/* Tablet-specific styles */
.tablet-view {
  font-size: 14px;
}

.tablet-view .mobile-headers {
  width: 100%;
}

.tablet-view .mobile-card {
  padding: 14px 18px;
}

.tablet-view .paper-info-part {
  font-size: 15px;
}

.tablet-view .chip-pill {
  min-width: 35px;
  height: 28px;
}

/* Mobile headers */
.mobile-headers {
  display: flex;
  gap: 2rem;
  padding: 12px 12px;
  background-color: #f2f4f7;
  width: calc(100%);
  border-bottom: 1px solid #eaecf0;
}

.mobile-header-item {
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  color: #344054;
  display: flex;
  align-items: center;
  font-family: Inter;
}

.mobile-content {
  display: flex;
  flex-direction: row;
  position: relative;
  width: 100%;
}

.mobile-table-cards {
  flex-grow: 1;
  background-color: white !important;
  width: calc(100% - 80px);
}

/* Styling the v-data-table for mobile card view */
.mobile-card {
  padding: 12px 12px;
  width: 100%;
  box-sizing: border-box;
}

.paper-info {
  margin-bottom: 12px;
  display: inline-block;
  margin-inline: 5px;
}

.paper-info-part {
  font-size: 14px;
  font-weight: 400;
  color: #344054;
  line-height: 1.5;
}

.paper-chips {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 8px;
}

.exam-hub-chip {
  padding: 0;
  min-width: 30px !important;
  min-height: 30px !important;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center !important;
}

.exam-hub-chip:last-child {
  flex-grow: 1;
  justify-content: end;
  max-width: min-content;
}

/* .v-chip .v-chip__underlay
{
  display: none !important;
  position: static;

} */

/* :deep(.exam-hub-chip:last-child > .chip__underlay)
{
  max-width: fit-content !important;
} */

.separator {
  height: 2px;
  background-color: #f1f1f1;
  margin-top: 12px;
  width: 100%;
}

.line-infinite-loading {
  width: 100%;
  height: 6px;
}
.min-width-200 {
  min-width: 300px;
}

.text-transparent {
  color: transparent !important;
}

.position-relative {
  position: relative;
}

.position-absolute {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

@media screen and (max-width: 960px) {
  .v-chip--link {
    width: 30px !important;
    display: flex !important;
    margin: unset;
  }
}
</style>
