import { DIRECTORY_RESOURCE_PRESENTATION } from '~/constants/pastpaper/resources'
import type { DirectoryResourceContext, DirectoryResourceGroup } from '~/types/subject-directory/resources'

export const getDirectoryResourceCollections = (data: DirectoryResourceGroup[] = []) => data
  .filter(resource => Array.isArray(resource.items) && resource.items.length > 0)
  .map((resource) => {
    const title = String(resource.title ?? '').trim()
    const presentation = DIRECTORY_RESOURCE_PRESENTATION[title.toLowerCase()]
    return {
      id: resource.type_id,
      label: presentation?.label || title,
      title: presentation?.title || title,
      icon: presentation?.icon || 'md:description_outlined',
      // The directory endpoint returns full, unpaginated collection lists.
      count: resource.items.length,
    }
  })

export const getDirectoryResourceSearchLink = (collection: { id: string | number }, context: DirectoryResourceContext) => ({
  path: '/search',
  query: {
    type: 'study-materials',
    section: context.boardId || undefined,
    base: context.gradeId || undefined,
    lesson: context.subjectId || undefined,
    test_type: collection.id,
  },
})
