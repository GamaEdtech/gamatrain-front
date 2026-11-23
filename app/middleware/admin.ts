import { defineNuxtRouteMiddleware } from 'nuxt/app'

// Admins open every admin page. Anyone else opens only the pages they were granted (see ADMIN_PAGE_ACCESS);
// /admin itself shows them what waits in their lists (Needs attention).
export default defineNuxtRouteMiddleware(async (to) => {
  const { isAdmin, loadPermissions, canOpenPage, firstAllowedPage } = useAdminAccess()
  if (isAdmin.value) return

  await loadPermissions()
  if (canOpenPage(to.path)) return

  // The panel home shows anyone with a granted page what waits for them (their lists' Needs attention counts).
  const isPanelHome = to.path.replace(/\/+$/, '').toLowerCase() === '/admin'
  if (isPanelHome && firstAllowedPage()) return

  return showError({
    statusCode: 403,
    statusMessage: 'Access Denied!',
  })
})
