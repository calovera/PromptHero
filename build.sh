#!/bin/bash

echo "Building PromptHero Chrome Extension..."

# Build with Vite
echo "Building with Vite..."
npx vite build

# Copy manifest and icons
echo "Copying manifest and assets..."
cp manifest.json dist/
mkdir -p dist/icons
cp public/icons/*.png dist/icons/

# Copy animations
mkdir -p dist/animations
cp src/animations/*.json dist/animations/

echo "Build complete! Extension is ready in ./dist/"
echo "Load the extension in Chrome by:"
echo "1. Open Chrome and go to chrome://extensions/"
echo "2. Enable Developer mode"
echo "3. Click 'Load unpacked' and select the ./dist folder"