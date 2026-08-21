<script setup lang="ts">
import type { VoiceEmotion } from '~/types'

interface Props {
  emotion: VoiceEmotion
  speed: number
  color: string
  active?: boolean // true while generating — the scope drives harder
}

const props = withDefaults(defineProps<Props>(), { active: false })

// Per-emotion waveform character. Derived from what the emotion sounds like:
// calm/sad are slow, low, smooth; angry/energetic are fast, harsh, jagged;
// excited/happy sit bright and busy. This is the mock's 440Hz tone, shaped.
type Shape = 'sine' | 'tri' | 'saw' | 'square'
interface WaveSpec { shape: Shape; amp: number; freq: number; jitter: number; harm: number }

const WAVE: Record<VoiceEmotion, WaveSpec> = {
  neutral:   { shape: 'sine',   amp: 0.50, freq: 1.00, jitter: 0.00, harm: 0.00 },
  happy:     { shape: 'sine',   amp: 0.68, freq: 1.40, jitter: 0.02, harm: 0.35 },
  sad:       { shape: 'sine',   amp: 0.30, freq: 0.68, jitter: 0.00, harm: 0.00 },
  angry:     { shape: 'saw',    amp: 0.92, freq: 1.55, jitter: 0.14, harm: 0.55 },
  excited:   { shape: 'tri',    amp: 0.84, freq: 1.95, jitter: 0.06, harm: 0.40 },
  calm:      { shape: 'sine',   amp: 0.38, freq: 0.60, jitter: 0.00, harm: 0.00 },
  friendly:  { shape: 'sine',   amp: 0.58, freq: 1.12, jitter: 0.01, harm: 0.22 },
  serious:   { shape: 'sine',   amp: 0.44, freq: 0.86, jitter: 0.00, harm: 0.12 },
  fearful:   { shape: 'sine',   amp: 0.50, freq: 1.25, jitter: 0.20, harm: 0.20 },
  romantic:  { shape: 'sine',   amp: 0.54, freq: 0.92, jitter: 0.00, harm: 0.16 },
  confident: { shape: 'square', amp: 0.70, freq: 1.15, jitter: 0.00, harm: 0.28 },
  energetic: { shape: 'saw',    amp: 0.90, freq: 2.10, jitter: 0.09, harm: 0.48 },
}

const canvas = ref<HTMLCanvasElement | null>(null)
let ctx: CanvasRenderingContext2D | null = null
let raf = 0
let phase = 0
let dpr = 1
let cssW = 0
let cssH = 0
let energy = 0 // eased-in amplitude, so emotion changes glide rather than snap

const shapeFn = (s: Shape, p: number): number => {
  const t = p / (Math.PI * 2)
  const frac = t - Math.floor(t)
  switch (s) {
    case 'sine': return Math.sin(p)
    case 'tri': return 2 * Math.abs(2 * frac - 1) - 1
    case 'saw': return 2 * frac - 1
    case 'square': return Math.tanh(Math.sin(p) * 4) // softened square
  }
}

const resize = () => {
  const el = canvas.value
  if (!el) return
  dpr = Math.min(window.devicePixelRatio || 1, 2)
  cssW = el.clientWidth
  cssH = el.clientHeight
  el.width = Math.floor(cssW * dpr)
  el.height = Math.floor(cssH * dpr)
  ctx = el.getContext('2d')
  if (ctx) ctx.scale(dpr, dpr)
}

const frame = (advance: boolean) => {
  if (!ctx) return
  const spec = WAVE[props.emotion]
  const target = spec.amp * (props.active ? 1.25 : 1)
  energy += (target - energy) * 0.06

  const w = cssW
  const h = cssH
  const mid = h / 2
  ctx.clearRect(0, 0, w, h)

  // Oscilloscope graticule — faint divisions, brighter centre cross.
  ctx.lineWidth = 1
  ctx.strokeStyle = 'rgba(255,255,255,0.045)'
  ctx.beginPath()
  for (let i = 1; i < 10; i++) { const x = (w / 10) * i; ctx.moveTo(x, 0); ctx.lineTo(x, h) }
  for (let i = 1; i < 4; i++) { const y = (h / 4) * i; ctx.moveTo(0, y); ctx.lineTo(w, y) }
  ctx.stroke()
  ctx.strokeStyle = 'rgba(255,255,255,0.08)'
  ctx.beginPath()
  ctx.moveTo(0, mid); ctx.lineTo(w, mid)
  ctx.moveTo(w / 2, 0); ctx.lineTo(w / 2, h)
  ctx.stroke()

  const cycles = 5 * spec.freq * Math.max(props.speed, 0.5)
  const amp = Math.min(energy, 0.95) * (h * 0.42)
  const step = 2

  const sampleAt = (x: number): number => {
    const p = (x / w) * Math.PI * 2 * cycles + phase
    let v = shapeFn(spec.shape, p)
    if (spec.harm) v = v * (1 - spec.harm) + shapeFn(spec.shape, p * 2) * spec.harm
    if (spec.jitter) v += (Math.random() * 2 - 1) * spec.jitter
    // taper toward the edges so the trace reads as a contained signal
    const edge = Math.sin((x / w) * Math.PI)
    return mid - v * amp * edge
  }

  // Flat, lightly tinted body under the trace.
  ctx.beginPath()
  ctx.moveTo(0, mid)
  for (let x = 0; x <= w; x += step) ctx.lineTo(x, sampleAt(x))
  ctx.lineTo(w, mid)
  ctx.closePath()
  ctx.globalAlpha = 0.12
  ctx.fillStyle = props.color
  ctx.fill()
  ctx.globalAlpha = 1

  // Crisp trace with no glow.
  ctx.beginPath()
  for (let x = 0; x <= w; x += step) {
    const y = sampleAt(x)
    if (x === 0) ctx.moveTo(x, y)
    else ctx.lineTo(x, y)
  }
  ctx.strokeStyle = props.color
  ctx.lineWidth = 2
  ctx.lineJoin = 'round'
  ctx.stroke()

  if (advance) phase += (props.active ? 0.09 : 0.045) * Math.max(props.speed, 0.6)
}

const loop = () => {
  frame(true)
  raf = requestAnimationFrame(loop)
}

const prefersReduced = () =>
  typeof window !== 'undefined' &&
  window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

onMounted(() => {
  resize()
  window.addEventListener('resize', resize)
  if (prefersReduced()) {
    energy = WAVE[props.emotion].amp
    frame(false) // single static trace
  } else {
    loop()
  }
})

onBeforeUnmount(() => {
  cancelAnimationFrame(raf)
  window.removeEventListener('resize', resize)
})

// Repaint a static frame when inputs change under reduced motion
watch(() => [props.emotion, props.speed, props.color, props.active], () => {
  if (prefersReduced()) {
    energy = WAVE[props.emotion].amp
    frame(false)
  }
})
</script>

<template>
  <canvas ref="canvas" class="block w-full h-full" aria-hidden="true" />
</template>
