<template>
  <div
    class="w-100"
    :style="{ '--rich-editor-min-height': minHeight }"
  >
    <div
      v-if="loading"
      class="d-flex flex-column align-center justify-center ga-2 pa-2 border-grey200 rounded-lg border-md"
    >
      <v-skeleton-loader
        class="w-100 rounded-lg"
        height="30"
      />

      <v-skeleton-loader
        class="w-100 rounded-lg"
        height="300"
      />
    </div>
    <client-only>
      <LazyCkeditor
        v-show="!loading"
        v-model="internalValue"
        :editor="CustomEditor"
        :config="editorConfig"
        @input="changeEditor"
      />
    </client-only>

    <div
      v-if="errorMessage"
      class="text-error text-caption mt-1"
    >
      {{ errorMessage }}
    </div>

    <!-- The toolbar's formula button (and a double-click on a formula): TeX with a live MathJax preview. -->
    <v-dialog
      v-model="formula.open"
      max-width="560"
    >
      <v-card :title="formula.editing ? 'Edit formula' : 'Insert formula'">
        <v-card-text class="d-flex flex-column ga-3">
          <v-textarea
            v-model="formula.tex"
            label="TeX, e.g. \frac{a}{b} or x^{2}"
            variant="outlined"
            density="compact"
            rows="2"
            auto-grow
            autofocus
            hide-details
            class="formula-input"
            @keydown.enter.ctrl.prevent="insertFormula"
          />
          <div class="d-flex flex-wrap ga-1">
            <v-chip
              v-for="snippet in FORMULA_SNIPPETS"
              :key="snippet.tex"
              size="small"
              variant="outlined"
              @click="formula.tex += snippet.tex"
            >
              {{ snippet.title }}
            </v-chip>
          </div>
          <v-switch
            v-model="formula.display"
            label="On its own line"
            color="primary"
            density="compact"
            hide-details
          />
          <div
            ref="formulaPreview"
            class="formula-preview pa-3 rounded-lg border-md border-grey200"
          />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            variant="text"
            @click="formula.open = false"
          >
            Cancel
          </v-btn>
          <v-btn
            color="primary"
            variant="flat"
            :disabled="!formula.tex.trim()"
            @click="insertFormula"
          >
            {{ formula.editing ? 'Save' : 'Insert' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, defineAsyncComponent } from 'vue'

const ALL_FEATURES = {
  heading: ['Heading'],
  bold: ['Bold'],
  italic: ['Italic'],
  strikethrough: ['Strikethrough'],
  subscript: ['Subscript'],
  superscript: ['Superscript'],
  code: ['Code'],
  link: ['Link'],
  list: ['List'],
  indent: ['Indent'],
  blockQuote: ['BlockQuote'],
  highlight: ['Highlight'],
  table: ['Table', 'TableToolbar'],
  // Images are uploaded to the backend and linked, never embedded as base64 (see createEditorImageUpload).
  image: ['Image', 'ImageStyle', 'ImageResize', 'ImageInsert', 'ImageUpload'],
  mediaEmbed: ['MediaEmbed'],
  specialCharacters: ['SpecialCharacters', 'SpecialCharactersEssentials'],
  pasteFromOffice: ['PasteFromOffice'],
  generalHtmlSupport: ['GeneralHtmlSupport'],
  sourceEditing: ['SourceEditing'],
}
const TOOLBAR_MAP = {
  heading: 'heading',
  bold: 'bold',
  italic: 'italic',
  strikethrough: 'strikethrough',
  code: 'code',
  subscript: 'subscript',
  superscript: 'superscript',
  specialCharacters: 'specialCharacters',
  link: 'link',
  list: ['bulletedList', 'numberedList'],
  outdent: 'outdent',
  indent: 'indent',
  image: 'insertImage',
  undo: 'undo',
  redo: 'redo',
  table: 'insertTable',
  mediaEmbed: 'mediaEmbed',
  sourceEditing: 'sourceEditing',
  blockQuote: 'blockQuote',
  highlight: 'highlight',
}
const props = defineProps({
  modelValue: {
    type: String,
    default: '',
  },
  features: {
    type: Array,
    default: () => [],
  },
  mode: {
    type: String, // 'basic' | 'custom' | 'full'
    default: 'basic',
  },
  // Adds the formula button (TeX with a live MathJax preview), in any mode. Off by default: only the editors where
  // math is written (exam questions, the test maker, posts) turn it on.
  withMath: {
    type: Boolean,
    default: false,
  },
  // The writing area's minimum height (any CSS length); short fields such as answer options use less.
  minHeight: {
    type: String,
    default: '300px',
  },
  rules: {
    type: Array,
    default: () => [],
  },
})

const emit = defineEmits(['update:modelValue'])

const internalValue = ref(props.modelValue)
const CustomEditor = ref(null)
const loading = ref(true)
const errorMessage = ref(null)
const isTouched = ref(false)
const editorConfig = ref({
  licenseKey: 'GPL',
})

// CKEditor keeps unknown elements such as <svg> intact in the saved HTML but, by design, shows an empty placeholder
// for them while editing. This draws them in the editing view only (the data output is untouched), so an SVG diagram
// imported through the source editor is actually visible.
const SvgPreview = function (editor) {
  editor.conversion.for('editingDowncast').elementToElement({
    model: {
      name: 'htmlCustomElement',
      attributes: ['htmlElementName', 'htmlCustomElementAttributes', 'htmlContent'],
    },
    view: (modelElement, { writer }) => {
      if (modelElement.getAttribute('htmlElementName') !== 'svg') {
        return null
      }
      const attributes = modelElement.getAttribute('htmlCustomElementAttributes') || {}
      const content = modelElement.getAttribute('htmlContent') || ''

      return writer.createRawElement('div', { class: 'svg-preview' }, (domElement) => {
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
        Object.entries(attributes.attributes || {}).forEach(([name, value]) => svg.setAttribute(name, value))
        if (attributes.styles) {
          svg.setAttribute('style', Object.entries(attributes.styles).map(([k, v]) => `${k}:${v}`).join(';'))
        }
        svg.innerHTML = content
        domElement.replaceChildren(svg)
      })
    },
    converterPriority: 'high',
  })
}

const { $ensureMathJaxReady, $renderMathInElement, $toast } = useNuxtApp()

const renderMath = async (element) => {
  try {
    await $ensureMathJaxReady()
    $renderMathInElement(element)
  }
  catch {
    // MathJax could not load: the raw \( ... \) text simply stays visible.
  }
}

// Draws <span class="math-tex">\(...\)</span> formulas with the same MathJax the post page uses. Each one becomes an
// inline object in the editor, and is written back as exactly the same span, so the saved HTML does not change. Spans
// that carry anything else (extra attributes, styles, nested markup) are left as ordinary content. To change a
// formula, double-click it where the formula button is on (withMath), or use the Source view.
const createMathTexPreview = ({ toWidget }) => function (editor) {
  // CKEditor writes the space in front of an inline object as &nbsp;; put it back so saving a post does not rewrite
  // every "word \(x\)" in the stored HTML.
  const processor = editor.data.processor
  const toData = processor.toData.bind(processor)
  processor.toData = fragment => toData(fragment).replaceAll('&nbsp;<span class="math-tex">', ' <span class="math-tex">')

  editor.model.schema.register('mathTex', {
    inheritAllFrom: '$inlineObject',
    allowAttributes: ['equation'],
  })

  editor.conversion.for('upcast').elementToElement({
    view: { name: 'span', classes: 'math-tex' },
    model: (viewElement, { writer }) => {
      const child = viewElement.getChild(0)
      const onlyClass = [...viewElement.getAttributeKeys()].every(key => key === 'class')
      if (viewElement.childCount !== 1 || !child.is('$text') || !onlyClass || viewElement.getClassNames().length !== 1) {
        return null
      }
      return writer.createElement('mathTex', { equation: child.data })
    },
    converterPriority: 'high',
  })

  editor.conversion.for('dataDowncast').elementToElement({
    model: 'mathTex',
    // A raw element (not a container) so the spaces around a formula are not turned into &nbsp; on save.
    view: (modelElement, { writer }) =>
      writer.createRawElement('span', { class: 'math-tex' }, (domElement) => {
        domElement.textContent = modelElement.getAttribute('equation')
      }),
  })

  editor.conversion.for('editingDowncast').elementToElement({
    model: 'mathTex',
    view: (modelElement, { writer }) => {
      const equation = modelElement.getAttribute('equation')
      const preview = writer.createRawElement('span', { class: 'math-tex-preview' }, (domElement) => {
        domElement.textContent = equation
        renderMath(domElement)
      })
      return toWidget(writer.createContainerElement('span', { class: 'math-tex' }, [preview]), writer)
    },
  })
}

// Formulas are inserted as the same <span class="math-tex">\\(...\\)</span> (or \\[...\\] on its own line) that
// createMathTexPreview reads, so nothing else changes: the saved HTML, the sanitizer and every page that shows it.
// No plugin or package is added; the preview uses the MathJax the site already loads on demand.
const FORMULA_SNIPPETS = [
  { title: 'a/b', tex: '\\frac{a}{b}' },
  { title: '√x', tex: '\\sqrt{x}' },
  { title: 'xⁿ', tex: 'x^{n}' },
  { title: 'xᵢ', tex: 'x_{i}' },
  { title: '×', tex: '\\times ' },
  { title: '÷', tex: '\\div ' },
  { title: '±', tex: '\\pm ' },
  { title: '≤', tex: '\\le ' },
  { title: '≥', tex: '\\ge ' },
  { title: '≠', tex: '\\neq ' },
  { title: 'π', tex: '\\pi ' },
  { title: 'θ', tex: '\\theta ' },
  { title: '∑', tex: '\\sum_{i=1}^{n} ' },
  { title: '∫', tex: '\\int_{a}^{b} ' },
  { title: '°', tex: '^{\\circ}' },
]
const SIGMA_ICON = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M4 3h12v3h-1.5l-.5-1.5H7.6l4.4 5.5-4.4 5.5H14l.5-1.5H16v3H4v-1.2L9.4 10 4 4.2z"/></svg>'

const formula = reactive({ open: false, tex: '', display: false, editing: false })
// The editor and the formula being edited stay out of Vue's reactivity: a reactive proxy breaks CKEditor's own objects.
let formulaTarget = { editor: null, element: null }
const formulaPreview = ref(null)

const wrapFormula = (tex, display) => (display ? `\\[${tex}\\]` : `\\(${tex}\\)`)

// Opens the dialog for the formula selected in the editor, or for a new one at the cursor.
const openFormula = (editor) => {
  const selected = editor.model.document.selection.getSelectedElement()
  const element = selected?.name === 'mathTex' ? selected : null
  const equation = element?.getAttribute('equation')?.trim() ?? ''
  const match = equation.match(/^\\([[(])([\s\S]*)\\[\])]$/)
  formulaTarget = { editor, element }
  Object.assign(formula, {
    open: true,
    editing: !!element,
    display: match?.[1] === '[',
    tex: match ? match[2].trim() : equation,
  })
}

const insertFormula = () => {
  const { editor, element } = formulaTarget
  const tex = formula.tex.trim()
  if (!editor || !tex) return
  editor.model.change((writer) => {
    if (element) writer.setSelection(element, 'on')
    // Replaces a selected formula, or goes in at the cursor.
    editor.model.insertObject(writer.createElement('mathTex', { equation: wrapFormula(tex, formula.display) }), null, null, { setSelection: 'after' })
  })
  formula.open = false
  editor.editing.view.focus()
}

let previewTimer = null
watch(() => [formula.open, formula.tex, formula.display], () => {
  clearTimeout(previewTimer)
  previewTimer = setTimeout(async () => {
    await nextTick()
    const element = formulaPreview.value
    if (!element || !formula.open) return
    element.textContent = formula.tex.trim() ? wrapFormula(formula.tex.trim(), formula.display) : ''
    if (element.textContent) renderMath(element)
  }, 250)
})

onBeforeUnmount(() => clearTimeout(previewTimer))

// The toolbar button, and a double-click on a formula to edit it.
const createMathFormulaButton = ck => function (editor) {
  editor.ui.componentFactory.add('mathFormula', (locale) => {
    const button = new ck.ButtonView(locale)
    button.set({ label: 'Formula', icon: SIGMA_ICON, tooltip: true })
    button.on('execute', () => openFormula(editor))
    return button
  })

  class DoubleClickObserver extends ck.DomEventObserver {
    constructor(view) {
      super(view)
      this.domEventType = 'dblclick'
    }

    onDomEvent(domEvent) {
      this.fire(domEvent.type, domEvent)
    }
  }
  editor.editing.view.addObserver(DoubleClickObserver)
  editor.listenTo(editor.editing.view.document, 'dblclick', () => {
    if (editor.model.document.selection.getSelectedElement()?.name === 'mathTex') openFormula(editor)
  })
}

// Inserted and pasted images go to the backend's EditorImages endpoint (metadata removed) and the editor
// keeps only their link. It replaces Base64UploadAdapter, which put every image inside the saved HTML.
const createEditorImageUpload = ck => class EditorImageUpload extends ck.Plugin {
  static get requires() {
    return [ck.FileRepository]
  }

  init() {
    this.editor.plugins.get('FileRepository').createUploadAdapter = loader => ({
      upload: async () => {
        const file = await loader.file
        const form = new FormData()
        form.append('file', file)
        const response = await useApiService.post('/api/v2/EditorImages', form)
        if (!response?.succeeded || !response?.data?.url) {
          const message = response?.errors?.[0]?.message || 'The image could not be uploaded.'
          $toast?.error(message)
          throw new Error(message)
        }
        return { default: response.data.url }
      },
      abort: () => {},
    })
  }
}

const LazyCkeditor = defineAsyncComponent({
  loader: async () => {
    const ck = await import('ckeditor5')

    const { ClassicEditor, Essentials, Paragraph } = ck

    const { Ckeditor } = await import('@ckeditor/ckeditor5-vue')
    await import('ckeditor5/ckeditor5.css')

    let selectedFeatures = []

    if (props.mode === 'full') {
      selectedFeatures = Object.keys(ALL_FEATURES)
    }
    else if (props.mode === 'custom') {
      selectedFeatures = props.features || []
    }
    else {
      selectedFeatures = ['bold', 'italic']
    }

    const plugins = [Essentials, Paragraph, SvgPreview, ck.Widget, createMathTexPreview(ck), createEditorImageUpload(ck)]
    // Right after undo/redo, so it is never folded into the toolbar's "more" menu.
    const toolbar = ['undo', 'redo', '|']
    if (props.withMath) {
      plugins.push(createMathFormulaButton(ck))
      toolbar.push('mathFormula', '|')
    }

    selectedFeatures.forEach((feature) => {
      const pluginNames = ALL_FEATURES[feature] || []

      pluginNames.forEach((name) => {
        const plugin = ck[name]
        if (plugin && !plugins.includes(plugin)) {
          plugins.push(plugin)
        }
      })

      const tb = TOOLBAR_MAP[feature]

      if (tb) {
        if (Array.isArray(tb)) {
          toolbar.push(...tb)
        }
        else {
          toolbar.push(tb)
        }
      }
    })

    const finalToolbar = [...new Set(toolbar)].filter(Boolean)

    editorConfig.value = {
      licenseKey: 'GPL',
      plugins,
      toolbar: finalToolbar,
      htmlSupport: {
        allow: [
          {
            name: /^(?!script$|iframe$).*$/,
            attributes: {
              key: /^(?!on).*$/,
            },
            classes: true,
            styles: true,
          },
          {
            // The rule above never matches an attribute value (it has no `value: true`), so the <svg> element's own
            // viewBox/width/height/xmlns were silently dropped on save - a diagram without a viewBox is clipped to
            // 300x150. Scoped to <svg> so nothing else the editor keeps changes.
            name: 'svg',
            attributes: [{
              key: /^(?!on).*$/,
              value: true,
            }],
            classes: true,
            styles: true,
          },
        ],
      },
    }

    CustomEditor.value = ClassicEditor
    internalValue.value = props.modelValue
    loading.value = false

    return Ckeditor
  },
  suspensible: false,
  delay: 100,
})

watch(
  () => props.modelValue,
  () => {
    internalValue.value = props.modelValue
  },
)

const validate = (force = false) => {
  if (!isTouched.value && !force) {
    errorMessage.value = ''
    return true
  }

  if (!props.rules.length) {
    errorMessage.value = ''
    return true
  }

  for (const rule of props.rules) {
    const result = rule(internalValue.value)

    if (result !== true) {
      errorMessage.value = result
      return false
    }
  }

  errorMessage.value = ''
  return true
}
const changeEditor = (event) => {
  emit('update:modelValue', event)
  validate()
  isTouched.value = true
}
</script>

<style scoped>
:deep(.ck.ck-editor__main > .ck-editor__editable.ck-focused) {
  border-color: rgb(var(--v-theme-primary)) !important;
  box-shadow: none !important;
}
:deep(.ck.ck-editor) {
  border-radius: 0 0 8px 8px !important;
}
:deep(.ck.ck-editor__main > .ck-editor__editable) {
    border-radius: 0 0 8px 8px !important;
    border : 1px solid rgb(var(--v-theme-grey400)) !important;
    min-height : var(--rich-editor-min-height, 300px);
    background-color: rgb(var(--v-theme-surface)) !important;
    color :  rgb(var(--v-theme-brandNavy)) ;
}
:deep(.ck.ck-editor__top) {
  border-radius: 8px 8px 0 0 !important;
  border : 1px solid rgb(var(--v-theme-grey400)) !important;
}
.formula-preview {
  min-height: 56px;
  overflow-x: auto;
}
.formula-input :deep(textarea) {
  font-family: monospace;
  direction: ltr;
}
:deep(.ck.ck-editor__top .ck-sticky-panel .ck-sticky-panel__content){
  border: none !important;
}
</style>
