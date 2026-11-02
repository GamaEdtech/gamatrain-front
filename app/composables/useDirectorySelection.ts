import { computed, ref, watch } from 'vue'
import type { Ref } from 'vue'
import { createError, navigateTo, useAsyncData, useNuxtApp, useRoute } from '#app'
import { useSubjectDirectoryApi } from '~/composables/api/subject-directory/useSubjectDirectory.api'
import { DIRECTORY_DEFAULT_BOARD_CODE } from '~/constants/pastpaper/directory'
import type { BoardDTO, GradeDTO, SubjectDTO } from '~/types/board'
import type { DirectorySelection, DirectorySelectorPath, DirectorySelectorSnapshot, DirectorySelectorStage } from '~/types/subject-directory'

// Find the URL's board, grade and subject. A missing or unknown id falls back to
// the first option (the default board for boards); the URL is then corrected.
const resolve = async (api: ReturnType<typeof useSubjectDirectoryApi>, path: DirectorySelectorPath) => {
  const snapshot: DirectorySelectorSnapshot = { boards: [], grades: [], subjects: [], board: null, grade: null, subject: null, error: false }
  const pick = <T>(items: T[], id: string, key: (item: T) => unknown, fallback?: T) =>
    items.find(item => String(key(item)) === id) ?? fallback ?? items[0] ?? null
  try {
    snapshot.boards = await api.getBoards()
    snapshot.board = pick(snapshot.boards, path.board, board => board.code, snapshot.boards.find(board => board.code === DIRECTORY_DEFAULT_BOARD_CODE))
    if (!snapshot.board) return snapshot
    snapshot.grades = await api.getGrades(snapshot.board.code)
    snapshot.grade = pick(snapshot.grades, path.grade, grade => grade.id)
    if (!snapshot.grade) return snapshot
    snapshot.subjects = await api.getSubjects(snapshot.grade.id)
    snapshot.subject = pick(snapshot.subjects, path.subject, subject => subject.id)
  }
  catch {
    snapshot.error = true
  }
  return snapshot
}

const readQuery = (value: unknown) => String((Array.isArray(value) ? value[0] : value) ?? '')
const toQuery = ({ board, grade, subject }: DirectorySelection): DirectorySelectorPath =>
  ({ board: String(board.code), grade: String(grade.id), subject: String(subject.id) })

// The URL (?board&grade&subject) is the selection: it is resolved on the server and
// again whenever the query changes, and choosing a subject just navigates.
export const useDirectorySelection = async () => {
  const nuxtApp = useNuxtApp()
  const route = useRoute()
  const api = useSubjectDirectoryApi()
  const path = computed<DirectorySelectorPath>(() => ({
    board: readQuery(route.query.board),
    grade: readQuery(route.query.grade),
    subject: readQuery(route.query.subject),
  }))

  // Keyed on the three ids only, so a filter change in the URL doesn't re-resolve.
  const pathKey = computed(() => JSON.stringify(path.value))
  const request = useAsyncData('directory-selection', () => resolve(api, path.value), { watch: [pathKey] })
  const { data: snapshot, refresh } = request
  const selection = computed<DirectorySelection | null>(() => {
    const { board, grade, subject } = snapshot.value ?? {}
    return board && grade && subject ? { board, grade, subject } : null
  })
  // The resolved query when it differs from the URL's, so the URL can be corrected.
  const correctedQuery = () => {
    const query = selection.value && toQuery(selection.value)
    return query && JSON.stringify(query) !== JSON.stringify(path.value) ? query : null
  }

  watch(selection, () => {
    const query = correctedQuery()
    if (query) navigateTo({ query }, { replace: true })
  })
  await request

  // One URL per subject: a bare, partial or unknown query gets a 301 to the full one.
  const query = correctedQuery()
  if (import.meta.server && query) {
    await nuxtApp.runWithContext(() => navigateTo({ path: route.path, query }, { redirectCode: 301 }))
    // Stop rendering the throwaway page; Nuxt sends the recorded redirect ahead of the error.
    throw createError({ statusCode: 301, statusMessage: 'Redirecting to canonical URL' })
  }

  return { snapshot, selection, refresh, select: (next: DirectorySelection) => navigateTo({ query: toQuery(next) }) }
}

// Browsing state for the Board / Grade / Subject menu. It browses with the same
// resolver as the URL, starting from the current selection each time it opens;
// picking a subject hands the full path back.
export const useDirectoryPicker = (
  snapshot: Ref<DirectorySelectorSnapshot | null | undefined>,
  onSelect: (selection: DirectorySelection) => void,
) => {
  const api = useSubjectDirectoryApi()
  const open = ref(false)
  const stage = ref<DirectorySelectorStage>('subject')
  const draft = ref<DirectorySelectorSnapshot | null>(null)
  const loading = ref(false)
  const search = ref('')
  let request = 0

  watch(open, (isOpen) => {
    if (!isOpen) return
    draft.value = snapshot.value ?? null
    stage.value = 'subject'
    search.value = ''
  })

  // Show a board (its first grade) or a grade; a newer click wins over a slower response.
  const browse = async (path: Partial<DirectorySelectorPath>, next: DirectorySelectorStage) => {
    const current = ++request
    loading.value = true
    stage.value = next
    search.value = ''
    const result = await resolve(api, { board: '', grade: '', subject: '', ...path })
    if (current !== request) return
    draft.value = result
    loading.value = false
  }

  // Search filters the shown grade's subjects by name or syllabus code.
  const visibleSubjects = computed(() => {
    const terms = search.value.trim().toLowerCase().split(/\s+/).filter(Boolean)
    return (draft.value?.subjects ?? []).filter(subject => terms.every(term => subject.title.toLowerCase().includes(term)))
  })

  return {
    open, stage, draft, loading, search, visibleSubjects,
    selectBoard: (board: BoardDTO) => browse({ board: String(board.code) }, 'grade'),
    selectGrade: (grade: GradeDTO) => browse({ board: String(draft.value?.board?.code ?? ''), grade: String(grade.id) }, 'subject'),
    selectSubject: (subject: SubjectDTO) => {
      const { board, grade } = draft.value ?? {}
      if (!board || !grade) return
      open.value = false
      onSelect({ board, grade, subject })
    },
  }
}
