import type { TagTypeDTO } from '@/types'

export const TAG_TYPE_LIST: TagTypeDTO[] = ['School', 'Post', 'Feature']

export const TAG_TYPE_FILTER_LIST = [
  { id: '', title: 'All' },
  ...TAG_TYPE_LIST.map(item => ({
    id: item,
    title: item,
  })),
]
