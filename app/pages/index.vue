<script setup lang="ts">
import { AudioLines, Bell, CircleHelp, LayoutDashboard, LogOut, RotateCcw, Sparkles } from 'lucide-vue-next'
import { defaultVoiceSettings, useVoiceSettings } from '~/composables/useVoiceSettings'
import { useTextToSpeech } from '~/composables/useTextToSpeech'
import type { TextToSpeechRequest } from '~/types'

useHead({ title: 'Voice Studio · Tunh' })
const script = ref('')
const { settings, setCharacter, setEmotion, setSpeed, currentEmotion } = useVoiceSettings()
const { status, error, audioUrl, audioDuration, isGenerating, generateVoice, reset, downloadAudio } = useTextToSpeech()
const { user, clear } = useUserSession()
const accent = computed(() => currentEmotion.value?.color || '#386ee8')
const audioElement = ref<HTMLAudioElement | null>(null)
const playerState = ref({ isPlaying: false, currentTime: 0, duration: 0, volume: 1, isLoading: false })
const statusLabel = computed(() => ({ validating:'Checking', generating:'Generating', success:'Ready', error:'Needs attention', idle:'Ready' }[status.value]))

async function handleGenerate() {
  const request: TextToSpeechRequest = { text: script.value, character: settings.value.character, emotion: settings.value.emotion, speed: settings.value.speed }
  const response = await generateVoice(request)
  if (response.success && response.audioUrl) nextTick(() => { if (audioElement.value) { audioElement.value.src = response.audioUrl!; audioElement.value.load(); playerState.value.duration = response.duration || 0 } })
}
function togglePlay() { if (!audioElement.value) return; if (playerState.value.isPlaying) audioElement.value.pause(); else audioElement.value.play(); playerState.value.isPlaying = !playerState.value.isPlaying }
function handleSeek(time: number) { if (audioElement.value) audioElement.value.currentTime = time; playerState.value.currentTime = time }
function clearAll() { script.value = ''; reset(); audioElement.value?.pause() }
function resetSettings() { setCharacter(defaultVoiceSettings.character); setEmotion(defaultVoiceSettings.emotion); setSpeed(defaultVoiceSettings.speed) }
async function logout() { await $fetch('/api/auth/logout', { method: 'POST' }); await clear(); await navigateTo('/login') }
</script>

<template>
  <div class="min-h-screen bg-surface-50" :style="{ '--accent': accent }">
    <header class="border-b border-surface-200 bg-white">
      <div class="mx-auto flex h-17 max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-8">
        <NuxtLink to="/" class="flex items-center gap-3"><span class="grid size-9 place-items-center rounded-xl bg-primary-600 text-white"><AudioLines :size="19" /></span><span class="font-display text-lg font-bold">Tunh</span></NuxtLink>
        <span class="hidden h-5 w-px bg-surface-200 sm:block" /><span class="hidden text-sm font-medium text-surface-500 sm:block">Voice studio</span>
        <div class="ml-auto flex items-center gap-1"><NuxtLink to="/admin" class="rounded-lg p-2 text-surface-500 hover:bg-surface-100" title="Dashboard"><LayoutDashboard :size="20" /></NuxtLink><button class="rounded-lg p-2 text-surface-500 hover:bg-surface-100" title="Help"><CircleHelp :size="20" /></button><button class="rounded-lg p-2 text-surface-500 hover:bg-surface-100" title="Notifications"><Bell :size="20" /></button><span class="mx-2 hidden text-sm font-medium sm:block">{{ user?.name }}</span><button class="rounded-lg p-2 text-surface-500 hover:bg-surface-100" title="Sign out" @click="logout"><LogOut :size="19" /></button></div>
      </div>
    </header>

    <main class="mx-auto max-w-7xl px-4 py-7 sm:px-6 lg:px-8 lg:py-10">
      <header class="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div><p class="text-sm font-semibold text-primary-600">Create audio</p><h1 class="mt-1 font-display text-3xl font-semibold tracking-tight sm:text-4xl">Bring your script to life</h1><p class="mt-2 text-sm text-surface-500">Choose a voice, shape the delivery, and generate a polished take.</p></div><div class="flex items-center gap-2"><span class="rounded-lg bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700">{{ statusLabel }}</span><button class="btn-secondary" @click="clearAll"><RotateCcw :size="16" /> Clear</button></div></header>

      <div class="grid gap-6 lg:grid-cols-[minmax(0,1.55fr)_minmax(320px,.75fr)]">
        <div class="space-y-5">
          <section class="panel p-5 sm:p-6"><ScriptEditor v-model="script" @clear="script = ''" /></section>
          <GenerateVoiceButton :is-generating="isGenerating" :is-disabled="!script.trim()" @generate="handleGenerate" />
          <ErrorMessage v-if="status === 'error'" :message="error" />
          <SuccessMessage v-if="status === 'success' && !audioUrl" message="Your voice is ready." />
          <AudioResult v-if="audioUrl" :audio-url="audioUrl" :duration="audioDuration" :player-state="playerState" @play="togglePlay" @pause="togglePlay" @seek="handleSeek" @download="downloadAudio()" />
          <audio ref="audioElement" class="hidden" @timeupdate="playerState.currentTime = audioElement?.currentTime || 0" @ended="playerState.isPlaying = false" @loadedmetadata="playerState.duration = audioElement?.duration || 0" />
        </div>
        <aside class="space-y-5">
          <section class="panel p-5 sm:p-6"><div class="mb-6 flex items-center justify-between"><div><p class="eyebrow">Voice settings</p><h2 class="mt-1 font-display text-xl font-semibold">Direct the take</h2></div><button class="rounded-lg p-2 text-surface-500 hover:bg-surface-100" title="Reset settings" @click="resetSettings"><RotateCcw :size="17" /></button></div><div class="space-y-6"><CharacterSelector :model-value="settings.character" @update:model-value="setCharacter" /><hr class="border-surface-200" /><EmotionSelector :model-value="settings.emotion" @update:model-value="setEmotion" /><hr class="border-surface-200" /><SpeedControl :model-value="settings.speed" @update:model-value="setSpeed" /></div></section>
          <section class="rounded-2xl border border-primary-200 bg-primary-50 p-5"><Sparkles :size="20" class="text-primary-600" /><h3 class="mt-3 font-semibold text-primary-900">A better sounding take</h3><p class="mt-2 text-sm leading-6 text-primary-800">Use commas for short breaths and full stops for deliberate pauses. Short paragraphs keep pacing natural.</p></section>
        </aside>
      </div>
    </main>
  </div>
</template>
