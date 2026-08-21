<script setup lang="ts">
import { Trash2 } from 'lucide-vue-next'
const props = withDefaults(defineProps<{ modelValue: string; maxLength?: number }>(), { maxLength: 5000 })
const emit = defineEmits<{ 'update:modelValue': [value: string]; clear: [] }>()
const count = computed(() => props.modelValue.length)
const words = computed(() => props.modelValue.trim() ? props.modelValue.trim().split(/\s+/).length : 0)
const pct = computed(() => Math.min(count.value / props.maxLength * 100, 100))
function update(event: Event) { emit('update:modelValue', (event.target as HTMLTextAreaElement).value) }
function clear() { emit('update:modelValue', ''); emit('clear') }
</script>
<template>
  <div>
    <div class="mb-3 flex items-end justify-between">
      <div>
        <p class="engrave">Input</p>
        <h2 class="mt-1 font-display text-lg font-semibold text-surface-900">Script channel</h2>
      </div>
      <div class="flex items-center gap-3 pb-0.5">
        <span class="readout px-2.5 py-1 text-[0.7rem]">{{ words }} <span class="text-surface-400">WD</span></span>
        <span class="readout px-2.5 py-1 text-[0.7rem]" :class="count > maxLength * 0.9 ? 'text-primary-600' : ''">{{ count.toLocaleString() }}<span class="text-surface-400">/{{ (maxLength / 1000).toFixed(0) }}K</span></span>
      </div>
    </div>
    <div class="relative">
      <textarea
        :value="modelValue" :maxlength="maxLength" rows="11"
        class="w-full resize-y rounded-xl border border-surface-300 bg-surface-50 p-4 pr-12 text-base leading-7 text-surface-900 shadow-[inset_0_1px_3px_rgba(27,25,21,0.08)] placeholder:text-surface-400 focus:border-primary-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary-100"
        placeholder="Type the line to be spoken. Punctuation shapes the breath — commas for short pauses, full stops for deliberate ones."
        @input="update"
      />
      <button v-if="modelValue" class="absolute right-3 top-3 rounded-lg p-2 text-surface-400 hover:bg-white hover:text-primary-600" title="Clear script" @click="clear"><Trash2 :size="18" /></button>
    </div>
    <div class="mt-3 flex items-center gap-3">
      <div class="h-1.5 flex-1 overflow-hidden rounded-full bg-surface-200 shadow-[inset_0_1px_1px_rgba(27,25,21,0.2)]">
        <div class="h-full rounded-full transition-[width] duration-200" :style="{ width: `${pct}%`, background: 'var(--accent)' }" />
      </div>
      <span class="hud text-surface-500">{{ pct.toFixed(0) }}%</span>
    </div>
  </div>
</template>
