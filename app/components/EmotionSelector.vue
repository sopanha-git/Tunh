<script setup lang="ts">
import { Annoyed, BicepsFlexed, Flame, Frown, Heart, Laugh, Meh, PartyPopper, ShieldCheck, Smile, Sparkles, Waves } from 'lucide-vue-next'
import { emotions } from '~/composables/useVoiceSettings'
import type { VoiceEmotion } from '~/types'
const props = defineProps<{ modelValue: VoiceEmotion }>()
const emit = defineEmits<{ 'update:modelValue': [value: VoiceEmotion] }>()
const icons = { neutral: Meh, happy: Smile, sad: Frown, angry: Flame, excited: PartyPopper, calm: Waves, friendly: Laugh, serious: Annoyed, fearful: ShieldCheck, romantic: Heart, confident: BicepsFlexed, energetic: Sparkles }
const current = computed(() => emotions.find(item => item.id === props.modelValue))
</script>
<template>
  <div>
    <div class="mb-3 flex items-center justify-between">
      <p class="engrave">Tone</p>
      <span class="readout px-2.5 py-1 text-[0.7rem]" :style="{ color: current?.color }">{{ current?.label }}</span>
    </div>
    <div class="grid grid-cols-4 gap-2">
      <button
        v-for="emotion in emotions" :key="emotion.id"
        class="keycap flex min-h-16 flex-col items-center justify-center gap-1.5 p-2 text-center"
        :data-on="modelValue === emotion.id" :title="emotion.description"
        :style="modelValue === emotion.id ? { '--accent': emotion.color } : {}"
        @click="emit('update:modelValue', emotion.id)"
      >
        <component :is="icons[emotion.id]" :size="18" />
        <span class="font-mono text-[0.62rem] font-medium uppercase tracking-wide">{{ emotion.label }}</span>
      </button>
    </div>
  </div>
</template>
