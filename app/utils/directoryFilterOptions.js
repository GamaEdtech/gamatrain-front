const DIRECTORY_VARIANTS = new Set(['1', '2', '3'])

export const getDirectoryVariantOptions = items => items
  .filter(item => DIRECTORY_VARIANTS.has(String(item.title).trim()))
  .map(item => ({ ...item, title: String(item.title).trim() }))
  .sort((first, second) => Number(first.title) - Number(second.title))
