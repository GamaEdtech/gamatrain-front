export interface LocationItemDTO {
  id: number
  title: string
  code: string
}

export interface GetLocationParams {
  page?: number
  pageSize?: number
}

export type AdminLocationTypeDTO = 'countries' | 'states' | 'cities'
export type AdminLocationFilterDTO = 'country' | 'state' | 'city'

export interface AdminLocationDTO {
  id: number
  title: string
  localTitle: string
  code: string
  parentId: number | null
  parentTitle: string | number | null
  latitude: number | string
  longitude: number | string
}

export interface AddAdminLocationDTO {
  title: string
  localTitle: string
  code: string
  parentId: number | string | null
  latitude: number | string | null
  longitude: number | string | null
}

export interface GetAdminLocationParams {
  page: number
  pageSize: number
  locationType: AdminLocationTypeDTO
}

export interface GetAdminParentLocationParams {
  page: number
  pageSize: number
}
