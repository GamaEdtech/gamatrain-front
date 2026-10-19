import type {
  ApiResult,
  AppError,
  BoardDTO,
  GradeDTO,
  SubjectDTO,
  ClassificationDTO,
  TopicDTO,
  ExtraTypeFilePastPaperCreateDTO,
} from '@/types'

const data = ref<BoardDTO[]>([])
const loadingGetData = ref(true)

const grades = ref<GradeDTO[]>([])
const loadingGrade = ref(false)

const subjects = ref<SubjectDTO[]>([])
const loadingSubject = ref(false)

const classifications = ref<ClassificationDTO[]>([])
const loadingClassification = ref(false)

const topics = ref<TopicDTO[]>([])
const loadingTopic = ref(false)

const extraTypeFile = ref<ExtraTypeFilePastPaperCreateDTO[]>([])
const loadingExtraTypeFile = ref(false)

export const useBoard = () => {
  const { $toast } = useNuxtApp()

  const getData = async () => {
    loadingGetData.value = true
    try {
      const response = await useApiService.get<
        ApiResult<BoardDTO[]>
      >('/api/v2/boards', undefined, { public: true })
      if (response.data) {
        data.value = response.data
      }
      else {
        data.value = []
      }
    }
    catch (err: unknown) {
      const error = err as AppError
      if (error.response?.status === 400) {
        $toast.error(error.response.data?.message || '')
      }
    }
    finally {
      loadingGetData.value = false
    }
  }

  const resetBoards = () => {
    data.value = []
  }

  const getGrades = async (boardId: number | string) => {
    try {
      loadingGrade.value = true

      const response = await useApiService.get<
        ApiResult<GradeDTO[]>
      >(
        `/api/v1/types/list/?type=base&section_id=${boardId}`,
      )

      if (response.data && response.data.length > 0) {
        grades.value = response.data
      }
      else {
        grades.value = []
      }

      return response
    }
    catch (err: unknown) {
      const error = err as AppError

      if (error.response?.status === 400) {
        $toast.error(error.response.data?.message || '')
      }

      grades.value = []

      return {
        succeeded: false,
        message: 'The operation failed. Please try again later.',
        data: {},
      }
    }
    finally {
      loadingGrade.value = false
    }
  }

  const resetGrades = () => {
    grades.value = []
  }

  const getSubjects = async (gradeId: number | string) => {
    try {
      loadingSubject.value = true

      const response = await useApiService.get<
        ApiResult<SubjectDTO[]>
      >(
        `/api/v1/types/list/?type=lesson&base_id=${gradeId}`,
      )

      if (response.data && response.data.length > 0) {
        subjects.value = response.data
      }
      else {
        subjects.value = []
      }

      return response
    }
    catch (err: unknown) {
      const error = err as AppError

      if (error.response?.status === 400) {
        $toast.error(error.response.data?.message || '')
      }

      subjects.value = []

      return {
        succeeded: false,
        message: 'The operation failed. Please try again later.',
        data: {},
      }
    }
    finally {
      loadingSubject.value = false
    }
  }

  const resetSubjects = () => {
    subjects.value = []
  }

  const getClassification = async (boardId: number | string) => {
    try {
      loadingClassification.value = true

      const response = await useApiService.get<
        ApiResult<ClassificationDTO[]>
      >(
        `/api/v1/types/list/?type=test_type&section_id=${boardId}`,
      )

      if (response.data && response.data.length > 0) {
        classifications.value = response.data
      }
      else {
        classifications.value = []
      }

      return response
    }
    catch (err: unknown) {
      const error = err as AppError

      if (error.response?.status === 400) {
        $toast.error(error.response.data?.message || '')
      }

      classifications.value = []

      return {
        succeeded: false,
        message: 'The operation failed. Please try again later.',
        data: {},
      }
    }
    finally {
      loadingClassification.value = false
    }
  }

  const resetClassifications = () => {
    classifications.value = []
  }

  const getTopics = async (subjectId: number | string) => {
    try {
      loadingTopic.value = true

      const response = await useApiService.get<
        ApiResult<TopicDTO[]>
      >(
        `/api/v1/types/list/?type=topic&lesson_id=${subjectId}`,
      )

      if (response.data && response.data.length > 0) {
        topics.value = response.data
      }
      else {
        topics.value = []
      }

      return response
    }
    catch (err: unknown) {
      const error = err as AppError

      if (error.response?.status === 400) {
        $toast.error(error.response.data?.message || '')
      }

      topics.value = []

      return {
        succeeded: false,
        message: 'The operation failed. Please try again later.',
        data: {},
      }
    }
    finally {
      loadingTopic.value = false
    }
  }

  const resetTopics = () => {
    topics.value = []
  }

  const getExtraTypeFile = async (type: string) => {
    try {
      loadingExtraTypeFile.value = true

      const response = await useApiService.get<
        ApiResult<ExtraTypeFilePastPaperCreateDTO[]>
      >(
        `/api/v1/types/list?type=${type}`,
      )

      if (response.data && response.data.length > 0) {
        extraTypeFile.value = response.data
      }
      else {
        extraTypeFile.value = []
      }

      return response
    }
    catch (err: unknown) {
      const error = err as AppError

      if (error.response?.status === 400) {
        $toast.error(error.response.data?.message || '')
      }

      extraTypeFile.value = []

      return {
        succeeded: false,
        message: 'The operation failed. Please try again later.',
        data: {},
      }
    }
    finally {
      loadingExtraTypeFile.value = false
    }
  }

  const resetExtraTypeFile = () => {
    extraTypeFile.value = []
  }

  return { loadingGetData, data, getData, resetBoards, getGrades, grades, loadingGrade, resetGrades, subjects, loadingSubject, resetSubjects, getSubjects, getClassification, resetClassifications, loadingClassification, classifications, getTopics, resetTopics, loadingTopic, topics, getExtraTypeFile, resetExtraTypeFile, extraTypeFile, loadingExtraTypeFile }
}
