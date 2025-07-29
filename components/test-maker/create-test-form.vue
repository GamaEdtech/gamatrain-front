<template>
  <div id="create-test">
    <embed
      v-if="file_original_path"
      :src="file_original_path"
      width="100%"
      height="200px;"
    >
    <v-card
      flat
      class="mt-3"
    >
      <!-- Question section -->
      <v-card-text id="test-question">
        <VeeForm
          ref="veeForm"
          @submit="submitQuestion"
        >
          <v-row>
            <v-col
              v-show="path_panel_expand"
              cols="12"
              md="2"
              class="mt-2"
            >
              <v-autocomplete
                v-model="form.section"
                :items="level_list"
                label="Board"
                item-title="title"
                item-value="id"
                variant="outlined"
                density="compact"
                color="orange"
                :rules="[(v) => !!v || 'Level is required']"
                autocomplete="off"
              />
            </v-col>

            <v-col
              v-show="path_panel_expand"
              cols="12"
              md="2"
              class="mt-2"
            >
              <v-autocomplete
                v-model="form.base"
                :items="grade_list"
                label="Grade"
                item-title="title"
                item-value="id"
                variant="outlined"
                density="compact"
                color="orange"
                :rules="[(v) => !!v || 'Grade is required']"
                autocomplete="off"
              />
            </v-col>

            <v-col
              v-show="path_panel_expand"
              cols="12"
              md="2"
              class="mt-2"
            >
              <v-autocomplete
                v-model="form.lesson"
                :items="lesson_list"
                label="Subject"
                item-title="title"
                item-value="id"
                variant="outlined"
                density="compact"
                color="orange"
                :rules="[(v) => !!v || 'Lesson is required']"
                autocomplete="off"
              />
            </v-col>
            <v-col
              v-show="!path_panel_expand"
              cols="2"
              md="1"
              class="pr-0"
            >
              <v-tooltip location="bottom">
                <template #activator="{ props: tooltipProps }">
                  <v-btn
                    color="teal"
                    class="text-white py-5 my-2"
                    v-bind="tooltipProps"
                    block
                    @click="path_panel_expand = !path_panel_expand"
                  >
                    <i class="fas fa-route mx-3 fa-2xl" />
                  </v-btn>
                </template>
                <span> Change path </span>
              </v-tooltip>
            </v-col>
            <v-col
              :cols="path_panel_expand ? 12 : 10"
              :md="path_panel_expand ? 2 : 9"
              class="mt-2"
            >
              <v-autocomplete
                v-model="form.topic"
                density="compact"
                :items="topic_list"
                item-value="id"
                item-title="title"
                label="Topics"
                variant="outlined"
                color="orange"
                autocomplete="off"
              />
            </v-col>

            <v-col
              cols="12"
              md="2"
              class="mt-2"
            >
              <v-autocomplete
                v-model="form.type"
                :items="typeList"
                label="Type"
                item-title="title"
                item-value="value"
                variant="outlined"
                density="compact"
                color="orange"
                :rules="[(v) => !!v || 'Question type is required']"
                autocomplete="off"
              />
            </v-col>

            <!-- Question section -->
            <v-col
              id="test-maker-question"
              cols="12"
              md="6"
            >
              <p>Question:</p>
              <ClientOnly
                fallback-tag="span"
                fallback="Loading..."
              >
                <Field
                  v-slot="{ errorMessage: questionError }"
                  name="question"
                  :validate="validateQuestionField"
                >
                  <RickEditor
                    v-model:model-value="form.question"
                    min-height="200px"
                    :features="['bold', 'italic', 'underline', 'alignment']"
                  >
                    <template #content>
                      <v-btn
                        v-if="!form.q_file_base64"
                        variant="text"
                        icon="mdi-camera"
                        color="#A11333"
                        size="x-large"
                        @click="selectFile('q_file')"
                      >
                        <v-icon
                          size="80"
                          color="#A11333"
                        >
                          mdi-camera
                        </v-icon>
                      </v-btn>
                      <v-btn
                        v-if="form.q_file_base64"
                        variant="text"
                        color="#F44336"
                        icon="mdi-delete"
                        @click="deleteFile('q_file')"
                      />
                      <img
                        v-if="form.q_file_base64"
                        width="72"
                        height="72"
                        class="pointer"
                        :src="form.q_file_base64"
                        style="
                          border-radius: 5px;
                          height: 7rem;
                          width: 7rem;
                          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.07);
                        "
                        @click="selectFile('q_file')"
                      >
                    </template>
                  </RickEditor>
                  <p
                    v-if="questionError"
                    class="text-error text-caption mt-1"
                  >
                    {{ questionError }}
                  </p>
                </Field>
              </ClientOnly>
            </v-col>
            <!-- End question section -->

            <v-col
              v-if="['tf', 'fourchoice', 'twochoice'].includes(form.type)"
              cols="12"
              md="6"
            >
              <!-- Answer type toggle -->
              <v-row v-if="['fourchoice', 'twochoice'].includes(form.type)">
                <v-col
                  cols="12"
                  class="mb-2"
                >
                  <div class="d-flex flex-row align-center justify-center">
                    <p
                      class="mr-3"
                      style="font-size: 14px"
                    >
                      Choices type:
                    </p>
                    <v-radio-group
                      v-model="form.answer_type"
                      inline
                      hide-details
                      style="max-width: fit-content !important"
                    >
                      <v-radio
                        label="Text"
                        color="teal"
                        value="text"
                        style="font-size: 14px; margin-inline-end: 10px"
                        @click="answerTypeChanged('txt')"
                      />
                      <v-radio
                        label="Photo"
                        color="teal"
                        value="photo"
                        style="font-size: 14px"
                        @click="answerTypeChanged('photo')"
                      />
                    </v-radio-group>
                  </div>
                </v-col>
              </v-row>
              <!-- End answer type -->

              <!-- Test answer options -->
              <Field
                v-slot="{ field, errorMessage: trueAnswerError }"
                name="true_answer"
                :validate="validateTrueAnswer"
              >
                <v-radio-group
                  id="test-image-options"
                  v-model="form.true_answer"
                  v-bind="field"
                  :error-messages="trueAnswerError"
                >
                  <v-row
                    v-if="['fourchoice', 'twochoice', 'tf'].includes(form.type)"
                  >
                    <v-col
                      class="pb-0"
                      cols="1"
                    >
                      <v-radio
                        color="orange"
                        value="1"
                        label="A"
                        density="compact"
                        style="display: contents; font-size: 14px"
                      />
                    </v-col>
                    <v-col
                      v-show="form.testImgAnswers === false"
                      class="pb-0"
                      cols="11"
                    >
                      <Field
                        v-slot="{ errorMessage: answerAError }"
                        :name="'answer_a'"
                        :validate="validateAnswerField"
                      >
                        <ClientOnly
                          fallback-tag="span"
                          fallback="Loading..."
                        >
                          <RickEditor
                            v-model:model-value="form.answer_a"
                            min-height="90px"
                            :features="[
                              'bold',
                              'italic',
                              'underline',
                              'alignment',
                            ]"
                            :additional-styles="{ marginInlineStart: '10px' }"
                          />
                          <p
                            v-if="answerAError"
                            class="text-error text-caption mt-1"
                          >
                            {{ answerAError }}
                          </p>
                        </ClientOnly>
                      </Field>
                    </v-col>
                    <v-col
                      v-show="form.testImgAnswers === true"
                      class="pb-0"
                      cols="11"
                    >
                      <div class="image-holder">
                        <img
                          v-if="form.a_file_base64"
                          width="72"
                          height="72"
                          class="pointer image-input"
                          :src="form.a_file_base64"
                          @click="selectFile('a_file')"
                        >
                        <v-btn
                          v-else
                          variant="text"
                          color="teal-lighten-5"
                          class="image-input"
                          @click="selectFile('a_file')"
                        >
                          <v-icon
                            size="80"
                            color="#A11333"
                          >
                            mdi-camera
                          </v-icon>
                        </v-btn>

                        <v-btn
                          v-if="form.a_file_base64"
                          variant="text"
                          color="#F44336"
                          icon="mdi-delete"
                          size="large"
                          class="img-clear-btn"
                          @click="deleteFile('a_file')"
                        />
                      </div>
                    </v-col>
                  </v-row>

                  <v-row
                    v-if="['fourchoice', 'twochoice', 'tf'].includes(form.type)"
                  >
                    <v-col
                      class="pb-0"
                      cols="1"
                    >
                      <v-radio
                        color="orange"
                        value="2"
                        label="B"
                        density="compact"
                        style="display: contents; font-size: 14px"
                      />
                    </v-col>
                    <v-col
                      v-show="form.testImgAnswers === false"
                      class="pb-0"
                      cols="11"
                    >
                      <Field
                        v-slot="{ errorMessage: answerBError }"
                        :name="'answer_b'"
                        :validate="validateAnswerField"
                      >
                        <ClientOnly
                          fallback-tag="span"
                          fallback="Loading..."
                        >
                          <RickEditor
                            v-model:model-value="form.answer_b"
                            min-height="90px"
                            :features="[
                              'bold',
                              'italic',
                              'underline',
                              'alignment',
                            ]"
                            :additional-styles="{ marginInlineStart: '10px' }"
                          />
                          <p
                            v-if="answerBError"
                            class="text-error text-caption mt-1"
                          >
                            {{ answerBError }}
                          </p>
                        </ClientOnly>
                      </Field>
                    </v-col>
                    <v-col
                      v-show="form.testImgAnswers === true"
                      class="pb-0"
                      cols="11"
                    >
                      <div class="image-holder">
                        <img
                          v-if="form.b_file_base64"
                          width="72"
                          height="72"
                          class="pointer image-input"
                          :src="form.b_file_base64"
                          @click="selectFile('b_file')"
                        >
                        <v-btn
                          v-else
                          variant="text"
                          color="teal-lighten-5"
                          class="image-input"
                          @click="selectFile('b_file')"
                        >
                          <v-icon
                            size="80"
                            color="#A11333"
                          >
                            mdi-camera
                          </v-icon>
                        </v-btn>

                        <v-btn
                          v-if="form.b_file_base64"
                          variant="text"
                          color="#F44336"
                          icon="mdi-delete"
                          size="large"
                          class="img-clear-btn"
                          @click="deleteFile('b_file')"
                        />
                      </div>
                    </v-col>
                  </v-row>

                  <v-row v-if="form.type == 'fourchoice'">
                    <v-col
                      class="pb-0"
                      cols="1"
                    >
                      <v-radio
                        color="orange"
                        value="3"
                        label="C"
                        density="compact"
                        style="display: contents; font-size: 14px"
                      />
                    </v-col>
                    <v-col
                      v-show="form.testImgAnswers === false"
                      class="pb-0"
                      cols="11"
                    >
                      <Field
                        v-slot="{ errorMessage: answerCError }"
                        :name="'answer_c'"
                        :validate="validateAnswerField"
                      >
                        <ClientOnly
                          fallback-tag="span"
                          fallback="Loading..."
                        >
                          <RickEditor
                            v-model:model-value="form.answer_c"
                            min-height="90px"
                            :features="[
                              'bold',
                              'italic',
                              'underline',
                              'alignment',
                            ]"
                            :additional-styles="{ marginInlineStart: '10px' }"
                          />
                          <p
                            v-if="answerCError"
                            class="text-error text-caption mt-1"
                          >
                            {{ answerCError }}
                          </p>
                        </ClientOnly>
                      </Field>
                    </v-col>
                    <v-col
                      v-show="form.testImgAnswers === true"
                      class="pb-0"
                      cols="11"
                    >
                      <div class="image-holder">
                        <img
                          v-if="form.c_file_base64"
                          width="72"
                          height="72"
                          class="pointer image-input"
                          :src="form.c_file_base64"
                          @click="selectFile('c_file')"
                        >
                        <v-btn
                          v-else
                          variant="text"
                          color="teal-lighten-5"
                          class="image-input"
                          @click="selectFile('c_file')"
                        >
                          <v-icon
                            size="80"
                            color="#A11333"
                          >
                            mdi-camera
                          </v-icon>
                        </v-btn>

                        <v-btn
                          v-if="form.c_file_base64"
                          variant="text"
                          color="#F44336"
                          icon="mdi-delete"
                          size="large"
                          class="img-clear-btn"
                          @click="deleteFile('c_file')"
                        />
                      </div>
                    </v-col>
                  </v-row>

                  <v-row v-if="form.type == 'fourchoice'">
                    <v-col
                      class="pb-0"
                      cols="1"
                    >
                      <v-radio
                        color="orange"
                        value="4"
                        label="D"
                        density="compact"
                        style="display: contents; font-size: 14px"
                      />
                    </v-col>
                    <v-col
                      v-show="form.testImgAnswers === false"
                      class="pb-0"
                      cols="11"
                    >
                      <Field
                        v-slot="{ errorMessage: answerDError }"
                        :name="'answer_d'"
                        :validate="validateAnswerField"
                      >
                        <ClientOnly
                          fallback-tag="span"
                          fallback="Loading..."
                        >
                          <RickEditor
                            v-model:model-value="form.answer_d"
                            min-height="90px"
                            :features="[
                              'bold',
                              'italic',
                              'underline',
                              'alignment',
                            ]"
                            :additional-styles="{ marginInlineStart: '10px' }"
                          />
                          <p
                            v-if="answerDError"
                            class="text-error text-caption mt-1"
                          >
                            {{ answerDError }}
                          </p>
                        </ClientOnly>
                      </Field>
                    </v-col>
                    <v-col
                      v-show="form.testImgAnswers === true"
                      class="pb-0"
                      cols="11"
                    >
                      <div class="image-holder">
                        <img
                          v-if="form.d_file_base64"
                          width="72"
                          height="72"
                          class="pointer image-input"
                          :src="form.d_file_base64"
                          @click="selectFile('d_file')"
                        >
                        <v-btn
                          v-else
                          variant="text"
                          color="teal-lighten-5"
                          class="image-input"
                          @click="selectFile('d_file')"
                        >
                          <v-icon
                            size="80"
                            color="#A11333"
                          >
                            mdi-camera
                          </v-icon>
                        </v-btn>

                        <v-btn
                          v-if="form.d_file_base64"
                          variant="text"
                          color="#F44336"
                          icon="mdi-delete"
                          size="large"
                          class="img-clear-btn"
                          @click="deleteFile('d_file')"
                        />
                      </div>
                    </v-col>
                  </v-row>
                </v-radio-group>
              </Field>
              <!-- End test answer options -->
            </v-col>

            <!-- Solution section -->
            <v-col
              :id="
                ['tf', 'fourchoice', 'twochoice'].includes(form.type)
                  ? 'test-maker-answer'
                  : 'test-maker-answer-alternative'
              "
              cols="12"
              :md="
                ['tf', 'fourchoice', 'twochoice'].includes(form.type) ? 12 : 6
              "
            >
              <p>Solution:</p>

              <ClientOnly
                fallback-tag="span"
                fallback="Loading..."
              >
                <RickEditor
                  v-model:model-value="form.answer_full"
                  min-height="90px"
                  :features="['bold', 'italic', 'underline', 'alignment']"
                />
              </ClientOnly>
              <img
                v-if="form.answer_full_file_base64"
                width="72"
                height="72"
                class="pointer image-input"
                :src="form.answer_full_file_base64"
                @click="selectFile('answer_full_file')"
              >
              <v-btn
                v-else
                variant="text"
                color="teal-lighten-5"
                class="image-input"
                size="x-large"
                @click="selectFile('answer_full_file')"
              >
                <v-icon
                  size="80"
                  color="#A11333"
                >
                  mdi-camera
                </v-icon>
              </v-btn>

              <v-btn
                v-if="form.answer_full_file_base64"
                variant="text"
                color="#F44336"
                icon="mdi-delete"
                size="large"
                class="img-clear-btn"
                @click="deleteFile('answer_full_file')"
              >
                <v-icon
                  size="20"
                  color="#F44336"
                >
                  mdi-delete
                </v-icon>
              </v-btn>
            </v-col>
            <!-- End solution section -->
          </v-row>

          <v-row>
            <v-col cols="12">
              <v-row>
                <v-col
                  cols="12"
                  md="6"
                  class="pb-0"
                >
                  <v-btn
                    type="submit"
                    :disabled="buttonDisabled"
                    :loading="create_loading"
                    size="large"
                    variant="flat"
                    class="primary-gray-400"
                    density="compact"
                    block
                    :color="buttonDisabled == false ? '#009688' : 'gray'"
                    style="
                      font-weight: 600;
                      text-transform: none;
                      font-size: 13px;
                    "
                  >
                    Create
                  </v-btn>
                </v-col>
                <v-col
                  cols="12"
                  md="6"
                >
                  <v-btn
                    :disabled="examTestListLength < 5"
                    size="large"
                    variant="flat"
                    color="teal"
                    class="primary-gray-400"
                    density="compact"
                    block
                    style="
                      font-weight: 600;
                      text-transform: none;
                      font-size: 13px;
                    "
                    @click="goToPreviewStep"
                  >
                    <span v-show="examTestListLength < 5">Add at least {{ 5 - examTestListLength }} more
                      tests</span>
                    <span v-show="examTestListLength >= 5">Next step</span>
                  </v-btn>
                </v-col>
              </v-row>
            </v-col>
          </v-row>

          <!-- Hidden input section -->
          <div>
            <Field
              v-slot="{ errorMessage }"
              name="q_file"
            >
              <v-file-input
                ref="questionInput"
                v-model="form_hidden_data.q_file"
                class="d-none"
                accept="image/png,image/webp,image/jpeg,image/jpg"
                :error-messages="errorMessage"
                @update:model-value="uploadFile('q_file', $event)"
              />
            </Field>

            <Field
              v-slot="{ errorMessage }"
              name="answer_full_file"
            >
              <v-file-input
                ref="answerFullInput"
                v-model="form_hidden_data.answer_full_file"
                class="d-none"
                accept="image/png,image/webp,image/jpeg,image/jpg"
                :error-messages="errorMessage"
                @update:model-value="uploadFile('answer_full_file', $event)"
              />
            </Field>

            <Field
              v-slot="{ errorMessage }"
              name="a_file"
              :rules="photo_answer_rules"
            >
              <v-file-input
                ref="aInput"
                v-model="form_hidden_data.a_file"
                class="d-none"
                accept="image/png,image/webp,image/jpeg,image/jpg"
                :error-messages="errorMessage"
                @update:model-value="uploadFile('a_file', $event)"
              />
            </Field>

            <Field
              v-slot="{ errorMessage }"
              name="b_file"
              :rules="photo_answer_rules"
            >
              <v-file-input
                ref="bInput"
                v-model="form_hidden_data.b_file"
                class="d-none"
                accept="image/png,image/webp,image/jpeg,image/jpg"
                :error-messages="errorMessage"
                @update:model-value="uploadFile('b_file', $event)"
              />
            </Field>

            <Field
              v-slot="{ errorMessage }"
              name="c_file"
              :rules="photo_answer_rules"
            >
              <v-file-input
                ref="cInput"
                v-model="form_hidden_data.c_file"
                class="d-none"
                accept="image/png,image/webp,image/jpeg,image/jpg"
                :error-messages="errorMessage"
                @update:model-value="uploadFile('c_file', $event)"
              />
            </Field>

            <Field
              v-slot="{ errorMessage }"
              name="d_file"
              :rules="photo_answer_rules"
            >
              <v-file-input
                ref="dInput"
                v-model="form_hidden_data.d_file"
                class="d-none"
                accept="image/png,image/webp,image/jpeg,image/jpg"
                :error-messages="errorMessage"
                @update:model-value="uploadFile('d_file', $event)"
              />
            </Field>
          </div>
        </VeeForm>
      </v-card-text>
    </v-card>

    <!-- Cropper Dialog -->
    <v-dialog
      v-model="cropper_dialog"
      max-width="600"
      transition="dialog-bottom-transition"
    >
      <v-card id="img-cropper-dialog">
        <v-card-text class="pa-0">
          <v-col
            v-if="crop_file_loading"
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
          <div v-else>
            <Cropper
              :src="crop_file_url"
              :aspect-ratio="1"
              @change="cropFile"
            />
          </div>
        </v-card-text>
        <v-card-actions
          style="position: sticky; bottom: 0; left: 0; right: 0"
          class="pa-0"
        >
          <v-btn
            color="teal"
            variant="flat"
            size="x-large"
            :loading="crop_confirm_loading"
            block
            @click="submitCrop"
          >
            Confirm
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- End cropper Dialog -->
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { Form as VeeForm, Field, useForm } from 'vee-validate'
import * as yup from 'yup'
import { useState } from '#app'
import { useAuth } from '~/composables/useAuth'
import { Cropper } from 'vue-advanced-cropper'
import 'vue-advanced-cropper/dist/style.css' // Import cropper styles

const auth = useAuth()

/**
 * Component props
 */
const props = defineProps({
  examEditMode: {
    type: Boolean,
    default: false,
  },
  initialSection: {
    type: [String, Number],
    default: null,
  },
  initialBase: {
    type: [String, Number],
    default: null,
  },
  initialLesson: {
    type: [String, Number],
    default: null,
  },
  initialTopics: {
    type: Array,
    default: () => [],
  },
  testList: {
    type: Array,
    default: () => [],
  },
})

/**
 * Component emits
 */
const emit = defineEmits([
  'update:updateTestList',
  'update:goToPreviewStep',
  'update:refreshTests',
])

/**
 * Get Nuxt app services and utilities
 */
const { $toast } = useNuxtApp()
const router = useRouter()
const route = useRoute()

/**
 * Define refs for HTML elements (file inputs)
 */
const veeForm = ref(null)
const questionInput = ref(null)
const answerFullInput = ref(null)
const aInput = ref(null)
const bInput = ref(null)
const cInput = ref(null)
const dInput = ref(null)

/**
 * User token
 */
const userToken = ref('')

/**
 * UI state management
 */
const path_panel_expand = ref(true)
const create_loading = ref(false)
const _test_step = ref(1)
const text_answer = ref(true)
const text_answer_rules = ref('required')
const photo_answer = ref(false)
const photo_answer_rules = ref((value) => {
  if (!value) return true

  if (form.testImgAnswers && form.true_answer) {
    const option = form.true_answer.toLowerCase()
    if (option === 'a' || option === 'b' || option === 'c' || option === 'd') {
      const optionFile = form_hidden_data[`${option}_file`]
      if (!optionFile) {
        return 'Please upload an image for the correct answer'
      }
    }
  }
  return true
})
const answerType = ref('text') // Default to text answers
const file_original_path = ref('')

/**
 * Cropper related state
 */
const crop_file_url = ref('')
const crop_file_loading = ref(false)
const crop_confirm_loading = ref(false)
const cropper_dialog = ref(false)
const current_crop_file = ref('')

/**
 * Form data and hidden fields
 */
const form = reactive({
  section: null,
  base: null,
  level: null,
  grade: null,
  lesson: null,
  topic: null,
  type: 'fourchoice',
  direction: 'ltr',
  true_answer: '',
  question: '',
  q_file: null,
  q_file_base64: '',
  answer_full: '',
  answer_full_file: null,
  answer_full_file_base64: '',
  answer_a: '',
  answer_b: '',
  answer_c: '',
  answer_d: '',
  a_file: null,
  b_file: null,
  c_file: null,
  d_file: null,
  a_file_base64: '',
  b_file_base64: '',
  c_file_base64: '',
  d_file_base64: '',
  testImgAnswers: false,
  answer_type: 'text',
})

const form_hidden_data = reactive({
  q_file: null,
  answer_full_file: null,
  a_file: null,
  b_file: null,
  c_file: null,
  d_file: null,
  answer_type: 'text',
})

/**
 * Data lists for selectors
 */
const level_list = ref([])
const grade_list = ref([])
const _field_list = ref([])
const lesson_list = ref([])
const topic_list = ref([])

/**
 * Selected topics state
 */
const selected_topics = ref([])

// for holding test
const examTestListLength = computed(() => {
  return props.testList.length
})

/**
 * Handle topic selection from topic selector
 * @param {Array} topics - Array of selected topic IDs
 */
const _selectTopic = (topics) => {
  selected_topics.value = topics
  const topicIds = topics.map(id => parseInt(id))
  form.topic = topicIds.length > 0 ? topicIds[0] : null
}

/**
 * Static data lists
 */
const _txt_direction_list = [
  { value: 'ltr', title: 'LTR' },
  { value: 'rtl', title: 'RTL' },
]

/**
 * Cropper stencil properties
 */
const _stencil_props = reactive({
  width: 180,
  height: 180,
  aspectRatio: 1,
})

const typeList = [
  { value: 'fourchoice', title: 'Multiple choice(4)' },
  { value: 'twochoice', title: 'Multiple choice(2)' },
  { value: 'descriptive', title: 'Open-Ended' },
  { value: 'tf', title: 'True/False' },
  { value: 'blank', title: 'Blank' },
  { value: 'shortanswer', title: 'Short answer' },
]

/**
 * Validation schema using Yup
 */
const validationSchema = yup.object({
  question: yup
    .string()
    .test(
      'has-content',
      'Question is required',
      value => !!value && value.trim() !== '',
    ),
  true_answer: yup.string().when('type', {
    is: val => ['fourchoice', 'twochoice', 'tf'].includes(val),
    then: () =>
      yup
        .string()
        .test(
          'has-answer',
          'Please select the correct answer',
          value => !!value,
        ),
  }),
  // Additional validations based on answer type
  answer_a: yup.string().when(['type', 'testImgAnswers'], {
    is: (type, testImgAnswers) =>
      ['fourchoice', 'twochoice', 'tf'].includes(type) && !testImgAnswers,
    then: () =>
      yup
        .string()
        .test(
          'has-content',
          'Answer A is required',
          value => !!value && value.trim() !== '',
        ),
  }),
  answer_b: yup.string().when(['type', 'testImgAnswers'], {
    is: (type, testImgAnswers) =>
      ['fourchoice', 'twochoice', 'tf'].includes(type) && !testImgAnswers,
    then: () =>
      yup
        .string()
        .test(
          'has-content',
          'Answer B is required',
          value => !!value && value.trim() !== '',
        ),
  }),
  answer_c: yup.string().when(['type', 'testImgAnswers'], {
    is: (type, testImgAnswers) => type === 'fourchoice' && !testImgAnswers,
    then: () =>
      yup
        .string()
        .test(
          'has-content',
          'Answer C is required',
          value => !!value && value.trim() !== '',
        ),
  }),
  answer_d: yup.string().when(['type', 'testImgAnswers'], {
    is: (type, testImgAnswers) => type === 'fourchoice' && !testImgAnswers,
    then: () =>
      yup
        .string()
        .test(
          'has-content',
          'Answer D is required',
          value => !!value && value.trim() !== '',
        ),
  }),
  answer_full: yup.string().when(['type', 'testImgAnswers'], {
    is: (type, testImgAnswers) => type === 'descriptive' && !testImgAnswers,
    then: () =>
      yup
        .string()
        .test(
          'has-content',
          'Full answer is required',
          value => !!value && value.trim() !== '',
        ),
  }),
})

/**
 * Initialize VeeValidate form
 */
const {
  handleSubmit: _veeHandleSubmit,
  isSubmitting: _isSubmitting,
  validate,
  meta: _meta,
  resetForm,
} = useForm({
  validationSchema,
  initialValues: {
    section: '',
    base: '',
    level: '',
    grade: '',
    lesson: '',
    topic: '',
    type: 'fourchoice',
    direction: 'ltr',
    true_answer: '',
    question: '',
    q_file_base64: '',
    answer_full: '',
    answer_full_file_base64: '',
    answer_a: '',
    answer_b: '',
    answer_c: '',
    answer_d: '',
    a_file_base64: '',
    b_file_base64: '',
    c_file_base64: '',
    d_file_base64: '',
    testImgAnswers: false,
    answer_type: 'text',
  },
})

/**
 * Fetch type list data from API
 * @param {string} type - The type of data to fetch (section, base, lesson, etc.)
 * @param {string} parent - The parent ID (optional)
 */
const getTypeList = async (type, parent = '') => {
  const params = { type }

  // Set up parameters based on type
  if (type === 'base') params.section_id = parent
  if (type === 'lesson') params.base_id = parent
  if (type === 'topic') params.lesson_id = parent
  if (type === 'area') params.state_id = parent

  if (type === 'school') {
    params.section_id = form.level
    params.area_id = form.area
  }

  try {
    // Add loading state if needed
    const loadingTarget
      = type === 'section'
        ? level_list
        : type === 'base'
          ? grade_list
          : type === 'lesson'
            ? lesson_list
            : type === 'topic'
              ? topic_list
              : null

    if (loadingTarget) {
      // Set a temporary loading item
      loadingTarget.value = [{ id: '', title: 'Loading...', disabled: true }]
    }

    const res = await useApiService.get('/api/v1/types/list', params)

    if (type === 'section') {
      level_list.value = res.data
    }
    else if (type === 'base') {
      grade_list.value = res.data
    }
    else if (type === 'lesson') {
      lesson_list.value = res.data
    }
    else if (type === 'topic') {
      topic_list.value = res.data
    }
  }
  catch (err) {
    console.error(`Error loading ${type} data:`, err)

    // Reset the target list to empty on error
    if (type === 'section') level_list.value = []
    else if (type === 'base') grade_list.value = []
    else if (type === 'lesson') lesson_list.value = []
    else if (type === 'topic') topic_list.value = []

    if ($toast)
      $toast.error(
        `Failed to load ${type} data: ${err.message || 'Unknown error'}`,
      )
  }
}

/**
 * Reset the form to initial state - simplified to match Vue 2 version
 */
const resetFormFields = () => {
  // Clear form fields to initial state
  form.question = ''
  form.q_file_base64 = ''
  form.q_file = null

  form.answer_full = ''
  form.answer_full_file_base64 = ''
  form.answer_full_file = null

  form.true_answer = ''
  form.testImgAnswers = false
  form.answer_type = 'text'

  // Reset answer text fields
  form.answer_a = ''
  form.answer_b = ''
  form.answer_c = ''
  form.answer_d = ''

  // Reset answer image fields
  form.a_file_base64 = ''
  form.b_file_base64 = ''
  form.c_file_base64 = ''
  form.d_file_base64 = ''
  form.a_file = null
  form.b_file = null
  form.c_file = null
  form.d_file = null

  // Reset hidden form data
  form_hidden_data.q_file = null
  form_hidden_data.answer_full_file = null
  form_hidden_data.a_file = null
  form_hidden_data.b_file = null
  form_hidden_data.c_file = null
  form_hidden_data.d_file = null

  // Reset UI state
  text_answer.value = true
  photo_answer.value = false

  // Reset file inputs
  if (questionInput.value && questionInput.value.$el) {
    const fileInput
      = questionInput.value.$el.querySelector('input[type="file"]')
    if (fileInput) fileInput.value = null
  }

  if (answerFullInput.value && answerFullInput.value.$el) {
    const fileInput
      = answerFullInput.value.$el.querySelector('input[type="file"]')
    if (fileInput) fileInput.value = null
  }

  if (aInput.value && aInput.value.$el) {
    const fileInput = aInput.value.$el.querySelector('input[type="file"]')
    if (fileInput) fileInput.value = null
  }

  if (bInput.value && bInput.value.$el) {
    const fileInput = bInput.value.$el.querySelector('input[type="file"]')
    if (fileInput) fileInput.value = null
  }

  if (cInput.value && cInput.value.$el) {
    const fileInput = cInput.value.$el.querySelector('input[type="file"]')
    if (fileInput) fileInput.value = null
  }

  if (dInput.value && dInput.value.$el) {
    const fileInput = dInput.value.$el.querySelector('input[type="file"]')
    if (fileInput) fileInput.value = null
  }

  // If VeeValidate form is available, reset it
  if (veeForm.value) {
    resetForm()
  }
}

/**
 * Validate all required fields and show appropriate error messages
 * @returns {boolean} True if validation passes, false otherwise
 */
const validateForm = () => {
  // Check basic required fields
  if (!form.section) {
    if ($toast) $toast.error('Please select a Board')
    return false
  }

  if (!form.base) {
    if ($toast) $toast.error('Please select a Grade')
    return false
  }

  if (!form.lesson) {
    if ($toast) $toast.error('Please select a Subject')
    return false
  }

  if (!form.question && !form.q_file_base64) {
    if ($toast) $toast.error('Please enter a question or upload an image')
    return false
  }

  // For multiple choice questions, check answers
  if (['fourchoice', 'twochoice', 'tf'].includes(form.type)) {
    if (!form.true_answer) {
      if ($toast) $toast.error('Please select the correct answer')
      return false
    }

    // Check text answers if not using image answers
    if (!form.testImgAnswers) {
      if (
        form.type === 'fourchoice'
        || form.type === 'twochoice'
        || form.type === 'tf'
      ) {
        if (!form.answer_a || form.answer_a.trim() === '') {
          if ($toast) $toast.error('Please enter text for Answer A')
          return false
        }

        if (!form.answer_b || form.answer_b.trim() === '') {
          if ($toast) $toast.error('Please enter text for Answer B')
          return false
        }

        if (form.type === 'fourchoice') {
          if (!form.answer_c || form.answer_c.trim() === '') {
            if ($toast) $toast.error('Please enter text for Answer C')
            return false
          }

          if (!form.answer_d || form.answer_d.trim() === '') {
            if ($toast) $toast.error('Please enter text for Answer D')
            return false
          }
        }
      }
    }
    else {
      // Check image answers in photo mode
      if (!form.a_file_base64) {
        if ($toast) $toast.error('Please upload an image for Answer A')
        return false
      }

      if (!form.b_file_base64) {
        if ($toast) $toast.error('Please upload an image for Answer B')
        return false
      }

      if (form.type === 'fourchoice') {
        if (!form.c_file_base64) {
          if ($toast) $toast.error('Please upload an image for Answer C')
          return false
        }

        if (!form.d_file_base64) {
          if ($toast) $toast.error('Please upload an image for Answer D')
          return false
        }
      }
    }
  }

  return true
}

/**
 * Handle form submission
 */
const submitQuestion = async () => {
  create_loading.value = true

  // Force clear error messages again
  clearFieldValidationErrors()

  try {
    // Run our custom validation
    if (!validateForm()) {
      create_loading.value = false
      return
    }

    // Create a URLSearchParams object
    const formData = new URLSearchParams()

    // Add all required fields
    formData.append('section', form.section.toString())
    formData.append('base', form.base.toString())
    formData.append('lesson', form.lesson.toString())
    formData.append('topic', form.topic.toString())
    formData.append('type', form.type)
    formData.append('direction', form.direction || 'ltr')
    formData.append('question', form.question)
    formData.append('true_answer', form.true_answer)
    formData.append('testImgAnswers', form.testImgAnswers ? '1' : '0')
    formData.append('testingAnswers', '0')
    formData.append('answer_full', form.answer_full || '')

    // Add answers based on question type
    if (['fourchoice', 'twochoice', 'tf'].includes(form.type)) {
      formData.append('answer_a', form.answer_a || '')
      formData.append('answer_b', form.answer_b || '')

      if (form.type === 'fourchoice') {
        formData.append('answer_c', form.answer_c || '')
        formData.append('answer_d', form.answer_d || '')
      }
    }

    // Add file fields if they exist
    if (form.q_file) formData.append('q_file', form.q_file)
    if (form.answer_full_file)
      formData.append('answer_full_file', form.answer_full_file)
    if (form.a_file) formData.append('a_file', form.a_file)
    if (form.b_file) formData.append('b_file', form.b_file)
    if (form.c_file) formData.append('c_file', form.c_file)
    if (form.d_file) formData.append('d_file', form.d_file)

    const response = await useApiService.post('/api/v1/examTests', formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    })

    if (response.status === 1) {
      path_panel_expand.value = false
      const userState = useState('user')

      // Edit mode or create exam progress
      if (userState.value.currentExamCode || props.examEditMode === true) {
        emit('update:updateTestList', response.data.id)
        emit('update:refreshTests')
        resetFormFields()
      }
    }
  }
  catch (err) {
    console.error('Error submitting form:', err)

    // Handle different error object structures
    if (err.status === 400) {
      console.error('Bad request error:', err.data)
      $toast.error(err.data?.message || 'Bad request')
    }
    else if (err.response?.status === 403) {
      // Traditional axios-like error structure
      console.error('Authentication error')
      $toast.error('Authentication error')
      router.push('/login')
    }
    else {
      console.error('Unhandled error:', err)
      $toast.error(err.message || 'An error occurred')
    }
  }
  finally {
    create_loading.value = false
  }
}

/**
 * Select file for upload
 * @param {string} file_name - Name of the file field
 */
const selectFile = (file_name) => {
  // Trigger the appropriate file input click based on the file name
  if (file_name === 'q_file' && questionInput.value) {
    questionInput.value.$el.querySelector('input[type="file"]').click()
  }
  else if (file_name === 'answer_full_file' && answerFullInput.value) {
    answerFullInput.value.$el.querySelector('input[type="file"]').click()
  }
  else if (file_name === 'a_file' && aInput.value) {
    aInput.value.$el.querySelector('input[type="file"]').click()
  }
  else if (file_name === 'b_file' && bInput.value) {
    bInput.value.$el.querySelector('input[type="file"]').click()
  }
  else if (file_name === 'c_file' && cInput.value) {
    cInput.value.$el.querySelector('input[type="file"]').click()
  }
  else if (file_name === 'd_file' && dInput.value) {
    dInput.value.$el.querySelector('input[type="file"]').click()
  }
}

/**
 * Handle file upload
 * @param {string} file_name - Name of the file field
 * @param {File|File[]} fileEvent - The file(s) from the input event
 */
const uploadFile = (file_name, fileEvent) => {
  // v-file-input can return array or single file, handle both cases
  const file = Array.isArray(fileEvent) ? fileEvent[0] : fileEvent

  if (!file) return

  // Set current crop file name for tracking which file we're working with
  current_crop_file.value = file_name

  // Store the file in form_hidden_data
  form_hidden_data[file_name] = file

  // Set crop file URL for cropper dialog
  crop_file_url.value = URL.createObjectURL(file)

  // Show the cropper dialog
  cropper_dialog.value = true
}

/**
 * Handle image cropping
 * @param {Object} param0 - Cropper data
 */
const cropFile = ({ coordinates: _coordinates, canvas }) => {
  // Store the cropped image data as base64
  const croppedBase64 = canvas.toDataURL()

  // Update the corresponding form field
  if (current_crop_file.value === 'q_file') {
    form.q_file_base64 = croppedBase64
  }
  else if (current_crop_file.value === 'answer_full_file') {
    form.answer_full_file_base64 = croppedBase64
  }
  else if (current_crop_file.value === 'a_file') {
    form.a_file_base64 = croppedBase64
  }
  else if (current_crop_file.value === 'b_file') {
    form.b_file_base64 = croppedBase64
  }
  else if (current_crop_file.value === 'c_file') {
    form.c_file_base64 = croppedBase64
  }
  else if (current_crop_file.value === 'd_file') {
    form.d_file_base64 = croppedBase64
  }
}

/**
 * Delete file
 * @param {string} file_name - Name of the file field
 */
const deleteFile = (file_name) => {
  if (file_name === 'q_file') {
    form.q_file_base64 = ''
    form.q_file = null
    if (questionInput.value) questionInput.value.value = null
    form_hidden_data.q_file = null
  }
  else if (file_name === 'answer_full_file') {
    form.answer_full_file_base64 = ''
    form.answer_full_file = null
    if (answerFullInput.value) answerFullInput.value.value = null
    form_hidden_data.answer_full_file = null
  }
  else if (file_name === 'a_file') {
    form.a_file_base64 = ''
    form.a_file = null
    if (aInput.value) aInput.value.value = null
    form_hidden_data.a_file = null
  }
  else if (file_name === 'b_file') {
    form.b_file_base64 = ''
    form.b_file = null
    if (bInput.value) bInput.value.value = null
    form_hidden_data.b_file = null
  }
  else if (file_name === 'c_file') {
    form.c_file_base64 = ''
    form.c_file = null
    if (cInput.value) cInput.value.value = null
    form_hidden_data.c_file = null
  }
  else if (file_name === 'd_file') {
    form.d_file_base64 = ''
    form.d_file = null
    if (dInput.value) dInput.value.value = null
    form_hidden_data.d_file = null
  }
}

/**
 * Handle answer type change
 * @param {string} type - The answer type (txt or photo)
 */
const answerTypeChanged = (type) => {
  if (type === 'txt') {
    text_answer.value = true
    photo_answer.value = false
    form.testImgAnswers = false
    form.answer_type = 'text'
    text_answer_rules.value = 'required'
    answerType.value = 'text'
  }
  else {
    text_answer.value = false
    photo_answer.value = true
    form.testImgAnswers = true
    form.answer_type = 'photo'
    text_answer_rules.value = ''
    answerType.value = 'photo'
  }

  // Reset true_answer when switching between image and text modes
  form.true_answer = ''
}

/**
 * Fetch current exam information
 */
const getCurrentExamInfo = async () => {
  try {
    // Get current exam ID from state or route
    const userState = useState('user').value
    const currentExamId = userState?.currentExamId || route.params.id

    if (currentExamId) {
      try {
        const response = await useApiService.get(
          `/api/v1/exams/info/${currentExamId}`,
        )

        // Set form data from response - important to set in sequence
        if (response.data.section) {
          form.section = response.data.section
          // Fetch grade list based on section
          await getTypeList('base', response.data.section)

          if (response.data.base) {
            form.base = response.data.base
            // Fetch lesson list based on base
            await getTypeList('lesson', response.data.base)

            if (response.data.lesson) {
              form.lesson = response.data.lesson
              // Fetch topic list based on lesson
              await getTypeList('topic', response.data.lesson)

              // If in edit mode, we need to populate topics as well
              if (
                props.examEditMode
                && response.data.topics
                && response.data.topics.length
              ) {
                form.topic = response.data.topics[0]
              }
            }
          }
        }

        // Set file path if available
        if (response.data.file_original) {
          file_original_path.value = response.data.file_original
        }

        // Set exam test list length
        if (response.data.tests && Array.isArray(response.data.tests)) {
          examTestListLength.value = response.data.tests.length
        }
      }
      catch (err) {
        console.error('Error fetching exam info:', err)
        if ($toast) $toast.error('Failed to load exam information')
        throw err // Rethrow to allow parent component to handle it
      }
    }
  }
  catch (error) {
    console.error('Error in getCurrentExamInfo:', error)
    if ($toast)
      $toast.error(
        'Failed to initialize test form. Please try refreshing the page.',
      )
  }
}

/**
 * Get base64 from URL
 * @param {string} url - The URL to fetch
 */
const _getBase64FromUrl = async (url) => {
  try {
    const response = await useApiService.get(
      url.replace(process.env.FILE_BASE_URL, ''),
      {
        responseType: 'blob',
      },
    )
    file_original_path.value = URL.createObjectURL(response)
  }
  catch (err) {
    console.error(err)
  }
}

/**
 * URL encode form data
 * @param {FormData} fd - Form data object
 * @returns {string} URL encoded string
 */
const _urlencodeFormData = (fd) => {
  let s = ''
  for (const pair of fd.entries()) {
    if (typeof pair[1] === 'string') {
      s += (s ? '&' : '') + encode(pair[0]) + '=' + encode(pair[1])
    }
  }
  return s
}

/**
 * URL encode string
 * @param {string} s - String to encode
 * @returns {string} Encoded string
 */
const encode = (s) => {
  return encodeURIComponent(s).replace(/%20/g, '+')
}

/**
 * Go to preview step
 */
const goToPreviewStep = () => {
  emit('update:goToPreviewStep', 3)
}

/**
 * Set up watchers
 */
// Watch section change to update base list
watch(
  () => form.section,
  (val, oldVal) => {
    if (val) {
      // Reset dependent fields when section changes
      if (val !== oldVal) {
        form.base = ''
        form.lesson = ''
        form.topic = ''
        grade_list.value = []
        lesson_list.value = []
        topic_list.value = []
      }
      // Fetch new grade list
      getTypeList('base', val)
    }
  },
)

// Watch base change to update lesson list
watch(
  () => form.base,
  (val, oldVal) => {
    if (val) {
      // Reset dependent fields when base changes
      if (val !== oldVal) {
        form.lesson = ''
        form.topic = ''
        lesson_list.value = []
        topic_list.value = []
      }
      // Fetch new lesson list
      getTypeList('lesson', val)
    }
  },
)

// Watch lesson change to update topic list
watch(
  () => form.lesson,
  (val, oldVal) => {
    if (val) {
      // Reset topic when lesson changes
      if (val !== oldVal) {
        form.topic = ''
        topic_list.value = []
      }
      // Fetch new topic list
      getTypeList('topic', val)
    }
  },
)

// Watch type change to update answers for true/false
watch(
  () => form.type,
  (val) => {
    if (val == 'tf') {
      form.answer_a = 'True'
      form.answer_b = 'False'
    }
    else if (
      val !== 'tf'
      && form.answer_a === 'True'
      && form.answer_b === 'False'
    ) {
      // Only reset if we're coming from a true/false type
      form.answer_a = ''
      form.answer_b = ''
    }

    // Reset true_answer when changing question type
    form.true_answer = ''

    // Re-validate with a delay
    debouncedValidate()
  },
)

// Add these utility variables for debounced validation
let validationTimer = null

/**
 * Debounced validation to prevent flickering error messages
 */
const debouncedValidate = () => {
  if (validationTimer) {
    clearTimeout(validationTimer)
  }
  validationTimer = setTimeout(() => {
    // Clear any existing error messages first
    clearFieldValidationErrors()
    // Then run validation
    validate()
    validationTimer = null
  }, 300)
}

// Update the watch handler for form.topic
watch(
  () => form.topic,
  (newVal) => {
    // Only run validation if we have a valid topic selected
    if (newVal) {
      debouncedValidate()
    }
  },
)

/**
 * Watch for changes in initial props
 */
watch(
  () => props.initialSection,
  async (newVal) => {
    if (newVal && newVal !== form.section) {
      // Reset dependent fields
      form.base = ''
      form.lesson = ''
      form.topic = ''
      grade_list.value = []
      lesson_list.value = []
      topic_list.value = []

      // Set new section and fetch grades
      form.section = newVal
      await getTypeList('base', newVal)
    }
  },
)

watch(
  () => props.initialBase,
  async (newVal) => {
    if (newVal && newVal !== form.base) {
      // Reset dependent fields
      form.lesson = ''
      form.topic = ''
      lesson_list.value = []
      topic_list.value = []

      // Set new base and fetch lessons
      form.base = newVal
      await getTypeList('lesson', newVal)
    }
  },
)

watch(
  () => props.initialLesson,
  async (newVal) => {
    if (newVal && newVal !== form.lesson) {
      // Reset topic
      form.topic = ''
      topic_list.value = []

      // Set new lesson and fetch topics
      form.lesson = newVal
      await getTypeList('topic', newVal)
    }
  },
)

watch(
  () => props.initialTopics,
  (newVal) => {
    if (newVal?.length && (!form.topic || !newVal.includes(form.topic))) {
      form.topic = newVal[0]
      selected_topics.value = newVal
    }
  },
  { deep: true },
)

/**
 * Initialize on mount
 */
onMounted(async () => {
  // Initialize user token
  userToken.value = auth.getUserToken()

  getCurrentExamInfo()
  // Set default values for answer type
  form.answer_type = 'text'
  form.testImgAnswers = false
  text_answer.value = true
  photo_answer.value = false

  console.log(props.testList.length)

  // Load initial data - start with sections
  await getTypeList('section')

  // Initialize form with prop values if available - make sure to load in proper sequence
  if (props.initialSection) {
    form.section = props.initialSection
    await getTypeList('base', props.initialSection)

    if (props.initialBase) {
      form.base = props.initialBase
      await getTypeList('lesson', props.initialBase)

      if (props.initialLesson) {
        form.lesson = props.initialLesson
        await getTypeList('topic', props.initialLesson)

        if (props.initialTopics && props.initialTopics.length) {
          form.topic = props.initialTopics[0]
          selected_topics.value = props.initialTopics
        }
      }
    }
  }

  // If in edit mode, we need to ensure we load the current exam's data
  if (props.examEditMode) {
    await getCurrentExamInfo()
  }
  else {
    // Reset form to clear any previous data if not in edit mode
    resetFormFields()
  }

  // Set up form validation event handling
  if (veeForm.value) {
    // Clear all validation errors on initial load
    setTimeout(() => {
      clearFieldValidationErrors()
    }, 500)
  }
})

/**
 * Submit cropped image for upload
 */
const submitCrop = async () => {
  crop_confirm_loading.value = true

  try {
    // Get the cropped base64 image based on the current file name
    let fileBase64 = null

    if (current_crop_file.value === 'q_file') {
      fileBase64 = form.q_file_base64
    }
    else if (current_crop_file.value === 'answer_full_file') {
      fileBase64 = form.answer_full_file_base64
    }
    else if (current_crop_file.value === 'a_file') {
      fileBase64 = form.a_file_base64
    }
    else if (current_crop_file.value === 'b_file') {
      fileBase64 = form.b_file_base64
    }
    else if (current_crop_file.value === 'c_file') {
      fileBase64 = form.c_file_base64
    }
    else if (current_crop_file.value === 'd_file') {
      fileBase64 = form.d_file_base64
    }

    if (fileBase64) {
      // Create URLSearchParams for the request (similar to querystring in the old version)
      const params = new URLSearchParams()
      params.append('file_base64', fileBase64)

      // Send API request
      const response = await useApiService.post('/api/v1/upload', params, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      })

      if (response?.data?.[0]?.file?.name) {
        // Get the file name from the response
        const fileName = response.data[0].file.name

        // Update the corresponding form field
        if (current_crop_file.value === 'q_file') {
          form.q_file = fileName
        }
        else if (current_crop_file.value === 'answer_full_file') {
          form.answer_full_file = fileName
        }
        else if (current_crop_file.value === 'a_file') {
          form.a_file = fileName
        }
        else if (current_crop_file.value === 'b_file') {
          form.b_file = fileName
        }
        else if (current_crop_file.value === 'c_file') {
          form.c_file = fileName
        }
        else if (current_crop_file.value === 'd_file') {
          form.d_file = fileName
        }

        if ($toast) $toast.success('File uploaded successfully')

        // Close the dialog after successful upload
        cropper_dialog.value = false
      }
      else {
        if ($toast) $toast.error('Invalid response from server')
      }
    }
    else {
      if ($toast) $toast.error('No file to upload')
    }
  }
  catch (error) {
    console.error('Error submitting cropped image:', error)
    if ($toast) $toast.error('Failed to upload cropped image')
  }
  finally {
    crop_confirm_loading.value = false
  }
}

/**
 * Trigger form validation manually after user interacts with RichEditor
 * This ensures validation state is updated properly
 */
const refreshValidation = () => {
  // Clear errors first
  clearFieldValidationErrors()
  // Then validate after a delay
  debouncedValidate()
}

/**
 * Watch for changes in rich editor content and validate the form
 */
watch(
  () => form.question,
  () => refreshValidation(),
)

watch(
  () => [
    form.answer_a,
    form.answer_b,
    form.answer_c,
    form.answer_d,
    form.answer_full,
  ],
  () => refreshValidation(),
)

/**
 * Update the buttonDisabled computed property to accurately reflect required fields
 */
const buttonDisabled = computed(() => {
  // Check basic mandatory fields
  const requiredFields
    = form.section && form.base && form.lesson && form.question

  // For multiple choice forms, also check true_answer
  if (['fourchoice', 'twochoice', 'tf'].includes(form.type)) {
    return !requiredFields || !form.true_answer
  }

  return !requiredFields
})

/**
 * Custom validation function for answer fields
 */
const validateAnswerField = (value) => {
  // If we are using image answers, then don't validate text fields
  if (form.testImgAnswers === true) {
    return true
  }

  // Otherwise, check that we have content
  if (!value || value.trim() === '') {
    return 'This field is required'
  }

  return true
}

/**
 * Custom validation for the true answer radio group
 */
const validateTrueAnswer = (value) => {
  // Only validate if this is a multiple choice question type
  if (['fourchoice', 'twochoice', 'tf'].includes(form.type)) {
    if (!value) {
      return 'Please select the correct answer'
    }
  }
  return true
}

// Add this to our validateForm function to ensure all "validation is not valid" messages are cleared
const clearFieldValidationErrors = () => {
  // First method: Hide error messages with inline style
  const errorMessages = document.querySelectorAll('.text-error')
  errorMessages.forEach((element) => {
    element.style.display = 'none'
  })

  // Second method: Remove the "not valid" text directly
  const validationTexts = document.querySelectorAll('[class*="not valid"]')
  validationTexts.forEach((element) => {
    element.style.display = 'none'
  })

  // Third method: Clear all form error messages
  setTimeout(() => {
    document.querySelectorAll('.error--text').forEach((el) => {
      el.classList.remove('error--text')
    })
  }, 10)
}

/**
 * Validate question field
 */
const validateQuestionField = (value) => {
  if (!value || value.trim() === '') {
    return 'Please enter a question'
  }
  return true
}

/**
 * Trigger form validation manually and submit
 */
const _manualSubmit = async () => {
  clearFieldValidationErrors()

  if (
    !form.topic
    && selected_topics.value
    && selected_topics.value.length > 0
  ) {
    form.topic = parseInt(selected_topics.value[0])
  }

  // Run our direct validation
  if (!validateForm()) {
    return
  }

  create_loading.value = true

  // Create URLSearchParams object for the API request - similar to querystring.stringify in Vue 2
  const formData = new URLSearchParams()

  // Add all required fields
  formData.append('section', form.section.toString())
  formData.append('base', form.base.toString())
  formData.append('lesson', form.lesson.toString())
  formData.append('topic', form.topic.toString())
  formData.append('type', form.type)
  formData.append('direction', form.direction || 'ltr')
  formData.append('question', form.question || '')
  formData.append('true_answer', form.true_answer || '')
  formData.append('testImgAnswers', form.testImgAnswers ? '1' : '0')
  formData.append('testingAnswers', '0')
  formData.append('answer_full', form.answer_full || '')

  // Add answers based on question type
  if (['fourchoice', 'twochoice', 'tf'].includes(form.type)) {
    formData.append('answer_a', form.answer_a || '')
    formData.append('answer_b', form.answer_b || '')

    if (form.type === 'fourchoice') {
      formData.append('answer_c', form.answer_c || '')
      formData.append('answer_d', form.answer_d || '')
    }
  }

  // Add file fields if they exist
  if (form.q_file) formData.append('q_file', form.q_file)
  if (form.answer_full_file)
    formData.append('answer_full_file', form.answer_full_file)
  if (form.a_file) formData.append('a_file', form.a_file)
  if (form.b_file) formData.append('b_file', form.b_file)
  if (form.c_file) formData.append('c_file', form.c_file)
  if (form.d_file) formData.append('d_file', form.d_file)

  try {
    const response = await useApiService.post('/api/v1/examTests', formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    })

    if (response.status == 1) {
      path_panel_expand.value = false

      // Get the created test ID
      const createdTestId = response.data.id

      // Get current exam ID from state
      const userState = useState('user').value
      const currentExamId = userState?.currentExamId || route.params.id

      if (currentExamId && props.examEditMode === true) {
        try {
          // STEP 2: Associate test with exam - PUT to /api/v1/exams/tests/{exam_id}
          const examTestsFormData = new URLSearchParams()
          examTestsFormData.append('tests[]', createdTestId)

          const _associationResponse = await useApiService.put(
            `/api/v1/exams/tests/${currentExamId}`,
            examTestsFormData,
            {
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
              },
            },
          )
          emit('update:updateTestList', createdTestId)
          examTestListLength.value++
          emit('update:refreshTests')

          if ($toast) $toast.success('Test added to exam successfully')
        }
        catch (err) {
          console.error('Error associating test with exam:', err)
          if ($toast)
            $toast.error('Test created but couldn\'t be added to exam')
        }
      }
      else {
        // Not in exam edit mode, just emit the events
        emit('update:updateTestList', createdTestId)
        examTestListLength.value++
      }

      // Reset form fields
      resetFormFields()
    }
    else {
      if ($toast)
        $toast.error(response.message || 'An error occurred, try again')
    }
  }
  catch (err) {
    if (err.response?.status == 400) {
      if ($toast) $toast.error(err.response.data.message || 'Bad request')
    }
    else if (err.response?.status == 403) {
      if ($toast) $toast.error('Authentication error')
      router.push('/login')
    }
    else {
      if ($toast) $toast.error(err.message || 'An error occurred')
    }
  }
  finally {
    create_loading.value = false
  }
}

// Expose methods to parent component
defineExpose({
  getCurrentExamInfo,
  resetFormFields,
})

// watchEffect(() => {
//   // `foo` transformed to `props.foo` by the compiler
//   console.log(props.testList.length)
// })
</script>

<style>
.pointer {
  cursor: pointer;
}

.topic_season {
  background-color: rgba(144, 202, 249, 0.2);
  font-weight: 600;
  color: #1565c0;
  border-radius: 4px;
  padding: 2px 6px;
}

#test-question {
  margin-bottom: 20px;
}

.test-maker .test-list {
  margin-bottom: 20px;
}

.test-maker .answer {
  margin-left: 10px;
}

.test-maker .true_answer {
  color: #4caf50;
}

.answer_label {
  position: absolute;
  font-size: 16px;
  font-weight: 600;
  color: #26a69a;
  bottom: 0;
  left: 8px;
}

/* For image previews */
.v-card img {
  max-width: 100%;
  height: auto;
}

.ckeditor-wrapper {
  width: 100%;
}

.image-holder {
  position: relative;
  height: 12.5rem;
  margin-left: 2rem;
}

/* Ensure proper handling of radio buttons */
#test-image-options .v-radio {
  margin-bottom: 0;
}

/* Cropper container styles */
.cropper-container {
  position: relative;
  max-width: 100%;
  margin: 0 auto;
  border-radius: 4px;
  overflow: hidden;
}

.text-white {
  color: white !important;
}

/* For better form spacing */
.v-card-text {
  padding-bottom: 24px;
}

.topic_list_item {
  font-size: 1.4rem;
  line-height: 2rem;
}

.topic_season {
  font-weight: bolder !important;
  color: blue !important;
}
.v-selection-control .v-label {
  height: auto !important;
}

/* Cropper-specific styles */
#img-cropper-dialog {
  overflow: hidden;
}

#img-cropper-dialog .v-card-text {
  padding: 0;
}

.cropper-container {
  width: 100%;
  min-height: 300px;
  position: relative;
}

/* Custom stencil style for the cropper */
.vue-advanced-cropper__stencil-wrapper {
  border: 2px solid #009688;
}

/* Make sure the cropper actions are always visible */
#img-cropper-dialog .v-card-actions {
  background-color: white;
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.1);
  z-index: 5;
}
.image-holder .image-input {
  border-radius: 5px;
  height: 7rem;
  width: 7rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.07);
}

.img-clear-btn {
  position: relative;
  bottom: -20px;
}
.v-label {
  font-size: 1.4rem !important;
}
</style>
