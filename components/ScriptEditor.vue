<script setup lang="ts">
interface Props {
  modelValue: string
  maxLength?: number
}

interface Emits {
  (e: 'update:modelValue', value: string): void
  (e: 'clear'): void
}

const props = withDefaults(defineProps<Props>(), {
  maxLength: 5000,
})

const emit = defineEmits<Emits>()

// Character and word count
const characterCount = computed(() => props.modelValue.length)
const wordCount = computed(() => {
  const words = props.modelValue.trim().split(/\s+/)
  return props.modelValue.trim() ? words.length : 0
})

// Check if near limit
const isNearLimit = computed(() => characterCount.value > props.maxLength * 0.9)
const isOverLimit = computed(() => characterCount.value > props.maxLength)

// Update text
const updateText = (event: Event) => {
  const target = event.target as HTMLTextAreaElement
  emit('update:modelValue', target.value)
}

// Clear text
const clearText = () => {
  emit('update:modelValue', '')
  emit('clear')
}

// Textarea ref for focus
const textareaRef = ref<HTMLTextAreaElement>()
const focus = () => {
  textareaRef.value?.focus()
}

defineExpose({ focus, clearText })
</script>

<template>
  <div class="w-full">
    <!-- Label and counter -->
    <div class="flex items-center justify-between mb-3">
      <label class="eyebrow">Script</label>
      <div class="flex items-center gap-2 hud">
        <span :class="{ 'text-amber-400': isNearLimit && !isOverLimit, 'text-red-400': isOverLimit }">
          {{ characterCount.toLocaleString() }}/{{ maxLength.toLocaleString() }}
        </span>
        <span class="text-faint">·</span>
        <span>{{ wordCount.toLocaleString() }} words</span>
      </div>
    </div>

    <!-- Teleprompter -->
    <div class="relative">
      <textarea
        ref="textareaRef"
        :value="modelValue"
        @input="updateText"
        rows="8"
        :maxlength="maxLength"
        placeholder="Type the words you want spoken…&#10;&#10;Hello everyone, welcome back. Today we're talking about something worth hearing."
        class="w-full px-5 py-4 text-lg leading-relaxed text-text bg-booth/60 border border-line rounded-xl resize-y min-h-[210px] transition-colors duration-200 placeholder:text-faint focus:border-accent focus:outline-none"
        :class="{ 'border-red-500/60': isOverLimit }"
      />

      <button
        v-if="modelValue"
        @click="clearText"
        class="absolute top-3 right-3 p-1.5 text-muted hover:text-text rounded-lg transition-colors"
        title="Clear text"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>

    <!-- Level meter -->
    <div class="mt-2.5 h-0.5 bg-line rounded-full overflow-hidden">
      <div
        class="h-full transition-all duration-300 rounded-full"
        :class="{
          'bg-accent': !isNearLimit && !isOverLimit,
          'bg-amber-400': isNearLimit && !isOverLimit,
          'bg-red-500': isOverLimit,
        }"
        :style="{ width: `${Math.min((characterCount / maxLength) * 100, 100)}%` }"
      />
    </div>

    <p class="mt-3 text-xs text-muted">
      Tip: use punctuation for natural pauses — commas breathe, periods land.
    </p>
  </div>
</template>
