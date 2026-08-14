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

const selectEmotion = (emotionId: VoiceEmotion) => {
  emit('update:modelValue', emotionId)
}

// Group emotions for display
const emotionGroups = [
  emotions.slice(0, 4),   // First row
  emotions.slice(4, 8),   // Second row
  emotions.slice(8, 12),  // Third row
]
</script>

<template>
  <div class="w-full">
    <label class="block text-sm font-semibold text-surface-700 mb-3">
      Emotion
    </label>
    
    <div class="space-y-2">
      <div
        v-for="(group, groupIndex) in emotionGroups"
        :key="groupIndex"
        class="grid grid-cols-4 gap-2"
      >
        <button
          v-for="emotion in group"
          :key="emotion.id"
          @click="selectEmotion(emotion.id)"
          class="relative flex flex-col items-center p-3 border-2 rounded-xl transition-all duration-200"
          :class="{
            'border-primary-500 bg-primary-50': modelValue === emotion.id,
            'border-surface-200 bg-white hover:border-surface-300': modelValue !== emotion.id,
          }"
          :title="emotion.description"
        >
          <!-- Icon -->
          <span class="text-2xl mb-1">{{ emotion.icon }}</span>
          
          <!-- Label -->
          <span
            class="text-xs font-medium text-center"
            :class="modelValue === emotion.id ? 'text-primary-700' : 'text-surface-700'"
          >
            {{ emotion.label }}
          </span>
          
          <!-- Active indicator dot -->
          <div
            v-if="modelValue === emotion.id"
            class="absolute -top-1 -right-1 w-3 h-3 bg-primary-500 rounded-full border-2 border-white"
          />
        </button>
      </div>
    </div>
  </div>
</template>
