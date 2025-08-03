<template>
  <v-container class="create-test-container">
    <v-row class="mt-4">
      <v-col cols="6">
        <h1 class="text-h4 text-teal">
          New Exam
        </h1>
      </v-col>
      <v-col
        id="tool-box"
        cols="6"
        class="text-right"
      >
        <v-btn
          variant="outlined"
          color="error"
          :disabled="!exam_id"
          icon="mdi-delete"
          size="small"
          class="mr-1"
          style="font-size: 15px; font-weight: 500"
          @click="confirmDeleteDialog = true"
        />
        <v-btn
          variant="outlined"
          icon="mdi-printer-eye"
          size="small"
          style="font-size: 15px; font-weight: 500"
          @click="printPreviewDialog = !printPreviewDialog"
        />
      </v-col>
    </v-row>

    <v-stepper-vertical
      v-model="test_step"
      :items="[
        { title: 'Header', value: 1 },
        { title: 'Tests', value: 2 },
        { title: 'Review', value: 3 },
        {
          title: 'Publish',
          value: 4,
          disabled: !isExamPublished || tests.length < 5,
        },
      ]"
      editable
      color="teal"
      hide-actions
      @update:model-value="handleStepChange"
    >
      <template #[`item.1`]>
        <v-card
          flat
          class="mt-4 pb-10"
        >
          <v-form
            ref="observer"
            v-model="isFormValid"
            class="pa-2"
            @submit.prevent="submitQuestion"
          >
            <v-row>
              <v-col
                cols="12"
                md="4"
              >
                <v-autocomplete
                  v-model="form.section"
                  :items="level_list"
                  item-title="title"
                  item-value="id"
                  label="Board"
                  variant="outlined"
                  :rules="[(v) => !!v || 'This field is required']"
                  color="orange"
                  density="compact"
                  autocomplete="off"
                />
              </v-col>
              <v-col
                cols="12"
                md="4"
              >
                <v-autocomplete
                  v-model="form.base"
                  :items="grade_list"
                  item-title="title"
                  item-value="id"
                  label="Grade"
                  variant="outlined"
                  :rules="[(v) => !!v || 'This field is required']"
                  color="orange"
                  density="compact"
                  autocomplete="off"
                />
              </v-col>
              <v-col
                cols="12"
                md="4"
              >
                <v-autocomplete
                  v-model="form.lesson"
                  :items="lesson_list"
                  item-title="title"
                  item-value="id"
                  label="Subject"
                  variant="outlined"
                  :rules="[(v) => !!v || 'This field is required']"
                  color="orange"
                  density="compact"
                  autocomplete="off"
                />
              </v-col>

              <v-col cols="12">
                <FormTopicSelector
                  ref="topicSelector"
                  :selected-topics="selected_topics"
                  :topic-list="topic_list"
                  @select-topic="selectTopic"
                />
              </v-col>

              <v-col
                cols="12"
                md="2"
              >
                <v-autocomplete
                  v-model="form.exam_type"
                  :items="test_type_list"
                  item-title="title"
                  item-value="id"
                  :rules="[(v) => !!v || 'This field is required']"
                  label="Exam type"
                  variant="outlined"
                  color="orange"
                  density="compact"
                  :loading="!test_type_list || test_type_list.length === 0"
                  no-data-text="Loading exam types..."
                  autocomplete="off"
                />
              </v-col>

              <v-col
                cols="12"
                md="2"
              >
                <v-text-field
                  v-model="form.duration"
                  type="number"
                  min="1"
                  label="Test duration"
                  variant="outlined"
                  color="orange"
                  density="compact"
                  autocomplete="off"
                />
              </v-col>

              <v-col
                cols="12"
                md="2"
              >
                <v-autocomplete
                  v-model="form.edu_year"
                  :items="year_list"
                  label="Year"
                  variant="outlined"
                  color="orange"
                  density="compact"
                  :rules="[(v) => !!v || 'This field is required']"
                  autocomplete="off"
                />
              </v-col>

              <v-col
                cols="12"
                md="2"
              >
                <v-autocomplete
                  v-model="form.edu_month"
                  :items="month_list"
                  item-title="title"
                  item-value="id"
                  label="Month"
                  variant="outlined"
                  color="orange"
                  density="compact"
                  :rules="[(v) => !!v || 'This field is required']"
                  autocomplete="off"
                />
              </v-col>

              <v-col
                cols="12"
                md="4"
              >
                <v-file-input
                  v-model="file_original"
                  label="Source file"
                  variant="outlined"
                  prepend-icon="mdi-paperclip"
                  accept="application/pdf"
                  density="compact"
                  autocomplete="off"
                  @update:model-value="uploadFile"
                />
              </v-col>

              <v-col
                cols="12"
                md="8"
              >
                <v-text-field
                  v-model="form.title"
                  label="Title"
                  variant="outlined"
                  :rules="[(v) => !!v || 'This field is required']"
                  density="compact"
                  hide-details
                  autocomplete="off"
                />
                <div
                  style="
                    font-size: 11px;
                    color: rgba(0, 0, 0, 0.6);
                    margin-left: 15px;
                  "
                >
                  Ex: 9700/11 Biology Jun 2020 Online Test | Cambridge AS & A
                  Level MSCO
                </div>
              </v-col>

              <v-col
                cols="12"
                md="4"
              >
                <v-text-field
                  v-model="form.paperID"
                  label="Past Paper Id"
                  variant="outlined"
                  density="compact"
                  autocomplete="off"
                />
              </v-col>

              <v-col cols="12">
                <v-row>
                  <v-col
                    cols="12"
                    md="6"
                  >
                    <v-btn
                      type="submit"
                      block
                      color="teal"
                      class="text-white"
                      size="large"
                      :loading="submit_loading"
                      :disabled="!isFormValid"
                      style="
                        text-transform: none;
                        font-size: 13px;
                        font-weight: 500;
                      "
                      density="compact"
                      autocomplete="off"
                    >
                      Next step
                    </v-btn>
                  </v-col>
                  <v-col
                    cols="12"
                    md="6"
                  >
                    <v-btn
                      block
                      variant="outlined"
                      color="red"
                      size="large"
                      to="/user/exam"
                      style="
                        text-transform: none;
                        font-size: 13px;
                        font-weight: 500;
                      "
                      density="compact"
                    >
                      Discard
                    </v-btn>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </v-form>
        </v-card>
      </template>

      <template #[`item.2`]>
        <v-card
          flat
          class="mt-3 pb-10"
        >
          <v-row>
            <v-col cols="12">
              <v-switch
                v-if="exam_id"
                v-model="testListSwitch"
                color="teal"
                label="I want to select from list"
                style="
                  font-weight: 500;
                  color: #009688;
                  font-size: 16px !important;
                "
              />
            </v-col>
          </v-row>

          <v-row v-show="!testListSwitch">
            <v-col
              v-if="tests.length > 0"
              cols="12"
            >
              <v-alert
                type="info"
                variant="tonal"
                color="teal"
                border="start"
                density="compact"
              >
                <div
                  class="d-flex align-center justify-space-between flex-wrap"
                >
                  <span>{{ tests.length }}
                    {{ tests.length === 1 ? "test" : "tests" }} added to this
                    exam</span>
                  <span
                    v-if="!hasEnoughTests"
                    class="ml-2"
                  >Need {{ 5 - tests.length }} more
                    {{ 5 - tests.length === 1 ? "test" : "tests" }} to
                    publish</span>
                  <span
                    v-else-if="hasEnoughTests && exam_id"
                    class="ml-2 text-success"
                  >Ready to publish!</span>
                  <span
                    v-else
                    class="ml-2 text-success"
                  >Please First Create an Exam</span>
                </div>
              </v-alert>
              <v-progress-linear
                v-model="testProgress"
                height="8"
                color="teal"
                rounded
                class="mt-2 mb-3"
              />
            </v-col>
            <v-col cols="12">
              <CreateTestForm
                ref="createForm"
                v-model:test-list="tests"
                :go-to-preview-step="test_step"
                :update-test-list="lastCreatedTest"
                :exam-edit-mode="true"
                @update:update-test-list="(val) => (lastCreatedTest = val)"
                @update:refresh-tests="handleTestRefresh"
                @update:go-to-preview-step="(val) => (test_step = val)"
              />
            </v-col>
          </v-row>

          <v-row v-show="testListSwitch">
            <v-col
              cols="12"
              md="4"
            >
              <v-autocomplete
                v-model="filter.section"
                :items="filter_level_list"
                item-title="title"
                item-value="id"
                clearable
                label="Board"
                variant="outlined"
                density="compact"
                color="orange"
                autocomplete="off"
                @click:clear="handleClearSection"
              />
            </v-col>
            <v-col
              cols="12"
              md="4"
            >
              <v-autocomplete
                v-model="filter.base"
                :items="filter_grade_list"
                item-title="title"
                item-value="id"
                clearable
                label="Grade"
                variant="outlined"
                density="compact"
                color="orange"
                :disabled="!filter.section"
                :loading="test_loading && filter.section && !filter.base"
                no-data-text="Select a Board first"
                autocomplete="off"
                @click:clear="handleClearBase"
              />
            </v-col>
            <v-col
              cols="12"
              md="4"
            >
              <v-autocomplete
                v-model="filter.lesson"
                :items="filter_lesson_list"
                item-title="title"
                item-value="id"
                clearable
                label="Subject"
                variant="outlined"
                density="compact"
                color="orange"
                :disabled="!filter.base"
                :loading="test_loading && filter.base && !filter.lesson"
                no-data-text="Select a Grade first"
                autocomplete="off"
                @click:clear="handleClearLesson"
              />
            </v-col>

            <v-col
              cols="12"
              md="4"
            >
              <v-autocomplete
                v-model="filter.topic"
                :items="topic_list"
                item-title="title"
                item-value="id"
                clearable
                label="Topic"
                variant="outlined"
                density="compact"
                color="orange"
                :disabled="!filter.lesson"
                :loading="test_loading && filter.lesson && !filter.topic"
                autocomplete="off"
                @click:clear="handleClearTopic"
              >
                <template #item="{ item, props }">
                  <v-list-item
                    v-bind="props"
                    :title="item.raw.title"
                    :class="{ topic_season: item.raw.season }"
                  />
                </template>
              </v-autocomplete>
            </v-col>

            <v-col
              cols="12"
              md="4"
            >
              <v-autocomplete
                v-model="filter.testsHasVideo"
                :items="video_analysis_options"
                item-title="title"
                item-value="value"
                clearable
                label="Video analysis"
                variant="outlined"
                density="compact"
                color="orange"
                autocomplete="off"
              />
            </v-col>
            <v-col
              cols="12"
              md="4"
            >
              <v-checkbox
                v-model="filter.myTests"
                label="My own tests"
                density="compact"
                color="orange"
                style="
                  font-size: 16px !important;
                  margin-inline-end: 10px !important;
                "
                autocomplete="off"
              />
            </v-col>

            <v-col
              v-if="tests.length > 0"
              cols="12"
            >
              <v-alert
                type="info"
                variant="tonal"
                color="teal"
                border="start"
                density="compact"
              >
                <div
                  class="d-flex align-center justify-space-between flex-wrap"
                >
                  <span>{{ tests.length }}
                    {{ tests.length === 1 ? "test" : "tests" }} added to this
                    exam</span>
                  <span
                    v-if="!hasEnoughTests"
                    class="ml-2"
                  >Need {{ 5 - tests.length }} more
                    {{ 5 - tests.length === 1 ? "test" : "tests" }} to
                    publish</span>
                  <span
                    v-else-if="hasEnoughTests && exam_id"
                    class="ml-2 text-success"
                  >Ready to publish!</span>
                  <span
                    v-else
                    class="ml-2 text-success"
                  >Please First Create an Exam</span>
                </div>
              </v-alert>
              <v-progress-linear
                v-model="testProgress"
                height="8"
                color="teal"
                rounded
                class="mt-2 mb-3"
              />
            </v-col>

            <v-col cols="12">
              <v-card
                ref="testList"
                class="test-list"
                flat
                max-height="600"
                @scroll="onScroll"
              >
                <v-card-text>
                  <v-row ref="mathJaxStep2ListContainerRef">
                    <v-col
                      v-for="item in test_list"
                      v-show="test_list.length > 0"
                      :key="item.id"
                      cols="12"
                    >
                      <v-row class="mb-2">
                        <v-col cols="12">
                          <v-chip
                            v-if="item.lesson_title"
                            size="x-large"
                            density="compact"
                            style="font-size: 13px !important"
                          >
                            {{ item.lesson_title }}
                          </v-chip>
                          <v-chip
                            v-if="item.topics_title"
                            size="x-large"
                            density="compact"
                            style="
                              font-size: 13px !important;
                              margin-inline-start: 5px !important;
                            "
                          >
                            {{ item.topics_title }}
                          </v-chip>
                          <v-chip
                            v-if="item.level === '1'"
                            variant="outlined"
                            color="success"
                            size="small"
                            class="ml-2"
                          >
                            Simple
                          </v-chip>
                          <v-chip
                            v-if="item.level === '2'"
                            variant="outlined"
                            color="primary"
                            size="small"
                            class="ml-2"
                          >
                            Middle
                          </v-chip>
                          <v-chip
                            v-if="item.level === '3'"
                            variant="outlined"
                            color="error"
                            size="small"
                            class="ml-2"
                          >
                            Hard
                          </v-chip>
                        </v-col>
                      </v-row>
                      <div
                        id="test-question"
                        v-html="item.question"
                      />
                      <img :src="item.q_file">

                      <div
                        v-if="
                          item.type == 'blank'
                            || item.type == 'shortanswer'
                            || item.type == 'descriptive'
                        "
                      >
                        <div v-html="item.answer_full" />
                        <img
                          v-show="item.answer_full_file"
                          :src="item.answer_full_file"
                        >
                      </div>
                      <div v-else>
                        <div class="answer">
                          <v-icon
                            v-show="item.true_answer == '1'"
                            class="true_answer"
                            size="large"
                          >
                            mdi-check
                          </v-icon>
                          <span>1)</span>
                          <span
                            v-show="item.answer_a"
                            v-html="item.answer_a"
                          />
                          <img
                            v-show="item.a_file"
                            :src="item.a_file"
                          >
                        </div>
                        <div class="answer">
                          <v-icon
                            v-show="item.true_answer == '2'"
                            class="true_answer"
                            size="large"
                          >
                            mdi-check
                          </v-icon>
                          <span>2)</span>
                          <span
                            v-show="item.answer_b"
                            v-html="item.answer_b"
                          />
                          <img
                            v-show="item.b_file"
                            :src="item.b_file"
                          >
                        </div>
                        <div class="answer">
                          <v-icon
                            v-show="item.true_answer == '3'"
                            class="true_answer"
                            size="large"
                          >
                            mdi-check
                          </v-icon>
                          <span>3)</span>
                          <span
                            v-show="item.answer_c"
                            v-html="item.answer_c"
                          />
                          <img
                            v-show="item.c_file"
                            :src="item.c_file"
                          >
                        </div>
                        <div class="answer">
                          <v-icon
                            v-show="item.true_answer == '4'"
                            class="true_answer"
                            size="large"
                          >
                            mdi-check
                          </v-icon>
                          <span>4)</span>
                          <span
                            v-show="item.answer_d"
                            v-html="item.answer_d"
                          />
                          <img
                            v-show="item.d_file"
                            :src="item.d_file"
                          >
                        </div>
                      </div>
                      <v-row>
                        <v-col cols="6">
                          <v-btn
                            v-if="item.owner == true"
                            icon
                            variant="text"
                            density="compact"
                            :to="`/test-maker/create-test/edit/${item.id}`"
                            style="text-transform: none; font-size: 13px"
                          >
                            <v-icon>mdi-pencil</v-icon>
                          </v-btn>
                          <v-btn
                            v-if="item.owner == true"
                            icon
                            variant="text"
                            density="compact"
                            style="text-transform: none; font-size: 13px"
                            @click="openTestDeleteConfirmDialog(item.id)"
                          >
                            <v-icon color="error">
                              mdi-delete
                            </v-icon>
                          </v-btn>
                          <v-btn
                            icon
                            variant="text"
                            density="compact"
                          >
                            <v-icon
                              color="blue"
                              size="x-large"
                            >
                              mdi-bullhorn-outline
                            </v-icon>
                          </v-btn>
                          <v-btn
                            icon
                            variant="text"
                            density="compact"
                          >
                            <v-icon
                              color="green"
                              size="x-large"
                            >
                              mdi-eye
                            </v-icon>
                          </v-btn>
                          <v-btn
                            icon
                            variant="text"
                            density="compact"
                          >
                            <v-icon
                              color="red"
                              size="x-large"
                            >
                              mdi-video
                            </v-icon>
                          </v-btn>
                        </v-col>
                        <v-col
                          cols="6"
                          class="text-right"
                        >
                          <v-btn
                            v-if="
                              !tests.some(
                                (id) => String(id) === String(item.id),
                              )
                            "
                            color="blue"
                            density="compact"
                            size="large"
                            style="text-transform: none; font-size: 13px"
                            @click="applyTest(item, 'add')"
                          >
                            <v-icon size="small">
                              mdi-plus
                            </v-icon>
                            Add
                          </v-btn>
                          <v-btn
                            v-if="
                              tests.some((id) => String(id) === String(item.id))
                            "
                            color="red"
                            density="compact"
                            size="large"
                            style="text-transform: none; font-size: 13px"
                            @click="applyTest(item, 'remove')"
                          >
                            <v-icon size="small">
                              mdi-minus
                            </v-icon>
                            Delete
                          </v-btn>
                        </v-col>
                      </v-row>
                      <v-divider class="mt-3" />
                    </v-col>

                    <v-col
                      v-show="!all_tests_loaded"
                      cols="12"
                      class="text-center"
                    >
                      <v-progress-circular
                        :size="40"
                        :width="4"
                        class="mt-12 mb-12"
                        color="orange"
                        indeterminate
                      />
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
            </v-col>

            <v-col
              cols="12"
              class="mb-6"
            >
              <v-row>
                <v-col
                  cols="12"
                  md="6"
                  class="pb-0"
                >
                  <v-btn
                    :disabled="tests?.length < 5"
                    :loading="publish_loading"
                    block
                    color="teal"
                    class="text-white"
                    size="large"
                    style="
                      text-transform: none;
                      font-size: 13px;
                      font-weight: 500;
                    "
                    @click="test_step = 3"
                  >
                    <span v-show="tests?.length < 5">Add at least {{ 5 - tests?.length }} more tests</span>
                    <span v-show="tests?.length >= 5">Next step</span>
                  </v-btn>
                </v-col>
                <v-col
                  cols="12"
                  md="6"
                >
                  <v-btn
                    block
                    variant="outlined"
                    color="red"
                    size="large"
                    to="/user/exam"
                    style="
                      text-transform: none;
                      font-size: 13px;
                      font-weight: 500;
                    "
                  >
                    Discard
                  </v-btn>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-card>
      </template>

      <template #[`item.3`]>
        <v-card
          flat
          class="pb-10 test-list"
        >
          <v-card-text id="preview-dialog">
            <v-row>
              <v-col cols="12">
                <p class="text-h4 font-weight-bold">
                  {{ form.title }}
                </p>
              </v-col>
              <v-col cols="4">
                Question's num: {{ tests.length }}
              </v-col>
              <v-col cols="4">
                Duration: {{ form.duration }}
              </v-col>
              <v-col cols="4">
                Level: {{ calcLevel(form.level) }}
              </v-col>
              <v-col cols="12">
                <v-chip
                  size="x-large"
                  label
                  variant="outlined"
                  rounded
                  density="compact"
                  class="text-white"
                  style="background-color: #b30a29; font-size: 15px"
                >
                  Topics:
                </v-chip>
              </v-col>
              <v-col
                v-for="(item, index) in topicTitleArr"
                :key="index"
                cols="4"
              >
                {{ item }}
              </v-col>
              <v-col cols="12">
                <v-divider />
              </v-col>
            </v-row>
            <v-row ref="mathJaxStep3ReviewContainerRef">
              <v-col
                v-show="previewTestList.length"
                cols="12"
              >
                <draggable
                  v-model="previewTestList"
                  item-key="id"
                  handle=".drag-handle"
                  @end="previewDragEnd"
                >
                  <template #item="{ element: item }">
                    <v-row :key="item.id">
                      <v-col cols="12">
                        <div
                          id="test-question"
                          v-html="item.question"
                        />
                        <img :src="item.q_file">

                        <div
                          v-if="
                            item.type == 'blank'
                              || item.type == 'shortanswer'
                              || item.type == 'descriptive'
                          "
                        >
                          <div v-html="item.answer_full" />
                          <img
                            v-show="item.answer_full_file"
                            :src="item.answer_full_file"
                          >
                        </div>
                        <div v-else>
                          <div class="answer">
                            <span>1)</span>
                            <span
                              v-show="item.answer_a"
                              v-html="item.answer_a"
                            />
                            <img
                              v-show="item.a_file"
                              :src="item.a_file"
                            >
                          </div>
                          <div class="answer">
                            <span>2)</span>
                            <span
                              v-show="item.answer_b"
                              v-html="item.answer_b"
                            />
                            <img
                              v-show="item.b_file"
                              :src="item.b_file"
                            >
                          </div>
                          <div class="answer">
                            <span>3)</span>
                            <span
                              v-show="item.answer_c"
                              v-html="item.answer_c"
                            />
                            <img
                              v-show="item.c_file"
                              :src="item.c_file"
                            >
                          </div>
                          <p class="answer">
                            <span>4)</span>
                            <span
                              v-show="item.answer_d"
                              v-html="item.answer_d"
                            />
                            <img
                              v-show="item.d_file"
                              :src="item.d_file"
                            >
                          </p>
                        </div>
                        <v-row>
                          <v-col cols="6">
                            <v-btn
                              icon
                              color="blue"
                              class="drag-handle"
                            >
                              <v-icon> mdi-cursor-move </v-icon>
                            </v-btn>
                          </v-col>
                          <v-col
                            cols="6"
                            class="text-right"
                          >
                            <v-btn
                              v-show="item.owner == true"
                              color="blue"
                              density="compact"
                              size="large"
                              :to="`/test-maker/create-test/edit/${item.id}`"
                              style="text-transform: none; font-size: 13px"
                            >
                              <v-icon size="small">
                                mdi-pencil
                              </v-icon>
                              Edit
                            </v-btn>
                            <v-btn
                              v-if="!tests.find((x) => x == item.id)"
                              color="blue"
                              density="compact"
                              size="large"
                              style="text-transform: none; font-size: 13px"
                              @click="applyTest(item, 'add')"
                            >
                              <v-icon size="large">
                                mdi-plus
                              </v-icon>
                              Add
                            </v-btn>
                            <v-btn
                              v-if="tests.find((x) => x == item.id)"
                              color="red"
                              density="compact"
                              size="large"
                              style="
                                text-transform: none;
                                font-size: 13px;
                                margin-inline: 5px;
                              "
                              @click="applyTest(item, 'remove')"
                            >
                              <v-icon size="large">
                                mdi-minus
                              </v-icon>
                              Delete
                            </v-btn>
                          </v-col>
                        </v-row>
                        <v-divider class="mt-3" />
                      </v-col>
                    </v-row>
                  </template>
                </draggable>
              </v-col>
              <v-col
                v-show="!previewTestList.length"
                cols="12"
                class="text-center"
              >
                <p>Oops! no data found</p>
              </v-col>
            </v-row>

            <!-- Publish button -->
            <v-row>
              <v-col cols="12">
                <v-row>
                  <v-col
                    cols="12"
                    md="6"
                    class="pb-0"
                  >
                    <v-btn
                      :disabled="tests?.length < 5"
                      :loading="publish_loading"
                      size="large"
                      density="compact"
                      color="teal"
                      class="text-white"
                      block
                      style="text-transform: none; font-size: 13px !important"
                      @click="publishTest"
                    >
                      <span v-show="tests?.length < 5">Add at least {{ 5 - tests?.length }} more tests</span>
                      <span v-show="tests?.length >= 5">Publish</span>
                    </v-btn>
                  </v-col>
                  <v-col
                    cols="12"
                    md="6"
                  >
                    <v-btn
                      size="large"
                      variant="outlined"
                      density="compact"
                      color="error"
                      to="/user/exam"
                      block
                      style="font-size: 13px !important; text-transform: none"
                    >
                      Discard
                    </v-btn>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
            <!-- End publish button -->
          </v-card-text>
        </v-card>
      </template>

      <template #[`item.4`]>
        <v-card
          flat
          class="mt-3 pb-10"
        >
          <v-card-text class="text-center">
            <p class="font-weight-bold text-teal mb-3">
              Your test is ready to use!
            </p>
            <p class="font-weight-normal text-grey font-size-16">
              Send below link to your students or friends.
            </p>

            <div class="d-flex justify-center my-4">
              <v-text-field
                v-model="test_share_link"
                variant="outlined"
                density="compact"
                readonly
                style="max-width: 350px"
                class="mx-auto textFiledLink"
                :rounded="false"
                autocomplete="off"
              >
                <template #append-inner>
                  <v-btn
                    icon
                    variant="plain"
                    @click="copyUrl"
                  >
                    <v-icon>mdi-content-copy</v-icon>
                  </v-btn>
                </template>
              </v-text-field>
            </div>

            <p class="mt-2 font-weight-normal font-size-16 text-grey">
              To view the results of the participants, go to the following path:
            </p>

            <v-breadcrumbs
              :items="[
                { title: 'Dashboard', href: '/user' },
                { title: 'My online exam', href: '/exam/results' },
              ]"
              class="justify-center mt-2 mb-2 font-size-16"
              color="gray"
            >
              <template #divider>
                <v-icon> mdi-chevron-right </v-icon>
              </template>
            </v-breadcrumbs>
            <v-divider
              class="mt-2 mb-2"
              thickness="3"
              color="gray"
            />
          </v-card-text>
        </v-card>
      </template>
    </v-stepper-vertical>

    <v-row justify="center">
      <v-dialog
        v-model="printPreviewDialog"
        fullscreen
        transition="dialog-bottom-transition"
      >
        <v-card class="test-list">
          <v-toolbar
            color="teal"
            dark
          >
            <v-btn
              icon
              @click="printPreviewDialog = false"
            >
              <v-icon>mdi-close</v-icon>
            </v-btn>
            <v-spacer />
            <v-toolbar-items>
              <v-btn
                style="text-transform: none; font-size: 13px; font-weight: 500"
                variant="text"
                @click="printPreviewDialog = false"
              >
                Ok
              </v-btn>
            </v-toolbar-items>
          </v-toolbar>
          <v-card-text
            id="preview-dialog"
            ref="mathJaxPrintDialogContainerRef"
          >
            <v-row>
              <v-col cols="12">
                <p class="text-h4 font-weight-bold">
                  {{ form.title }}
                </p>
              </v-col>
              <v-col cols="4">
                Question's num: {{ tests.length }}
              </v-col>
              <v-col cols="4">
                Duration: {{ form.duration }}
              </v-col>
              <v-col cols="4">
                Level: {{ calcLevel(form.level) }}
              </v-col>
              <v-col cols="12">
                <v-chip
                  size="x-large"
                  label
                  variant="outlined"
                  rounded
                  density="compact"
                  class="text-white"
                  style="background-color: #b30a29; font-size: 15px"
                >
                  Topics:
                </v-chip>
              </v-col>
              <v-col
                v-for="(item, index) in topicTitleArr"
                :key="index"
                cols="4"
              >
                {{ item }}
              </v-col>
              <v-col cols="12">
                <v-divider />
              </v-col>
            </v-row>
            <v-row ref="mathJaxPrintDialogContainerRef">
              <v-col
                v-if="previewTestList.length"
                cols="12"
              >
                <draggable
                  v-model="previewTestList"
                  item-key="id"
                  handle=".drag-handle"
                  @end="previewDragEnd"
                >
                  <template #item="{ element: item }">
                    <v-row :key="item.id">
                      <v-col cols="12">
                        <div
                          id="test-question"
                          v-html="item.question"
                        />
                        <img :src="item.q_file">

                        <div
                          v-if="
                            item.type == 'blank'
                              || item.type == 'shortanswer'
                              || item.type == 'descriptive'
                          "
                        >
                          <div v-html="item.answer_full" />
                          <img
                            v-show="item.answer_full_file"
                            :src="item.answer_full_file"
                          >
                        </div>
                        <div v-else>
                          <div class="answer">
                            <span>1)</span>
                            <span
                              v-show="item.answer_a"
                              v-html="item.answer_a"
                            />
                            <img
                              v-show="item.a_file"
                              :src="item.a_file"
                            >
                          </div>
                          <div class="answer">
                            <span>2)</span>
                            <span
                              v-show="item.answer_b"
                              v-html="item.answer_b"
                            />
                            <img
                              v-show="item.b_file"
                              :src="item.b_file"
                            >
                          </div>
                          <div class="answer">
                            <span>3)</span>
                            <span
                              v-show="item.answer_c"
                              v-html="item.answer_c"
                            />
                            <img
                              v-show="item.c_file"
                              :src="item.c_file"
                            >
                          </div>
                          <p class="answer">
                            <span>4)</span>
                            <span
                              v-show="item.answer_d"
                              v-html="item.answer_d"
                            />
                            <img
                              v-show="item.d_file"
                              :src="item.d_file"
                            >
                          </p>
                        </div>
                        <v-row>
                          <v-col cols="6">
                            <v-btn
                              icon
                              color="blue"
                              class="drag-handle"
                            >
                              <v-icon> mdi-cursor-move </v-icon>
                            </v-btn>
                          </v-col>
                          <v-col
                            cols="6"
                            class="text-right"
                          >
                            <v-btn
                              v-show="item.owner == true"
                              color="blue"
                              density="compact"
                              size="large"
                              :to="`/test-maker/create-test/edit/${item.id}`"
                              style="text-transform: none; font-size: 13px"
                            >
                              <v-icon size="large">
                                mdi-pencil
                              </v-icon>
                              Edit
                            </v-btn>
                            <v-btn
                              v-if="!tests.find((x) => x == item.id)"
                              color="blue"
                              density="compact"
                              size="large"
                              @click="applyTest(item, 'add')"
                            >
                              <v-icon size="large">
                                mdi-plus
                              </v-icon>
                              Add
                            </v-btn>
                            <v-btn
                              v-if="tests.find((x) => x == item.id)"
                              color="red"
                              density="compact"
                              size="large"
                              style="
                                text-transform: none;
                                font-size: 13px;
                                margin-inline: 5px;
                              "
                              @click="applyTest(item, 'remove')"
                            >
                              <v-icon size="large">
                                mdi-minus
                              </v-icon>
                              Delete
                            </v-btn>
                          </v-col>
                        </v-row>
                        <v-divider class="mt-3" />
                      </v-col>
                    </v-row>
                  </template>
                </draggable>
              </v-col>
              <v-col
                v-show="!previewTestList.length"
                cols="12"
                class="text-center"
              >
                <p>Oops! no data found</p>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-dialog>
    </v-row>
    <v-row>
      <v-dialog
        v-model="confirmDeleteDialog"
        persistent
        max-width="290"
      >
        <v-card class="px-5 py-3">
          <v-card-title
            class="text-h5 px-0"
            style="font-size: 13px; word-break: break-word; white-space: normal"
          >
            Are you sure of deleting the online exam?
          </v-card-title>
          <v-card-text
            class="px-0 py-1"
            style="
              font-size: 11px;
              word-break: break-word;
              white-space: normal;
              color: rgba(0, 0, 0, 0.6);
            "
          >
            If you are sure about the deletion, click Agree button.
          </v-card-text>
          <v-card-actions
            style="min-height: 35px !important; padding: 0px !important"
          >
            <v-btn
              text
              color="error"
              style="text-transform: none; font-size: 13px"
              @click="confirmDeleteDialog = false"
            >
              Disagree
            </v-btn>
            <v-btn
              color="green darken-1"
              text
              :loading="deleteLoading"
              style="text-transform: none; font-size: 13px"
              @click="deleteOnlineExam"
            >
              Agree
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>
    <!-- Delete exam test confirm dialog -->
    <v-dialog
      v-model="deleteTestConfirmDialog"
      max-width="290"
      persistent
    >
      <v-card class="pa-0">
        <v-card-title
          class="mt-2 text-h5"
          style="font-size: 13px"
        >
          Are you sure?
        </v-card-title>

        <v-card-text>
          <p style="color: rgba(0, 0, 0, 0.6); font-size: 13px">
            If you are sure to delete, click Yes.
          </p>
        </v-card-text>

        <v-card-actions>
          <v-spacer />

          <v-btn
            text
            style="text-transform: none; font-size: 13px"
            @click="deleteTestConfirmDialog = false"
          >
            No
          </v-btn>

          <v-btn
            color="green darken-1"
            text
            :loading="delete_exam_test_loading"
            style="text-transform: none; font-size: 13px"
            @click="deleteExamTest()"
          >
            Yes
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- End delete exam test confirm dialog -->
  </v-container>
</template>

<script setup>
import {
  ref,
  reactive,
  watch,
  nextTick,
  onMounted,
  onUpdated,
  computed,
} from 'vue'
import { useRuntimeConfig } from 'nuxt/app'
import { useRoute, useRouter } from 'vue-router'
import { useAuth } from '~/composables/useAuth'
import { useState, useNuxtApp } from '#app'
import { defineRule } from 'vee-validate'
import { required } from '@vee-validate/rules'
import draggable from 'vuedraggable'
import FormTopicSelector from '~/components/form/topic-selector.vue'
import CreateTestForm from '~/components/test-maker/create-test-form.vue'
import { definePageMeta, useHead } from '#imports'
// Get Nuxt app instance for accessing plugins like toast
const _config = useRuntimeConfig()
const _nuxtApp = useNuxtApp()
const { $renderMathInElement, $ensureMathJaxReady, $toast } = _nuxtApp

// Define validation rules
defineRule('required', required)

// Define layout and page metadata
definePageMeta({
  layout: 'test-maker-layout',
  middleware: ['auth', 'user-type'],
})

useHead({
  title: 'New Exam',
})

// Get services
const _auth = useAuth()
const route = useRoute()
const _router = useRouter()
const userToken = ref('')

// Core data
const test_step = ref(1) // Start at first step
const exam_id = ref('')
const exam_code = ref('')
const submit_loading = ref(false)
const publish_loading = ref(false)
const test_loading = ref(false)
const all_tests_loaded = ref(false)
const tests = ref([])
const timer = ref(null)
const observer = ref(null)
const topicSelector = ref(null)
const createForm = ref(null)
const testList = ref(null)
const _testListContent = ref(null)
const isFormValid = ref(false)
const isExamPublished = ref(false) // Track if the exam has been published

// Form data
const form = reactive({
  section: route.query.board ? route.query.board : null,
  base: route.query.grade ? route.query.grade : null,
  lesson: route.query.subject ? route.query.subject : null,
  topics: [],
  exam_type: null,
  level: '2',
  holding_time: false,
  state: null,
  area: null,
  school: null,
  duration: 3,
  title: '',
  paperID: route.query.paperId ? route.query.paperId : '',
  negative_point: false,
  file_original: '',
  holding_level: 4,
  edu_year: null,
  edu_month: null,
})

const file_original = ref(null)
const file_original_path = ref('')

// Filter data
const filter = reactive({
  section: '',
  base: '',
  lesson: '',
  topic: '',
  page: 1,
  perpage: 10,
  testsHasVideo: 'All',
  myTests: false,
})

// UI State
const printPreviewDialog = ref(false)
const confirmDeleteDialog = ref(false)
const deleteLoading = ref(false)
const previewTestList = ref([])
const topicTitleArr = ref([])
const testListSwitch = ref(false)
const lastCreatedTest = ref('')

// Delete exam test section
const deleteTestConfirmDialog = ref(false)
const delete_exam_test_id = ref(null)
const delete_exam_test_loading = ref(false)

// Data lists
const level_list = ref([])
const filter_level_list = ref([])
const grade_list = ref([])
const filter_grade_list = ref([])
const _field_list = ref([])
const lesson_list = ref([])
const filter_lesson_list = ref([])
const topic_list = ref([])
const test_type_list = ref([])
const test_list = ref([])
const selected_topics = ref([])

// MathJax refs
const mathJaxStep2ListContainerRef = ref()
const mathJaxStep3ReviewContainerRef = ref()
const mathJaxPrintDialogContainerRef = ref()

// Static data
const year_list = ref([
  2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016, 2015, 2014, 2013,
])

const month_list = ref([
  { id: 1, title: 'January' },
  { id: 2, title: 'February' },
  { id: 3, title: 'March' },
  { id: 4, title: 'April' },
  { id: 5, title: 'May' },
  { id: 6, title: 'June' },
  { id: 7, title: 'July' },
  { id: 8, title: 'August' },
  { id: 9, title: 'September' },
  { id: 10, title: 'October' },
  { id: 11, title: 'November' },
  { id: 12, title: 'December' },
])

// Default exam types in case API doesn't return any
const defaultExamTypes = [
  { id: '1', title: 'Final Exam' },
  { id: '2', title: 'Mid-term Exam' },
  { id: '3', title: 'Quiz' },
  { id: '4', title: 'Practice Test' },
  { id: '5', title: 'Mock Exam' },
]

const test_level_list = [
  { id: '1', title: 'Simple' },
  { id: '2', title: 'Medium' },
  { id: '3', title: 'Hard' },
]

const video_analysis_options = [
  { value: 0, title: 'All' },
  { value: 1, title: 'Have' },
  { value: -1, title: 'Do not have' },
]

const state_list = ref([])
const area_list = ref([])
const school_list = ref([])

const _holding_level_list = [
  { id: 1, title: 'School' },
  { id: 2, title: 'District' },
  { id: 3, title: 'State' },
  { id: 4, title: 'Country' },
]

// Compute the progress percentage for tests added (0-100%)
const testProgress = computed(() => {
  const minRequired = 5
  const currentCount = tests.value.length
  // Calculate percentage, capped at 100%
  const percentage = Math.min((currentCount / minRequired) * 100, 100)
  return percentage
})

// Computed property to check if we have exactly 5 tests
const _hasExactlyFiveTests = computed(() => {
  return tests.value.length === 5
})

// Computed property to check if we have enough tests
const hasEnoughTests = computed(() => {
  return tests.value.length >= 5
})

// Change from ref to computed
const test_share_link = computed(() => {
  if (import.meta.server) {
    // Return a consistent value during SSR to avoid hydration mismatch
    return `https://gamatrain.com/exam/${exam_id.value || ''}`
  }
  // Only use window.location on client side
  return `${window.location.origin}/exam/${exam_id.value || ''}`
})

const resetTestList = () => {
  filter.page = 1
  test_list.value = []
  all_tests_loaded.value = false
}

const loadFilteredTests = async () => {
  if (filter.lesson) {
    await getExamTests()
  }
}

// Generate title function
const generateTitle = () => {
  let lesson_title = ''
  if (form.lesson && lesson_list.value.length > 0) {
    const lessonItem = lesson_list.value.find(x => x.id === form.lesson)
    lesson_title = lessonItem?.title || ''
  }

  let base_title = ''
  if (form.base && grade_list.value.length > 0) {
    const baseItem = grade_list.value.find(x => x.id === form.base)
    base_title = baseItem?.title || ''
  }

  form.title = `${lesson_title} Test ${base_title} Grade`
}

// Return title of level for show in preview list
const calcLevel = (level) => {
  if (level) {
    const levelItem = test_level_list.find(x => x.id === level)
    return levelItem ? levelItem.title : ''
  }
  return ''
}

// API methods
const getTypeList = async (type, parent = '', trigger = '') => {
  try {
    // If parent is empty and this is not the section type, return early
    // This prevents API calls with empty parent IDs which could return incorrect data
    if (!parent && type !== 'section' && type !== 'exam_type') {
      // Clear the appropriate list based on type and trigger
      if (type === 'base') {
        if (trigger === 'filter') filter_grade_list.value = []
        else grade_list.value = []
      }
      else if (type === 'lesson') {
        if (trigger === 'filter') filter_lesson_list.value = []
        else lesson_list.value = []
      }
      else if (type === 'topic') {
        topic_list.value = []
      }
      return
    }

    const params = {
      type: type,
    }

    // Set up parameters based on type
    if (type === 'base') params.section_id = parent
    if (type === 'lesson') params.base_id = parent
    if (type === 'topic') params.lesson_id = parent
    if (type === 'area') params.state_id = parent
    if (type === 'school') {
      params.section_id = form.section
      params.area_id = form.area
    }

    // Add loading state if needed
    const loadingTarget
      = type === 'section'
        ? trigger === 'filter'
          ? filter_level_list
          : level_list
        : type === 'base'
          ? trigger === 'filter'
            ? filter_grade_list
            : grade_list
          : type === 'lesson'
            ? trigger === 'filter'
              ? filter_lesson_list
              : lesson_list
            : type === 'topic'
              ? topic_list
              : null

    if (loadingTarget) {
      // Set a temporary loading item
      loadingTarget.value = [{ id: '', title: 'Loading...', disabled: true }]
    }

    const res = await useApiService.get('/api/v1/types/list', params)

    if (res && res.data && Array.isArray(res.data)) {
      if (type === 'section') {
        if (trigger === 'filter') {
          filter_level_list.value = res.data
        }
        else {
          level_list.value = res.data
          filter_level_list.value = res.data
        }
      }
      else if (type === 'base') {
        if (trigger === 'filter') {
          filter_grade_list.value = res.data
        }
        else {
          grade_list.value = res.data
          filter_grade_list.value = res.data
        }
      }
      else if (type === 'lesson') {
        if (trigger === 'filter') {
          filter_lesson_list.value = res.data
        }
        else {
          lesson_list.value = res.data
          filter_lesson_list.value = res.data
        }
      }
      else if (type === 'topic') {
        topic_list.value = res.data
      }
      else if (type === 'exam_type') {
        // Make sure we're properly assigning the exam_type data
        test_type_list.value = res.data
      }
      else if (type === 'state') {
        state_list.value = res.data
      }
      else if (type === 'area') {
        area_list.value = res.data
      }
      else if (type === 'school') {
        school_list.value = res.data
      }

      generateTitle()
    }
    else {
      if (type === 'base') {
        if (trigger === 'filter') filter_grade_list.value = []
        else grade_list.value = []
      }
      else if (type === 'lesson') {
        if (trigger === 'filter') filter_lesson_list.value = []
        else lesson_list.value = []
      }
      else if (type === 'topic') {
        topic_list.value = []
      }
    }
  }
  catch {
    // Reset the target list to empty on error
    if (type === 'section') {
      if (trigger === 'filter') filter_level_list.value = []
      else level_list.value = []
    }
    else if (type === 'base') {
      if (trigger === 'filter') filter_grade_list.value = []
      else grade_list.value = []
    }
    else if (type === 'lesson') {
      if (trigger === 'filter') filter_lesson_list.value = []
      else lesson_list.value = []
    }
    else if (type === 'topic') {
      topic_list.value = []
    }
    else if (type === 'exam_type') {
      test_type_list.value = []
    }
  }
}

const selectTopic = (event) => {
  selected_topics.value = event
  const numbers = []
  for (let i = 0; i < event.length; i++) {
    numbers[i] = parseInt(event[i])
  }
  form.topics = numbers
  if (form.topics.length) getTopicTitleList()
}

const getTopicTitleList = () => {
  topicTitleArr.value = []
  let title = ''
  for (const index in form.topics) {
    const topicItem = topic_list.value.find(x => x.id == form.topics[index])
    title = topicItem?.title || ''
    topicTitleArr.value.push(title)
  }
}

const submitQuestion = async () => {
  submit_loading.value = true

  // Validate form fields
  if (!validateHeaderForm()) {
    submit_loading.value = false
    return
  }

  // Arrange to form data
  const formData = new FormData()
  for (const key in form) {
    if (key !== 'topics') formData.append(key, form[key])
  }

  if (form.topics.length) {
    for (const key in form.topics) {
      formData.append('topics[]', form.topics[key])
    }
  }

  try {
    const response = await useApiService.post(
      '/api/v1/exams',
      urlencodeFormData(formData),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      },
    )

    exam_id.value = response.data.id
    exam_code.value = response.data.code

    // Set in store
    const userState = useState('user')
    userState.value = {
      ...userState.value,
      currentExamId: exam_id.value,
      currentExamCode: exam_code.value,
    }

    // Update create form component with new exam info if it exists
    if (
      createForm.value
      && typeof createForm.value.getCurrentExamInfo === 'function'
    ) {
      createForm.value.getCurrentExamInfo()
    }

    // Move to the next step
    test_step.value = 2
  }
  catch (_err) {
    console.error('Error creating test:', _err)
    if ($toast) $toast.error('Failed to create test')
  }
  finally {
    submit_loading.value = false
  }
}

// Convert form data from multipart to urlencode
const urlencodeFormData = (fd) => {
  const params = new URLSearchParams()

  for (const [key, value] of fd.entries()) {
    if (typeof value === 'string') {
      params.append(key, value)
    }
  }

  const result = params.toString()
  return result
}

const _encode = (s) => {
  return encodeURIComponent(s).replace(/%20/g, '+')
}

const copyUrl = () => {
  navigator.clipboard.writeText(test_share_link.value)
  if ($toast) $toast.success('Copied')
}

const uploadFile = async (_file_name) => {
  if (!file_original.value) return

  const formData = new FormData()
  formData.append('file', file_original.value)

  try {
    const response = await useApiService.post('/api/v1/upload', formData)
    if (response.data?.[0]?.file?.name) {
      form.file_original = response.data[0].file.name
    }
    else {
      console.warn('No file name in upload response')
    }
  }
  catch (err) {
    console.error(err)
  }
}

const publishTest = async () => {
  publish_loading.value = true

  try {
    const response = await useApiService.put(
      `/api/v1/exams/publish/${exam_id.value}`,
    )

    if (response.status === 1) {
      // Store the published exam ID for share link
      const publishedExamId = response.data.id || exam_id.value

      // Reset state
      exam_id.value = ''
      exam_code.value = ''

      // Update store
      const userState = useState('user')
      userState.value = {
        ...userState.value,
        currentExamId: '',
        currentExamCode: '',
      }

      // Update the test share link
      exam_id.value = publishedExamId

      // Reset data
      previewTestList.value = []
      tests.value = []

      // Mark exam as published
      isExamPublished.value = true

      // Clear form data
      resetForm()

      // Navigate to publish step
      test_step.value = 4
    }
  }
  catch (_err) {
    console.error('Error publishing test:', _err)
    if ($toast) $toast.error('Failed to publish test')
  }
  finally {
    publish_loading.value = false
  }
}

// Helper functions for URL query handling
const checkActiveParam = () => {
  if (route.query.active) {
    if (route.query.active === 'test_list') {
      testListSwitch.value = true
      test_step.value = 2
    }
    else if (route.query.active === 'add_test') {
      testListSwitch.value = false
      test_step.value = 2
    }
  }
  else {
    // Reset to first step when no query parameters
    test_step.value = 1
  }
}

// Submit tests to the exam
const submitTest = async (skipListRefresh = false) => {
  try {
    if (!tests.value.length) {
      return
    }

    // Ensure we have a valid exam ID
    if (!exam_id.value) {
      console.error('No exam ID available, cannot submit tests')

      return
    }

    // Ensure all test IDs are strings for consistent comparison
    tests.value = tests.value.map(id => String(id))

    const formData = new URLSearchParams()
    tests.value.forEach((id) => {
      formData.append('tests[]', String(id))
    })

    // Log the tests being submitted
    console.log(
      `Submitting ${tests.value.length} tests to exam ${exam_id.value}`,
    )
    console.log('Tests:', tests.value)

    const response = await useApiService.put(
      `/api/v1/exams/tests/${exam_id.value}`,
      formData.toString(),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        },
      },
    )

    if (response.status === 1) {
      await nextTick()
      await forceUIUpdate()
      await handleRefreshPreviewList()
      createForm.value.examTestListLength = tests.value.length
    }

    // Add a small delay to ensure the backend has processed the update
    await new Promise(resolve => setTimeout(resolve, 300))

    // Force UI to update with the current test count
    if (createForm.value && 'examTestListLength' in createForm.value) {
      createForm.value.examTestListLength = tests.value.length
    }

    // Refresh the preview list if needed
    if (!skipListRefresh) {
      await handleRefreshPreviewList()
    }

    // Force a UI update if we've just reached or fallen below the threshold
    if (tests.value.length === 5) {
      // Force a nextTick to ensure the UI updates
      await nextTick()
    }
  }
  catch (_err) {
    console.error('Failed to update tests:', _err)
  }
}

// Helper function to fetch details for a single test by its ID
const fetchTestDetails = async (testId) => {
  try {
    const response = await useApiService.get(`/api/v1/examTests/${testId}`)
    if (response && response.status === 1 && response.data) {
      return response.data
    }
    console.warn(`No data returned for test ${testId} from fetchTestDetails`)
    return null
  }
  catch (err) {
    console.error(`Error fetching details for test ${testId}:`, err)
    return null
  }
}

// New unified function to load and refresh the preview list
const handleRefreshPreviewList = async () => {
  if (!exam_id.value) {
    previewTestList.value = []
    if (createForm.value && 'examTestListLength' in createForm.value) {
      createForm.value.examTestListLength = 0
    }
    return
  }

  test_loading.value = true

  try {
    const currentTestIds = tests.value.map(id => String(id))

    if (currentTestIds.length === 0) {
      previewTestList.value = []
      if (createForm.value && 'examTestListLength' in createForm.value) {
        createForm.value.examTestListLength = 0
      }
      test_loading.value = false
      return
    }

    const response = await useApiService.get(`/api/v1/examTests`, {
      exam_id: exam_id.value,
    })

    let fetchedApiTests = []
    if (response && response.status === 1) {
      fetchedApiTests = Array.isArray(response.data)
        ? response.data
        : response.data?.list || []
    }

    const fetchedDetailsMap = new Map(
      fetchedApiTests.map(test => [String(test.id), test]),
    )

    const newPreviewListConstructionPromises = currentTestIds.map(
      async (testId) => {
        if (fetchedDetailsMap.has(testId)) {
          return fetchedDetailsMap.get(testId)
        }
        else {
          // Test is in local `tests.value` but not in the bulk API response.
          // This could be a newly added test not yet fully reflected, or an orphaned ID.
          // Attempt to fetch its details directly.
          console.warn(
            `Test ${testId} was in local tests.value but not in bulk API response. Fetching individually.`,
          )
          const individualDetails = await fetchTestDetails(testId)
          if (individualDetails) {
            return individualDetails
          }
          else {
            // If even individual fetch fails, create a placeholder indicating an issue.
            console.error(
              `Failed to fetch details for ${testId} even individually. Creating placeholder.`,
            )
            return {
              id: testId,
              question: `Issue loading test ${testId}`,
              type: 'error',
              isPlaceholder: true,
              owner: true,
            } // Assuming owner if it's in tests.value
          }
        }
      },
    )

    const constructedList = (
      await Promise.all(newPreviewListConstructionPromises)
    ).filter(Boolean)

    // Ensure the order of previewTestList matches tests.value
    previewTestList.value = currentTestIds
      .map((id) => {
        return constructedList.find(test => String(test.id) === id)
      })
      .filter(Boolean) // Clean out any nulls if a test somehow failed all fetches
  }
  catch (err) {
    console.error('Error in handleRefreshPreviewList during API call:', err)
    // Fallback: If the main API call itself fails, try to build from tests.value with placeholders
    if (tests.value.length > 0 && previewTestList.value.length === 0) {
      const fallbackPromises = tests.value.map(async (id) => {
        const details = await fetchTestDetails(String(id))
        return (
          details || {
            id: String(id),
            question: `Loading error for ${id}`,
            type: 'error',
            isPlaceholder: true,
            owner: true,
          }
        )
      })

      previewTestList.value = (await Promise.all(fallbackPromises)).filter(
        Boolean,
      )
    }
  }
  finally {
    test_loading.value = false
    if (createForm.value && 'examTestListLength' in createForm.value) {
      createForm.value.examTestListLength = tests.value.length
    }
  }
}

// Get current exam information
const getCurrentExamInfo = async () => {
  // Check if we have an exam ID in the user state
  const userState = useState('user')
  if (userState.value?.currentExamId) {
    exam_id.value = userState.value.currentExamId
    exam_code.value = userState.value.currentExamCode

    // Move to step 2 for tests
    test_step.value = 2

    try {
      const response = await useApiService.get(
        `/api/v1/exams/info/${exam_id.value}`,
      )

      // Set tests array from response
      if (response.data?.tests?.length) {
        tests.value = response.data.tests.map(id => String(id)) // Ensure string IDs
      }
      else {
        tests.value = []
      }

      // Set form data in sequence to trigger proper cascading updates
      if (response.data.section) {
        form.section = response.data.section
        await getTypeList('base', response.data.section)
        if (response.data.base) {
          form.base = response.data.base
          await getTypeList('lesson', response.data.base)
          if (response.data.lesson) {
            form.lesson = response.data.lesson
            await getTypeList('topic', response.data.lesson)
            if (response.data.topics && response.data.topics.length) {
              form.topics = response.data.topics
              await getTopicTitleList()
            }
          }
        }
      }

      if (response.data.file_original) {
        file_original_path.value = response.data.file_original
      }

      // Other form fields from response.data if necessary
      form.exam_type = response.data.exam_type || ''
      form.level = response.data.level || '2'
      form.duration = response.data.duration || 3
      form.title = response.data.title || ''
      form.paperID = response.data.paperID || ''
      form.edu_year = response.data.edu_year || ''
      form.edu_month = response.data.edu_month || ''

      // ... any other fields that should be populated from exam info
    }
    catch (err) {
      console.error('Error fetching exam info:', err)
    }
  }
}

// Handle scrolling for test list
const onScroll = () => {
  if (!testList.value || test_loading.value || all_tests_loaded.value) return

  const scrollElement = testList.value.$el
  const scrollPosition = scrollElement.scrollTop
  const scrollHeight = scrollElement.scrollHeight
  const clientHeight = scrollElement.clientHeight

  // Check if we're near the bottom of the scroll container
  // Only trigger when we're within 200px of the bottom
  const isNearBottom = scrollPosition + clientHeight >= scrollHeight - 200

  // Avoid multiple requests with debounce
  if (timer.value) {
    clearTimeout(timer.value)
    timer.value = null
  }

  if (isNearBottom && filter.lesson) {
    timer.value = setTimeout(() => {
      test_loading.value = true
      filter.page = filter.page + 1
      getExamTests()
    }, 800)
  }
}

const getRequiredFormData = async () => {
  let sectionId = form.section
  if (!sectionId) {
    if (level_list.value.length === 0) {
      await getTypeList('section')
    }
    sectionId = level_list.value.length > 0 ? level_list.value[0].id : null
  }

  if (!sectionId) {
    throw new Error('No valid section available')
  }

  let baseId = form.base
  if (!baseId) {
    if (grade_list.value.length === 0) {
      await getTypeList('base', sectionId)
    }
    baseId = grade_list.value.length > 0 ? grade_list.value[0].id : null
  }

  if (!baseId) {
    throw new Error('No valid grade available')
  }

  let lessonId = form.lesson
  if (!lessonId) {
    if (lesson_list.value.length === 0) {
      await getTypeList('lesson', baseId)
    }
    lessonId = lesson_list.value.length > 0 ? lesson_list.value[0].id : null
  }

  if (!lessonId) {
    throw new Error('No valid lesson available')
  }

  let examTypeId = form.exam_type
  if (!examTypeId) {
    if (test_type_list.value.length === 0) {
      await loadExamTypes()
    }
    examTypeId
      = test_type_list.value.length > 0 ? test_type_list.value[0].id : null
  }

  if (!examTypeId) {
    throw new Error('No valid exam type available')
  }

  const lessonTitle
    = lesson_list.value.find(l => l.id == lessonId)?.title || 'Test'
  const baseTitle
    = grade_list.value.find(b => b.id == baseId)?.title || 'Grade'

  return {
    title: form.title || `${lessonTitle} Test ${baseTitle}`,
    duration: form.duration || 3,
    level: form.level || '2',
    section: sectionId,
    base: baseId,
    lesson: lessonId,
    exam_type: examTypeId,
    edu_year: form.edu_year || new Date().getFullYear().toString(),
    edu_month: form.edu_month || '1',
  }
}

const ensureBasicDataLoaded = async () => {
  try {
    if (!level_list.value.length) {
      await getTypeList('section')
    }

    if (!test_type_list.value.length) {
      await loadExamTypes()
    }
  }
  catch (_err) {
    console.error('Error loading basic data:', _err)
    throw _err
  }
}

const createDraftExam = async () => {
  submit_loading.value = true

  try {
    await ensureBasicDataLoaded()

    const requiredData = await getRequiredFormData()

    const formData = new FormData()

    Object.keys(requiredData).forEach((key) => {
      if (requiredData[key] !== null && requiredData[key] !== undefined) {
        formData.append(key, String(requiredData[key]))
      }
    })

    if (form.topics && form.topics.length) {
      form.topics.forEach((topic) => {
        formData.append('topics[]', String(topic))
      })
    }

    const response = await useApiService.post(
      '/api/v1/exams',
      urlencodeFormData(formData),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      },
    )

    if (response && response.data && response.data.id) {
      exam_id.value = response.data.id
      exam_code.value = response.data.code

      const userState = useState('user')
      userState.value = {
        ...userState.value,
        currentExamId: exam_id.value,
        currentExamCode: exam_code.value,
      }

      if (
        createForm.value
        && typeof createForm.value.getCurrentExamInfo === 'function'
      ) {
        createForm.value.getCurrentExamInfo()
      }
    }
    else {
      throw new Error('Invalid response from server')
    }
  }
  catch (_err) {
    console.error('Error creating draft exam:', _err)

    let _errorMessage = 'Error creating draft exam'
    if (_err.response?.data?.message) {
      _errorMessage = _err.response.data.message

      if (_err.response.data.data && Array.isArray(_err.response.data.data)) {
        _errorMessage += ` Missing fields: ${_err.response.data.data.join(
          ', ',
        )}`
      }
    }
    else if (_err.message) {
      _errorMessage = _err.message
    }

    throw _err
  }
  finally {
    submit_loading.value = false
  }
}

// Force UI update when tests count changes
const forceUIUpdate = async () => {
  // Ensure consistent string IDs
  tests.value = tests.value.map(id => String(id))

  // Update the test count in the create form component
  if (createForm.value && 'examTestListLength' in createForm.value) {
    createForm.value.examTestListLength = tests.value.length
  }
}

const applyTest = async (item, type = null) => {
  try {
    if (type === 'add' && !exam_id.value) {
      await createDraftExam()

      if (!exam_id.value) {
        throw new Error('Failed to create draft exam')
      }
    }

    const testId = String(item.id)
    // Always use string comparison
    const testExists = tests.value.some(id => String(id) === testId)

    // Store the old length to check if we hit exactly 5 tests
    const _oldLength = tests.value.length

    if (testExists && type === 'remove') {
      const index = tests.value.findIndex(id => String(id) === testId)
      if (index !== -1) {
        tests.value.splice(index, 1)
        await forceUIUpdate() // Force UI update immediately
        await submitTest()
      }
    }

    if (!testExists && type === 'add') {
      tests.value.push(testId)
      await forceUIUpdate() // Force UI update immediately
      await submitTest()
    }

    // Force refresh the preview list to ensure UI consistency
    await handleRefreshPreviewList()
  }
  catch (_err) {
    console.error('Error in applyTest:', _err)
  }
}

// Get exam tests
const getExamTests = async () => {
  test_loading.value = true

  try {
    const params = {
      lesson: filter.lesson,
      topic: filter.topic,
      myTests: filter.myTests,
      testsHasVideo: filter.testsHasVideo,
      page: filter.page,
      perpage: filter.perpage,
    }

    const response = await useApiService.get('/api/v1/examTests', params)
    test_list.value.push(...(response?.data?.list ?? []))

    // Update the examTestListLength with the actual tests array length, not the response length
    if (createForm.value && 'examTestListLength' in createForm.value) {
      createForm.value.examTestListLength = tests.value.length
    }

    if ((response?.data?.list ?? []).length === 0) {
      all_tests_loaded.value = true
    }
    else {
      all_tests_loaded.value = false
    }
  }
  catch (err) {
    console.log(err)
  }
  finally {
    test_loading.value = false
  }
}

const deleteOnlineExam = async () => {
  deleteLoading.value = true

  try {
    const response = await useApiService.remove(
      `/api/v1/exams/${exam_id.value}`,
    )

    if (response.data.message === 'done') {
      // Reset all values
      exam_id.value = ''
      exam_code.value = ''
      isExamPublished.value = false
      // Reset tests
      tests.value = []
      previewTestList.value = []
      // Reset state in user store
      const userState = useState('user')
      userState.value = {
        ...userState.value,
        currentExamId: '',
        currentExamCode: '',
      }
      // Reset form and data
      resetForm()
      // Reset to first step
      test_step.value = 1
    }
  }
  catch (err) {
    console.error('Error deleting exam:', err)
  }
  finally {
    deleteLoading.value = false
    confirmDeleteDialog.value = false
  }
}

// Open delete confirmation dialog
const openTestDeleteConfirmDialog = (item_id) => {
  delete_exam_test_id.value = item_id
  deleteTestConfirmDialog.value = true
}

// Delete exam test
const deleteExamTest = async () => {
  delete_exam_test_loading.value = true

  try {
    await useApiService.remove(
      `/api/v1/examTests/${delete_exam_test_id.value}`,
    )

    // Remove from tests array
    const index = tests.value.findIndex(
      id => id === delete_exam_test_id.value,
    )
    if (index !== -1) {
      tests.value.splice(index, 1)
    }

    // Refresh test lists
    filter.page = 1
    test_list.value = []
    getExamTests()
  }
  catch (err) {
    console.error('Error deleting exam test:', err)
  }
  finally {
    delete_exam_test_loading.value = false
    delete_exam_test_id.value = null
    deleteTestConfirmDialog.value = false
  }
}

// Form validation helper
const validateHeaderForm = () => {
  // Check required fields
  if (!form.section) {
    return false
  }
  if (!form.base) {
    return false
  }
  if (!form.lesson) {
    return false
  }

  if (!form.title) {
    return false
  }
  if (!form.duration) {
    return false
  }
  return true
}

// Handle stepper navigation to validate steps
const handleStepChange = (newStep) => {
  // Don't allow changing to step 4 (Publish) if we don't have enough tests
  if (newStep === 4 && tests.value.length < 5) {
    // Revert to step 3 (Review)
    test_step.value = 3
    return
  }

  // Prevent access to step 4 if exam hasn't been published yet
  if (newStep === 4 && !isExamPublished.value) {
    // Revert to step 3 (Review)
    test_step.value = 3
    return
  }

  // Prevent access to step 4 directly from step 1 or 2
  if (newStep === 4 && test_step.value < 3) {
    // Go to step 3 (Review) instead
    test_step.value = 3
    return
  }

  // If moving to Review step (3), make sure we load the test data
  if (newStep === 3 && exam_id.value) {
    test_step.value = newStep

    handleRefreshPreviewList()
      .then(() => {
        if (previewTestList.value.length === 0 && tests.value.length > 0) {
          setTimeout(() => {
            handleRefreshPreviewList().then(() => {
              if (previewTestList.value.length > 0) {
                // Preview list already loaded
                console.log('Preview list already loaded')
              }
            })
          }, 1000)
        }
        else if (previewTestList.value.length > 0) {
          // Preview list already loaded
          console.log('Preview list already loaded')
        }
      })
      .catch((err) => {
        console.error('Error loading test data:', err)
      })
    return
  }

  // If all validations pass, update the step
  test_step.value = newStep

  // Show step change notification
  if (newStep !== test_step.value) {
    const _stepNames = {
      1: 'Header',
      2: 'Tests',
      3: 'Review',
      4: 'Publish',
    }
  }
}

/**
 * Reset form fields to initial state
 */
const resetForm = () => {
  // Reset all form fields
  form.section = ''
  form.base = ''
  form.lesson = ''
  form.topics = []
  form.exam_type = ''
  form.level = '2'
  form.holding_time = false
  form.state = ''
  form.area = ''
  form.school = ''
  form.duration = 3
  form.title = ''
  form.negative_point = false
  form.file_original = ''
  form.paperID = ''
  form.edu_year = ''
  form.edu_month = ''

  // Reset data lists that are dependent on form fields
  grade_list.value = []
  lesson_list.value = []
  topic_list.value = []
  form.topics = []
  selected_topics.value = []

  // Reset file inputs
  file_original.value = null
  file_original_path.value = ''
}

/**
 * Reset all data (used after deletion)
 */
const _resetAllData = () => {
  // Reset form
  resetForm()

  // Reset exam data
  exam_id.value = ''
  exam_code.value = ''
  isExamPublished.value = false

  // Reset tests
  tests.value = []
  previewTestList.value = []

  // Reset state in user store
  const userState = useState('user')
  userState.value = {
    ...userState.value,
    currentExamId: '',
    currentExamCode: '',
  }
}

// Add a new function to help users understand how many tests are needed
const _goToNextStep = () => {
  if (tests.value.length < 5) {
    return
  }

  test_step.value = 3
}

const handleClearSection = () => {
  filter.section = ''
  filter.base = ''
  filter.lesson = ''
  filter.topic = ''
  filter_grade_list.value = []
  filter_lesson_list.value = []
  topic_list.value = []
  resetTestList()
}

const handleClearBase = () => {
  filter.base = ''
  filter.lesson = ''
  filter.topic = ''
  filter_lesson_list.value = []
  topic_list.value = []
  resetTestList()
}

const handleClearLesson = () => {
  filter.lesson = ''
  filter.topic = ''
  topic_list.value = []
  resetTestList()
}

const handleClearTopic = () => {
  filter.topic = ''
  resetTestList()
  loadFilteredTests()
}

/**
 * Specifically load exam types with better error handling
 */
const loadExamTypes = async () => {
  try {
    // First try to get exam types from the API
    const res = await useApiService.get('/api/v1/types/list', {
      type: 'exam_type',
    })

    if (res && res.data && Array.isArray(res.data) && res.data.length > 0) {
      test_type_list.value = res.data
    }
    else {
      // If API returned no data, use fallback
      test_type_list.value = defaultExamTypes
    }
  }
  catch {
    // Use fallback in case of error
    test_type_list.value = defaultExamTypes
  }
}

/**
 * Handle drag end event for reordering preview items
 * This is called when the user finishes dragging/reordering tests in the preview dialog
 */
const previewDragEnd = async () => {
  // Extract IDs from the reordered preview list
  const new_list = []
  for (const index in previewTestList.value) {
    new_list.push(previewTestList.value[index].id)
  }

  // Update the tests array with the new order
  tests.value = new_list

  // Submit the reordered tests to the backend and refresh the preview list
  await submitTest()
}

// Handle test refresh events from CreateTestForm component
const handleTestRefresh = async () => {
  try {
    // Force UI update immediately
    await forceUIUpdate()

    // Wait for API operations to complete
    await new Promise(resolve => setTimeout(resolve, 300))

    // Refresh the preview list
    await handleRefreshPreviewList()

    // If in test list mode, refresh the test list as well
    if (testListSwitch.value) {
      filter.page = 1
      test_list.value = []
      all_tests_loaded.value = false
      await getExamTests()
    }
  }
  catch (err) {
    console.error('Error in handleTestRefresh:', err)
  }
}

const typesetMathInSpecificContainer = async (containerRef) => {
  if (import.meta.client && containerRef.value && window.MathJax) {
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

    try {
      await $ensureMathJaxReady()
      await nextTick()

      if (containerRef.value) {
        let currentElementForProcessing = null

        if (
          containerRef.value.$el
          && containerRef.value.$el instanceof HTMLElement
        ) {
          currentElementForProcessing = containerRef.value.$el
        }
        else if (containerRef.value instanceof HTMLElement) {
          currentElementForProcessing = containerRef.value
        }

        if (currentElementForProcessing) {
          $renderMathInElement(currentElementForProcessing)
        }
      }
    }
    catch (error) {
      console.error('MathJax Error:', error)
    }
  }
}

// Watch for newly created tests and add them to the current exam
watch(
  () => lastCreatedTest.value,
  (newTest) => {
    if (newTest && !tests.value.find(x => x == newTest)) {
      {
        tests.value.push(newTest)
        submitTest()
      }
    }
  },
)

// Watch for changes in form.section (Board)
watch(
  () => form.section,
  async (val, oldVal) => {
    if (val) {
      // Reset dependent fields when section changes
      if (val !== oldVal) {
        form.base = ''
        form.lesson = ''
        form.topics = []
        grade_list.value = []
        lesson_list.value = []
        topic_list.value = []
        selected_topics.value = []
      }

      // Fetch new grade list
      await getTypeList('base', val)

      // Update filter and createForm if available
      filter.section = val // Init second level filter
      if (createForm.value && createForm.value.form) {
        createForm.value.form.section = val
      }

      // Check if we need to fetch school list
      if (form.area) {
        await getTypeList('school')
      }
    }
  },
)

// Watch for changes in form.base (Grade)
watch(
  () => form.base,
  async (val, oldVal) => {
    if (val) {
      // Reset dependent fields when base changes
      if (val !== oldVal) {
        form.lesson = ''
        form.topics = []
        lesson_list.value = []
        topic_list.value = []
        selected_topics.value = []
      }

      // Fetch new lesson list
      await getTypeList('lesson', val)

      // Update filter and createForm if available
      filter.base = val // Init second level filter
      if (createForm.value && createForm.value.form) {
        createForm.value.form.base = val
      }

      // Generate title based on new base value
      generateTitle()
    }
  },
)

// Watch for changes in form.lesson (Subject)
watch(
  () => form.lesson,
  async (val, oldVal) => {
    if (val) {
      // Reset topic when lesson changes
      if (val !== oldVal) {
        form.topics = []
        topic_list.value = []
        selected_topics.value = []
      }

      // Fetch new topic list
      await getTypeList('topic', val)

      // Update topic selector if available
      if (topicSelector.value) {
        topicSelector.value.lesson_selected = true
      }
    }
    else {
      // Reset topics when lesson is cleared
      form.topics = []
      topic_list.value = []
      // Update topic selector if available
      if (topicSelector.value) {
        topicSelector.value.lesson_selected = false
      }
    }

    // Update filter and createForm if available
    filter.lesson = val // Init second level filter
    if (createForm.value && createForm.value.form) {
      createForm.value.form.lesson = val
    }

    // Generate title based on new lesson value
    generateTitle()
  },
)

watch(
  () => filter.section,
  async (newVal, oldVal) => {
    if (newVal && newVal !== oldVal) {
      // Reset dependent filters
      filter.base = ''
      filter.lesson = ''
      filter.topic = ''

      // Clear dependent lists
      filter_grade_list.value = []
      filter_lesson_list.value = []
      topic_list.value = []

      // Reset test list and pagination
      resetTestList()

      try {
        test_loading.value = true
        await getTypeList('base', newVal, 'filter')
      }
      catch (error) {
        console.error('Error loading grades for section:', error)
      }
      finally {
        test_loading.value = false
      }
    }
    else if (!newVal && oldVal) {
      // Section was cleared
      handleClearSection()
    }
  },
)

watch(
  () => filter.base,
  async (newVal, oldVal) => {
    if (newVal && newVal !== oldVal) {
      // Reset dependent filters
      filter.lesson = ''
      filter.topic = ''

      // Clear dependent lists
      filter_lesson_list.value = []
      topic_list.value = []

      // Reset test list and pagination
      resetTestList()

      try {
        test_loading.value = true
        await getTypeList('lesson', newVal, 'filter')
      }
      catch (error) {
        console.error('Error loading lessons for base:', error)
      }
      finally {
        test_loading.value = false
      }
    }
    else if (!newVal && oldVal) {
      // Base was cleared
      handleClearBase()
    }
  },
)

watch(
  () => filter.lesson,
  async (newVal, oldVal) => {
    if (newVal && newVal !== oldVal) {
      // Reset topic filter
      filter.topic = ''
      topic_list.value = []

      // Reset test list and pagination
      resetTestList()

      try {
        test_loading.value = true
        await getTypeList('topic', newVal, 'filter')

        // Load tests after topics are loaded
        await loadFilteredTests()
      }
      catch (error) {
        console.error('Error loading topics for lesson:', error)
      }
      finally {
        test_loading.value = false
      }
    }
    else if (!newVal && oldVal) {
      // Lesson was cleared
      handleClearLesson()
    }
  },
)

watch(
  () => filter.topic,
  async (newVal, oldVal) => {
    if (newVal !== oldVal) {
      resetTestList()
      await loadFilteredTests()
    }
  },
)

watch(
  () => filter.testsHasVideo,
  async (newVal, oldVal) => {
    if (newVal !== oldVal) {
      resetTestList()
      await loadFilteredTests()
    }
  },
)

watch(
  () => filter.myTests,
  async (newVal, oldVal) => {
    if (newVal !== oldVal) {
      resetTestList()
      await loadFilteredTests()
    }
  },
)

watch(
  () => form.state,
  (val) => {
    if (val) {
      getTypeList('area', val)
    }
  },
)

watch(
  () => form.area,
  (val) => {
    if (val && form.section) {
      getTypeList('school')
    }
  },
)

// Watch for changes in route query parameter
watch(
  () => route.query,
  () => {
    checkActiveParam()
  },
  { deep: true },
)

// Watch for changes in tests array to update the button number
watch(
  () => tests.value,
  async (newTests, oldTests) => {
    // Log test count changes for debugging
    console.log(
      `Tests count changed: ${oldTests?.length || 0} -> ${newTests.length}`,
    )
    console.log(`hasEnoughTests: ${hasEnoughTests.value}`)

    // Update the test count in the create form component
    if (createForm.value && 'examTestListLength' in createForm.value) {
      createForm.value.examTestListLength = newTests.length
      console.log(`Updated examTestListLength to ${newTests.length}`)
    }

    // Check if the tests array has changed and we have an exam ID
    if (
      exam_id.value
      && (newTests.length !== oldTests?.length
        || JSON.stringify(newTests.map(id => String(id)))
        !== JSON.stringify(oldTests?.map(id => String(id))))
    ) {
      // Ensure consistent string IDs
      tests.value = newTests.map(id => String(id))

      // Refresh the preview list
      await handleRefreshPreviewList()
    }
  },
  { deep: true },
)

watch(
  () => hasEnoughTests.value,
  async (newVal, oldVal) => {
    if (newVal !== oldVal) {
      await nextTick()
      await forceUIUpdate()
      await loadFilteredTests()
      await handleRefreshPreviewList()
    }
  },
)

watch(
  test_list,
  async () => {
    if (test_step.value === 2 && testListSwitch.value) {
      await typesetMathInSpecificContainer(mathJaxStep2ListContainerRef)
    }
  },
  { deep: true },
)

watch(
  previewTestList,
  async () => {
    if (test_step.value === 3) {
      await typesetMathInSpecificContainer(mathJaxStep3ReviewContainerRef)
    }
    if (printPreviewDialog.value) {
      await typesetMathInSpecificContainer(mathJaxPrintDialogContainerRef)
    }
  },
  { deep: true },
)

watch(printPreviewDialog, async (isDialogVisible) => {
  if (isDialogVisible) {
    await nextTick()
    await typesetMathInSpecificContainer(mathJaxPrintDialogContainerRef)
  }
})

watch(test_step, async (newStep, _oldStep) => {
  await nextTick()
  if (newStep === 2 && testListSwitch.value) {
    await typesetMathInSpecificContainer(mathJaxStep2ListContainerRef)
  }
  else if (newStep === 3) {
    await typesetMathInSpecificContainer(mathJaxStep3ReviewContainerRef)
  }
})

watch(testListSwitch, async (isSwitchedOn) => {
  if (test_step.value === 2 && isSwitchedOn) {
    await nextTick()
    await typesetMathInSpecificContainer(mathJaxStep2ListContainerRef)
  }
  await nextTick()
  await forceUIUpdate()
  await handleRefreshPreviewList()
})

// Initialize component on mount
onMounted(async () => {
  // Get user token
  const auth = useAuth()
  userToken.value = auth.getUserToken()

  // Ensure exam published state is reset
  isExamPublished.value = false

  // Initialize data in the correct sequence
  await getCurrentExamInfo()

  // Load initial data - start with sections
  await getTypeList('section')

  // Conditionally load data based on URL parameters or existing form values
  if (form.section) {
    await getTypeList('base', form.section)
    if (form.base) {
      await getTypeList('lesson', form.base)
      if (form.lesson) {
        await getTypeList('topic', form.lesson)
      }
    }
  }

  // Get additional type lists
  await loadExamTypes() // Use our specialized function for exam types
  await getTypeList('state')

  // Load tests if needed
  await getExamTests()

  // If we have an exam ID, get its tests
  if (exam_id.value) {
    await handleRefreshPreviewList()

    // Make sure the examTestListLength is properly initialized
    if (createForm.value && 'examTestListLength' in createForm.value) {
      createForm.value.examTestListLength = tests.value.length
    }
  }

  // Check active tab from route and enable it
  if (route.query?.active === 'test_list') {
    test_step.value = 2
    testListSwitch.value = true
  }
  else if (route.query?.active === 'add_test') {
    test_step.value = 2
    testListSwitch.value = false
  }
  else {
    test_step.value = 1
    testListSwitch.value = false
  }

  if (test_step.value === 2 && testListSwitch.value) {
    await typesetMathInSpecificContainer(mathJaxStep2ListContainerRef)
  }

  if (test_step.value === 3) {
    await typesetMathInSpecificContainer(mathJaxStep3ReviewContainerRef)
  }
})

onUpdated(async () => {
  if (test_step.value === 2 && testListSwitch.value) {
    await typesetMathInSpecificContainer(mathJaxStep2ListContainerRef)
    await nextTick()
    await forceUIUpdate()
    await handleRefreshPreviewList()
  }

  if (test_step.value === 3) {
    await typesetMathInSpecificContainer(mathJaxStep3ReviewContainerRef)
    await nextTick()
    await forceUIUpdate()
    await handleRefreshPreviewList()
  }

  if (printPreviewDialog.value) {
    await typesetMathInSpecificContainer(mathJaxPrintDialogContainerRef)
    await nextTick()
    await forceUIUpdate()
    await handleRefreshPreviewList()
  }
})
</script>

<style lang="scss">
.create-test-container {
  max-width: 1200px;
  margin: 5rem auto;
  padding-bottom: 80px; // Space for fixed bottom bar
}
@media (max-width: 768px) {
  .create-test-container {
    margin: 0;
  }
}

.topics-container {
  border-radius: 4px;
  padding: 16px;
}

// Stepper styling
.v-stepper {
  box-shadow: none !important;
  background-color: #f9f9f9;
  display: contents;

  &__step {
    &--active {
      color: teal !important;
    }

    &--complete {
      color: teal !important;
    }
  }
}
.v-expansion-panel-title__overlay {
  background-color: unset !important;
  border-radius: inherit;
  opacity: 0;
}
.v-stepper-vertical-item__title {
  font-size: 1.5rem;
  font-weight: 500;
}

// Topic styling
.topic_season {
  font-weight: bold !important;
  color: blue !important;
}

.v-stepper-vertical-item:not(:last-child):before {
  border: unset !important;
  border-left: thin solid rgba(0, 0, 0, 0.019) !important;
}

// Answer styling
.answer {
  display: flex;
  align-items: flex-start;
  margin-bottom: 8px;

  .true_answer {
    color: green;
    margin-right: 8px;
  }

  span {
    margin-right: 8px;
  }

  img {
    max-width: 100%;
    margin-top: 4px;
  }
}

// Test list styling
.test-list {
  max-height: 600px;
  overflow-y: auto;

  #test-question {
    margin-bottom: 16px;
  }

  // Different answer option styles
  .answer {
    margin-bottom: 12px;
    display: flex;
    align-items: flex-start;

    span {
      display: inline-block;
      visibility: visible !important;
      margin-right: 8px;
    }
  }
}

.v-label--clickable {
  font-size: 16px !important;
  font-weight: 400 !important;
  color: rgba(0, 0, 0, 0.6) !important;
  margin-inline-start: 10px !important;
}
.v-expansion-panel-text__wrapper {
  padding: 8px 14px 16px !important;
}

.v-label--clickable {
  font-size: 16px !important;
  font-weight: 400 !important;
  color: rgba(0, 0, 0, 0.6) !important;
  margin-inline-start: 10px !important;
}

.option-text {
  display: inline-block !important;
  visibility: visible !important;
  min-height: 1.5em;
  min-width: 10px;
  background-color: rgba(230, 230, 230, 0.1); /* Light background */
  border: 1px dashed #ccc; /* Add a border to make the area visible */
  padding: 2px 4px;
}

/* Force all math content to be visible */
.answer span {
  visibility: visible !important;
  display: inline-block !important;
}
.textFiledLink .v-field--variant-outlined .v-field__outline {
  border-top-left-radius: 20px !important;
  border-top-right-radius: 20px !important;
}
.textFiledLink:deep(input) {
  padding-left: 20px !important;
}
.v-btn {
  display: inline-grid !important;
}
.v-label {
  font-size: 1.4rem !important;
}
</style>
