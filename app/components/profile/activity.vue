<template>
  <section class="profile-section bg-surface rounded-lg border-sm border-opacity-100 border-grey200 pa-4 pa-sm-6">
    <div class="d-flex align-center ga-2 mb-1">
      <v-avatar
        color="primary50"
        rounded="lg"
        size="36"
      >
        <v-icon
          icon="md:insights"
          color="primaryStrong"
          size="20"
        />
      </v-avatar>
      <h2 class="text-h6 text-sm-h4 font-weight-bold text-grey900">
        Learning activity
      </h2>
    </div>
    <p class="text-body-1 text-grey500 mb-5">
      Interests and recent learning milestones from across GamaTrain.
    </p>

    <v-row>
      <v-col
        cols="12"
        md="4"
      >
        <div class="activity-overview h-100 rounded-lg border-sm border-opacity-100 border-primary100 pa-4 pa-sm-5">
          <span class="text-caption font-weight-bold text-primaryStrong text-uppercase">At a glance</span>
          <h3 class="text-h5 font-weight-bold text-grey900 mt-2 mb-1">
            An active learner
          </h3>
          <p class="text-body-1 text-grey500 mb-5">
            Exploring mathematics, physics and effective teaching methods.
          </p>

          <div class="d-flex flex-column ga-3">
            <div
              v-for="stat in activityStats"
              :key="stat.label"
              class="activity-stat d-flex align-center ga-3 rounded-lg border-sm border-opacity-100 border-grey100 pa-3"
            >
              <v-avatar
                :color="stat.background"
                rounded="lg"
                size="40"
              >
                <v-icon
                  :icon="stat.icon"
                  :color="stat.color"
                  size="21"
                />
              </v-avatar>
              <div>
                <div class="text-h6 font-weight-bold text-grey900">
                  {{ stat.value }}
                </div>
                <div class="text-caption text-grey500">
                  {{ stat.label }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </v-col>

      <v-col
        cols="12"
        md="8"
      >
        <div class="activity-feed h-100 rounded-lg border-sm border-opacity-100 border-grey100 pa-4 pa-sm-5">
          <div class="d-flex align-center justify-space-between mb-4">
            <h3 class="text-body-1 font-weight-bold text-grey900">
              Recent activity
            </h3>
            <v-chip
              color="greenLight25"
              variant="flat"
              size="small"
            >
              <span class="activity-live-dot rounded-circle bg-success500 mr-2" />
              <span class="text-caption font-weight-medium text-greenLight700">Active this week</span>
            </v-chip>
          </div>

          <div class="activity-timeline">
            <div
              v-for="(activity, index) in activities"
              :key="activity.id"
              class="activity-item d-flex ga-3 position-relative"
              :class="{ 'pb-5': index < activities.length - 1 }"
            >
              <div class="activity-marker d-flex flex-column align-center flex-shrink-0">
                <v-avatar
                  :color="activity.background"
                  size="40"
                >
                  <v-icon
                    :icon="activity.icon"
                    :color="activity.color"
                    size="20"
                  />
                </v-avatar>
                <div
                  v-if="index < activities.length - 1"
                  class="activity-line flex-grow-1 mt-2"
                />
              </div>

              <div class="activity-item__content flex-grow-1 rounded-lg border-sm border-opacity-100 border-grey100 px-3 py-2">
                <div class="d-flex flex-column flex-sm-row align-sm-start justify-space-between ga-1">
                  <div>
                    <p class="text-body-1 text-grey700">
                      <span class="font-weight-bold text-grey900">{{ activity.action }}</span>
                      {{ activity.title }}
                    </p>
                    <div class="d-flex flex-wrap ga-2 mt-2">
                      <v-chip
                        v-for="tag in activity.tags"
                        :key="tag"
                        color="grey100"
                        variant="flat"
                        size="x-small"
                      >
                        <span class="text-caption text-grey600">{{ tag }}</span>
                      </v-chip>
                    </div>
                  </div>
                  <span class="text-caption text-grey400 flex-shrink-0">{{ activity.time }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </v-col>
    </v-row>
  </section>
</template>

<script setup lang="ts">
const activityStats = [
  { value: 24, label: 'Resources downloaded', icon: 'md:download', color: 'info', background: 'blue50' },
  { value: 11, label: 'Exams completed', icon: 'md:fact_check', color: 'success500', background: 'greenLight25' },
  { value: 7, label: 'Topics explored', icon: 'md:explore', color: 'primaryStrong', background: 'primary50' },
]

const activities = [
  {
    id: 1,
    action: 'Completed an exam',
    title: '— Advanced Algebra Progress Test',
    time: '2 days ago',
    tags: ['Mathematics', 'Score 88%'],
    icon: 'md:check',
    color: 'success500',
    background: 'greenLight25',
  },
  {
    id: 2,
    action: 'Downloaded a past paper',
    title: '— Cambridge Physics Paper 4',
    time: '4 days ago',
    tags: ['Physics', 'Past paper'],
    icon: 'md:download',
    color: 'info',
    background: 'blue50',
  },
  {
    id: 3,
    action: 'Started a tutorial',
    title: '— Teaching Probability Through Real Examples',
    time: '1 week ago',
    tags: ['Teaching', 'Probability'],
    icon: 'md:play_arrow',
    color: 'primaryStrong',
    background: 'primary50',
  },
  {
    id: 4,
    action: 'Read a blog post',
    title: '— Building Better Classroom Assessments',
    time: '2 weeks ago',
    tags: ['Assessment', 'Classroom'],
    icon: 'md:article',
    color: 'warning500',
    background: 'primary50',
  },
]
</script>

<style scoped>
.profile-section {
  box-shadow: 0 12px 30px rgba(var(--v-theme-grey400), 0.14);
}

.activity-overview {
  background: linear-gradient(145deg, rgb(var(--v-theme-primary50)), rgb(var(--v-theme-surface)) 70%);
}

.activity-stat,
.activity-item__content {
  background: rgba(var(--v-theme-surface), 0.82);
}

.activity-live-dot {
  width: 7px;
  height: 7px;
}

.activity-marker {
  width: 40px;
}

.activity-line {
  width: 1px;
  min-height: 20px;
  background: rgb(var(--v-theme-grey200));
}
</style>
