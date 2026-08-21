import type { TextToSpeechRequest, TextToSpeechResponse, GenerationStatus, AudioPlayerState } from '~/types'

export function useTextToSpeech() {
  const status = useState<GenerationStatus>('tts-status', () => 'idle')
  const error = useState<string | null>('tts-error', () => null)
  const audioUrl = useState<string | null>('tts-audio-url', () => null)
  const audioDuration = useState<number>('tts-audio-duration', () => 0)
  const isGenerating = computed(() => status.value === 'generating' || status.value === 'validating')

  // Audio player state
  const playerState = useState<AudioPlayerState>('tts-player-state', () => ({
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    volume: 1.0,
    isLoading: false,
  }))

  // Audio element reference
  let audioElement: HTMLAudioElement | null = null

  // Release the current audio URL. Only object URLs (blob:) need revoking;
  // the API returns data: URLs, which must not be passed to revokeObjectURL.
  const releaseAudioUrl = () => {
    if (audioUrl.value) {
      if (audioUrl.value.startsWith('blob:')) {
        URL.revokeObjectURL(audioUrl.value)
      }
      audioUrl.value = null
    }
  }

  // Validate request
  const validateRequest = (request: TextToSpeechRequest): string | null => {
    if (!request.text || request.text.trim().length === 0) {
      return 'Please enter some text to convert to speech'
    }
    if (request.text.length > 5000) {
      return 'Text is too long. Please keep it under 5000 characters'
    }
    if (!request.character) {
      return 'Please select a character'
    }
    if (!request.emotion) {
      return 'Please select an emotion'
    }
    if (!request.speed || request.speed < 0.5 || request.speed > 2.0) {
      return 'Please select a valid speed'
    }
    return null
  }

  // Generate voice
  const generateVoice = async (request: TextToSpeechRequest): Promise<TextToSpeechResponse> => {
    // Reset state
    status.value = 'validating'
    error.value = null
    
    // Clean up previous audio
    releaseAudioUrl()

    // Validate
    const validationError = validateRequest(request)
    if (validationError) {
      status.value = 'error'
      error.value = validationError
      return { success: false, error: validationError }
    }

    // Generate
    status.value = 'generating'

    try {
      const response = await $fetch<TextToSpeechResponse>('/api/generate-voice', {
        method: 'POST',
        body: request,
        timeout: 60000, // 60 second timeout
      })

      if (response.success && response.audioUrl) {
        audioUrl.value = response.audioUrl
        audioDuration.value = response.duration || 0
        status.value = 'success'
        return response
      } else {
        throw new Error(response.error || 'Failed to generate voice')
      }
    } catch (err: any) {
      const errorMessage = err?.data?.error || err?.message || 'An unexpected error occurred'
      status.value = 'error'
      error.value = errorMessage
      return { success: false, error: errorMessage }
    }
  }

  // Reset state
  const reset = () => {
    status.value = 'idle'
    error.value = null
    releaseAudioUrl()
    audioDuration.value = 0
    playerState.value = {
      isPlaying: false,
      currentTime: 0,
      duration: 0,
      volume: 1.0,
      isLoading: false,
    }
  }

  // Download audio
  const downloadAudio = async (filename?: string) => {
    if (!audioUrl.value) return

    const link = document.createElement('a')
    link.href = audioUrl.value
    link.download = filename || `tunh-voice-${Date.now()}.mp3`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return {
    status: readonly(status),
    error: readonly(error),
    audioUrl: readonly(audioUrl),
    audioDuration: readonly(audioDuration),
    isGenerating: readonly(isGenerating),
    playerState: readonly(playerState),
    generateVoice,
    reset,
    downloadAudio,
  }
}
