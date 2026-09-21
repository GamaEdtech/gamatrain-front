// Keep the classification/variant rule used by the original directory table.
export const getDirectoryPaperTitle = paper =>
  paper.variant && String(paper.variant) !== '0'
    ? `${paper.test_type_title || ''}${paper.variant_title === 'nv' ? '' : paper.variant_title || ''}`
    : paper.test_type_title || paper.title || 'Past paper'

export const getDirectoryPaperCode = (paper, subjectTitle = '') => {
  // The same syllabus-code convention used by useCambridgeSeo. Do not invent a
  // code for boards whose payload/title does not provide one.
  const code = (paper.lesson_title || subjectTitle).match(/\((\d{4})\)\s*$/)?.[1]
  const number = getDirectoryPaperTitle(paper).match(/^Paper\s+(\w+)$/)?.[1]
  if (code && number) return `${code}/${number}`
  return paper.title?.match(/\b\d{4}\/\w+\b/)?.[0] || ''
}

export const getDirectoryPaperLink = paper => `/paper/${paper.id}/${paper.title_url || ''}`

export const getDirectoryExamIds = (value) => {
  try {
    const ids = Array.isArray(value) ? value : JSON.parse(value || '[]')
    return Array.isArray(ids)
      ? [...new Set(ids.map(String).filter(id => /^[1-9]\d*$/.test(id)))]
      : []
  }
  catch {
    return []
  }
}

const isAvailable = value => value === true || value === 1 || value === '1'
const hasExtraId = value => /^[1-9]\d*$/.test(String(value))

// Left-to-right order from Figma. Unsupported extra types are deliberately
// omitted until the directory list endpoint exposes their availability and IDs.
const DOWNLOADS = [
  { type: 'sf_file', flag: 'sf_file', extraId: 'sf_file_id', title: 'Sound File', icon: 'md:volume_up_outlined', style: 'extra' },
  { type: 'in_file', flag: 'in_file', extraId: 'in_file_id', title: 'Insert', icon: 'md:attach_file', style: 'extra' },
  { type: 'answer', flag: 'a_file', title: 'Mark Scheme', icon: 'md:check_box_outlined', style: 'answer' },
  { type: 'pdf', flag: 'q_file', title: 'Question Paper', icon: 'md:download', style: 'question' },
]

export const getDirectoryPaperDownloads = paper => DOWNLOADS.filter(file =>
  isAvailable(paper[file.flag]) && (!file.extraId || hasExtraId(paper[file.extraId])),
)

export const getDirectoryDownloadParams = (type, paper) => {
  const file = DOWNLOADS.find(item => item.type === type)
  return file?.extraId ? { type: 'extra', extraId: String(paper[file.extraId]) } : { type }
}

export const getDirectorySessionKey = query => JSON.stringify([
  String(query.lesson), String(query.edu_year), String(query.edu_month),
  String(query.test_type || ''), String(query.variant || ''),
])
