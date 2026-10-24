import { MONTH_LIST, YEAR_LIST } from './index'

// Shared with Search: these are supported exam sessions, not availability facets.
export const PAST_PAPER_YEAR_OPTIONS = YEAR_LIST.map(id => ({ id, title: String(id) }))

export const PAST_PAPER_MONTHS_BY_GRADE: Record<string, { id: number, title: string }[]> = {
  4161: [
    { id: 3, title: 'March' },
    { id: 6, title: 'May/Jun' },
    { id: 11, title: 'Oct/Nov' },
  ],
  22: [
    { id: 3, title: 'March' },
    { id: 6, title: 'May/Jun' },
    { id: 11, title: 'Oct/Nov' },
  ],
  6374: [
    { id: 6, title: 'May/Jun' },
    { id: 11, title: 'Oct/Nov' },
  ],
  23: [
    { id: 6, title: 'May/Jun' },
    { id: 11, title: 'Oct/Nov' },
  ],
  6533: [
    { id: 6, title: 'May/Jun' },
    { id: 11, title: 'Oct/Nov' },
  ],
  6635: [
    { id: 3, title: 'March' },
    { id: 4, title: 'April' },
    { id: 5, title: 'May' },
    { id: 10, title: 'October' },
  ],
  6639: [
    { id: 3, title: 'March' },
    { id: 4, title: 'April' },
    { id: 5, title: 'May' },
    { id: 10, title: 'October' },
  ],
  // AQA-GCSE
  6672: [
    { id: 6, title: 'June' },
    { id: 11, title: 'November' },
  ],
  // AQA-AS LEVEL
  6673: [{ id: 6, title: 'June' }],
  // AQA-A LEVEL
  6674: [{ id: 6, title: 'June' }],
  // OCR GCSE
  6676: [
    { id: 6, title: 'June' },
    { id: 11, title: 'November' },
  ],
  // OCR AS LEVEL
  6677: [
    { id: 6, title: 'June' },
    { id: 11, title: 'Oct/Nov' },
  ],
  // OCR A LEVEL
  6678: [
    { id: 6, title: 'June' },
    { id: 11, title: 'Oct/Nov' },
  ],
  // Edexcel A LEVEL
  6671: [
    { id: 6, title: 'May/Jun' },
    { id: 11, title: 'Oct/Nov' },
  ],
  // Edexcel AS LEVEL
  6675: [
    { id: 6, title: 'May/Jun' },
    { id: 11, title: 'Oct/Nov' },
  ],
  // Edexcel GCSE
  6669: [
    { id: 6, title: 'May/Jun' },
    { id: 11, title: 'Oct/Nov' },
  ],
  // Edexcel International A/AS LEVEL
  6670: [
    { id: 1, title: 'January' },
    { id: 4, title: 'April' },
    { id: 6, title: 'June' },
    { id: 10, title: 'October' },
    { id: 11, title: 'November' },
  ],
  // Edexcel International GCSE
  6668: [
    { id: 1, title: 'January' },
    { id: 4, title: 'April' },
    { id: 6, title: 'June' },
    { id: 10, title: 'October' },
    { id: 11, title: 'November' },
  ],
}

export const getPastPaperMonths = (gradeId?: string | number) =>
  PAST_PAPER_MONTHS_BY_GRADE[String(gradeId)] ?? MONTH_LIST

const DIRECTORY_SESSION_TITLES: Record<string, string> = {
  'Feb/Mar': 'February/March',
  'May/Jun': 'May/June',
  'Oct/Nov': 'October/November',
}

// Directory sessions run from newest to oldest. Cambridge's March API value
// represents the combined February/March examination series.
export const getDirectoryPaperSessions = (gradeId?: string | number) => {
  const months = getPastPaperMonths(gradeId)
  const isCambridge = ['22', '4161', '6374', '23', '6533'].includes(String(gradeId))

  return [...months]
    .sort((first, second) => second.id - first.id)
    .map(month => ({
      ...month,
      title: isCambridge && month.id === 3
        ? 'February/March'
        : DIRECTORY_SESSION_TITLES[month.title] || month.title,
    }))
}
