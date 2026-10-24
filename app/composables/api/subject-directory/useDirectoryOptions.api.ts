import { useBoardApi } from '~/composables/api/board/useBoard.api'
import { DIRECTORY_BOARD_ORDER } from '~/constants/pastpaper/directory'
import { resolveDirectorySelection } from '~/utils/directorySelection'
import type { ApiResult } from '~/types/api'
import type { BoardDTO } from '~/types/board'
import type { DirectorySelection, DirectorySelectorPath } from '~/types/subject-directory/cascader'

export const useDirectoryOptionsApi = () => {
  const api = useBoardApi({ cache: true, public: true })

  const getOptionItems = async <T>(request: Promise<ApiResult<T[]>>) => {
    const response = await request
    if (!Array.isArray(response.data)) throw new Error('Unable to load directory options')
    return response.data
  }

  const getBoards = async () => {
    const boards = await getOptionItems(api.getBoards())
    const order = new Map(DIRECTORY_BOARD_ORDER.map((title, index) => [title, index]))
    return [...boards].sort((first, second) =>
      (order.get(first.title) ?? Number.MAX_SAFE_INTEGER) - (order.get(second.title) ?? Number.MAX_SAFE_INTEGER))
  }

  const getGrades = (boardId: number | string) => getOptionItems(api.getGrades(boardId))
  const getSubjects = (gradeId: string) => getOptionItems(api.getSubjects(gradeId))

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

  const resolvePath = (path: DirectorySelectorPath) => resolveDirectorySelection({ getBoards, getGrades, getSubjects }, path)

  return { getBoards, getGrades, getSubjects, getBoardSubjectPaths, resolvePath }
}
