export type DataTableCellType
  = | 'text'
    | 'date'
    | 'chip'
    | 'link'
    | 'actions'
    | 'number'
    | 'currency'
    | 'percent'

type DataTableActionValue = string | boolean
type DataTableItemResolver<TItem, TValue extends DataTableActionValue> = TValue | ((item: TItem) => TValue)

export interface DataTableAction<TItem> {
  icon: string
  tooltip?: string
  color?: string
  to?: DataTableItemResolver<TItem, string>
  href?: DataTableItemResolver<TItem, string>
  target?: string
  show?: DataTableItemResolver<TItem, boolean>
  disabled?: DataTableItemResolver<TItem, boolean>
  onClick?: (item: TItem) => void | Promise<void>
}

export interface DataTableHeader<TItem extends object = Record<string, unknown>> {
  title: string
  key: string
  type?: DataTableCellType
  sortable?: boolean
  width?: string | number
  dateFormat?: string
  emptyText?: string
  prefix?: string
  suffix?: string
  icon?: string
  iconColor?: string
  align?: 'start' | 'center' | 'end'
  target?: string
  getText?: (item: TItem) => string | number
  getTo?: (item: TItem) => string
  getChipColor?: (item: TItem) => string
  actions?: DataTableAction<TItem>[]
}
