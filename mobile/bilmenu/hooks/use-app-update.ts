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
      // Get latest version from GitHub
      const latestVersion = await getLatestVersionFromGitHub();

      if (isNewerVersion(latestVersion, currentVersion)) {
        showUpdateModal();
      }
    } catch (error) {
      // Silent fail
    }
  };

  const getLatestVersionFromGitHub = async () => {
    try {
      const response = await fetch(
        "https://raw.githubusercontent.com/ndricimrr/bilmenu/refs/heads/main/mobile/bilmenu/app.json"
      );
      const data = await response.json();
      return data.expo?.version || "1.0.0";
    } catch (error) {
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
