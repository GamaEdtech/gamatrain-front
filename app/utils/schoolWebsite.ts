/**
 * A school's webSite is free text and sometimes not a URL at all ("government"). Returns a link for
 * the ones that look like a site, and '' for the rest, which are shown as plain text.
 */
export function schoolWebsiteUrl(site?: string | null): string {
  const value = (site || '').trim()
  if (!/^(https?:\/\/)?[\w-]+(\.[\w-]+)+/i.test(value)) return ''
  return /^https?:\/\//i.test(value) ? value : `https://${value}`
}
