<script setup lang="ts">
import { motion } from 'motion-v'

definePageMeta({ layout: 'admin' })

useHead({ title: 'Dashboard · Tunh Admin' })

/* ---------- Mock data (dashboard demo) ---------- */
const stats = [
  { label: 'Total Generations', value: '12,482', delta: '+12.5%', up: true, icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
  { label: 'Active Users', value: '1,204', delta: '+4.2%', up: true, icon: 'M17 20h5v-2a3 3 0 00-5.4-1.7M21 20v-2a3 3 0 00-2-2.8M13 16a3 3 0 100-6 3 3 0 000 6zM7 20v-2a3 3 0 013-3h2a3 3 0 013 3v2' },
  { label: 'Avg. Audio Length', value: '42.6s', delta: '-3.1%', up: false, icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
  { label: 'API Success Rate', value: '99.2%', delta: '+0.4%', up: true, icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
]

const chartBars = [
  { label: 'Mon', value: 45 },
  { label: 'Tue', value: 62 },
  { label: 'Wed', value: 38 },
  { label: 'Thu', value: 74 },
  { label: 'Fri', value: 56 },
  { label: 'Sat', value: 88 },
  { label: 'Sun', value: 50 },
]

const recentActivity = [
  { user: 'Sopanha Men', action: 'Generated Khmer voice', time: '2m ago', status: 'success' },
  { user: 'Dara Kim', action: 'Created female character', time: '8m ago', status: 'success' },
  { user: 'Channary', action: 'Export failed — timeout', time: '21m ago', status: 'error' },
  { user: 'Rithy Sok', action: 'Generated English narration', time: '35m ago', status: 'success' },
  { user: 'Vannak', action: 'Updated voice settings', time: '1h ago', status: 'success' },
]
</script>

<template>
  <div class="space-y-6">
    <!-- Page header -->
    <motion.div
      :initial="{ opacity: 0, y: 12 }"
      :animate="{ opacity: 1, y: 0 }"
      :transition="{ duration: 0.4 }"
    >
      <h1 class="text-2xl font-bold text-surface-900">Dashboard</h1>
      <p class="mt-1 text-sm text-surface-500">Welcome back — here's what's happening in your workspace today.</p>
    </motion.div>

    <!-- Stat cards -->
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <motion.div
        v-for="(s, i) in stats"
        :key="s.label"
        :initial="{ opacity: 0, y: 16 }"
        :animate="{ opacity: 1, y: 0 }"
        :transition="{ delay: 0.05 * i, duration: 0.4 }"
        class="card p-5 transition-shadow hover:shadow-md"
      >
        <div class="flex items-start justify-between">
          <div>
            <p class="text-sm font-medium text-surface-500">{{ s.label }}</p>
            <p class="mt-2 text-3xl font-bold text-surface-900">{{ s.value }}</p>
          </div>
          <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
            <svg class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" :d="s.icon" />
            </svg>
          </div>
        </div>
        <p class="mt-3 flex items-center gap-1 text-xs" :class="s.up ? 'text-emerald-600' : 'text-rose-600'">
          <svg v-if="s.up" class="h-3.5 w-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" d="M5 15l7-7 7 7" /></svg>
          <svg v-else class="h-3.5 w-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" d="M19 9l-7 7-7-7" /></svg>
          <span class="font-semibold">{{ s.delta }}</span>
          <span class="ml-1 text-surface-400">vs last week</span>
        </p>
      </motion.div>
    </div>

    <!-- Charts row -->
    <div class="grid grid-cols-1 gap-4 lg:grid-cols-3">
      <!-- Bar chart -->
      <motion.section
        :initial="{ opacity: 0, y: 20 }"
        :animate="{ opacity: 1, y: 0 }"
        :transition="{ delay: 0.2, duration: 0.4 }"
        class="card p-6 lg:col-span-2"
      >
        <header class="mb-5 flex items-center justify-between">
          <div>
            <h2 class="font-semibold text-surface-900">Generation Volume</h2>
            <p class="text-xs text-surface-500">Last 7 days</p>
          </div>
          <span class="rounded-full bg-primary-50 px-3 py-1 text-xs font-medium text-primary-600">Weekly</span>
        </header>
        <div class="flex h-48 items-end gap-3">
          <motion.div
            v-for="(b, i) in chartBars"
            :key="b.label"
            class="group flex flex-1 flex-col items-center gap-2"
            :initial="{ opacity: 0, y: 20 }"
            :animate="{ opacity: 1, y: 0 }"
            :transition="{ delay: 0.25 + 0.06 * i, duration: 0.5 }"
          >
            <div class="flex w-full flex-1 items-end justify-center rounded-t-lg bg-primary-100 transition-colors group-hover:bg-primary-200"
                 :style="{ height: b.value + '%' }">
              <div class="w-full rounded-t-lg bg-gradient-to-t from-primary-600 to-primary-400" :style="{ height: '100%' }" />
            </div>
            <span class="text-xs font-medium text-surface-400">{{ b.label }}</span>
          </motion.div>
        </div>
      </motion.section>

      <!-- Donut-ish summary card -->
      <motion.section
        :initial="{ opacity: 0, y: 20 }"
        :animate="{ opacity: 1, y: 0 }"
        :transition="{ delay: 0.28, duration: 0.4 }"
        class="card p-6"
      >
        <h2 class="font-semibold text-slate-900">Voice Types</h2>
        <p class="text-xs text-surface-400">Distribution by character</p>
        <div class="mt-6 flex items-center justify-center">
          <div class="relative flex h-40 w-40 items-center justify-center rounded-full"
               style="background: conic-gradient(#2563eb 0 62%, #60a5fa 62% 86%, #93c5fd 86% 100%)">
            <div class="flex h-28 w-28 flex-col items-center justify-center rounded-full bg-white">
              <span class="text-2xl font-bold text-slate-900">62%</span>
              <span class="text-xs text-surface-400">Female</span>
            </div>
          </div>
        </div>
        <ul class="mt-6 space-y-2 text-sm">
          <li class="flex items-center justify-between"><span class="flex items-center gap-2"><span class="h-2.5 w-2.5 rounded-full bg-primary-600" />Female</span><span class="font-medium">62%</span></li>
          <li class="flex items-center justify-between"><span class="flex items-center gap-2"><span class="h-2.5 w-2.5 rounded-full bg-primary-400" />Male</span><span class="font-medium">24%</span></li>
          <li class="flex items-center justify-between"><span class="flex items-center gap-2"><span class="h-2.5 w-2.5 rounded-full bg-primary-200" />Neutral</span><span class="font-medium">14%</span></li>
        </ul>
      </motion.section>
    </div>

    <!-- Recent activity table -->
    <motion.section
      :initial="{ opacity: 0, y: 20 }"
      :animate="{ opacity: 1, y: 0 }"
      :transition="{ delay: 0.34, duration: 0.4 }"
      class="card overflow-hidden"
    >
      <header class="flex items-center justify-between px-6 pt-6">
        <div>
          <h2 class="font-semibold text-slate-900">Recent Activity</h2>
          <p class="text-xs text-surface-400">Latest actions in the workspace</p>
        </div>
        <button class="btn-secondary py-1.5 text-xs">View all</button>
      </header>
      <div class="overflow-x-auto">
        <table class="mt-4 w-full text-left text-sm">
          <thead>
            <tr class="border-y border-surface-100 bg-surface-50/60 text-xs uppercase tracking-wide text-surface-400">
              <th class="px-6 py-3 font-semibold">User</th>
              <th class="px-6 py-3 font-semibold">Action</th>
              <th class="px-6 py-3 font-semibold">Time</th>
              <th class="px-6 py-3 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-surface-100">
            <motion.tr
              v-for="(a, i) in recentActivity"
              :key="a.user"
              :initial="{ opacity: 0, x: -8 }"
              :animate="{ opacity: 1, x: 0 }"
              :transition="{ delay: 0.38 + 0.05 * i, duration: 0.35 }"
            >
              <td class="px-6 py-3 font-medium text-slate-800">{{ a.user }}</td>
              <td class="px-6 py-3 text-surface-500">{{ a.action }}</td>
              <td class="px-6 py-3 text-surface-400">{{ a.time }}</td>
              <td class="px-6 py-3">
                <span
                  class="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium"
                  :class="a.status === 'error' ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-600'"
                >
                  <span class="h-1.5 w-1.5 rounded-full" :class="a.status === 'error' ? 'bg-rose-500' : 'bg-emerald-500'" />
                  {{ a.status === 'error' ? 'Failed' : 'Success' }}
                </span>
              </td>
            </motion.tr>
          </tbody>
        </table>
      </div>
    </motion.section>
  </div>
</template>