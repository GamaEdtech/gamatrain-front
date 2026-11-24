import type {
  AdminExamDetailDTO,
  AdminExamEditDTO,
  AdminExamItemDTO,
  AdminExamParticipationListDTO,
  AdminExamQuestionDetailDTO,
  AdminExamQuestionEditDTO,
  AdminExamQuestionItemDTO,
  AdminListQuery,
  ApiResult,
} from '@/types'

const EXAMS = '/api/v2/admin/exams'
const QUESTIONS = '/api/v2/admin/examquestions'
const PARTICIPATIONS = '/api/v2/admin/exam-participations'

/**
 * The admin panel's exams and question bank, from the backend's copy. Reading works at any time; changes are refused
 * ("notNative") until exams are edited in the backend, and the backend's message then says so.
 */
export const useExamAdmin = () => {
  const { $toast } = useNuxtApp()
  const { handleApiResponseError, handleApiCatchError } = useApiErrorHandler()
  const loading = ref(false)
  const saving = ref(false)

  const call = async <T>(request: () => Promise<ApiResult<T>>, success?: string): Promise<T | null> => {
    try {
      const response = await request()
      if (!response.succeeded) {
        handleApiResponseError(response)
        return null
      }

      if (success) $toast.success(success)
      return (response.data ?? true) as T
    }
    catch (err: unknown) {
      handleApiCatchError(err)
      return null
    }
  }

  // Empty filters are left out of the query.
  const clean = (query: AdminListQuery) => Object.fromEntries(Object.entries(query).filter(([, v]) => v !== null && v !== undefined && v !== '')) as Record<string, string | number | boolean>

  const list = async <T>(base: string, query: AdminListQuery) => {
    loading.value = true
    const data = await call(() => useApiService.get<ApiResult<{ total: number, items: T[] }>>(base, clean(query)))
    loading.value = false
    return data ?? { total: 0, items: [] }
  }

  const save = async <T>(request: () => Promise<ApiResult<T>>, success: string) => {
    saving.value = true
    const result = await call(request, success)
    saving.value = false
    return result
  }

  return {
    loading,
    saving,
    getExams: (query: AdminListQuery) => list<AdminExamItemDTO>(EXAMS, query),
    getExam: (id: number | string) => call(() => useApiService.get<ApiResult<AdminExamDetailDTO>>(`${EXAMS}/${id}`)),
    updateExam: (id: number, item: AdminExamEditDTO) => save(() => useApiService.put<ApiResult<boolean>>(`${EXAMS}/${id}`, item), 'Exam saved.'),
    setExamStatus: (id: number, status: number) => save(() => useApiService.put<ApiResult<boolean>>(`${EXAMS}/${id}/status`, { status }), 'Status saved.'),
    setExamQuestions: (id: number, questionIds: number[]) => save(() => useApiService.put<ApiResult<boolean>>(`${EXAMS}/${id}/questions`, { questionIds }), 'Questions saved.'),
    deleteExam: (id: number) => save(() => useApiService.remove<ApiResult<boolean>>(`${EXAMS}/${id}`), 'Exam deleted.'),
    getParticipations: async (query: AdminListQuery): Promise<AdminExamParticipationListDTO> => {
      loading.value = true
      const data = await call(() => useApiService.get<ApiResult<AdminExamParticipationListDTO>>(PARTICIPATIONS, clean(query)))
      loading.value = false
      return data ?? { total: 0, finished: 0, participants: 0, items: [] }
    },
    getQuestions: (query: AdminListQuery) => list<AdminExamQuestionItemDTO>(QUESTIONS, query),
    getQuestion: (id: number | string) => call(() => useApiService.get<ApiResult<AdminExamQuestionDetailDTO>>(`${QUESTIONS}/${id}`)),
    saveQuestion: (id: number | null, item: AdminExamQuestionEditDTO) => id
      ? save(() => useApiService.put<ApiResult<boolean>>(`${QUESTIONS}/${id}`, item), 'Question saved.')
      : save(() => useApiService.post<ApiResult<number>>(QUESTIONS, item), 'Question added.'),
    setQuestionStatus: (id: number, status: number) => save(() => useApiService.put<ApiResult<boolean>>(`${QUESTIONS}/${id}/status`, { status }), 'Status saved.'),
    // A question's separate image for one slot: question, a-d or answerFull (gama-api keeps one image file per text).
    setQuestionImage: (id: number, slot: string, file: File) => {
      const form = new FormData()
      form.append('file', file)
      return call(() => useApiService.put<ApiResult<string>>(`${QUESTIONS}/${id}/images/${slot}`, form))
    },
    removeQuestionImage: (id: number, slot: string) => call(() => useApiService.remove<ApiResult<boolean>>(`${QUESTIONS}/${id}/images/${slot}`)),
    deleteQuestion: (id: number) => save(() => useApiService.remove<ApiResult<boolean>>(`${QUESTIONS}/${id}`), 'Question deleted.'),
  }
}
