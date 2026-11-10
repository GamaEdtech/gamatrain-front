/** Most schools one comparison shows (the API takes up to this many). */
export const SCHOOL_COMPARE_MAX = 4

export interface SchoolCompareItem {
  id: number
  name: string
  slug?: string | null
}

const STORAGE_KEY = 'gama-school-compare'

/**
 * The schools picked for comparison. Kept on this device (localStorage), so the picks survive moving between the list,
 * the map and school pages. Read after hydration, so the server-rendered page never depends on it.
 */
export const useSchoolCompare = () => {
  const items = useState<SchoolCompareItem[]>('school-compare', () => [])
  const loaded = useState('school-compare-loaded', () => false)
  const { $toast } = useNuxtApp()

  if (import.meta.client && !loaded.value) {
    onNuxtReady(() => {
      if (loaded.value) return
      loaded.value = true
      try {
        const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
        if (Array.isArray(saved)) items.value = saved.filter(item => item && typeof item.id === 'number').slice(0, SCHOOL_COMPARE_MAX)
      }
      catch {
        // Storage blocked or corrupt: start empty.
      }
    })
  }

  const save = () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items.value))
    }
    catch {
      // Private mode: the picks last for this visit only.
    }
  }

  const has = (id: number) => items.value.some(item => item.id === id)

  const remove = (id: number) => {
    items.value = items.value.filter(item => item.id !== id)
    save()
  }

  const add = (item: SchoolCompareItem) => {
    if (has(item.id)) return true
    if (items.value.length >= SCHOOL_COMPARE_MAX) {
      $toast?.info(`You can compare up to ${SCHOOL_COMPARE_MAX} schools. Remove one first.`)
      return false
    }
    items.value = [...items.value, { id: item.id, name: item.name, slug: item.slug }]
    save()
    return true
  }

  const toggle = (item: SchoolCompareItem) => (has(item.id) ? (remove(item.id), false) : add(item))

  const clear = () => {
    items.value = []
    save()
  }

  const compareLink = computed(() => `/school/compare?ids=${items.value.map(item => item.id).join(',')}`)

  return { items, has, add, remove, toggle, clear, compareLink }
}
