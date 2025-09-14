import React from "react";
import { StyleSheet, Alert } from "react-native";
import { WebView } from "react-native-webview";
import { SafeAreaView } from "react-native-safe-area-context";
import { Header } from "@/components/header";
import { useTranslations } from "@/hooks/use-translations";
import { BilMenuTheme } from "@/constants/theme";

export default function HomeScreen() {
  const { language } = useTranslations();

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

  // Build URL with mobile app parameters
  const webappUrl = `https://www.bilmenu.com?mobile=true&lang=${language}&source=mobile-app`;

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <Header />
      <WebView
        source={{ uri: webappUrl }}
        style={styles.webview}
        onMessage={handleMessage}
        onError={handleError}
        onHttpError={handleHttpError}
        startInLoadingState={true}
        scalesPageToFit={true}
        allowsInlineMediaPlayback={true}
        mediaPlaybackRequiresUserAction={false}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        mixedContentMode="compatibility"
        userAgent="BilMenu-Mobile-App/1.0"
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
  webview: {
    flex: 1,
    backgroundColor: BilMenuTheme.colors.background,
  },
});
