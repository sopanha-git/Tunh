<script setup lang="ts">
import { Download, Pause, Play, Waves } from 'lucide-vue-next'
import type { AudioPlayerState } from '~/types'
const props = defineProps<{ audioUrl: string | null; duration: number; playerState: AudioPlayerState }>()
const emit = defineEmits<{ play: []; pause: []; seek: [time: number]; download: [] }>()
const formatTime = (value: number) => `${Math.floor(value / 60).toString().padStart(2, '0')}:${Math.floor(value % 60).toString().padStart(2, '0')}`
function seek(event: Event) { emit('seek', Number((event.target as HTMLInputElement).value)) }
function toggle() { emit(props.playerState.isPlaying ? 'pause' : 'play') }
</script>
<template>
  <section v-if="audioUrl" class="panel p-5 sm:p-6">
    <div class="mb-5 flex items-center justify-between">
      <div>
        <p class="engrave">Output</p>
        <h2 class="mt-1 font-display text-lg font-semibold text-surface-900">Signal captured</h2>
      </div>
      <span class="readout px-3 py-1.5 text-[0.7rem] font-semibold text-emerald-700"><span class="mr-1.5 inline-block size-1.5 -translate-y-px rounded-full bg-emerald-600 align-middle" />READY</span>
    </div>
    <div class="flex items-center gap-4">
      <button
        class="grid size-12 shrink-0 place-items-center rounded-full text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.4),0_3px_0_#9c3a12,0_6px_14px_-6px_rgba(200,65,15,0.5)] transition-transform active:translate-y-0.5"
        :style="{ background: 'linear-gradient(180deg,#f0672e,#cb440f)' }"
        :aria-label="playerState.isPlaying ? 'Pause' : 'Play'" @click="toggle"
      >
        <Pause v-if="playerState.isPlaying" :size="21" fill="currentColor" />
        <Play v-else :size="21" fill="currentColor" class="translate-x-0.5" />
      </button>
      <div class="min-w-0 flex-1">
        <div class="mb-2 flex justify-between font-mono text-[0.7rem] font-medium text-surface-500">
          <span>{{ formatTime(playerState.currentTime) }}</span>
          <span>{{ formatTime(playerState.duration || duration) }}</span>
        </div>
        <input class="console-range" type="range" min="0" :max="playerState.duration || duration" :value="playerState.currentTime" aria-label="Audio progress" @input="seek" />
      </div>
      <button class="keycap p-3 text-surface-600" title="Download audio" @click="emit('download')"><Download :size="20" /></button>
    </div>
    <div class="groove my-5" />
    <p class="flex items-center gap-2 font-mono text-[0.68rem] uppercase tracking-wide text-surface-500"><Waves :size="15" /> WAV · 44.1 kHz · ready to download</p>
  </section>
</template>
