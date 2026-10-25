import type {
  ApiResult,
  ExamDetaiDTO,
  ExamPageDetailDTO,
  ExamPageResponseDTO,
} from '@/types'

const loadingGetItemById = ref(false)

// gama-api sends `topics: ""` for an exam without topics, and the page maps over it: the server render threw and
// answered 500 for every such exam (about 4 in 10) since the 2026-10-19 redesign.
const withTopicList = <T extends { topics: unknown }>(exam: T): T =>
  Array.isArray(exam.topics) ? exam : { ...exam, topics: [] }
// const NAME = 'Exam'

export const useExam = () => {
  // const { $toast } = useNuxtApp()
  const { handleApiResponseError, handleApiCatchError, createApiFailure } = useApiErrorHandler()
  // Requests after an `await` run outside the setup context, where useApiService's own composables throw.
  const nuxtApp = useNuxtApp()

  // The exam page's data from gamatrain-back, which adds sample questions and the source paper to gama-api's exam
  // in one call. If gamatrain-back can't answer, the page falls back to gama-api directly, without the extras.
  const getItemById = async (id: string | number): Promise<ApiResult<ExamPageDetailDTO>> => {
    loadingGetItemById.value = true

    try {
      const page = await getExamPage(id)
      if (page) return { status: 1, succeeded: true, data: withTopicList(page) }

      const response = await nuxtApp.runWithContext(() => useApiService.get<ApiResult<ExamDetaiDTO>>(
        `/api/v1/exams/${id}`,
      ))
      if (response.status == 0) {
        handleApiResponseError(response)
      }

      return {
        ...response,
        data: response.data ? withTopicList({ ...response.data, sampleQuestions: [], paper: null }) : null,
      }
    }
    catch (err: unknown) {
      handleApiCatchError(err)

      return createApiFailure<ExamPageDetailDTO>(err)
    }
    finally {
      loadingGetItemById.value = false
    }
  }

  // Null for an unknown exam too: the gama-api fallback then answers it, as before.
  const getExamPage = async (id: string | number): Promise<ExamPageDetailDTO | null> => {
    try {
      const response = await nuxtApp.runWithContext(() =>
        useApiService.get<ApiResult<ExamPageResponseDTO>>(`/api/v2/exams/${id}`))
      const page = response.succeeded ? response.data : null
      return page?.exam
        ? { ...page.exam, sampleQuestions: page.sampleQuestions ?? [], paper: page.paper ?? null }
        : null
    }
    catch {
      return null
    }
  }

  return {
    getItemById,
    loadingGetItemById,
  }
}
