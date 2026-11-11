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
    title: 'Online Exams with Instant Results',
    text: 'Exams by board, grade and subject.',
    points: ['Score the moment you finish', 'Points for correct answers'],
    action: 'Start an exam',
    link: '/search?type=quizhub',
    image: '/images/online-exam-quiz.webp',
    imageSmall: '/images/online-exam-quiz-sm.webp',
    width: 720,
    smallWidth: 480,
    height: 384,
    sizes: '(max-width: 1279px) 490px, 380px',
    alt: 'Quiz answers with the correct one ticked and a +10 points star',
  },
  {
    id: 'analysis',
    title: 'Exam Performance Analysis',
    text: 'Review every answer and your rank.',
    points: ['Country and state rank', 'AI study advice'],
    action: 'See my results',
    link: '/user/exam/result/list',
    image: '/images/exam-analysis-path.webp',
    imageSmall: '/images/exam-analysis-path-sm.webp',
    width: 720,
    smallWidth: 480,
    height: 459,
    sizes: '(max-width: 1279px) 490px, 380px',
    alt: 'The Gama robot turning a wrong answer into a study path to the goal',
  },
]
