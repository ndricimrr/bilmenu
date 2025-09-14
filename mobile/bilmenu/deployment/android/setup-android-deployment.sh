#!/bin/bash

echo "🤖 Setting up BilMenu for Android deployment..."

# Check if EAS CLI is installed
if ! command -v eas &> /dev/null; then
    echo "📦 Installing EAS CLI..."
    npm install -g @expo/eas-cli
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Generate Android assets
echo "🎨 Generating Android assets..."
node deployment/android/generate-android-assets.js

# Login to Expo (you'll need to do this manually)
echo "🔐 Please login to Expo:"
echo "Run: eas login"
echo ""

# Configure EAS Build
echo "⚙️  Configuring EAS Build..."
echo "Run: eas build:configure"
echo ""

# Create production build
echo "🏗️  To create a production build:"
echo "Run: eas build --platform android --profile production"
echo ""

# Submit to Google Play
echo "📱 To submit to Google Play:"
echo "Run: eas submit --platform android --profile production"
echo ""

echo "✅ Android setup complete! Follow the manual steps above."
