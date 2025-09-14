# 🚀 BilMenu Deployment Quick Start

## 📁 Deployment Files Location

All deployment files are organized in the `deployment/` directory:

- **iOS**: `deployment/ios/`
- **Android**: `deployment/android/`

## 🍎 iOS Quick Start

```bash
# Navigate to iOS deployment
cd deployment/ios

# Run setup
./setup-ios-deployment.sh

# Generate assets
node generate-icons.js
node generate-splash.js

# Test and build
./test-and-build.sh
```

## 🤖 Android Quick Start

```bash
# Navigate to Android deployment
cd deployment/android

# Run setup
./setup-android-deployment.sh

# Generate assets
node generate-android-assets.js

# Test and build
./test-and-build-android.sh
```

## 📋 Prerequisites

- [ ] EAS CLI: `npm install -g @expo/eas-cli`
- [ ] Expo account and login: `eas login`
- [ ] Apple Developer account (iOS) or Google Play Console (Android)

## 🎯 Recommended Order

1. **iOS first** (more complex, longer review)
2. **Android second** (easier, faster review)

## 📖 Full Documentation

See `deployment/README.md` for complete documentation.

---

**Ready to deploy! 🎉**
