import type { Ref } from 'vue'
import type { DirectoryPaper } from './paperFiles'

export interface DirectoryStructuredDataPaper {
  paper: DirectoryPaper
  year: string
  session: string
}

export interface DirectoryStructuredDataSource {
  visibleYears: Ref<{ id: number, title: string }[]>
  displayedSessions: (year: number) => { id: number, title: string }[]
  isSessionOpen: (year: number, month: number) => boolean
  sessionState: (year: number, month: number) => { items: DirectoryPaper[] }
}
