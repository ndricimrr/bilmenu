import { useEffect, useRef } from "react";
import { Alert, Linking, Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTranslations } from "@/hooks/use-translations";

export function useAppRating() {
  const { t } = useTranslations();
  const hasShownModal = useRef(false);

  useEffect(() => {
    if (!hasShownModal.current) {
      hasShownModal.current = true;
      checkShouldShowRating();
    }
  }, []);

  const checkShouldShowRating = async () => {
    try {
      const [hasRated, appOpenCount, lastRatingPrompt] = await Promise.all([
        AsyncStorage.getItem("bilmenu-has-rated"),
        AsyncStorage.getItem("bilmenu-app-open-count"),
        AsyncStorage.getItem("bilmenu-last-rating-prompt"),
      ]);

      // Don't ask if already rated
      if (hasRated === "true") {
        return;
      }

      const openCount = parseInt(appOpenCount || "0") + 1;
      const lastPrompt = lastRatingPrompt
        ? new Date(lastRatingPrompt)
        : new Date(0);
      const daysSinceLastPrompt =
        (Date.now() - lastPrompt.getTime()) / (1000 * 60 * 60 * 24);

      // Show rating prompt if:
      // - App opened 10+ times AND
      // - Haven't asked in 30+ days AND
      // - Not on first few opens
      if (openCount >= 10 && daysSinceLastPrompt >= 30 && openCount % 5 === 0) {
        showRatingModal();
        await AsyncStorage.setItem(
          "bilmenu-last-rating-prompt",
          new Date().toISOString()
        );
      }

      // Update open count
      await AsyncStorage.setItem(
        "bilmenu-app-open-count",
        openCount.toString()
      );
    } catch (error) {
      // Silent fail
    }
  };

  const showRatingModal = () => {
    Alert.alert(t("rating.title"), t("rating.message"), [
      { text: t("rating.notNow"), style: "cancel" },
      { text: t("rating.rateApp"), onPress: openAppStore },
      { text: t("rating.alreadyRated"), onPress: markAsRated },
    ]);
  };

  const openAppStore = () => {
    // Use the direct store URLs without action=write-review to avoid Apple changes
    const url =
      Platform.OS === "ios"
        ? "https://apps.apple.com/de/app/bilmenu/id6752549798"
        : "https://play.google.com/store/apps/details?id=com.bilmenu.app";

    Linking.openURL(url);
    markAsRated();
  };

  const markAsRated = async () => {
    await AsyncStorage.setItem("bilmenu-has-rated", "true");
  };
}
