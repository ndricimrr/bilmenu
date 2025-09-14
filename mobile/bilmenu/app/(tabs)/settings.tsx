import React, { useState, useEffect } from "react";
import { StyleSheet, View, Alert, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Header } from "@/components/header";
import { useTranslations } from "@/hooks/use-translations";
import { Switch } from "react-native";
import { BilMenuTheme } from "@/constants/theme";

export default function SettingsScreen() {
  const { t, language } = useTranslations();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load saved notification settings on app start
  useEffect(() => {
    loadNotificationSettings();
  }, []);

  const loadNotificationSettings = async () => {
    try {
      const savedSettings = await AsyncStorage.getItem(
        "bilmenu-notifications-enabled"
      );
      if (savedSettings !== null) {
        setNotificationsEnabled(JSON.parse(savedSettings));
      }
    } catch (error) {
      console.log("Error loading notification settings:", error);
    } finally {
      setIsLoaded(true);
    }
  };

  const handleNotificationsToggle = async (value: boolean) => {
    try {
      await AsyncStorage.setItem(
        "bilmenu-notifications-enabled",
        JSON.stringify(value)
      );
      setNotificationsEnabled(value);
      Alert.alert(
        t("notificationsEnabled"),
        value
          ? language === "en"
            ? "Notifications enabled"
            : "Bildirimler etkinleştirildi"
          : language === "en"
          ? "Notifications disabled"
          : "Bildirimler devre dışı bırakıldı"
      );
    } catch (error) {
      console.log("Error saving notification settings:", error);
    }
  };

  // Don't render until settings are loaded
  if (!isLoaded) {
    return null;
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header />
      <View style={styles.container}>
        <View style={styles.screenHeader}>
          <ThemedText style={styles.title}>{t("settings")}</ThemedText>
          <ThemedText style={styles.subtitle}>
            {language === "en"
              ? "Customize your BilMenu experience"
              : "BilMenu deneyiminizi özelleştirin"}
          </ThemedText>
        </View>

        <ThemedView style={styles.section}>
          <View style={styles.settingCard}>
            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <ThemedText type="subtitle">
                  {t("notificationsEnabled")}
                </ThemedText>
                <ThemedText style={styles.settingDescription}>
                  {language === "en"
                    ? "Enable or disable all notifications"
                    : "Tüm bildirimleri etkinleştir veya devre dışı bırak"}
                </ThemedText>
              </View>
              <Switch
                value={notificationsEnabled}
                onValueChange={handleNotificationsToggle}
                trackColor={{
                  false: BilMenuTheme.colors.switchTrack,
                  true: BilMenuTheme.colors.secondary,
                }}
                thumbColor={
                  notificationsEnabled
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
              ? "BilMenu - Bilkent University Cafeteria Menu App"
              : "BilMenu - Bilkent Üniversitesi Kafeterya Menü Uygulaması"}
          </ThemedText>
          <ThemedText style={styles.versionText}>Version 1.0.0</ThemedText>
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
  sectionTitle: {
    marginBottom: BilMenuTheme.spacing.md,
    color: BilMenuTheme.colors.textWhite,
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
