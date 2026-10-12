import type { DirectoryLatestSessionOptions } from '~/types/subject-directory/paperExpansion'

export const createDirectoryLatestSessionExpansion = (options: DirectoryLatestSessionOptions) => {
  let revision = 0
  const cancel = () => {
    revision++
  }

  const openLatest = async () => {
    const currentRevision = ++revision
    for (const year of options.years()) {
      await options.checkYear(year.id)
      if (currentRevision !== revision) return

      // Both lists are ordered newest first. Only confirmed availability can
      // trigger automatic expansion; errors must not select an older session.
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

  return { cancel, openLatest }
}
