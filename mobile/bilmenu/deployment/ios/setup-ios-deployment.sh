#!/bin/bash

echo "🚀 Setting up BilMenu for iOS deployment..."

# Check if EAS CLI is installed
if ! command -v eas &> /dev/null; then
    echo "📦 Installing EAS CLI..."
    npm install -g @expo/eas-cli
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Generate icons and splash screens
echo "🎨 Generating app icons and splash screens..."
node deployment/ios/generate-icons.js
node deployment/ios/generate-splash.js

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
echo "Run: eas build --platform ios --profile production"
echo ""

# Submit to App Store
echo "📱 To submit to App Store:"
echo "Run: eas submit --platform ios --profile production"
echo ""

echo "✅ Setup complete! Follow the manual steps above."
