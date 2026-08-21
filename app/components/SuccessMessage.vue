<script setup lang="ts">
import { CircleCheck } from 'lucide-vue-next'
defineProps<{ message: string }>()
</script>
<template>
  <div class="flex items-center gap-3 rounded-xl border border-emerald-300 bg-emerald-50 p-4 text-sm font-medium text-emerald-800 shadow-[inset_0_1px_0_rgba(255,255,255,0.6)]">
    <span class="grid size-8 shrink-0 place-items-center rounded-lg bg-emerald-100 text-emerald-600"><CircleCheck :size="18" /></span>
    {{ message }}
  </div>
</template>
