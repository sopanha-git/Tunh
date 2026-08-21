<script setup lang="ts">
import { AudioLines, Bell, Gauge, History, LayoutDashboard, Menu, Mic2, Search, Settings, Users, X } from 'lucide-vue-next'

const route = useRoute()
const sidebarOpen = ref(false)
const navItems = [
  { label: 'Dashboard', icon: LayoutDashboard, to: '/admin' },
  { label: 'Voice studio', icon: Mic2, to: '/' },
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
  <div class="min-h-screen bg-surface-50">
    <div v-if="sidebarOpen" class="fixed inset-0 z-30 bg-surface-950/50 lg:hidden" @click="sidebarOpen = false" />
    <aside class="fixed inset-y-0 left-0 z-40 w-64 border-r border-surface-800 bg-surface-950 text-surface-300 transition-transform lg:translate-x-0" :class="sidebarOpen ? 'translate-x-0' : '-translate-x-full'">
      <div class="flex h-full flex-col">
        <div class="flex h-17 items-center justify-between border-b border-surface-800 px-5">
          <NuxtLink to="/" class="flex items-center gap-3 text-white"><span class="grid size-9 place-items-center rounded-xl bg-primary-500"><AudioLines :size="19" /></span><span class="font-display text-lg font-bold">Tunh</span></NuxtLink>
          <button class="p-1 lg:hidden" aria-label="Close menu" @click="sidebarOpen = false"><X :size="20" /></button>
        </div>
        <nav class="flex-1 space-y-1 p-3">
          <p class="px-3 pb-2 pt-3 text-[.65rem] font-semibold uppercase tracking-[.18em] text-surface-500">Workspace</p>
          <NuxtLink v-for="item in navItems" :key="item.label" :to="item.to" class="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors hover:bg-surface-800 hover:text-white" :class="route.path === item.to ? 'bg-primary-600 text-white' : ''" @click="sidebarOpen = false"><component :is="item.icon" :size="19" />{{ item.label }}</NuxtLink>
        </nav>
        <div class="border-t border-surface-800 p-4">
          <div class="mb-3 flex items-center gap-3"><span class="grid size-9 place-items-center rounded-full bg-surface-800 text-xs font-bold text-white">{{ initials }}</span><div class="min-w-0"><p class="truncate text-sm font-semibold text-white">{{ user?.name }}</p><p class="truncate text-xs text-surface-500">{{ user?.email }}</p></div></div>
          <button class="w-full rounded-lg border border-surface-700 px-3 py-2 text-left text-xs font-semibold hover:bg-surface-800" @click="logout">Sign out</button>
        </div>
      </div>
    </aside>
    <div class="lg:pl-64">
      <header class="sticky top-0 z-20 flex h-17 items-center gap-4 border-b border-surface-200 bg-white px-4 lg:px-8">
        <button class="rounded-lg p-2 text-surface-600 hover:bg-surface-100 lg:hidden" aria-label="Open menu" @click="sidebarOpen = true"><Menu :size="20" /></button>
        <label class="relative hidden max-w-sm flex-1 sm:block"><Search class="absolute left-3 top-2.5 text-surface-400" :size="18" /><input class="input-field py-2 pl-10" placeholder="Search workspace" /></label>
        <button class="relative ml-auto rounded-lg p-2 text-surface-500 hover:bg-surface-100" aria-label="Notifications"><Bell :size="20" /><span class="absolute right-2 top-1.5 size-1.5 rounded-full bg-primary-500" /></button>
        <span class="grid size-9 place-items-center rounded-full bg-primary-100 text-xs font-bold text-primary-700">{{ initials }}</span>
      </header>
      <main class="p-4 sm:p-6 lg:p-8"><slot /></main>
    </div>
  </div>
</template>
