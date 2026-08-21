<script setup lang="ts">
import { AudioLines, Bell, CircleHelp, LayoutDashboard, LogOut, RotateCcw } from 'lucide-vue-next'
import { defaultVoiceSettings, useVoiceSettings } from '~/composables/useVoiceSettings'
import { useTextToSpeech } from '~/composables/useTextToSpeech'
import type { TextToSpeechRequest } from '~/types'

useHead({ title: 'Voice Desk · Tunh' })
const script = ref('')
const { settings, setModel, setCharacter, setEmotion, setSpeed, currentEmotion, currentCharacter, currentModel } = useVoiceSettings()
const { status, error, audioUrl, audioDuration, isGenerating, generateVoice, reset, downloadAudio } = useTextToSpeech()
const { user, clear } = useUserSession()
const accent = computed(() => currentEmotion.value?.color || '#386ee8')
const audioElement = ref<HTMLAudioElement | null>(null)
const playerState = ref({ isPlaying: false, currentTime: 0, duration: 0, volume: 1, isLoading: false })

// Status is a fault/standby readout, not a marketing badge.
const statusMeta = computed(() => ({
  idle: { label: 'Standby', dot: '#aba593', blink: false },
  validating: { label: 'Checking', dot: '#e7541d', blink: true },
  generating: { label: 'Rendering', dot: '#e7541d', blink: true },
  success: { label: 'Ready', dot: '#0f9d6b', blink: false },
  error: { label: 'Fault', dot: '#dc2626', blink: false },
}[status.value]))

async function handleGenerate() {
  const request: TextToSpeechRequest = { text: script.value, model: settings.value.model, character: settings.value.character, emotion: settings.value.emotion, speed: settings.value.speed }
  const response = await generateVoice(request)
  if (response.success && response.audioUrl) {
    nextTick(() => {
      if (audioElement.value) { audioElement.value.src = response.audioUrl!; audioElement.value.load(); playerState.value.duration = response.duration || 0 }
    })
  }
}
function togglePlay() { if (!audioElement.value) return; if (playerState.value.isPlaying) audioElement.value.pause(); else audioElement.value.play(); playerState.value.isPlaying = !playerState.value.isPlaying }
function handleSeek(time: number) { if (audioElement.value) audioElement.value.currentTime = time; playerState.value.currentTime = time }
function clearAll() { script.value = ''; reset(); audioElement.value?.pause() }
function resetSettings() { setCharacter(defaultVoiceSettings.character); setEmotion(defaultVoiceSettings.emotion); setSpeed(defaultVoiceSettings.speed) }
async function logout() { await $fetch('/api/auth/logout', { method: 'POST' }); await clear(); await navigateTo('/login') }
</script>

<template>
  <div class="min-h-screen" :style="{ '--accent': accent }">
    <!-- Top rail -->
    <header class="sticky top-0 z-20 border-b border-surface-300 bg-gradient-to-b from-surface-50 to-surface-100 shadow-[0_1px_0_rgba(255,255,255,0.7),0_2px_10px_-6px_rgba(27,25,21,0.25)]">
      <div class="mx-auto flex h-16 max-w-6xl items-center gap-4 px-4 sm:px-6">
        <NuxtLink to="/" class="flex items-center gap-3">
          <span class="grid size-9 place-items-center rounded-lg text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.35),0_2px_0_#9c3a12]" :style="{ background: 'linear-gradient(180deg,#f0672e,#cb440f)' }"><AudioLines :size="19" /></span>
          <span class="flex flex-col leading-none">
            <span class="font-display text-lg font-bold tracking-[0.18em] text-surface-900">TUNH</span>
            <span class="mt-0.5 font-mono text-[0.58rem] tracking-[0.2em] text-surface-500">/tʌn/ · VOICE DESK</span>
          </span>
        </NuxtLink>
        <div class="ml-auto flex items-center gap-1">
          <span class="mr-2 hidden items-center gap-2 rounded-lg border border-surface-300 bg-surface-50 px-3 py-1.5 shadow-[inset_0_1px_2px_rgba(27,25,21,0.06)] sm:flex">
            <span class="size-2 rounded-full" :class="statusMeta.blink ? 'led-blink' : ''" :style="{ background: statusMeta.dot, boxShadow: `0 0 6px ${statusMeta.dot}` }" />
            <span class="hud text-surface-600">{{ statusMeta.label }}</span>
          </span>
          <NuxtLink to="/admin" class="keycap p-2 text-surface-600" title="Dashboard"><LayoutDashboard :size="19" /></NuxtLink>
          <button class="keycap p-2 text-surface-600" title="Help"><CircleHelp :size="19" /></button>
          <button class="keycap p-2 text-surface-600" title="Notifications"><Bell :size="19" /></button>
          <span class="mx-2 hidden font-mono text-xs text-surface-600 sm:block">{{ user?.name }}</span>
          <button class="keycap p-2 text-surface-600" title="Sign out" @click="logout"><LogOut :size="18" /></button>
        </div>
      </div>
    </header>

    <main class="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:py-8">
      <!-- Signature: the oscilloscope screen -->
      <section class="panel relative overflow-hidden p-3 sm:p-4">
        <span class="screw absolute left-3 top-3" /><span class="screw absolute right-3 top-3" />
        <span class="screw absolute bottom-3 left-3" /><span class="screw absolute bottom-3 right-3" />
        <div class="screen mx-6 h-40 sm:h-52 lg:h-56">
          <div class="screen-boot absolute inset-0">
            <WaveformScope :emotion="settings.emotion" :speed="settings.speed" :color="accent" :active="isGenerating" />
          </div>
          <!-- HUD telemetry -->
          <div class="pointer-events-none absolute inset-0 flex flex-col justify-between p-3 sm:p-4">
            <div class="flex items-start justify-between">
              <span class="hud">Oscilloscope</span>
              <span class="hud flex items-center gap-1.5" :style="{ color: isGenerating ? '#f0672e' : undefined }">
                <span class="size-1.5 rounded-full bg-current" :class="isGenerating ? 'led-blink' : ''" /> {{ isGenerating ? 'REC' : 'MON' }}
              </span>
            </div>
            <div class="flex items-end justify-between font-mono text-[0.62rem] tracking-[0.14em] text-surface-300/70">
              <span>ENG <span class="text-surface-100">{{ currentModel?.label?.toUpperCase() }}</span> · CH <span class="text-surface-100">{{ currentCharacter?.label?.toUpperCase() }}</span> · EMO <span class="text-surface-100">{{ currentEmotion?.label?.toUpperCase() }}</span></span>
              <span>RATE <span class="text-surface-100">{{ settings.speed.toFixed(2) }}×</span></span>
            </div>
          </div>
        </div>
      </section>

      <!-- Console -->
      <div class="mt-5 grid gap-5 lg:grid-cols-[minmax(0,1.55fr)_minmax(320px,0.72fr)]">
        <div class="space-y-5">
          <section class="panel p-5 sm:p-6"><ScriptEditor v-model="script" @clear="script = ''" /></section>
          <GenerateVoiceButton :is-generating="isGenerating" :is-disabled="!script.trim()" @generate="handleGenerate" />
          <ErrorMessage v-if="status === 'error'" :message="error" />
          <SuccessMessage v-if="status === 'success' && !audioUrl" message="Your voice is ready." />
          <AudioResult v-if="audioUrl" :audio-url="audioUrl" :duration="audioDuration" :player-state="playerState" @play="togglePlay" @pause="togglePlay" @seek="handleSeek" @download="downloadAudio()" />
          <audio ref="audioElement" class="hidden" @timeupdate="playerState.currentTime = audioElement?.currentTime || 0" @ended="playerState.isPlaying = false" @loadedmetadata="playerState.duration = audioElement?.duration || 0" />
        </div>

        <aside class="space-y-5">
          <section class="panel p-5 sm:p-6">
            <div class="mb-6 flex items-center justify-between">
              <div>
                <p class="engrave">Console</p>
                <h2 class="mt-1 font-display text-lg font-semibold text-surface-900">Direct the take</h2>
              </div>
              <button class="keycap p-2 text-surface-600" title="Reset settings" @click="resetSettings"><RotateCcw :size="17" /></button>
            </div>
            <div class="space-y-6">
              <ModelSelector :model-value="settings.model" @update:model-value="setModel" />
              <hr class="groove" />
              <CharacterSelector :model-value="settings.character" @update:model-value="setCharacter" />
              <hr class="groove" />
              <EmotionSelector :model-value="settings.emotion" @update:model-value="setEmotion" />
              <hr class="groove" />
              <SpeedControl :model-value="settings.speed" @update:model-value="setSpeed" />
            </div>
          </section>
          <section class="rounded-2xl border border-surface-300 bg-surface-100 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]">
            <p class="engrave">Signal notes</p>
            <p class="mt-2.5 text-sm leading-6 text-surface-600">Commas cut short breaths; full stops hold a deliberate pause. Keep paragraphs tight and the pacing stays natural.</p>
          </section>
        </aside>
      </div>
    </main>
  </div>
</template>
