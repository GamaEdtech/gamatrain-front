<template>
  <div class="w-100 container-slider-button rounded-lg d-flex align-center">
    <div
      class="button-div h-100 d-flex flex-column align-center justify-center ga-8 px-4"
    >
      <div
        v-if="views"
        class="d-flex flex-column align-center justify-center ga-1 primary-gray-700 cursor-pointer text-no-wrap"
      >
        <v-icon color="primary-gray-700">
          md:visibility
        </v-icon>
        {{ views }}
      </div>
      <div
        v-if="score"
        class="d-flex flex-column align-center justify-center ga-1 primary-gray-700 cursor-pointer text-no-wrap"
      >
        <v-icon color="primary-gray-700">
          md:star
        </v-icon>
        {{ score }}
      </div>
      <div
        v-if="hasSave"
        class="d-flex flex-column align-center justify-center ga-1 primary-gray-700 cursor-pointer text-no-wrap"
      >
        <v-icon color="primary-gray-700">
          md:bookmark_outlined
        </v-icon>
        Save
      </div>
      <div
        v-if="hasShare"
        class="d-flex flex-column align-center justify-center ga-1 primary-gray-700 cursor-pointer text-no-wrap"
      >
        <v-icon color="primary-gray-700">
          md:share
        </v-icon>
        Share
      </div>
    </div>

    <div
      class="w-100 h-100 d-flex justify-center align-center position-relative"
    >
      <img
        width="170"
        :src="thumbPic"
        class="w-100 h-100"
        preload
        fetchpriority="high"
        alt="Psat Paper Lesson"
        loading="eager"
      >

      <div
        class="preview-div cursor-pointer rounded-lg position-absolute d-flex align-center justify-center"
        @click="openWebPDF"
      >
        <v-icon color="white">
          md:crop_free
        </v-icon>
      </div>
    </div>

    <client-only>
      <LazyCommonPdfPreviewDialog
        v-model="previewDialog"
        :title="previewTitle"
        :pdf-url="previewPdfUrl"
        :file-name="previewFileName"
      />
    </client-only>
  </div>
</template>

<script setup lang="ts">
interface ApiResponse<T> {
  data: T
  succeeded: boolean
  status: number
  errors: {
    message: string
    code: string
    reference: string
    info: string
    value: string
  }[]
}
interface PDFResponseDTO {
  url?: string
  name?: string
}
interface IPreviewActionCard {
  thumbPic: string
  id: string
  title: string
  views?: number | string
  score?: string | number
  hasShare?: boolean
  hasSave?: boolean
}

const props = withDefaults(defineProps<IPreviewActionCard>(), {
  hasShare: true,
  hasSave: true,
})

const previewDialog = ref(false)
const previewPdfUrl = ref('')
const previewFileName = ref('')
const previewTitle = ref('')

const openWebPDF = async () => {
  if (!props.id) {
    console.warn('No paper ID provided for PDF preview')
    return
  }

  try {
    const response = await useApiService.get<ApiResponse<PDFResponseDTO>>(
      `/api/v1/tests/download/${props.id}/pdf`,
    )

    if (response.status === 1 && response.data?.url) {
      previewPdfUrl.value = response.data.url
      previewFileName.value = response.data.name || 'document.pdf'
      previewTitle.value = props.title || 'PDF Preview'
      previewDialog.value = true
    }
    else {
      console.error('Unable to load PDF preview')
    }
  }
  catch (err) {
    console.error('Error loading PDF preview:', err)
  }
}
</script>

<style scoped>
.container-slider-button {
  background-color: #fcfcfd;
  border: 1px solid #f2f4f7;
  max-width: 360px;
  min-height: 100%;
  /* min-height: 400px; */
  /* max-height: 400px; */
}
.button-div {
  min-width: 60px;
  border: 1px solid #f2f4f7;
}
.preview-div {
  width: 32px;
  height: 32px;
  background-color: #344054cc;
  right: 20px;
  bottom: 20px;
}

.preview-div:hover {
  opacity: 0.5;
}
</style>
