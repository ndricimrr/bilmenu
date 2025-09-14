# 🚀 BilMenu iOS Deployment Checklist

## Pre-Deployment Setup

### ✅ Apple Developer Account

- [ ] Apple Developer account approved
- [ ] App Store Connect access granted
- [ ] Team ID obtained
- [ ] Apple ID configured

### ✅ Development Environment

- [ ] Xcode installed (latest version)
- [ ] EAS CLI installed (`npm install -g @expo/eas-cli`)
- [ ] Expo account created and logged in
- [ ] Project configured with correct bundle ID

### ✅ App Configuration

- [ ] `app.json` updated with production settings
- [ ] `eas.json` configured for iOS builds
- [ ] Bundle identifier: `com.bilmenu.app`
- [ ] App version: `1.0.0`
- [ ] Build number: `1`

### ✅ Assets and Icons

- [ ] App icon (1024x1024) ready
- [ ] All required icon sizes generated
- [ ] Splash screens created for all device sizes
- [ ] App Store screenshots prepared

## Build Process

### ✅ Testing

- [ ] App runs on iOS simulator
- [ ] All features tested
- [ ] No TypeScript errors
- [ ] No ESLint errors
- [ ] Camera permissions work
- [ ] Notifications work
- [ ] All navigation flows tested

### ✅ Preview Build

- [ ] `eas build --platform ios --profile preview`
- [ ] TestFlight build created
- [ ] Internal testing completed
- [ ] All bugs fixed

### ✅ Production Build

- [ ] `eas build --platform ios --profile production`
- [ ] Production build successful
- [ ] Build uploaded to App Store Connect

## App Store Connect Setup

### ✅ App Information

- [ ] App created in App Store Connect
- [ ] Bundle ID matches: `com.bilmenu.app`
- [ ] App name: "BilMenu"
- [ ] Subtitle: "Bilkent University Meal Tracker"
- [ ] Category: Food & Drink
- [ ] Age rating: 4+

### ✅ App Store Listing

- [ ] App description written
- [ ] Keywords added
- [ ] Screenshots uploaded (all required sizes)
- [ ] App icon uploaded
- [ ] Privacy policy URL added
- [ ] Support URL added

### ✅ App Review Information

- [ ] Demo account created (if needed)
- [ ] Review notes written
- [ ] Contact information provided
- [ ] Pricing set (Free recommended)

## Submission

### ✅ Final Checks

- [ ] All metadata complete
- [ ] Screenshots approved
- [ ] App description reviewed
- [ ] Privacy policy accessible
- [ ] Support information accurate

### ✅ Submit for Review

- [ ] `eas submit --platform ios --profile production`
- [ ] App submitted to App Store Connect
- [ ] Status: "Waiting for Review"
- [ ] Review typically takes 1-7 days

## Post-Submission

### ✅ Monitor Review

- [ ] Check App Store Connect daily
- [ ] Respond to any review feedback
- [ ] Fix any issues if rejected
- [ ] Resubmit if necessary

### ✅ Launch Preparation

- [ ] App approved by Apple
- [ ] Release date set
- [ ] Marketing materials ready
- [ ] Social media announcements prepared

## Android Preparation (Next Phase)

### ✅ Android Setup

- [ ] Google Play Console account
- [ ] Android app bundle configuration
- [ ] Google Play Store listing
- [ ] Android-specific assets
- [ ] Play Store review process

---

## 🎯 Quick Commands Reference

```bash
# Navigate to app directory
cd mobile/bilmenu

# Install dependencies
npm install

# Test on iOS simulator
npm run ios

# Create preview build
eas build --platform ios --profile preview

# Create production build
eas build --platform ios --profile production

# Submit to App Store
eas submit --platform ios --profile production

# Check build status
eas build:list

# Check submission status
eas submit:list
```

## 📞 Support Resources

- [Expo Documentation](https://docs.expo.dev/)
- [EAS Build Documentation](https://docs.expo.dev/build/introduction/)
- [App Store Connect Help](https://developer.apple.com/help/app-store-connect/)
- [Apple Developer Forums](https://developer.apple.com/forums/)

---

**Good luck with your app launch! 🎉**
