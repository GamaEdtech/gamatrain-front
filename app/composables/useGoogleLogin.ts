import type { GoogleLoginTokenDTO } from '@/types'

export const useGoogleLogin = () => {
  const loading = ref(true)
  const error = ref<Error | null>(null)

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

      window.google.accounts.id.renderButton(buttonEl, {
        text: 'signin_with',
        size: 'large',
        width: 252,
        theme: 'outline',
      })
    }
    catch (e) {
      error.value = e as Error
      console.error(e)
    }
    finally {
      loading.value = false
    }
  }

  return {
    loading,
    error,
    initGoogleLogin,
  }
}
