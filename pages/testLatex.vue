<template>
  <v-container class="py-8 mt-16">
    <v-row justify="center">
      <v-col
        cols="12"
        md="10"
        lg="8"
      >
        <div class="text-center mb-8">
          <v-icon
            color="teal"
            size="56"
          >
            mdi-test-tube
          </v-icon>
          <h1 class="text-h4 font-weight-bold mt-4">
            MathJax Rendering Test Bench
          </h1>
          <p class="text-medium-emphasis mt-2">
            A comprehensive suite to validate the rendering of various LaTeX
            expressions by MathJax.
          </p>
        </div>

        <div ref="mathJaxContainerRef">
          <div
            v-for="(testCase, index) in latexTestCases"
            :key="index"
            class="mb-8"
          >
            <v-divider
              v-if="index > 0"
              class="my-8"
            />
            <div class="d-flex align-center mb-4">
              <v-icon
                :color="testCase.color || 'primary'"
                class="mr-3"
              >
                {{ testCase.icon }}
              </v-icon>
              <h2 class="text-h6 font-weight-medium">
                {{ testCase.category }}
              </h2>
            </div>

            <v-card variant="outlined">
              <v-row no-gutters>
                <v-col
                  cols="12"
                  md="6"
                >
                  <v-card-title
                    class="text-subtitle-1 font-weight-bold d-flex align-center"
                  >
                    <v-icon
                      small
                      left
                      class="mr-2"
                    >
                      mdi-code-braces
                    </v-icon>
                    Raw LaTeX Input
                  </v-card-title>
                  <v-divider />
                  <v-card-text>
                    <pre
                      class="raw-latex-code"
                    ><code>{{ testCase.rawString }}</code></pre>
                  </v-card-text>
                </v-col>

                <v-col
                  cols="12"
                  md="6"
                  class="rendered-col"
                >
                  <v-card-title
                    class="text-subtitle-1 font-weight-bold d-flex align-center"
                  >
                    <v-icon
                      small
                      left
                      class="mr-2"
                    >
                      mdi-eye-outline
                    </v-icon>
                    Rendered Output
                  </v-card-title>
                  <v-divider />
                  <v-card-text>
                    <div
                      class="expression-area"
                      v-html="testCase.htmlString"
                    />
                  </v-card-text>
                </v-col>
              </v-row>
            </v-card>
          </div>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import { useNuxtApp, useHead } from '#app'

useHead({
  title: 'MathJax LaTeX Test Page',
})

// --- Extended Test Cases ---
const latexTestCases = ref([
  {
    icon: 'mdi-variable',
    color: 'blue-darken-1',
    category: 'Inline & Display Math',
    rawString: `Inline: $x^2 + y_i = z_i$ and Display: $$\\frac{1}{n}\\sum_{i=1}^n x_i$$`,
    htmlString: `Inline: $x^2 + y_i = z_i$ and Display: $$\\frac{1}{n}\\sum_{i=1}^n x_i$$`,
  },
  {
    icon: 'mdi-division',
    color: 'green-darken-1',
    category: 'Fractions & Radicals',
    rawString: `A nested fraction and radical: $$\\frac{\\sqrt{x^2 - 1}}{1 + \\frac{a}{b}}$$`,
    htmlString: `A nested fraction and radical: $$\\frac{\\sqrt{x^2 - 1}}{1 + \\frac{a}{b}}$$`,
  },
  {
    icon: 'mdi-omega',
    color: 'deep-purple-darken-1',
    category: 'Greek Letters & Common Symbols',
    rawString: `Common symbols: $\\lambda, \\pi, \\sigma, \\forall, \\exists, \\in, \\pm, \\rightarrow, \\approx$`,
    htmlString: `Common symbols: $\\lambda, \\pi, \\sigma, \\forall, \\exists, \\in, \\pm, \\rightarrow, \\approx$`,
  },
  {
    icon: 'mdi-matrix',
    color: 'orange-darken-3',
    category: 'Matrices & Arrays',
    rawString: `Using 'pmatrix' for parentheses: $$A = \\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}$$`,
    htmlString: `Using 'pmatrix' for parentheses: $$A = \\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}$$`,
  },
  {
    icon: 'mdi-align-vertical-distribute',
    color: 'cyan-darken-2',
    category: 'Aligned Equations',
    rawString: `Using the 'aligned' environment: $$\\begin{aligned} f(x) &= (x+a)(x+b) \\\\ &= x^2 + (a+b)x + ab \\end{aligned}$$`,
    htmlString: `Using the 'aligned' environment: $$\\begin{aligned} f(x) &= (x+a)(x+b) \\\\ &= x^2 + (a+b)x + ab \\end{aligned}$$`,
  },
  {
    icon: 'mdi-chart-bell-curve',
    color: 'red-darken-2',
    category: 'Integrals & Limits',
    rawString: `An integral $\\int_{0}^{\\infty} e^{-x^2} dx = \\frac{\\sqrt{\\pi}}{2}$ and a limit $\\lim_{x \\to 0} \\frac{\\sin x}{x} = 1$.`,
    htmlString: `An integral $\\int_{0}^{\\infty} e^{-x^2} dx = \\frac{\\sqrt{\\pi}}{2}$ and a limit $\\lim_{x \\to 0} \\frac{\\sin x}{x} = 1$.`,
  },
  {
    icon: 'mdi-format-font',
    color: 'brown-darken-1',
    category: 'Font Styles',
    rawString: `Bold: $\\mathbf{X}$, Calligraphy: $\\mathcal{Y}$, Blackboard Bold: $\\mathbb{Z}$.`,
    htmlString: `Bold: $\\mathbf{X}$, Calligraphy: $\\mathcal{Y}$, Blackboard Bold: $\\mathbb{Z}$.`,
  },
  {
    icon: 'mdi-function-variant',
    color: 'teal-darken-2',
    category: 'Piecewise Functions',
    rawString: `$$f(n) = \\begin{cases} n/2, & \\text{if } n \\text{ is even} \\\\ 3n+1, & \\text{if } n \\text{ is odd} \\end{cases}$$`,
    htmlString: `$$f(n) = \\begin{cases} n/2, & \\text{if } n \\text{ is even} \\\\ 3n+1, & \\text{if } n \\text{ is odd} \\end{cases}$$`,
  },
  {
    icon: 'mdi-flask-outline',
    color: 'indigo-darken-1',
    category: 'Chemical Formulas (Standard TeX)',
    rawString: `A chemical reaction: $\\mathrm{H_2 + O_2 \\rightarrow H_2O}$.`,
    htmlString: `A chemical reaction: $\\mathrm{H_2 + O_2 \\rightarrow H_2O}$. Note: This uses standard TeX, not the mhchem extension.`,
  },
  {
    icon: 'mdi-currency-usd-off',
    color: 'grey-darken-1',
    category: 'Escaped Characters',
    rawString: `This tests an escaped dollar sign. The price is \\$5, which should not be rendered as math.`,
    htmlString: `This tests an escaped dollar sign. The price is \\$5, which should not be rendered as math.`,
  },
])

// --- MathJax Implementation ---
const mathJaxContainerRef = ref<HTMLElement | null>(null)
const { $renderMathInElement, $ensureMathJaxReady } = useNuxtApp()

const typesetMathInContainer = async () => {
  if (import.meta.client && mathJaxContainerRef.value) {
    try {
      await $ensureMathJaxReady()
      if (!window.MathJax?.Hub) return

      const elementToProcess
        = (mathJaxContainerRef.value as { $el?: HTMLElement })?.$el
          ?? mathJaxContainerRef.value

      if (elementToProcess instanceof HTMLElement) {
        await nextTick()
        $renderMathInElement(elementToProcess)
      }
    }
    catch (err) {
      console.error('Error during MathJax typesetting on test page:', err)
    }
  }
}

// --- Lifecycle Hook ---
onMounted(() => {
  typesetMathInContainer()
})
</script>

<style scoped>
.raw-latex-code {
  background-color: #2d2d2d;
  color: #f8f8f2;
  padding: 1rem;
  border-radius: 4px;
  white-space: pre-wrap; /* Allows wrapping of long lines */
  word-break: break-all; /* Breaks long words/strings */
  font-family: "Courier New", Courier, monospace;
  font-size: 0.9rem;
}

.expression-area {
  padding: 1rem;
  font-size: 1.2rem;
  line-height: 1.8;
  min-height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.rendered-col {
  background-color: #f9f9f9;
}

.v-card-title {
  font-size: 1rem !important;
}

.v-icon {
  opacity: 0.8;
}
</style>
