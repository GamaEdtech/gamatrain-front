import type { GoogleLoginTokenDTO } from '@/types'

export const useGoogleLogin = () => {
  const loading = ref(true)
  const error = ref<Error | null>(null)
  let resizeObserver: ResizeObserver | null = null
  let resizeFrame: number | null = null

  const stopResponsiveRendering = () => {
    resizeObserver?.disconnect()
    resizeObserver = null

    if (resizeFrame !== null) {
      cancelAnimationFrame(resizeFrame)
      resizeFrame = null
    }
  }

  const loadScript = () => {
    return new Promise<boolean>((resolve, reject) => {
      if (!import.meta.client) {
        resolve(false)
        return
      }

      if (document.getElementById('google-identity-js')) {
        resolve(true)
        return
      }

      const script = document.createElement('script')
      script.id = 'google-identity-js'
      script.src = 'https://accounts.google.com/gsi/client'
      script.async = true
      script.defer = true
      script.onload = () => resolve(true)
      script.onerror = () => reject(new Error('Google Identity script failed to load'))

      document.head.appendChild(script)
    })
  }

  const initGoogleLogin = async ({
    buttonEl,
    clientId,
    callback,
  }: {
    buttonEl: HTMLElement | null
    clientId: string
    callback: (response: GoogleLoginTokenDTO) => void
  }) => {
    loading.value = true
    error.value = null

    try {
      await loadScript()

      if (!buttonEl) {
        throw new Error('Google login button element is not available')
      }

      if (!window.google?.accounts?.id) {
        throw new Error('Google Identity is not available')
      }

      window.google.accounts.id.initialize({
        client_id: clientId,
        callback,
        auto_select: true,
      })

      let renderedWidth = 0
      const renderButton = () => {
        const availableWidth
          = buttonEl.parentElement?.clientWidth || buttonEl.clientWidth

        if (!availableWidth) {
          return
        }

        const nextWidth = Math.min(Math.floor(availableWidth), 400)
        if (nextWidth === renderedWidth) {
          return
        }

        renderedWidth = nextWidth
        buttonEl.replaceChildren()
        window.google.accounts.id.renderButton(buttonEl, {
          text: 'signin_with',
          size: 'large',
          shape: 'pill',
          width: nextWidth,
          theme: 'outline',
        })
      }

      renderButton()

      if (buttonEl.parentElement && 'ResizeObserver' in window) {
        stopResponsiveRendering()
        resizeObserver = new ResizeObserver(() => {
          if (resizeFrame !== null) {
            cancelAnimationFrame(resizeFrame)
          }

          resizeFrame = requestAnimationFrame(() => {
            resizeFrame = null
            renderButton()
          })
        })
        resizeObserver.observe(buttonEl.parentElement)
      }
    }
    catch (e) {
      error.value = e as Error
      console.error(e)
    }
    finally {
      loading.value = false
    }
  }

  onScopeDispose(stopResponsiveRendering)

  return {
    loading,
    error,
    initGoogleLogin,
  }
}
