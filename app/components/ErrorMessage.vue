<script setup lang="ts">
import { TriangleAlert } from 'lucide-vue-next'
defineProps<{ message: string | null }>()
</script>
<template>
  <div v-if="message" role="alert" class="flex items-start gap-3 rounded-xl border border-primary-300 bg-primary-50 p-4 text-primary-900 shadow-[inset_0_1px_0_rgba(255,255,255,0.6)]">
    <span class="grid size-8 shrink-0 place-items-center rounded-lg bg-primary-100 text-primary-600"><TriangleAlert :size="18" /></span>
    <div>
      <p class="font-mono text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-primary-700">Fault · generation halted</p>
      <p class="mt-1 text-sm text-primary-900/90">{{ message }}</p>
    </div>
  </div>
</template>
