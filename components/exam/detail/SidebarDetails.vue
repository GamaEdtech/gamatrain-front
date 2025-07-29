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
        <i class="fa-solid fa-folder mr-1 icon" />
        File type: {{ contentData.azmoon_type_title }}
      </v-col>
      <v-col
        cols="12"
        class="pb-0"
      >
        <i class="fa-solid fa-eye mr-1 icon" />
        Viewed: {{ contentData.views || "Unknown" }}
      </v-col>
      <v-col
        cols="12"
        class="pb-0"
      >
        <i class="fa-solid fa-calendar-alt mr-1 icon" />
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
          <i class="fa-solid fa-bug mr-1 icon" />
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
          @click="onLogin"
        >
          Start Exam{{ item.price > 0 ? " | $" + item.price : "" }}
        </v-btn>

        <!-- For authenticated user -->
        <v-btn
          v-show="isLoggedIn"
          v-if="key === 'participation'"
          :to="`/exam/start/${contentData.id}`"
          block
          color="success"
        >
          <span v-if="contentData.examUserData?.status === 1">
            Show result
          </span>
          <span v-else>
            Start Exam{{ item.price > 0 ? " | $" + item.price : "" }}
          </span>
        </v-btn>

        <v-btn
          v-else-if="key === 'word'"
          block
          color="primary"
        >
          Download WORD{{ item.price > 0 ? " | $" + item.price : "" }}
        </v-btn>

        <v-btn
          v-else-if="key === 'pdf'"
          :loading="downloadLoading"
          block
          color="error"
          @click="onDownload('pdf')"
        >
          Download PDF{{ item.price > 0 ? " | $" + item.price : "" }}
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
})

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
</style>
