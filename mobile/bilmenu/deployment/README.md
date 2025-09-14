# 🚀 BilMenu Deployment Guide

This directory contains all deployment-related files organized by platform.

## 📁 Directory Structure

```
deployment/
├── README.md                    # This file
├── ios/                         # iOS deployment files
│   ├── APP_STORE_METADATA.md    # App Store listing template
│   ├── DEPLOYMENT_CHECKLIST.md  # iOS deployment checklist
│   ├── generate-icons.js        # iOS icon generator
│   ├── generate-splash.js       # iOS splash screen generator
│   ├── setup-ios-deployment.sh  # iOS setup script
│   └── test-and-build.sh        # iOS testing and build script
└── android/                     # Android deployment files
    ├── ANDROID_DEPLOYMENT_GUIDE.md  # Android deployment guide
    ├── generate-android-assets.js   # Android asset generator
    ├── setup-android-deployment.sh  # Android setup script
    └── test-and-build-android.sh    # Android testing and build script
```

## 🍎 iOS Deployment

### Quick Start

```bash
# Navigate to iOS deployment directory
cd deployment/ios

# Run the setup script
./setup-ios-deployment.sh

# Generate icons and splash screens
node generate-icons.js
node generate-splash.js

# Test and build
./test-and-build.sh
```

### Files Overview

- **APP_STORE_METADATA.md**: Complete App Store listing template with descriptions, keywords, and metadata
- **DEPLOYMENT_CHECKLIST.md**: Step-by-step checklist for iOS deployment
- **generate-icons.js**: Generates all required iOS icon sizes (20x20 to 1024x1024)
- **generate-splash.js**: Creates splash screens for all iOS device sizes
- **setup-ios-deployment.sh**: Automated setup script for iOS deployment
- **test-and-build.sh**: Testing and build commands for iOS

## 🤖 Android Deployment

### Quick Start

```bash
# Navigate to Android deployment directory
cd deployment/android

# Run the setup script
./setup-android-deployment.sh

# Generate Android assets
node generate-android-assets.js

# Test and build
./test-and-build-android.sh
```

### Files Overview

- **ANDROID_DEPLOYMENT_GUIDE.md**: Complete Android deployment guide
- **generate-android-assets.js**: Generates Android icons and feature graphics
- **setup-android-deployment.sh**: Automated setup script for Android deployment
- **test-and-build-android.sh**: Testing and build commands for Android

## 🔧 Prerequisites

### For Both Platforms

- [ ] EAS CLI installed (`npm install -g @expo/eas-cli`)
- [ ] Expo account created and logged in
- [ ] App dependencies installed (`npm install`)

### For iOS

- [ ] Apple Developer account ($99/year)
- [ ] Xcode installed
- [ ] App Store Connect access

### For Android

- [ ] Google Play Console account ($25 one-time)
- [ ] Google account with payment method

## 📋 Deployment Timeline

| Platform | Setup Time | Review Time | Total Time |
| -------- | ---------- | ----------- | ---------- |
| iOS      | 1-2 hours  | 1-7 days    | 1-2 weeks  |
| Android  | 30 minutes | 1-3 days    | 3-5 days   |

## 🎯 Recommended Order

1. **Start with iOS** (more complex, longer review time)
2. **Then Android** (easier, faster review)

## 📞 Support

- [Expo Documentation](https://docs.expo.dev/)
- [EAS Build Documentation](https://docs.expo.dev/build/introduction/)
- [Apple Developer Documentation](https://developer.apple.com/documentation/)
- [Google Play Console Help](https://support.google.com/googleplay/android-developer/)

---

**Good luck with your app deployment! 🎉**
