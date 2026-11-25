import type { PaperFileDTO, PaperFileRole, TypeFileExtentionMultimedia } from '@/types'
import { paperFileLabel } from '~/utils/paperFiles'

/** What one shared download row (`common/download/FileRow`) shows for a file. */
export interface DownloadFileRowData {
  key: string
  /** The file type the download call asks for (multimedia), or `file` for a past paper file. */
  type: string
  /** A past paper file's id, which the download asks for. */
  fileId?: number
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

const isWord = (ext?: string | null) => ['doc', 'docx', 'word'].includes(String(ext ?? '').toLowerCase())
const badgeFor = (ext?: string | null) => (isWord(ext) ? 'DOCX' : String(ext || 'file').toUpperCase())
const kindFor = (ext?: string | null) => (isWord(ext) ? 'Word' : ext ? String(ext).toUpperCase() : '')

const ROLE_COLORS: Record<PaperFileRole, string> = {
  question: 'lightError',
  word: 'blue500',
  answer: 'teal500',
  extra: 'generalSearchQuiz',
}

/** A past paper's files as download rows, in the order the API lists them (question, Word, answer, extra files). */
export const buildPaperFileRows = (files: PaperFileDTO[] | undefined, isPaper: boolean): DownloadFileRowData[] =>
  (files ?? []).map(file => ({
    key: `file-${file.id}`,
    type: 'file',
    fileId: file.id,
    badge: file.role === 'word' ? 'DOCX' : badgeFor(file.ext),
    color: ROLE_COLORS[file.role],
    label: paperFileLabel(file, isPaper),
    points: file.price,
    summary: summaryOf(
      file.role === 'word' ? 'Word' : kindFor(file.ext),
      file.size,
      file.pages ? `${file.pages} pages` : '',
      file.role === 'word' ? 'Editable' : '',
    ),
  }))

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
