#!/bin/bash

echo "Building PromptHero Chrome Extension..."

# Create dist directory
mkdir -p dist/popup
mkdir -p dist/options
mkdir -p dist/background
mkdir -p dist/icons

# Copy HTML files
cp src/popup/index.html dist/popup/
cp src/options/index.html dist/options/

# Copy manifest
cp manifest.json dist/

# Copy icons
cp public/icons/*.png dist/icons/

# Build TypeScript files
echo "Compiling TypeScript..."
npx tsc --outDir dist --project tsconfig.json

# Copy any additional assets
echo "Build complete! Extension is ready in ./dist/"
echo "Load the extension in Chrome by:"
echo "1. Open Chrome and go to chrome://extensions/"
echo "2. Enable Developer mode"
echo "3. Click 'Load unpacked' and select the ./dist folder"