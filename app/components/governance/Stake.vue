<template>
  <v-dialog
    v-model="visible"
    max-width="500"
    @after-leave="handleAfterLeave"
  >
    <v-sheet>
      <v-tabs
        v-model="tab"
        fixed-tabs
      >
        <v-tab
          value="stake"
          text="Stake"
        />
        <v-tab
          value="unstake"
          text="Unstake"
        />
      </v-tabs>

      <v-divider />

      <v-card v-model="tab">
        <v-card-text>
          <v-col cols="12">
            <v-form
              ref="formRef"
              v-model="formIsValid"
              @submit.prevent="onSubmit"
            >
              <v-text-field
                v-model="amount"
                label="Amount"
                variant="outlined"
                :rules="[rules.required]"
              >
                <template #prepend-inner>
                  <v-img
                    src="/GET-Token/QmRU6u4TAG1sHW9V8GZyZCn3Qp2ztkYzhhWawzZQEwQaEU.png"
                    width="24"
                    height="24"
                    class="mr-2"
                    cover
                  />
                </template>

                <template #append-inner>
                  <v-btn
                    color="primary"
                    class="rounded-e-lg"
                    type="submit"
                  >
                    Stake
                  </v-btn>
                </template>
              </v-text-field>
            </v-form>
          </v-col>
        </v-card-text>
      </v-card>
    </v-sheet>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { governance } from '~/composables/useGovernance'
import { useWorkspace } from '~/composables/useWorkspace'

// --- Props & Emits (instead of defineModel) ---
const props = defineProps<{ modelValue: boolean }>()
const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'created'): void
  (e: 'walletRequired'): void
}>()

// two-way binding for v-model
const visible = computed({
  get: () => props.modelValue,
  set: (val: boolean) => emit('update:modelValue', val),
})

// --- Local state ---
const amount = ref<number>(1000)
const tab = ref('stake')
const rules = { required: (v: unknown) => !!v || 'This field is required' }
const formIsValid = ref(false)
const formRef = ref()
const isSubmitting = ref(false)
const form = ref({
  title: '',
  brief: '',
  cate: 'general',
  reference: '',
  amount: 0,
})

// --- Wallet state ---
const workspace = useWorkspace()
const isWalletReady = computed(() =>
  workspace?.connected?.value
  && workspace?.publicKey?.value
  && workspace?.program?.value,
)

// --- Submit handler ---
async function onSubmit() {
  const { valid } = await (formRef.value as any)?.validate()
  if (!valid) return

  if (!isWalletReady.value) {
    emit('walletRequired')
    return
  }

  try {
    isSubmitting.value = true
    const program = workspace.program?.value
    const userPk = workspace.publicKey?.value
    if (!program) throw new Error('Blockchain program not ready. Please refresh.')
    if (!userPk) throw new Error('Wallet not connected. Please reconnect.')

    await governance.createProposal(program, userPk, {
      title: String(form.value.title),
      brief: String(form.value.brief),
      cate: String(form.value.cate),
      reference: String(form.value.reference),
      amount: Number(form.value.amount),
    })

    const { $toast } = useNuxtApp()
    $toast.success('Proposal created successfully!')

    emit('created')
    emit('update:modelValue', false)

    form.value = { title: '', brief: '', cate: 'general', reference: '', amount: 0 }
  }
  catch (e: any) {
    console.error('Failed to create proposal:', e)
    useNuxtApp().$toast.error(e.message || 'Failed to create proposal')
  }
  finally {
    isSubmitting.value = false
  }
}

// --- Close handler ---
const handleAfterLeave = () => emit('update:modelValue', false)
</script>

<style scoped>
.create-proposal__head {
  box-shadow: 0px 0px 20px 0px #1018280d;
}
</style>
