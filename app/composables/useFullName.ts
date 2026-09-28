interface HasName {
  firstName?: string | null
  lastName?: string | null
}

export function useFullName(person: HasName) {
  const fullName = `${person.firstName || ''} ${person.lastName || ''}`.trim()

  return fullName || 'unknown'
}
