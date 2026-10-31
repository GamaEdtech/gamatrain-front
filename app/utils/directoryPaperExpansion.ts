import type { DirectoryLatestSessionOptions } from '~/types/subject-directory/paperExpansion'

export const createDirectoryLatestSessionExpansion = (options: DirectoryLatestSessionOptions) => {
  let revision = 0
  const cancel = () => {
    revision++
  }

  const openLatest = async () => {
    const currentRevision = ++revision
    const years = options.years()
    const batchSize = Math.max(1, options.batchSize ?? 1)
    for (let start = 0; start < years.length; start += batchSize) {
      const batch = years.slice(start, start + batchSize)
      await Promise.all(batch.map(year => options.checkYear(year.id)))
      if (currentRevision !== revision) return

      // Both lists are ordered newest first. Only confirmed availability can
      // trigger automatic expansion; errors must not select an older session.
      for (const year of batch) {
        for (const session of options.sessions()) {
          const status = options.status(year.id, session.id)
          if (status === 'available') {
            options.open(year.id, session.id)
            return
          }
          if (status !== 'empty') return
        }
      }
    }
  }

  return { cancel, openLatest }
}
