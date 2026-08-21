<script setup lang="ts">
import { speeds } from '~/composables/useVoiceSettings'
import type { VoiceSpeed } from '~/types'

const props = defineProps<{ modelValue: VoiceSpeed }>()
const emit = defineEmits<{ (e: 'update:modelValue', value: VoiceSpeed): void }>()

const updateSpeed = (value: number) => {
  const speed = speeds.find(s => s.value === value)
  if (speed) emit('update:modelValue', speed.value)
}
const speedValue = computed({
  get: () => props.modelValue,
  set: (value) => updateSpeed(value),
})
const currentSpeedLabel = computed(() => speeds.find(s => s.value === props.modelValue)?.label || 'Normal')
</script>

<template>
  <div class="w-full">
    <div class="mb-3 flex items-center justify-between">
      <p class="engrave">Rate</p>
      <span class="readout px-2.5 py-1 text-[0.7rem]">{{ modelValue.toFixed(2) }}× · {{ currentSpeedLabel }}</span>
    </div>

    <div class="relative pt-1">
      <input v-model.number="speedValue" type="range" :min="0.5" :max="2.0" :step="0.25" class="console-range" aria-label="Playback rate" />
      <div class="mt-2 flex justify-between font-mono text-[0.62rem] text-surface-400">
        <span>0.5×</span><span>1.0×</span><span>1.5×</span><span>2.0×</span>
      </div>
    </div>

    <div class="mt-4 flex flex-wrap gap-2">
      <button
        v-for="speed in speeds" :key="speed.value"
        :data-on="modelValue === speed.value"
        class="keycap px-3 py-1.5 font-mono text-[0.7rem] font-medium"
        @click="emit('update:modelValue', speed.value)"
      >
        {{ speed.value.toFixed(2) }}×
      </button>
    </div>
  </div>
</template>
