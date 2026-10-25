<template>
  <div class="w-100 d-flex flex-column align-start justify-start ga-6">
    <div class="d-flex flex-column ga-1">
      <h1 class="text-h4 font-weight-bold text-grey700">
        Invite &amp; Earn
      </h1>
      <span class="text-h6 text-grey500">Invite your students to Gamatrain and earn from their subscriptions.</span>
    </div>

    <template v-if="loadingStatus && !status">
      <v-skeleton-loader
        height="260"
        class="w-100 rounded-xl"
      />
      <v-skeleton-loader
        height="140"
        class="w-100 rounded-xl"
      />
    </template>

    <div
      v-else-if="status && !status.isTeacher"
      class="w-100 bg-grey100 rounded-xl pa-8 d-flex flex-column align-center text-center ga-3"
    >
      <v-icon
        size="48"
        color="grey400"
      >
        md:school
      </v-icon>
      <span class="text-h5 font-weight-bold text-grey700">The invite program is for teachers</span>
      <span class="text-h6 text-grey500">
        Teachers earn a share of the subscriptions bought by the students they invite. If you teach and your account
        is set up as a student, send us a message and we'll switch it.
      </span>
      <v-btn
        to="/user/ticket"
        color="primary"
        rounded="pill"
        flat
        class="text-h5 font-weight-bold text-grey900 mt-2"
      >
        Message support
      </v-btn>
    </div>

    <user-invite-join-offer
      v-else-if="status && !status.joined"
      :status="status"
      :loading="loadingJoin"
      @join="joinProgram"
    />

    <template v-else-if="status">
      <v-row class="w-100 ma-0">
        <v-col
          v-for="item in summary"
          :key="item.title"
          cols="6"
          lg="3"
          class="pa-1 pa-sm-2"
        >
          <div class="summary-card h-100 bg-grey100 rounded-lg pa-4 d-flex flex-column justify-space-between ga-2">
            <div class="d-flex align-center justify-space-between ga-2">
              <span class="text-h6 text-grey500 font-weight-medium">{{ item.title }}</span>
              <v-icon
                size="22"
                :color="item.iconColor"
              >
                {{ item.icon }}
              </v-icon>
            </div>
            <span class="text-h4 font-weight-bold text-grey700 text-truncate">{{ item.value }}</span>
            <span
              v-if="item.hint"
              class="text-subtitle-1 text-grey500"
            >{{ item.hint }}</span>
            <nuxt-link
              v-if="item.link"
              :to="item.link.to"
              class="text-subtitle-1 font-weight-bold text-info text-decoration-none"
            >
              {{ item.link.label }}
            </nuxt-link>
          </div>
        </v-col>
      </v-row>

      <user-invite-link-builder
        v-if="status.referralCode"
        :code="status.referralCode"
      />

      <user-invite-invited-users />

      <user-invite-how-it-works />
    </template>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'dashboard-layout',
  middleware: ['auth', 'user-type'],
})

useHead({
  title: 'Invite & Earn',
  meta: [
    { name: 'description', content: 'Invite your students to Gamatrain and earn a share of their subscriptions.' },
  ],
})

const { $toast } = useNuxtApp()
const { formatLocal } = useDateTime()
const { status, loadingStatus, getStatus, join, loadingJoin } = useReferral()

const formatPercent = (value: number | null) => `${Number(value ?? 0).toLocaleString('en-US', { maximumFractionDigits: 2 })}%`
const formatUsd = (value: number) => `$${Number(value).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

const summary = computed(() => {
  const s = status.value
  if (!s) return []
  return [
    {
      title: 'Your rate',
      value: formatPercent(s.percent),
      icon: 'md:lock',
      iconColor: 'primary',
      hint: s.joinedDate ? `Locked for life on ${formatLocal(s.joinedDate, 'D MMM YYYY')}` : '',
    },
    { title: 'Signed up', value: s.invitedCount.toLocaleString('en-US'), icon: 'md:group', iconColor: 'info', hint: 'through your links' },
    { title: 'Paying', value: s.subscribedCount.toLocaleString('en-US'), icon: 'md:workspace_premium', iconColor: 'success', hint: 'made a subscription payment' },
    {
      title: 'Earned',
      value: formatUsd(s.earnedUsd),
      icon: 'md:paid',
      iconColor: 'success',
      link: { to: '/user/commission', label: 'View balance & withdraw' },
    },
  ]
})

const joinProgram = async () => {
  if (await join()) {
    $toast.success(`You're in! Your ${formatPercent(status.value?.percent ?? null)} rate is locked for life.`)
  }
}

onMounted(getStatus)
</script>

<style scoped>
.summary-card {
  min-height: 116px;
}
</style>
