import { ADMIN_PAGE_ACCESS } from '~/constants'

/**
 * What the signed-in user may see in the admin panel. An Admin sees everything; anyone else (for example a teacher
 * who manages posts) sees only the pages and actions they were granted. This only decides what to show: the backend
 * still refuses every endpoint the user was not granted.
 */
export const useAdminAccess = () => {
  const { user } = useUser()
  const permissions = useState<string[]>('adminPermissions', () => [])
  // Whose permissions are loaded, so signing in as someone else never reuses the previous user's list.
  const loadedFor = useState<string | null>('adminPermissionsUser', () => null)

  const isAdmin = computed(() => (user.value?.roles ?? []).some(role => role.toLowerCase() === 'admin'))

  const loadPermissions = async (force = false) => {
    const userName = user.value?.userName ?? null
    if (!userName) {
      permissions.value = []
      loadedFor.value = null
      return
    }
    if (!force && loadedFor.value === userName) return

    const { getMyPermissions } = useMyPermissions()
    permissions.value = await getMyPermissions()
    loadedFor.value = userName
  }

  const can = (permission: string) => isAdmin.value || permissions.value.includes(permission)

  const pageAccess = (path: string) => {
    const normalized = path.toLowerCase().replace(/\/+$/, '')
    return ADMIN_PAGE_ACCESS.find(page => normalized === page.path || normalized.startsWith(`${page.path}/`))
  }

  const canOpenPage = (path: string) => {
    if (isAdmin.value) return true
    if (!path.toLowerCase().startsWith('/admin')) return true
    const page = pageAccess(path)
    return !!page && page.permissions.every(can)
  }

  /** The first admin page a non-admin may open, or null when they have none. */
  // ADMIN_PAGE_ACCESS lists the most specific path first, so reversed it starts from the main pages (Posts first).
  const firstAllowedPage = () => [...ADMIN_PAGE_ACCESS]
    .reverse()
    .filter(page => page.landing)
    .find(page => page.permissions.every(can))?.path ?? null

  return {
    isAdmin,
    permissions,
    loadPermissions,
    can,
    canOpenPage,
    firstAllowedPage,
  }
}
