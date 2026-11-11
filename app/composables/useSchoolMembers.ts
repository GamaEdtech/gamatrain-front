import type { SchoolMemberRole, SchoolMemberRoleDTO, SchoolMembersDTO, UserSchoolDTO } from '@/types'

interface ApiResult<T> {
  succeeded?: boolean
  data?: T
  errors?: { message?: string }[] | null
}

/** Friendlier words than the role names, for labels and counts. */
const ROLE_WORDS: Record<SchoolMemberRole, { one: string, many: string }> = {
  Teacher: { one: 'teacher', many: 'teachers' },
  Staff: { one: 'staff member', many: 'staff' },
  Student: { one: 'student', many: 'students' },
  Parent: { one: 'parent', many: 'parents' },
  Alumni: { one: 'former student', many: 'former students' },
}

export const schoolRoleLabel = (role: SchoolMemberRole) =>
  role === 'Alumni' ? 'Former student' : role === 'Staff' ? 'Staff' : role

export const schoolRoleCount = (role: SchoolMemberRole, count: number) =>
  `${count.toLocaleString('en-US')} ${count === 1 ? ROLE_WORDS[role].one : ROLE_WORDS[role].many}`

const DISMISS_KEY = 'school-join-dismissed-at'
const DISMISS_DAYS = 30

/**
 * Users' connections to a school (backend: SchoolMembers): the roles one can join in, the school's people, and the
 * signed-in user's own memberships. State is shared per school, so the header's join line, the join card and the
 * people section stay in step. Joining as Teacher, Student or Parent also gives the account that role (backend).
 */
export const useSchoolMembers = (schoolId: MaybeRefOrGetter<number | string>) => {
  const auth = useAuth()
  const id = computed(() => Number(toValue(schoolId)))

  const roles = useState<SchoolMemberRoleDTO[]>('school-member-roles', () => [])
  // A plain string key: useState takes no getter. Each component asks for one school for its lifetime.
  const people = useState<SchoolMembersDTO | null>(`school-members-${id.value}`, () => null)
  const mine = useState<UserSchoolDTO[]>('my-school-memberships', () => [])
  const mineLoaded = useState<boolean>('my-school-memberships-loaded', () => false)
  const dismissedAt = useState<number>('school-join-dismissed', () => 0)

  /** This user's roles at this school. */
  const myRoles = computed(() => mine.value.filter(item => item.schoolId === id.value))
  const isMember = computed(() => myRoles.value.length > 0)
  const total = computed(() => (people.value?.counts ?? []).reduce((sum, item) => sum + item.count, 0))
  const dismissed = computed(() => !!dismissedAt.value && Date.now() - dismissedAt.value < DISMISS_DAYS * 86_400_000)

  async function loadRoles() {
    if (roles.value.length) return
    const res = await useApiService.get<ApiResult<SchoolMemberRoleDTO[]>>('/api/v2/schools/member-roles', undefined, { public: true })
    roles.value = res?.data ?? []
  }

  async function loadPeople() {
    const res = await useApiService.get<ApiResult<SchoolMembersDTO>>(`/api/v2/schools/${id.value}/members`, undefined, { public: true })
    people.value = res?.data ?? { namedMembers: [], counts: [] }
  }

  async function loadMine(force = false) {
    if (!auth.isAuthenticated.value) {
      mine.value = []
      return
    }
    if (mineLoaded.value && !force) return
    const res = await useApiService.get<ApiResult<UserSchoolDTO[]>>('/api/v2/schools/memberships')
    mine.value = res?.data ?? []
    mineLoaded.value = true
  }

  function loadDismissed() {
    try {
      dismissedAt.value = Number(localStorage.getItem(DISMISS_KEY) || 0)
    }
    catch {
      dismissedAt.value = 0
    }
  }

  /** "Not now": the join card stays hidden on every school for 30 days. */
  function dismiss() {
    dismissedAt.value = Date.now()
    try {
      localStorage.setItem(DISMISS_KEY, String(dismissedAt.value))
    }
    catch { /* private mode: hidden for this visit only */ }
  }

  function undismiss() {
    dismissedAt.value = 0
    try {
      localStorage.removeItem(DISMISS_KEY)
    }
    catch { /* nothing stored */ }
  }

  /** Joins (or, for a role already held, changes "show my name"). Returns an error message, or null. */
  async function join(role: SchoolMemberRole, showName: boolean): Promise<string | null> {
    try {
      const res = await useApiService.post<ApiResult<boolean>>(`/api/v2/schools/${id.value}/members`, { role, showName })
      if (!res?.succeeded) return res?.errors?.[0]?.message || 'Could not join the school. Please try again.'
      await Promise.all([loadMine(true), loadPeople()])
      return null
    }
    catch {
      return 'Could not join the school. Please try again.'
    }
  }

  async function leave(role: SchoolMemberRole, school = id.value): Promise<string | null> {
    try {
      const res = await useApiService.remove<ApiResult<boolean>>(`/api/v2/schools/${school}/members/${role}`)
      if (!res?.succeeded) return res?.errors?.[0]?.message || 'Could not leave the school. Please try again.'
      await loadMine(true)
      if (school === id.value) await loadPeople()
      return null
    }
    catch {
      return 'Could not leave the school. Please try again.'
    }
  }

  return { roles, people, mine, myRoles, isMember, total, dismissed, loadRoles, loadPeople, loadMine, loadDismissed, dismiss, undismiss, join, leave }
}
