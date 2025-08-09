import { useState } from 'nuxt/app'

interface User {
  id: string
  username: string
  first_name: string
  last_name: string
  avatar: string
  sex: string | null
  active: string
  credit: string
  group_id: number
  section: string | null
  base: string | null
  course: string | null
  area: string | null
  school: string | null
  score_check_info: string
  state: string | null
  city: string | null
}

export const useUser = () => {
  const user = useState<User | null>('user', () => null)

  const setUser = (data: User) => {
    user.value = data
  }

  const cleanUser = () => {
    user.value = null
  }

  return {
    user,
    setUser,
    cleanUser,
  }
}
