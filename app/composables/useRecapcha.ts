import { useRuntimeConfig } from 'nuxt/app'
import { ref } from 'vue'

interface RecaptchaContext {
  render: (elementId: string, callback: (response: string) => void) => void
  execute: (action: string, callback: (token: string) => void) => void
}

export const useRecaptcha = () => {
  // Get site key from runtime config or environment
  const siteKey: string = useRuntimeConfig().public.recapchaSiteKey as string
  const recaptcha = ref<RecaptchaContext>()

  // Function to dynamically load the reCAPTCHA script
  function loadRecaptchaScript(): Promise<RecaptchaContext> {
    return new Promise((resolve, reject) => {
      // Check if grecaptcha is already available
      if ((window as { grecaptcha?: RecaptchaContext }).grecaptcha) {
        return resolve((window as { grecaptcha: RecaptchaContext }).grecaptcha)
      }

      // Check if the script is already present
      if (document.getElementById('recaptcha-script')) {
        // Wait for it to load
        const checkLoaded = () => {
          if ((window as { grecaptcha?: RecaptchaContext }).grecaptcha) {
            resolve((window as { grecaptcha: RecaptchaContext }).grecaptcha)
          }
          else {
            setTimeout(checkLoaded, 100)
          }
        }
        checkLoaded()
        return
      }

      // Create the script tag for reCAPTCHA with the site key
      const script: HTMLScriptElement = document.createElement('script')
      script.id = 'recaptcha-script'
      script.src = `https://www.google.com/recaptcha/api.js?render=${siteKey}`
      script.async = true
      script.defer = true

      script.onload = (): void => {
        // Wait a bit for grecaptcha to be available
        const checkReady = () => {
          if (
            (
              window as {
                grecaptcha?: RecaptchaContext & {
                  ready?: (callback: () => void) => void
                }
              }
            ).grecaptcha?.ready
          ) {
            (
              window as {
                grecaptcha: RecaptchaContext & {
                  ready: (callback: () => void) => void
                }
              }
            ).grecaptcha.ready(() => {
              resolve((window as { grecaptcha: RecaptchaContext }).grecaptcha)
            })
          }
          else {
            setTimeout(checkReady, 100)
          }
        }
        checkReady()
      }

      script.onerror = (): void =>
        reject(new Error('Failed to load reCAPTCHA script.'))

      document.head.appendChild(script)
    })
  }

  const initCaptcha = () => {
    loadRecaptchaScript()
      .then((grecaptcha: RecaptchaContext) => {
        setTimeout(() => {
          const badge = document.querySelector(
            '.grecaptcha-badge',
          ) as HTMLElement
          if (badge) {
            badge.style.display = 'none'
          }
        }, 1000)

        const recaptchaRes: RecaptchaContext = {
          render: (
            elementId: string,
            callback: (response: string) => void,
          ): void => {
            grecaptcha.ready(() => {
              try {
                grecaptcha.render(elementId, {
                  sitekey: siteKey,
                  callback,
                })
              }
              catch (error) {
                console.error('Error rendering reCAPTCHA:', error)
              }
            })
          },
          execute: (
            action: string,
            callback: (token: string) => void,
          ): void => {
            grecaptcha.ready(() => {
              try {
                grecaptcha
                  .execute(siteKey, { action })
                  .then((token: string) => {
                    callback(token)
                  })
                  .catch((error: Error) => {
                    console.error('Error executing reCAPTCHA:', error)
                    throw error
                  })
              }
              catch (error) {
                console.error('Error in reCAPTCHA execute:', error)
                throw error
              }
            })
          },
        }
        recaptcha.value = recaptchaRes
      })
      .catch((error: Error) => {
        console.error('Error loading reCAPTCHA:', error)
      })
  }

  const getToken = async (action: string = 'submit'): Promise<string> => {
    return new Promise((resolve, reject) => {
      if (import.meta.server) {
        reject(new Error('reCAPTCHA can only be used on client side'))
        return
      }

      if (!recaptcha.value) {
        reject(new Error('reCAPTCHA not loaded'))
        return
      }

      try {
        (recaptcha.value as RecaptchaContext).execute(
          action,
          (token: string) => {
            resolve(token)
          },
        )
      }
      catch (error) {
        reject(error)
      }
    })
  }

  const isLoaded = (): boolean => {
    return (import.meta.client && !!recaptcha.value) as boolean
  }

  return {
    getToken,
    isLoaded,
    initCaptcha,
  }
}
