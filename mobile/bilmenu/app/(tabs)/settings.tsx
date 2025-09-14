import React, { useState } from "react";
import { StyleSheet, View, Alert, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useTranslations } from "@/hooks/use-translations";
import { Switch } from "react-native";
import { BilMenuTheme } from "@/constants/theme";

export default function SettingsScreen() {
  const { t, language, changeLanguage } = useTranslations();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const handleLanguageChange = (newLanguage: "en" | "tr") => {
    changeLanguage(newLanguage);
    Alert.alert(
      t("language"),
      newLanguage === "en"
        ? "Language changed to English"
        : "Dil Türkçe olarak değiştirildi"
    );
  };

  const handleNotificationsToggle = (value: boolean) => {
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
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
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

        <ThemedView style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            {t("language")}
          </ThemedText>

          <View style={styles.languageCard}>
            <TouchableOpacity
              style={[
                styles.languageOption,
                language === "en" && styles.selectedLanguage,
              ]}
              onPress={() => handleLanguageChange("en")}
            >
              <ThemedText
                style={[
                  styles.languageText,
                  language === "en" && styles.selectedLanguageText,
                ]}
              >
                🇺🇸 {t("english")}
              </ThemedText>
              {language === "en" && (
                <ThemedText style={styles.checkmark}>✓</ThemedText>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.languageOption,
                language === "tr" && styles.selectedLanguage,
              ]}
              onPress={() => handleLanguageChange("tr")}
            >
              <ThemedText
                style={[
                  styles.languageText,
                  language === "tr" && styles.selectedLanguageText,
                ]}
              >
                🇹🇷 {t("turkish")}
              </ThemedText>
              {language === "tr" && (
                <ThemedText style={styles.checkmark}>✓</ThemedText>
              )}
            </TouchableOpacity>
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
  header: {
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
  languageCard: {
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
    gap: BilMenuTheme.spacing.sm,
  },
  languageOption: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: BilMenuTheme.spacing.md,
    paddingHorizontal: BilMenuTheme.spacing.md,
    borderRadius: BilMenuTheme.borderRadius.medium,
    borderWidth: 1,
    borderColor: BilMenuTheme.colors.border,
    backgroundColor: BilMenuTheme.colors.surfaceLight,
  },
  selectedLanguage: {
    backgroundColor: BilMenuTheme.colors.secondaryLight,
    borderColor: BilMenuTheme.colors.secondary,
  },
  languageText: {
    fontSize: BilMenuTheme.typography.body.fontSize,
    color: BilMenuTheme.colors.text,
  },
  selectedLanguageText: {
    fontWeight: BilMenuTheme.typography.subtitle.fontWeight,
    color: BilMenuTheme.colors.primary,
  },
  checkmark: {
    fontSize: BilMenuTheme.typography.subtitle.fontSize,
    color: BilMenuTheme.colors.secondary,
    fontWeight: BilMenuTheme.typography.subtitle.fontWeight,
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
