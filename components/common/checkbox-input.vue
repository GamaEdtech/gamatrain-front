<template>
  <div class="checkbox-container">
    <div
      v-for="option in options"
      :key="option.id"
      class="checkbox-item"
      @click="toggleOption(option)"
    >
      <div
        class="checkbox-icon"
        :class="{
          single: !multiple,
          multiple: multiple,
          checked: isChecked(option.id),
        }"
      >
        <span
          v-if="isChecked(option.id)"
          class="check-mark"
        />
      </div>
      <span class="checkbox-label">{{ option.title }}</span>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  options: {
    type: Array,
    required: true,
  },
  multiple: {
    type: Boolean,
    default: false,
  },
  modelValue: {
    type: [Array, String, Number],
    default(rawProps) {
      return rawProps.multiple ? [] : null
    },
  },
})

const emit = defineEmits(['update:modelValue'])

const isChecked = (value) => {
  return props.multiple
    ? props.modelValue.includes(value)
    : props.modelValue === value
}

const toggleOption = (option) => {
  if (props.multiple) {
    const newValues = [...props.modelValue]
    const index = newValues.indexOf(option.id)
    if (index > -1) {
      newValues.splice(index, 1)
    }
    else {
      newValues.push(option.id)
    }
    emit('update:modelValue', newValues)
  }
  else {
    if (props.modelValue === option.id) {
      emit('update:modelValue', null)
    }
    else {
      emit('update:modelValue', option.id)
    }
  }
}
</script>

<style scoped>
@import "../../assets/scss/common/checkbox-input.scss";
</style>
