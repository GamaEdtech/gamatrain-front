<template>
  <div>
    <v-menu
      :model-value="state.open"
      :close-on-content-click="false"
      location="bottom start"
      :offset="4"
      :min-width="0"
      max-width="calc(100vw - 32px)"
      @update:model-value="emit('open', $event)"
      @after-enter="scrollSelectedOptions"
    >
      <template #activator="{ props: activatorProps }">
        <v-btn
          v-bind="activatorProps"
          :id="triggerId"
          block
          variant="outlined"
          height="44"
          class="directory-cascader-trigger text-none text-start px-3"
          :class="{ 'directory-cascader-trigger--open': state.open }"
          :title="displayPath"
          :aria-label="`Select Board, Grade and Subject: ${displayPath}`"
        >
          <span class="text-truncate">{{ displayPath }}</span>
          <template #append>
            <v-icon
              :icon="state.open ? 'md:keyboard_arrow_up' : 'md:keyboard_arrow_down'"
              color="grey500"
              size="20"
            />
          </template>
        </v-btn>
      </template>

      <v-card
        ref="menuCard"
        class="directory-cascader-menu"
        elevation="0"
        color="grey25"
        aria-label="Board, Grade and Subject options"
        @keydown.enter.stop
      >
        <div class="directory-cascader-search pa-2">
          <v-text-field
            :model-value="search.query"
            placeholder="Search subject or code…"
            aria-label="Search subject or code"
            role="combobox"
            aria-autocomplete="list"
            :aria-expanded="isSearching"
            :aria-controls="isSearching && searchResults.length ? searchResultsId : undefined"
            :aria-activedescendant="activeResultId"
            :disabled="state.committing"
            :loading="isSearching && search.loading"
            prepend-inner-icon="md:search"
            clear-icon="md:close"
            variant="outlined"
            density="compact"
            color="academicGold"
            base-color="directoryInk"
            rounded="lg"
            clearable
            hide-details
            single-line
            @update:model-value="emit('search', $event || '')"
            @keydown="onSearchKeydown"
          />
        </div>
        <div v-if="isSearching">
          <p
            v-if="state.commitError"
            class="px-3 py-2 text-error"
            role="alert"
          >
            {{ state.commitError }}
          </p>
          <p
            v-if="!state.board && !state.selection"
            class="px-3 py-4 text-grey600"
            role="status"
          >
            Select a board to search its subjects.
          </p>
          <p
            v-else-if="search.loading"
            class="px-3 py-4 text-grey600"
            role="status"
          >
            Loading subjects…
          </p>
          <div
            v-else-if="search.error"
            class="pa-3 text-grey600"
            role="alert"
          >
            <p>{{ search.error }}</p>
            <v-btn
              variant="text"
              color="directoryInk"
              class="text-none mt-1"
              @click="emit('retrySearch')"
            >
              Retry
            </v-btn>
          </div>
          <v-list
            v-else-if="searchResults.length"
            :id="searchResultsId"
            class="directory-cascader-options bg-transparent py-1 px-0"
            role="listbox"
            aria-label="Matching subjects"
            density="compact"
          >
            <v-list-item
              v-for="(result, index) in searchResults"
              :id="`${searchResultsId}-${index}`"
              :key="result.id"
              :value="result.id"
              :active="activeResultIndex === index"
              :aria-selected="activeResultIndex === index"
              :data-selected="activeResultIndex === index || undefined"
              :disabled="state.committing"
              role="option"
              tabindex="-1"
              color="directoryInk"
              min-height="48"
              height="48"
              class="directory-cascader-option px-3 py-0"
              active-class="directory-cascader-option--active"
              @mousedown.prevent
              @mouseenter="activeResultIndex = index"
              @focus="activeResultIndex = index"
              @click="emit('selectSearch', result.id)"
            >
              <v-list-item-title
                class="directory-cascader-option-title"
                :title="result.title"
              >
                {{ result.title }}
              </v-list-item-title>
              <v-list-item-subtitle
                class="directory-cascader-result-path text-grey500"
                :title="result.path"
              >
                {{ result.path }}
              </v-list-item-subtitle>
            </v-list-item>
          </v-list>
          <p
            v-else
            class="px-3 py-4 text-grey600"
            role="status"
          >
            No matching subjects
          </p>
        </div>
        <div
          v-else
          class="directory-cascader-columns"
        >
          <div
            v-for="column in columns"
            :key="column.stage"
            class="directory-cascader-column"
            :class="{
              'directory-cascader-column--current': state.stage === column.stage,
              'directory-cascader-column--grade': column.stage === 'grade',
              'directory-cascader-column--subject': column.stage === 'subject',
            }"
          >
            <div class="d-flex d-sm-none align-center px-3 py-1 text-grey500">
              <v-btn
                v-if="column.stage !== 'board'"
                class="d-sm-none mr-1"
                icon="md:chevron_left"
                variant="text"
                size="small"
                :aria-label="column.stage === 'subject' ? 'Back to grades' : 'Back to boards'"
                @click="emit('navigate', column.stage === 'subject' ? 'grade' : 'board')"
              />
              <span class="text-subtitle-1 font-weight-medium">{{ column.title }}</span>
            </div>
            <p
              v-if="column.stage === 'subject' && state.commitError"
              class="px-3 py-2 text-error"
              role="alert"
            >
              {{ state.commitError }}
            </p>
            <div
              v-if="state.loading === column.stage"
              class="d-flex align-center justify-center ga-2 pa-4 text-grey600"
              role="status"
            >
              <v-progress-circular
                indeterminate
                size="20"
                width="2"
                color="academicGold"
              />
              <span>Loading…</span>
            </div>
            <div
              v-else-if="state.errorStage === column.stage"
              class="pa-4 text-grey600"
              role="alert"
            >
              <p>Unable to load {{ column.title.toLowerCase() }} options.</p>
              <v-btn
                variant="text"
                color="directoryInk"
                class="text-none mt-2"
                @click="emit('retry')"
              >
                Retry
              </v-btn>
            </div>
            <v-list
              v-else-if="column.items.length"
              class="directory-cascader-options bg-transparent py-1 px-0"
              density="compact"
              :aria-label="column.title"
            >
              <v-list-item
                v-for="option in column.items"
                :key="option.id"
                :value="option.id"
                :active="column.selectedId === option.id"
                :disabled="state.committing"
                :data-selected="column.selectedId === option.id || undefined"
                color="directoryInk"
                min-height="34"
                height="34"
                class="directory-cascader-option px-3 py-0"
                active-class="directory-cascader-option--active"
                @click="emit('select', column.stage, option.id)"
              >
                <v-list-item-title
                  class="directory-cascader-option-title"
                  :title="option.title"
                >
                  {{ option.title }}
                </v-list-item-title>
                <template #append>
                  <v-icon
                    v-if="column.stage !== 'subject' || column.selectedId === option.id"
                    :icon="column.stage === 'subject' ? 'md:check' : 'md:chevron_right'"
                    size="18"
                    class="ml-2"
                  />
                </template>
              </v-list-item>
            </v-list>
            <p
              v-else
              class="pa-4 text-grey600"
              role="status"
            >
              No {{ column.title.toLowerCase() }} options available.
            </p>
          </div>
        </div>
      </v-card>
    </v-menu>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, ref, useId, watch } from 'vue'
import type { ComponentPublicInstance } from 'vue'
import type {
  DirectorySelectorColumn,
  DirectorySelectorStage,
  DirectorySelectorState,
  DirectorySubjectSearchResult,
  DirectorySubjectSearchState,
} from '~/types/subject-directory/cascader'

const props = defineProps<{
  state: DirectorySelectorState
  columns: DirectorySelectorColumn[]
  displayPath: string
  search: DirectorySubjectSearchState
  searchResults: DirectorySubjectSearchResult[]
}>()

const triggerId = useId()
const menuCard = ref<ComponentPublicInstance | null>(null)
const searchResultsId = `${triggerId}-subjects`
const activeResultIndex = ref(-1)
const isSearching = computed(() => Boolean(props.search.query.trim()))
const activeResultId = computed(() => isSearching.value && props.searchResults[activeResultIndex.value]
  ? `${searchResultsId}-${activeResultIndex.value}`
  : undefined)

const onSearchKeydown = (event: KeyboardEvent) => {
  if (event.isComposing) return
  if (event.key === 'Escape') {
    event.preventDefault()
    event.stopPropagation()
    emit('open', false)
    document.getElementById(triggerId)?.focus({ preventScroll: true })
    return
  }
  if (!isSearching.value) {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      const menu = menuCard.value?.$el as HTMLElement | undefined
      const options = menu?.querySelectorAll<HTMLElement>('.directory-cascader-column--current .v-list-item')
      const option = event.key === 'ArrowDown' ? options?.[0] : options?.[options.length - 1]
      if (option) {
        event.preventDefault()
        event.stopPropagation()
        option.focus({ preventScroll: true })
      }
    }
    return
  }
  if (!['ArrowDown', 'ArrowUp', 'Enter'].includes(event.key)) return
  event.preventDefault()
  event.stopPropagation()
  if (props.search.loading || props.state.committing || !props.searchResults.length) return
  if (event.key === 'Enter') {
    const result = props.searchResults[activeResultIndex.value]
    if (result) emit('selectSearch', result.id)
    return
  }
  const count = props.searchResults.length
  activeResultIndex.value = (activeResultIndex.value + (event.key === 'ArrowDown' ? 1 : -1) + count) % count
}

const scrollSelectedOptions = async () => {
  await nextTick()
  if (!props.state.open) return
  const menu = menuCard.value?.$el as HTMLElement | undefined
  menu?.querySelectorAll<HTMLElement>('.directory-cascader-options').forEach((column) => {
    const selected = column.querySelector<HTMLElement>('[data-selected="true"]')
    if (!selected || !column.clientHeight) return
    const bounds = column.getBoundingClientRect()
    const itemBounds = selected.getBoundingClientRect()
    // Scroll only the column, keeping the page and overlay in place.
    if (itemBounds.top < bounds.top) column.scrollTop += itemBounds.top - bounds.top
    else if (itemBounds.bottom > bounds.bottom) column.scrollTop += itemBounds.bottom - bounds.bottom
  })
}

watch([
  () => props.state.open,
  () => props.state.stage,
  () => props.state.loading,
  () => props.columns,
  () => props.searchResults,
  activeResultIndex,
], scrollSelectedOptions, { flush: 'post' })

watch(() => props.searchResults, (results) => {
  activeResultIndex.value = results.length ? 0 : -1
})

const emit = defineEmits<{
  open: [value: boolean]
  select: [stage: DirectorySelectorStage, id: string]
  navigate: [stage: DirectorySelectorStage]
  retry: []
  search: [query: string]
  selectSearch: [id: string]
  retrySearch: []
}>()
</script>

<style scoped>
.directory-cascader-trigger {
  font-size: 14px;
  font-weight: 500;
  letter-spacing: normal;
  color: rgb(var(--v-theme-directoryInk));
  border-color: rgb(var(--v-theme-directoryButtonBorder));
  border-radius: 12px;
  background-color: rgb(var(--v-theme-grey25));
  transition: background-color 160ms ease, border-color 160ms ease, box-shadow 160ms ease;
}

.directory-cascader-trigger:hover {
  background-color: rgb(var(--v-theme-surfaceSecondary));
}

.directory-cascader-trigger--open {
  border-color: rgb(var(--v-theme-directoryInk));
}

.directory-cascader-trigger:focus-visible {
  box-shadow: 0 0 0 3px rgb(var(--v-theme-academicGold) / 28%);
}

.directory-cascader-trigger :deep(.v-btn__content) {
  justify-content: flex-start;
  min-width: 0;
}

.directory-cascader-trigger :deep(.v-btn__append) {
  margin-inline-start: auto;
  padding-inline-start: 12px;
}

.directory-cascader-menu {
  display: flex;
  flex-direction: column;
  width: 740px;
  max-width: calc(100vw - 32px);
  overflow: hidden;
  color: rgb(var(--v-theme-directoryInk));
  border: 1px solid rgb(var(--v-theme-directoryButtonBorder));
  border-radius: 16px;
  box-shadow: 0 20px 48px rgb(var(--v-theme-directoryInk) / 16%);
}

.directory-cascader-search {
  border-bottom: 1px solid rgb(var(--v-theme-directoryButtonBorder));
}

.directory-cascader-search :deep(.v-field) {
  --v-input-control-height: 36px;
  --v-field-padding-top: 4px;
  --v-field-padding-bottom: 4px;
  font-size: 14px;
  color: rgb(var(--v-theme-directoryInk));
  background: rgb(var(--v-theme-white));
  border-radius: 12px !important;
  box-shadow: none;
}

.directory-cascader-search :deep(.v-field__outline) {
  color: rgb(var(--v-theme-directoryButtonBorder));
  --v-field-border-opacity: 1;
}

.directory-cascader-search :deep(.v-field--focused .v-field__outline) {
  color: rgb(var(--v-theme-academicGold));
}

.directory-cascader-search :deep(.v-field__prepend-inner),
.directory-cascader-search :deep(.v-field__input) {
  color: rgb(var(--v-theme-directoryInk));
}

.directory-cascader-result-path {
  font-size: 12px;
  line-height: 18px;
}

.directory-cascader-columns {
  display: flex;
  align-items: stretch;
  overflow: hidden;
}

.directory-cascader-column {
  display: flex;
  flex-direction: column;
  flex: 0 1 auto;
  width: 160px;
  min-width: 0;
  max-height: min(252px, 50dvh);
}

.directory-cascader-column + .directory-cascader-column {
  border-inline-start: 1px solid rgb(var(--v-theme-directoryButtonBorder));
}

.directory-cascader-column--grade {
  width: 220px;
}

.directory-cascader-column--subject {
  width: 360px;
}

.directory-cascader-options {
  min-height: 0;
  /* Six 34px rows plus the list's 4px top and bottom padding. */
  max-height: 212px;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: rgb(var(--v-theme-grey300)) transparent;
}

.directory-cascader-options::-webkit-scrollbar {
  width: 4px;
}

.directory-cascader-options::-webkit-scrollbar-thumb {
  background-color: rgb(var(--v-theme-grey300));
  border-radius: 4px;
}

.directory-cascader-options::-webkit-scrollbar-track {
  background-color: transparent;
}

.directory-cascader-option-title {
  font-size: 15px;
  font-weight: 500;
  line-height: 22px;
  white-space: nowrap;
}

.directory-cascader-option {
  color: rgb(var(--v-theme-directoryInk));
  background: transparent;
  border: 1px solid transparent;
  border-radius: 12px;
  transition: background-color 160ms ease, border-color 160ms ease, box-shadow 160ms ease;
}

.directory-cascader-option:not(:last-child) {
  border-bottom-color: rgb(var(--v-theme-directoryAnswer));
}

.directory-cascader-option:hover {
  background: rgb(var(--v-theme-surfaceSecondary));
  border-color: rgb(var(--v-theme-directoryButtonBorder));
}

.directory-cascader-option--active {
  color: rgb(var(--v-theme-directoryInk)) !important;
  background: rgb(var(--v-theme-directoryAnswer)) !important;
  border-color: rgb(var(--v-theme-directoryButtonBorder));
  box-shadow: 0 1px 2px rgb(var(--v-theme-directoryInk) / 8%);
}

.directory-cascader-option:focus-visible {
  outline: 2px solid rgb(var(--v-theme-academicGold) / 28%);
  outline-offset: -2px;
}

.directory-cascader-option :deep(.v-list-item__overlay) {
  opacity: 0 !important;
}

.directory-cascader-option :deep(.v-list-item__spacer) {
  display: none;
}

@media (prefers-reduced-motion: reduce) {
  .directory-cascader-trigger,
  .directory-cascader-option {
    transition: none;
  }
}

@media (max-width: 599px) {
  .directory-cascader-menu {
    width: calc(100vw - 32px);
  }

  .directory-cascader-column {
    display: none;
    width: 100%;
    border-inline-start: 0 !important;
  }

  .directory-cascader-column--current {
    display: flex;
  }
}
</style>
