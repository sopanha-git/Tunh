<script setup lang="ts">
import { useVoiceSettings, defaultVoiceSettings } from '~/composables/useVoiceSettings'
import { useTextToSpeech } from '~/composables/useTextToSpeech'
import type { TextToSpeechRequest } from '~/types'

useHead({ title: 'Tunh — Voice Console' })

// State
const script = ref('')
const { settings, setCharacter, setEmotion, setSpeed, currentEmotion } = useVoiceSettings()
const { status, error, audioUrl, audioDuration, isGenerating, generateVoice, reset, downloadAudio } = useTextToSpeech()

// The whole console tunes to the selected emotion's hue.
const accent = computed(() => currentEmotion.value?.color || '#6FB3C0')

// Audio player refs
const audioElement = ref<HTMLAudioElement | null>(null)
const playerState = ref({
  isPlaying: false,
  currentTime: 0,
  duration: 0,
  volume: 1.0,
  isLoading: false,
})

const hasAudio = computed(() => !!audioUrl.value)
const hasError = computed(() => status.value === 'error')
const isSuccess = computed(() => status.value === 'success')

// Instrument readout for the hero
const statusLabel = computed(() => {
  switch (status.value) {
    case 'validating': return 'CHECKING'
    case 'generating': return 'SYNTHESIZING'
    case 'success': return 'SIGNAL READY'
    case 'error': return 'FAULT'
    default: return script.value.trim() ? 'ARMED' : 'STANDBY'
  }
})
// The mock renders a 440Hz tone; speed shifts the apparent pitch.
const toneHz = computed(() => Math.round(440 * settings.value.speed))

const handleGenerate = async () => {
  const request: TextToSpeechRequest = {
    text: script.value,
    character: settings.value.character,
    emotion: settings.value.emotion,
    speed: settings.value.speed,
  }
  const response = await generateVoice(request)
  if (response.success && response.audioUrl) {
    nextTick(() => {
      if (audioElement.value) {
        audioElement.value.src = response.audioUrl!
        audioElement.value.load()
        playerState.value.duration = response.duration || 0
      }
    })
  }
}

const togglePlay = () => {
  if (!audioElement.value) return
  if (playerState.value.isPlaying) {
    audioElement.value.pause()
    playerState.value.isPlaying = false
  } else {
    audioElement.value.play()
    playerState.value.isPlaying = true
  }
}
const handleSeek = (time: number) => {
  if (audioElement.value) {
    audioElement.value.currentTime = time
    playerState.value.currentTime = time
  }
}
const handleTimeUpdate = () => {
  if (audioElement.value) playerState.value.currentTime = audioElement.value.currentTime
}
const handleEnded = () => {
  playerState.value.isPlaying = false
  playerState.value.currentTime = 0
}
const handleLoadedMetadata = () => {
  if (audioElement.value) playerState.value.duration = audioElement.value.duration
}

const handleClear = () => {
  script.value = ''
  reset()
  if (audioElement.value) {
    audioElement.value.pause()
    audioElement.value.src = ''
  }
}
const handleResetSettings = () => {
  setCharacter(defaultVoiceSettings.character)
  setEmotion(defaultVoiceSettings.emotion)
  setSpeed(defaultVoiceSettings.speed)
}
</script>

<template>
  <div class="min-h-screen" :style="{ '--accent': accent }">
    <!-- Topbar -->
    <header class="sticky top-0 z-20 border-b border-line/80 bg-booth/70 backdrop-blur-xl">
      <div class="max-w-6xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between gap-4">
        <div class="flex items-center gap-3">
          <span class="w-2.5 h-2.5 rounded-full bg-accent glow-accent" />
          <span class="font-display font-extrabold tracking-tight text-lg text-text">TUNH</span>
          <span class="hidden sm:inline eyebrow pt-0.5">Voice Console</span>
        </div>
        <div class="flex items-center gap-4">
          <span class="hidden sm:flex items-center gap-2 hud">
            <span class="w-1.5 h-1.5 rounded-full bg-accent animate-pulse-slow" />
            {{ statusLabel }}
          </span>
          <button
            @click="handleClear"
            class="hud px-3 py-1.5 rounded-lg border border-line hover:border-line-2 hover:text-text transition-colors"
          >
            Clear
          </button>
        </div>
      </div>
    </header>

    <main class="max-w-6xl mx-auto px-5 sm:px-8 py-8 sm:py-10">
      <!-- Hero: the oscilloscope -->
      <section class="panel overflow-hidden mb-6">
        <div class="flex items-center justify-between px-6 pt-5">
          <div>
            <p class="eyebrow mb-1">Now tuning</p>
            <h1 class="font-display text-3xl sm:text-[2.6rem] leading-none font-bold text-text">
              {{ currentEmotion?.label }}
              <span class="text-accent">voice</span>
            </h1>
          </div>
          <div class="text-right hud leading-relaxed">
            <div class="text-text/90">{{ toneHz }} Hz</div>
            <div>{{ settings.speed.toFixed(2) }}×</div>
          </div>
        </div>

        <div class="relative h-40 sm:h-52 mt-2">
          <WaveformScope
            :emotion="settings.emotion"
            :speed="settings.speed"
            :color="accent"
            :active="isGenerating"
          />
          <!-- readout strip -->
          <div class="absolute bottom-3 left-6 right-6 flex items-center justify-between hud">
            <span>{{ statusLabel }}</span>
            <span class="hidden sm:inline">{{ settings.character }} · {{ settings.emotion }}</span>
          </div>
        </div>
      </section>

      <div class="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <!-- Stage: script + generate + result -->
        <div class="lg:col-span-3 space-y-6">
          <section class="panel p-6">
            <ScriptEditor v-model="script" @clear="script = ''" />
          </section>

          <GenerateVoiceButton
            :is-generating="isGenerating"
            :is-disabled="!script.trim()"
            @generate="handleGenerate"
          />

          <ErrorMessage v-if="hasError" :message="error" />
          <SuccessMessage v-if="isSuccess && !hasAudio" message="Signal ready." />

          <AudioResult
            v-if="hasAudio"
            :audio-url="audioUrl"
            :duration="audioDuration"
            :player-state="playerState"
            @play="togglePlay"
            @pause="togglePlay"
            @seek="handleSeek"
            @download="downloadAudio()"
          />

          <audio
            ref="audioElement"
            @timeupdate="handleTimeUpdate"
            @ended="handleEnded"
            @loadedmetadata="handleLoadedMetadata"
            class="hidden"
          />
        </div>

        <!-- Control desk -->
        <div class="lg:col-span-2 space-y-6">
          <section class="panel p-6">
            <div class="flex items-center justify-between mb-6">
              <h2 class="eyebrow">Control desk</h2>
              <button
                @click="handleResetSettings"
                class="hud hover:text-accent transition-colors"
              >
                Reset
              </button>
            </div>

            <div class="space-y-7">
              <CharacterSelector
                :model-value="settings.character"
                @update:model-value="setCharacter"
              />
              <div class="h-px bg-line" />
              <EmotionSelector
                :model-value="settings.emotion"
                @update:model-value="setEmotion"
              />
              <div class="h-px bg-line" />
              <SpeedControl
                :model-value="settings.speed"
                @update:model-value="setSpeed"
              />
            </div>
          </section>

          <section class="panel p-6">
            <h3 class="eyebrow mb-4">Booth notes</h3>
            <ul class="space-y-3 text-sm text-muted">
              <li class="flex gap-3">
                <span class="mt-1.5 w-3 h-px bg-accent shrink-0" />
                Punctuation becomes breath — it shapes the pauses.
              </li>
              <li class="flex gap-3">
                <span class="mt-1.5 w-3 h-px bg-accent shrink-0" />
                The emotion you pick recolors the whole console.
              </li>
              <li class="flex gap-3">
                <span class="mt-1.5 w-3 h-px bg-accent shrink-0" />
                Slower speeds read clearer; faster ones carry energy.
              </li>
            </ul>
          </section>
        </div>
      </div>

      <footer class="mt-12 pt-6 border-t border-line flex items-center justify-between hud">
        <span>Tunh · AI Text-to-Voice</span>
        <span class="hidden sm:inline">Nuxt · TypeScript · Tailwind</span>
      </footer>
    </main>
  </div>
</template>
