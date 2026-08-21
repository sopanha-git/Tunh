<script setup lang="ts">
import { motion } from 'motion-v'

const navItems = [
  { label: 'Dashboard', icon: 'M3 12l9-9 9 9M5 10v10a1 1 0 001 1h4v-6h4v6h4a1 1 0 001-1V10', active: true },
  { label: 'Voice Generation', icon: 'M11 5a7 7 0 100 14M15.5 8.5a4.5 4.5 0 010 7M12 8a2 2 0 000 8', active: false },
  { label: 'Characters', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z', active: false },
  { label: 'Analytics', icon: 'M3 3v18h18M8 17v-6M13 17V7M18 17v-4', active: false },
  { label: 'Settings', icon: 'M10.3 4.3a1.5 1.5 0 012.9.4l.1 1a6 6 0 012.3 1.3l1-.3a1.5 1.5 0 011.9 2.2l-.7.8a6 6 0 010 2.6l.7.8a1.5 1.5 0 01-1.9 2.2l-1-.3a6 6 0 01-2.3 1.3l-.1 1a1.5 1.5 0 01-2.9 0l-.1-1a6 6 0 01-2.3-1.3l-1 .3a1.5 1.5 0 01-1.9-2.2l.7-.8a6 6 0 010-2.6l-.7-.8a1.5 1.5 0 011.9-2.2l1 .3a6 6 0 012.3-1.3l.1-1z', active: false },
  { label: 'History', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z', active: false },
]

const sidebarOpen = ref(false)
</script>

<template>
  <div class="min-h-screen bg-surface-100">
    <!-- Mobile overlay -->
    <Transition name="fade">
      <div v-if="sidebarOpen" class="fixed inset-0 z-30 bg-black/50 lg:hidden" @click="sidebarOpen = false" />
    </Transition>

    <!-- Sidebar -->
    <aside
      class="fixed inset-y-0 left-0 z-40 w-64 bg-surface-900 text-surface-200 transition-transform duration-300 lg:translate-x-0"
      :class="sidebarOpen ? 'translate-x-0' : '-translate-x-full'"
    >
      <div class="flex h-full flex-col">
        <div class="flex h-16 items-center gap-3 border-b border-white/10 px-6">
          <div class="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-600 font-bold text-white">
            T
          </div>
          <div>
            <p class="text-sm font-semibold text-white">Tunh Admin</p>
            <p class="text-xs text-surface-400">Control Center</p>
          </div>
        </div>

        <nav class="flex-1 space-y-1 px-3 py-4">
          <motion.div
            v-for="(item, i) in navItems"
            :key="item.label"
            :initial="{ opacity: 0, x: -16 }"
            :animate="{ opacity: 1, x: 0 }"
            :transition="{ delay: 0.03 * i, duration: 0.4 }"
          >
            <button
              class="group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors"
              :class="item.active
                ? 'bg-primary-600 text-white'
                : 'text-surface-300 hover:bg-white/5 hover:text-white'"
            >
              <svg class="h-5 w-5 shrink-0" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" :d="item.icon" />
              </svg>
              {{ item.label }}
              <span
                v-if="item.label === 'History'"
                class="ml-auto rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-semibold"
              >12</span>
            </button>
          </motion.div>
        </nav>

        <div class="border-t border-white/10 p-4">
          <div class="flex items-center gap-3">
            <div class="flex h-9 w-9 items-center justify-center rounded-full bg-primary-500 text-sm font-semibold text-white">
              SM
            </div>
            <div class="min-w-0">
              <p class="truncate text-sm font-semibold text-white">Sopanha Men</p>
              <p class="text-xs text-surface-400">Administrator</p>
            </div>
          </div>
        </div>
      </div>
    </aside>

    <!-- Main column -->
    <div class="lg:pl-64">
      <!-- Topbar -->
      <header class="sticky top-0 z-20 flex h-16 items-center gap-4 border-b border-surface-200 bg-white/80 px-4 backdrop-blur lg:px-8">
        <button class="rounded-lg p-2 text-surface-500 hover:bg-surface-100 lg:hidden" @click="sidebarOpen = true">
          <svg class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <div class="relative hidden max-w-md flex-1 sm:block">
          <svg class="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-surface-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" d="M21 21l-4.3-4.3M17 10a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search anything..."
            class="w-full rounded-xl border border-surface-300 bg-white py-2 pl-9 pr-3 text-sm shadow-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-0"
          />
        </div>

        <div class="ml-auto flex items-center gap-2">
          <button class="relative rounded-lg p-2 text-surface-500 hover:bg-surface-100">
            <svg class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15 17h5l-1.4-1.4A2 2 0 0118 14.2V11a6 6 0 10-12 0v3.2a2 2 0 01-.6 1.4L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <span class="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-primary-500" />
          </button>
          <div class="hidden h-5 w-px bg-surface-200 sm:block" />
          <div class="flex h-9 w-9 items-center justify-center rounded-full bg-primary-600 text-sm font-semibold text-white">
            SM
          </div>
        </div>
      </header>

      <main class="p-4 lg:p-8">
        <slot />
      </main>
    </div>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>