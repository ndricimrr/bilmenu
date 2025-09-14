#!/bin/bash

echo "🧪 Testing and Building BilMenu for Android..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Please run this script from the mobile/bilmenu directory"
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Run linting
echo "🔍 Running ESLint..."
npm run lint

# Check TypeScript
echo "📝 Checking TypeScript..."
npx tsc --noEmit

# Test on Android emulator
echo "📱 Testing on Android emulator..."
echo "Run: npm run android"
echo ""

# Create preview build
echo "🏗️  Creating preview build..."
echo "Run: eas build --platform android --profile preview"
echo ""

# Create production build
echo "🚀 Creating production build..."
echo "Run: eas build --platform android --profile production"
echo ""

# Submit to Google Play
echo "📤 Submitting to Google Play..."
echo "Run: eas submit --platform android --profile production"
echo ""

echo "✅ Android testing and build commands ready!"
echo ""
echo "📋 Next steps:"
echo "1. Test the app thoroughly on Android emulator"
echo "2. Create a preview build and test on internal testing"
echo "3. Create production build"
echo "4. Submit to Google Play Console"
echo "5. Wait for Google review (1-3 days typically)"
