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
                  tex2jax: {
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
                  displayAlign: 'center',
                  // No CommonHTML automatic line breaking: in MathJax 2 it turns every formula, inline ones
                  // too, into a full-width table cell, so inline math takes a line of its own and a formula
                  // in a table cell squeezes the other columns. Wide display formulas scroll instead (app.scss).
                  showProcessingMessages: false,
                  messageStyle: 'none',
                  skipStartupTypeset: true,
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

// MathJax loads on first use ($ensureMathJaxReady / $renderMathInElement), not at app start:
// most pages (schools, the home page) have no math, and it's ~85 KB of script for nothing there.
// Code that typesets must await $ensureMathJaxReady() before touching window.MathJax.
export default defineNuxtPlugin(() => {
  return {
    provide: {
      renderMathInElement: typesetMathInElement,
      ensureMathJaxReady: initializeMathJax,
    },
  }
})
