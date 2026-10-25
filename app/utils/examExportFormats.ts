import type { ExamExportFileType } from '@/types'

export interface ExamExportFormat {
  fileType: ExamExportFileType
  /** The format's name on buttons and in the comparison table. */
  label: string
  /** The extension shown on the file icon. */
  badge: string
  /** A Vuetify theme color. */
  color: string
  /** One line on what the file is good for, shown under the name. */
  summary: string
}

// The three files gamatrain-back's `exams/export` generates from a quiz. Colors are theme colors, not the
// Office brand ones, so the page stays on the project palette.
export const examExportFormats: ExamExportFormat[] = [
  { fileType: 'Pdf', label: 'PDF', badge: 'PDF', color: 'lightError', summary: 'Print-ready · answer key' },
  { fileType: 'Word', label: 'Word', badge: 'DOCX', color: 'blue500', summary: 'Editable · answer key' },
  { fileType: 'PowerPoint', label: 'PowerPoint', badge: 'PPTX', color: 'warning500', summary: 'Slides with answers' },
]
