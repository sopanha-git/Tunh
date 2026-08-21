<script setup lang="ts">import { CircleCheck } from 'lucide-vue-next'; defineProps<{ message: string }>()</script>
<template><div class="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-medium text-emerald-800"><CircleCheck :size="20" />{{ message }}</div></template>
