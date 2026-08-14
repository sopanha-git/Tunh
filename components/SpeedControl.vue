<script setup lang="ts">
import { speeds } from '~/composables/useVoiceSettings'
import type { VoiceSpeed } from '~/types'

interface Props {
  modelValue: VoiceSpeed
}

interface Emits {
  (e: 'update:modelValue', value: VoiceSpeed): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const updateSpeed = (value: number) => {
  const speed = speeds.find(s => s.value === value)
  if (speed) {
    emit('update:modelValue', speed.value)
  }
}

const speedValue = computed({
  get: () => props.modelValue,
  set: (value) => updateSpeed(value),
})

const currentSpeedLabel = computed(() => {
  const speed = speeds.find(s => s.value === props.modelValue)
  return speed?.label || 'Normal'
})
</script>

<template>
  <div class="w-full">
    <div class="flex items-center justify-between mb-3">
      <label class="text-sm font-semibold text-surface-700">
        Speed
      </label>
      <span class="text-sm font-medium text-primary-600 bg-primary-50 px-3 py-1 rounded-full">
        {{ modelValue }}x — {{ currentSpeedLabel }}
      </span>
    </div>
    
    <!-- Slider -->
    <div class="relative pt-1">
      <input
        v-model.number="speedValue"
        type="range"
        :min="0.5"
        :max="2.0"
        :step="0.25"
        class="w-full h-2 bg-surface-200 rounded-lg appearance-none cursor-pointer accent-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
      />
      
      <!-- Tick marks -->
      <div class="flex justify-between mt-2 text-xs text-surface-400">
        <span>0.5x</span>
        <span>1.0x</span>
        <span>1.5x</span>
        <span>2.0x</span>
      </div>
    </div>

    <!-- Preset buttons -->
    <div class="flex flex-wrap gap-2 mt-4">
      <button
        v-for="speed in speeds"
        :key="speed.value"
        @click="emit('update:modelValue', speed.value)"
        class="px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-200"
        :class="{
          'bg-primary-100 text-primary-700 ring-2 ring-primary-500': modelValue === speed.value,
          'bg-surface-100 text-surface-600 hover:bg-surface-200': modelValue !== speed.value,
        }"
      >
        {{ speed.label }}
      </button>
    </div>
  </div>
</template>
