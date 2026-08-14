<script setup lang="ts">
import { useVoiceSettings, defaultVoiceSettings } from '~/composables/useVoiceSettings'
import { useTextToSpeech } from '~/composables/useTextToSpeech'
import type { TextToSpeechRequest } from '~/types'

// Page meta
useHead({
  title: 'Tunh - AI Text-to-Voice',
})

// State
const script = ref('')
const { settings, setCharacter, setEmotion, setSpeed } = useVoiceSettings()
const { status, error, audioUrl, audioDuration, isGenerating, generateVoice, reset, downloadAudio } = useTextToSpeech()

// Audio player refs
const audioElement = ref<HTMLAudioElement | null>(null)
const playerState = ref({
  isPlaying: false,
  currentTime: 0,
  duration: 0,
  volume: 1.0,
  isLoading: false,
})

// Has audio
const hasAudio = computed(() => !!audioUrl.value)
const hasError = computed(() => status.value === 'error')
const isSuccess = computed(() => status.value === 'success')

// Handle generate
const handleGenerate = async () => {
  const request: TextToSpeechRequest = {
    text: script.value,
    character: settings.value.character,
    emotion: settings.value.emotion,
    speed: settings.value.speed,
  }

  const response = await generateVoice(request)
  
  if (response.success && response.audioUrl) {
    // Set up audio element
    nextTick(() => {
      if (audioElement.value) {
        audioElement.value.src = response.audioUrl!
        audioElement.value.load()
        playerState.value.duration = response.duration || 0
      }
    })
  }
}

// Audio controls
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
  if (audioElement.value) {
    playerState.value.currentTime = audioElement.value.currentTime
  }
}

const handleEnded = () => {
  playerState.value.isPlaying = false
  playerState.value.currentTime = 0
}

const handleLoadedMetadata = () => {
  if (audioElement.value) {
    playerState.value.duration = audioElement.value.duration
  }
}

// Clear everything
const handleClear = () => {
  script.value = ''
  reset()
  if (audioElement.value) {
    audioElement.value.pause()
    audioElement.value.src = ''
  }
}

// Reset settings
const handleResetSettings = () => {
  setCharacter(defaultVoiceSettings.character)
  setEmotion(defaultVoiceSettings.emotion)
  setSpeed(defaultVoiceSettings.speed)
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-surface-50 to-surface-100">
    <!-- Header -->
    <header class="bg-white/80 backdrop-blur-md border-b border-surface-200 sticky top-0 z-10">
      <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/25">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
            </div>
            <div>
              <h1 class="text-xl font-bold text-surface-900">TUNH</h1>
              <p class="text-xs text-surface-500">AI Text-to-Voice</p>
            </div>
          </div>
          
          <button
            @click="handleClear"
            class="btn-secondary text-sm"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Reset
          </button>
        </div>
      </div>
    </header>

    <!-- Main content -->
    <main class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Left column - Script editor -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Script Editor Card -->
          <section class="card p-6">
            <ScriptEditor v-model="script" @clear="script = ''" />
          </section>

          <!-- Generate Button -->
          <GenerateVoiceButton
            :is-generating="isGenerating"
            :is-disabled="!script.trim()"
            @generate="handleGenerate"
          />

          <!-- Error Message -->
          <ErrorMessage v-if="hasError" :message="error" />

          <!-- Success Message -->
          <SuccessMessage v-if="isSuccess" message="Voice generated successfully!" />

          <!-- Audio Result -->
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

          <!-- Hidden audio element -->
          <audio
            ref="audioElement"
            @timeupdate="handleTimeUpdate"
            @ended="handleEnded"
            @loadedmetadata="handleLoadedMetadata"
            class="hidden"
          />
        </div>

        <!-- Right column - Voice settings -->
        <div class="space-y-6">
          <!-- Settings Card -->
          <section class="card p-6">
            <div class="flex items-center justify-between mb-6">
              <h2 class="text-lg font-semibold text-surface-900">Voice Settings</h2>
              <button
                @click="handleResetSettings"
                class="text-xs text-primary-600 hover:text-primary-700 font-medium"
              >
                Reset to defaults
              </button>
            </div>

            <div class="space-y-6">
              <!-- Character Selector -->
              <CharacterSelector
                :model-value="settings.character"
                @update:model-value="setCharacter"
              />

              <!-- Divider -->
              <hr class="border-surface-200" />

              <!-- Emotion Selector -->
              <EmotionSelector
                :model-value="settings.emotion"
                @update:model-value="setEmotion"
              />

              <!-- Divider -->
              <hr class="border-surface-200" />

              <!-- Speed Control -->
              <SpeedControl
                :model-value="settings.speed"
                @update:model-value="setSpeed"
              />
            </div>
          </section>

          <!-- Tips Card -->
          <section class="card p-6 bg-gradient-to-br from-primary-50 to-blue-50 border-primary-100">
            <h3 class="text-sm font-semibold text-primary-900 mb-3 flex items-center gap-2">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Tips for better results
            </h3>
            <ul class="text-xs text-primary-800 space-y-2">
              <li class="flex items-start gap-2">
                <span class="text-primary-500 mt-0.5">•</span>
                Use punctuation for natural pauses
              </li>
              <li class="flex items-start gap-2">
                <span class="text-primary-500 mt-0.5">•</span>
                Break long scripts into paragraphs
              </li>
              <li class="flex items-start gap-2">
                <span class="text-primary-500 mt-0.5">•</span>
                Match emotion to your content
              </li>
              <li class="flex items-start gap-2">
                <span class="text-primary-500 mt-0.5">•</span>
                Adjust speed for clarity
              </li>
            </ul>
          </section>
        </div>
      </div>
    </main>

    <!-- Footer -->
    <footer class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 mt-12">
      <div class="text-center text-sm text-surface-400">
        <p>Tunh AI Text-to-Voice Application</p>
        <p class="mt-1">Built with Nuxt.js, TypeScript & Tailwind CSS</p>
      </div>
    </footer>
  </div>
</template>
