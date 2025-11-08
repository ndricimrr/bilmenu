import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Alert,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";
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
  
  // TEMPORARY: Test notification times
  const [lunchTestTime, setLunchTestTime] = useState("16:44");
  const [dinnerTestTime, setDinnerTestTime] = useState("16:45");

  // Load saved notification settings on app start
  useEffect(() => {
    loadNotificationSettings();
  }, []);

  const loadNotificationSettings = async () => {
    try {
      const [lunchSettings, dinnerSettings, lunchTime, dinnerTime] = await Promise.all([
        AsyncStorage.getItem("bilmenu-lunch-notifications"),
        AsyncStorage.getItem("bilmenu-dinner-notifications"),
        AsyncStorage.getItem("bilmenu-lunch-test-time"),
        AsyncStorage.getItem("bilmenu-dinner-test-time"),
      ]);

      if (lunchSettings !== null) {
        setLunchEnabled(JSON.parse(lunchSettings));
      }
      if (dinnerSettings !== null) {
        setDinnerEnabled(JSON.parse(dinnerSettings));
      }
      if (lunchTime) {
        setLunchTestTime(lunchTime);
      }
      if (dinnerTime) {
        setDinnerTestTime(dinnerTime);
      }
    } catch (error) {
      console.log("Error loading notification settings:", error);
    } finally {
      setIsLoaded(true);
    }
  };

  const handleTestTimeChange = async (type: "lunch" | "dinner", time: string) => {
    try {
      // Validate time format (HH:MM)
      const timeRegex = /^([0-1]?[0-9]|2[0-3]):([0-5][0-9])$/;
      if (!timeRegex.test(time)) {
        Alert.alert(
          language === "en" ? "Invalid Time" : "Geçersiz Zaman",
          language === "en"
            ? "Please enter time in HH:MM format (e.g., 16:44)"
            : "Lütfen zamanı HH:MM formatında girin (örn: 16:44)"
        );
        return;
      }

      const key = type === "lunch" ? "bilmenu-lunch-test-time" : "bilmenu-dinner-test-time";
      await AsyncStorage.setItem(key, time);
      
      if (type === "lunch") {
        setLunchTestTime(time);
      } else {
        setDinnerTestTime(time);
      }

      // Reschedule notification if enabled
      if (type === "lunch" && lunchEnabled) {
        await cancelLunchNotification();
        await scheduleLunchNotification(language);
      } else if (type === "dinner" && dinnerEnabled) {
        await cancelDinnerNotification();
        await scheduleDinnerNotification(language);
      }

      Alert.alert(
        language === "en" ? "Time Updated" : "Zaman Güncellendi",
        language === "en"
          ? `Notification rescheduled for ${time}`
          : `Bildirim ${time} için yeniden planlandı`
      );
    } catch (error) {
      console.log("Error saving test time:", error);
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

        {/* TEMPORARY: Test notification times - Remove after testing */}
        <ThemedView style={styles.section}>
          <ThemedText style={styles.sectionTitle}>
            {language === "en" ? "🧪 Test Notification Times" : "🧪 Test Bildirim Zamanları"}
          </ThemedText>
          <ThemedText style={styles.testDescription}>
            {language === "en"
              ? "Set custom times for testing (format: HH:MM)"
              : "Test için özel zamanlar belirleyin (format: HH:MM)"}
          </ThemedText>
          
          <View style={styles.testTimeRow}>
            <ThemedText style={styles.testTimeLabel}>
              {language === "en" ? "Lunch:" : "Öğle:"}
            </ThemedText>
            <TextInput
              style={styles.testTimeInput}
              value={lunchTestTime}
              onChangeText={(text) => setLunchTestTime(text)}
              onBlur={() => handleTestTimeChange("lunch", lunchTestTime)}
              placeholder="16:44"
              placeholderTextColor={BilMenuTheme.colors.textLight}
              keyboardType="numeric"
            />
            <TouchableOpacity
              style={styles.testTimeButton}
              onPress={() => handleTestTimeChange("lunch", lunchTestTime)}
            >
              <ThemedText style={styles.testTimeButtonText}>
                {language === "en" ? "Set" : "Ayarla"}
              </ThemedText>
            </TouchableOpacity>
          </View>

          <View style={styles.testTimeRow}>
            <ThemedText style={styles.testTimeLabel}>
              {language === "en" ? "Dinner:" : "Akşam:"}
            </ThemedText>
            <TextInput
              style={styles.testTimeInput}
              value={dinnerTestTime}
              onChangeText={(text) => setDinnerTestTime(text)}
              onBlur={() => handleTestTimeChange("dinner", dinnerTestTime)}
              placeholder="16:45"
              placeholderTextColor={BilMenuTheme.colors.textLight}
              keyboardType="numeric"
            />
            <TouchableOpacity
              style={styles.testTimeButton}
              onPress={() => handleTestTimeChange("dinner", dinnerTestTime)}
            >
              <ThemedText style={styles.testTimeButtonText}>
                {language === "en" ? "Set" : "Ayarla"}
              </ThemedText>
            </TouchableOpacity>
          </View>
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
          <ThemedText style={styles.versionText}>
            Version {Constants.expoConfig?.version || "1.0.0"}
          </ThemedText>
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
  testDescription: {
    fontSize: BilMenuTheme.typography.caption.fontSize,
    color: BilMenuTheme.colors.textLight,
    marginBottom: BilMenuTheme.spacing.md,
    fontStyle: "italic",
  },
  testTimeRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: BilMenuTheme.spacing.md,
    gap: BilMenuTheme.spacing.sm,
  },
  testTimeLabel: {
    fontSize: BilMenuTheme.typography.body.fontSize,
    color: BilMenuTheme.colors.text,
    minWidth: 60,
  },
  testTimeInput: {
    flex: 1,
    backgroundColor: BilMenuTheme.colors.surfaceLight,
    borderRadius: BilMenuTheme.borderRadius.medium,
    padding: BilMenuTheme.spacing.md,
    fontSize: BilMenuTheme.typography.body.fontSize,
    color: BilMenuTheme.colors.text,
    borderWidth: 1,
    borderColor: BilMenuTheme.colors.border,
  },
  testTimeButton: {
    backgroundColor: BilMenuTheme.colors.secondary,
    borderRadius: BilMenuTheme.borderRadius.medium,
    paddingHorizontal: BilMenuTheme.spacing.md,
    paddingVertical: BilMenuTheme.spacing.sm,
  },
  testTimeButtonText: {
    fontSize: BilMenuTheme.typography.body.fontSize,
    color: BilMenuTheme.colors.textWhite,
    fontWeight: "600",
  },
});
