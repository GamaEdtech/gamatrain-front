import { contentPath } from './contentPath.ts'

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
  const paperCode = code && number ? `${code}/${number}` : paper.title?.match(/\b\d{4}\/\w+\b/)?.[0] || ''
  const variantTitle = String(paper.variant_title || '').trim().toLowerCase()
  const hasVariant = paper.variant && String(paper.variant) !== '0' && variantTitle && variantTitle !== 'nv'
  return hasVariant ? paperCode : paperCode.replace(/\/(\d)$/, '/0$1')
}

export const getDirectoryPaperLink = paper => contentPath('paper', paper.id, paper.title_url)

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

export { getDirectoryPaperDownloads, getDirectoryDownloadParams } from './directoryPaperFiles.ts'

export const getDirectorySessionKey = query => JSON.stringify([
  String(query.lesson), String(query.edu_year), String(query.edu_month),
  String(query.test_type || ''), String(query.variant || ''),
])
