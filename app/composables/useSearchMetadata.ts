import type { FilterTitles, SearchMetadataOptions, SearchQuery } from '@/types/search'
import dayjs from 'dayjs'
import { SEARCH_MONTHS_BY_LEVEL, SEARCH_SERVICE_TITLE_SUFFIXES } from '@/constants'
import { getLegacySearchType } from '@/utils/searchServices'

export const useSearchMetadata = ({
  activeService,
  data,
}: SearchMetadataOptions) => {
  const route = useRoute()
  const appliedFilterTitles = ref<{ query: SearchQuery, titles: FilterTitles }>({
    query: {},
    titles: {},
  })

  const setAppliedFilterTitles = (query: SearchQuery, titles: FilterTitles) => {
    appliedFilterTitles.value = {
      query: { ...query },
      titles: { ...titles },
    }
  }

  const metadata = computed(() => {
    const { section, base, lesson, test_type, edu_year, edu_month } = route.query
    const firstElement = data.value[0]
    const getAppliedFilterTitle = (queryKey: string) => {
      const appliedQueryValue = appliedFilterTitles.value.query[queryKey]
      const currentQueryValue = route.query[queryKey]

      return String(appliedQueryValue ?? '') === String(currentQueryValue ?? '')
        ? appliedFilterTitles.value.titles[queryKey]
        : undefined
    }

    let monthTitle = edu_month
      ? dayjs()
          .month(Number(edu_month) - 1)
          .format('MMMM')
      : ''
    if (base && edu_month) {
      const monthList = SEARCH_MONTHS_BY_LEVEL[Number(base)]
      if (monthList && monthList.length > 0) {
        const month = monthList.find(item => item.id === Number(edu_month))
        if (month) {
          monthTitle = month.title
        }
      }
    }

    const titles = {
      boardTitle: section
        ? getAppliedFilterTitle('section') || firstElement?.section_title
        : undefined,
      gradeTitle: section && base
        ? getAppliedFilterTitle('base') || firstElement?.base_title || ''
        : '',
      subjectTitle:
        section && base && lesson
          ? getAppliedFilterTitle('lesson') || firstElement?.lesson_title || ''
          : '',
      classificationTitle: '' as string | null | undefined,
      yearTitle: edu_year ? edu_year : '',
      monthTitle,
      is_paper: firstElement?.is_paper ?? activeService.value === 'paper',
    }

    if (
      (getLegacySearchType(route.query.type) == 'test' || getLegacySearchType(route.query.type) == 'azmoon')
      && test_type
    ) {
      titles.classificationTitle = getAppliedFilterTitle('test_type')
        || firstElement?.test_type_title
        || firstElement?.azmoon_type_title
    }

    const joinTextTitles = `${titles.boardTitle} ${titles.gradeTitle} ${titles.subjectTitle} ${titles.classificationTitle} ${titles.monthTitle} ${titles.yearTitle}`
    const serviceTitleSuffix = SEARCH_SERVICE_TITLE_SUFFIXES[activeService.value] || 'Past Papers'

    let appendText = ''
    if (titles.is_paper) {
      appendText = 'Past Papers'
    }

    const titleTemplates = {
      learnfiles: {
        dynamic: `${joinTextTitles} multimedia`,
        fallback:
          'Multimedia Interactive Educational Content; PowerPoint, Video, Class Voice, GamaTrain',
      },
      test: {
        dynamic: `${joinTextTitles} ${serviceTitleSuffix}`,
        fallback: 'Educational Resources | K12 Education Papers and Materials',
      },
      question: {
        dynamic: `${joinTextTitles} Forum`,
        fallback:
          'Seek Clarification, Expand Your Understanding: GamaTrain\'s Q&A Forum',
      },
      azmoon: {
        dynamic: `${joinTextTitles} ${serviceTitleSuffix}`,
        fallback: 'Online Exams, Free Exams for Improving Education',
      },
      dars: {
        dynamic: `${joinTextTitles} ${serviceTitleSuffix}`,
        fallback:
          'Master Concepts, Enhance Learning: GamaTrain\'s Online Tutorials',
      },
      teacher: {
        dynamic: 'Teacher directory',
        fallback: 'Teacher directory',
      },
      default: {
        dynamic: `${joinTextTitles} ${serviceTitleSuffix}`,
        fallback: 'Educational Resources | K12 Education Papers and Materials',
      },
    }

    const template = titleTemplates[getLegacySearchType(route.query.type)] || titleTemplates.default
    const title = titles.boardTitle ? template.dynamic : template.fallback

    const descAppendText = titles.is_paper
      ? 'Includes mark scheme for exam preparation.'
      : 'Useful for study, practice, and exam preparation.'

    const pageDescriptions = {
      learnfiles:
        'Elevate your learning experience with GamaTrain\'s captivating multimedia content, including PowerPoint presentations, informative videos, and diverse educational materials.',
      test: 'Enhance your learning with GamaTrain\'s extensive collection of online documents and texts, carefully curated to enrich your academic journey.',
      question:
        'Engage in active learning and gain deeper insights through GamaTrain\'s interactive Q&A platform, where you can pose questions and seek support from fellow learners and experts.',
      azmoon:
        'Hone your skills and assess your knowledge with GamaTrain\'s online exams, designed to enhance your exam preparation and boost your confidence.',
      dars: 'Complement your studies with GamaTrain\'s comprehensive online tutorials, providing step-by-step guidance and practice opportunities to refine your understanding.',
      teacher: 'Browse qualified teachers and explore their profiles, experience, and subjects they teach.',
    }

    const descriptionTemplates = {
      learnfiles: {
        dynamic: `Download list of ${joinTextTitles}  multimedia. ${descAppendText}`,
      },
      test: {
        dynamic: `Download list of ${joinTextTitles} ${appendText}. ${descAppendText}`,
      },
      question: {
        dynamic: `Download list of ${joinTextTitles} Forum. ${descAppendText}`,
      },
      azmoon: {
        dynamic: `Download list of ${joinTextTitles} Online test. ${descAppendText}`,
      },
      dars: {
        dynamic: `Download list of ${joinTextTitles} Textbook. ${descAppendText}`,
      },
      teacher: {
        dynamic: 'Browse qualified teachers and explore their profiles, experience, and subjects they teach.',
      },
      default: {
        dynamic: `Download list of ${joinTextTitles} ${appendText}. ${descAppendText}`,
      },
    }

    const descTemplate
      = descriptionTemplates[getLegacySearchType(route.query.type)] || descriptionTemplates.default
    const description = titles.boardTitle
      ? descTemplate.dynamic
      : pageDescriptions[getLegacySearchType(route.query.type)] || pageDescriptions.test

    return { title, description }
  })

  useHead(() => ({
    title: metadata.value.title,
    meta: [
      {
        hid: 'apple-mobile-web-app-title',
        name: 'apple-mobile-web-app-title',
        content: metadata.value.title,
      },
      {
        hid: 'og:title',
        name: 'og:title',
        content: metadata.value.title,
      },
      {
        hid: 'og:site_name',
        name: 'og:site_name',
        content: 'GamaTrain',
      },
      {
        hid: 'description',
        name: 'description',
        content: metadata.value.description,
      },
      {
        hid: 'og:description',
        name: 'og:description',
        content: metadata.value.description,
      },
    ],
  }))

  return {
    metadata,
    setAppliedFilterTitles,
  }
}
