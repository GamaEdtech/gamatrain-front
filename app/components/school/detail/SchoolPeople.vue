<template>
  <section
    v-if="total"
    id="people"
    class="detail-section"
    aria-labelledby="people-title"
  >
    <div class="section-head d-flex align-center justify-space-between ga-2">
      <h2
        id="people-title"
        class="section-title"
      >
        People at this school
      </h2>
    </div>

    <div class="d-flex flex-wrap ga-2 mt-3">
      <v-chip
        v-for="item in sortedCounts"
        :key="item.role"
        color="grey800"
        variant="tonal"
        class="font-weight-medium"
      >
        {{ schoolRoleCount(item.role, item.count) }}
      </v-chip>
    </div>

    <v-list
      v-if="named.length"
      class="people-list mt-2 pa-0"
      bg-color="transparent"
      aria-label="Teachers and staff"
    >
      <v-list-item
        v-for="person in named"
        :key="person.handle ?? person.fullName ?? ''"
        :to="person.handle ? `/profile/${person.handle}` : undefined"
        class="px-0"
        rounded="lg"
      >
        <template #prepend>
          <v-avatar
            color="primary50"
            size="44"
            class="me-3"
          >
            <!-- A plain <img>, as on the teacher directory: v-avatar's `image` goes through v-img. -->
            <img
              v-if="person.avatarUri"
              :src="person.avatarUri"
              alt=""
              width="44"
              height="44"
              loading="lazy"
              decoding="async"
              class="w-100 h-100"
            >
            <span
              v-else
              class="font-weight-bold text-primaryStrong"
            >{{ initials(person.fullName) }}</span>
          </v-avatar>
        </template>
        <v-list-item-title class="font-weight-medium text-grey900">
          {{ person.fullName }}
        </v-list-item-title>
        <v-list-item-subtitle>{{ schoolRoleLabel(person.role) }}</v-list-item-subtitle>
        <template
          v-if="person.handle"
          #append
        >
          <v-icon
            size="18"
            color="grey500"
            aria-hidden="true"
          >
            mdi-chevron-right
          </v-icon>
        </template>
      </v-list-item>
    </v-list>

    <p class="ma-0 mt-3 people-note text-grey600">
      Teachers and staff are named only when they choose to be. Students, parents and former students are counted, never named.
    </p>
  </section>
</template>

<script setup lang="ts">
import type { SchoolMemberRole } from '@/types'

const props = defineProps<{ schoolId: number | string }>()

const { people, total, loadPeople } = useSchoolMembers(() => props.schoolId)

onMounted(loadPeople)
watch(() => props.schoolId, loadPeople)

const ORDER: SchoolMemberRole[] = ['Teacher', 'Staff', 'Student', 'Parent', 'Alumni']
const sortedCounts = computed(() =>
  [...(people.value?.counts ?? [])].sort((a, b) => ORDER.indexOf(a.role) - ORDER.indexOf(b.role)))
const named = computed(() => people.value?.namedMembers ?? [])

const initials = (name: string | null) =>
  (name ?? '').split(/\s+/).filter(Boolean).slice(0, 2).map(word => word[0]).join('').toUpperCase() || '?'
</script>

<style scoped>
.people-note {
  font-size: 13px;
  line-height: 1.5;
}
</style>
