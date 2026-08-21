// Voice character types
export type VoiceCharacter = 'male' | 'female'

// Emotion types
export type VoiceEmotion = 
  | 'neutral' 
  | 'happy' 
  | 'sad' 
  | 'angry' 
  | 'excited' 
  | 'calm' 
  | 'friendly' 
  | 'serious' 
  | 'fearful' 
  | 'romantic' 
  | 'confident' 
  | 'energetic'

// Speed options
export type VoiceSpeed = 0.5 | 0.75 | 1.0 | 1.25 | 1.5 | 1.75 | 2.0

// Voice settings interface
export interface VoiceSettings {
  character: VoiceCharacter
  emotion: VoiceEmotion
  speed: VoiceSpeed
}

// Emotion configuration
export interface EmotionConfig {
  id: VoiceEmotion
  label: string
  description: string
  color: string // signal hue used across the console for this emotion
}

// Character configuration
export interface CharacterConfig {
  id: VoiceCharacter
  label: string
  description: string
  voices: VoiceOption[]
}

// Voice option for future extensibility
export interface VoiceOption {
  id: string
  name: string
  language: string
  preview?: string
}

// Speed configuration
export interface SpeedConfig {
  value: VoiceSpeed
  label: string
}

// Text-to-speech request
export interface TextToSpeechRequest {
  text: string
  character: VoiceCharacter
  emotion: VoiceEmotion
  speed: VoiceSpeed
}

// Text-to-speech response
export interface TextToSpeechResponse {
  success: boolean
  audioUrl?: string
  audioData?: string // base64 encoded
  duration?: number // in seconds
  error?: string
}

// Generation status
export type GenerationStatus = 'idle' | 'validating' | 'generating' | 'success' | 'error'

// Audio player state
export interface AudioPlayerState {
  isPlaying: boolean
  currentTime: number
  duration: number
  volume: number
  isLoading: boolean
}

// Script segment with optional emotion override
export interface ScriptSegment {
  text: string
  emotion?: VoiceEmotion
  character?: VoiceCharacter
}

// Application state
export interface AppState {
  script: string
  settings: VoiceSettings
  status: GenerationStatus
  error: string | null
  audioUrl: string | null
  audioDuration: number
}
