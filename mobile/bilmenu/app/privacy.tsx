import React from "react";
import {
  StyleSheet,
  ScrollView,
  Linking,
  View,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useTranslations } from "@/hooks/use-translations";
import { BilMenuTheme } from "@/constants/theme";

export default function PrivacyModal() {
  const { t, language } = useTranslations();
  const router = useRouter();

  const handleEmailPress = () => {
    Linking.openURL("mailto:ndricimrr@gmail.com");
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
      {/* Custom Header with Back Button */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <ThemedText style={styles.backButtonText}>‹</ThemedText>
        </TouchableOpacity>
        <ThemedText style={styles.headerTitle}>
          {language === "en" ? "Privacy Policy" : "Gizlilik Politikası"}
        </ThemedText>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.screenHeader}>
          <ThemedText style={styles.title}>
            {language === "en" ? "Privacy Policy" : "Gizlilik Politikası"}
          </ThemedText>
          <ThemedText style={styles.subtitle}>
            {language === "en"
              ? "How we handle your information"
              : "Bilgilerinizi nasıl işlediğimiz"}
          </ThemedText>
        </View>

        <ThemedView style={styles.content}>
          <ThemedText style={styles.sectionTitle}>
            {language === "en"
              ? "Information We Don't Collect"
              : "Toplamadığımız Bilgiler"}
          </ThemedText>
          <ThemedText style={styles.paragraph}>
            {language === "en"
              ? "We do not collect any personally identifiable information from users of our App. We do not use cookies, analytics tools, or any other means to track users' online activities."
              : "Uygulamamızın kullanıcılarından herhangi bir kişisel olarak tanımlanabilir bilgi toplamıyoruz. Çerezler, analitik araçlar veya kullanıcıların çevrimiçi etkinliklerini izlemek için başka herhangi bir araç kullanmıyoruz."}
          </ThemedText>

          <ThemedText style={styles.sectionTitle}>
            {language === "en" ? "Data Source" : "Veri Kaynağı"}
          </ThemedText>
          <ThemedText style={styles.paragraph}>
            {language === "en"
              ? "Our App simply visualizes data sourced from Bilkent University's official cafeteria website. This data is used solely for the purpose of providing users with meal information within the App."
              : "Uygulamamız, Bilkent Üniversitesi'nin resmi kafeterya web sitesinden alınan verileri görselleştirir. Bu veriler yalnızca kullanıcılara uygulama içinde yemek bilgisi sağlama amacıyla kullanılır."}
          </ThemedText>

          <ThemedText style={styles.sectionTitle}>
            {language === "en" ? "Notifications" : "Bildirimler"}
          </ThemedText>
          <ThemedText style={styles.paragraph}>
            {language === "en"
              ? "We may send you local notifications to remind you about meal times. These notifications are stored locally on your device and are not transmitted to any external servers."
              : "Yemek saatleri hakkında sizi bilgilendirmek için yerel bildirimler gönderebiliriz. Bu bildirimler cihazınızda yerel olarak saklanır ve herhangi bir harici sunucuya iletilmez."}
          </ThemedText>

          <ThemedText style={styles.sectionTitle}>
            {language === "en"
              ? "Third-Party Links"
              : "Üçüncü Taraf Bağlantıları"}
          </ThemedText>
          <ThemedText style={styles.paragraph}>
            {language === "en"
              ? "Our App may contain links to third-party websites. Please be aware that we are not responsible for the privacy practices of such other sites. We encourage users to read the privacy statements of each website that collects personally identifiable information."
              : "Uygulamamız üçüncü taraf web sitelerine bağlantılar içerebilir. Bu tür diğer sitelerin gizlilik uygulamalarından sorumlu olmadığımızı lütfen unutmayın. Kullanıcıları, kişisel olarak tanımlanabilir bilgi toplayan her web sitesinin gizlilik beyanlarını okumaya teşvik ediyoruz."}
          </ThemedText>

          <ThemedText style={styles.sectionTitle}>
            {language === "en" ? "Contact Us" : "Bizimle İletişime Geçin"}
          </ThemedText>
          <ThemedText style={styles.paragraph}>
            {language === "en"
              ? "If you have any questions about this Privacy Policy, please contact us at "
              : "Bu Gizlilik Politikası hakkında herhangi bir sorunuz varsa, lütfen bizimle iletişime geçin: "}
            <ThemedText style={styles.emailLink} onPress={handleEmailPress}>
              ndricimrr@gmail.com
            </ThemedText>
          </ThemedText>

          <ThemedText style={styles.lastUpdated}>
            {language === "en"
              ? "Last updated: January 2025"
              : "Son güncelleme: Ocak 2025"}
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
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: BilMenuTheme.spacing.lg,
    paddingVertical: BilMenuTheme.spacing.md,
    backgroundColor: BilMenuTheme.colors.primary,
    borderBottomWidth: 1,
    borderBottomColor: BilMenuTheme.colors.border,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: BilMenuTheme.colors.primaryLight,
    alignItems: "center",
    justifyContent: "center",
  },
  backButtonText: {
    fontSize: 24,
    color: BilMenuTheme.colors.textWhite,
    fontWeight: "bold",
  },
  headerTitle: {
    fontSize: BilMenuTheme.typography.subtitle.fontSize,
    fontWeight: BilMenuTheme.typography.subtitle.fontWeight,
    color: BilMenuTheme.colors.textWhite,
  },
  placeholder: {
    width: 40,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: BilMenuTheme.spacing.lg,
    paddingBottom: BilMenuTheme.spacing.xxl,
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
  content: {
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
  sectionTitle: {
    fontSize: BilMenuTheme.typography.subtitle.fontSize,
    fontWeight: BilMenuTheme.typography.subtitle.fontWeight,
    color: BilMenuTheme.colors.text,
    marginTop: BilMenuTheme.spacing.lg,
    marginBottom: BilMenuTheme.spacing.sm,
  },
  paragraph: {
    fontSize: BilMenuTheme.typography.body.fontSize,
    color: BilMenuTheme.colors.textLight,
    lineHeight: BilMenuTheme.typography.body.lineHeight,
    marginBottom: BilMenuTheme.spacing.md,
  },
  emailLink: {
    color: BilMenuTheme.colors.secondary,
    textDecorationLine: "underline",
  },
  lastUpdated: {
    fontSize: BilMenuTheme.typography.caption.fontSize,
    color: BilMenuTheme.colors.textMuted,
    textAlign: "center",
    marginTop: BilMenuTheme.spacing.lg,
    fontStyle: "italic",
  },
});
