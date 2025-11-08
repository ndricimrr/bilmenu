import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import * as SplashScreen from "expo-splash-screen";

import { useColorScheme } from "@/hooks/use-color-scheme";
import { LanguageProvider, useLanguage } from "@/contexts/LanguageContext";
import { initializeNotifications } from "@/hooks/use-notifications";
import { useAppUpdate } from "@/hooks/use-app-update";
import { useAppRating } from "@/hooks/use-app-rating";

// Prevent the splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

export const unstable_settings = {
  anchor: "(tabs)",
};

function AppContent() {
  const colorScheme = useColorScheme();
  const { language } = useLanguage();

  // Initialize notifications when app starts and language is available
  // This runs in the background and doesn't block the UI
  useEffect(() => {
    initializeNotifications(language).catch((error) => {
      console.error("Error initializing notifications:", error);
    });
  }, [language]);

  // Check for app updates
  useAppUpdate();

  // Check for app rating
  useAppRating();

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="privacy"
          options={{
            presentation: "modal",
            headerShown: false,
            title: "Privacy Policy",
          }}
        />
        <Stack.Screen
          name="about"
          options={{
            presentation: "modal",
            headerShown: false,
            title: "About BilMenu",
          }}
        />
        <Stack.Screen
          name="attribution"
          options={{
            presentation: "modal",
            headerShown: false,
            title: "Contributors & Attribution",
          }}
        />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}
