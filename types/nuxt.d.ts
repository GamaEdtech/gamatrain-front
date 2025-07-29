declare module '#app' {
  interface NuxtApp {
    $toast: {
      error: (message: string) => void
      success: (message: string) => void
      info: (message: string) => void
      warning: (message: string) => void
    }
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
  }
}

export { }
