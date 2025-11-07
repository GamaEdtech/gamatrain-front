<template>
  <v-card
    id="scroll-target"
    min-height="256"
    :disabled="!topicList.length"
    flat
    style="border: 1px solid rgba(0, 0, 0, 0.42)"
    class="overflow-y-auto filter-container"
  >
    <v-card-title>
      <p class="text-h5">
        Topics
      </p>
    </v-card-title>
    <v-card-text
      v-if="topicList.length === 0"
      cols="12"
    >
      <p
        v-if="!lesson_selected"
        class="text-h5"
      >
        Please first select lesson
      </p>
      <p
        v-else
        class="text-h5"
      >
        This lesson hasn't any topics
      </p>
    </v-card-text>
    <v-card-text v-else>
      <v-row
        align="center"
        justify="center"
        style="height: 210px; overflow-x: hidden"
      >
        <v-col cols="12">
          <v-checkbox
            v-for="item in topicList"
            :key="item.id"
            v-model="topic"
            :value="item.id"
            hide-details="true"
            multiple
            class="small"
            color="#FFB300"
          >
            <template #label>
              <span :class="[item.season ? 'topic_season' : '', 'text-h5']">{{
                item.title
              }}</span>
            </template>
          </v-checkbox>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: 'TopicSelector',
  props: {
    topicList: {
      type: Array,
      required: false,
      default: () => [],
      validator(value) {
        return value.every(item =>
          typeof item === 'object'
          && 'id' in item
          && 'title' in item,
        )
      },
    },
    selectedTopics: {
      type: Array,
      required: false,
      default: () => [],
    },
  },
  emits: ['selectTopic'],
  data() {
    return {
      topic: this.selectedTopics || [],
      lesson_selected: false,
    }
  },
  watch: {
    topic(val) {
      this.$emit('selectTopic', val)
    },
  },
}
</script>

<style scoped>
.topic_season {
  font-weight: bolder !important;
  color: blue !important;
}
</style>
