export interface ProAccess {
  status: number
  http_code: number
  data: {
    limit: boolean
    remained: number
    usage: boolean
  }
}

export interface TutorialDTO {
  base: string
  content: string
  course: string
  id: string
  lesson: string
  proAccess: ProAccess
  section: string
  status: string
  title: string
  title_url: string
  topic: string
  up_date: string
  update_jalali: string
  views: string
  lesson_pic?: string
  base_title: string
  section_title: string
  lesson_title: string
}

export interface ChapterDTO {
  id: string
  season: boolean
  title: string
  tutorials: {
    id: string
    title: string
  }[]
}

export interface UnitLessonDTO {
  id: string
  season: boolean
  title: string
  tutorialsNum: number
  chapters: ChapterDTO[]
}

export interface LessonTreeDTO {
  id: string
  title: string
  list: UnitLessonDTO[]
}
