import { DIRECTORY_DEFAULT_BOARD_CODE } from '../constants/pastpaper/directory'
import type { BoardDTO, GradeDTO } from '../types/board'
import { mapWithLimit } from './mapWithLimit'
import type { DirectoryOptionSource, DirectorySelectorPath, DirectorySelectorSnapshot, DirectorySelectorStage } from '../types/subject-directory/cascader'

// Resolve URL selections independently of in-progress browsing in the cascader.
export const resolveDirectorySelection = async (
  source: DirectoryOptionSource,
  path: DirectorySelectorPath,
): Promise<DirectorySelectorSnapshot> => {
  const snapshot: DirectorySelectorSnapshot = {
    boards: [], grades: [], subjects: [], board: null, grade: null, subject: null, errorStage: null,
  }
  let stage: DirectorySelectorStage = 'board'

  const loadGrades = async (board: BoardDTO) => {
    stage = 'grade'
    Object.assign(snapshot, { board, grade: null, subject: null, grades: [], subjects: [] })
    snapshot.grades = await source.getGrades(board.code)
    return snapshot.grades
  }
  const loadSubjects = async (grade: GradeDTO) => {
    stage = 'subject'
    Object.assign(snapshot, { grade, subject: null, subjects: [] })
    snapshot.subjects = await source.getSubjects(grade.id)
    return snapshot.subjects
  }

  try {
    snapshot.boards = await source.getBoards()
    const requestedBoard = snapshot.boards.find(board => String(board.code) === path.board)
    const defaultBoard = snapshot.boards.find(board => String(board.code) === String(DIRECTORY_DEFAULT_BOARD_CODE))
    const candidates = requestedBoard
      ? [requestedBoard]
      : defaultBoard ? [defaultBoard, ...snapshot.boards.filter(board => board !== defaultBoard)] : snapshot.boards

    // A supplied grade determines its parent board, even when board is omitted.
    if (path.grade) {
      for (const board of candidates) {
        const grades = await loadGrades(board)
        const grade = grades.find(item => String(item.id) === path.grade)
        if (!grade) continue
        const subjects = await loadSubjects(grade)
        snapshot.subject = subjects.find(item => String(item.id) === path.subject) || subjects[0] || null
        return snapshot
      }
    }

    // A subject-only link must keep its subject rather than use an unrelated default.
    // Search the default board first, then the rest, loading grades and subjects in
    // parallel so server rendering doesn't wait on one request at a time.
    if (path.subject) {
      stage = 'subject'
      const findInBoard = async (board: BoardDTO) => {
        const grades = await source.getGrades(board.code)
        const subjectLists = await mapWithLimit(grades, 4, grade => source.getSubjects(grade.id))
        const index = subjectLists.findIndex(list => list.some(item => String(item.id) === path.subject))
        return index < 0 ? null : { board, grades, grade: grades[index]!, subjects: subjectLists[index]! }
      }
      for (const boards of [candidates.slice(0, 1), candidates.slice(1)]) {
        const match = (await mapWithLimit(boards, 4, findInBoard)).find(Boolean)
        if (match) {
          Object.assign(snapshot, match, {
            subject: match.subjects.find(item => String(item.id) === path.subject)!,
          })
          return snapshot
        }
      }
    }

    // Choose the first complete API-backed path, skipping empty default branches.
    let emptySnapshot: DirectorySelectorSnapshot | undefined
    for (const board of candidates) {
      const grades = await loadGrades(board)
      for (const grade of grades) {
        const subjects = await loadSubjects(grade)
        if (subjects[0]) {
          snapshot.subject = subjects[0]
          return snapshot
        }
        emptySnapshot ??= { ...snapshot }
      }
      emptySnapshot ??= { ...snapshot }
    }
    return emptySnapshot || snapshot
  }
  catch {
    // Failed lookups are retryable; never treat a network error as an invalid ID.
    snapshot.errorStage = stage
    return snapshot
  }
}
