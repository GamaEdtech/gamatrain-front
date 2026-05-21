export interface ExperienceDTO {
  id: number
  startDate: string
  endDate: string
  schoolId: number
  schoolTitle: string
  description: string
}
export interface AddExperienceDTO {
  startDate: string
  endDate: string
  schoolId: number
  description: string
}
export interface GetDataParamsExperience {
  page: number
  pageSize: number
}
