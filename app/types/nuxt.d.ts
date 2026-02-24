declare module '#app' {
  interface NuxtApp {
    $toast: {
      error: (message: string) => void
      success: (message: string) => void
      info: (message: string) => void
      warning: (message: string) => void
    }
    $numberFormat: (value: number | string) => string
    $slugGenerator: (title: string) => string
    $stripHtmlTags: (input: string, length: number) => string
    $cleanSubject: (name: string) => string
  }
}

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $toast: {
      error: (message: string) => void
      success: (message: string) => void
      info: (message: string) => void
      warning: (message: string) => void
    }
    $numberFormat: (value: number | string) => string
    $slugGenerator: (title: string) => string
    $stripHtmlTags: (input: string, length: number) => string
    $cleanSubject: (name: string) => string
  }
}

export { }
