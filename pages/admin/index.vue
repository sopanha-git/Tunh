<script setup lang="ts">
import { Activity, ArrowDownRight, ArrowRight, ArrowUpRight, CheckCircle2, Clock3, FileAudio, Users, XCircle } from 'lucide-vue-next'
definePageMeta({ layout: 'admin' })
useHead({ title: 'Dashboard · Tunh' })
const stats = [
  { label: 'Total generations', value: '12,482', delta: '12.5%', up: true, icon: FileAudio },
  { label: 'Active users', value: '1,204', delta: '4.2%', up: true, icon: Users },
  { label: 'Average length', value: '42.6s', delta: '3.1%', up: false, icon: Clock3 },
  { label: 'Success rate', value: '99.2%', delta: '0.4%', up: true, icon: Activity },
]
const bars = [{day:'Mon',v:45},{day:'Tue',v:62},{day:'Wed',v:38},{day:'Thu',v:74},{day:'Fri',v:56},{day:'Sat',v:88},{day:'Sun',v:50}]
const activity = [
  ['Sopanha Men','Generated Khmer voice','2m ago','success'], ['Dara Kim','Created female character','8m ago','success'],
  ['Channary','Export failed — timeout','21m ago','error'], ['Rithy Sok','Generated English narration','35m ago','success'],
  ['Vannak','Updated voice settings','1h ago','success'],
]
</script>
<template>
  <div class="mx-auto max-w-7xl space-y-6">
    <header class="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div><p class="text-sm font-semibold text-primary-600">Overview</p><h1 class="mt-1 font-display text-3xl font-semibold tracking-tight">Good morning, Admin</h1><p class="mt-2 text-sm text-surface-500">Here’s how your voice workspace is performing.</p></div><NuxtLink to="/" class="btn-primary">Open voice studio <ArrowRight :size="17" /></NuxtLink></header>
    <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <article v-for="stat in stats" :key="stat.label" class="card p-5"><div class="flex items-start justify-between"><p class="text-sm font-medium text-surface-500">{{ stat.label }}</p><span class="grid size-10 place-items-center rounded-xl bg-primary-50 text-primary-600"><component :is="stat.icon" :size="20" /></span></div><p class="mt-3 text-3xl font-semibold tracking-tight">{{ stat.value }}</p><p class="mt-3 flex items-center gap-1.5 text-xs" :class="stat.up ? 'text-emerald-700' : 'text-red-700'"><component :is="stat.up ? ArrowUpRight : ArrowDownRight" :size="15" /><b>{{ stat.delta }}</b><span class="text-surface-400">from last week</span></p></article>
    </div>
    <div class="grid gap-4 lg:grid-cols-[1.7fr_1fr]">
      <section class="card p-6"><div class="flex items-start justify-between"><div><h2 class="font-semibold">Generation volume</h2><p class="mt-1 text-xs text-surface-500">Last seven days</p></div><span class="rounded-lg bg-surface-100 px-3 py-1.5 text-xs font-semibold text-surface-600">Weekly</span></div><div class="mt-8 flex h-56 items-end gap-3 border-b border-surface-200"><div v-for="bar in bars" :key="bar.day" class="flex h-full flex-1 flex-col items-center justify-end gap-3"><div class="w-full rounded-t-md bg-primary-500" :style="{height: `${bar.v}%`}" /><span class="pb-3 text-xs text-surface-500">{{ bar.day }}</span></div></div></section>
      <section class="card p-6"><h2 class="font-semibold">Voice mix</h2><p class="mt-1 text-xs text-surface-500">By selected character</p><div class="mt-8 space-y-6"><div><div class="mb-2 flex justify-between text-sm"><span>Female</span><b>62%</b></div><div class="h-2 rounded-full bg-surface-100"><div class="h-2 w-[62%] rounded-full bg-primary-600" /></div></div><div><div class="mb-2 flex justify-between text-sm"><span>Male</span><b>24%</b></div><div class="h-2 rounded-full bg-surface-100"><div class="h-2 w-[24%] rounded-full bg-primary-400" /></div></div><div><div class="mb-2 flex justify-between text-sm"><span>Neutral</span><b>14%</b></div><div class="h-2 rounded-full bg-surface-100"><div class="h-2 w-[14%] rounded-full bg-surface-400" /></div></div></div></section>
    </div>
    <section class="card overflow-hidden"><header class="flex items-center justify-between p-6"><div><h2 class="font-semibold">Recent activity</h2><p class="mt-1 text-xs text-surface-500">Latest workspace actions</p></div><button class="btn-secondary py-2">View all</button></header><div class="overflow-x-auto"><table class="w-full text-left text-sm"><thead class="border-y border-surface-200 bg-surface-50 text-xs text-surface-500"><tr><th class="px-6 py-3 font-semibold">User</th><th class="px-6 py-3 font-semibold">Action</th><th class="px-6 py-3 font-semibold">Time</th><th class="px-6 py-3 font-semibold">Status</th></tr></thead><tbody class="divide-y divide-surface-100"><tr v-for="row in activity" :key="row[0]"><td class="px-6 py-4 font-semibold">{{ row[0] }}</td><td class="px-6 py-4 text-surface-600">{{ row[1] }}</td><td class="px-6 py-4 text-surface-500">{{ row[2] }}</td><td class="px-6 py-4"><span class="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold" :class="row[3] === 'error' ? 'bg-red-50 text-red-700' : 'bg-emerald-50 text-emerald-700'"><XCircle v-if="row[3] === 'error'" :size="14" /><CheckCircle2 v-else :size="14" />{{ row[3] === 'error' ? 'Failed' : 'Complete' }}</span></td></tr></tbody></table></div></section>
  </div>
</template>
