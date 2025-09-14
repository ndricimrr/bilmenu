# 🤖 BilMenu Android Deployment Guide

## Google Play Console Setup

### ✅ Prerequisites

- [ ] Google Play Console account ($25 one-time fee)
- [ ] Google account with payment method
- [ ] App signing key generated
- [ ] App bundle configuration

### ✅ App Configuration

Your `app.json` already has Android configuration:

```json
"android": {
  "adaptiveIcon": {
    "backgroundColor": "#E6F4FE",
    "foregroundImage": "./assets/images/logo/android_108_108.png"
  },
  "icon": "./assets/images/logo/android_512_512.png",
  "package": "com.bilmenu.app",
  "permissions": [
    "INTERNET",
    "ACCESS_NETWORK_STATE",
    "CAMERA",
    "WRITE_EXTERNAL_STORAGE"
  ]
}
```

## Android Build Process

### ✅ EAS Build for Android

```bash
# Create Android build
eas build --platform android --profile production

# Submit to Google Play
eas submit --platform android --profile production
```

### ✅ Google Play Store Listing

- App name: "BilMenu"
- Short description: "Bilkent University meal tracker"
- Full description: (Same as iOS)
- Category: Food & Drink
- Content rating: Everyone
- Target audience: 13+ (or 18+ if needed)

## Android-Specific Assets

### ✅ App Icons

- [ ] Adaptive icon (108x108) ✅ Already configured
- [ ] Standard icon (512x512) ✅ Already configured
- [ ] Feature graphic (1024x500)
- [ ] Screenshots for different screen sizes

### ✅ Screenshots Required

- Phone screenshots (at least 2)
- Tablet screenshots (if supporting tablets)
- 7-inch tablet screenshots
- 10-inch tablet screenshots

## Android Permissions

Your app already requests the necessary permissions:

- `INTERNET` - For API calls
- `ACCESS_NETWORK_STATE` - For network status
- `CAMERA` - For photo submissions
- `WRITE_EXTERNAL_STORAGE` - For saving images

## Release Process

### ✅ Internal Testing

1. Create internal testing track
2. Upload APK/AAB
3. Add testers
4. Test thoroughly

### ✅ Closed Testing

1. Create closed testing track
2. Upload release
3. Add testers via email
4. Gather feedback

### ✅ Production Release

1. Create production release
2. Upload final AAB
3. Set release notes
4. Submit for review
5. Wait for approval (1-3 days typically)

## Android vs iOS Differences

### ✅ Key Differences

- **Review Time**: Android is typically faster (1-3 days vs 1-7 days)
- **Permissions**: Android shows all permissions upfront
- **App Bundle**: Android uses AAB format (smaller downloads)
- **Signing**: Android requires app signing key
- **Updates**: Android allows immediate updates

### ✅ Testing Considerations

- Test on different Android versions
- Test on different screen sizes
- Test camera functionality
- Test notification permissions
- Test network connectivity

## Quick Android Commands

```bash
# Build for Android
eas build --platform android --profile production

# Submit to Google Play
eas submit --platform android --profile production

# Test on Android emulator
npm run android

# Check Android build status
eas build:list --platform android
```

## Cost Comparison

| Platform | Developer Fee | Review Time | Update Time |
| -------- | ------------- | ----------- | ----------- |
| iOS      | $99/year      | 1-7 days    | 1-7 days    |
| Android  | $25 once      | 1-3 days    | Immediate   |

---

**Android deployment is typically easier and faster than iOS! 🚀**
