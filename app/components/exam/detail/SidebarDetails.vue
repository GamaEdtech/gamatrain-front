<template>
  <v-card
    flat
    class="content_main_info"
  >
    <!-- Author info -->
    <v-row class="align-center">
      <v-col cols="3">
        <v-img
          :src="contentData.avatar"
          alt=""
          class="d-inline-block"
          cover
          height="48"
          width="48"
        />
      </v-col>
      <v-col
        cols="9"
        class="pl-0"
      >
        <p class="creator_title">
          {{ contentData.first_name }} {{ contentData.last_name }}
        </p>
      </v-col>
    </v-row>

    <v-divider class="my-2" />

    <!-- Exam metadata -->
    <v-row>
      <v-col
        cols="12"
        class="pb-0"
      >
        <v-icon class="mr-1 icon">
          md:folder
        </v-icon>
        File type: {{ contentData.azmoon_type_title }}
      </v-col>
      <v-col
        cols="12"
        class="pb-0"
      >
        <v-icon class="mr-1 icon">
          md:visibility
        </v-icon>
        Viewed: {{ contentData.views || "Unknown" }}
      </v-col>
      <v-col
        cols="12"
        class="pb-0"
      >
        <v-icon class="mr-1 icon">
          md:calendar_month
        </v-icon>
        Last update: {{ lastUpdate }}
      </v-col>
      <v-col
        cols="12"
        class="pb-0"
      >
        <div
          class="pointer"
          @click="onCrashReport"
        >
          <v-icon class="mr-1 icon">
            md:bug_report
          </v-icon>
          Crash report
        </div>
      </v-col>
      <v-col
        cols="12"
        class="pb-0"
      >
        <!-- Dialog for share -->
        <exam-detail-share-dialog
          :title="contentData.title"
          @copy-url="onCopyUrl"
          @share="onShare"
        />
      </v-col>
    </v-row>

    <!-- Rating -->
    <div class="text-center mt-4">
      <v-rating
        v-model="rating"
        hover
        background-color="grey-darken-1"
        color="yellow-darken-3"
        size="35"
        half-increments
      />
    </div>

    <v-divider class="d-none d-md-block" />

    <!-- Action buttons -->
    <v-row class="mt-1 d-none d-md-block">
      <v-col
        v-for="(item, key) in contentData.price"
        :key="key"
        cols="12"
        class="pb-0"
      >
        <!-- For not authenticated user -->
        <v-btn
          v-show="!isLoggedIn"
          v-if="key === 'participation'"
          block
          color="success"
          class="text-h5"
          @click="onLogin"
        >
          Start Exam{{ item.price > 0 ? " | " + item.price + " GEM" : "" }}
        </v-btn>

        <!-- For authenticated user -->
        <v-btn
          v-show="isLoggedIn"
          v-if="key === 'participation'"
          :to="`/exam/start/${contentData.id}`"
          block
          color="success"
          class="text-h5"
        >
          <span v-if="contentData.examUserData?.status === 1">
            Show result
          </span>
          <span v-else>
            Start Exam{{ item.price > 0 ? " | " + item.price + " GEM" : "" }}
          </span>
        </v-btn>

        <v-btn
          v-else-if="key === 'word'"
          block
          color="primary"
          class="text-h5"
        >
          Download WORD{{ item.price > 0 ? " | " + item.price + " GEM" : "" }}
        </v-btn>

        <v-btn
          v-else-if="key === 'pdf'"
          :loading="downloadLoading && !isDowsnloading"
          block
          color="#E60012"
          variant="flat"
          size="large"
          class="mb-2 text-h5 text-white font-weight-bold position-relative"
          @click="onDownload('pdf')"
        >
          <template v-if="isDownloading">
            <v-progress-circular
              :model-value="downloadProgress"
              size="24"
              width="3"
              color="white"
              class="position-absolute"
              style="z-index: 2;"
            />
          </template>
          <!-- <v-icon
            size="x-large"
            class="btn-icon"
            :class="{ 'text-transparent': isDownloading }"
          >
            mdi-file-pdf-box
          </v-icon> -->
          <span :class="{ 'text-transparent': isDownloading }">
            Download PDF{{ item.price > 0 ? " | " + item.price + " GEM" : "" }}
          </span>
        </v-btn>
      </v-col>
    </v-row>
  </v-card>
</template>

<script setup>
import { ref, computed } from 'vue'
import ExamDetailShareDialog from './ShareDialog.vue'

const props = defineProps({
  contentData: {
    type: Object,
    required: true,
  },
  isLoggedIn: {
    type: Boolean,
    default: false,
  },
  credit: {
    type: [Number, String],
    default: 0,
  },
  downloadLoading: {
    type: Boolean,
    default: false,
  },
  isDownloading: {
    type: Boolean,
    default: false,
  },
  downloadProgress: {
    type: Number,
    default: 0,
  },
})

// const { trackFileDownload } = useGtmEvents()

// Add a shortcut computed property for better readability in the code
const contentData = computed(() => props.contentData)

const emit = defineEmits([
  'download',
  'login',
  'copy-url',
  'share',
  'crash-report',
])

// Reactive data
const rating = ref(4.5)

// Computed properties
const lastUpdate = computed(() => {
  // You can use a time-ago filter here if available
  return contentData.value.up_date || 'Unknown'
})

// Methods
function onDownload(type) {
  // trackFileDownload({
  //   file_type: 'exam',
  //   file_name: contentData.value.title,
  //   file_url: contentData.value.title_url,
  // })
  emit('download', type)
}

function onLogin() {
  emit('login')
}

function onCopyUrl() {
  emit('copy-url')
}

function onShare(platform) {
  const pageTitle = contentData.value?.title || ''

  if (platform === 'whatsapp')
    window.open(`https://api.whatsapp.com/send?text=${window.location.href}`)
  else if (platform === 'telegram')
    window.open(
      `https://telegram.me/share/url?url=${window.location.href}&text=${pageTitle}`,
    )
}

function onCrashReport() {
  emit('crash-report')
}
</script>

<style scoped>
.content_main_info {
  padding: 27px;
  background: #f5f5f5 !important;
  border-radius: 6px;
}

.content_main_info .creator_title {
  font-size: 18px;
}

.pointer {
  cursor: pointer;
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

.btn-icon {
  position: absolute;
  left: 10px;
}
</style>
