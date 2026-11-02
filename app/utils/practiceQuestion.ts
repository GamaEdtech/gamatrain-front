import type { ExamSampleQuestionDTO, QuestionDTO } from '@/types'
import { getQuestionFile } from '@/composables/useQuestionOptions'

/**
 * A question from the question page's call in the shape the exam's sample-question card takes.
 * Options without text or picture are left out (two-choice and true/false questions have only two).
 */
export const toSampleQuestion = (dto: QuestionDTO, code: string): ExamSampleQuestionDTO => {
  const options = [
    { key: 1, text: dto.answer_a, image: getQuestionFile(dto.a_file) },
    { key: 2, text: dto.answer_b, image: getQuestionFile(dto.b_file) },
    { key: 3, text: dto.answer_c, image: getQuestionFile(dto.c_file) },
    { key: 4, text: dto.answer_d, image: getQuestionFile(dto.d_file) },
  ].filter(option => option.text || option.image)

  return {
    id: Number(dto.id),
    code,
    question: dto.question,
    image: getQuestionFile(dto.q_file),
    options: options.map(option => ({ ...option, text: option.text || null })),
  }
}
