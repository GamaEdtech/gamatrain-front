import type { MaybeRefOrGetter } from 'vue'

export interface QuestionOptionSource {
  answer_a?: string | null
  answer_b?: string | null
  answer_c?: string | null
  answer_d?: string | null
  a_file?: string | null
  b_file?: string | null
  c_file?: string | null
  d_file?: string | null
}

export interface QuestionOption {
  key: '1' | '2' | '3' | '4'
  text: string
  file: string | null
  alt: string
}

/** How a choice's box is drawn: `selected` is an exam answer not yet graded; the rest are graded states. */
export type QuestionChoiceStatus = 'default' | 'selected' | 'loading' | 'success' | 'error' | 'correct'

// The API sends '0' for "no file".
export const getQuestionFile = (file?: string | null) => (file && file !== '0' ? file : null)

/** The question's options, leaving out the empty ones (two-choice and true/false questions have only two). */
export const useQuestionOptions = (source: MaybeRefOrGetter<QuestionOptionSource>) => computed<QuestionOption[]>(() => {
  const question = toValue(source)
  const options: QuestionOption[] = [
    { key: '1', text: question.answer_a || '', file: getQuestionFile(question.a_file), alt: 'Answer A Image' },
    { key: '2', text: question.answer_b || '', file: getQuestionFile(question.b_file), alt: 'Answer B Image' },
    { key: '3', text: question.answer_c || '', file: getQuestionFile(question.c_file), alt: 'Answer C Image' },
    { key: '4', text: question.answer_d || '', file: getQuestionFile(question.d_file), alt: 'Answer D Image' },
  ]
  return options.filter(option => option.text || option.file)
})

/** Typesets the math inside an element once MathJax has loaded. */
export const useMathJaxRender = () => {
  const { $ensureMathJaxReady, $renderMathInElement } = useNuxtApp()

  return async (element?: HTMLElement | null) => {
    if (!import.meta.client || !element) return
    try {
      await $ensureMathJaxReady?.()
      $renderMathInElement?.(element)
    }
    catch (error) {
      console.error('MathJax typesetting failed:', error)
    }
  }
}
