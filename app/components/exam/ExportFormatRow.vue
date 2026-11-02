<template>
  <!-- One exam export format (PDF/Word/PowerPoint) on the shared download row, with the export's own
       preparing/retry states. Used by the exam details action card and the exam result header. -->
  <common-download-file-row
    :badge="format.badge"
    :color="format.color"
    :label="format.label"
    :points="price?.points"
    :owned="price?.purchased"
    :summary="format.summary"
    :status="status"
    :busy="isBusy"
    :indeterminate="phase === 'cooking'"
    :progress="progress"
    :countdown="phase === 'waiting' && retry ? retry : null"
    :failed="phase === 'failed'"
  />
</template>

<script setup lang="ts">
import type { ExamExportPriceDTO } from '@/types'
import type { ExamExportFormat } from '@/utils/examExportFormats'
import { EXAM_EXPORT_AUTO_RETRY_DELAYS } from '@/composables/useExamExportDownload'
import type { ExamExportPhase, ExamExportRetry } from '@/composables/useExamExportDownload'

const props = defineProps<{
  format: ExamExportFormat
  price?: ExamExportPriceDTO
  phase?: ExamExportPhase
  progress: number
  retry?: ExamExportRetry
}>()

const maxRetries = EXAM_EXPORT_AUTO_RETRY_DELAYS.length

const isBusy = computed(() => props.phase === 'cooking' || props.phase === 'downloading')

const status = computed(() => {
  switch (props.phase) {
    case 'cooking': return {
      text: props.retry ? `Retry ${props.retry.attempt} of ${maxRetries} · preparing file...` : 'Preparing file...',
      color: 'text-grey600',
    }
    case 'downloading': return { text: `Downloading ${props.progress}%`, color: 'text-grey600' }
    case 'waiting': return {
      text: `Failed · retrying in ${props.retry?.secondsLeft ?? 0}s (${props.retry?.attempt ?? 1}/${maxRetries})`,
      color: 'text-lightError',
    }
    case 'failed': return { text: 'Download failed · tap to retry', color: 'text-lightError' }
    default: return null
  }
})
</script>
