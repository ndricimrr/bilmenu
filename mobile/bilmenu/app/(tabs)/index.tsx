import React, { useRef, useState, useEffect } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  Linking,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Header } from "@/components/header";
import { useTranslations } from "@/hooks/use-translations";
import { BilMenuTheme } from "@/constants/theme";
import { WebView } from "react-native-webview";

export default function HomeScreen() {
  const { language } = useTranslations();
  const webViewRef = useRef<any>(null);
  const [canGoBack, setCanGoBack] = useState(false);
  const [isOnHomepage, setIsOnHomepage] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [webViewUrl, setWebViewUrl] = useState(
    `https://www.bilmenu.com?mobile=true&lang=${language}&source=mobile-app`
  );

  // Update WebView URL when language changes
  useEffect(() => {
    const newUrl = `https://www.bilmenu.com?mobile=true&lang=${language}&source=mobile-app`;
    setWebViewUrl(newUrl);
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
    setHasError(true);
    setIsLoading(false);

    // Auto-retry after 3 seconds if retry count < 3
    if (retryCount < 3) {
      setTimeout(() => {
        setRetryCount((prev) => prev + 1);
        setHasError(false);
        setIsLoading(true);
        refreshWebView();
      }, 3000);
    }
  };

  const handleHttpError = (syntheticEvent: any) => {
    const { nativeEvent } = syntheticEvent;
    if (nativeEvent.statusCode >= 400) {
      console.warn("WebView HTTP error: ", nativeEvent);
    }
  };

  const handleNavigationStateChange = (navState: any) => {
    setCanGoBack(navState.canGoBack);

    // Check if we're on the homepage
    const isHomepage =
      navState.url.includes("bilmenu.com") &&
      navState.url.includes("mobile=true") &&
      !navState.url.includes("about") &&
      !navState.url.includes("privacy") &&
      !navState.url.includes("contributions");
    setIsOnHomepage(isHomepage);
  };

  const handleShouldStartLoadWithRequest = (request: any) => {
    const url = request.url;

    // Check if it's an external link (not bilmenu.com domain)
    if (!url.includes("bilmenu.com")) {
      // Open external links in Safari with proper error handling
      Linking.openURL(url).catch((error) => {
        console.warn("Failed to open external URL:", error);
        // Don't show error to user as the link might still work in Safari
      });
      return false; // Prevent WebView from loading
    }

    return true; // Allow WebView to load bilmenu.com links
  };

  const handleLoadStart = () => {
    setIsLoading(true);
    setHasError(false);
  };

  const handleLoadEnd = () => {
    setIsLoading(false);
    setHasError(false);
    setRetryCount(0); // Reset retry count on successful load
  };

  const goBack = () => {
    if (webViewRef.current && canGoBack) {
      webViewRef.current.goBack();
    }
  };

  const refreshWebView = () => {
    if (webViewRef.current) {
      setIsLoading(true);
      setHasError(false);
      webViewRef.current.reload();
    }
  };

  // URL is now managed by state and updated when language changes

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <Header onRefresh={refreshWebView} />

      {/* Loading Indicator */}
      {isLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#ff9434" />
          <Text style={styles.loadingText}>Loading BilMenu...</Text>
        </View>
      )}

      {/* Error State */}
      {hasError && retryCount >= 3 && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Failed to load content</Text>
          <TouchableOpacity style={styles.retryButton} onPress={refreshWebView}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      )}

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
        source={{ uri: webViewUrl }}
        style={styles.webview}
        onMessage={handleMessage}
        onError={handleError}
        onHttpError={handleHttpError}
        onNavigationStateChange={handleNavigationStateChange}
        onShouldStartLoadWithRequest={handleShouldStartLoadWithRequest}
        onLoadStart={handleLoadStart}
        onLoadEnd={handleLoadEnd}
        startInLoadingState={true}
        renderError={(errorDomain, errorCode, errorDesc) => (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>Failed to load: {errorDesc}</Text>
            <TouchableOpacity
              style={styles.retryButton}
              onPress={refreshWebView}
            >
              <Text style={styles.retryButtonText}>Retry</Text>
            </TouchableOpacity>
          </View>
        )}
        scalesPageToFit={true}
        allowsInlineMediaPlayback={true}
        mediaPlaybackRequiresUserAction={false}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        mixedContentMode="compatibility"
        userAgent="BilMenu-Mobile-App/1.0"
        // Enable WebView caching for iOS 14+ Service Workers and Cache API
        cacheEnabled={true}
        cacheMode="LOAD_DEFAULT"
        limitsNavigationsToAppBoundDomains={true}
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
      {/* <CacheDebugger webViewRef={webViewRef} /> - TEMPORARILY DISABLED FOR TESTING */}
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
  loadingContainer: {
    position: "absolute",
    top: 100, // Start below the header with more clearance
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: BilMenuTheme.colors.background,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: BilMenuTheme.colors.textWhite,
  },
  errorContainer: {
    position: "absolute",
    top: 100, // Start below the header with more clearance
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: BilMenuTheme.colors.background,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: BilMenuTheme.colors.textWhite,
    textAlign: "center",
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: "#ff9434",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
