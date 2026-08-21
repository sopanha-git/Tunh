<script setup lang="ts">
interface Props {
  message: string
}

const props = defineProps<Props>()
</script>

<template>
  <div
    class="flex items-center gap-3 p-4 rounded-xl"
    :style="{
      border: '1px solid color-mix(in srgb, var(--accent) 40%, transparent)',
      background: 'color-mix(in srgb, var(--accent) 10%, transparent)',
    }"
  >
    <svg class="w-5 h-5 text-accent flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
    <p class="text-sm text-text">{{ message }}</p>
  </div>
</template>
