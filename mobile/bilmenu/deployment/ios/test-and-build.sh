#!/bin/bash

echo "🧪 Testing and Building BilMenu for iOS..."

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

# Test on iOS simulator
echo "📱 Testing on iOS simulator..."
echo "Run: npm run ios"
echo ""

# Create preview build
echo "🏗️  Creating preview build..."
echo "Run: eas build --platform ios --profile preview"
echo ""

# Create production build
echo "🚀 Creating production build..."
echo "Run: eas build --platform ios --profile production"
echo ""

# Submit to App Store
echo "📤 Submitting to App Store..."
echo "Run: eas submit --platform ios --profile production"
echo ""

echo "✅ Testing and build commands ready!"
echo ""
echo "📋 Next steps:"
echo "1. Test the app thoroughly on iOS simulator"
echo "2. Create a preview build and test on TestFlight"
echo "3. Create production build"
echo "4. Submit to App Store Connect"
echo "5. Wait for Apple review (1-7 days typically)"
