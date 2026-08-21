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
  <div><div class="mb-3 flex items-center justify-between"><label class="text-sm font-semibold text-surface-700">Emotion</label><span class="text-xs font-semibold text-primary-600">{{ current?.label }}</span></div><div class="grid grid-cols-4 gap-2"><button v-for="emotion in emotions" :key="emotion.id" class="key flex min-h-16 flex-col items-center justify-center gap-1.5 p-2 text-center" :data-on="modelValue === emotion.id" :title="emotion.description" @click="emit('update:modelValue', emotion.id)"><component :is="icons[emotion.id]" :size="18" /><span class="text-[.68rem] font-semibold">{{ emotion.label }}</span></button></div></div>
</template>
