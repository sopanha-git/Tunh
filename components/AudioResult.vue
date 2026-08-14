<script setup lang="ts">
import type { AudioPlayerState } from '~/types'

interface Props {
  audioUrl: string | null
  duration: number
  playerState: AudioPlayerState
}

interface Emits {
  (e: 'play'): void
  (e: 'pause'): void
  (e: 'seek', time: number): void
  (e: 'volumeChange', volume: number): void
  (e: 'download'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// Format time
const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

// Progress percentage
const progress = computed(() => {
  if (props.playerState.duration === 0) return 0
  return (props.playerState.currentTime / props.playerState.duration) * 100
})

// Seek
const handleSeek = (event: Event) => {
  const target = event.target as HTMLInputElement
  const time = parseFloat(target.value)
  emit('seek', time)
}

// Toggle play/pause
const togglePlay = () => {
  if (props.playerState.isPlaying) {
    emit('pause')
  } else {
    emit('play')
  }
}
</script>

<template>
  <div v-if="audioUrl" class="panel p-6">
    <p class="eyebrow mb-4">Output · take one</p>
    <div class="flex items-center gap-4 mb-4">
      <!-- Play/Pause button -->
      <button
        @click="togglePlay"
        class="w-14 h-14 flex items-center justify-center bg-accent text-ink rounded-full transition-transform duration-200 glow-accent hover:scale-105 active:scale-95"
      >
        <svg v-if="playerState.isPlaying" class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <rect x="6" y="4" width="4" height="16" rx="1" />
          <rect x="14" y="4" width="4" height="16" rx="1" />
        </svg>
        <svg v-else class="w-6 h-6 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M8 5v14l11-7z" />
        </svg>
      </button>

      <!-- Info -->
      <div class="flex-1">
        <h3 class="font-display text-sm font-semibold text-text">Generated voice</h3>
        <p class="hud mt-0.5">{{ formatTime(playerState.currentTime) }} / {{ formatTime(playerState.duration || duration) }}</p>
      </div>

      <!-- Download button -->
      <button
        @click="$emit('download')"
        class="key p-3 text-muted hover:text-accent"
        title="Download audio"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
      </button>
    </div>

    <!-- Scrubber -->
    <div class="relative">
      <input
        type="range"
        :min="0"
        :max="playerState.duration || duration"
        :value="playerState.currentTime"
        @input="handleSeek"
        class="console-range"
      />
    </div>

    <!-- Audio element -->
    <audio
      ref="audioElement"
      :src="audioUrl"
      @timeupdate="$emit('seek', ($event.target as HTMLAudioElement).currentTime)"
      @ended="$emit('pause')"
      class="hidden"
    />
  </div>
</template>
