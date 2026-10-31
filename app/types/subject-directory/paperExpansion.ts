export interface DirectoryLatestSessionOptions {
  years: () => readonly { id: number }[]
  sessions: () => readonly { id: number }[]
  checkYear: (year: number) => Promise<void>
  status: (year: number, month: number) => string
  open: (year: number, month: number) => void
  // How many years to check at once; results are still read newest first.
  batchSize?: number
}
