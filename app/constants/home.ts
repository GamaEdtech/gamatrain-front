export const HOME_SEARCH_TYPES = [
  { value: 'quizhub', title: 'Online Exams', shortTitle: 'Exams', icon: 'mdi-timer-outline', action: 'Find exams' },
  { value: 'paper', title: 'Past Papers', shortTitle: 'Papers', icon: 'mdi-file-document-outline', action: 'Find papers' },
  { value: 'study-materials', title: 'Study Materials', shortTitle: 'Study', icon: 'mdi-book-open-variant', action: 'Find materials' },
  { value: 'tutorial', title: 'Tutorials', shortTitle: 'Tutorials', icon: 'mdi-play-circle-outline', action: 'Find tutorials' },
]

export const HOME_POPULAR_SEARCHES = ['Biology', 'Physics', 'Mathematics', 'English']

export const HOME_EXAM_STEPS = [
  { title: 'Take an exam', icon: 'mdi-timer-outline' },
  { title: 'Earn points', icon: 'mdi-star-circle-outline' },
  { title: 'Unlock AI analysis', icon: 'mdi-creation' },
]

export const HOME_EXAM_CARDS = [
  {
    id: 'exam',
    title: 'Online Exam',
    text: 'Exams by board, grade and subject.',
    points: ['Score the moment you finish', 'Points for correct answers'],
    action: 'Start an exam',
    link: '/search?type=quizhub',
    image: '/images/online-exam.webp',
    imageSmall: '/images/online-exam-sm.webp',
    width: 700,
    smallWidth: 430,
    height: 849,
    sizes: '(max-width: 1279px) 214px, 285px',
    alt: 'A student taking an online exam on a laptop',
  },
  {
    id: 'analysis',
    title: 'Exam Analysis',
    text: 'Review every answer and your rank.',
    points: ['Country and state rank', 'AI study advice'],
    action: 'See my results',
    link: '/user/exam/result/list',
    image: '/images/exam-analysis.webp',
    imageSmall: '/images/exam-analysis-sm.webp',
    width: 760,
    smallWidth: 560,
    height: 558,
    sizes: '(max-width: 1279px) 280px, 310px',
    alt: 'The Gama robot next to exam charts and a trophy',
  },
]
