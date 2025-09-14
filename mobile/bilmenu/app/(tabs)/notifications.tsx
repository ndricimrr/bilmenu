import React, { useState } from "react";
import { StyleSheet, View, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Header } from "@/components/header";
import { useTranslations } from "@/hooks/use-translations";
import {
  useNotifications,
  scheduleLunchNotification,
  scheduleDinnerNotification,
  cancelLunchNotification,
  cancelDinnerNotification,
} from "@/hooks/use-notifications";
import { Switch } from "react-native";
import { BilMenuTheme } from "@/constants/theme";

export default function NotificationsScreen() {
  const { t, language } = useTranslations();
  const { expoPushToken } = useNotifications();
  const [lunchEnabled, setLunchEnabled] = useState(true);
  const [dinnerEnabled, setDinnerEnabled] = useState(true);

  const handleLunchToggle = async (value: boolean) => {
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
  };

  const handleDinnerToggle = async (value: boolean) => {
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
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header />
      <View style={styles.container}>
        <View style={styles.screenHeader}>
          <ThemedText style={styles.title}>{t("notifications")}</ThemedText>
          <ThemedText style={styles.subtitle}>
            {language === "en"
              ? "Set up meal reminders for Bilkent University cafeteria"
              : "Bilkent Üniversitesi kafeteryası için yemek hatırlatıcıları ayarlayın"}
          </ThemedText>
        </View>

        <ThemedView style={styles.section}>
          <View style={styles.settingCard}>
            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <ThemedText type="subtitle">
                  {t("lunchNotifications")}
                </ThemedText>
                <ThemedText style={styles.settingDescription}>
                  {language === "en"
                    ? "Daily reminder at 11:30 AM"
                    : "Her gün 11:30'da hatırlatma"}
                </ThemedText>
              </View>
              <Switch
                value={lunchEnabled}
                onValueChange={handleLunchToggle}
                trackColor={{
                  false: BilMenuTheme.colors.switchTrack,
                  true: BilMenuTheme.colors.secondary,
                }}
                thumbColor={
                  lunchEnabled
                    ? BilMenuTheme.colors.switchThumbActive
                    : BilMenuTheme.colors.switchThumb
                }
              />
            </View>
          </View>

          <View style={styles.settingCard}>
            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <ThemedText type="subtitle">
                  {t("dinnerNotifications")}
                </ThemedText>
                <ThemedText style={styles.settingDescription}>
                  {language === "en"
                    ? "Daily reminder at 5:30 PM"
                    : "Her gün 17:30'da hatırlatma"}
                </ThemedText>
              </View>
              <Switch
                value={dinnerEnabled}
                onValueChange={handleDinnerToggle}
                trackColor={{
                  false: BilMenuTheme.colors.switchTrack,
                  true: BilMenuTheme.colors.secondary,
                }}
                thumbColor={
                  dinnerEnabled
                    ? BilMenuTheme.colors.switchThumbActive
                    : BilMenuTheme.colors.switchThumb
                }
              />
            </View>
          </View>
        </ThemedView>

        <ThemedView style={styles.infoCard}>
          <ThemedText style={styles.infoText}>
            {language === "en"
              ? "Notifications will be sent based on your device's local time zone."
              : "Bildirimler cihazınızın yerel saat dilimine göre gönderilecektir."}
          </ThemedText>
        </ThemedView>
      </View>
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
    padding: BilMenuTheme.spacing.lg,
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
  settingTitle: {
    fontSize: BilMenuTheme.typography.subtitle.fontSize,
    fontWeight: BilMenuTheme.typography.subtitle.fontWeight,
    color: BilMenuTheme.colors.text,
    marginBottom: BilMenuTheme.spacing.xs,
  },
  settingDescription: {
    fontSize: BilMenuTheme.typography.caption.fontSize,
    color: BilMenuTheme.colors.textLight,
    lineHeight: BilMenuTheme.typography.caption.lineHeight,
  },
  infoCard: {
    backgroundColor: BilMenuTheme.colors.surfaceLight,
    padding: BilMenuTheme.spacing.lg,
    borderRadius: BilMenuTheme.borderRadius.medium,
    borderWidth: 1,
    borderColor: BilMenuTheme.colors.border,
  },
  infoText: {
    fontSize: BilMenuTheme.typography.caption.fontSize,
    color: BilMenuTheme.colors.textMuted,
    textAlign: "center",
    lineHeight: BilMenuTheme.typography.caption.lineHeight,
  },
});
