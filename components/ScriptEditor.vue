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
      <label class="text-sm font-semibold text-surface-700">
        Script
      </label>
      <div class="flex items-center gap-3 text-xs text-surface-500">
        <span :class="{ 'text-amber-600 font-medium': isNearLimit, 'text-red-600 font-medium': isOverLimit }">
          {{ characterCount.toLocaleString() }} / {{ maxLength.toLocaleString() }} characters
        </span>
        <span class="text-surface-400">|</span>
        <span>{{ wordCount.toLocaleString() }} words</span>
      </div>
    </div>

    <!-- Textarea -->
    <div class="relative">
      <textarea
        ref="textareaRef"
        :value="modelValue"
        @input="updateText"
        rows="8"
        :maxlength="maxLength"
        placeholder="Enter your script here...&#10;&#10;Example:&#10;Hello everyone, welcome to our channel. Today we are going to talk about an exciting new topic."
        class="w-full px-4 py-4 text-base text-surface-900 bg-white border border-surface-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-y min-h-[200px] transition-all duration-200 placeholder:text-surface-400"
        :class="{ 'border-red-300 focus:border-red-500 focus:ring-red-500': isOverLimit }"
      />
      
      <!-- Clear button -->
      <button
        v-if="modelValue"
        @click="clearText"
        class="absolute top-3 right-3 p-1.5 text-surface-400 hover:text-surface-600 hover:bg-surface-100 rounded-lg transition-all duration-200"
        title="Clear text"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>

    <!-- Progress bar -->
    <div class="mt-2 h-1 bg-surface-200 rounded-full overflow-hidden">
      <div
        class="h-full transition-all duration-300 rounded-full"
        :class="{
          'bg-primary-500': !isNearLimit && !isOverLimit,
          'bg-amber-500': isNearLimit && !isOverLimit,
          'bg-red-500': isOverLimit,
        }"
        :style="{ width: `${Math.min((characterCount / maxLength) * 100, 100)}%` }"
      />
    </div>

    <!-- Hint -->
    <p class="mt-2 text-xs text-surface-500">
      Tip: Use [Emotion] tags to apply different emotions to specific phrases. Example: [Excited] Wow! [Calm] Let's relax.
    </p>
  </div>
</template>
