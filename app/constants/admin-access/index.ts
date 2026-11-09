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
} as const

/**
 * Admin pages a non-admin can open, with every permission the page needs. The most specific path comes first;
 * `landing` pages are where a non-admin who opens /admin is sent. Any admin page not listed here is Admin-only.
 */
export const ADMIN_PAGE_ACCESS: { path: string, permissions: string[], landing?: boolean }[] = [
  { path: '/admin/posts/comments', permissions: [ADMIN_PERMISSIONS.postComments.list], landing: true },
  { path: '/admin/posts/edit', permissions: [ADMIN_PERMISSIONS.posts.detail, ADMIN_PERMISSIONS.posts.update] },
  { path: '/admin/posts', permissions: [ADMIN_PERMISSIONS.posts.list], landing: true },
]
