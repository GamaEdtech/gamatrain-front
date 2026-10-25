import type { ExamPageDetailDTO } from '@/types'
import { contentPath } from '@/utils/contentPath'

// The exam page's title, H1 and meta description, worded the way people search.
// Search Console (2026-07 to 2026-10): on past-paper pages "free", "pdf", "download" and "answers" in a title
// earned the most clicks per page, "quiz", "topical" and the bare "Oct"/"Nov" the least; exam titles used only
// the weak words ("061012-Biology-Oct-Nov-2021-Online-Test-Cambridge-IGCSE-MCQ").

export interface ExamSeoText {
  /** For `<title>`; the site name is added by the app's title template. */
  title: string
  /** For the H1: the same promise, without the site name. */
  heading: string
  description: string
}

const DESCRIPTION_LIMIT = 155

// Trailing words gama-api titles repeat that the new suffix says better ("... Online Test | Cambridge IGCSE MCQ").
const NOISE = /\s*[-–|:]?\s*(?:online (?:test|exam)|topical quiz|quiz|test|mcq|tests)\s*$/i

const BOARD_TAIL = /\b(?:cambridge|igcse|gcse|a[ -]level|as level|aqa|ocr|edexcel|mcq|online (?:test|exam))\b/i

// The exam's own title without the board/format tail and the repeated format words.
export const cleanExamTitle = (title: string): string => {
  // A slug-like title ("061012-Biology-Oct-Nov-2021-...") reads as words once its dashes are spaces.
  const spaced = title.includes(' ') ? title : title.replace(/-+/g, ' ')
  // " | " ends a board/format tail ("... | Cambridge IGCSE MCQ") in some titles and starts the topic in others
  // ("Mathematics 5 | Angles - Topical Quiz"): drop only the tail.
  let clean = spaced.split(' | ').map(part => part.trim()).filter((part, index) => index === 0 || !BOARD_TAIL.test(part)).join(': ')
  for (let previous = ''; previous !== clean;) {
    previous = clean
    clean = clean.replace(NOISE, '').trim()
  }
  return clean || title.trim()
}

const cut = (text: string, limit: number): string => {
  if (text.length <= limit) return text
  const head = text.slice(0, limit - 1)
  return `${head.slice(0, Math.max(head.lastIndexOf(' '), 0)).replace(/[\s,.;:–-]+$/, '')}…`
}

export const buildExamSeoText = (exam: ExamPageDetailDTO): ExamSeoText => {
  const paper = exam.paper?.isPastPaper ? exam.paper : null
  const online = Boolean(exam.price?.participation)
  const free = online && !Number(exam.price.participation.price)
  const questions = Number(exam.tests_num) || 0
  const minutes = Number(exam.azmoon_time) || 0

  // A past paper's own title is the clean "Accounting 0452/11 Oct Nov 2024"; an exam title is often slug-like.
  const subject = paper?.title.trim() || cleanExamTitle(exam.title)
  const kind = paper && !/past paper/i.test(subject) ? ' Past Paper' : ''
  const format = online
    ? `${free ? 'Free ' : ''}${paper ? 'Online Test' : 'Practice Quiz'} with Answers`
    : 'Questions with Answers'
  const heading = `${subject}${kind} – ${format}`

  const facts = [questions ? `${questions} questions` : '', minutes ? `${minutes} min` : ''].filter(Boolean).join(', ')
  const description = [
    `${subject}${kind}${facts ? `: ${facts}` : ''}.`,
    online
      ? `Take it ${free ? 'free ' : ''}online for your score, rank and the correct answers.`
      : 'Every question with its correct answer.',
    'PDF, Word and PowerPoint too.',
  ].join(' ')

  return { title: heading, heading, description: cut(description, DESCRIPTION_LIMIT) }
}

const SITE_URL = 'https://gamatrain.com'

export const formatExamCount = (value: number) => value.toLocaleString('en-US')

// Plain text of question or option HTML, for structured data.
const htmlToPlainText = (html?: string | null) =>
  (html ?? '').replace(/<[^>]*>/g, ' ').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim()

// gama-api's "2025-03-09 08:08:48" as an ISO date, or undefined.
const toIsoDate = (value?: string) => {
  const date = value ? new Date(value.replace(' ', 'T')) : null
  return date && !Number.isNaN(date.getTime()) ? date.toISOString() : undefined
}

// The fields of the page's Quiz node (merged over the LearningResource node by useSeoSchema().buildSchema):
// the sample questions without their answers, the paper it's based on, how often it's viewed and taken.
export const examQuizSchema = (exam: ExamPageDetailDTO): Record<string, unknown> => {
  const minutes = Number(exam.azmoon_time) || 0
  const author = [exam.first_name, exam.last_name].filter(Boolean).join(' ')
  return {
    '@type': 'Quiz',
    'learningResourceType': 'Practice exam',
    'educationalUse': 'Assessment',
    'teaches': exam.lesson_title?.trim() || undefined,
    'educationalLevel': exam.base_title?.trim() || undefined,
    'image': exam.thumb_pic_url || undefined,
    'timeRequired': minutes ? `PT${minutes}M` : undefined,
    'datePublished': toIsoDate(exam.subdate),
    'dateModified': toIsoDate(exam.up_date),
    'isAccessibleForFree': exam.price?.participation ? !Number(exam.price.participation.price) : undefined,
    ...(author && { author: { '@type': 'Person', 'name': author } }),
    ...(exam.paper && {
      isBasedOn: {
        '@type': 'CreativeWork',
        'name': exam.paper.title,
        'url': `${SITE_URL}${contentPath('paper', exam.paper.id, exam.paper.slug)}`,
      },
    }),
    'interactionStatistic': [
      { '@type': 'InteractionCounter', 'interactionType': 'https://schema.org/ViewAction', 'userInteractionCount': Number(exam.views) || 0 },
      { '@type': 'InteractionCounter', 'interactionType': 'https://schema.org/InteractAction', 'userInteractionCount': Number(exam.participants_num) || 0 },
    ],
    ...(exam.sampleQuestions.length && {
      hasPart: exam.sampleQuestions.map(question => ({
        '@type': 'Question',
        'eduQuestionType': 'Multiple choice',
        'text': htmlToPlainText(question.question) || undefined,
        'url': `${SITE_URL}${contentPath('test', question.code || question.id)}`,
        'suggestedAnswer': question.options
          .map((option, index) => ({ '@type': 'Answer', 'position': index + 1, 'text': htmlToPlainText(option.text) }))
          .filter(answer => answer.text),
      })),
    }),
  }
}
