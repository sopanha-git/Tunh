<script setup lang="ts">
import { emotions } from '~/composables/useVoiceSettings'
import type { VoiceEmotion } from '~/types'

interface Props {
  modelValue: VoiceEmotion
}
interface Emits {
  (e: 'update:modelValue', value: VoiceEmotion): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const selectEmotion = (id: VoiceEmotion) => emit('update:modelValue', id)

const current = computed(() => emotions.find((e) => e.id === props.modelValue))
</script>

<template>
  <div class="w-full">
    <div class="flex items-center justify-between mb-3">
      <label class="eyebrow">Emotion</label>
      <span class="hud text-accent">{{ current?.label }}</span>
    </div>

    <!-- Spectrum tuner: 12 signal hues, the active one lit and raised. -->
    <div class="spectrum">
      <button
        v-for="emotion in emotions"
        :key="emotion.id"
        :title="emotion.label"
        :aria-label="emotion.label"
        :aria-pressed="modelValue === emotion.id"
        @click="selectEmotion(emotion.id)"
        class="tuner"
        :style="{ '--c': emotion.color }"
      >
        <span class="tick" :class="{ on: modelValue === emotion.id }" />
      </button>
    </div>

    <!-- Readout for the tuned emotion -->
    <div class="mt-4 flex items-center gap-3">
      <span
        class="grid place-items-center w-11 h-11 rounded-xl text-xl shrink-0"
        :style="{
          background: 'color-mix(in srgb, var(--accent) 16%, transparent)',
          border: '1px solid color-mix(in srgb, var(--accent) 40%, transparent)',
        }"
      >
        {{ current?.icon }}
      </span>
      <div class="min-w-0">
        <p class="font-display font-semibold text-sm text-text leading-tight">{{ current?.label }}</p>
        <p class="text-xs text-muted truncate">{{ current?.description }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.spectrum {
  display: flex;
  align-items: flex-end;
  gap: 4px;
  height: 64px;
  padding: 0 2px;
}
.tuner {
  flex: 1;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  height: 100%;
}
.tick {
  width: 100%;
  height: 38%;
  border-radius: 6px;
  background: color-mix(in srgb, var(--c) 42%, transparent);
  transition: height 260ms ease, background 260ms ease, box-shadow 260ms ease;
}
.tuner:hover .tick {
  height: 66%;
  background: color-mix(in srgb, var(--c) 70%, transparent);
}
.tick.on {
  height: 100%;
  background: var(--c);
  box-shadow: 0 0 16px -2px var(--c);
}
@media (prefers-reduced-motion: reduce) {
  .tick { transition: none; }
}
</style>
