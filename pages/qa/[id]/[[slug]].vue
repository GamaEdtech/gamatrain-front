<template>
  <div>
    <div id="qa-details-content">
      <!-- Start: Category (Need to be Refactor - commented) -->
      <!-- <category /> -->
      <!-- End: Category -->

      <!--  Start: breadcrumb  -->
      <section>
        <v-container class="py-0 mb-8 mb-md-0">
          <div style="overflow-x: auto !important">
            <div style="min-width: max-content">
              <div class="mt-0 py-0 header-path">
                <breadcrumb :breads="breads" />
              </div>
            </div>
          </div>
        </v-container>
      </section>
      <!--  End: breadcrumb  -->

      <!--  Start: detail  -->
      <section>
        <v-container class="py-0">
          <div class="detail my-md-8">
            <v-row>
              <v-col
                cols="12"
                md="9"
                class="pt-0 px-sm-3 pt-sm-3"
              >
                <!--
                Ask question button
                (All $vuetify plugin
                replaced with display )
                -->
                <div class="text-left d-block d-md-none">
                  <v-btn
                    :density="
                      display.mdAndUp == true ? 'default' : 'comfortable'
                    "
                    rounded
                    outlined
                    small
                    class="primary gama-text-body2 mb-2 mx-auto text-transform-none mb-6"
                    @click="openQuestionForm()"
                  >
                    Ask Question
                  </v-btn>
                </div>
                <!-- End ask question button -->
                <!-- Question section -->
                <v-row>
                  <v-col
                    cols="12"
                    class="pt-0 px-sm-3 pt-sm-3"
                  >
                    <v-row class="fill-height">
                      <!-- Score action -->
                      <v-col
                        cols="1"
                        class="pr-0 d-none d-md-block"
                      >
                        <v-card
                          flat
                          color="#EEEEEE"
                          class="d-flex fill-height text-center"
                          min-height="200"
                        >
                          <v-row>
                            <v-col cols="12">
                              <v-btn
                                icon
                                variant="plain"
                                class="mb-4 mt-0"
                                @click="
                                  submitScore(
                                    'question',
                                    contentData.id,
                                    'plus',
                                  )
                                "
                              >
                                <v-icon size="88">
                                  mdi-menu-up
                                </v-icon>
                              </v-btn>
                              <p class="text-h4">
                                {{ contentData?.score }}
                              </p>
                              <v-btn
                                icon
                                variant="plain"
                                class="mb-4 mt-0"
                                @click="
                                  submitScore(
                                    'question',
                                    contentData.id,
                                    'minus',
                                  )
                                "
                              >
                                <v-icon size="88">
                                  mdi-menu-down
                                </v-icon>
                              </v-btn>
                              <v-btn
                                icon
                                variant="plain"
                                width="100%"
                              >
                                <v-icon size="22">
                                  mdi-bookmark
                                </v-icon>
                              </v-btn>
                              <v-btn
                                icon
                                variant="plain"
                                width="100%"
                                @click="
                                  openCrashReportDialog(
                                    contentData.id,
                                    'question',
                                  )
                                "
                              >
                                <v-icon size="22">
                                  mdi-alert-octagon-outline
                                </v-icon>
                              </v-btn>
                              <v-btn
                                variant="plain"
                                icon
                                class="mb-4"
                                width="100%"
                              >
                                <v-icon size="22">
                                  mdi-share-variant-outline
                                </v-icon>
                              </v-btn>
                            </v-col>
                          </v-row>
                        </v-card>
                      </v-col>
                      <!-- End score action -->

                      <v-col
                        cols="12"
                        md="11"
                      >
                        <v-card
                          ref="questionMathJaxContainerRef"
                          color="#EEEEEE"
                          flat
                          class="fill-height"
                        >
                          <v-card-text class="d-flex fill-height">
                            <v-row>
                              <v-col
                                cols="12"
                                class="px-sm-3"
                              >
                                <h1 class="gama-text-h6 mb-2">
                                  {{ contentData?.title }}
                                </h1>
                                <v-row>
                                  <v-col
                                    cols="10"
                                    class="pl-0 pl-sm-3"
                                  >
                                    <div class="d-flex pb-sm-0 pb-md-3">
                                      <NuxtLink to="/user/profile">
                                        <img
                                          v-if="contentData.avatar"
                                          width="40"
                                          height="40"
                                          :src="contentData?.avatar"
                                        >
                                        <v-btn
                                          v-else
                                          width="40"
                                          height="40"
                                          class="d-flex"
                                          outlined
                                          fab
                                          x-large
                                        >
                                          <v-icon> mdi-account-outline </v-icon>
                                        </v-btn>
                                      </NuxtLink>
                                      <div class="pa-3 pt-0">
                                        <p class="gama-text-h6">
                                          <span v-if="contentData.name">
                                            {{ contentData?.name }}
                                          </span>
                                          <span v-else> No name </span>
                                        </p>
                                        <p class="text-h6 text-warning">
                                          <span
                                            v-show="contentData.stats?.qNum > 0"
                                          >
                                            <span class="text-warning">
                                              {{ contentData.stats?.qNum }}
                                              Qn
                                            </span>
                                            |
                                          </span>

                                          <span
                                            v-show="contentData.stats?.aNum > 0"
                                            class="text-success"
                                          >
                                            {{ contentData.stats?.aNum }}
                                            Ans
                                          </span>
                                          <span
                                            v-show="
                                              contentData.stats?.aNum > 0
                                                || contentData.stats?.score > 0
                                            "
                                          >
                                            |
                                          </span>
                                          <span
                                            v-show="
                                              contentData.stats?.score > 0
                                            "
                                          >
                                            <span class="text-info">
                                              {{ contentData.stats?.score }}
                                              Score
                                            </span>
                                          </span>
                                        </p>
                                      </div>
                                    </div>
                                  </v-col>

                                  <v-col
                                    cols="2"
                                    class="text-right"
                                  >
                                    <v-btn
                                      rounded
                                      density="comfortable"
                                      width="100"
                                      :variant="
                                        display.mdAndUp ? 'outlined' : 'flat'
                                      "
                                      :icon="display.xs"
                                      color="success"
                                      :to="`/direct/${contentData.ownerIdentity}`"
                                    >
                                      <v-icon
                                        class="mr-1"
                                        size="22"
                                      >
                                        mdi-message-reply-text
                                      </v-icon>
                                      <span class="d-none d-md-inline">Chat</span>
                                    </v-btn>
                                  </v-col>
                                </v-row>

                                <p
                                  class="mt-2 gama-text-body1"
                                  v-html="
                                    contentData.question
                                      ? contentData.question
                                      : ''
                                  "
                                />
                              </v-col>

                              <v-col
                                cols="12"
                                class="px-sm-3 pb-sm-3"
                                align-self="end"
                              >
                                <v-row>
                                  <v-col
                                    cols="7"
                                    md="8"
                                    class="pb-sm-0 px-sm-3 pb-sm-3"
                                  >
                                    <div class="d-none d-md-block">
                                      <v-chip
                                        small
                                        density="comfortable"
                                        link
                                        :to="`/search?type=question&section=${contentData.section}`"
                                        class="mr-1"
                                      >
                                        {{ contentData.section_title }}
                                      </v-chip>
                                      <v-chip
                                        small
                                        density="comfortable"
                                        link
                                        :to="`/search?type=question&section=${contentData.section}&base=${contentData.base}`"
                                        class="mr-1"
                                      >
                                        {{ contentData.base_title }}
                                      </v-chip>
                                      <v-chip
                                        small
                                        density="comfortable"
                                        link
                                        class="ma-1"
                                        :to="`/search?type=question&section=${contentData.section}&base=${contentData.base}&lesson=${contentData.lesson}`"
                                      >
                                        {{ contentData.lesson_title }}
                                      </v-chip>
                                    </div>

                                    <div class="d-flex d-md-none">
                                      <!-- Score action sm and xs -->
                                      <v-btn
                                        variant="plain"
                                        icon
                                        @click="
                                          submitScore(
                                            'question',
                                            contentData.id,
                                            'plus',
                                          )
                                        "
                                      >
                                        <v-icon size="40">
                                          mdi-menu-up
                                        </v-icon>
                                      </v-btn>
                                      <p class="pt-3">
                                        {{ contentData?.score }}
                                      </p>
                                      <v-btn
                                        variant="plain"
                                        icon
                                        @click="
                                          submitScore(
                                            'question',
                                            contentData.id,
                                            'minus',
                                          )
                                        "
                                      >
                                        <v-icon size="40">
                                          mdi-menu-down
                                        </v-icon>
                                      </v-btn>
                                      <!-- End score action sm and xs -->

                                      <p class="pt-3">
                                        |
                                      </p>
                                      <v-btn
                                        variant="plain"
                                        icon
                                      >
                                        <v-icon size="20">
                                          mdi-reply
                                        </v-icon>
                                      </v-btn>
                                      <v-btn
                                        variant="plain"
                                        icon
                                      >
                                        <v-icon size="20">
                                          mdi-comment-plus
                                        </v-icon>
                                      </v-btn>
                                      <v-spacer />
                                    </div>
                                  </v-col>
                                  <v-col
                                    cols="5"
                                    md="4"
                                    class="px-sm-0 pb-sm-0 text-right"
                                  >
                                    <div class="d-none d-md-block">
                                      <v-spacer />
                                      <v-btn
                                        style="
                                          color: #000;
                                          font-size: 11px;
                                          opacity: unset;
                                        "
                                        variant="plain"
                                        class="simple-btn text-dark"
                                      >
                                        <v-icon
                                          class="mr-1"
                                          size="22"
                                        >
                                          mdi-calendar-month
                                        </v-icon>
                                        {{
                                          $dayjs(contentData.subdate).fromNow()
                                        }}
                                      </v-btn>
                                      <v-btn
                                        style="
                                          color: #000;
                                          font-size: 11px;
                                          opacity: unset;
                                        "
                                        variant="plain"
                                        class="simple-btn text-dark"
                                      >
                                        <v-icon
                                          class="mr-1"
                                          size="22"
                                        >
                                          mdi-clock-time-five-outline
                                        </v-icon>
                                        {{
                                          $dayjs(contentData.subdate).format(
                                            "HH:mm",
                                          )
                                        }}
                                      </v-btn>
                                    </div>

                                    <div class="d-inline d-md-none px-sm-0">
                                      <v-btn
                                        variant="plain"
                                        icon
                                      >
                                        <v-icon size="20">
                                          mdi-bookmark
                                        </v-icon>
                                      </v-btn>
                                      <v-btn
                                        variant="plain"
                                        icon
                                        @click="
                                          openCrashReportDialog(
                                            contentData.id,
                                            'question',
                                          )
                                        "
                                      >
                                        <v-icon size="20">
                                          mdi-alert-octagon-outline
                                        </v-icon>
                                      </v-btn>
                                      <v-btn
                                        variant="plain"
                                        icon
                                      >
                                        <v-icon size="20">
                                          mdi-share-variant-outline
                                        </v-icon>
                                      </v-btn>
                                    </div>
                                  </v-col>
                                </v-row>
                              </v-col>
                            </v-row>
                          </v-card-text>
                        </v-card>
                      </v-col>
                    </v-row>
                  </v-col>
                </v-row>
                <!-- End question section -->

                <!-- Reply section -->
                <v-row>
                  <v-col
                    cols="3"
                    md="2"
                  >
                    <h2 class="text-h5 text-md-h4">
                      {{ answer_list.length }}
                      <span v-if="answer_list.length > 1">Answers</span>
                      <span v-else>Answer</span>
                    </h2>
                  </v-col>
                  <v-col
                    cols="9"
                    md="10"
                  >
                    <v-divider class="my-3" />
                  </v-col>
                </v-row>

                <!-- Answer section -->
                <v-row ref="answersListMathJaxContainerRef">
                  <v-col
                    cols="12"
                    class="pt-0 px-sm-3 pt-sm-3"
                  >
                    <v-row
                      v-for="answer in answer_list"
                      :key="answer.id"
                    >
                      <!-- Score action -->
                      <v-col
                        cols="1"
                        class="pr-0 d-none d-md-block"
                      >
                        <v-card
                          flat
                          color="#FAFAFA"
                          class="d-flex fill-height text-center"
                          min-height="200"
                        >
                          <v-row>
                            <v-col cols="12">
                              <v-btn
                                icon
                                variant="plain"
                                class="mb-4 mt-0"
                                @click="
                                  submitScore(
                                    'question',
                                    contentData.id,
                                    'plus',
                                  )
                                "
                              >
                                <template #default>
                                  <v-icon size="88">
                                    mdi-menu-up
                                  </v-icon>
                                </template>
                              </v-btn>
                              <p class="text-h4">
                                {{ contentData?.score }}
                              </p>
                              <v-btn
                                icon
                                variant="plain"
                                class="mb-4"
                                @click="
                                  submitScore(
                                    'question',
                                    contentData.id,
                                    'minus',
                                  )
                                "
                              >
                                <template #default>
                                  <v-icon size="88">
                                    mdi-menu-down
                                  </v-icon>
                                </template>
                              </v-btn>
                              <v-btn
                                variant="plain"
                                icon
                              >
                                <v-icon size="22">
                                  mdi-bookmark
                                </v-icon>
                              </v-btn>
                              <v-btn
                                variant="plain"
                                icon
                                @click="
                                  openCrashReportDialog(
                                    contentData.id,
                                    'question',
                                  )
                                "
                              >
                                <v-icon size="22">
                                  mdi-alert-octagon-outline
                                </v-icon>
                              </v-btn>
                              <v-btn
                                variant="plain"
                                icon
                              >
                                <v-icon size="22">
                                  mdi-share-variant-outline
                                </v-icon>
                              </v-btn>
                            </v-col>
                          </v-row>
                        </v-card>
                      </v-col>
                      <!-- End score action -->

                      <v-col
                        cols="12"
                        md="11"
                      >
                        <v-card
                          :color="
                            answer.selected == 1 ? '#5EFF8126' : '#FAFAFA'
                          "
                          flat
                          class="fill-height"
                        >
                          <v-card-text class="d-flex fill-height">
                            <v-row>
                              <v-col
                                cols="12"
                                class="px-sm-3 pb-0"
                              >
                                <v-row>
                                  <v-col
                                    cols="10"
                                    class="pl-0 pl-sm-3"
                                  >
                                    <div class="d-flex pbs-sm-0">
                                      <nuxt-link to="/user/profile">
                                        <img
                                          v-if="answer.avatar"
                                          width="40"
                                          height="40"
                                          :src="answer.avatar"
                                        >
                                        <v-btn
                                          v-else
                                          width="47"
                                          height="47"
                                          class="d-flex"
                                          outlined
                                          fab
                                          x-large
                                        >
                                          <v-icon> mdi-account-outline </v-icon>
                                        </v-btn>
                                      </nuxt-link>
                                      <div class="pa-3 pt-0">
                                        <p class="gama-text-h6">
                                          <span v-if="answer.name">
                                            {{ answer.name }}
                                          </span>
                                          <strong v-else> No name </strong>
                                        </p>
                                        <p class="text-h6">
                                          <span v-show="answer.stats?.qNum > 0">
                                            <span class="text-warning">
                                              {{ answer.stats?.qNum }} Qn
                                            </span>
                                            |
                                          </span>

                                          <span
                                            v-show="answer.stats?.aNum > 0"
                                            class="text-success"
                                          >
                                            {{ answer.stats?.aNum }} Ans
                                          </span>
                                          <span
                                            v-show="
                                              answer.stats?.score > 0
                                                || answer.stats?.aNum > 0
                                            "
                                          >
                                            |
                                          </span>
                                          <span
                                            v-show="answer.stats?.score"
                                            class="text-info"
                                          >
                                            {{ answer.stats?.score }} Score
                                          </span>
                                        </p>
                                      </div>
                                    </div>
                                  </v-col>
                                  <v-col
                                    cols="2"
                                    class="text-right"
                                  >
                                    <v-btn
                                      rounded
                                      density="comfortable"
                                      width="100"
                                      variant="outlined"
                                      :outlined="display.mdAndUp"
                                      :icon="display.xs"
                                      :to="`/direct/${answer.ownerIdentity}`"
                                      color="success"
                                    >
                                      <v-icon
                                        class="mr-1"
                                        size="22"
                                      >
                                        mdi-message-reply-text
                                      </v-icon>
                                      <span class="d-none d-md-inline">Chat</span>
                                    </v-btn>
                                  </v-col>
                                </v-row>
                              </v-col>
                              <v-col
                                cols="12"
                                class="pt-0"
                              >
                                <div>
                                  <p
                                    class="mt-2 gama-text-body1"
                                    v-html="answer.answer"
                                  />
                                </div>
                              </v-col>

                              <v-col
                                cols="12"
                                class="px-sm-3 pb-sm-3"
                                align-self="end"
                              >
                                <v-row>
                                  <v-col
                                    cols="7"
                                    md="6"
                                    class="px-sm-3 pb-sm-3"
                                  >
                                    <v-btn
                                      variant="text"
                                      text
                                      disabled
                                      plain
                                      class="pl-0 simple-btn d-none d-md-block"
                                    >
                                      <v-icon
                                        class="mr-1"
                                        size="22"
                                      >
                                        mdi-comment-plus
                                      </v-icon>
                                      Add comment
                                    </v-btn>
                                    <div class="d-flex d-md-none">
                                      <!-- Score action sm and xs -->
                                      <v-btn
                                        variant="plain"
                                        plain
                                        icon
                                        @click="
                                          submitScore(
                                            'reply',
                                            answer.id,
                                            'plus',
                                          )
                                        "
                                      >
                                        <v-icon size="40">
                                          mdi-menu-up
                                        </v-icon>
                                      </v-btn>
                                      <p class="pt-3">
                                        {{ answer.score }}
                                      </p>
                                      <v-btn
                                        variant="plain"
                                        plain
                                        icon
                                        @click="
                                          submitScore(
                                            'reply',
                                            answer.id,
                                            'minus',
                                          )
                                        "
                                      >
                                        <v-icon size="40">
                                          mdi-menu-down
                                        </v-icon>
                                      </v-btn>
                                      <!-- End score action sm and xs -->

                                      <p class="pt-3">
                                        |
                                      </p>
                                      <v-btn
                                        v-if="
                                          contentData.owner == true
                                            && answer.selected == 0
                                        "
                                        icon
                                        color="green"
                                        @click="selectCorrectAnswer(answer.id)"
                                      >
                                        <v-icon size="20">
                                          mdi-check
                                        </v-icon>
                                      </v-btn>
                                      <v-btn
                                        variant="plain"
                                        plain
                                        icon
                                        disabled
                                      >
                                        <v-icon size="20">
                                          mdi-comment-plus
                                        </v-icon>
                                      </v-btn>
                                      <v-btn
                                        v-if="answer.owner == true"
                                        variant="plain"
                                        plain
                                        icon
                                        @click="
                                          openEditReplyDialog(
                                            answer.id,
                                            answer.answer,
                                          )
                                        "
                                      >
                                        <v-icon size="20">
                                          mdi-pencil
                                        </v-icon>
                                      </v-btn>

                                      <!-- Delete button -->
                                      <v-btn
                                        v-if="answer.owner == true"
                                        icon
                                        @click="
                                          openDeleteReplyConfirmDialog(
                                            answer.id,
                                          )
                                        "
                                      >
                                        <v-icon size="20">
                                          mdi-delete
                                        </v-icon>
                                      </v-btn>

                                      <v-spacer />
                                    </div>
                                  </v-col>
                                  <v-col
                                    cols="5"
                                    md="6"
                                    class="pb-sm-0 px-sm-3 pb-md-3 text-right d-flex"
                                  >
                                    <v-spacer />

                                    <div class="d-none d-md-block">
                                      <v-spacer />
                                      <v-btn
                                        style="
                                          color: #000;
                                          font-size: 11px;
                                          opacity: unset;
                                        "
                                        variant="plain"
                                        class="simple-btn text-dark"
                                      >
                                        <v-icon
                                          class="mr-1"
                                          size="22"
                                        >
                                          mdi-calendar-month
                                        </v-icon>
                                        {{ $dayjs(answer.subdate).fromNow() }}
                                      </v-btn>
                                      <v-btn
                                        style="
                                          color: #000;
                                          font-size: 11px;
                                          opacity: unset;
                                        "
                                        variant="plain"
                                        class="simple-btn text-dark"
                                      >
                                        <v-icon
                                          class="mr-1"
                                          size="22"
                                        >
                                          mdi-clock-time-five-outline
                                        </v-icon>
                                        {{
                                          $dayjs(answer.subdate).format("HH:mm")
                                        }}
                                      </v-btn>
                                    </div>

                                    <div class="d-inline d-md-none px-sm-0">
                                      <v-btn
                                        variant="plain"
                                        plain
                                        icon
                                        @click="
                                          openCrashReportDialog(
                                            answer.id,
                                            'questionReply',
                                          )
                                        "
                                      >
                                        <v-icon size="20">
                                          mdi-alert-octagon-outline
                                        </v-icon>
                                      </v-btn>
                                    </div>
                                  </v-col>
                                </v-row>
                              </v-col>
                            </v-row>
                          </v-card-text>
                        </v-card>
                      </v-col>
                    </v-row>
                  </v-col>
                </v-row>
                <!-- End answer section -->

                <!-- Your answer -->
                <v-row>
                  <v-col
                    cols="4"
                    md="2"
                  >
                    <h2 class="text-h5 text-md-h4">
                      Your answer
                    </h2>
                  </v-col>
                  <v-col
                    cols="8"
                    md="10"
                  >
                    <v-divider class="my-3" />
                  </v-col>
                </v-row>
                <v-card
                  color="#FFF"
                  flat
                >
                  <v-card-text>
                    <Form
                      :validation-schema="replySchema"
                      @submit="
                        (values, actions) => submitReply(values, actions)
                      "
                    >
                      <v-row>
                        <v-col cols="12">
                          <Field
                            v-slot="{ meta: fieldMeta, errors }"
                            v-model="answer_form.answer"
                            name="answer"
                          >
                            <v-textarea
                              v-model="answer_form.answer"
                              variant="outlined"
                              row-height="25"
                              rows="3"
                              :height="textAreaHeight"
                              :error-messages="errors"
                              background-color="#ffffff"
                              label="Your answer"
                              @click="increaseTextAreaHeight"
                            >
                              <template #append>
                                <v-btn
                                  v-if="answer_form.answer"
                                  :color="
                                    !errors.entries.length && fieldMeta.valid
                                      ? '#000'
                                      : '#999'
                                  "
                                  variant="text"
                                  icon
                                  type="submit"
                                  :disabled="!fieldMeta.valid"
                                >
                                  <v-icon size="28">
                                    mdi-send
                                  </v-icon>
                                </v-btn>
                                <v-btn
                                  v-else
                                  variant="text"
                                  icon
                                  disabled
                                >
                                  <v-icon size="28">
                                    mdi-microphone
                                  </v-icon>
                                </v-btn>
                              </template>
                              <template #prepend>
                                <v-btn
                                  variant="text"
                                  icon
                                  @click="emoji_box = !emoji_box"
                                >
                                  <v-icon
                                    color="#999"
                                    size="28"
                                  >
                                    mdi-emoticon-excited-outline
                                  </v-icon>
                                </v-btn>
                                <v-btn
                                  variant="text"
                                  icon
                                  disabled
                                >
                                  <v-icon size="28">
                                    mdi-paperclip
                                  </v-icon>
                                </v-btn>
                              </template>
                            </v-textarea>
                          </Field>
                          <ClientOnly>
                            <EmojiPicker
                              v-show="emoji_box"
                              disable-skin-tones
                              display-recent
                              style="margin: 0 0"
                              :native="true"
                              @select="selectEmoji"
                            />
                          </ClientOnly>
                        </v-col>
                      </v-row>
                    </Form>
                  </v-card-text>
                </v-card>
              </v-col>
              <!-- End your answer -->

              <!-- Similar questions -->
              <v-col
                id="similar-question"
                cols="3"
                class="d-none d-md-block"
              >
                <div class="text-right">
                  <v-btn
                    rounded
                    flat
                    outlined
                    large
                    :small="display.xs"
                    class="primary gama-text-body2 mb-2 mx-auto text-transform-none mx-auto"
                    @click="openQuestionForm()"
                  >
                    Ask Question
                  </v-btn>
                </div>
                <v-card
                  color="#F5F5F5"
                  flat
                >
                  <v-card-text>
                    <h2 class="text-h4 text-center text-gray">
                      Related questions
                    </h2>
                    <v-divider
                      style="width: 80%"
                      class="my-3 mx-auto"
                    />
                    <div v-if="loading.similar_questions">
                      <v-skeleton-loader
                        v-for="i in 10"
                        :key="i"
                        type="list-item"
                      />
                    </div>
                    <p
                      v-else-if="similarQuestions.num == 0"
                      class="text-center"
                    >
                      Opps! not found
                    </p>
                    <ul v-else>
                      <li
                        v-for="question in similarQuestions.slice(0, 10)"
                        :key="question.id"
                        class="question-item pointer text-info gama-text-body2"
                      >
                        <NuxtLink
                          :to="`/qa/${question.id}/${convertSlug(
                            question.title,
                          )}`"
                        >
                          <span>{{ question.title }}</span>
                        </NuxtLink>
                      </li>

                      <li
                        class="question-item pointer gama-text-body2 primary--text mb-0"
                        @click="openQuestionForm()"
                      >
                        Ask question
                      </li>
                    </ul>
                  </v-card-text>
                </v-card>
              </v-col>
              <!-- End similar questions -->
            </v-row>
          </div>
        </v-container>
      </section>

      <!-- Need to be Refactor - Commented -->
      <!-- <CrashReport ref="crash_report" /> -->
    </div>
  </div>
</template>

<script setup>
import * as yup from 'yup'
import { Form, Field } from 'vee-validate'
import breadcrumb from '~/components/widgets/breadcrumb.vue'
import 'vue3-emoji-picker/css'
import { useNuxtApp } from '#app'
import { ref, reactive, watch, nextTick, onMounted } from 'vue'
// import CrashReport from "~/components/common/crash-report.vue";
const EmojiPicker = defineAsyncComponent(() =>
  import('vue3-emoji-picker').then(EmojiPicker => EmojiPicker),
)
const { $toast } = useNuxtApp()

const { isAuthenticated } = useAuth()

const replySchema = yup.object({
  answer: yup
    .string()
    .required('This field is required')
    .min(25, 'This field must be at least 25 characters'),
})

const route = useRoute()
const router = useRouter()
const requestURL = ref(useRequestURL().host)

const display = useGlobalDisplay()
// use useAsyncData to getting Major Questions - SSR-friendly
const { data: contentData } = await useAsyncData(
  () => `question-${route.params.id}`,
  async () => {
    try {
      const content = await $fetch(`/api/v1/questions/${route.params.id}`)
      return content.status === 1 ? content.data : {}
    }
    catch (e) {
      if (e?.status === 404) {
        // router.push("/search?type=question");
      }
      throw e
    }
  },
  {
    watch: [() => route.params.id],
  },
)

useHead({
  title: contentData.value?.title || 'Gama Train',
  link: [
    {
      rel: 'canonical',
      href: `https://${requestURL.value}/qa/${contentData.value.id}/${contentData.value.title_url}`,
    },
  ],
})

// Reactive States
const textAreaHeight = ref(10)
const emoji_box = ref(false)
const breads = ref([
  {
    text: 'Forum',
    disabled: false,
    href: '/search?type=question',
  },
])

const similarQuestions = ref([])
const answer_form = reactive({
  answer: '',
})
const edit_answer_form = reactive({
  answer: '',
})

const answer_list = ref([])
const edit_reply_id = ref(null)
const delete_reply_id = ref(null)
const dialog = reactive({
  delete_reply_form: false,
  edit_reply_form: false,
})

const loading = reactive({
  reply_form: false,
  edit_reply_form: false,
  edit_answer_form: false,
  delete_reply_form: false,
  similar_questions: true,
})

const { $renderMathInElement, $ensureMathJaxReady } = useNuxtApp()
const questionMathJaxContainerRef = ref(null)
const answersListMathJaxContainerRef = ref(null)

const typesetMathInSpecificContainer = async (containerRef) => {
  if (import.meta.client && containerRef.value) {
    try {
      await $ensureMathJaxReady()

      if (!window.MathJax || !window.MathJax.Hub) {
        return
      }

      let elementToProcess = null
      if (
        containerRef.value.$el
        && containerRef.value.$el instanceof HTMLElement
      ) {
        elementToProcess = containerRef.value.$el
      }
      else if (containerRef.value instanceof HTMLElement) {
        elementToProcess = containerRef.value
      }

      if (!elementToProcess) {
        return
      }

      await nextTick()

      if (containerRef.value) {
        let currentElement = null
        if (
          containerRef.value.$el
          && containerRef.value.$el instanceof HTMLElement
        ) {
          currentElement = containerRef.value.$el
        }
        else if (containerRef.value instanceof HTMLElement) {
          currentElement = containerRef.value
        }
        if (currentElement) {
          $renderMathInElement(currentElement)
        }
        else {
          console.warn('No element found to render MathJax content')
        }
      }
      else {
        console.warn('MathJax not initialized')
      }
    }
    catch (error) {
      console.error('Error during MathJax rendering:', error)
    }
  }
  else {
    console.warn('Cannot render MathJax on server side')
  }
}
const crashReport = ref(null)

function increaseTextAreaHeight() {
  textAreaHeight.value = 100
}

function initBreadCrumb() {
  // Clear any existing breadcrumbs except the first "Forum" item
  while (breads.value.length > 1) {
    breads.value.pop()
  }

  if (contentData.value && Object.keys(contentData.value).length > 0) {
    breads.value.push(
      {
        text: contentData.value.section_title,
        disabled: false,
        href: `/search?type=question&section=${contentData.value.section}`,
      },
      {
        text: contentData.value.base_title,
        disabled: false,
        href: `/search?type=question&section=${contentData.value.section}&base=${contentData.value.base}`,
      },
      {
        text: contentData.value.lesson_title,
        disabled: false,
        href: `/search?type=question&section=${contentData.value.section}&base=${contentData.value.base}&lesson=${contentData.value.lesson}`,
      },
    )
  }
}

function openAuthDialog(val) {
  router.push({ query: { auth_form: val } })
}

// Using local slug convertor (Can be added to helpers too)
function convertSlug(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
}

function openQuestionForm() {
  if (isAuthenticated.value) {
    router.push({ path: '/user/question/create' })
  }
  else {
    openAuthDialog('login')
  }
}

function selectEmoji(emoji) {
  answer_form.answer += emoji.i
}

async function submitReply(values, { resetForm }) {
  loading.reply_form = true
  const payload = {
    id: route.params.id,
    answer: values.answer,
  }

  try {
    await useApiService.post('/api/v1/questionReplies', payload)

    await reInit()

    resetForm()
    $toast.success('Reply submit successfully')
  }
  catch (err) {
    $toast.error(err.response.data.message)
  }
  finally {
    loading.reply_form = false
  }
}

// async function updateReply() {
//   loading.edit_reply_form = true;
//   try {
//     await $fetch.$put(
//       `/api/v1/questionReplies/${edit_reply_id.value}`,
//       querystring.stringify(edit_answer_form),
//       {
//         headers: {
//           "Content-Type": "application/x-www-form-urlencoded",
//         },
//       }
//     );
//     await reInit();
//     dialog.edit_reply_form = false;
//     edit_answer_form.answer = "";
//     // $toast.success("Reply updated successfully");
//   } catch (err) {
//     console.error(err);
//   } finally {
//     loading.edit_reply_form = false;
//   }
// }

const { data: repliesData, refresh: refreshReplies } = useAsyncData(
  'questionReplies',
  () => $fetch(`/api/v1/questionReplies?question=${route.params.id}`),
)

async function reInit() {
  try {
    await refreshReplies()
    if (repliesData.value && repliesData.value.data) {
      answer_list.value = repliesData.value.data.list || []
    }
    else {
      answer_list.value = []
    }
  }
  catch (err) {
    console.error('Error in reInit fetching replies:', err)
    answer_list.value = []
  }
}

function openEditReplyDialog(item_id, answer) {
  edit_reply_id.value = item_id
  edit_answer_form.answer = answer
  dialog.edit_reply_form = true
}

function openDeleteReplyConfirmDialog(item_id) {
  delete_reply_id.value = item_id
  dialog.delete_reply_form = true
}

// async function deleteReply() {
//   loading.delete_reply_form = true;
//   await $fetch
//     .$delete(`/api/v1/questionReplies/${delete_reply_id.value}`)
//     .then((_response) => {
//       delete_reply_id.value = null;
//       dialog.delete_reply_form = false;
//       $toast.success("Deleted successfully");
//       reInit();
//     })
//     .catch((_err) => {
//       delete_reply_id.value = null;
//       dialog.delete_reply_form = false;
//     })
//     .finally(() => {
//       loading.delete_reply_form = false;
//     });
// }

async function submitScore(content_type, id, type) {
  // const auth = useAuth();
  if (isAuthenticated.value) {
    let api = `/api/v1/questions/score/${id}/${type}`
    if (content_type === 'reply')
      api = `/api/v1/questionReplies/score/${id}/${type}`

    await useApiService
      .post(api)
      .then((_response) => {
        if (_response.status === 1) {
          if (content_type === 'question')
            contentData.value.score = _response.data.score
          else {
            const index = answer_list.value.findIndex(x => x.id === id)
            if (index !== -1) {
              answer_list.value[index].score = _response.data.score
            }
          }
        }
      })
      .catch((_err) => {
        console.error(_err)
      })
  }
  else {
    openAuthDialog('login')
  }
}

function selectCorrectAnswer(id) {
  useApiService
    .post(`/api/v1/questionReplies/select/${id}`)
    .then((_response) => {
      $toast.success('Select successfully')
      window.scrollTo(0, 0)
      reInit()
    })
    .catch((_err) => {
      $toast.error('An error occured')
    })
}
// CrashReport component need to be refactor
function openCrashReportDialog(id, type) {
  if (crashReport.value) {
    crashReport.value.dialog = true
    crashReport.value.form.type = type

    if (type === 'questionReply') {
      crashReport.value.form.id = id
    }
    else {
      crashReport.value.form.id = route.params.id
    }
  }
}

function getSimilarQuestions() {
  useApiService
    .get(`/api/v1/questions/related/${route.params.id}`)
    .then((_response) => {
      similarQuestions.value = _response.data.list
    })
    .catch((_err) => {
      console.error(_err)
    })
    .finally(() => {
      loading.similar_questions = false
    })
}

onMounted(async () => {
  initBreadCrumb()
  await reInit()
  getSimilarQuestions()

  await typesetMathInSpecificContainer(questionMathJaxContainerRef)
  if (answer_list.value.length > 0) {
    await typesetMathInSpecificContainer(answersListMathJaxContainerRef)
  }
})
watch(
  () => contentData.value?.question,
  async (newQuestionText) => {
    if (newQuestionText) {
      await typesetMathInSpecificContainer(questionMathJaxContainerRef)
    }
  },
  { immediate: false },
)

watch(
  answer_list,
  async (newAnswers) => {
    await nextTick()
    if (newAnswers && newAnswers.length > 0) {
      await typesetMathInSpecificContainer(answersListMathJaxContainerRef)
    }
  },
  { deep: true },
)
</script>

<style lang="scss" scoped>
// Manipulate some Vuetify & bootstrap styles
#qa-details-content .v-text-field--outlined .v-input__prepend-outer,
.v-text-field--outlined .v-input__append-outer {
  margin-top: 6px !important;
}

#qa-details-content {
  margin-top: calc(10rem + 4rem);
  margin-bottom: 2rem;

  #similar-question {
    .question-item {
      list-style-type: none;
      margin-bottom: 2rem;
      font-weight: 400;
    }

    .v-skeleton-loader__list-item {
      background: transparent !important;
      height: 1.8rem !important;
      margin-bottom: 1rem;
    }
  }

  #similar-question ul {
    padding-left: 1rem;
  }

  .v3-emoji-picker .v3-footer {
    display: none;
  }

  .v-label.v-field-label {
    font-size: 1.5rem;
  }
  .v-chip.v-chip--link.v-theme--light.v-chip--density-comfortable.v-chip--size-default {
    background-color: #4e636b;
    opacity: 100%;
    color: #fff;
    font-size: 1.1rem;
  }

  @media screen and (max-width: 600px) {
    .v-btn.v-btn--icon.v-theme--light.text-success.v-btn--density-comfortable.v-btn--rounded.v-btn--size-default.v-btn--variant-outlined {
      border: 0px !important;
    }
  }
}
</style>
