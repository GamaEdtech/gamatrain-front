import { DIRECTORY_RESOURCE_PRESENTATION } from '~/constants/pastpaper/resources'

export const getDirectoryResourceCollections = (data = []) => data
  .filter(resource => Array.isArray(resource.items) && resource.items.length > 0)
  .map((resource) => {
    const title = resource.title.trim()
    const presentation = DIRECTORY_RESOURCE_PRESENTATION[title.toLowerCase()]
    return {
      id: resource.type_id,
      label: presentation?.label || title,
      title: presentation?.title || title,
      icon: presentation?.icon || 'md:description_outlined',
      // The directory endpoint returns full, unpaginated collection lists.
      count: resource.items.length,
      items: resource.items.map(item => ({
        ...item,
        to: `/paper/${encodeURIComponent(item.id)}/${encodeURIComponent(item.title_url)}`,
      })),
    }
  })

export const getDirectoryResourceSearchLink = (collection, context) => ({
  path: '/search',
  query: {
    type: 'paper',
    section: context.boardId || undefined,
    base: context.gradeId || undefined,
    lesson: context.subjectId || undefined,
    test_type: collection.id,
  },
})
