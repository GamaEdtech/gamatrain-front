import { defineNuxtRouteMiddleware, navigateTo } from 'nuxt/app'

// Admins open every admin page. Anyone else opens only the pages they were granted (see ADMIN_PAGE_ACCESS);
// /admin itself sends them to their first allowed page.
export default defineNuxtRouteMiddleware(async (to) => {
  const { isAdmin, loadPermissions, canOpenPage, firstAllowedPage } = useAdminAccess()
  if (isAdmin.value) return

  await loadPermissions()
  if (canOpenPage(to.path)) return

  const isPanelHome = to.path.replace(/\/+$/, '').toLowerCase() === '/admin'
  const landing = isPanelHome ? firstAllowedPage() : null
  if (landing) {
    return navigateTo(landing, { replace: true })
  }

  return showError({
    statusCode: 403,
    statusMessage: 'Access Denied!',
  })
})
