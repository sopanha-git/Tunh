import type { VoiceSettings, VoiceCharacter, VoiceEmotion, VoiceSpeed, EmotionConfig, CharacterConfig, SpeedConfig } from '~/types'

// Emotion configurations. `color` is the signal hue this emotion casts across
// the whole console (the interface retints to the selected emotion).
export const emotions: EmotionConfig[] = [
  { id: 'neutral', label: 'Neutral', icon: '😐', description: 'Natural, balanced tone', color: '#6FB3C0' },
  { id: 'happy', label: 'Happy', icon: '😊', description: 'Cheerful and upbeat', color: '#F3B02C' },
  { id: 'sad', label: 'Sad', icon: '😢', description: 'Melancholic and somber', color: '#6E86C8' },
  { id: 'angry', label: 'Angry', icon: '😠', description: 'Intense and frustrated', color: '#E14B3B' },
  { id: 'excited', label: 'Excited', icon: '🤩', description: 'Enthusiastic and energetic', color: '#FF5CA8' },
  { id: 'calm', label: 'Calm', icon: '😌', description: 'Peaceful and relaxed', color: '#34B79A' },
  { id: 'friendly', label: 'Friendly', icon: '🙂', description: 'Warm and approachable', color: '#F0894B' },
  { id: 'serious', label: 'Serious', icon: '😐', description: 'Professional and grave', color: '#98A6B8' },
  { id: 'fearful', label: 'Fearful', icon: '😨', description: 'Anxious and worried', color: '#9D77E0' },
  { id: 'romantic', label: 'Romantic', icon: '😍', description: 'Loving and tender', color: '#EA6A9C' },
  { id: 'confident', label: 'Confident', icon: '😎', description: 'Self-assured and bold', color: '#3E9BD6' },
  { id: 'energetic', label: 'Energetic', icon: '⚡', description: 'Dynamic and lively', color: '#B7E24A' },
]

// Character configurations
export const characters: CharacterConfig[] = [
  {
    id: 'male',
    label: 'Male',
    icon: '👨',
    description: 'Masculine voice',
    voices: [
      { id: 'male-1', name: 'James', language: 'en' },
      { id: 'male-2', name: 'Michael', language: 'en' },
    ],
  },
  {
    id: 'female',
    label: 'Female',
    icon: '👩',
    description: 'Feminine voice',
    voices: [
      { id: 'female-1', name: 'Sarah', language: 'en' },
      { id: 'female-2', name: 'Emma', language: 'en' },
    ],
  },
]

// Speed configurations
export const speeds: SpeedConfig[] = [
  { value: 0.5, label: 'Very Slow' },
  { value: 0.75, label: 'Slow' },
  { value: 1.0, label: 'Normal' },
  { value: 1.25, label: 'Fast' },
  { value: 1.5, label: 'Very Fast' },
  { value: 1.75, label: 'Super Fast' },
  { value: 2.0, label: 'Ultra Fast' },
]

// Default voice settings
export const defaultVoiceSettings: VoiceSettings = {
  character: 'female',
  emotion: 'neutral',
  speed: 1.0,
}

// Composable for managing voice settings
export function useVoiceSettings() {
  const settings = useState<VoiceSettings>('voice-settings', () => ({ ...defaultVoiceSettings }))

  const setCharacter = (character: VoiceCharacter) => {
    settings.value.character = character
  }

  const setEmotion = (emotion: VoiceEmotion) => {
    settings.value.emotion = emotion
  }

  const setSpeed = (speed: VoiceSpeed) => {
    settings.value.speed = speed
  }

  const resetSettings = () => {
    settings.value = { ...defaultVoiceSettings }
  }

  const currentEmotion = computed(() => 
    emotions.find(e => e.id === settings.value.emotion)
  )

  const currentCharacter = computed(() => 
    characters.find(c => c.id === settings.value.character)
  )

  const currentSpeed = computed(() => 
    speeds.find(s => s.value === settings.value.speed)
  )

  return {
    settings: readonly(settings),
    emotions,
    characters,
    speeds,
    setCharacter,
    setEmotion,
    setSpeed,
    resetSettings,
    currentEmotion,
    currentCharacter,
    currentSpeed,
  }
}
