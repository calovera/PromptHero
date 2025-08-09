# Overview

PromptHero is a fully functional Chrome extension (Manifest V3) that helps users optimize their AI prompts using Google's Gemini AI. The extension provides real-time scoring (1-10 rating), intelligent optimization suggestions, and comprehensive history tracking. Built with React, TypeScript, and Radix UI, it features a modern dark theme interface with popup and options pages. The extension is production-ready with complete Gemini API integration, local storage management, and a robust build system.

## Current Status: ✅ COMPLETE WITH ANIMATIONS
- Fully implemented Gemini AI integration with comprehensive error handling
- Working prompt scoring and optimization with live feedback
- Complete Chrome extension build system with TypeScript compilation
- API key management and testing with validation
- Modern dark theme UI built with modular Radix components
- Lottie animations for scoring and optimizing states for better UX
- History tracking and storage with Chrome sync
- Built and ready for Chrome installation
- Web demo server for testing in Replit preview
- Complete accessibility support with ARIA labels
- Toast notifications and loading states

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React with TypeScript using Vite as the build tool
- **UI Components**: Radix UI primitives with @radix-ui/themes for consistent dark mode theming
- **Animations**: Lottie React for smooth loading animations during API calls
- **Component Structure**: Fully modular approach with dedicated components:
  - PromptEditor: TextArea with character count, presets, and clear functionality
  - ScorePanel: Color-coded scoring display with issues and suggestions
  - ImprovedPanel: Monospace improved prompt display with copy functionality
  - HistoryList: ScrollArea with dropdown load options for prompt history
  - Toolbar: Accessible buttons with tooltips for all actions
  - LoadingAnimation: Lottie-powered typing animation for UX feedback
  - Toast: Animated notifications for user feedback
- **Pages**: Two main interfaces - popup (400x600px) for quick interactions and options page for configuration
- **Accessibility**: Full ARIA label support and keyboard navigation

## Chrome Extension Architecture
- **Manifest Version**: V3 with modern service worker background script
- **Extension Structure**: 
  - Popup interface for primary prompt optimization workflow
  - Options page for API key management and settings
  - Background service worker for API communication and data processing
- **Permissions**: Storage for local data persistence, host permissions for Gemini API access
- **Message Passing**: Typed message system between popup, options, and background scripts

## Data Management
- **Local Storage**: Chrome's sync storage for API keys, prompt history, and user settings
- **State Management**: Component-level React state with Chrome storage integration
- **Data Validation**: Zod schemas for runtime type safety and validation
- **History Tracking**: Persistent storage of prompt iterations with metadata (scores, timestamps, types)

## API Integration Design
- **AI Service**: Google Gemini API integration for prompt scoring and optimization
- **Authentication**: API key stored locally in Chrome storage, never transmitted to third parties
- **Request Types**: Structured message system for scoring prompts, optimizing prompts, and testing API keys
- **Error Handling**: Comprehensive error handling with user-friendly feedback

## Security Model
- **Data Privacy**: All user data stored locally, API keys never leave the user's browser
- **Secure Communication**: HTTPS-only API calls to Google's Gemini service
- **Permissions**: Minimal required permissions for storage and specific API access

# External Dependencies

## Core Framework Dependencies
- **React**: Frontend UI framework with TypeScript support
- **Vite**: Build tool and development server
- **@radix-ui/themes**: Component library providing dark theme UI components
- **@radix-ui/react-***: Individual Radix UI primitive components
- **zod**: Runtime type validation and schema definition

## AI Service Integration
- **Google Gemini API**: AI service for prompt analysis and optimization via @google/genai package
- **API Endpoint**: https://generativelanguage.googleapis.com for Gemini model access
- **Authentication**: API key-based authentication stored locally with validation
- **Animation Feedback**: Lottie animations provide visual feedback during API calls
- **Error Handling**: Comprehensive error states with user-friendly messages
- **Automatic Scoring**: Improved prompts are automatically scored for comparison

## Chrome Extension APIs
- **chrome.storage.sync**: Cross-device synchronization of user data and settings
- **chrome.runtime**: Message passing between extension components
- **chrome.runtime.openOptionsPage**: Options page navigation

## Development Tools
- **TypeScript**: Type safety throughout the application
- **Node.js 18+**: Development environment requirement
- **npm**: Package management

## Browser Requirements
- **Chrome Browser**: Target platform with Manifest V3 support
- **Modern Browser APIs**: Clipboard API for copy functionality, Service Worker support