<template>
  <!-- The quiet way in: always there for someone not yet a member, also after "Not now" on the card. -->
  <div
    v-if="ready && !isMember && roles.length"
    class="d-flex align-center flex-wrap ga-1 join-hint"
  >
    <span class="text-grey600">Teach, study or have a child here?</span>
    <v-btn
      variant="text"
      color="info"
      size="small"
      class="text-none gtext-t5 px-1"
      @click="open"
    >
      Join this school
    </v-btn>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{ schoolId: number | string }>()

const { roles, isMember, undismiss, loadRoles, loadMine } = useSchoolMembers(() => props.schoolId)

// Membership is only known in the browser, after loading; showing the line before that would flash it for members.
const ready = ref(false)
onMounted(async () => {
  await Promise.all([loadRoles(), loadMine()]).catch(() => {})
  ready.value = true
})

async function open() {
  undismiss()
  await nextTick()
  document.getElementById('join-school')?.scrollIntoView({ behavior: 'smooth', block: 'center' })
}
</script>

<style scoped>
.join-hint {
  font-size: 14px;
}
</style>
