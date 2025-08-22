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
})

const emit = defineEmits(['update:modelValue'])

const internalValue = ref(props.modelValue)
const CustomEditor = ref(null)
const loading = ref(true)
const editorConfig = {
  title: false,
  removePlugins: ['ImageCaption'],
}

const LazyCkeditor = defineAsyncComponent({
  loader: async () => {
    const { default: ClassicEditor } = await import(
      '@ckeditor/ckeditor5-build-classic'
    )
    const { Ckeditor } = await import('@ckeditor/ckeditor5-vue')
    CustomEditor.value = ClassicEditor
    loading.value = false
    internalValue.value = props.modelValue

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
