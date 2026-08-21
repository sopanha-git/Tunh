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
      <label class="eyebrow">Speed</label>
      <span class="readout px-3 py-1 text-xs">
        {{ modelValue.toFixed(2) }}× · {{ currentSpeedLabel }}
      </span>
    </div>

    <div class="relative pt-1">
      <input
        v-model.number="speedValue"
        type="range"
        :min="0.5"
        :max="2.0"
        :step="0.25"
        class="console-range"
      />
      <div class="flex justify-between mt-3 hud text-[0.6rem]">
        <span>0.5×</span>
        <span>1.0×</span>
        <span>1.5×</span>
        <span>2.0×</span>
      </div>
    </div>

    <div class="flex flex-wrap gap-2 mt-4">
      <button
        v-for="speed in speeds"
        :key="speed.value"
        :data-on="modelValue === speed.value"
        @click="emit('update:modelValue', speed.value)"
        class="key px-3 py-1.5 text-xs font-medium"
        :class="modelValue === speed.value ? 'text-accent' : 'text-muted'"
      >
        {{ speed.label }}
      </button>
    </div>
  </div>
</template>
