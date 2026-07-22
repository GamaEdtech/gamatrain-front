<template>
  <v-card
    flat
    class="content_main_info"
  >
    <v-row class="align-center">
      <v-col cols="3">
        <v-img
          :src="avatar"
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
          {{ firstName }} {{ lastName }}
        </p>
      </v-col>
    </v-row>
    <v-divider class="my-2" />
    <v-row>
      <v-col
        cols="12"
        class="pb-0"
      >
        <v-icon class="mr-1 icon">
          md:folder
        </v-icon>
        File type: {{ contentTypeTitle }}
      </v-col>
      <v-col
        cols="12"
        class="pb-0"
      >
        <v-icon class="mr-1 icon">
          md:auto_stories
        </v-icon>
        Page count: {{ filePages }}
      </v-col>
      <v-col
        cols="12"
        class="pb-0"
      >
        <v-icon class="mr-1 icon">
          md:visibility
        </v-icon>
        Viewed: {{ views }}
      </v-col>
      <v-col
        cols="12"
        class="pb-0"
      >
        <v-icon class="mr-1 icon">
          md:calendar_month
        </v-icon>
        Last update: {{ formatDate(upDate) }}
      </v-col>
      <v-col
        cols="12"
        class="pb-0"
      >
        <div
          class="pointer"
          @click="openCrashReport"
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
        <share-dialog
          :title="title"
          @copy="handleCopyUrl"
          @share="handleShareSocial"
        />
      </v-col>
    </v-row>

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

    <v-row class="mt-1 d-none d-md-block">
      <v-col
        cols="12"
        class="pb-0"
      >
        <div>
          <v-btn
            block
            variant="flat"
            color="#E60012"
            class="mb-2 text-h5 text-white font-weight-bold position-relative"
            size="large"
            :loading="downloadLoading && !isDownloading"
            @click="startDownload"
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
              Download {{ fileExt.toUpperCase() }}{{ showPrice ? " | " + price + " GEM" : "" }}
            </span>
          </v-btn>
        </div>
      </v-col>
    </v-row>
  </v-card>
  <crash-report ref="crash_report" />
</template>

<script setup>
import { ref, computed } from 'vue'
import dayjs from 'dayjs'
import ShareDialog from './ShareDialog.vue'
import CrashReport from '~/components/common/crash-report.vue'

// Props
const props = defineProps({
  avatar: {
    type: String,
    default: '',
  },
  firstName: {
    type: String,
    default: '',
  },
  lastName: {
    type: String,
    default: '',
  },
  contentTypeTitle: {
    type: String,
    default: '',
  },
  filePages: {
    type: [Number, String],
    default: 0,
  },
  views: {
    type: [Number, String],
    default: 0,
  },
  upDate: {
    type: String,
    default: '',
  },
  fileExt: {
    type: String,
    default: 'pptx',
  },
  price: {
    type: Number,
    default: 0,
  },
  title: {
    type: String,
    default: '',
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

// Emits
const emit = defineEmits(['download', 'copy-url', 'share-social'])

// Reactive state
const rating = ref(4.5)
const _copyBtnText = ref('Copy')
const crash_report = ref(null)
const copy_btn = ref('Copy')

// Computed properties
const showPrice = computed(() => {
  return props.price > 0
})

// Methods
function formatDate(date) {
  return dayjs(date).fromNow()
}

function openCrashReport() {
  crash_report.value.dialog = true
  crash_report.value.form.type = 'file'
}

function handleCopyUrl() {
  navigator.clipboard.writeText(window.location.href)
  copy_btn.value = 'Copied'
}

function handleShareSocial(platform) {
  if (platform == 'whatsapp')
    window.open(`https://api.whatsapp.com/send?text=${window.location.href}`)
  else if (platform == 'telegram')
    window.open(
      `https://telegram.me/share/url?url=${window.location.href}&text=${props.title}`,
    )
}

function startDownload() {
  // trackFileDownload({
  //   file_type: props.fileExt,
  //   file_name: props.title,
  //   file_url: window.location.href,
  //   subject_name: props.contentTypeTitle,
  // })
  emit('download', props.fileExt)
}
</script>

<style scoped>
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
