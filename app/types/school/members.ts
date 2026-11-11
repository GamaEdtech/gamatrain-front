/** How a user is connected to one school (backend `SchoolMemberRole`). */
export type SchoolMemberRole = 'Teacher' | 'Staff' | 'Student' | 'Parent' | 'Alumni'

/** GET schools/member-roles */
export interface SchoolMemberRoleDTO {
  name: SchoolMemberRole
  value: number
  title: string
  /** The member can choose to be named on the school page (teachers and staff). */
  canShowName: boolean
}

/** GET schools/{id}/members */
export interface SchoolMembersDTO {
  /** Teachers and staff who agreed to be named and have a public profile (at most 50). */
  namedMembers: {
    role: SchoolMemberRole
    fullName: string | null
    avatarUri: string | null
    handle: string | null
  }[]
  /** How many members the school has per role, named or not. */
  counts: { role: SchoolMemberRole, count: number }[]
}

/** GET schools/memberships: one item per school and role. */
export interface UserSchoolDTO {
  schoolId: number
  schoolName: string | null
  role: SchoolMemberRole
  showName: boolean
  creationDate: string
}
