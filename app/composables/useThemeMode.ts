import { useTheme } from 'vuetify'
import { THEME_COOKIE_NAME, type ThemeName } from '@/constants/theme'

const ONE_YEAR_IN_SECONDS = 60 * 60 * 24 * 365

// The switch stays hidden until every component reads its colours from the
// theme. It shows in development, or anywhere NUXT_PUBLIC_THEME_SWITCH=true.
export const isThemeSwitchEnabled = () => {
  const flag = useRuntimeConfig().public.themeSwitch
  return import.meta.dev || flag === true || flag === 'true'
}

// No default value: a default makes the server send `Set-Cookie: theme=light` to every new visitor, and Cloudflare
// doesn't cache a response that sets a cookie. No cookie means light; it's written only when the user picks a theme.
export const useThemeCookie = () =>
  useCookie<ThemeName | undefined>(THEME_COOKIE_NAME, {
    maxAge: ONE_YEAR_IN_SECONDS,
    sameSite: 'lax',
  })

// Theme the app starts with: the saved choice, or light when the switch is off.
export const getInitialTheme = (): ThemeName => {
  if (!isThemeSwitchEnabled()) return 'light'
  return useThemeCookie().value === 'dark' ? 'dark' : 'light'
}

export const useThemeMode = () => {
  const theme = useTheme()
  const themeCookie = useThemeCookie()

  const isDark = computed(() => theme.global.name.value === 'dark')

  const setTheme = (name: ThemeName) => {
    theme.global.name.value = name
    themeCookie.value = name
  }

  const toggleTheme = () => setTheme(isDark.value ? 'light' : 'dark')

  return {
    isDark,
    isSwitchEnabled: isThemeSwitchEnabled(),
    setTheme,
    toggleTheme,
  }
}
