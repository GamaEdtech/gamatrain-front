import type {
  ApiResult,
  AppError,
  BoardDTO,
  GradeDTO,
} from '@/types'

const data = ref<BoardDTO[]>()
const loadingGetData = ref(true)

const grades = ref<GradeDTO[]>()
const loadingGrade = ref(false)

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

  return { loadingGetData, data, getData, resetBoards, getGrades, grades, loadingGrade, resetGrades }
}
