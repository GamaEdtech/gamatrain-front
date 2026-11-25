import type { Ref } from 'vue'
import type { PaperDetectionDTO, PastPaperCreateDTO } from '@/types'

type DetectableForm = Pick<PastPaperCreateDTO, 'board' | 'grade' | 'subject' | 'classification' | 'edu_year' | 'edu_month' | 'title'>
  & { variant?: string | number }

/** A form field the detection can fill. */
export type DetectedField = 'board' | 'grade' | 'subject' | 'classification' | 'variant' | 'edu_year' | 'edu_month' | 'title'

interface Loaders {
  getGrades: (boardId: number | string) => Promise<unknown>
  getClassification: (boardId: number | string) => Promise<unknown>
  getSubjects: (gradeId: number | string) => Promise<unknown>
  getTopics: (subjectId: number | string) => Promise<unknown>
}

/**
 * Fills a paper form from what its question paper's cover says (`PaperDetectionDTO`): the board, then its grades and paper
 * types, the grade, then its subjects, the subject, then its topics, and the paper type, variant, session and title. Each
 * list is loaded before its value is set, as a person picking them would. `filled` names the fields it set, for the form
 * to mark them "From your PDF"; a field the user then changes leaves it (`forget`).
 */
export const usePaperDetection = (form: Ref<DetectableForm>, loaders: Loaders) => {
  const detection = ref<PaperDetectionDTO | null>(null)
  const filled = ref(new Set<DetectedField>())
  const applying = ref(false)

  const apply = async (found: PaperDetectionDTO) => {
    detection.value = found
    applying.value = true
    const set = new Set<DetectedField>()
    try {
      if (found.board) {
        form.value.board = found.board.id
        set.add('board')
        await Promise.allSettled([loaders.getGrades(found.board.id), loaders.getClassification(found.board.id)])
      }
      if (found.grade) {
        form.value.grade = found.grade.id
        set.add('grade')
        await loaders.getSubjects(found.grade.id)
      }
      if (found.subject) {
        form.value.subject = found.subject.id
        set.add('subject')
        await loaders.getTopics(found.subject.id)
      }
      if (found.classification) {
        form.value.classification = found.classification.id
        set.add('classification')
      }
      if (found.variant && 'variant' in form.value) {
        form.value.variant = String(found.variant.id)
        set.add('variant')
      }
      if (found.year) {
        form.value.edu_year = String(found.year)
        set.add('edu_year')
      }
      if (found.month) {
        form.value.edu_month = found.month
        set.add('edu_month')
      }
      if (found.title) {
        form.value.title = found.title
        set.add('title')
      }
    }
    finally {
      filled.value = set
      applying.value = false
    }
  }

  const isFilled = (field: DetectedField) => filled.value.has(field)
  const forget = (field: DetectedField) => {
    if (!filled.value.has(field) || applying.value) return
    const next = new Set(filled.value)
    next.delete(field)
    filled.value = next
  }

  return { detection, filled, applying, apply, isFilled, forget }
}
