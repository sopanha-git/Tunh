<script setup lang="ts">
import { ArrowRight, AudioLines, Eye, EyeOff, LockKeyhole, Mail } from 'lucide-vue-next'

definePageMeta({ layout: 'default' })
useHead({ title: 'Access · Tunh' })

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
    const redirect = typeof route.query.redirect === 'string' && route.query.redirect.startsWith('/') ? route.query.redirect : '/'
    await navigateTo(redirect)
  } catch (cause: any) {
    error.value = cause?.data?.statusMessage || 'Access denied. Check your credentials and try again.'
  } finally { loading.value = false }
}
const features = ['12 signal tones', 'Instant monitor', 'Secure sessions']
</script>

<template>
  <main class="grid min-h-screen p-4 lg:grid-cols-[1.05fr_0.95fr] lg:gap-4 lg:p-6" style="--accent:#e7541d">
    <!-- Desk / scope side -->
    <section class="screen relative hidden flex-col justify-between overflow-hidden p-10 lg:flex xl:p-14">
      <div class="pointer-events-none absolute inset-x-0 top-1/2 h-40 -translate-y-1/2 opacity-90">
        <WaveformScope emotion="confident" :speed="1" color="#e7541d" :active="false" />
      </div>
      <div class="relative flex items-center gap-3">
        <span class="grid size-10 place-items-center rounded-lg text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.35)]" style="background:linear-gradient(180deg,#f0672e,#cb440f)"><AudioLines :size="21" /></span>
        <span class="flex flex-col leading-none">
          <span class="font-display text-lg font-bold tracking-[0.2em] text-surface-50">TUNH</span>
          <span class="mt-1 font-mono text-[0.58rem] tracking-[0.24em] text-surface-400">VOICE DESK</span>
        </span>
      </div>
      <div class="relative max-w-lg">
        <p class="hud mb-5" style="color:#f0894e">Access terminal</p>
        <h1 class="font-display text-4xl font-semibold leading-[1.08] tracking-tight text-surface-50 xl:text-5xl">Give every word the voice it deserves.</h1>
        <p class="mt-5 max-w-md leading-7 text-surface-300">Shape expressive speech, monitor it on the scope, and keep every take on one focused desk.</p>
        <ul class="mt-8 flex flex-col gap-2.5">
          <li v-for="f in features" :key="f" class="flex items-center gap-2.5 font-mono text-[0.7rem] uppercase tracking-[0.16em] text-surface-300">
            <span class="size-1.5 rounded-full" style="background:#f0894e;box-shadow:0 0 6px #f0894e" /> {{ f }}
          </li>
        </ul>
      </div>
      <p class="relative font-mono text-[0.62rem] tracking-[0.14em] text-surface-500">© {{ new Date().getFullYear() }} TUNH STUDIO</p>
    </section>

    <!-- Access panel -->
    <section class="panel flex items-center justify-center p-6 sm:p-10">
      <div class="w-full max-w-md">
        <div class="mb-9 flex items-center gap-3 lg:hidden">
          <span class="grid size-10 place-items-center rounded-lg text-white" style="background:linear-gradient(180deg,#f0672e,#cb440f)"><AudioLines :size="21" /></span>
          <span class="font-display text-lg font-bold tracking-[0.2em] text-surface-900">TUNH</span>
        </div>
        <p class="engrave">Access</p>
        <h2 class="mt-2 font-display text-3xl font-semibold tracking-tight text-surface-900">Sign in to the desk</h2>
        <p class="mt-2.5 text-sm leading-6 text-surface-500">Enter your credentials to power on the console.</p>

        <form class="mt-8 space-y-5" @submit.prevent="login">
          <label class="block">
            <span class="engrave mb-2 block">Email</span>
            <span class="relative block"><Mail class="absolute left-3.5 top-3 text-surface-400" :size="18" /><input v-model="email" class="input-field pl-11" type="email" autocomplete="username" required /></span>
          </label>
          <label class="block">
            <span class="engrave mb-2 block">Passphrase</span>
            <span class="relative block">
              <LockKeyhole class="absolute left-3.5 top-3 text-surface-400" :size="18" />
              <input v-model="password" class="input-field px-11" :type="showPassword ? 'text' : 'password'" autocomplete="current-password" required />
              <button type="button" class="absolute right-3 top-2.5 rounded-md p-1 text-surface-400 hover:text-surface-700" :aria-label="showPassword ? 'Hide passphrase' : 'Show passphrase'" @click="showPassword = !showPassword"><EyeOff v-if="showPassword" :size="18" /><Eye v-else :size="18" /></button>
            </span>
          </label>
          <div v-if="error" role="alert" class="rounded-xl border border-primary-300 bg-primary-50 px-4 py-3 text-sm text-primary-800">{{ error }}</div>
          <button class="btn-primary w-full py-3" :disabled="loading"><span>{{ loading ? 'Powering on…' : 'Sign in' }}</span><ArrowRight v-if="!loading" :size="18" /></button>
        </form>
        <p class="mt-6 rounded-xl border border-surface-300 bg-surface-100 px-4 py-3 font-mono text-[0.7rem] leading-5 text-surface-500 shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]">DEMO · admin@tunh.app / tunh-demo. In production set <code class="text-surface-700">NUXT_AUTH_EMAIL</code>, <code class="text-surface-700">NUXT_AUTH_PASSWORD</code> and a 32+ char <code class="text-surface-700">NUXT_SESSION_PASSWORD</code>.</p>
      </div>
    </section>
  </main>
</template>
