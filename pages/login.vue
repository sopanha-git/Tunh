<script setup lang="ts">
import { ArrowRight, AudioLines, Check, Eye, EyeOff, LockKeyhole, Mail } from 'lucide-vue-next'

definePageMeta({ layout: 'default' })
useHead({ title: 'Sign in · Tunh' })

const route = useRoute()
const { fetch: fetchSession } = useUserSession()
const email = ref('admin@tunh.app')
const password = ref('tunh-demo')
const showPassword = ref(false)
const loading = ref(false)
const error = ref('')

async function login() {
  loading.value = true
  error.value = ''
  try {
    await $fetch('/api/auth/login', { method: 'POST', body: { email: email.value, password: password.value } })
    await fetchSession()
    const redirect = typeof route.query.redirect === 'string' && route.query.redirect.startsWith('/')
      ? route.query.redirect : '/'
    await navigateTo(redirect)
  } catch (cause: any) {
    error.value = cause?.data?.statusMessage || 'Unable to sign in. Please try again.'
  } finally { loading.value = false }
}
</script>

<template>
  <main class="grid min-h-screen bg-white lg:grid-cols-[1.05fr_.95fr]">
    <section class="hidden bg-surface-950 p-12 text-white lg:flex lg:flex-col lg:justify-between xl:p-16">
      <div class="flex items-center gap-3">
        <span class="grid size-10 place-items-center rounded-xl bg-primary-500"><AudioLines :size="21" /></span>
        <span class="font-display text-xl font-bold">Tunh</span>
      </div>
      <div class="max-w-xl">
        <p class="mb-5 text-sm font-semibold uppercase tracking-[.18em] text-primary-300">Voice workspace</p>
        <h1 class="font-display text-5xl font-semibold leading-[1.06] tracking-tight xl:text-6xl">Give every word the voice it deserves.</h1>
        <p class="mt-6 max-w-lg text-lg leading-8 text-surface-300">Shape expressive speech, preview it instantly, and keep every production in one focused workspace.</p>
        <div class="mt-10 flex flex-wrap gap-x-7 gap-y-3 text-sm text-surface-300">
          <span class="flex items-center gap-2"><Check :size="17" class="text-primary-300" /> 12 voice styles</span>
          <span class="flex items-center gap-2"><Check :size="17" class="text-primary-300" /> Instant preview</span>
          <span class="flex items-center gap-2"><Check :size="17" class="text-primary-300" /> Secure sessions</span>
        </div>
      </div>
      <p class="text-xs text-surface-500">© {{ new Date().getFullYear() }} Tunh Studio</p>
    </section>

    <section class="flex items-center justify-center px-5 py-12 sm:px-10">
      <div class="w-full max-w-md">
        <div class="mb-10 flex items-center gap-3 lg:hidden">
          <span class="grid size-10 place-items-center rounded-xl bg-primary-600 text-white"><AudioLines :size="21" /></span>
          <span class="font-display text-xl font-bold">Tunh</span>
        </div>
        <p class="text-sm font-semibold text-primary-600">Welcome back</p>
        <h2 class="mt-2 font-display text-3xl font-semibold tracking-tight text-surface-950">Sign in to your workspace</h2>
        <p class="mt-3 text-sm leading-6 text-surface-500">Enter your account details to continue.</p>

        <form class="mt-8 space-y-5" @submit.prevent="login">
          <label class="block">
            <span class="mb-2 block text-sm font-semibold text-surface-700">Email address</span>
            <span class="relative block"><Mail class="absolute left-3.5 top-3 text-surface-400" :size="18" /><input v-model="email" class="input-field pl-11" type="email" autocomplete="username" required /></span>
          </label>
          <label class="block">
            <span class="mb-2 block text-sm font-semibold text-surface-700">Password</span>
            <span class="relative block">
              <LockKeyhole class="absolute left-3.5 top-3 text-surface-400" :size="18" />
              <input v-model="password" class="input-field px-11" :type="showPassword ? 'text' : 'password'" autocomplete="current-password" required />
              <button type="button" class="absolute right-3 top-2.5 rounded-md p-1 text-surface-400 hover:text-surface-700" :aria-label="showPassword ? 'Hide password' : 'Show password'" @click="showPassword = !showPassword"><EyeOff v-if="showPassword" :size="18" /><Eye v-else :size="18" /></button>
            </span>
          </label>
          <div v-if="error" role="alert" class="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{{ error }}</div>
          <button class="btn-primary w-full py-3" :disabled="loading"><span>{{ loading ? 'Signing in…' : 'Sign in' }}</span><ArrowRight v-if="!loading" :size="18" /></button>
        </form>
        <p class="mt-6 rounded-xl bg-surface-100 px-4 py-3 text-xs leading-5 text-surface-500">Demo: admin@tunh.app / tunh-demo. Set <code>NUXT_AUTH_EMAIL</code>, <code>NUXT_AUTH_PASSWORD</code>, and a 32+ character <code>NUXT_SESSION_PASSWORD</code> in production.</p>
      </div>
    </section>
  </main>
</template>
