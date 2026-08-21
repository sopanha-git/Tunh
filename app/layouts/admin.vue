<script setup lang="ts">
import { AudioLines, Bell, Gauge, History, LayoutDashboard, Menu, Mic2, Search, Settings, Users, X } from 'lucide-vue-next'

const route = useRoute()
const sidebarOpen = ref(false)
const navItems = [
  { label: 'Dashboard', icon: LayoutDashboard, to: '/admin' },
  { label: 'Voice desk', icon: Mic2, to: '/' },
  { label: 'Characters', icon: Users, to: '/admin#characters' },
  { label: 'Analytics', icon: Gauge, to: '/admin#analytics' },
  { label: 'History', icon: History, to: '/admin#history' },
  { label: 'Settings', icon: Settings, to: '/admin#settings' },
]
const { user, clear } = useUserSession()
const initials = computed(() => user.value?.name?.split(' ').map(part => part[0]).join('').slice(0, 2) || 'TA')
async function logout() { await $fetch('/api/auth/logout', { method: 'POST' }); await clear(); await navigateTo('/login') }
</script>

<template>
  <div class="min-h-screen">
    <div v-if="sidebarOpen" class="fixed inset-0 z-30 bg-surface-950/60 lg:hidden" @click="sidebarOpen = false" />
    <!-- Equipment rack -->
    <aside class="fixed inset-y-0 left-0 z-40 w-64 border-r border-black/60 bg-gradient-to-b from-surface-900 to-surface-950 text-surface-300 transition-transform lg:translate-x-0" :class="sidebarOpen ? 'translate-x-0' : '-translate-x-full'">
      <div class="flex h-full flex-col">
        <div class="flex h-16 items-center justify-between border-b border-white/5 px-5">
          <NuxtLink to="/" class="flex items-center gap-3">
            <span class="grid size-9 place-items-center rounded-lg text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.3)]" style="background:linear-gradient(180deg,#f0672e,#cb440f)"><AudioLines :size="19" /></span>
            <span class="flex flex-col leading-none">
              <span class="font-display text-base font-bold tracking-[0.2em] text-surface-50">TUNH</span>
              <span class="mt-0.5 font-mono text-[0.55rem] tracking-[0.24em] text-surface-500">CONTROL RACK</span>
            </span>
          </NuxtLink>
          <button class="rounded-lg p-1 text-surface-400 hover:text-white lg:hidden" aria-label="Close menu" @click="sidebarOpen = false"><X :size="20" /></button>
        </div>
        <nav class="flex-1 space-y-1 p-3">
          <p class="px-3 pb-2 pt-3 font-mono text-[0.58rem] font-medium uppercase tracking-[0.2em] text-surface-500">Workspace</p>
          <NuxtLink
            v-for="item in navItems" :key="item.label" :to="item.to"
            class="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors"
            :class="route.path === item.to && !item.to.includes('#') ? 'bg-gradient-to-b from-primary-500 to-primary-600 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.25)]' : 'text-surface-300 hover:bg-white/5 hover:text-white'"
            @click="sidebarOpen = false"
          ><component :is="item.icon" :size="19" />{{ item.label }}</NuxtLink>
        </nav>
        <div class="border-t border-white/5 p-4">
          <div class="mb-3 flex items-center gap-3">
            <span class="grid size-9 place-items-center rounded-full bg-white/10 font-mono text-xs font-bold text-white">{{ initials }}</span>
            <div class="min-w-0"><p class="truncate text-sm font-semibold text-surface-50">{{ user?.name }}</p><p class="truncate font-mono text-[0.65rem] text-surface-500">{{ user?.email }}</p></div>
          </div>
          <button class="w-full rounded-lg border border-white/10 px-3 py-2 text-left font-mono text-[0.7rem] uppercase tracking-[0.14em] text-surface-300 hover:bg-white/5 hover:text-white" @click="logout">Sign out</button>
        </div>
      </div>
    </aside>

    <div class="lg:pl-64">
      <header class="sticky top-0 z-20 flex h-16 items-center gap-4 border-b border-surface-300 bg-gradient-to-b from-surface-50 to-surface-100 px-4 shadow-[0_1px_0_rgba(255,255,255,0.7)] lg:px-8">
        <button class="keycap p-2 text-surface-600 lg:hidden" aria-label="Open menu" @click="sidebarOpen = true"><Menu :size="20" /></button>
        <label class="relative hidden max-w-sm flex-1 sm:block"><Search class="absolute left-3 top-2.5 text-surface-400" :size="18" /><input class="input-field pl-10" placeholder="Search workspace" /></label>
        <button class="keycap relative ml-auto p-2 text-surface-600" aria-label="Notifications"><Bell :size="19" /><span class="absolute right-1.5 top-1 size-1.5 rounded-full bg-primary-500 shadow-[0_0_5px_#e7541d]" /></button>
        <span class="grid size-9 place-items-center rounded-full bg-primary-100 font-mono text-xs font-bold text-primary-700">{{ initials }}</span>
      </header>
      <main class="p-4 sm:p-6 lg:p-8"><slot /></main>
    </div>
  </div>
</template>
