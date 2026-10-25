import type { ApiResult, RelatedContentDTO } from '@/types'

export type RelatedContentSource = 'test' | 'file' | 'question' | 'exam' | 'examTest' | 'tutorial'

// Every type is asked for: gama-api answers with all of them whatever `request` says, and asking the same way
// lets two rows on one page share a single request.
const ALL_TYPES = 'test,file,exam,question,tutorial'

// Content related to a page's item, for its "related" rows. Loaded during SSR, so the links are in the HTML that
// crawlers read; rows on the same page share one request through the key. A failed request is just no rows.
export const useRelatedContent = (source: RelatedContentSource, id: MaybeRefOrGetter<string | number>) =>
  useAsyncData(
    () => `related-content-${source}-${toValue(id)}`,
    async () => {
      try {
        const response = await useApiService.get<ApiResult<RelatedContentDTO>>(
          '/api/v1/recommendations/related',
          { source, request: ALL_TYPES, id: toValue(id) },
          { public: true },
        )
        return response.data ?? null
      }
      catch {
        return null
      }
    },
  )
