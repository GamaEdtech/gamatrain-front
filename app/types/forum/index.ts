export interface ForumCreateDTO {
  board: string | number
  grade: string | number
  subject: string | number
  topics: string | number
  title: string
  question: string
  file: string
}
export interface ForumCreateResponseDTO {
  id: number
  repeated?: boolean
}

export interface ForumBriefDTO {
  id: string
  title: string
  status: string
  msg: string | null
  unread_reply: string
  reply_num: string
  subdate: string
  subdate_jalali: string
}
export interface GetDataParamsForum {
  page: number
  pageSize: number
  section?: string | number
  base?: string | number
  lesson?: string | number
}

export interface ForumDetailDTO {
  id: string
  user_: string
  group: string
  section: string
  base: string
  course: string
  lesson: string
  topic: string | null
  title: string
  question: string
  file: string | null
  last_reply: string
  selected_reply: string | null
  status: string
  score: string
  visits: string
  subdate: string
  up_date: string
  username: string
  sex: string
  avatar: string
  direct_msg: string
  replies: RepliesForumDetail
  user: UserForumDetail
  admin: boolean
  refereeAccess: boolean
  owner: boolean
  files: FilesForumDetail
  fastReply: boolean
  minReplyLen: number
  delayBetweenTwo: number
  stats: Stats
  ownerIdentity: string
  name: string
  userLink: string
  section_title: string
  base_title: string
  lesson_title: string
  lesson_pic: string
  title_url: string
  subdate_jalali: string
  update_jalali: string
}

export interface RepliesForumDetail {
  num: string
  selected: string | null
  suggested: SuggestedForumDetail
  list: string | null
}

export interface SuggestedForumDetail {
  id: string
  user_: string
  group: string
  answer: string
  score: string
  subdate: string
  up_date: string
  username: string
  avatar: string
  owner: boolean
  ownerIdentity: string
  name: string
  userLink: string
  subdate_jalali: string
  update_jalali: string
}

export interface UserForumDetail {
  id: string
  group: string
  admin: boolean
  member: boolean
  referee: boolean
  teacher: boolean
  student: boolean
  subadmin: boolean
  username: boolean
  first_name: string | null
  last_name: string | null
  avatar: string
  sex: number
  section: boolean
  base: boolean
  credit: string
  max_confirm_attempts: number
  forceToCaptcha: boolean
  captchaLockPeriod: number
  abnormalFlowNum: number
  validIpReq: number
  validIdentityReq: number
  group_id: number
  score: string
}

export interface FilesForumDetail {
  exist: boolean
  size: number
  ext: string
}

export interface StatsForumDetail {
  qNum: string
  aNum: string
  score: string
}
