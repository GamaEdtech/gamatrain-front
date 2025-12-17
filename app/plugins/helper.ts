import { defineNuxtPlugin } from '#app'

export default defineNuxtPlugin((nuxtApp) => {
  const slugGenerator = (title: string) => {
    return title
      .trim()
      .replace(/ (?!$)/g, '-')
      .replace(/\//g, '-')
      .toLowerCase()
  }

  const numberFormat = (value: number | string) => {
    if (import.meta.server) return String(value)
    return Number(value).toLocaleString('en-US')
  }

  nuxtApp.provide('numberFormat', numberFormat)
  nuxtApp.provide('slugGenerator', slugGenerator)
})
