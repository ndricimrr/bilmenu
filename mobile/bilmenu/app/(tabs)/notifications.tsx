import React, { useState } from "react";
import { StyleSheet, View, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useTranslations } from "@/hooks/use-translations";
import {
  useNotifications,
  scheduleLunchNotification,
  scheduleDinnerNotification,
  cancelAllNotifications,
} from "@/hooks/use-notifications";
import { Switch } from "react-native";

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
      await cancelAllNotifications();
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
      await cancelAllNotifications();
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
      <ThemedView style={styles.container}>
        <ThemedView style={styles.header}>
          <ThemedText type="title">{t("notifications")}</ThemedText>
          <ThemedText style={styles.subtitle}>
            {language === "en"
              ? "Set up meal reminders for Bilkent University cafeteria"
              : "Bilkent Üniversitesi kafeteryası için yemek hatırlatıcıları ayarlayın"}
          </ThemedText>
        </ThemedView>

        <ThemedView style={styles.section}>
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <ThemedText type="subtitle">{t("lunchNotifications")}</ThemedText>
              <ThemedText style={styles.settingDescription}>
                {language === "en"
                  ? "Daily reminder at 11:30 AM"
                  : "Her gün 11:30'da hatırlatma"}
              </ThemedText>
            </View>
            <Switch
              value={lunchEnabled}
              onValueChange={handleLunchToggle}
              trackColor={{ false: "#767577", true: "#81b0ff" }}
              thumbColor={lunchEnabled ? "#f5dd4b" : "#f4f3f4"}
            />
          </View>

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
              trackColor={{ false: "#767577", true: "#81b0ff" }}
              thumbColor={dinnerEnabled ? "#f5dd4b" : "#f4f3f4"}
            />
          </View>
        </ThemedView>

        <ThemedView style={styles.infoSection}>
          <ThemedText style={styles.infoText}>
            {language === "en"
              ? "Notifications will be sent based on your device's local time zone."
              : "Bildirimler cihazınızın yerel saat dilimine göre gönderilecektir."}
          </ThemedText>
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
  infoSection: {
    backgroundColor: "#f5f5f5",
    padding: 15,
    borderRadius: 8,
  },
  infoText: {
    fontSize: 14,
    opacity: 0.8,
    textAlign: "center",
  },
});
