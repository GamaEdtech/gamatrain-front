<template>
  <client-only>
    <div>
      <Ckeditor
        v-if="CustomEditor"
        v-model="internalValue"
        :editor="CustomEditor"
        :value="modelValue"
        :config="editorConfig"
        @ready="onEditorReady"
        @input="(event) => $emit('update:modelValue', event)"
      />
    </div>
  </client-only>
</template>

<script setup>
import { Ckeditor } from '@ckeditor/ckeditor5-vue'

const props = defineProps({
  modelValue: {
    type: String,
    default: '',
  },
})

useHead({
  script: [
    {
      src: '/ckeditor/ckeditor.js',
      defer: true,
    },
  ],
})

const emit = defineEmits(['update:modelValue', 'update:value'])
const editorInstance = ref(null)
const internalValue = ref(props.value)
const CustomEditor = ref(null)
const editorConfig = {
  width: 'auto',
  title: false,
  removePlugins: ['ImageCaption'],
}

function onEditorReady(editor) {
  editorInstance.value = editor
  if (props.modelValue) {
    editor.setData(props.modelValue)
  }
}
watch(
  () => props.modelValue,
  (newValue) => {
    if (editorInstance.value && newValue !== editorInstance.value.getData()) {
      editorInstance.value.setData(newValue)
    }
  },
  {
    immediate: true,
  },
)

watch(internalValue, (newVal) => {
  emit('update:value', newVal)
})

onMounted(() => {
  const checkEditor = () => {
    if (window.ClassicEditor) {
      CustomEditor.value = window.ClassicEditor
    }
    else {
      setTimeout(checkEditor, 100)
    }
  }
  checkEditor()
})
</script>

<style></style>
