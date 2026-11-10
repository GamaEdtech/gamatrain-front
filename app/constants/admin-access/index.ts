/**
 * Backend endpoint keys ("Area.Controller.Action", from GET identities/permissions) that a non-admin can be granted
 * one by one in User Management -> Permissions. An Admin passes every check without them.
 */
export const ADMIN_PERMISSIONS = {
  posts: {
    list: 'Admin.Posts.GetPosts',
    detail: 'Admin.Posts.GetPost',
    update: 'Admin.Posts.UpdatePost',
    confirm: 'Admin.Posts.ConfirmPost',
    reject: 'Admin.Posts.RejectPost',
    featured: 'Admin.Posts.SetPostFeatured',
    remove: 'Admin.Posts.RemovePost',
  },
  postComments: {
    list: 'Admin.Posts.GetPostComments',
    confirm: 'Admin.Posts.ConfirmPostComment',
    reject: 'Admin.Posts.RejectPostComment',
  },
  // Keyed by the admin location type (the URL segment), so a page can look up the current tab's permissions.
  locations: {
    countries: {
      list: 'Admin.Locations.GetCountries',
      detail: 'Admin.Locations.GetCountry',
      create: 'Admin.Locations.CreateCountry',
      update: 'Admin.Locations.UpdateCountry',
      remove: 'Admin.Locations.RemoveCountry',
    },
    states: {
      list: 'Admin.Locations.GetStates',
      detail: 'Admin.Locations.GetState',
      create: 'Admin.Locations.CreateState',
      update: 'Admin.Locations.UpdateState',
      remove: 'Admin.Locations.RemoveState',
    },
    cities: {
      list: 'Admin.Locations.GetCities',
      detail: 'Admin.Locations.GetCity',
      create: 'Admin.Locations.CreateCity',
      update: 'Admin.Locations.UpdateCity',
      remove: 'Admin.Locations.RemoveCity',
    },
  },
} as const

/**
 * Admin pages a non-admin can open, with every permission the page needs. The most specific path comes first;
 * `landing` pages are where a non-admin who opens /admin is sent. Any admin page not listed here is Admin-only.
 */
export const ADMIN_PAGE_ACCESS: { path: string, permissions: string[], landing?: boolean }[] = [
  { path: '/admin/posts/comments', permissions: [ADMIN_PERMISSIONS.postComments.list], landing: true },
  { path: '/admin/posts/edit', permissions: [ADMIN_PERMISSIONS.posts.detail, ADMIN_PERMISSIONS.posts.update] },
  { path: '/admin/posts', permissions: [ADMIN_PERMISSIONS.posts.list], landing: true },
  // The country list also feeds the country picker when adding a state or city, so it opens the page.
  { path: '/admin/locations', permissions: [ADMIN_PERMISSIONS.locations.countries.list], landing: true },
]
