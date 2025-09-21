<script setup>
const _props = defineProps({
  label: String,
  items: Array,
  disable: Boolean,
})
const selected = defineModel()
</script>

<template>
  <div>
    <v-select
      v-model="selected"
      :items="items"
      item-title="label"
      item-value="value"
      variant="solo"
      density="compact"
      :disabled="disable"
      class="d-flex"
      :list-props="{ minWidth: '300' }"
      item-color="primary"
      :class="{ 'chosen-filters': selected?.title }"
    >
      <template #prepend-inner>
        <span class="primary-gray-300 gtext-t6 label">{{ label }}</span>
      </template>
      <template #item="{ props, item }">
        <v-list-item
          v-bind="props"
          :title="null"
        >
          <v-list-item-title class="gtext-t5">
            {{ item.title }}
          </v-list-item-title>
        </v-list-item>
      </template>
    </v-select>
  </div>
</template>

<style scoped>
.label{
    margin-top: -12px;
    margin-left: 8px;
    color: #344054 !important;
    font-family: Inter, sans-serif !important;
    text-wrap: nowrap;
  font-size: 1.4rem !important;
  line-height: 2.4rem !important;
  font-weight: 500;
}
:deep(.v-field__append-inner){
    margin-top: -12px;
    margin-right: 4px;
}
:deep(.v-field){
    padding: 0px 0px !important;
    min-width: fit-content !important;
    width: fit-content !important;
    height: 30px;
    border: 1px solid #E4E7EC !important;
    box-shadow: none !important;
}
:deep(.v-select__selection){
    display: none !important;
}
:deep(.mdi-menu-down::before){
    color: #344054 !important;
}
:deep(.chosen-filters) .v-field {
  border: 1px solid #ffb300 !important;
}
:deep(.v-input__details){
    display: none;
}
</style>
