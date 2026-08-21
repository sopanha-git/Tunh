<script setup lang="ts">
import { UserRound, UserRoundCheck } from 'lucide-vue-next'
import { characters } from '~/composables/useVoiceSettings'
import type { VoiceCharacter } from '~/types'
defineProps<{ modelValue: VoiceCharacter }>()
const emit = defineEmits<{ 'update:modelValue': [value: VoiceCharacter] }>()
</script>
<template>
  <div><label class="mb-3 block text-sm font-semibold text-surface-700">Character</label><div class="grid grid-cols-2 gap-3"><button v-for="character in characters" :key="character.id" class="key p-3 text-left" :data-on="modelValue === character.id" @click="emit('update:modelValue', character.id)"><component :is="modelValue === character.id ? UserRoundCheck : UserRound" :size="20" class="mb-3" /><span class="block text-sm font-semibold">{{ character.label }}</span><span class="mt-1 block text-xs text-surface-500">{{ character.description }}</span></button></div></div>
</template>
