<script setup lang="ts">
import { Cloud, Server } from 'lucide-vue-next'
import { models } from '~/composables/useVoiceSettings'
import type { VoiceModel } from '~/types'
defineProps<{ modelValue: VoiceModel }>()
const emit = defineEmits<{ 'update:modelValue': [value: VoiceModel] }>()
</script>
<template>
  <div>
    <p class="engrave mb-3">Engine</p>
    <div class="grid grid-cols-2 gap-3">
      <button
        v-for="model in models" :key="model.id"
        class="keycap p-3 text-left" :data-on="modelValue === model.id"
        @click="emit('update:modelValue', model.id)"
      >
        <div class="mb-3 flex items-center justify-between">
          <component :is="model.kind === 'cloud' ? Cloud : Server" :size="20" />
          <span class="hud text-[0.55rem] text-surface-400">{{ model.kind === 'cloud' ? 'CLOUD' : 'LOCAL' }}</span>
        </div>
        <span class="block font-display text-sm font-semibold">{{ model.label }}</span>
        <span class="mt-0.5 block text-xs text-surface-500">{{ model.description }}</span>
      </button>
    </div>
  </div>
</template>
