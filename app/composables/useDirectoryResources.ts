import { computed } from 'vue'
import type { Ref } from 'vue'
import { useAsyncData } from '#app'
import { useSubjectDirectoryApi } from '~/composables/api/subject-directory/useSubjectDirectory.api'
import { DIRECTORY_RESOURCE_PRESENTATION } from '~/constants/pastpaper/directory'
import type { DirectoryPaperContext } from '~/types/subject-directory'

// The subject's non-empty resource collections, each linking to the matching Search results.
export const useDirectoryResources = (context: Ref<DirectoryPaperContext>) => {
  const { fetchResources } = useSubjectDirectoryApi()
  const key = computed(() => `directory-resources:${context.value.subjectId || 'none'}`)
  const { data, pending, error, refresh } = useAsyncData(key, () => context.value.subjectId
    ? fetchResources(context.value.subjectId)
    : Promise.resolve(null))

  const collections = computed(() => (data.value?.data?.list ?? [])
    .filter(group => group.items?.length)
    .map((group) => {
      const presentation = DIRECTORY_RESOURCE_PRESENTATION[group.title?.trim().toLowerCase() ?? '']
      return {
        id: group.type_id,
        label: presentation?.label || group.title,
        icon: presentation?.icon || 'md:description_outlined',
        count: group.items.length,
        to: {
          path: '/search',
          query: {
            type: 'study-materials',
            section: context.value.boardId || undefined,
            base: context.value.gradeId || undefined,
            lesson: context.value.subjectId || undefined,
            test_type: group.type_id,
          },
        },
      }
    }))

  return { collections, isLoadingResources: pending, resourceError: error, refreshResources: refresh }
}
