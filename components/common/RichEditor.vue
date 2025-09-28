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

const props = defineProps({
  modelValue: {
    type: String,
    default: '',
  },
  enableExtraPlugins: {
    type: Boolean,
    default: false,
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
    const { ClassicEditor, Essentials, Paragraph, Bold, Italic } = await import(
      'ckeditor5'
    )

    const { Ckeditor } = await import('@ckeditor/ckeditor5-vue')
    await import('ckeditor5/ckeditor5.css')

    if (props.enableExtraPlugins) {
      const {
        Heading,
        Link,
        List,
        Indent,
        Table,
        TableToolbar,
        Image,
        ImageStyle,
        ImageResize,
        ImageInsert,
        MediaEmbed,
        Base64UploadAdapter,
        Code,
        Strikethrough,
        Subscript,
        Superscript,
        SpecialCharacters,
        SpecialCharactersEssentials,
        Highlight,
        BlockQuote,
        SourceEditing,
      } = await import('ckeditor5')

      editorConfig.value = {
        licenseKey: 'GPL',
        plugins: [
          Essentials,
          Paragraph,
          Heading,
          Bold,
          Italic,
          Strikethrough,
          Subscript,
          Superscript,
          Code,
          SpecialCharacters,
          SpecialCharactersEssentials,
          Link,
          List,
          Indent,
          BlockQuote,
          Highlight,
          Table,
          TableToolbar,
          Image,
          ImageStyle,
          ImageResize,
          ImageInsert,
          MediaEmbed,
          Base64UploadAdapter,
          SourceEditing,
        ],
        toolbar: [
          'heading',
          '|',
          'bold',
          'italic',
          'strikethrough',
          'code',
          'subscript',
          'superscript',
          'specialCharacters',
          'link',
          'bulletedList',
          'numberedList',
          '|',
          'outdent',
          'indent',
          '|',
          'insertImage',
          'undo',
          'redo',
          'insertTable',
          'mediaEmbed',
          'sourceEditing',
          '|',
          'blockQuote',
          'highlight',
        ],
      }
    }
    else {
      editorConfig.value = {
        licenseKey: 'GPL',
        plugins: [Essentials, Paragraph, Bold, Italic],
        toolbar: ['undo', 'redo', '|', 'bold', 'italic'],
      }
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
