import { computed, onScopeDispose, reactive, shallowRef, watch } from 'vue'
import { searchDirectorySubjects } from '~/utils/directorySubjectSearch'
import type { BoardDTO, GradeDTO } from '~/types/board'
import type { DirectorySelection, DirectorySubjectSearchState } from '~/types/subject-directory/cascader'

export const useDirectorySubjectSearch = (
  getBoard: () => BoardDTO | null,
  loadPaths: (board: BoardDTO) => Promise<DirectorySelection[]>,
  getGrade: () => GradeDTO | null,
) => {
  const state = reactive<DirectorySubjectSearchState>({ query: '', loading: false, error: '' })
  const paths = shallowRef<DirectorySelection[]>([])
  const boardCode = computed(() => String(getBoard()?.code || ''))
  const cachedPaths = new Map<string, DirectorySelection[]>()
  let revision = 0
  let disposed = false

  const load = async () => {
    const board = getBoard()
    if (!board || state.loading) return
    const code = String(board.code)
    const cached = cachedPaths.get(code)
    if (cached) {
      paths.value = cached
      return
    }
    const currentRevision = ++revision
    state.loading = true
    state.error = ''
    try {
      const results = await loadPaths(board)
      if (disposed) return
      cachedPaths.set(code, results)
      if (currentRevision === revision && code === boardCode.value) paths.value = results
    }
    catch {
      if (!disposed && currentRevision === revision) state.error = 'Unable to load subjects for this board. Please try again.'
    }
    finally {
      if (!disposed && currentRevision === revision) state.loading = false
    }
  }

  watch([boardCode, () => state.query.trim()], ([code, query], [previousCode]) => {
    if (code !== previousCode) {
      revision++
      paths.value = []
      state.loading = false
      state.error = ''
    }
    if (code && query) void load()
  })
  onScopeDispose(() => {
    disposed = true
  })

  const results = computed(() => searchDirectorySubjects(
    paths.value.filter(path => String(path.board.code) === boardCode.value), state.query, getGrade()?.id,
  ))
  return { state, results, retry: load }
}
