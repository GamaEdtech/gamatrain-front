// plugins/mathjax.client.ts
import { defineNuxtPlugin, useHead } from 'nuxt/app'

declare global {
  interface Window {
    MathJax: {
      Hub: {
        Config: (config: Record<string, unknown>) => void
        Queue: (commands: unknown[]) => void
      }
    }
  }
}

let mathJaxLoadPromise: Promise<void> | null = null
let isMathJaxConfigured = false

function initializeMathJax(): Promise<void> {
  if (mathJaxLoadPromise) {
    return mathJaxLoadPromise
  }

  mathJaxLoadPromise = new Promise<void>((resolve, reject) => {
    if (typeof window.MathJax !== 'undefined' && isMathJaxConfigured) {
      return resolve()
    }

    useHead({
      script: [
        {
          src: 'https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.9/MathJax.js?config=TeX-MML-AM_CHTML',
          defer: true,
          tagPosition: 'bodyClose',
          onload: () => {
            if (window.MathJax) {
              if (!isMathJaxConfigured) {
                window.MathJax.Hub.Config({
                  'tex2jax': {
                    inlineMath: [
                      ['$', '$'],
                      ['\\(', '\\)'],
                    ],
                    displayMath: [
                      ['$$', '$$'],
                      ['\\[', '\\]'],
                    ],
                    processEscapes: true,
                    processEnvironments: true,
                    skipTags: [
                      'script',
                      'noscript',
                      'style',
                      'textarea',
                      'pre',
                      'code',
                    ],
                  },
                  'displayAlign': 'center',
                  'HTML-CSS': {
                    styles: { '.MathJax_Display': { margin: '0 auto' } },
                    linebreaks: { automatic: true },
                  },
                  'showProcessingMessages': false,
                  'messageStyle': 'none',
                  'skipStartupTypeset': true,
                })
                isMathJaxConfigured = true
              }
              resolve()
            }
            else {
              reject(new Error('MathJax object on window is not loaded.'))
            }
          },
          onerror: (errorEvent: Event | Error) => {
            console.error('MathJax Loading Error:', errorEvent)
            reject(
              errorEvent instanceof Event
                ? new Error('MathJax Loading Error')
                : errorEvent,
            )
          },
        },
      ],
    })
  })
  return mathJaxLoadPromise
}

async function typesetMathInElement(element: HTMLElement) {
  try {
    await initializeMathJax()
    if (window.MathJax && window.MathJax.Hub && element) {
      window.MathJax.Hub.Queue(['Typeset', window.MathJax.Hub, element])
    }
    else if (!element) {
      console.warn('Element for MathJax processing is not provided.')
    }
    else {
      console.warn('MathJax or MathJax.Hub is not available for processing.')
    }
  }
  catch (error) {
    console.error('MathJax Error:', error)
  }
}

export default defineNuxtPlugin(() => {
  if (import.meta.client) {
    initializeMathJax().catch(err => console.error('MathJax Error:', err))
  }

  return {
    provide: {
      renderMathInElement: typesetMathInElement,
      ensureMathJaxReady: initializeMathJax,
    },
  }
})
