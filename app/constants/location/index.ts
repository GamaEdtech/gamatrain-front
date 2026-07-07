import type { AdminLocationFilterDTO, AdminLocationTypeDTO } from '@/types'

export const ADMIN_LOCATION_FILTER_LIST: {
  id: AdminLocationFilterDTO
  title: string
  locationType: AdminLocationTypeDTO
}[] = [
  { id: 'country', title: 'Countries', locationType: 'countries' },
  { id: 'state', title: 'States', locationType: 'states' },
  { id: 'city', title: 'Cities', locationType: 'cities' },
]
