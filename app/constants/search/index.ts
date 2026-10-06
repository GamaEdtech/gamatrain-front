import type { GeneralSearchCategory, SearchServiceId, SearchServiceOption } from '@/types/search'

export const EDEXCEL_BOARD_CODE = 6657

export const SEARCH_SERVICE_OPTIONS = [
  {
    id: 'paper',
    legacyApiType: 'test',
    title: 'Past Papers',
    shortTitle: 'Papers',
    icon: 'stat-icon icon-paper',
    isPaper: true,
  },
  {
    id: 'study-materials',
    legacyApiType: 'test',
    title: 'Study Materials',
    shortTitle: 'Study',
    icon: 'stat-icon icon-study-materials',
    isPaper: false,
  },
  {
    id: 'quizhub',
    legacyApiType: 'azmoon',
    title: 'Exam Hub',
    shortTitle: 'Exam',
    icon: 'stat-icon icon-exam',
    isPaper: null,
  },
  {
    id: 'tutorial',
    legacyApiType: 'dars',
    title: 'Tutorial',
    shortTitle: 'Tutorial',
    icon: 'stat-icon icon-tutorial',
    isPaper: null,
  },
] satisfies SearchServiceOption[]

export const DEFAULT_SEARCH_SERVICE = SEARCH_SERVICE_OPTIONS[0]

export const SEARCH_SERVICE_TITLE_SUFFIXES: Partial<Record<SearchServiceId, string>> = {
  'paper': 'Past Papers',
  'study-materials': 'Study Materials',
  'quizhub': 'Exams',
  'tutorial': 'Revision notes',
}

export const LEGACY_SEARCH_TYPES = ['test', 'learnfiles', 'azmoon', 'question', 'dars']

export const GENERAL_SEARCH_CATEGORIES = [
  {
    title: 'Past Papers',
    value: 'Past Papers',
    api: '/api/v1/search',
    apiParams: { type: 'test' },
    type: 'paper',
    typePaper: 'paper',
    isOldApi: true,
    keywordSearch: 'title',
    iconName: 'icon-paper',
    colorClass: 'bg-generalSearchPaper',
    activeColorClass: 'bg-generalSearchPaperActive',
  },
  {
    title: 'Study Materials',
    value: 'Study Materials',
    api: '/api/v1/search',
    apiParams: { type: 'test', is_paper: 0, noTypesStats: 1 },
    type: 'paper',
    typePaper: 'paper',
    searchType: 'study-materials',
    isOldApi: true,
    keywordSearch: 'title',
    iconName: 'icon-study-materials',
    colorClass: 'bg-greenLight700',
    activeColorClass: 'bg-generalSearchStudyMaterialsActive',
  },
  {
    title: 'Exam Hub',
    value: 'Exam Hub',
    api: '/api/v1/search',
    apiParams: { type: 'azmoon' },
    type: 'paper',
    typePaper: 'exam',
    searchType: 'quizhub',
    isOldApi: true,
    keywordSearch: 'title',
    iconName: 'icon-exam',
    colorClass: 'bg-generalSearchQuiz',
    activeColorClass: 'bg-generalSearchQuizActive',
  },
  {
    title: 'Tutorial',
    value: 'Tutorial',
    api: '/api/v1/search',
    apiParams: { type: 'dars' },
    type: 'paper',
    typePaper: 'tutorial',
    isOldApi: true,
    keywordSearch: 'title',
    iconName: 'icon-tutorial',
    colorClass: 'bg-blue500',
    activeColorClass: 'bg-generalSearchTutorialActive',
  },
  {
    title: 'Teacher',
    value: 'Teacher',
    api: '/api/v2/identities/profiles/list',
    type: 'teacher',
    isOldApi: false,
    keywordSearch: 'FullName',
    iconName: 'icon-teacher',
    colorClass: 'bg-generalSearchTeacher',
    activeColorClass: 'bg-generalSearchTeacherActive',
  },
  {
    title: 'School',
    value: 'School',
    api: '/api/v2/schools',
    type: 'school',
    isOldApi: false,
    keywordSearch: 'Name',
    iconName: 'icon-school',
    colorClass: 'bg-generalSearchSchool',
    activeColorClass: 'bg-generalSearchSchoolActive',
  },
  {
    title: 'Post',
    value: 'Post',
    api: '/api/v2/posts',
    type: 'post',
    isOldApi: false,
    keywordSearch: 'Title',
    iconName: 'icon-student',
    colorClass: 'bg-generalSearchBlog',
    activeColorClass: 'bg-generalSearchBlogActive',
  },
] satisfies GeneralSearchCategory[]

export const MOBILE_GENERAL_SEARCH_CATEGORIES = GENERAL_SEARCH_CATEGORIES
export const DESKTOP_GENERAL_SEARCH_CATEGORIES = GENERAL_SEARCH_CATEGORIES

export const ALL_SEARCH_MONTHS = [
  { id: 1, title: 'January' },
  { id: 2, title: 'February' },
  { id: 3, title: 'March' },
  { id: 4, title: 'April' },
  { id: 5, title: 'May' },
  { id: 6, title: 'June' },
  { id: 7, title: 'July' },
  { id: 8, title: 'August' },
  { id: 9, title: 'September' },
  { id: 10, title: 'October' },
  { id: 11, title: 'November' },
  { id: 12, title: 'December' },
]

export const SEARCH_MONTHS_BY_LEVEL: Record<number, { id: number, title: string }[]> = {
  22: [
    { id: 3, title: 'March' },
    { id: 6, title: 'May/Jun' },
    { id: 11, title: 'Oct/Nov' },
  ],
  23: [
    { id: 6, title: 'May/Jun' },
    { id: 11, title: 'Oct/Nov' },
  ],
  4161: [
    { id: 3, title: 'March' },
    { id: 6, title: 'May/Jun' },
    { id: 11, title: 'Oct/Nov' },
  ],
  6374: [
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
  6668: [
    { id: 1, title: 'January' },
    { id: 4, title: 'April' },
    { id: 6, title: 'June' },
    { id: 10, title: 'October' },
    { id: 11, title: 'November' },
  ],
  6669: [
    { id: 6, title: 'May/Jun' },
    { id: 11, title: 'Oct/Nov' },
  ],
  6670: [
    { id: 1, title: 'January' },
    { id: 4, title: 'April' },
    { id: 6, title: 'June' },
    { id: 10, title: 'October' },
    { id: 11, title: 'November' },
  ],
  6671: [
    { id: 6, title: 'May/Jun' },
    { id: 11, title: 'Oct/Nov' },
  ],
  6672: [
    { id: 6, title: 'June' },
    { id: 11, title: 'November' },
  ],
  6673: [{ id: 6, title: 'June' }],
  6674: [{ id: 6, title: 'June' }],
  6675: [
    { id: 6, title: 'May/Jun' },
    { id: 11, title: 'Oct/Nov' },
  ],
  6676: [
    { id: 6, title: 'June' },
    { id: 11, title: 'November' },
  ],
  6677: [
    { id: 6, title: 'June' },
    { id: 11, title: 'Oct/Nov' },
  ],
  6678: [
    { id: 6, title: 'June' },
    { id: 11, title: 'Oct/Nov' },
  ],
}

export const SEARCH_BOARD_ICON_BY_TITLE: Record<string, string> = {
  Cambridge: 'CIE',
  Edexcel: 'Edexcel',
  AQA: 'AQA',
  OCR: 'OCR',
  GAMA: 'GAMA',
  CXC: 'CXC',
  Nigerian: 'Nijeria',
}
