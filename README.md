# PromptHero - AI Prompt Optimization Extension

PromptHero is a powerful Chrome extension that helps you optimize your AI prompts using Google's Gemini AI. Get instant scoring, detailed feedback, and AI-powered improvements for better results with any AI model.

## ✨ Features

- **Instant Prompt Scoring**: Get a 1-100 score with detailed feedback on prompt quality
- **AI-Powered Optimization**: Automatically improve your prompts with specific suggestions
- **Beautiful Dark Theme**: Modern UI built with Radix UI components
- **Smart Loading Animations**: Lottie animations show when AI is working
- **Prompt Presets**: Quick templates for coding, data extraction, brainstorming, and customer support
- **History Tracking**: Keep track of all your prompt iterations
- **One-Click Copy**: Easily copy original or improved prompts
- **Privacy-First**: All data stored locally, API key never shared

## 🚀 Installation

### From Chrome Web Store (Coming Soon)
*Extension will be available on the Chrome Web Store soon*

### Manual Installation (Developer Mode)
1. Download or clone this repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" in the top right corner
4. Click "Load unpacked" and select the `./dist` folder
5. The PromptHero extension should appear in your toolbar

## ⚙️ Setup

### For Development/Testing

1. **Set up Environment Variables**:
   ```bash
   # Run the automated setup (recommended)
   npm run setup
   
   # Or manually configure environment
   # Create env.config.js with your API keys
   ```

2. **Build and Load Extension**:
   ```bash
   # Build the extension
   npm run build
   
   # Configure API key for development
   npm run setup:dev

   # FOR PRODUCTION USE: node build-esbuild.js
   
   # Load in Chrome
   # 1. Open chrome://extensions/
   # 2. Enable "Developer mode"
   # 3. Click "Load unpacked" and select ./dist folder
   ```

### For End Users

1. **Get a Gemini API Key**:
   - Visit [Google AI Studio](https://aistudio.google.com/app/apikey)
   - Create a free API key
   - Copy the key (starts with `AIza...`)

2. **Configure PromptHero**:
   - Click the PromptHero extension icon
   - Click "Open Options"
   - Paste your API key and click "Save"
   - Click "Test" to verify it's working

## 📖 Usage Guide

### Basic Workflow
1. **Enter a Prompt**: Type or paste your AI prompt in the text area
2. **Score Your Prompt**: Click "Score" to get quality analysis (1-100 rating)
3. **Optimize**: Click "Optimize" to get an AI-improved version
4. **Copy & Use**: Click "Copy" to copy the improved prompt to your clipboard

### Quick Presets
Use the preset chips for common prompt types:
- **Coding**: Structured prompts for development tasks
- **Data extraction**: Prompts for extracting structured data
- **Brainstorm**: Creative ideation prompts
- **Customer support**: Professional support interaction prompts

### History Management
- All prompt iterations are automatically saved
- Browse recent history at the bottom of the popup
- Load any previous prompt (original or improved version)
- History is synced across your Chrome browsers

## 🎨 Screenshots

*Screenshots will be added here showing the extension in action*

## 🔒 Privacy & Security

- **Local Storage**: Your API key is stored securely in Chrome's local storage
- **No Data Collection**: PromptHero doesn't collect or store your prompts
- **Direct API Calls**: Prompts are sent directly from your browser to Google's Gemini API
- **HTTPS Only**: All communication uses secure HTTPS connections

## 🛠️ Troubleshooting

### Common Issues

**"API key not configured" error**
- Solution: Go to Options and enter your Gemini API key

**"Failed to score/optimize prompt" error**
- Check your internet connection
- Verify your API key is valid and has quota remaining
- Try with a shorter prompt (API has length limits)

**Extension not loading**
- Make sure you're using Chrome 88+ with Manifest V3 support
- Try disabling and re-enabling the extension

### Debug Information
To get detailed error logs:
1. Go to `chrome://extensions/`
2. Find PromptHero and click "Inspect views: service worker"
3. Check the Console tab for error messages

## 🔧 Development

### Build from Source
```bash
# Install dependencies
npm install

# Build extension
./build.sh

# The built extension will be in ./dist/
```

### Project Structure
```
├── src/
│   ├── popup/           # Main popup interface
│   ├── options/         # Options/settings page
│   ├── background/      # Service worker & API logic
│   ├── lib/            # Shared utilities & schemas
│   └── animations/     # Lottie animation files
├── dist/               # Built extension files
└── web-demo/          # Web demo for testing
```

### Tech Stack
- **Framework**: React with TypeScript
- **UI Library**: Radix UI with dark theme
- **Build Tool**: Vite for fast development
- **Animations**: Lottie React for smooth loading states
- **Validation**: Zod for runtime type safety
- **AI Service**: Google Gemini API

## 📝 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Support

If you encounter any issues or have questions:
1. Check the troubleshooting section above
2. Open an issue on GitHub
3. Make sure you have a valid Gemini API key with available quota

---

**Made with ❤️ for better AI interactions**
