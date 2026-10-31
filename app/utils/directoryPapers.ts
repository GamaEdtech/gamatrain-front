import { contentPath } from './contentPath'
import type {
  DirectoryPaper,
  DirectoryPaperDownload,
  DirectoryPaperList,
  DirectoryPaperResponse,
  DirectoryYearGroup,
} from '../types/subject-directory'

// Keep the classification/variant rule used by the original directory table.
export const getDirectoryPaperTitle = (paper: DirectoryPaper): string =>
  paper.variant && String(paper.variant) !== '0'
    ? `${paper.test_type_title || ''}${paper.variant_title === 'nv' ? '' : paper.variant_title || ''}`
    : paper.test_type_title || paper.title || 'Past paper'

export const getDirectoryPaperCode = (paper: DirectoryPaper, subjectTitle = ''): string => {
  // The same syllabus-code convention used by useCambridgeSeo. Do not invent a
  // code for boards whose payload/title does not provide one.
  const code = (paper.lesson_title || subjectTitle).match(/\((\d{4})\)\s*$/)?.[1]
  const number = getDirectoryPaperTitle(paper).match(/^Paper\s+(\w+)$/)?.[1]
  const paperCode = code && number ? `${code}/${number}` : paper.title?.match(/\b\d{4}\/\w+\b/)?.[0] || ''
  const variantTitle = String(paper.variant_title || '').trim().toLowerCase()
  const hasVariant = paper.variant && String(paper.variant) !== '0' && variantTitle && variantTitle !== 'nv'
  return hasVariant ? paperCode : paperCode.replace(/\/(\d)$/, '/0$1')
}

export const getDirectoryPaperLink = (paper: DirectoryPaper): string => contentPath('paper', paper.id, paper.title_url)

// The API returns no exam slug, so the link is the id path; contentPath adds the
// slug once the API provides one.
export const getDirectoryExamLink = (examId: string): string => contentPath('exam', examId)

export const getDirectoryExamIds = (value: DirectoryPaper['exam_id']): string[] => {
  try {
    const ids: unknown = Array.isArray(value) ? value : JSON.parse(value || '[]')
    return Array.isArray(ids)
      ? [...new Set(ids.map(String).filter(id => /^[1-9]\d*$/.test(id)))]
      : []
  }
  catch {
    return []
  }
}

export const createDirectoryPaperList = (): DirectoryPaperList => ({
  items: [], page: 0, total: null, hasMore: true, loaded: false, loading: false, error: false,
})

// Add one API page to the list, skipping papers already shown and stopping at the total.
export const appendDirectoryPapers = (list: DirectoryPaperList, response: DirectoryPaperResponse, pageSize: number) => {
  if (Number(response?.status) !== 1 || !Array.isArray(response?.data?.list)) {
    throw new Error('Invalid directory response')
  }
  const page = response.data.list
  const known = new Set(list.items.map(item => String(item.id)))
  list.items.push(...page.filter(item => !known.has(String(item.id))))
  list.page++
  const total = Number(response.data.num)
  list.total = response.data.num != null && Number.isFinite(total) ? total : null
  list.loaded = true
  list.hasMore = page.length > 0 && (list.total === null ? page.length === pageSize : list.items.length < list.total)
}

const monthName = (month: number) => new Date(2000, month - 1, 1).toLocaleString('en', { month: 'long' })

// Group papers (already newest first from the API) into years and sessions.
// Session titles come from the grade's session list, e.g. Cambridge's February/March.
export const groupDirectoryPapers = (
  papers: DirectoryPaper[],
  sessions: readonly { id: number, title: string }[],
): DirectoryYearGroup[] => {
  const sessionTitles = new Map(sessions.map(session => [session.id, session.title]))
  const years = new Map<number, Map<number, DirectoryPaper[]>>()
  for (const paper of papers) {
    const year = Number(paper.edu_year)
    const month = Number(paper.edu_month)
    if (!year || !month) continue
    const months = years.get(year) ?? years.set(year, new Map()).get(year)!
    const group = months.get(month) ?? months.set(month, []).get(month)!
    group.push(paper)
  }
  return [...years.entries()]
    .sort(([first], [second]) => second - first)
    .map(([year, months]) => ({
      id: year,
      title: String(year),
      sessions: [...months.entries()]
        .sort(([first], [second]) => second - first)
        .map(([month, group]) => ({ id: month, title: sessionTitles.get(month) || monthName(month), papers: group })),
    }))
}

// Design labels and icons for the extra file types, by API type id.
const extraFileIcons: Record<string, string> = {
  6351: 'md:attach_file',
  6705: 'md:volume_up_outlined',
  8043: 'md:import_contacts_outlined',
}

const extraFileShortTitles: Record<string, string> = {
  6351: 'IN',
  6705: 'SF',
  8043: 'Solved',
  10517: 'CI',
  10519: 'QR',
  10520: 'TN',
  10560: 'I2',
  10561: 'PM',
}

// Design order after Question Paper and Mark Scheme.
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

const toPrice = (value: number | string | null | undefined): number | null =>
  value == null || value === '' ? null : Number(value)

export const getDirectoryPaperDownloads = (paper: DirectoryPaper): DirectoryPaperDownload[] => {
  const { pdf, answer, extra } = paper.files ?? {}
  const downloads: DirectoryPaperDownload[] = []
  if (pdf?.exist) {
    downloads.push({ type: 'pdf', title: 'Question Paper', shortTitle: 'Paper', icon: 'md:download', style: 'question', price: toPrice(pdf.price) })
  }
  if (answer?.exist) {
    downloads.push({ type: 'answer', title: 'Mark Scheme', shortTitle: 'MS', icon: 'md:check_box_outlined', style: 'answer', price: toPrice(answer.price) })
  }
  const extras = [...(extra ?? [])].sort((first, second) =>
    (extraFileOrder[String(first.type)] ?? Number.MAX_SAFE_INTEGER) - (extraFileOrder[String(second.type)] ?? Number.MAX_SAFE_INTEGER))
  for (const file of extras) {
    const title = file.type_title || 'Extra File'
    downloads.push({
      type: `extra:${file.id}`,
      extraId: String(file.id),
      title,
      shortTitle: extraFileShortTitles[String(file.type)] || title,
      icon: extraFileIcons[String(file.type)] || 'md:draft_outlined',
      style: 'extra',
      price: toPrice(file.price),
    })
  }
  return downloads
}
