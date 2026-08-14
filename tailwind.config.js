/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './components/**/*.{vue,js,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './composables/**/*.{js,ts}',
    './plugins/**/*.{js,ts}',
    './app.vue',
  ],
  theme: {
    extend: {
      colors: {
        // Booth palette — a dim recording room where the signal colors glow.
        ink: '#0B0D11',
        booth: '#0E1117',
        panel: '#141922',
        'panel-2': '#1A2028',
        line: '#242C38',
        'line-2': '#2E3745',
        text: '#ECEAE3',
        muted: '#828C9B',
        faint: '#586372',
        // Driven per-selected-emotion via the --accent CSS variable.
        accent: 'var(--accent)',
      },
      fontFamily: {
        display: ['"Bricolage Grotesque"', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      letterSpacing: {
        hud: '0.22em',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
}
