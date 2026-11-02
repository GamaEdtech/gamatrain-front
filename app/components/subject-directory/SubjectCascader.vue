<template>
  <div>
    <v-menu
      v-model="picker.open.value"
      :close-on-content-click="false"
      location="bottom start"
      :offset="4"
    >
      <template #activator="{ props: activatorProps }">
        <v-btn
          v-bind="activatorProps"
          block
          variant="outlined"
          height="44"
          class="directory-cascader-trigger text-none px-3"
          :class="picker.open.value ? 'border-brandNavy' : 'border-borderSubtle'"
          color="brandNavy"
          :title="displayPath"
          :aria-label="`Select Board, Grade and Subject: ${displayPath}`"
          :append-icon="picker.open.value ? 'md:keyboard_arrow_up' : 'md:keyboard_arrow_down'"
        >
          <span class="text-truncate">{{ displayPath }}</span>
        </v-btn>
      </template>

      <v-card
        class="directory-cascader-menu border border-borderSubtle border-opacity-100"
        color="grey25"
        rounded="xl"
        :loading="picker.loading.value"
        aria-label="Board, Grade and Subject options"
      >
        <div class="pa-2 border-b border-borderSubtle border-opacity-100">
          <v-text-field
            v-model="picker.search.value"
            class="directory-cascader-search"
            placeholder="Search subject or code…"
            aria-label="Search subject or code"
            prepend-inner-icon="md:search"
            clear-icon="md:close"
            variant="outlined"
            density="compact"
            color="primary"
            bg-color="surface"
            rounded="lg"
            :disabled="!picker.draft.value?.grade"
            clearable
            hide-details
            single-line
          />
        </div>
        <div class="d-flex">
          <div
            v-for="column in columns"
            :key="column.stage"
            class="directory-cascader-column d-flex flex-column"
            :class="[`directory-cascader-column--${column.stage}`, { 'directory-cascader-column--current': picker.stage.value === column.stage }]"
          >
            <div class="d-flex d-sm-none align-center px-3 py-1 text-grey500">
              <v-btn
                v-if="column.back"
                icon="md:chevron_left"
                variant="text"
                size="small"
                :aria-label="`Back to ${column.back}s`"
                @click="picker.stage.value = column.back"
              />
              <span class="font-weight-medium">{{ column.title }}</span>
            </div>
            <v-list
              class="directory-cascader-options bg-transparent py-1"
              density="compact"
              :aria-label="column.title"
            >
              <v-list-item
                v-for="option in column.items"
                :key="option.id"
                :active="option.id === column.selectedId"
                :append-icon="column.stage !== 'subject' ? 'md:chevron_right' : option.id === column.selectedId ? 'md:check' : undefined"
                color="brandNavy"
                rounded="lg"
                min-height="34"
                class="directory-cascader-option mx-1 px-2"
                :title="option.title"
                @click="option.select()"
              />
              <p
                v-if="!column.items.length && !picker.loading.value"
                class="pa-3 ma-0 text-grey600"
              >
                {{ picker.draft.value?.error ? 'Unable to load options.' : `No ${column.title.toLowerCase()} options.` }}
              </p>
            </v-list>
          </div>
        </div>
      </v-card>
    </v-menu>
    <v-alert
      v-if="snapshot?.error"
      class="mt-2"
      variant="tonal"
      density="compact"
      type="error"
      color="errorStrong"
    >
      Unable to load directory options.
      <v-btn
        variant="text"
        class="text-none"
        @click="emit('retry')"
      >
        Retry
      </v-btn>
    </v-alert>
  </div>
</template>

<script setup lang="ts">
import { computed, toRef } from 'vue'
import { useDirectoryPicker } from '~/composables/useDirectorySelection'
import type { DirectorySelection, DirectorySelectorSnapshot, DirectorySelectorStage } from '~/types/subject-directory'

const props = defineProps<{
  snapshot: DirectorySelectorSnapshot | null | undefined
}>()
const emit = defineEmits<{
  select: [selection: DirectorySelection]
  retry: []
}>()

const picker = useDirectoryPicker(toRef(props, 'snapshot'), selection => emit('select', selection))

const displayPath = computed(() => {
  const { board, grade, subject } = props.snapshot ?? {}
  return board && grade && subject
    ? [board.title, grade.title, subject.title].join(' / ')
    : 'Select Board / Grade / Subject'
})

// Board, Grade and Subject columns; a column appears once its parent is chosen.
function toColumn<T extends { title: string }>(stage: DirectorySelectorStage, items: T[], id: (item: T) => unknown, selected: unknown, select: (item: T) => void) {
  return {
    stage,
    title: stage[0]!.toUpperCase() + stage.slice(1),
    back: ({ grade: 'board', subject: 'grade' } as Record<string, DirectorySelectorStage>)[stage],
    selectedId: String(selected ?? ''),
    items: items.map(item => ({ id: String(id(item)), title: item.title, select: () => select(item) })),
  }
}
const columns = computed(() => {
  const draft = picker.draft.value
  return [
    toColumn('board', draft?.boards ?? props.snapshot?.boards ?? [], board => board.code, draft?.board?.code, picker.selectBoard),
    ...draft?.board ? [toColumn('grade', draft.grades, grade => grade.id, draft.grade?.id, picker.selectGrade)] : [],
    ...draft?.grade ? [toColumn('subject', picker.visibleSubjects.value, subject => subject.id, props.snapshot?.subject?.id, picker.selectSubject)] : [],
  ]
})
</script>

<style scoped lang="scss">
@use 'sass:map';
@use 'vuetify/settings' as vuetify;

/* px sizes: the app's 10px root font size makes Vuetify's rem-based text too small */
.directory-cascader-trigger {
  font-size: 14px;
  font-weight: 500;
  letter-spacing: normal;
  border-radius: 12px;
  background-color: rgb(var(--v-theme-grey25));
}

.directory-cascader-trigger :deep(.v-btn__content) {
  flex: 1;
  justify-content: flex-start;
  min-width: 0;
}

.directory-cascader-search :deep(.v-field) {
  font-size: 14px;
}

.directory-cascader-menu {
  width: 740px;
  max-width: calc(100vw - 32px);
}

.directory-cascader-column {
  width: 160px;
  min-width: 0;
}

.directory-cascader-column + .directory-cascader-column {
  border-inline-start: 1px solid rgb(var(--v-theme-borderSubtle));
}

.directory-cascader-column--grade { width: 220px; }
.directory-cascader-column--subject { width: 360px; }

.directory-cascader-options {
  max-height: 212px;
  overflow-y: auto;
}

.directory-cascader-option :deep(.v-list-item-title) {
  font-size: 15px;
  font-weight: 500;
  line-height: 22px;
}

/* Phones show one column at a time, with a back button */
@media #{map.get(vuetify.$display-breakpoints, 'xs')} {
  .directory-cascader-column {
    display: none !important;
    width: 100%;
    border-inline-start: 0 !important;
  }

  .directory-cascader-column--current {
    display: flex !important;
  }
}
</style>
