import { computed, onScopeDispose, reactive, watch } from 'vue'
import { useAsyncData, useRoute, useRouter } from '#app'
import { useDirectoryOptionsApi } from '~/composables/api/subject-directory/useDirectoryOptions.api'
import { useDirectorySubjectSearch } from '~/composables/useDirectorySubjectSearch'
import type { BoardDTO, GradeDTO, SubjectDTO } from '~/types/board'
import type {
  DirectorySelection,
  DirectorySelectorColumn,
  DirectorySelectorPath,
  DirectorySelectorSnapshot,
  DirectorySelectorStage,
  DirectorySelectorState,
} from '~/types/subject-directory/cascader'

export const useDirectoryCascader = async () => {
  const route = useRoute()
  const router = useRouter()
  const api = useDirectoryOptionsApi()
  const readValue = (value: unknown) => String((Array.isArray(value) ? value[0] : value) || '')
  const readPath = (): DirectorySelectorPath => ({
    board: readValue(route.query.board),
    grade: readValue(route.query.grade),
    subject: readValue(route.params.subject || route.query.subject),
  })
  const pathKey = (path: DirectorySelectorPath) => JSON.stringify(path)
  const selectionPath = (selection: DirectorySelection): DirectorySelectorPath => ({
    board: String(selection.board.code), grade: String(selection.grade.id), subject: String(selection.subject.id),
  })
  const state = reactive<DirectorySelectorState>({
    open: false, stage: 'board', loading: null, committing: false, commitError: '',
    selection: null, boards: [], grades: [], subjects: [],
    board: null, grade: null, subject: null, errorStage: null,
  })
  const { state: searchState, results: searchResults, retry: retrySearch } = useDirectorySubjectSearch(
    () => state.board || state.selection?.board || null,
    api.getBoardSubjectPaths,
  )
  let revision = 0
  let initialized = false
  let committingPath = ''

  watch(() => state.open, (open) => {
    if (!open) searchState.query = ''
  })

  // Resolve the entire dependent path before exposing a subject to result loaders.
  const resolvePath = async (path: DirectorySelectorPath): Promise<DirectorySelectorSnapshot> => {
    const snapshot: DirectorySelectorSnapshot = {
      boards: [], grades: [], subjects: [], board: null, grade: null, subject: null, errorStage: null,
    }
    let stage: DirectorySelectorStage = 'board'
    try {
      snapshot.boards = await api.getBoards()
      snapshot.board = snapshot.boards.find(board => String(board.code) === path.board) || null
      if (!snapshot.board) return snapshot
      stage = 'grade'
      snapshot.grades = await api.getGrades(snapshot.board.code)
      snapshot.grade = snapshot.grades.find(grade => String(grade.id) === path.grade) || null
      if (!snapshot.grade) return snapshot
      stage = 'subject'
      snapshot.subjects = await api.getSubjects(snapshot.grade.id)
      snapshot.subject = snapshot.subjects.find(subject => String(subject.id) === path.subject) || null
    }
    catch {
      snapshot.errorStage = stage
    }
    return snapshot
  }

  const applySnapshot = (snapshot: DirectorySelectorSnapshot) => {
    Object.assign(state, snapshot)
    state.stage = snapshot.grade ? 'subject' : snapshot.board ? 'grade' : 'board'
    state.loading = null
    state.selection = snapshot.board && snapshot.grade && snapshot.subject
      ? { board: snapshot.board, grade: snapshot.grade, subject: snapshot.subject }
      : null
  }

  const syncRoute = async () => {
    const currentRevision = ++revision
    state.open = false
    state.loading = 'board'
    state.selection = null
    const snapshot = await resolvePath(readPath())
    if (currentRevision === revision) applySnapshot(snapshot)
  }

  watch(() => pathKey(readPath()), () => {
    if (!initialized) return
    // The leaf-selection navigation already holds a validated complete path.
    if (committingPath === pathKey(readPath())) return
    if (state.selection && pathKey(selectionPath(state.selection)) === pathKey(readPath())) return
    void syncRoute()
  })
  onScopeDispose(() => {
    revision++
  })

  const selectBoard = async (board: BoardDTO) => {
    if (state.committing || !state.boards.some(item => item.code === board.code)) return
    const currentRevision = ++revision
    Object.assign(state, { board, grade: null, subject: null, grades: [], subjects: [], stage: 'grade', loading: 'grade', errorStage: null, commitError: '' })
    try {
      const grades = await api.getGrades(board.code)
      if (currentRevision === revision) state.grades = grades
    }
    catch {
      if (currentRevision === revision) state.errorStage = 'grade'
    }
    finally {
      if (currentRevision === revision) state.loading = null
    }
  }

  const selectGrade = async (grade: GradeDTO) => {
    if (state.committing || !state.board || !state.grades.some(item => item.id === grade.id)) return
    const currentRevision = ++revision
    Object.assign(state, { grade, subject: null, subjects: [], stage: 'subject', loading: 'subject', errorStage: null, commitError: '' })
    try {
      const subjects = await api.getSubjects(grade.id)
      if (currentRevision === revision) state.subjects = subjects
    }
    catch {
      if (currentRevision === revision) state.errorStage = 'subject'
    }
    finally {
      if (currentRevision === revision) state.loading = null
    }
  }

  const commitSelection = async (selection: DirectorySelection) => {
    if (state.committing) return
    revision++
    state.loading = null
    const nextPath = selectionPath(selection)
    state.committing = true
    state.commitError = ''
    committingPath = pathKey(nextPath)
    try {
      const failure = await router.replace({ query: { ...route.query, ...nextPath }, hash: route.hash })
      if (pathKey(readPath()) !== pathKey(nextPath)) {
        if (failure) state.commitError = 'Unable to apply this selection. Please try again.'
        return
      }
      // Commit all three levels together after navigation succeeds.
      Object.assign(state, {
        selection, board: selection.board, grade: selection.grade, subject: selection.subject, open: false,
      })
    }
    catch {
      state.commitError = 'Unable to apply this selection. Please try again.'
    }
    finally {
      committingPath = ''
      state.committing = false
    }
  }

  const selectSubject = (subject: SubjectDTO) => {
    if (!state.board || !state.grade || !state.subjects.some(item => item.id === subject.id)) return
    return commitSelection({ board: state.board, grade: state.grade, subject })
  }

  const selectSearchResult = (id: string) => {
    const result = searchResults.value.find(item => item.id === id)
    if (result) void commitSelection(result.selection)
  }

  const setOpen = (open: boolean) => {
    state.open = open
    if (!open) {
      revision++
      state.loading = null
      return
    }
    // Discard abandoned browsing when reopening the selected or URL-prefilled path.
    const currentRevision = ++revision
    Object.assign(state, {
      board: null, grade: null, subject: null, grades: [], subjects: [],
      stage: 'board', loading: 'board', errorStage: null, commitError: '',
    })
    void resolvePath(state.selection ? selectionPath(state.selection) : readPath()).then((snapshot) => {
      if (currentRevision !== revision) return
      Object.assign(state, snapshot, {
        stage: snapshot.grade ? 'subject' : snapshot.board ? 'grade' : 'board', loading: null,
      })
    })
  }

  const retry = () => {
    if (state.errorStage === 'subject' && state.grade) void selectGrade(state.grade)
    else if (state.errorStage === 'grade' && state.board) void selectBoard(state.board)
    else void syncRoute()
  }

  const displayPath = computed(() => state.selection
    ? [state.selection.board.title, state.selection.grade.title, state.selection.subject.title].join(' / ')
    : 'Select Board / Grade / Subject')

  const columns = computed<DirectorySelectorColumn[]>(() => {
    const items: DirectorySelectorColumn[] = [{
      stage: 'board', title: 'Board', selectedId: String(state.board?.code || ''),
      items: state.boards.map(board => ({ id: String(board.code), title: board.title })),
    }]
    if (state.board) items.push({
      stage: 'grade', title: 'Grade', selectedId: String(state.grade?.id || ''),
      items: state.grades.map(grade => ({ id: String(grade.id), title: grade.title })),
    })
    if (state.grade) items.push({
      stage: 'subject', title: 'Subject', selectedId: String(state.subject?.id || ''),
      items: state.subjects.map(subject => ({ id: String(subject.id), title: subject.title })),
    })
    return items
  })

  const selectOption = (stage: DirectorySelectorStage, id: string) => {
    if (stage === 'board') {
      const board = state.boards.find(item => String(item.code) === id)
      if (board) void selectBoard(board)
    }
    else if (stage === 'grade') {
      const grade = state.grades.find(item => String(item.id) === id)
      if (grade) void selectGrade(grade)
    }
    else {
      const subject = state.subjects.find(item => String(item.id) === id)
      if (subject) void selectSubject(subject)
    }
  }

  const initialPath = readPath()
  const { data } = await useAsyncData(`directory-selector:${pathKey(initialPath)}`, () => resolvePath(initialPath))
  if (data.value) applySnapshot(data.value)
  initialized = true
  if (pathKey(initialPath) !== pathKey(readPath())) await syncRoute()

  return {
    state, columns, displayPath, setOpen, selectOption, retry,
    searchState, searchResults, retrySearch, selectSearchResult,
  }
}
