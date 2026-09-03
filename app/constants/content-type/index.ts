export const CONTENT_TYPE_META = {
  pastPaper: {
    key: 'pastPaper',
    type: 'paper',
    title: 'Past Papers',
    singularTitle: 'Past Paper',
    icon: 'icon-paper',
    color: '#2e90fa',
    searchLink: '/search?type=paper',
    manageLink: '/user/paper',
    createLink: '/user/paper/create',
  },
  multimedia: {
    key: 'multimedia',
    type: 'multimedia',
    title: 'Multimedia',
    singularTitle: 'Multimedia',
    icon: 'icon-multimedia',
    color: '#02b719',
    searchLink: '/search?type=multimedia',
    manageLink: '/user/multimedia',
    createLink: '/user/multimedia/create',
  },
  exam: {
    key: 'exam',
    type: 'exam',
    title: 'QuizHub',
    singularTitle: 'Exam',
    icon: 'icon-exam',
    color: '#7c4dff',
    searchLink: '/search?type=quizhub',
    manageLink: '/test-maker',
    createLink: '/test-maker/create',
  },
  forum: {
    key: 'forum',
    type: 'forum',
    title: 'Forum',
    singularTitle: 'Forum',
    icon: 'icon-q-a',
    color: '#fdb022',
    searchLink: '/search?type=forum',
    manageLink: '/user/question',
    createLink: '/user/question/create',
  },
  tutorial: {
    key: 'tutorial',
    type: 'tutorial',
    title: 'Tutorial',
    singularTitle: 'Tutorial',
    icon: 'icon-tutorial',
    color: '#2e90fa',
    searchLink: '/search?type=tutorial',
  },
  teacher: {
    key: 'teacher',
    type: 'teacher',
    title: 'Teacher',
    singularTitle: 'Teacher',
    icon: 'icon-teacher',
    color: '#7f56d9',
    searchLink: '/search?type=tutor',
  },
  school: {
    key: 'school',
    type: 'school',
    title: 'School',
    singularTitle: 'School',
    icon: 'icon-school',
    color: '#a5673f',
    searchLink: '/school',
    createLink: '/school/add',
  },
} as const

export const CONTENT_TYPE_ALIASES = {
  paper: 'pastPaper',
  pastpaper: 'pastPaper',
  past_paper: 'pastPaper',
  pastPaper: 'pastPaper',
  multimedia: 'multimedia',
  exam: 'exam',
  quizhub: 'exam',
  forum: 'forum',
  qa: 'forum',
  question: 'forum',
  tutorial: 'tutorial',
  teacher: 'teacher',
  tutor: 'teacher',
  school: 'school',
} as const

export type ContentTypeKey = keyof typeof CONTENT_TYPE_META
export type ContentTypeAlias = keyof typeof CONTENT_TYPE_ALIASES
export type ContentTypeMeta = typeof CONTENT_TYPE_META[ContentTypeKey]

export const CONTENT_TYPE_LIST = Object.values(CONTENT_TYPE_META)

export const getContentTypeMeta = (
  type: ContentTypeKey | ContentTypeAlias | string,
): ContentTypeMeta | undefined => {
  const normalizedType = type as ContentTypeAlias
  const contentTypeKey = CONTENT_TYPE_ALIASES[normalizedType]

  if (contentTypeKey) {
    return CONTENT_TYPE_META[contentTypeKey]
  }

  return CONTENT_TYPE_META[type as ContentTypeKey]
}
