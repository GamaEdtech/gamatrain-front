<template>
  <div class="w-100">
    <div
      v-if="loading"
      class="d-flex flex-column align-center justify-center ga-2 pa-2 border rounded-lg border-md"
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
  </div>
</template>

<script setup>
import { ref, defineAsyncComponent } from 'vue'

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
  image: ['Image', 'ImageStyle', 'ImageResize', 'ImageInsert'],
  mediaEmbed: ['MediaEmbed', 'Base64UploadAdapter'],
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
})

const emit = defineEmits(['update:modelValue'])

const internalValue = ref(props.modelValue)
const CustomEditor = ref(null)
const loading = ref(true)
const editorConfig = ref({
  licenseKey: 'GPL',
})

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

    const plugins = [Essentials, Paragraph]
    const toolbar = ['undo', 'redo', '|']

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

const changeEditor = (event) => {
  emit('update:modelValue', event)
}
</script>

<style scoped>
</style>
