<script setup lang="ts">
import { Download, Pause, Play, Volume2 } from 'lucide-vue-next'
import type { AudioPlayerState } from '~/types'
const props = defineProps<{ audioUrl: string | null; duration: number; playerState: AudioPlayerState }>()
const emit = defineEmits<{ play: []; pause: []; seek: [time: number]; download: [] }>()
const formatTime = (value: number) => `${Math.floor(value / 60).toString().padStart(2,'0')}:${Math.floor(value % 60).toString().padStart(2,'0')}`
function seek(event: Event) { emit('seek', Number((event.target as HTMLInputElement).value)) }
function toggle() { emit(props.playerState.isPlaying ? 'pause' : 'play') }
</script>
<template>
  <section v-if="audioUrl" class="panel p-5 sm:p-6">
    <div class="mb-5 flex items-center justify-between"><div><p class="eyebrow">Generated take</p><h2 class="mt-1 font-display text-xl font-semibold">Your audio is ready</h2></div><span class="rounded-lg bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">Complete</span></div>
    <div class="flex items-center gap-4"><button class="grid size-12 shrink-0 place-items-center rounded-full bg-primary-600 text-white shadow-sm hover:bg-primary-700" :aria-label="playerState.isPlaying ? 'Pause' : 'Play'" @click="toggle"><Pause v-if="playerState.isPlaying" :size="21" fill="currentColor" /><Play v-else :size="21" fill="currentColor" /></button><div class="min-w-0 flex-1"><div class="mb-2 flex justify-between text-xs font-medium text-surface-500"><span>{{ formatTime(playerState.currentTime) }}</span><span>{{ formatTime(playerState.duration || duration) }}</span></div><input class="console-range" type="range" min="0" :max="playerState.duration || duration" :value="playerState.currentTime" aria-label="Audio progress" @input="seek" /></div><button class="rounded-xl border border-surface-200 p-3 text-surface-600 hover:bg-surface-50" title="Download audio" @click="emit('download')"><Download :size="20" /></button></div>
    <div class="mt-5 flex items-center gap-2 text-xs text-surface-500"><Volume2 :size="15" /> WAV audio · Ready to download</div>
  </section>
</template>
