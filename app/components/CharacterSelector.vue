<script setup lang="ts">
import { UserRound, UserRoundCheck } from 'lucide-vue-next'
import { characters } from '~/composables/useVoiceSettings'
import type { VoiceCharacter } from '~/types'
defineProps<{ modelValue: VoiceCharacter }>()
const emit = defineEmits<{ 'update:modelValue': [value: VoiceCharacter] }>()
</script>
<template>
  <div>
    <p class="engrave mb-3">Voice</p>
    <div class="grid grid-cols-2 gap-3">
      <button
        v-for="character in characters" :key="character.id"
        class="keycap p-3 text-left" :data-on="modelValue === character.id"
        @click="emit('update:modelValue', character.id)"
      >
        <component :is="modelValue === character.id ? UserRoundCheck : UserRound" :size="20" class="mb-3" />
        <span class="block font-display text-sm font-semibold">{{ character.label }}</span>
        <span class="mt-0.5 block text-xs text-surface-500">{{ character.description }}</span>
      </button>
    </div>
  </div>
</template>
