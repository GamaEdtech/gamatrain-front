import type { PaperFileDTO, PaperFileRole } from '@/types'

type LabelledFile = Pick<PaperFileDTO, 'role'> & { ext?: string | null, type_title?: string | null }

const isWord = (ext?: string | null) => ['doc', 'docx', 'word'].includes(String(ext ?? '').toLowerCase())

/** What a past paper file is called, by its role (and an extra file's type). */
export const paperFileLabel = (file: LabelledFile, isPaper = true): string => {
  switch (file.role) {
    case 'question':
      return isPaper ? 'Question paper' : 'PDF'
    case 'word':
      return isPaper ? 'Question paper (Word)' : 'Word'
    case 'answer':
      return isWord(file.ext) ? 'Answer key (Word)' : 'Mark scheme'
    default:
      return file.type_title || 'Extra file'
  }
}

/** The paper's file of a role (question, word or answer have one at most). */
export const paperFileOf = (files: PaperFileDTO[] | undefined, role: PaperFileRole) =>
  files?.find(file => file.role === role)

/** The file types a role takes: the question paper is a PDF, its copy a Word file, the answer either. */
export const paperFileAccepts: Record<PaperFileRole, string> = {
  question: '.pdf',
  word: '.doc,.docx',
  answer: '.pdf,.doc,.docx',
  extra: '.mp4,.avi,.m4a,.mpg,.flv,.doc,.docx,.ppt,.pptx,.pdf,.mp3,.wav,.wave,.acc,.zip,.rar',
}
