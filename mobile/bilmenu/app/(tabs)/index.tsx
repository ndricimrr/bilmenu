import React from "react";
import { StyleSheet, Alert } from "react-native";
import { WebView } from "react-native-webview";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
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

  return (
    <SafeAreaView style={styles.container}>
      <WebView
        source={{ uri: "https://www.bilmenu.com" }}
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
          // Add mobile-specific styling
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
          \`;
          document.head.appendChild(style);
          
          // Notify React Native that page is ready
          window.ReactNativeWebView.postMessage(JSON.stringify({
            type: 'pageReady',
            url: window.location.href
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
    backgroundColor: "#ffffff",
  },
  webview: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
});
