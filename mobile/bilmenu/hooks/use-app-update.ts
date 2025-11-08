import { useEffect, useRef } from "react";
import { Alert, Linking, Platform } from "react-native";
import Constants from "expo-constants";
import { useTranslations } from "@/hooks/use-translations";

export function useAppUpdate() {
  const { t } = useTranslations();
  const hasCheckedUpdates = useRef(false);

  useEffect(() => {
    if (!hasCheckedUpdates.current) {
      hasCheckedUpdates.current = true;
      checkForUpdates();
    }
  }, []);

  const checkForUpdates = async () => {
    try {
      // Get current version from app
      const currentVersion = Constants.expoConfig?.version || "1.0.0";
      console.log(`[Update Check ${Platform.OS}] Current version: ${currentVersion}`);
      
      // Get latest version from GitHub
      const latestVersion = await getLatestVersionFromGitHub();
      console.log(`[Update Check ${Platform.OS}] Latest version: ${latestVersion}`);

      const isNewer = isNewerVersion(latestVersion, currentVersion);
      console.log(`[Update Check ${Platform.OS}] Is newer: ${isNewer}`);

      if (isNewer) {
        console.log(`[Update Check ${Platform.OS}] Showing update modal`);
        showUpdateModal();
      } else {
        console.log(`[Update Check ${Platform.OS}] No update needed`);
      }
    } catch (error) {
      // Log error instead of silent fail for debugging
      console.error(`[Update Check ${Platform.OS}] Error:`, error);
      // Still fail silently for users, but we can see it in logs
    }
  };

  const getLatestVersionFromGitHub = async () => {
    try {
      console.log(`[Update Check ${Platform.OS}] Fetching version from GitHub...`);
      const response = await fetch(
        "https://raw.githubusercontent.com/ndricimrr/bilmenu/refs/heads/main/mobile/bilmenu/app.json"
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      const version = data.expo?.version || "1.0.0";
      console.log(`[Update Check ${Platform.OS}] Successfully fetched version: ${version}`);
      return version;
    } catch (error) {
      console.error(`[Update Check ${Platform.OS}] Fetch error:`, error);
      throw error;
    }
  };

  const isNewerVersion = (latestVersion: string, currentVersion: string) => {
    const latest = latestVersion.split(".").map(Number);
    const current = currentVersion.split(".").map(Number);

    for (let i = 0; i < Math.max(latest.length, current.length); i++) {
      const latestPart = latest[i] || 0;
      const currentPart = current[i] || 0;

      if (latestPart > currentPart) {
        return true;
      }
      if (latestPart < currentPart) {
        return false;
      }
    }
    return false;
  };

  const showUpdateModal = () => {
    Alert.alert(t("update.title"), t("update.message"), [
      { text: t("update.later"), style: "cancel" },
      { text: t("update.update"), onPress: openAppStore },
    ]);
  };

  const openAppStore = () => {
    const url =
      Platform.OS === "ios"
        ? "https://apps.apple.com/de/app/bilmenu/id6752549798"
        : "https://play.google.com/store/apps/details?id=com.bilmenu.app";

    Linking.openURL(url);
  };
}
