export type ExamResultChoiceStatus = 'success' | 'error' | 'correct' | 'default'

const normalizeChoice = (value: string | number | null | undefined) => {
  return value === null || value === undefined ? '' : String(value)
}

export const useExamResultChoiceStatus = () => {
  const getChoiceStatus = (
    trueAnswer: string | number | null | undefined,
    userAnswer: string | number | null | undefined,
    choice: string | number,
  ): ExamResultChoiceStatus => {
    const normalizedTrueAnswer = normalizeChoice(trueAnswer)
    const normalizedUserAnswer = normalizeChoice(userAnswer)
    const normalizedChoice = normalizeChoice(choice)

    if (normalizedChoice === normalizedTrueAnswer && normalizedChoice === normalizedUserAnswer) return 'success'
    if (normalizedChoice === normalizedUserAnswer && normalizedChoice !== normalizedTrueAnswer) return 'error'
    if (normalizedChoice === normalizedTrueAnswer) return 'correct'

    return 'default'
  }

  const getChoiceClass = (status: ExamResultChoiceStatus) => {
    if (status === 'success' || status === 'correct') return 'border-success'
    if (status === 'error') return 'border-lightError'

    return 'border-grey200'
  }

  const getQuestionStatusText = (
    trueAnswer: string | number | null | undefined,
    userAnswer: string | number | null | undefined,
  ) => {
    const normalizedUserAnswer = normalizeChoice(userAnswer)
    if (!normalizedUserAnswer || normalizedUserAnswer === '0') return 'No answer'

    return normalizedUserAnswer === normalizeChoice(trueAnswer) ? 'Correct' : 'Wrong'
  }

  const getQuestionChipColor = (
    trueAnswer: string | number | null | undefined,
    userAnswer: string | number | null | undefined,
  ) => {
    const normalizedUserAnswer = normalizeChoice(userAnswer)
    if (!normalizedUserAnswer || normalizedUserAnswer === '0') return 'grey300'

    return normalizedUserAnswer === normalizeChoice(trueAnswer) ? 'success' : 'lightError'
  }

  return {
    getChoiceStatus,
    getChoiceClass,
    getQuestionStatusText,
    getQuestionChipColor,
  }
}
