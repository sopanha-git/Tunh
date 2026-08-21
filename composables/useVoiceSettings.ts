import type { VoiceSettings, VoiceCharacter, VoiceEmotion, VoiceSpeed, EmotionConfig, CharacterConfig, SpeedConfig } from '~/types'

// Emotion configurations. `color` is the signal hue this emotion casts across
// the whole console (the interface retints to the selected emotion).
export const emotions: EmotionConfig[] = [
  { id: 'neutral', label: 'Neutral', description: 'Natural, balanced tone', color: '#386EE8' },
  { id: 'happy', label: 'Happy', description: 'Cheerful and upbeat', color: '#D99116' },
  { id: 'sad', label: 'Sad', description: 'Melancholic and somber', color: '#6475C7' },
  { id: 'angry', label: 'Angry', description: 'Intense and frustrated', color: '#D14D41' },
  { id: 'excited', label: 'Excited', description: 'Enthusiastic and energetic', color: '#C5538A' },
  { id: 'calm', label: 'Calm', description: 'Peaceful and relaxed', color: '#238B78' },
  { id: 'friendly', label: 'Friendly', description: 'Warm and approachable', color: '#CE7042' },
  { id: 'serious', label: 'Serious', description: 'Professional and grave', color: '#64748B' },
  { id: 'fearful', label: 'Fearful', description: 'Anxious and worried', color: '#7A5BC4' },
  { id: 'romantic', label: 'Romantic', description: 'Loving and tender', color: '#CA527E' },
  { id: 'confident', label: 'Confident', description: 'Self-assured and bold', color: '#277EB5' },
  { id: 'energetic', label: 'Energetic', description: 'Dynamic and lively', color: '#6B8E23' },
]

// Character configurations
export const characters: CharacterConfig[] = [
  {
    id: 'male',
    label: 'Male',
    description: 'Masculine voice',
    voices: [
      { id: 'male-1', name: 'James', language: 'en' },
      { id: 'male-2', name: 'Michael', language: 'en' },
    ],
  },
  {
    id: 'female',
    label: 'Female',
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
