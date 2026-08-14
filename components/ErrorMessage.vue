<script setup lang="ts">
interface Props {
  message: string | null
}

const props = defineProps<Props>()
</script>

<template>
  <div
    v-if="message"
    class="flex items-start gap-3 p-4 rounded-xl border border-red-500/40 bg-red-500/10"
  >
    <svg class="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
    <div>
      <p class="hud text-red-400 mb-0.5">Fault</p>
      <p class="text-sm text-red-200">{{ message }}</p>
    </div>
  </div>
</template>
