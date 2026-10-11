export type NudgeType
  = 'RoleMissing'
    | 'AvatarMissing'
    | 'NameMissing'
    | 'BioMissing'
    | 'SkillsMissing'
    | 'ExperienceMissing'

export interface AdminNudgeTemplateDTO {
  id: number
  nudgeType: NudgeType
  subject: string
  body: string
  ctaLabel: string
  ctaUrl: string
  isActive: boolean
}

export interface AdminNudgeTemplateDetailDTO {
  id: number
  nudgeType: NudgeType
  subject: string
  body: string
  ctaLabel: string
  ctaUrl: string
  isActive: boolean
}

export interface AddAdminNudgeTemplateDTO {
  nudgeType: NudgeType
  subject: string
  body: string
  ctaLabel: string
  ctaUrl: string
  isActive: boolean
}

export interface EditAdminNudgeTemplateDTO {
  nudgeType?: NudgeType
  subject?: string
  body?: string
  ctaLabel?: string
  ctaUrl?: string
  isActive?: boolean
}

export interface AdminNudgeTemplateIdDTO {
  id: number
}
export interface GetAdminNudgeTemplateParams {
  page: number
  pageSize: number
}
