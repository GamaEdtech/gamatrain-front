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

  const stripHtmlTags = (input: string, length = 1200) => {
    if (!input) return ''

    const sliced = input.slice(0, length)

    const lastClosingTag = sliced.lastIndexOf('>')

    const safeSlice
      = lastClosingTag !== -1 ? sliced.slice(0, lastClosingTag + 1) : sliced

    const text = safeSlice
      .replace(/<!--[\s\S]*?-->/g, '') // remove comments
      .replace(/<\/?[^>]+(>|$)/g, '') // remove tags
      .replace(/&#\d+;/g, '') // remove emojies and icons
      .replace(/&[a-zA-Z]+;/g, '') // remove entity like &nbsp;
      .replace(/\s+/g, ' ') // add spaces for better result
      .trim()

    return text + '...'
  }

  const cleanSubject = (name: string) => (name ? name.replace(/\s*\(.*?\)/, '') : '')

  nuxtApp.provide('numberFormat', numberFormat)
  nuxtApp.provide('slugGenerator', slugGenerator)
  nuxtApp.provide('stripHtmlTags', stripHtmlTags)
  nuxtApp.provide('cleanSubject', cleanSubject)
})
