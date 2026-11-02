import type { ApiResult, ExamPageResponseDTO, ExamSampleQuestionDTO, QuestionDTO } from '@/types'
import { toSampleQuestion } from '@/utils/practiceQuestion'

interface TopicItem {
  id: string
  /** True for a unit (a parent topic); units hold the most questions. */
  season?: boolean
}

// How many of the subject's topics to try for a random question before giving up.
const RANDOM_TOPIC_TRIES = 3

const shuffled = <T>(items: T[]) => items
  .map(item => ({ item, order: Math.random() }))
  .sort((a, b) => a.order - b.order)
  .map(({ item }) => item)

/** Questions for the practice-question card: one from a content's online test, or a random one from its subject. */
export const usePracticeQuestion = () => {
  // Requests after an `await` run outside the setup context, where useApiService's own composables throw.
  const nuxtApp = useNuxtApp()
  const get = <T>(...args: Parameters<typeof useApiService.get>) =>
    nuxtApp.runWithContext(() => useApiService.get<T>(...args))

  // gamatrain-back's exam page call, the one the exam details page uses; it carries the test's sample questions.
  const loadFromExam = async (examId: string): Promise<ExamSampleQuestionDTO | null> => {
    const response = await get<ApiResult<ExamPageResponseDTO>>(`/api/v2/exams/${examId}`)
    return response.succeeded ? response.data?.sampleQuestions?.[0] ?? null : null
  }

  const loadRandomForTopic = async (lesson: string, topic: string): Promise<ExamSampleQuestionDTO | null> => {
    const random = await get<ApiResult<{ code: string }>>(
      `/api/v1/examTests/random?lesson=${lesson}&topic=${topic}`,
      undefined,
      { public: true },
    )
    const code = random.data?.code
    if (!code) return null

    const response = await get<ApiResult<QuestionDTO>>(
      `/api/v1/examTests/${code}`,
      undefined,
      { proxy: true, public: true },
    )
    return response.data?.id ? toSampleQuestion(response.data, code) : null
  }

  /**
   * gama-api's random call needs a topic as well as the subject, and most papers have no topic. So the content's own
   * topic is tried first, then a few of the subject's topics at random, units first.
   */
  const loadRandom = async (lesson: string, topic?: string): Promise<ExamSampleQuestionDTO | null> => {
    if (topic && topic !== '0') {
      const question = await loadRandomForTopic(lesson, topic)
      if (question) return question
    }

    const list = await get<ApiResult<TopicItem[]>>(
      `/api/v1/types/list/?type=topic&lesson_id=${lesson}`,
      undefined,
      { public: true },
    )
    const topics = list.data ?? []
    const candidates = [
      ...shuffled(topics.filter(item => item.season)),
      ...shuffled(topics.filter(item => !item.season)),
    ].filter(item => item.id !== topic).slice(0, RANDOM_TOPIC_TRIES)

    for (const candidate of candidates) {
      const question = await loadRandomForTopic(lesson, candidate.id)
      if (question) return question
    }
    return null
  }

  return { loadFromExam, loadRandom }
}
