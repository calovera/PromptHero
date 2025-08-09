# PromptHero - AI Prompt Optimizer

A Chrome extension that helps you optimize AI prompts using Google's Gemini AI. Get real-time scoring and improvement suggestions for your prompts to make them more effective and specific.

## Features

- **AI-Powered Scoring**: Get 1-10 ratings for prompt clarity, specificity, and effectiveness
- **Smart Optimization**: Receive improved versions of your prompts with detailed explanations
- **History Tracking**: Keep track of your prompt iterations and improvements
- **Dark Theme**: Beautiful, modern UI using Radix UI components
- **Privacy-First**: API keys stored locally, never shared with third parties
- **Real-time Feedback**: Instant scoring and optimization using Gemini AI

## Installation & Setup

### Prerequisites

- Node.js 18+ and npm
- Chrome browser
- Gemini API key (free from Google AI Studio)

### Development Setup

1. Install dependencies:
```bash
npm install
```

2. Build the extension:
```bash
./build.sh
```

3. Set up development environment (with your API key):
```bash
node setup-dev.js
```

### Getting Your Gemini API Key

1. Visit [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the generated key (starts with "AIza...")

### Loading the Extension in Chrome

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable "Developer mode" in the top right corner
3. Click "Load unpacked"
4. Select the `./dist` folder from this project
5. The PromptHero icon should appear in your browser toolbar

## How to Use

### Setting Up Your API Key

1. Click the PromptHero extension icon in your toolbar
2. Click "Options" in the popup
3. Enter your Gemini API key
4. Click "Save" and "Test" to verify it works

### Scoring Prompts

1. Click the PromptHero extension icon
2. Enter your prompt in the text area
3. Click "Score" to get a 1-10 rating with detailed feedback
4. Review the suggestions for improvement

### Optimizing Prompts

1. Enter your prompt in the text area
2. Click "Optimize" to get an improved version
3. Review the changes and reasoning provided
4. Copy the improved prompt to use in your AI applications

### Managing History

- All scored and optimized prompts are automatically saved
- View your history in the bottom section of the popup
- Clear history from the options page if needed

## Architecture

### Technology Stack

- **Frontend**: React 18 + TypeScript
- **UI Components**: Radix UI with dark theme
- **Build Tool**: TypeScript compiler with custom build script
- **AI Integration**: Google Gemini API via @google/genai
- **Storage**: Chrome Sync Storage API
- **Validation**: Zod for runtime type safety

### File Structure

```
src/
├── popup/                 # Main extension popup
│   ├── components/        # React components
│   ├── index.html        # Popup HTML
│   ├── index.tsx         # React entry point
│   └── Popup.tsx         # Main popup component
├── options/              # Extension options page
│   ├── index.html        # Options HTML
│   ├── index.tsx         # React entry point
│   └── Options.tsx       # Options component
├── background/           # Service worker
│   ├── background.ts     # Main background script
│   └── gemini.ts         # Gemini API integration
└── lib/                  # Shared utilities
    ├── messages.ts       # Message passing types
    ├── schema.ts         # Zod validation schemas
    ├── storage.ts        # Chrome storage helpers
    └── ui.tsx            # Reusable UI components
```

## Development Commands

- `./build.sh` - Build the extension for Chrome
- `node setup-dev.js` - Configure development environment
- `npm run test` - Run tests (when implemented)

## Privacy & Security

- API keys are stored locally using Chrome's sync storage
- No data is sent to third-party servers (except Google's Gemini API)
- All prompt data remains on your device
- Source code is open and auditable

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test the extension thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For issues or feature requests, please open an issue on GitHub.
