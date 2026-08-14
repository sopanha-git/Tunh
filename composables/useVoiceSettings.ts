import type { VoiceSettings, VoiceCharacter, VoiceEmotion, VoiceSpeed, EmotionConfig, CharacterConfig, SpeedConfig } from '~/types'

// Emotion configurations
export const emotions: EmotionConfig[] = [
  { id: 'neutral', label: 'Neutral', icon: '😐', description: 'Natural, balanced tone' },
  { id: 'happy', label: 'Happy', icon: '😊', description: 'Cheerful and upbeat' },
  { id: 'sad', label: 'Sad', icon: '😢', description: 'Melancholic and somber' },
  { id: 'angry', label: 'Angry', icon: '😠', description: 'Intense and frustrated' },
  { id: 'excited', label: 'Excited', icon: '🤩', description: 'Enthusiastic and energetic' },
  { id: 'calm', label: 'Calm', icon: '😌', description: 'Peaceful and relaxed' },
  { id: 'friendly', label: 'Friendly', icon: '🙂', description: 'Warm and approachable' },
  { id: 'serious', label: 'Serious', icon: '😐', description: 'Professional and grave' },
  { id: 'fearful', label: 'Fearful', icon: '😨', description: 'Anxious and worried' },
  { id: 'romantic', label: 'Romantic', icon: '😍', description: 'Loving and tender' },
  { id: 'confident', label: 'Confident', icon: '😎', description: 'Self-assured and bold' },
  { id: 'energetic', label: 'Energetic', icon: '⚡', description: 'Dynamic and lively' },
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
