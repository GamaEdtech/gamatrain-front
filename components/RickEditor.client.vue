<script setup>
import { Ckeditor } from '@ckeditor/ckeditor5-vue'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'

// Define props to customize the editor features
const props = defineProps({
  /**
   * Features to enable in the toolbar
   * @type {Array}
   * @default ['bold', 'underline', 'alignment']
   */
  features: {
    type: Array,
    default: () => ['bold', 'italic', 'underline', 'alignment'],
  },

  /**
   * Placeholder text for the editor
   * @type {String}
   */
  placeholder: {
    type: String,
    default: '',
  },

  /**
   * Initial content for the editor
   * @type {String}
   */
  initialData: {
    type: String,
    default: '',
  },

  /**
   * Editor min-height
   * @type {String}
   */
  minHeight: {
    type: String,
    default: '250px',
  },

  /**
   * Additional styles as an object
   * @type {Object}
   */
  additionalStyles: {
    type: Object,
    default: () => ({}),
  },
})

const modelValue = defineModel({
  type: String,
  default: '',
})

// Define the mapping between feature names and toolbar items
const _featureToToolbarItem = {
  bold: 'bold',
  italic: 'italic',
  underline: 'underline',
  alignment: 'alignment',
}

// Create editor configuration with basic toolbar
const editorConfig = {
  toolbar: {
    items: ['undo', 'redo', '|', 'bold', 'italic'],
  },
  placeholder: props.placeholder,
  initialData: props.initialData,
}

// Computed property to generate styles
const editorStyles = {
  width: '100%',
  minHeight: props.minHeight,
  ...props.additionalStyles,
}
</script>

<template>
  <div
    class="rich-editor-container"
    :style="{
      '--editor-min-height': minHeight,
    }"
  >
    <Ckeditor
      v-model="modelValue"
      :editor="ClassicEditor"
      :config="editorConfig"
      :style="editorStyles"
    />
    <div class="editor-custom-tools">
      <slot name="content" />
    </div>
  </div>
</template>

<style>
.rich-editor-container {
  border: 1px solid #ccc;
  border-radius: 4px;
  overflow: hidden;
  position: relative;
  background-color: #ffffff;
}

/* Customize the editor's toolbar */
.rich-editor-container .ck-toolbar {
  border-bottom-color: inherit;
  background-color: #fafafa !important;
}

/* Customize the editor's content area */
.rich-editor-container .ck-editor__editable {
  padding: 0 10px;
  min-height: var(--editor-min-height);
}

/* Custom tools area for camera button and image preview */
.editor-custom-tools {
  position: absolute;
  bottom: 10px;
  right: 10px;
  z-index: 1;
  display: flex;
  align-items: center;
  gap: 8px;
}

.editor-custom-tools .v-card img {
  height: 7rem !important;
  width: 7rem !important;
}
.ck-content > p {
  font-size: 20px !important;
}
</style>
