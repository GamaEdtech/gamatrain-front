import type { Ref } from 'vue'
import type { SearchFilterKey, SearchFilterState, SearchResourceItem, SearchServiceId } from '@/types/search'
import dayjs from 'dayjs'
import { SEARCH_MONTHS_BY_LEVEL, SEARCH_SERVICE_TITLE_SUFFIXES } from '@/constants'
import { getLegacySearchType } from '@/utils/searchServices'

interface SearchMetadataOptions {
  activeService: Ref<SearchServiceId>
  filters: Ref<SearchFilterState[]>
  data: Ref<SearchResourceItem[]>
}

const getSelectedTitle = (filters: SearchFilterState[], key: SearchFilterKey) =>
  filters.find(filter => filter.key === key)?.selected?.title

export const useSearchMetadata = ({
  activeService,
  filters,
  data,
}: SearchMetadataOptions) => {
  const route = useRoute()

  const metadata = computed(() => {
    const { section, base, lesson, test_type, edu_year, edu_month } = route.query
    const firstItem = data.value[0]

    let monthTitle = edu_month
      ? dayjs()
          .month(Number(edu_month) - 1)
          .format('MMMM')
      : ''

    if (base && edu_month) {
      const month = SEARCH_MONTHS_BY_LEVEL[Number(base)]?.find(item => item.id === Number(edu_month))
      if (month) {
        monthTitle = month.title
      }
    }

    const titles = {
      boardTitle: section
        ? getSelectedTitle(filters.value, 'section') || firstItem?.section_title
        : undefined,
      gradeTitle: section && base
        ? getSelectedTitle(filters.value, 'base') || firstItem?.base_title || ''
        : '',
      subjectTitle: section && base && lesson
        ? getSelectedTitle(filters.value, 'lesson') || firstItem?.lesson_title || ''
        : '',
      classificationTitle: '' as string | null | undefined,
      yearTitle: edu_year ? String(edu_year) : '',
      monthTitle,
      isPaper: firstItem?.is_paper ?? activeService.value === 'paper',
    }

    const legacyType = getLegacySearchType(route.query.type)

    if ((legacyType === 'test' || legacyType === 'azmoon') && test_type) {
      titles.classificationTitle = getSelectedTitle(filters.value, 'test_type')
        || firstItem?.test_type_title
        || firstItem?.azmoon_type_title
    }

    const joinedTitle = [
      titles.boardTitle,
      titles.gradeTitle,
      titles.subjectTitle,
      titles.classificationTitle,
      titles.monthTitle,
      titles.yearTitle,
    ].filter(Boolean).join(' ')

    const serviceTitleSuffix = SEARCH_SERVICE_TITLE_SUFFIXES[activeService.value] || 'Past Papers'
    const paperText = titles.isPaper ? 'Past Papers' : ''

    const titleTemplates = {
      learnfiles: {
        dynamic: `${joinedTitle} multimedia`,
        fallback: 'Multimedia Interactive Educational Content; PowerPoint, Video, Class Voice, GamaTrain',
      },
      test: {
        dynamic: `${joinedTitle} ${serviceTitleSuffix}`,
        fallback: 'Educational Resources | K12 Education Papers and Materials',
      },
      question: {
        dynamic: `${joinedTitle} Forum`,
        fallback: 'Seek Clarification, Expand Your Understanding: GamaTrain\'s Q&A Forum',
      },
      azmoon: {
        dynamic: `${joinedTitle} ${serviceTitleSuffix}`,
        fallback: 'Online Exams, Free Exams for Improving Education',
      },
      dars: {
        dynamic: `${joinedTitle} ${serviceTitleSuffix}`,
        fallback: 'Master Concepts, Enhance Learning: GamaTrain\'s Online Tutorials',
      },
      teacher: {
        dynamic: 'Teacher directory',
        fallback: 'Teacher directory',
      },
      default: {
        dynamic: `${joinedTitle} ${serviceTitleSuffix}`,
        fallback: 'Educational Resources | K12 Education Papers and Materials',
      },
    }

    const template = titleTemplates[legacyType] || titleTemplates.default
    const title = titles.boardTitle ? template.dynamic.trim() : template.fallback

    const descriptionSuffix = titles.isPaper
      ? 'Includes mark scheme for exam preparation.'
      : 'Useful for study, practice, and exam preparation.'

    const pageDescriptions = {
      learnfiles: 'Elevate your learning experience with GamaTrain\'s captivating multimedia content, including PowerPoint presentations, informative videos, and diverse educational materials.',
      test: 'Enhance your learning with GamaTrain\'s extensive collection of online documents and texts, carefully curated to enrich your academic journey.',
      question: 'Engage in active learning and gain deeper insights through GamaTrain\'s interactive Q&A platform, where you can pose questions and seek support from fellow learners and experts.',
      azmoon: 'Hone your skills and assess your knowledge with GamaTrain\'s online exams, designed to enhance your exam preparation and boost your confidence.',
      dars: 'Complement your studies with GamaTrain\'s comprehensive online tutorials, providing step-by-step guidance and practice opportunities to refine your understanding.',
      teacher: 'Browse qualified teachers and explore their profiles, experience, and subjects they teach.',
    }

    const descriptionTemplates = {
      learnfiles: `Download list of ${joinedTitle} multimedia. ${descriptionSuffix}`,
      test: `Download list of ${joinedTitle} ${paperText}. ${descriptionSuffix}`,
      question: `Download list of ${joinedTitle} Forum. ${descriptionSuffix}`,
      azmoon: `Download list of ${joinedTitle} Online test. ${descriptionSuffix}`,
      dars: `Download list of ${joinedTitle} Textbook. ${descriptionSuffix}`,
      teacher: 'Browse qualified teachers and explore their profiles, experience, and subjects they teach.',
      default: `Download list of ${joinedTitle} ${paperText}. ${descriptionSuffix}`,
    }

    const description = titles.boardTitle
      ? (descriptionTemplates[legacyType] || descriptionTemplates.default).replace(/\s+/g, ' ').trim()
      : pageDescriptions[legacyType] || pageDescriptions.test

    return { title, description }
  })

  useHead(() => ({
    title: metadata.value.title,
    meta: [
      {
        key: 'apple-mobile-web-app-title',
        name: 'apple-mobile-web-app-title',
        content: metadata.value.title,
      },
      {
        key: 'og:title',
        property: 'og:title',
        content: metadata.value.title,
      },
      {
        key: 'og:site_name',
        property: 'og:site_name',
        content: 'GamaTrain',
      },
      {
        key: 'description',
        name: 'description',
        content: metadata.value.description,
      },
      {
        key: 'og:description',
        property: 'og:description',
        content: metadata.value.description,
      },
    ],
  }))

  return {
    metadata,
  }
}
