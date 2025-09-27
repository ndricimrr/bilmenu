import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Alert,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Header } from "@/components/header";
import { NotificationToggle } from "@/components/notification-toggle";
import { useTranslations } from "@/hooks/use-translations";
import {
  scheduleLunchNotification,
  scheduleDinnerNotification,
  cancelLunchNotification,
  cancelDinnerNotification,
  useNotifications,
} from "@/hooks/use-notifications";
import { BilMenuTheme } from "@/constants/theme";

export default function SettingsScreen() {
  const { t, language } = useTranslations();
  const router = useRouter();
  useNotifications(); // Initialize notifications
  const [lunchEnabled, setLunchEnabled] = useState(true);
  const [dinnerEnabled, setDinnerEnabled] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load saved notification settings on app start
  useEffect(() => {
    loadNotificationSettings();
  }, []);

  const loadNotificationSettings = async () => {
    try {
      const [lunchSettings, dinnerSettings] = await Promise.all([
        AsyncStorage.getItem("bilmenu-lunch-notifications"),
        AsyncStorage.getItem("bilmenu-dinner-notifications"),
      ]);

      if (lunchSettings !== null) {
        setLunchEnabled(JSON.parse(lunchSettings));
      }
      if (dinnerSettings !== null) {
        setDinnerEnabled(JSON.parse(dinnerSettings));
      }
    } catch (error) {
      console.log("Error loading notification settings:", error);
    } finally {
      setIsLoaded(true);
    }
  };

  const handleLunchToggle = async (value: boolean) => {
    try {
      await AsyncStorage.setItem(
        "bilmenu-lunch-notifications",
        JSON.stringify(value)
      );
      setLunchEnabled(value);

      if (value) {
        await scheduleLunchNotification(language);
        Alert.alert(
          t("lunchReminder"),
          language === "en"
            ? "Lunch notifications enabled! You'll be reminded at 11:30 AM daily."
            : "Öğle yemeği bildirimleri etkinleştirildi! Her gün 11:30'da hatırlatılacaksınız."
        );
      } else {
        await cancelLunchNotification();
        Alert.alert(
          t("lunchReminder"),
          language === "en"
            ? "Lunch notifications disabled."
            : "Öğle yemeği bildirimleri devre dışı bırakıldı."
        );
      }
    } catch (error) {
      console.log("Error saving lunch notification settings:", error);
    }
  };

  const handleDinnerToggle = async (value: boolean) => {
    try {
      await AsyncStorage.setItem(
        "bilmenu-dinner-notifications",
        JSON.stringify(value)
      );
      setDinnerEnabled(value);

      if (value) {
        await scheduleDinnerNotification(language);
        Alert.alert(
          t("dinnerReminder"),
          language === "en"
            ? "Dinner notifications enabled! You'll be reminded at 5:30 PM daily."
            : "Akşam yemeği bildirimleri etkinleştirildi! Her gün 17:30'da hatırlatılacaksınız."
        );
      } else {
        await cancelDinnerNotification();
        Alert.alert(
          t("dinnerReminder"),
          language === "en"
            ? "Dinner notifications disabled."
            : "Akşam yemeği bildirimleri devre dışı bırakıldı."
        );
      }
    } catch (error) {
      console.log("Error saving dinner notification settings:", error);
    }
  };

  // Don't render until settings are loaded
  if (!isLoaded) {
    return null;
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
      <Header />
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.screenHeader}>
          <ThemedText style={styles.title}>{t("settings")}</ThemedText>
          <ThemedText style={styles.subtitle}>
            {language === "en"
              ? "Customize your BilMenu experience"
              : "BilMenu deneyiminizi özelleştirin"}
          </ThemedText>
        </View>

        <ThemedView style={styles.section}>
          <NotificationToggle
            title={t("lunchNotifications")}
            description={
              language === "en"
                ? "Daily reminder at 11:30 AM"
                : "Her gün 11:30'da hatırlatma"
            }
            enabled={lunchEnabled}
            onToggle={handleLunchToggle}
          />

          <NotificationToggle
            title={t("dinnerNotifications")}
            description={
              language === "en"
                ? "Daily reminder at 5:30 PM"
                : "Her gün 17:30'da hatırlatma"
            }
            enabled={dinnerEnabled}
            onToggle={handleDinnerToggle}
          />
        </ThemedView>

        <ThemedView style={styles.section}>
          <ThemedText style={styles.sectionTitle}>
            {language === "en" ? "Legal & Information" : "Yasal ve Bilgi"}
          </ThemedText>

          <TouchableOpacity
            style={styles.navButton}
            onPress={() => router.push("/privacy")}
          >
            <ThemedText style={styles.navButtonText}>
              {language === "en" ? "Privacy Policy" : "Gizlilik Politikası"}
            </ThemedText>
            <ThemedText style={styles.navButtonIcon}>›</ThemedText>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.navButton}
            onPress={() => router.push("/about")}
          >
            <ThemedText style={styles.navButtonText}>
              {language === "en" ? "About BilMenu" : "BilMenu Hakkında"}
            </ThemedText>
            <ThemedText style={styles.navButtonIcon}>›</ThemedText>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.navButton}
            onPress={() => router.push("/attribution")}
          >
            <ThemedText style={styles.navButtonText}>
              {language === "en"
                ? "Contributors & Attribution"
                : "Katkıda Bulunanlar"}
            </ThemedText>
            <ThemedText style={styles.navButtonIcon}>›</ThemedText>
          </TouchableOpacity>
        </ThemedView>

        <ThemedView style={styles.infoCard}>
          <ThemedText style={styles.infoText}>
            {language === "en"
              ? "BilMenu - Bilkent University Cafeteria Menu App"
              : "BilMenu - Bilkent Üniversitesi Kafeterya Menü Uygulaması"}
          </ThemedText>
          <ThemedText style={styles.versionText}>Version 1.0.0</ThemedText>
        </ThemedView>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: BilMenuTheme.colors.background,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: BilMenuTheme.spacing.lg,
    paddingBottom: BilMenuTheme.spacing.xxl, // Extra padding at bottom for better scrolling
  },
  screenHeader: {
    marginBottom: BilMenuTheme.spacing.xl,
    alignItems: "center",
  },
  title: {
    fontSize: BilMenuTheme.typography.title.fontSize,
    fontWeight: BilMenuTheme.typography.title.fontWeight,
    color: BilMenuTheme.colors.textWhite,
    textAlign: "center",
    marginBottom: BilMenuTheme.spacing.sm,
  },
  subtitle: {
    fontSize: BilMenuTheme.typography.body.fontSize,
    color: BilMenuTheme.colors.textMuted,
    textAlign: "center",
    lineHeight: BilMenuTheme.typography.body.lineHeight,
  },
  section: {
    marginBottom: BilMenuTheme.spacing.xl,
    gap: BilMenuTheme.spacing.md,
  },
  sectionTitle: {
    fontSize: BilMenuTheme.typography.subtitle.fontSize,
    fontWeight: BilMenuTheme.typography.subtitle.fontWeight,
    color: BilMenuTheme.colors.textWhite,
    marginBottom: BilMenuTheme.spacing.md,
  },
  navButton: {
    backgroundColor: BilMenuTheme.colors.surface,
    borderRadius: BilMenuTheme.borderRadius.medium,
    padding: BilMenuTheme.spacing.md,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  navButtonText: {
    fontSize: BilMenuTheme.typography.body.fontSize,
    color: BilMenuTheme.colors.text,
    fontWeight: BilMenuTheme.typography.subtitle.fontWeight,
  },
  navButtonIcon: {
    fontSize: 20,
    color: BilMenuTheme.colors.secondary,
    fontWeight: "bold",
  },
  settingCard: {
    backgroundColor: BilMenuTheme.colors.surface,
    borderRadius: BilMenuTheme.borderRadius.large,
    padding: BilMenuTheme.spacing.lg,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  settingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: BilMenuTheme.spacing.sm,
  },
  settingInfo: {
    flex: 1,
    marginRight: BilMenuTheme.spacing.md,
  },
  settingDescription: {
    fontSize: BilMenuTheme.typography.caption.fontSize,
    color: BilMenuTheme.colors.textLight,
    lineHeight: BilMenuTheme.typography.caption.lineHeight,
    marginTop: BilMenuTheme.spacing.xs,
  },
  infoCard: {
    backgroundColor: BilMenuTheme.colors.surfaceLight,
    padding: BilMenuTheme.spacing.lg,
    borderRadius: BilMenuTheme.borderRadius.medium,
    borderWidth: 1,
    borderColor: BilMenuTheme.colors.border,
    alignItems: "center",
  },
  infoText: {
    fontSize: BilMenuTheme.typography.body.fontSize,
    fontWeight: BilMenuTheme.typography.subtitle.fontWeight,
    color: BilMenuTheme.colors.textWhite,
    textAlign: "center",
    marginBottom: BilMenuTheme.spacing.sm,
  },
  versionText: {
    fontSize: BilMenuTheme.typography.caption.fontSize,
    color: BilMenuTheme.colors.textMuted,
  },
});
