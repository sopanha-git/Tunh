<script setup lang="ts">
import { FileText, Trash2 } from 'lucide-vue-next'
const props = withDefaults(defineProps<{ modelValue: string; maxLength?: number }>(), { maxLength: 5000 })
const emit = defineEmits<{ 'update:modelValue': [value: string]; clear: [] }>()
const count = computed(() => props.modelValue.length)
const words = computed(() => props.modelValue.trim() ? props.modelValue.trim().split(/\s+/).length : 0)
function update(event: Event) { emit('update:modelValue', (event.target as HTMLTextAreaElement).value) }
function clear() { emit('update:modelValue', ''); emit('clear') }
</script>
<template><div><div class="mb-4 flex items-center justify-between"><div class="flex items-center gap-2"><FileText :size="18" class="text-primary-600" /><label class="font-semibold text-surface-800">Script</label></div><div class="text-xs text-surface-500"><span>{{ words }} words</span><span class="mx-2">·</span><span :class="count > maxLength * .9 ? 'text-amber-700' : ''">{{ count.toLocaleString() }}/{{ maxLength.toLocaleString() }}</span></div></div><div class="relative"><textarea :value="modelValue" :maxlength="maxLength" rows="12" class="w-full resize-y rounded-xl border border-surface-200 bg-surface-50 p-4 pr-12 text-base leading-7 text-surface-900 placeholder:text-surface-400 focus:border-primary-500 focus:bg-white focus:outline-none" placeholder="Write or paste your script here…" @input="update" /><button v-if="modelValue" class="absolute right-3 top-3 rounded-lg p-2 text-surface-400 hover:bg-white hover:text-red-600" title="Clear script" @click="clear"><Trash2 :size="18" /></button></div><div class="mt-3 h-1 overflow-hidden rounded-full bg-surface-100"><div class="h-full rounded-full bg-primary-500 transition-[width]" :style="{width: `${Math.min(count / maxLength * 100, 100)}%`} " /></div><p class="mt-3 text-xs text-surface-500">Tip: punctuation helps create natural, deliberate pauses.</p></div></template>
