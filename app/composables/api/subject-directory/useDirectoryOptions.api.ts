import { useNuxtApp } from '#app'
import { useApiService } from '~/composables/useApiService'
import { DIRECTORY_BOARD_ORDER } from '~/constants/pastpaper/directory'
import type { ApiResult } from '~/types/api'
import type { BoardDTO, GradeDTO, SubjectDTO } from '~/types/board'
import type { DirectorySelection } from '~/types/subject-directory/cascader'

export const useDirectoryOptionsApi = () => {
  const nuxtApp = useNuxtApp()
  const boardsByKey = new Map<string, Promise<BoardDTO[]>>()
  const gradesByBoard = new Map<string, Promise<GradeDTO[]>>()
  const subjectsByGrade = new Map<string, Promise<SubjectDTO[]>>()

  const loadOptions = <T>(cache: Map<string, Promise<T[]>>, key: string, request: () => Promise<ApiResult<T[]>>) => {
    const cached = cache.get(key)
    if (cached) return cached
    const pending = nuxtApp.runWithContext(request).then((response) => {
      if (!Array.isArray(response.data)) throw new Error('Unable to load directory options')
      return response.data
    }).catch((error: unknown) => {
      cache.delete(key)
      throw error
    })
    cache.set(key, pending)
    return pending
  }

  const getBoards = async () => {
    const boards = await loadOptions(boardsByKey, 'boards', () =>
      useApiService.get<ApiResult<BoardDTO[]>>('/api/v2/boards', undefined, { public: true }))
    const order = new Map(DIRECTORY_BOARD_ORDER.map((title, index) => [title, index]))
    return [...boards].sort((first, second) =>
      (order.get(first.title) ?? Number.MAX_SAFE_INTEGER) - (order.get(second.title) ?? Number.MAX_SAFE_INTEGER))
  }

  const getGrades = (boardId: number | string) => loadOptions(gradesByBoard, String(boardId), () =>
    useApiService.get<ApiResult<GradeDTO[]>>('/api/v1/types/list/', {
      type: 'base', section_id: boardId,
    }, { public: true }))

  const getSubjects = (gradeId: string) => loadOptions(subjectsByGrade, gradeId, () =>
    useApiService.get<ApiResult<SubjectDTO[]>>('/api/v1/types/list/', {
      type: 'lesson', base_id: gradeId,
    }, { public: true }))

  // Limit parallel option requests while loading the selected board's grades.
  const mapOptions = async <T, R>(items: T[], load: (item: T) => Promise<R>): Promise<R[]> => {
    const results = new Array<R>(items.length)
    let nextIndex = 0
    const workers = await Promise.allSettled(Array.from({ length: Math.min(4, items.length) }, async () => {
      while (nextIndex < items.length) {
        const index = nextIndex++
        results[index] = await load(items[index]!)
      }
    }))
    const failure = workers.find(worker => worker.status === 'rejected')
    if (failure?.status === 'rejected') throw failure.reason
    return results
  }

  const getBoardSubjectPaths = async (board: BoardDTO): Promise<DirectorySelection[]> => {
    const grades = await getGrades(board.code)
    return (await mapOptions(grades, async grade =>
      (await getSubjects(grade.id)).map(subject => ({ board, grade, subject })))).flat()
  }

  return { getBoards, getGrades, getSubjects, getBoardSubjectPaths }
}
