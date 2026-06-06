<template>
  <v-form
    class="w-100 d-flex flex-column pa-4"
  >
    <div class="w-100 d-flex flex-column align-start">
      <div class="w-100 d-flex flex-column align-start justify-start ga-1">
        <v-text-field
          v-model="inputText"
          rounded="pill"
          height="48"
          placeholder="Enter Skills"
          variant="outlined"
          autocomplete="off"
          persistent-clear
          base-color="grey200"
          color="primary"
          active-color="primary"
          bg-color="white"
          class="w-100"
          @keydown.enter.prevent="addKeywords"
        >
          <template #append-inner>
            <v-btn
              icon
              color="primary"
              size="x-small"
              flat
              rounded="circle"
              @click="addKeywords"
            >
              <v-icon
                size="x-large"
                icon="md:subdirectory_arrow_left"
                color="grey800"
              />
            </v-btn>
          </template>
        </v-text-field>
        <span class="text-h5 font-weight-medium text-grey400 mt-1">You can also use commas</span>

        <div
          class="d-flex flex-wrap ga-1 mt-3"
        >
          <v-chip
            v-for="item in localSkills"
            :key="item"
            variant="flat"
            color="primary50"
            closable
            @click:close="removeKeyword(item)"
          >
            <span class="text-h5 font-weight-medium text-primary">{{ item }}</span>
            <template #close>
              <v-icon
                color="#0000008A"
                size="18"
              >
                md:cancel
              </v-icon>
            </template>
          </v-chip>
        </div>
      </div>
    </div>
    <div class="w-100 d-flex justify-center align-center ga-2 mt-16">
      <v-btn
        color="grey200"
        variant="outlined"
        rounded="pill"
        height="38"
        width="80"
        class="text-h5 font-weight-medium"
        flat
        :loading="loadingEditItem"
        @click="closeModal"
      >
        <span class="text-grey800">
          Discard
        </span>
      </v-btn>
      <v-btn
        color="primary"
        rounded="pill"
        height="38"
        width="220"
        class="text-h5 text-grey800 font-weight-medium"
        flat
        :loading="loadingEditItem"
        @click="save"
      >
        Submit
      </v-btn>
    </div>
  </v-form>
</template>

<script setup lang="ts">
interface IModalSkills {
  skills?: string[] | null
}

const props = defineProps<IModalSkills>()
const emit = defineEmits(['close', 'success'])

const { editItem, loadingEditItem } = useProfile()

const localSkills = ref<string[]>(props.skills ? [...props.skills] : [])
const inputText = ref('')

const addKeywords = () => {
  if (!inputText.value.trim()) return
  const newKeywords = inputText.value
    .split(',')
    .map(k => k.trim())
    .filter(k => k.length > 0)

  const uniqueKeywords = newKeywords.filter(
    k => !localSkills.value.includes(k),
  )

  if (uniqueKeywords.length) {
    localSkills.value = [
      ...localSkills.value,
      ...uniqueKeywords,
    ]
  }

  inputText.value = ''
}

const removeKeyword = (keyword: string) => {
  localSkills.value = localSkills.value.filter(k => k !== keyword)
}

const closeModal = () => {
  emit('close')
}

const save = async () => {
  const response = await editItem({
    skills: localSkills.value,
  })

  if (response?.succeeded) {
    emit('success', {
      skills: localSkills.value,
    })
    emit('close')
  }
}
</script>

<style scoped>
</style>
