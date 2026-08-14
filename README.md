# Tunh - AI Text-to-Voice Application

A modern, production-ready AI text-to-speech web application built with Nuxt.js, TypeScript, and Tailwind CSS.

## Features

- 🎙️ **Text-to-Voice**: Convert any text into natural-sounding speech
- 🎭 **Emotion Control**: Choose from 12 different emotions (Happy, Sad, Angry, Excited, Calm, etc.)
- 👤 **Character Selection**: Male and Female voice options
- ⚡ **Speed Control**: Adjust playback speed from 0.5x to 2.0x
- 📱 **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- 🎨 **Modern UI**: Clean, intuitive interface with smooth animations
- 💾 **Download Audio**: Save generated audio as MP3

## Technology Stack

- **Framework**: [Nuxt.js 3](https://nuxt.com/) - The Vue.js framework
- **Language**: [TypeScript](https://www.typescriptlang.org/) - Type-safe JavaScript
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/) - Utility-first CSS
- **Animations**: [@motionone/vue](https://motion.dev/) - Smooth animations
- **API**: Server-side API routes for voice generation

## Project Structure

```
Tunh/
├── assets/css/         # Global styles
├── components/         # Vue components
│   ├── ScriptEditor.vue
│   ├── CharacterSelector.vue
│   ├── EmotionSelector.vue
│   ├── SpeedControl.vue
│   ├── GenerateVoiceButton.vue
│   ├── AudioResult.vue
│   ├── ErrorMessage.vue
│   └── SuccessMessage.vue
├── composables/        # Vue composables
│   ├── useVoiceSettings.ts
│   └── useTextToSpeech.ts
├── layouts/            # Nuxt layouts
├── pages/              # Application pages
│   └── index.vue       # Main application page
├── server/api/         # Server API routes
│   └── generate-voice.post.ts
├── types/              # TypeScript types
│   └── index.ts
├── app.vue             # App root
├── nuxt.config.ts      # Nuxt configuration
├── tailwind.config.ts  # Tailwind configuration
└── tsconfig.json       # TypeScript configuration
```

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd Tunh
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
```bash
cp .env.example .env
# Edit .env and add your voice API credentials
```

4. Run the development server:
```bash
npm run dev
```

5. Open http://localhost:3000 in your browser

## Configuration

### Voice Provider Setup

The application is designed to work with multiple voice providers. To integrate a real TTS service:

1. **ElevenLabs** (Recommended):
   - Sign up at [elevenlabs.io](https://elevenlabs.io)
   - Get your API key
   - Update `server/api/generate-voice.post.ts` with ElevenLabs integration

2. **OpenAI TTS**:
   - Get your API key from [OpenAI](https://openai.com)
   - Update the API endpoint in the server route

3. **Azure Speech Services**:
   - Create a Speech resource in Azure Portal
   - Use the endpoint and key in the configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `VOICE_API_KEY` | Your voice provider API key | Yes |
| `VOICE_API_URL` | Voice provider API endpoint | Yes |

## Usage

1. **Enter Text**: Type or paste your script in the text editor
2. **Select Character**: Choose Male or Female voice
3. **Set Emotion**: Pick the appropriate emotion for your content
4. **Adjust Speed**: Set the playback speed (0.5x - 2.0x)
5. **Generate**: Click "Generate Voice" button
6. **Play/Download**: Listen to the generated audio or download it

## Development

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

### Type Checking

```bash
npm run typecheck
```

## Future Enhancements

The application is designed for easy extension:

- [ ] Multiple characters in one script
- [ ] Per-sentence emotion control
- [ ] Voice cloning integration
- [ ] Multi-language support (Khmer, Chinese, etc.)
- [ ] Audio timeline editor
- [ ] Project saving/loading
- [ ] User accounts and history
- [ ] AI script generation
- [ ] Character profiles

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

Built with ❤️ using Nuxt.js and Tailwind CSS
