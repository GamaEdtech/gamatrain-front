<template>
  <v-dialog
    v-model="dialogModel"
    max-width="500"
    :fullscreen="!smAndUp"
  >
    <template #default="{ isActive }">
      <v-form
        ref="formRef"
        v-model="formIsValid"
        class="min-h-full"
        @submit.prevent="onSubmit"
      >
        <v-card :class="`${smAndUp ? `rounded-xl`:`rounded-0`}`">
          <div class="px-4 py-4 d-flex justify-space-between align-center">
            <span
              class="text-h4 font-weight-bold"
            >
              Creat Proposal
            </span>
            <div
              class="d-flex justify-end cursor-pointer"
              style="justify-self: end"
              @click="isActive.value = false"
            >
              <v-icon
                size="x-large"
                color="grey400"
              >
                md:close
              </v-icon>
            </div>
          </div>
          <v-card-text>
            <div class="text-h6 text-md-button">
              <v-icon
                size="x-large"
                :color="publicKey ? 'success' : 'grey500'"
              >
                md:account_balance_wallet
              </v-icon>
              <span
                class="text-h6 pl-2 text-grey400"
                style="display: inline-block"
              >Wallet
              </span>
              <span
                v-if="publicKey"
                class="text-h6 pl-1 text-info"
                style="display: inline-block"
              >
                {{
                  publicKey.toBase58?.()?.slice(0, 4)
                }}...{{
                  publicKey.toBase58?.()?.slice(-4)
                }}
              </span>
              <span
                v-else
                class="text-h6 pl-1 text-error"
              > Not Connected </span>
            </div>

            <v-alert
              v-if="userStakeInformation && userStakeInformation.stakedAmount"
              type="success"
              variant="tonal"
              class="mt-4"
            >
              <div class="text-h6 font-weight-bold">
                Staked:
                {{ $numberFormat(userStakeInformation.stakedAmount || 0) }} $GET
              </div>
            </v-alert>
            <v-alert
              v-else
              type="warning"
              variant="tonal"
              class="mt-4"
            >
              <div class="text-h6 font-weight-bold">
                You must stake $GET tokens to create proposals. Please stake
                tokens first.
              </div>
            </v-alert>

            <v-alert
              type="info"
              variant="tonal"
              class="mt-4"
            >
              <div class="text-h6 font-weight-bold">
                To create a proposal, you must have staked 50M $GET.
              </div>
            </v-alert>

            <div class="mt-10">
              <div class="mb-4">
                <div class="mb-1 text-grey700 text-h6">
                  Title *
                </div>
                <v-text-field
                  v-model="form.title"
                  :rules="[rules.required, rules.maxLength(100)]"
                  density="compact"
                  variant="outlined"
                  rounded
                  placeholder="Enter proposal title"
                  counter="100"
                />
              </div>

              <div class="mb-4">
                <div class="mb-1 text-grey700 text-h6">
                  Description *
                </div>
                <v-textarea
                  v-model="form.brief"
                  :rules="[rules.required, rules.maxLength(500)]"
                  density="compact"
                  variant="outlined"
                  rounded
                  placeholder="Describe your proposal in detail"
                  counter="500"
                  rows="4"
                />
              </div>

              <div class="mb-4">
                <div class="mb-1 text-grey700 text-h6">
                  Category *
                </div>
                <v-select
                  v-model="form.cate"
                  :items="categoryOptions"
                  :rules="[rules.required]"
                  density="compact"
                  variant="outlined"
                  rounded
                  placeholder="Select category"
                />
              </div>

              <div class="mb-4">
                <div class="mb-1 text-grey700 text-h6">
                  Reference URL
                </div>
                <v-text-field
                  v-model="form.reference"
                  :rules="[rules.url]"
                  density="compact"
                  variant="outlined"
                  rounded
                  placeholder="https://example.com/proposal-details"
                  hint="Optional: Link to detailed proposal documentation"
                />
              </div>

              <div class="mb-4">
                <div class="mb-1 text-grey700 text-h6">
                  Requested Amount (GET tokens)
                </div>
                <v-text-field
                  v-model.number="form.amount"
                  :rules="[rules.positiveNumber]"
                  type="number"
                  density="compact"
                  variant="outlined"
                  rounded
                  placeholder="0"
                  hint="Amount of GET tokens requested for this proposal"
                  step="1"
                  min="0"
                />
              </div>
            </div>
          </v-card-text>

          <v-card-actions class="mb-5 mx-5">
            <v-btn
              variant="text"
              size="large"
              class="text-h5 font-weight-bold w-30"
              rounded
              @click="isActive.value = false"
            >
              Cancel
            </v-btn>
            <v-btn
              type="submit"
              variant="flat"
              size="large"
              color="#FFB600"
              rounded
              class="text-h5 font-weight-bold flex-1 w-70"
              :loading="loadingCreateProposal"
              :disabled="(!userStakeInformation || userStakeInformation.stakedAmount == 0)"
            >
              {{
                (!userStakeInformation || userStakeInformation.stakedAmount == 0)
                  ? "Stake Tokens Required"
                  : "Submit"
              }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-form>
    </template>
  </v-dialog>
</template>

<script setup lang="ts">
import type { VForm } from 'vuetify/components'
import { useDisplay } from 'vuetify'
import type { ProposalFormData } from '~/types/governance'
import { useGovernance } from '~/composables/governance/useGovernance'
import { useValidationRules } from '~/composables/useValidationRules'

const props = defineProps({
  showDialog: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['update:showDialog'])
const dialogModel = computed({
  get: () => props.showDialog,
  set: value => emit('update:showDialog', value),
})

const { smAndUp } = useDisplay()
const { $toast } = useNuxtApp()
const { userStakeInformation, publicKey, create, loadingCreateProposal, getProposal, getStatsInformation } = useGovernance()

const rules = useValidationRules()

const categoryOptions = [
  { title: 'General', value: 'general' },
  { title: 'Development', value: 'development' },
  { title: 'Marketing', value: 'marketing' },
  { title: 'Community', value: 'community' },
  { title: 'Finance', value: 'finance' },
  { title: 'Education', value: 'education' },
  { title: 'Infrastructure', value: 'infrastructure' },
]

const formIsValid = ref(false)

const formRef = ref<VForm | null>(null)

const form = ref({
  title: '',
  brief: '',
  cate: 'general',
  reference: '',
  amount: 0,
})

const onSubmit = async () => {
  const formValidation = await formRef.value?.validate()
  if (!formValidation?.valid) {
    return
  }

  const data: ProposalFormData = {
    title: form.value.title || '',
    brief: form.value.brief || '',
    cate: form.value.cate || 'general',
    reference: form.value.reference || '',
    amount: form.value.amount || 0,
  }

  const response = await create(data)
  emit('update:showDialog', false)
  form.value = {
    title: '',
    brief: '',
    cate: 'general',
    reference: '',
    amount: 0,
  }
  if (response.success) {
    $toast.success(response.message)
    await getProposal()
    await getStatsInformation()
  }
  else {
    $toast.error(response.message)
  }
}
</script>

<style scoped>
.create-proposal__head {
  box-shadow: 0px 0px 20px 0px #1018280d;
}
</style>
