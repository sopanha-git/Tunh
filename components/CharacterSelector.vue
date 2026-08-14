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
    <label class="eyebrow block mb-3">Character</label>

    <div class="grid grid-cols-2 gap-3">
      <button
        v-for="character in characters"
        :key="character.id"
        :data-on="modelValue === character.id"
        @click="selectCharacter(character.id)"
        class="key flex items-center gap-3 p-3.5 text-left"
      >
        <span class="text-2xl leading-none">{{ character.icon }}</span>
        <span class="min-w-0">
          <span
            class="block font-display font-semibold text-sm"
            :class="modelValue === character.id ? 'text-accent' : 'text-text'"
          >
            {{ character.label }}
          </span>
          <span class="block text-xs text-muted truncate">{{ character.description }}</span>
        </span>
      </button>
    </div>
  </div>
</template>
