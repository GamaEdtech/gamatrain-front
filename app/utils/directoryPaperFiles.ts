import type {
  DirectoryDownloadParams,
  DirectoryExtraFile,
  DirectoryFileAvailability,
  DirectoryPaperDownload,
  DirectoryPaperFileSource,
} from '../types/subject-directory/paperFiles'

const extraFileIcons: Record<string, string> = {
  6351: 'md:attach_file',
  6705: 'md:volume_up_outlined',
  8043: 'md:import_contacts_outlined',
}

// Right-to-left order after Question Paper and Mark Scheme.
const extraFileOrder: Record<string, number> = {
  6351: 0, // Insert
  10517: 1, // Confidential Instructions
  6705: 2, // Audio File
  10519: 3, // Transcript
  8043: 4, // Solved Paper
  10518: 5, // Supporting File
  10520: 6, // Teacher Notes
  10560: 7, // Map File
  10561: 8, // Pre Released Material
}

const isAvailable = (value: DirectoryFileAvailability | undefined) => value === true || value === 1 || value === '1'
const hasExtraId = (value: unknown) => /^[1-9]\d*$/.test(String(value))
const getPrice = (value: number | string | null | undefined): number | null => {
  if (value == null || String(value).trim() === '') return null
  const price = Number(value)
  return Number.isFinite(price) && price >= 0 ? price : null
}

const getExtraTitle = (file: DirectoryExtraFile) => {
  const title = file.type_title?.trim() || 'Extra File'
  return title === 'Confidental Instructions' ? 'Confidential Instructions' : title
}

const getExtraDownloads = (paper: DirectoryPaperFileSource): DirectoryPaperDownload[] => {
  if (Array.isArray(paper.files?.extra)) {
    const seen = new Set<string>()
    const orderedExtras = [...paper.files.extra].sort((first, second) =>
      (extraFileOrder[String(first.type)] ?? Number.MAX_SAFE_INTEGER)
      - (extraFileOrder[String(second.type)] ?? Number.MAX_SAFE_INTEGER))
    return orderedExtras.flatMap((file): DirectoryPaperDownload[] => {
      const id = String(file.id)
      if (!hasExtraId(file.id) || seen.has(id) || (file.exist != null && !isAvailable(file.exist))) return []
      seen.add(id)
      const title = getExtraTitle(file)
      return [{
        type: `extra:${id}`,
        extraId: id,
        title,
        icon: extraFileIcons[String(file.type)]
          || (title.toLowerCase() === 'solved paper' ? 'md:import_contacts_outlined' : 'md:draft_outlined'),
        style: 'extra',
        price: getPrice(file.price),
      }]
    })
  }

  // Older cached responses still expose only Insert and Sound File flags.
  return [
    { type: 'in_file', title: 'Insert', available: paper.in_file, id: paper.in_file_id, icon: extraFileIcons['6351'] },
    { type: 'sf_file', title: 'Sound File', available: paper.sf_file, id: paper.sf_file_id, icon: extraFileIcons['6705'] },
  ].filter(file => isAvailable(file.available) && hasExtraId(file.id))
    .map<DirectoryPaperDownload>(file => ({
      type: file.type, extraId: String(file.id), title: file.title,
      icon: file.icon, style: 'extra', price: null,
    }))
}

export const getDirectoryPaperDownloads = (paper: DirectoryPaperFileSource): DirectoryPaperDownload[] => {
  const downloads: DirectoryPaperDownload[] = []
  const pdf = paper.files?.pdf
  const answer = paper.files?.answer
  if (isAvailable(pdf?.exist ?? paper.q_file)) {
    downloads.push({ type: 'pdf', title: 'Question Paper', icon: 'md:download', style: 'question', price: getPrice(pdf?.price) })
  }
  if (isAvailable(answer?.exist ?? paper.a_file)) {
    downloads.push({ type: 'answer', title: 'Mark Scheme', icon: 'md:check_box_outlined', style: 'answer', price: getPrice(answer?.price) })
  }
  downloads.push(...getExtraDownloads(paper))
  // Keep the existing right-to-left visual order after the row reverses this list.
  return downloads.reverse()
}

export const getDirectoryDownloadParams = (type: string, paper: DirectoryPaperFileSource): DirectoryDownloadParams | undefined => {
  const file = getDirectoryPaperDownloads(paper).find(item => item.type === type)
  if (!file) return undefined
  if (file.extraId) return { type: 'extra', extraId: file.extraId }
  if (file.type === 'pdf' || file.type === 'answer') return { type: file.type }
}
