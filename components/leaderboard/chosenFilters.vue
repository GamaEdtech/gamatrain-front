<script setup>
const _props = defineProps({
  label: String,
})
</script>

<template>
  <button class="chosen-filters">
    <span class="gtext-t5 primary-gray-500 font-weight-medium">{{ label }}</span>
    <span class="gtext-t5 primary-gray-500 font-weight-medium mdi mdi-close-circle" />
  </button>
</template>

<style scoped>
.chosen-filters{
  background-color: #F2F4F7;
  padding: 0px 10px;
  border-radius: 40px;
  height: 22px;
  min-width: 66px;
  align-items: center;
  text-align: center;
  display: flex;
  gap: 4px;
  text-wrap: nowrap;
}
</style>
