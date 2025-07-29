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
        <i class="fa-solid fa-folder mr-1 icon" />
        File type: {{ contentTypeTitle }}
      </v-col>
      <v-col
        cols="12"
        class="pb-0"
      >
        <i class="fa-solid fa-book-open-reader mr-1 icon" />
        Page count: {{ filePages }}
      </v-col>
      <v-col
        cols="12"
        class="pb-0"
      >
        <i class="fa-solid fa-eye mr-1 icon" />
        Viewed: {{ views }}
      </v-col>
      <v-col
        cols="12"
        class="pb-0"
      >
        <i class="fa-solid fa-calendar-alt mr-1 icon" />
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
          <i class="fa-solid fa-bug mr-1 icon" />
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
            dark
            color="#bf360c"
            class="mb-2"
            :loading="downloadLoading"
            @click="startDownload"
          >
            Download {{ fileExt.toUpperCase()
            }}{{ showPrice ? " | $" + price : "" }}
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
})

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
  emit('download', props.fileExt)
}
</script>

<style scoped></style>
