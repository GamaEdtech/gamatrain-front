import type { FilesDTO, PastPaperDTO } from '@/types'
import { CAMBRIDGE_BOARD_ID } from '@/constants'

type CambridgeSessionSet = Record<string, { display: string, code: string }>

interface CambridgeFileType {
  code: string
  label: string
}

interface CambridgeMeta {
  titleSuffix: string
  description: string
}

// The three distinct Cambridge session patterns in use, defined once. Grades sharing an
// exam-window pattern below just reference the same object instead of repeating it.
const CAMBRIDGE_SESSION_FMJ_ON: CambridgeSessionSet = {
  3: { display: 'February March', code: 'F/M' },
  6: { display: 'May June', code: 'M/J' },
  11: { display: 'October November', code: 'O/N' },
}

const CAMBRIDGE_SESSION_MJ_ON: CambridgeSessionSet = {
  6: { display: 'May June', code: 'M/J' },
  11: { display: 'October November', code: 'O/N' },
}

const CAMBRIDGE_SESSION_QUARTERLY: CambridgeSessionSet = {
  3: { display: 'February March', code: 'F/M' },
  4: { display: 'April May', code: 'A/M' },
  5: { display: 'April May', code: 'A/M' },
  10: { display: 'October November', code: 'O/N' },
}

const CAMBRIDGE_SESSION_MAP: Record<string, CambridgeSessionSet> = {
  22: CAMBRIDGE_SESSION_FMJ_ON,
  4161: CAMBRIDGE_SESSION_FMJ_ON,
  6535: CAMBRIDGE_SESSION_FMJ_ON,
  23: CAMBRIDGE_SESSION_MJ_ON,
  6374: CAMBRIDGE_SESSION_MJ_ON,
  6533: CAMBRIDGE_SESSION_MJ_ON,
  6635: CAMBRIDGE_SESSION_QUARTERLY,
  6639: CAMBRIDGE_SESSION_QUARTERLY,
}

const CAMBRIDGE_FILENAME_SESSION_CODES: Record<string, string> = {
  'M/J': 's',
  'A/M': 's',
  'O/N': 'w',
  'F/M': 'm',
}

const CAMBRIDGE_EXTRA_FILE_TYPES: Record<string, CambridgeFileType> = {
  'insert': { code: 'in', label: 'insert' },
  'audio file': { code: 'sf', label: 'sound file (SF)' },
  'confidential instructions': { code: 'ci', label: 'confidential instructions' },
  'confidental instructions': { code: 'ci', label: 'confidential instructions' },
  'teacher\'s notes': { code: 'tn', label: 'teacher\'s notes' },
  'teacher notes': { code: 'tn', label: 'teacher\'s notes' },
  'transcript': { code: 'qr', label: 'transcript (QR)' },
  'map file': { code: 'i2', label: 'map file' },
  'pre released material': { code: 'pm', label: 'pre released material' },
}

const getCambridgeFilenameSessionCode = (seoSessionCode: string) =>
  CAMBRIDGE_FILENAME_SESSION_CODES[seoSessionCode]

const getCambridgeAvailableFiles = (
  files: FilesDTO | undefined,
  filenamePrefix: string,
  paperVariantCode: string,
) => {
  const availableFiles: string[] = []

  if (files?.pdf?.exist) {
    availableFiles.push(`question paper (QP) ${filenamePrefix}_qp_${paperVariantCode}`)
  }

  if (files?.answer?.exist && String(files.answer.ext).toLowerCase() !== 'word') {
    availableFiles.push(`mark scheme (MS) ${filenamePrefix}_ms_${paperVariantCode}`)
  }

  const addedExtraFileCodes = new Set<string>()

  for (const extraFile of files?.extra ?? []) {
    const normalizedTypeTitle = extraFile.type_title
      ?.trim()
      .toLowerCase()
      .replaceAll('’', '\'')

    if (!normalizedTypeTitle) continue

    const fileType = CAMBRIDGE_EXTRA_FILE_TYPES[normalizedTypeTitle]

    if (!fileType || addedExtraFileCodes.has(fileType.code)) continue

    availableFiles.push(`${fileType.label} ${filenamePrefix}_${fileType.code}_${paperVariantCode}`)
    addedExtraFileCodes.add(fileType.code)
  }

  return availableFiles.length > 0 ? availableFiles : null
}

/**
 * Builds the Cambridge-specific SEO title suffix ("0580/12/M/J/24") and meta description for a
 * past-paper page, by parsing subject/paper identifiers out of the paper's display fields and
 * looking up its exam session from CAMBRIDGE_SESSION_MAP. Returns null whenever the paper isn't
 * on the Cambridge board, or any required field fails to parse - callers should fall back to
 * their own generic title/description in that case.
 */
export function useCambridgeSeo() {
  const buildCambridgeMeta = (dto: PastPaperDTO): CambridgeMeta | null => {
    const {
      section,
      base,
      lesson_title,
      test_type_title,
      edu_year,
      edu_month,
      variant_title,
      base_title,
      files,
    } = dto

    if (String(section) !== String(CAMBRIDGE_BOARD_ID)) return null

    const subjectMatch = lesson_title?.trim().match(/^(.+?)\s*\((\d{4})\)$/)
    const paperMatch = test_type_title?.trim().match(/^Paper\s+(\d+)/)
    const normalizedYear = edu_year?.trim() ?? ''
    const normalizedMonth = Number(edu_month)
    const session = Number.isNaN(normalizedMonth)
      ? undefined
      : CAMBRIDGE_SESSION_MAP[String(base)]?.[String(normalizedMonth)]
    const gradeTitle = base_title?.trim()

    if (!subjectMatch || !paperMatch || !/^\d{4}$/.test(normalizedYear) || !session || !gradeTitle) {
      return null
    }

    const [, subjectName, subjectCode] = subjectMatch
    const paperNumber = paperMatch[1]
    const normalizedVariantTitle = variant_title?.trim() ?? ''
    const paperVariantCode = /^\d+$/.test(normalizedVariantTitle)
      ? `${paperNumber}${Number(normalizedVariantTitle)}`
      : paperNumber.padStart(2, '0')
    const shortYear = normalizedYear.slice(-2)

    const titleSuffix = `${subjectCode}/${paperVariantCode}/${session.code}/${shortYear}`

    let description = `Download Cambridge ${gradeTitle} ${subjectName} ${subjectCode}/${paperVariantCode} ${session.display} ${normalizedYear} question paper(QP) with mark scheme (MS) pdf. Access paper ${paperNumber}, ${subjectCode}/${paperVariantCode}/${session.code}/${shortYear} question paper pdf with answers for your upcoming exam series preparation.`

    const filenameSessionCode = getCambridgeFilenameSessionCode(session.code)

    if (filenameSessionCode) {
      const filenamePrefix = `${subjectCode}_${filenameSessionCode}${shortYear}`
      const availableFiles = getCambridgeAvailableFiles(files, filenamePrefix, paperVariantCode)

      if (availableFiles) {
        description = `Download ${subjectCode}/${paperVariantCode}/${session.code}/${shortYear} Cambridge ${gradeTitle} ${subjectName.trim()} ${subjectCode}/${paperVariantCode} Paper ${paperNumber} ${session.display} ${normalizedYear} past paper. In this page you can find ${availableFiles.join(', ')} pdfs available for your upcoming exam series preparation.`
      }
    }

    return { titleSuffix, description }
  }

  return {
    buildCambridgeMeta,
  }
}
