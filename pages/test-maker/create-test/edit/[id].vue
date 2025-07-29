<template>
  <v-container
    id="create-test"
    class="create-test-container my-md-16"
  >
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
      <v-card-text>
        <VeeForm
          ref="veeForm"
          @submit="handleSubmit"
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
                <template #activator="{ props }">
                  <v-btn
                    color="teal"
                    class="text-white py-5"
                    v-bind="props"
                    block
                    @click="path_panel_expand = !path_panel_expand"
                  >
                    <i class="fas fa-route mx-3 fa-xl" />
                  </v-btn>
                </template>
                <span>Change path</span>
              </v-tooltip>
            </v-col>

            <v-col
              v-show="path_panel_expand"
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
                :rules="[(v) => !!v || 'This field is required']"
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
                        variant="text"
                        icon="mdi-camera"
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
                        size="small"
                        color="error"
                        icon="mdi-delete"
                        @click="deleteFile('q_file')"
                      />
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
              <img
                v-if="form.q_file_base64"
                width="200"
                height="200"
                class="pointer image-preview rounded mt-2"
                :src="form.q_file_base64"
                @click="selectFile('q_file')"
              >
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
                          width="90"
                          height="90"
                          class="pointer image-input rounded"
                          :src="form.a_file_base64"
                          @click="selectFile('a_file')"
                        >
                        <v-btn
                          v-else
                          variant="text"
                          color="teal-lighten-5"
                          class="d-flex align-center justify-center"
                          style="width: 90px; height: 90px"
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
                          color="error"
                          icon="mdi-delete"
                          size="small"
                          class="img-clear-btn"
                          @click="deleteFile('a_file')"
                        />
                      </div>
                    </v-col>
                  </v-row>

                  <!-- Similar structure for answers B, C, and D -->
                  <!-- Answer B -->
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
                          width="90"
                          height="90"
                          class="pointer image-input rounded"
                          :src="form.b_file_base64"
                          @click="selectFile('b_file')"
                        >
                        <v-btn
                          v-else
                          variant="text"
                          color="teal-lighten-5"
                          class="d-flex align-center justify-center"
                          style="width: 90px; height: 90px"
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
                          color="error"
                          icon="mdi-delete"
                          size="small"
                          class="img-clear-btn"
                          @click="deleteFile('b_file')"
                        />
                      </div>
                    </v-col>
                  </v-row>

                  <!-- Answer C -->
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
                          width="90"
                          height="90"
                          class="pointer image-input rounded"
                          :src="form.c_file_base64"
                          @click="selectFile('c_file')"
                        >
                        <v-btn
                          v-else
                          variant="text"
                          color="teal-lighten-5"
                          class="d-flex align-center justify-center"
                          style="width: 90px; height: 90px"
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
                          color="error"
                          icon="mdi-delete"
                          size="small"
                          class="img-clear-btn"
                          @click="deleteFile('c_file')"
                        />
                      </div>
                    </v-col>
                  </v-row>

                  <!-- Answer D -->
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
                          width="90"
                          height="90"
                          class="pointer image-input rounded"
                          :src="form.d_file_base64"
                          @click="selectFile('d_file')"
                        >
                        <v-btn
                          v-else
                          variant="text"
                          color="teal-lighten-5"
                          class="d-flex align-center justify-center"
                          style="width: 90px; height: 90px"
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
                          color="error"
                          icon="mdi-delete"
                          size="small"
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
                width="90"
                height="90"
                class="pointer image-input rounded"
                :src="form.answer_full_file_base64"
                @click="selectFile('answer_full_file')"
              >
              <v-btn
                v-else
                variant="text"
                color="teal-lighten-5"
                class="d-flex align-center justify-center"
                style="
                  width: 90px;
                  height: 90px;
                  position: absolute;
                  bottom: 5px;
                  right: 10px;
                "
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
                color="error"
                icon="mdi-delete"
                size="small"
                class="img-clear-btn"
                @click="deleteFile('answer_full_file')"
              >
                <v-icon small>
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
                    block
                    color="teal"
                    class="text-white"
                    size="large"
                    type="submit"
                    :loading="update_loading"
                    style="
                      text-transform: none;
                      font-size: 13px;
                      font-weight: 500;
                    "
                    density="compact"
                  >
                    Update
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
                    to="/test-maker"
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
        </VeeForm>
      </v-card-text>
    </v-card>

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
              :stencil-props="stencil_props"
              image-restriction="stencil"
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

    <!-- Delete Confirmation Dialog -->
    <v-dialog
      v-model="confirmDeleteDialog"
      max-width="500"
    >
      <v-card>
        <v-card-title class="text-h5">
          Confirm Delete
        </v-card-title>
        <v-card-text>
          Are you sure you want to delete this test? This action cannot be
          undone.
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            color="gray"
            variant="text"
            @click="confirmDeleteDialog = false"
          >
            Cancel
          </v-btn>
          <v-btn
            color="error"
            variant="text"
            :loading="delete_loading"
            @click="deleteTest"
          >
            Delete
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
import { ref, reactive, watch, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuth } from '~/composables/useAuth'
import { Form as VeeForm, useForm, Field } from 'vee-validate'
import _TopicSelector from '~/components/form/topic-selector.vue'
import { Cropper } from 'vue-advanced-cropper'
import 'vue-advanced-cropper/dist/style.css'

// Define layout and page metadata
definePageMeta({
  layout: 'test-maker-layout',
  middleware: ['auth', 'user-type'],
})

useHead({
  title: 'Edit Test',
  meta: [{ name: 'description', content: 'Edit an existing test question' }],
})

// Services and utilities
const { $toast } = useNuxtApp()
const router = useRouter()
const route = useRoute()
const auth = useAuth()

// Refs for HTML elements (file inputs)
const veeForm = ref(null)
const questionInput = ref(null)
const answerFullInput = ref(null)
const aInput = ref(null)
const bInput = ref(null)
const cInput = ref(null)
const dInput = ref(null)

// UI State
const path_panel_expand = ref(true)
const update_loading = ref(false)
const delete_loading = ref(false)
const confirmDeleteDialog = ref(false)
const text_answer = ref(true)
const photo_answer = ref(false)
const file_original_path = ref('')

// Cropper related state
const crop_file_url = ref('')
const crop_file_loading = ref(false)
const crop_confirm_loading = ref(false)
const cropper_dialog = ref(false)
const current_crop_file = ref('')
const cropped_image = ref(null)
const stencil_props = reactive({
  width: 180,
  height: 180,
  aspectRatio: 1,
})

// User token
const userToken = ref('')

// Photo answer validation rule
const photo_answer_rules = (value) => {
  if (!value) return true

  if (form.testImgAnswers && form.true_answer) {
    const option = form.true_answer.toLowerCase()
    if (option === '1' || option === '2' || option === '3' || option === '4') {
      const optionMap = {
        1: 'a_file',
        2: 'b_file',
        3: 'c_file',
        4: 'd_file',
      }
      const fileKey = optionMap[option]
      if (fileKey && !form_hidden_data[fileKey]) {
        return 'Please upload an image for the correct answer'
      }
    }
  }
  return true
}

// Form data
const form = reactive({
  id: '',
  section: '',
  base: '',
  lesson: '',
  topic: '',
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
})

// Data lists
const level_list = ref([])
const grade_list = ref([])
const lesson_list = ref([])
const topic_list = ref([])

// Static data
const typeList = [
  { value: 'fourchoice', title: 'Multiple choice(4)' },
  { value: 'twochoice', title: 'Multiple choice(2)' },
  { value: 'descriptive', title: 'Open-Ended' },
  { value: 'tf', title: 'True/False' },
  { value: 'blank', title: 'Blank' },
  { value: 'shortanswer', title: 'Short answer' },
]

// API calls
const getTypeList = async (type, parent = '') => {
  try {
    const params = { type }

    if (type === 'base') params.section_id = parent
    if (type === 'lesson') params.base_id = parent
    if (type === 'topic') params.lesson_id = parent

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
    $toast.error(err.message || 'Error loading data')
  }
}

// Fetch test data
const fetchTestData = async () => {
  try {
    update_loading.value = true

    // Get test ID from route params
    const testId = route.params.id

    // Fetch test data
    const response = await useApiService.get(`/api/v1/examTests/${testId}`)

    if (response && response.data) {
      const data = response.data

      // Update form with test data
      form.id = data.id
      form.section = data.section
      form.base = data.base
      form.lesson = data.lesson
      form.topic = data.topic
      form.type = data.type
      form.question = data.question
      form.true_answer = data.true_answer
      form.answer_a = data.answer_a
      form.answer_b = data.answer_b
      form.answer_c = data.answer_c
      form.answer_d = data.answer_d
      form.answer_full = data.answer_full
      form.testImgAnswers = data.testImgAnswers
      form.answer_type = data.testImgAnswers ? 'photo' : 'text'

      // Set image paths if available
      if (data.file_original) {
        file_original_path.value = data.file_original
      }

      if (data.q_file) {
        form.q_file_base64 = data.q_file
      }

      if (data.answer_full_file) {
        form.answer_full_file_base64 = data.answer_full_file
      }

      if (data.a_file) {
        form.a_file_base64 = data.a_file
        form.a_file = data.a_file_name || data.a_file || ''
      }
      else {
        form.a_file = ''
      }
      if (data.b_file) {
        form.b_file_base64 = data.b_file
        form.b_file = data.b_file_name || data.b_file || ''
      }
      else {
        form.b_file = ''
      }
      if (data.c_file) {
        form.c_file_base64 = data.c_file
        form.c_file = data.c_file_name || data.c_file || ''
      }
      else {
        form.c_file = ''
      }
      if (data.d_file) {
        form.d_file_base64 = data.d_file
        form.d_file = data.d_file_name || data.d_file || ''
      }
      else {
        form.d_file = ''
      }

      // Update UI state based on answer type
      if (data.testImgAnswers) {
        text_answer.value = false
        photo_answer.value = true
      }

      // Load related data
      await getTypeList('section')

      if (form.section) {
        await getTypeList('base', form.section)
      }

      if (form.base) {
        await getTypeList('lesson', form.base)
      }

      if (form.lesson) {
        await getTypeList('topic', form.lesson)
      }
    }
  }
  catch (err) {
    console.error('Error fetching test data:', err)
    $toast.error('Failed to load test information')
  }
  finally {
    update_loading.value = false
  }
}

// Update test
const { handleSubmit: _veeHandleSubmit } = useForm()

// Create a proper form submission handler that uses veeHandleSubmit
const handleSubmit = (evt) => {
  // Safely prevent default form submission
  if (evt && typeof evt.preventDefault === 'function') {
    evt.preventDefault()
  }

  // Call the updateQuestion function directly
  updateQuestion()
}

const updateQuestion = async () => {
  try {
    update_loading.value = true

    // Validate form fields
    if (!validateForm()) {
      update_loading.value = false
      return
    }

    // Create FormData for the request
    const formData = new URLSearchParams()
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

    // Add file fields for all options, always
    formData.append('a_file', form.a_file || '')
    formData.append('b_file', form.b_file || '')
    formData.append('c_file', form.c_file || '')
    formData.append('d_file', form.d_file || '')

    // Send update request
    const response = await useApiService.put(
      `/api/v1/examTests/${form.id}`,
      formData,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      },
    )

    if (response && response.status === 1) {
      $toast.success('Test updated successfully')
      router.back()
    }
    else {
      $toast.error(response?.message || 'Failed to update test')
    }
  }
  catch (err) {
    console.error('Error updating test:', err)
    $toast.error('Error updating test')
  }
  finally {
    update_loading.value = false
  }
}

// Delete test
const deleteTest = async () => {
  try {
    delete_loading.value = true

    // Send delete request
    const response = await useApiService.remove(`/api/v1/examTests/${form.id}`)

    if (response.status === 1) {
      $toast.success('Test deleted successfully')
      router.back()
    }
    else {
      $toast.error(response.message || 'Error deleting test')
    }
  }
  catch (err) {
    console.error('Error deleting test:', err)
    $toast.error(err.message || 'Error deleting test')
  }
  finally {
    delete_loading.value = false
    confirmDeleteDialog.value = false
  }
}

// Validate form
const validateForm = () => {
  // Check basic required fields
  if (!form.section) {
    $toast.error('Please select a Board')
    return false
  }

  if (!form.base) {
    $toast.error('Please select a Grade')
    return false
  }

  if (!form.lesson) {
    $toast.error('Please select a Subject')
    return false
  }

  if (!form.topic) {
    $toast.error('Please select a Topic')
    return false
  }

  if (!form.question || form.question.trim() === '') {
    $toast.error('Please enter a question')
    return false
  }

  // For multiple choice questions, check answers
  if (['fourchoice', 'twochoice', 'tf'].includes(form.type)) {
    if (!form.true_answer) {
      $toast.error('Please select the correct answer')
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
          $toast.error('Please enter text for Answer A')
          return false
        }

        if (!form.answer_b || form.answer_b.trim() === '') {
          $toast.error('Please enter text for Answer B')
          return false
        }

        if (form.type === 'fourchoice') {
          if (!form.answer_c || form.answer_c.trim() === '') {
            $toast.error('Please enter text for Answer C')
            return false
          }

          if (!form.answer_d || form.answer_d.trim() === '') {
            $toast.error('Please enter text for Answer D')
            return false
          }
        }
      }
    }
    else {
      // Check image answers
      if (form.true_answer === '1' && !form.a_file_base64) {
        $toast.error('Please upload an image for Answer A (marked as correct)')
        return false
      }

      if (form.true_answer === '2' && !form.b_file_base64) {
        $toast.error('Please upload an image for Answer B (marked as correct)')
        return false
      }

      if (form.type === 'fourchoice') {
        if (form.true_answer === '3' && !form.c_file_base64) {
          $toast.error(
            'Please upload an image for Answer C (marked as correct)',
          )
          return false
        }

        if (form.true_answer === '4' && !form.d_file_base64) {
          $toast.error(
            'Please upload an image for Answer D (marked as correct)',
          )
          return false
        }
      }
    }
  }

  return true
}

// File handling
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

const uploadFile = (file_name, fileEvent) => {
  // v-file-input can return array or single file, handle both cases
  const file = Array.isArray(fileEvent) ? fileEvent[0] : fileEvent

  if (!file) return

  // Set current crop file name for tracking which file we're working with
  current_crop_file.value = file_name

  // Set crop file URL for cropper dialog
  crop_file_url.value = URL.createObjectURL(file)

  // Show the cropper dialog
  cropper_dialog.value = true
}

const cropFile = ({ _coordinates, canvas }) => {
  // Store the cropped image data
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

  // Store for later use
  cropped_image.value = { canvas }
}

const submitCrop = async () => {
  crop_confirm_loading.value = true

  try {
    // Get the current file based on the file name
    let file = null

    if (current_crop_file.value === 'q_file') {
      file = form_hidden_data.q_file
    }
    else if (current_crop_file.value === 'answer_full_file') {
      file = form_hidden_data.answer_full_file
    }
    else if (current_crop_file.value === 'a_file') {
      file = form_hidden_data.a_file
    }
    else if (current_crop_file.value === 'b_file') {
      file = form_hidden_data.b_file
    }
    else if (current_crop_file.value === 'c_file') {
      file = form_hidden_data.c_file
    }
    else if (current_crop_file.value === 'd_file') {
      file = form_hidden_data.d_file
    }

    if (file) {
      // Create a FormData object
      const formData = new FormData()
      formData.append('file', file)

      // Send API request
      const response = await useApiService.post('/api/v1/upload', formData)

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

        $toast.success('File uploaded successfully')

        // Close the dialog after successful upload
        cropper_dialog.value = false
      }
      else {
        $toast.error('Invalid response from server')
      }
    }
    else {
      $toast.error('No file to upload')
    }
  }
  catch (error) {
    console.error('Error submitting cropped image:', error)
    $toast.error('Failed to upload cropped image')
  }
  finally {
    crop_confirm_loading.value = false
  }
}

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

const answerTypeChanged = (type) => {
  if (type === 'txt') {
    text_answer.value = true
    photo_answer.value = false
    form.testImgAnswers = false
    form.answer_type = 'text'
  }
  else {
    text_answer.value = false
    photo_answer.value = true
    form.testImgAnswers = true
    form.answer_type = 'photo'
  }
}

// Form validation
const validateQuestionField = (value) => {
  if (!value || value.trim() === '') {
    return 'Please enter a question'
  }
  return true
}

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

const validateTrueAnswer = (value) => {
  // Only validate if this is a multiple choice question type
  if (['fourchoice', 'twochoice', 'tf'].includes(form.type)) {
    if (!value) {
      return 'Please select the correct answer'
    }
  }
  return true
}

// Computed properties
const _buttonDisabled = computed(() => {
  // Check basic mandatory fields
  const requiredFields
    = form.section && form.base && form.lesson && form.topic && form.question

  // For multiple choice forms, also check true_answer
  if (['fourchoice', 'twochoice', 'tf'].includes(form.type)) {
    return !requiredFields || !form.true_answer
  }

  return !requiredFields
})

// Watchers
watch(
  () => form.section,
  (val) => {
    if (val) getTypeList('base', val)
  },
)

watch(
  () => form.base,
  (val) => {
    if (val) getTypeList('lesson', val)
  },
)

watch(
  () => form.lesson,
  (val) => {
    if (val) getTypeList('topic', val)
  },
)

watch(
  () => form.type,
  (val) => {
    if (val === 'tf') {
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
  },
)

// Initialize on mount
onMounted(() => {
  userToken.value = auth.getUserToken()

  // Fetch test data
  fetchTestData()
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

.pointer {
  cursor: pointer;
}

.image-input {
  background-color: rgba(0, 0, 0, 0.05);
  border-radius: 4px;
  border: 1px dashed #9e9e9e;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;
}

.image-input:hover {
  background-color: rgba(0, 150, 136, 0.05);
  border-color: #009688;
}

.image-preview {
  display: block;
  object-fit: contain;
  border: 1px solid #e0e0e0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-top: 8px;
  max-width: 100%;
  height: auto;
}

.img-clear-btn {
  position: absolute;
  margin-left: -20px;
  margin-top: -4px;
  background-color: white !important;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.18);
  transition: all 0.2s ease;
}

.img-clear-btn:hover {
  transform: scale(1.05);
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
  display: inline-block;
  margin-bottom: 16px;
}

.image-holder .img-clear-btn {
  position: absolute;
  top: 8px;
  right: 8px;
  z-index: 5;
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
</style>
