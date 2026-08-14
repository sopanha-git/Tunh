<script setup lang="ts">
interface Props {
  message: string | null
}

const props = defineProps<Props>()
</script>

<template>
  <div
    v-if="message"
    class="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-xl"
  >
    <svg class="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
    <p class="text-sm text-red-700">{{ message }}</p>
  </div>
</template>
