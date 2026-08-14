<script setup lang="ts">
import { characters } from '~/composables/useVoiceSettings'
import type { VoiceCharacter } from '~/types'

interface Props {
  modelValue: VoiceCharacter
}

interface Emits {
  (e: 'update:modelValue', value: VoiceCharacter): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const selectCharacter = (characterId: VoiceCharacter) => {
  emit('update:modelValue', characterId)
}
</script>

<template>
  <div class="w-full">
    <label class="block text-sm font-semibold text-surface-700 mb-3">
      Character
    </label>
    
    <div class="grid grid-cols-2 gap-3">
      <button
        v-for="character in characters"
        :key="character.id"
        @click="selectCharacter(character.id)"
        class="relative flex flex-col items-center p-4 border-2 rounded-xl transition-all duration-200"
        :class="{
          'border-primary-500 bg-primary-50': modelValue === character.id,
          'border-surface-200 bg-white hover:border-surface-300': modelValue !== character.id,
        }"
      >
        <!-- Selection indicator -->
        <div
          v-if="modelValue === character.id"
          class="absolute top-2 right-2 w-5 h-5 bg-primary-500 rounded-full flex items-center justify-center"
        >
          <svg class="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <!-- Icon -->
        <span class="text-3xl mb-2">{{ character.icon }}</span>
        
        <!-- Label -->
        <span
          class="font-semibold text-sm"
          :class="modelValue === character.id ? 'text-primary-700' : 'text-surface-700'"
        >
          {{ character.label }}
        </span>
        
        <!-- Description -->
        <span class="text-xs text-surface-500 mt-1">{{ character.description }}</span>
      </button>
    </div>
  </div>
</template>
