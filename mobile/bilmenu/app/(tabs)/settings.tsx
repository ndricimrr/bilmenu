import React, { useState } from "react";
import { StyleSheet, View, Alert, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useTranslations } from "@/hooks/use-translations";
import { Switch } from "react-native";

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
      <ThemedView style={styles.container}>
        <ThemedView style={styles.header}>
          <ThemedText type="title">{t("settings")}</ThemedText>
          <ThemedText style={styles.subtitle}>
            {language === "en"
              ? "Customize your BilMenu experience"
              : "BilMenu deneyiminizi özelleştirin"}
          </ThemedText>
        </ThemedView>

        <ThemedView style={styles.section}>
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
              trackColor={{ false: "#767577", true: "#81b0ff" }}
              thumbColor={notificationsEnabled ? "#f5dd4b" : "#f4f3f4"}
            />
          </View>
        </ThemedView>

        <ThemedView style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            {t("language")}
          </ThemedText>

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
        </ThemedView>

        <ThemedView style={styles.infoSection}>
          <ThemedText style={styles.infoText}>
            {language === "en"
              ? "BilMenu - Bilkent University Cafeteria Menu App"
              : "BilMenu - Bilkent Üniversitesi Kafeterya Menü Uygulaması"}
          </ThemedText>
          <ThemedText style={styles.versionText}>Version 1.0.0</ThemedText>
        </ThemedView>
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    marginBottom: 30,
  },
  subtitle: {
    marginTop: 8,
    opacity: 0.7,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    marginBottom: 15,
  },
  settingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  settingInfo: {
    flex: 1,
    marginRight: 15,
  },
  settingDescription: {
    marginTop: 4,
    fontSize: 14,
    opacity: 0.7,
  },
  languageOption: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 15,
    marginBottom: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    backgroundColor: "#f9f9f9",
  },
  selectedLanguage: {
    backgroundColor: "#e3f2fd",
    borderColor: "#2196f3",
  },
  languageText: {
    fontSize: 16,
  },
  selectedLanguageText: {
    fontWeight: "bold",
    color: "#2196f3",
  },
  checkmark: {
    fontSize: 18,
    color: "#2196f3",
    fontWeight: "bold",
  },
  infoSection: {
    backgroundColor: "#f5f5f5",
    padding: 20,
    borderRadius: 8,
    alignItems: "center",
  },
  infoText: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 8,
  },
  versionText: {
    fontSize: 14,
    opacity: 0.7,
  },
});
