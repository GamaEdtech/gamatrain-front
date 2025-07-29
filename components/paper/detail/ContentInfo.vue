<template>
  <v-card
    flat
    class="content_main_info"
  >
    <v-row class="align-center">
      <v-col cols="3">
        <v-img
          :src="contentData?.avatar"
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
          {{ contentData?.first_name }} {{ contentData?.last_name }}
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
        Classification: {{ contentData?.test_type_title }}
      </v-col>
      <v-col
        cols="12"
        class="pb-0"
      >
        <i class="fa-solid fa-book-open-reader mr-1 icon" />
        Page count: {{ contentData?.q_file_pages }}
      </v-col>
      <v-col
        cols="12"
        class="pb-0"
      >
        <i class="fa-solid fa-eye mr-1 icon" />
        Viewed: {{ contentData?.views }}
      </v-col>
      <v-col
        cols="12"
        class="pb-0"
      >
        <i class="fa-solid fa-calendar-alt mr-1 icon" />
        Last update: {{ $dayjs(contentData?.up_date).fromNow() }}
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
        <slot name="share-dialog" />
      </v-col>
    </v-row>

    <div class="text-center mt-2">
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
        <div v-if="contentData?.files?.word.exist">
          <v-btn
            block
            color="primary"
            class="mb-2"
            :loading="qWordFileDownloadLoading"
            @click="startDownload('q_word')"
          >
            Download Question Doc
            {{
              contentData?.files?.word.price > 0
                ? "| $" + contentData?.files?.word.price
                : ""
            }}
          </v-btn>
        </div>
        <div v-if="contentData?.files.pdf.exist">
          <v-btn
            class="mb-2 text-white font-weight-bold"
            block
            color="#E60012"
            :loading="qPdfFileDownloadLoading"
            @click="startDownload('q_pdf')"
          >
            {{ contentData?.test_type_title }}
            {{
              contentData?.files?.pdf.price > 0
                ? "| $" + contentData?.files?.pdf.price
                : ""
            }}
          </v-btn>
        </div>
        <div v-if="contentData?.files.answer.exist">
          <v-btn
            v-show="contentData?.files.answer.ext == 'pdf'"
            class="mb-2 font-weight-bold"
            block
            color="teal accent-3"
            :loading="answerFileDownloadLoading"
            @click="startDownload('a_file')"
          >
            Mark Scheme
            {{
              contentData?.files?.answer.price > 0
                ? "| $" + contentData?.files?.answer.price
                : ""
            }}
          </v-btn>
          <v-btn
            v-show="contentData?.files.answer.ext == 'word'"
            block
            color="primary"
            class="mb-2"
            :loading="answerFileDownloadLoading"
            @click="startDownload('a_file')"
          >
            Download Answer Doc
            {{
              contentData?.files?.answer.price > 0
                ? "| $" + contentData?.files?.answer.price
                : ""
            }}
          </v-btn>
        </div>
        <div
          v-if="contentData?.files.extra && contentData.files.extra.length > 0"
        >
          <v-btn
            v-for="(extra, index) in contentData.files.extra"
            :key="index"
            block
            color="blue"
            class="mb-2 font-weight-bold"
            :loading="extraFileDownloadLoading"
            @click="startDownload('extra', extra.id)"
          >
            {{ extra.type_title ? extra.type_title : "Extra" }}
            {{ extra.price > 0 ? "| $" + extra.price : "" }}
          </v-btn>
        </div>
        <v-btn
          v-if="contentData?.exams && contentData?.exams[0]?.status != 7"
          :to="`/exam/${contentData?.exams[0].id}`"
          block
          color="#5600e8"
          class="mb-2 text-white font-weight-bold"
        >
          Begin Quiz
        </v-btn>
        <v-btn
          v-else
          :to="`/test-maker/create?board=${contentData?.section}&grade=${contentData?.base}&subject=${contentData?.lesson}&paperId=${contentData?.id}`"
          block
          outlined
          color="primary"
          class="mb-2 text-white font-weight-bold"
        >
          Create Quiz
        </v-btn>
      </v-col>
    </v-row>
    <common-crash-report ref="crash_report" />
  </v-card>
  <!-- Mobile order section -->
  <paper-detail-mobile-order
    :content-data="contentData"
    :is-logged-in="auth.isAuthenticated.value"
    :user-credit="user?.user.value && user?.user.value?.credit"
    :is-free="isFree"
    :q-word-file-download-loading="qWordFileDownloadLoading"
    :q-pdf-file-download-loading="qPdfFileDownloadLoading"
    :answer-file-download-loading="answerFileDownloadLoading"
    :extra-file-download-loading="extraFileDownloadLoading"
    @download="startDownload"
  />
  <!-- End mobile order section -->
</template>

<script setup>
const props = defineProps({
  contentData: {
    type: Object,
    required: true,
  },
})
const { $toast } = useNuxtApp()
const auth = useAuth()
const user = useUser()
const rating = ref(4.5)
const crash_report = ref(null)
const _emits = defineEmits(['crash-report'])

const qPdfFileDownloadLoading = ref(false)
const qWordFileDownloadLoading = ref(false)
const answerFileDownloadLoading = ref(false)
const extraFileDownloadLoading = ref(false)

const isFree = computed(() => {
  if (!props.contentData) return true
  if (
    props.contentData.files.answer.price > 0
    && props.contentData.files.pdf.price > 0
    && props.contentData.files.word.price > 0
  )
    return false
  else return true
})

const openCrashReport = () => {
  crash_report.value.dialog = true
  crash_report.value.form.type = 'test'
}
const startDownload = async (type, extraId) => {
  let apiUrl = ''
  if (type === 'q_word') {
    qWordFileDownloadLoading.value = true
    apiUrl = `/api/v1/tests/download/${props.contentData?.id}/word`
  }
  if (type === 'q_pdf') {
    qPdfFileDownloadLoading.value = true
    apiUrl = `/api/v1/tests/download/${props.contentData?.id}/pdf`
  }
  if (type === 'a_file') {
    answerFileDownloadLoading.value = true
    apiUrl = `/api/v1/tests/download/${props.contentData?.id}/answer`
  }
  if (type === 'extra') {
    extraFileDownloadLoading.value = true
    apiUrl = `/api/v1/tests/download/${props.contentData?.id}/extra/${extraId}`
  }
  try {
    const response = await useApiService.get(apiUrl)
    const FileSaver = await import('file-saver')
    await FileSaver.saveAs(response.data.url, response.data.name)
  }
  catch (err) {
    if (err.response?.status == 400) {
      if (
        err.response.data.status == 0
        && err.response.data.error == 'creditNotEnough'
      ) {
        $toast.info('No enough credit')
      }
    }
  }
  finally {
    qWordFileDownloadLoading.value = false
    qPdfFileDownloadLoading.value = false
    answerFileDownloadLoading.value = false
    extraFileDownloadLoading.value = false
  }
}
defineExpose({
  crash_report,
})
</script>

<style scoped>
.content_main_info {
  padding: 27px !important;
  background: #f5f5f5 !important;
  border-radius: 6px;
}

.content_main_info .creator_title {
  font-size: 18px;
}

p {
  font-size: 1.3rem !important;
}
</style>
