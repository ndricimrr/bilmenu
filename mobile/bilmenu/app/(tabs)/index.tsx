import React, { useRef, useState, useEffect } from "react";
import { StyleSheet, Alert, TouchableOpacity, View, Text } from "react-native";
import { WebView } from "react-native-webview";
import { SafeAreaView } from "react-native-safe-area-context";
import { Header } from "@/components/header";
import { useTranslations } from "@/hooks/use-translations";
import { BilMenuTheme } from "@/constants/theme";

export default function HomeScreen() {
  const { language } = useTranslations();
  const webViewRef = useRef<WebView>(null);
  const [canGoBack, setCanGoBack] = useState(false);
  const [currentUrl, setCurrentUrl] = useState("");
  const [isOnHomepage, setIsOnHomepage] = useState(true);

  // Reload WebView when language changes
  useEffect(() => {
    if (webViewRef.current) {
      const newUrl = `https://www.bilmenu.com?mobile=true&lang=${language}&source=mobile-app`;
      webViewRef.current.reload();
    }
  }, [language]);

  const handleMessage = (event: any) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data.type === "navigate") {
        console.log("Navigation message from web:", data);
      }
    } catch (error) {
      console.log("Error parsing message from web:", error);
    }
  };

  const handleError = (syntheticEvent: any) => {
    const { nativeEvent } = syntheticEvent;
    console.warn("WebView error: ", nativeEvent);
    Alert.alert(
      "Connection Error",
      "Unable to load BilMenu. Please check your internet connection.",
      [{ text: "Retry" }]
    );
  };

  const handleHttpError = (syntheticEvent: any) => {
    const { nativeEvent } = syntheticEvent;
    if (nativeEvent.statusCode >= 400) {
      Alert.alert(
        "Loading Error",
        "Failed to load BilMenu. Please try again.",
        [{ text: "OK" }]
      );
    }
  };

  const handleNavigationStateChange = (navState: any) => {
    setCanGoBack(navState.canGoBack);
    setCurrentUrl(navState.url);

    // Check if we're on the homepage
    const homepageUrl = `https://www.bilmenu.com?mobile=true&lang=${language}&source=mobile-app`;
    const isHomepage =
      navState.url.includes("bilmenu.com") &&
      navState.url.includes("mobile=true") &&
      !navState.url.includes("about") &&
      !navState.url.includes("privacy") &&
      !navState.url.includes("contributions");
    setIsOnHomepage(isHomepage);
  };

  const goBack = () => {
    if (webViewRef.current && canGoBack) {
      webViewRef.current.goBack();
    }
  };

  // Build URL with mobile app parameters
  const webappUrl = `https://www.bilmenu.com?mobile=true&lang=${language}&source=mobile-app`;

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <Header />

      {/* Navigation Bar - Only show when not on homepage */}
      {!isOnHomepage && canGoBack && (
        <View style={styles.navigationBar}>
          <TouchableOpacity style={styles.backButton} onPress={goBack}>
            <View style={styles.backButtonContent}>
              <View style={styles.backArrow} />
              <Text style={styles.backText}>Back</Text>
            </View>
          </TouchableOpacity>
        </View>
      )}

      <WebView
        ref={webViewRef}
        source={{ uri: webappUrl }}
        style={styles.webview}
        onMessage={handleMessage}
        onError={handleError}
        onHttpError={handleHttpError}
        onNavigationStateChange={handleNavigationStateChange}
        startInLoadingState={true}
        scalesPageToFit={true}
        allowsInlineMediaPlayback={true}
        mediaPlaybackRequiresUserAction={false}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        mixedContentMode="compatibility"
        userAgent="BilMenu-Mobile-App/1.0"
        key={language} // Force re-render when language changes
        injectedJavaScript={`
          // Add mobile-specific styling and hide webapp header
          const style = document.createElement('style');
          style.innerHTML = \`
            body {
              -webkit-touch-callout: none;
              -webkit-user-select: none;
              -webkit-tap-highlight-color: transparent;
            }
            .mobile-optimized {
              touch-action: manipulation;
            }
            /* Hide webapp header when accessed from mobile app */
            .site-header {
              display: none !important;
            }
            /* Adjust container padding since header is hidden */
            .container {
              padding-top: 20px !important;
            }
          \`;
          document.head.appendChild(style);
          
          // Set mobile app parameters
          window.mobileApp = {
            isMobileApp: true,
            language: '${language}',
            source: 'mobile-app'
          };
          
          // Notify React Native that page is ready
          window.ReactNativeWebView.postMessage(JSON.stringify({
            type: 'pageReady',
            url: window.location.href,
            mobileApp: window.mobileApp
          }));
          
          true;
        `}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BilMenuTheme.colors.background,
  },
  navigationBar: {
    backgroundColor: BilMenuTheme.colors.primaryLight,
    paddingHorizontal: BilMenuTheme.spacing.lg,
    paddingVertical: BilMenuTheme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: BilMenuTheme.colors.border,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: BilMenuTheme.spacing.sm,
  },
  backButtonContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  backArrow: {
    width: 0,
    height: 0,
    borderLeftWidth: 0,
    borderRightWidth: 8,
    borderTopWidth: 6,
    borderBottomWidth: 6,
    borderLeftColor: "transparent",
    borderRightColor: BilMenuTheme.colors.textWhite,
    borderTopColor: "transparent",
    borderBottomColor: "transparent",
    marginRight: BilMenuTheme.spacing.sm,
  },
  backText: {
    fontSize: BilMenuTheme.typography.body.fontSize,
    color: BilMenuTheme.colors.textWhite,
    fontWeight: BilMenuTheme.typography.subtitle.fontWeight,
  },
  webview: {
    flex: 1,
    backgroundColor: BilMenuTheme.colors.background,
  },
});
