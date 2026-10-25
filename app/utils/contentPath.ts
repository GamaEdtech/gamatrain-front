// Detail pages whose canonical URL is `/{type}/{id}/{slug}`, or `/test/{code}` (no slug).
export type SlugContentType = 'post' | 'school' | 'paper' | 'exam' | 'tutorial' | 'multimedia' | 'qa' | 'test'

// The path a detail page declares as canonical, and the one the sitemap lists: `/{type}/{id}/{slug}`, or
// `/{type}/{id}` when there is no slug. Never a trailing slash - "/school/11/" and "/school/11" are two
// URLs to a crawler, and only one of them can be canonical.
export const contentPath = (type: SlugContentType, id: string | number, slug?: string | null): string =>
  slug ? `/${type}/${id}/${slug}` : `/${type}/${id}`
