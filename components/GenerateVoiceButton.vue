<script setup lang="ts">
interface Props {
  isGenerating: boolean
  isDisabled?: boolean
}

interface Emits {
  (e: 'generate'): void
}

const props = withDefaults(defineProps<Props>(), {
  isDisabled: false,
})

const emit = defineEmits<Emits>()

const handleClick = () => {
  if (!props.isGenerating && !props.isDisabled) {
    emit('generate')
  }
}
</script>

<template>
  <button
    @click="handleClick"
    :disabled="isGenerating || isDisabled"
    class="generate-key group w-full py-4 text-lg font-display font-semibold rounded-2xl flex items-center justify-center gap-3 text-ink transition-all duration-200 disabled:cursor-not-allowed active:translate-y-px"
  >
    <span v-if="isGenerating" class="flex items-center justify-center gap-3">
      <!-- Animated waveform -->
      <svg class="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
        <rect x="4" y="8" width="2" height="8" rx="1" class="animate-pulse">
          <animate attributeName="height" values="8;12;8" dur="0.6s" repeatCount="indefinite" />
          <animate attributeName="y" values="8;6;8" dur="0.6s" repeatCount="indefinite" />
        </rect>
        <rect x="8" y="6" width="2" height="12" rx="1" class="animate-pulse">
          <animate attributeName="height" values="12;6;12" dur="0.5s" repeatCount="indefinite" />
          <animate attributeName="y" values="6;9;6" dur="0.5s" repeatCount="indefinite" />
        </rect>
        <rect x="12" y="4" width="2" height="16" rx="1" class="animate-pulse">
          <animate attributeName="height" values="16;8;16" dur="0.7s" repeatCount="indefinite" />
          <animate attributeName="y" values="4;8;4" dur="0.7s" repeatCount="indefinite" />
        </rect>
        <rect x="16" y="6" width="2" height="12" rx="1" class="animate-pulse">
          <animate attributeName="height" values="12;6;12" dur="0.5s" repeatCount="indefinite" />
          <animate attributeName="y" values="6;9;6" dur="0.5s" repeatCount="indefinite" />
        </rect>
        <rect x="20" y="8" width="2" height="8" rx="1" class="animate-pulse">
          <animate attributeName="height" values="8;12;8" dur="0.6s" repeatCount="indefinite" />
          <animate attributeName="y" values="8;6;8" dur="0.6s" repeatCount="indefinite" />
        </rect>
      </svg>
      Generating Voice...
    </span>
    <span v-else class="flex items-center justify-center gap-3">
      <!-- Microphone icon -->
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
      </svg>
      Generate Voice
    </span>
  </button>
</template>

<style scoped>
.generate-key {
  background: linear-gradient(180deg,
    color-mix(in srgb, var(--accent) 92%, white),
    var(--accent));
  box-shadow:
    0 0 0 1px color-mix(in srgb, var(--accent) 60%, transparent),
    0 18px 40px -18px color-mix(in srgb, var(--accent) 80%, transparent);
}
.generate-key:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow:
    0 0 0 1px color-mix(in srgb, var(--accent) 70%, transparent),
    0 22px 46px -16px color-mix(in srgb, var(--accent) 90%, transparent);
}
.generate-key:disabled {
  background: linear-gradient(180deg, #202832, #1a212a);
  color: var(--faint);
  box-shadow: inset 0 0 0 1px var(--line);
}
</style>
