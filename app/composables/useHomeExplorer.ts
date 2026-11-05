import type { BoardDTO } from '@/types'

// The board and grade picked in the home finder, shared with the category cards under the hero.
export const useHomeExplorer = () => {
  const selectedBoard = useState<BoardDTO | null>('home-board', () => null)
  const selectedGrade = useState<number | null>('home-grade', () => null)

  const searchLink = (type: string, title?: string) => ({
    path: '/search',
    query: {
      type,
      section: selectedBoard.value?.code,
      base: selectedGrade.value ?? undefined,
      title: title || undefined,
    },
  })

  return { selectedBoard, selectedGrade, searchLink }
}
