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
        <span class="font-weight-medium text-grey-darken-2">{{
          item.variant && item.variant != "0"
            ? item.test_type_title + item.variant
            : item.test_type_title
        }}</span>
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
            class="ma-1 chip-pill"
            color="#F04438"
            :disabled="!item.q_file"
            @click="startDownload('q_pdf', item)"
          >
            qp
          </v-chip>
          <v-chip
            small
            class="ma-1 chip-pill"
            color="#12B76A"
            :disabled="!item.a_file"
            @click="startDownload('a_file', item)"
          >
            ms
          </v-chip>

          <v-chip
            small
            class="ma-1 chip-pill"
            color="#F79009"
            :disabled="!item.sf_file"
            @click="startDownload('sf_file', item)"
          >
            sf
          </v-chip>

          <v-chip
            small
            class="ma-1 chip-pill"
            color="#8F4949"
            :disabled="!item.in_file"
            @click="startDownload('in_file', item)"
          >
            in
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
              :disabled="!item.exam_id"
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

      <!-- ExamHub Chip -->
      <template v-if="item.exam_id">
        <v-chip
          v-for="(exam, index) in safeParseArray(item.exam_id)"
          :key="index"
          class="exam-hub-chip"
          color="#7F56D9"
          link
          x-small
          :to="`/exam/${exam}`"
          :disabled="!item.exam_id"
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
                <span class="paper-info-part">{{
                  item.variant && item.variant != "0"
                    ? item.test_type_title + item.variant
                    : item.test_type_title
                }}</span>
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
                  class="chip-pill"
                  color="#F04438"
                  :disabled="!item.q_file"
                  @click="startDownload('q_pdf', item)"
                >
                  qp
                </v-chip>
                <!-- MS Chip -->
                <v-chip
                  x-small
                  class="chip-pill"
                  color="#12B76A"
                  :disabled="!item.a_file"
                  @click="startDownload('a_file', item)"
                >
                  ms
                </v-chip>
                <!-- SF Chip -->
                <v-chip
                  x-small
                  class="chip-pill"
                  color="#F79009"
                  :disabled="!item.sf_file"
                  @click="startDownload('sf_file', item)"
                >
                  sf
                </v-chip>

                <!-- IN Chip -->
                <v-chip
                  x-small
                  class="chip-pill"
                  color="#8F4949"
                  :disabled="!item.in_file"
                  @click="startDownload('in_file', item)"
                >
                  in
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
                    :disabled="!item.exam_id"
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
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

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

const startDownload = async (type, item) => {
  let apiUrl = ''
  if (type === 'q_word') apiUrl = `/api/v1/tests/download/${item.id}/word`
  if (type === 'q_pdf') apiUrl = `/api/v1/tests/download/${item.id}/pdf`
  if (type === 'a_file') apiUrl = `/api/v1/tests/download/${item.id}/answer`
  if (type === 'sf_file')
    apiUrl = `/api/v1/tests/download/${item.id}/extra/${item.sf_file_id}`
  if (type === 'in_file')
    apiUrl = `/api/v1/tests/download/${item.id}/extra/${item.in_file_id}`

  try {
    const response = await $fetch(apiUrl)

    const { saveAs } = await import('file-saver')
    saveAs(response.data.url, response.data.name)
  }
  catch (err) {
    if (err.response?.status === 400) {
      if (
        err.response.data?.status === 0
        && err.response.data?.error === 'creditNotEnough'
      ) {
        // useToast().info("No enough credit");
      }
    }
    console.error(err)
  }
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
  padding: 12px 16px;
  width: 100%;
  box-sizing: border-box;
}

.paper-info {
  margin-bottom: 12px;
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
  gap: 8px;
}

.exam-hub-chip {
  padding: 0;
  min-width: 24px !important;
  min-height: 24px !important;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

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

@media screen and (max-width: 960px) {
  .v-chip--link {
    width: 30px !important;
    display: flex !important;
    margin: unset;
  }
}
</style>
