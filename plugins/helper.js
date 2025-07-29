import { defineNuxtPlugin } from '#app'
import { useRuntimeConfig } from '#imports'

export default defineNuxtPlugin((nuxtApp) => {
  const loadImg = (img) => {
    const base_url = useRuntimeConfig().public.FILE_BASE_URL
    return `${base_url}/uploads/lessonsPic/${img}`
  }

  const slugGenerator = (title) => {
    return title
      .trim()
      .replace(/ (?!$)/g, '-')
      .replace(/\//g, '-')
      .toLowerCase()
  }

  const loadAvatar = (auth) => {
    const base_url = useRuntimeConfig().public.FILE_BASE_URL
    if (auth?.user?.avatar) {
      return `${base_url}/uploads/user/avatars/${auth.user.avatar}`
    }
    return `${base_url}/assets/image/avatars/default/png/user.png`
  }

  const testLevel = (val) => {
    const levels = {
      1: 'Simple',
      2: 'Middle',
      3: 'Hard',
    }
    return levels[val] || 'Unknown'
  }

  const timeAgo = (date) => {
    const timestamp = Date.parse(date) / 1000
    const strTime = ['second', 'min', 'hour', 'day', 'month', 'year']
    const length = [60, 60, 24, 30, 12, 10]

    const currentDate = new Date()
    let diff = Math.floor(currentDate.getTime() / 1000 - timestamp)

    for (let i = 0; diff >= length[i] && i < length.length - 1; i++) {
      diff = Math.floor(diff / length[i])
    }

    return `${diff} ${strTime[diff > 1 ? 1 : 0]}${diff > 1 ? '\'s' : ''} ago`
  }

  const numberFormat = (value) => {
    if (import.meta.server) return String(value)
    return Number(value).toLocaleString('en-US')
  }

  // Provide functions globally
  nuxtApp.provide('numberFormat', numberFormat)
  nuxtApp.provide('loadImg', loadImg)
  nuxtApp.provide('slugGenerator', slugGenerator)
  nuxtApp.provide('loadAvatar', loadAvatar)
  nuxtApp.provide('testLevel', testLevel)
  nuxtApp.provide('timeAgo', timeAgo)
})
