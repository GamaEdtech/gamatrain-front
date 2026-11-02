import type { FileInfo, FilesDTO, TypeFileExtentionMultimedia } from '@/types'

/** What one shared download row (`common/download/FileRow`) shows for a file. */
export interface DownloadFileRowData {
  key: string
  /** The file type the download call asks for. */
  type: string
  extraId?: string
  /** The extension on the file icon. */
  badge: string
  /** A Vuetify theme color for the file icon. */
  color: string
  label: string
  points: number
  summary: string
}

const summaryOf = (...parts: (string | number | false | null | undefined)[]) =>
  parts.filter(part => part !== undefined && part !== null && part !== false && part !== '' && part !== 0).join(' · ')

// gama-api names Word files `word`; the icon shows the real extension.
const badgeFor = (ext: FileInfo['ext']) => (ext === 'word' ? 'DOCX' : String(ext || 'file').toUpperCase())
const kindFor = (ext: FileInfo['ext']) => (ext === 'word' ? 'Word' : ext ? String(ext).toUpperCase() : '')

/** A past paper's files as download rows: question file(s), answer file, then the extra files. */
export const buildPaperFileRows = (
  files: FilesDTO | undefined,
  isPaper: boolean,
  qFilePages?: string | number | null,
): DownloadFileRowData[] => {
  const { pdf, word, answer, extra } = files ?? {}
  const pages = Number(qFilePages) ? `${qFilePages} pages` : ''
  const rows: DownloadFileRowData[] = []

  if (pdf?.exist) {
    rows.push({
      key: 'pdf',
      type: 'pdf',
      badge: 'PDF',
      color: 'lightError',
      label: isPaper ? 'Question paper' : 'PDF',
      points: pdf.price,
      summary: summaryOf('PDF', pdf.size, pages),
    })
  }
  if (word?.exist) {
    rows.push({
      key: 'word',
      type: 'word',
      badge: 'DOCX',
      color: 'blue500',
      label: isPaper ? 'Question paper (Word)' : 'Word',
      points: word.price,
      summary: summaryOf('Word', word.size, 'Editable'),
    })
  }
  if (answer?.exist) {
    rows.push({
      key: 'answer',
      type: 'answer',
      badge: badgeFor(answer.ext),
      color: 'teal500',
      label: answer.ext === 'word' ? 'Answer key (Word)' : 'Mark scheme',
      points: answer.price,
      summary: summaryOf(kindFor(answer.ext), answer.size),
    })
  }
  for (const file of extra ?? []) {
    rows.push({
      key: `extra-${file.id}`,
      type: 'extra',
      extraId: file.id,
      badge: badgeFor(file.ext),
      color: 'generalSearchQuiz',
      label: file.type_title || 'Extra file',
      points: file.price,
      summary: summaryOf(kindFor(file.ext), file.size),
    })
  }

  return rows
}

// The exam export rows' colors, so a PowerPoint looks the same everywhere.
const MULTIMEDIA_KINDS: Record<TypeFileExtentionMultimedia, { badge: string, color: string, label: string }> = {
  pdf: { badge: 'PDF', color: 'lightError', label: 'PDF' },
  docx: { badge: 'DOCX', color: 'blue500', label: 'Word' },
  pptx: { badge: 'PPTX', color: 'warning500', label: 'PowerPoint' },
  mp4: { badge: 'MP4', color: 'generalSearchQuiz', label: 'Video' },
}

/** A multimedia item's one file as a download row. */
export const buildMultimediaFileRow = (
  ext: TypeFileExtentionMultimedia,
  size?: string | number,
  pages?: number,
  price?: number,
): DownloadFileRowData => {
  const kind = MULTIMEDIA_KINDS[ext] ?? { badge: 'FILE', color: 'grey600', label: 'File' }
  return {
    key: ext,
    type: ext,
    ...kind,
    points: price ?? 0,
    summary: summaryOf(kind.label, size, pages ? `${pages} pages` : ''),
  }
}
