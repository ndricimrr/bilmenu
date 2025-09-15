import React from "react";
import {
  StyleSheet,
  ScrollView,
  Linking,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useTranslations } from "@/hooks/use-translations";
import { BilMenuTheme } from "@/constants/theme";

export default function AboutModal() {
  const { language } = useTranslations();
  const router = useRouter();

  const handleEmailPress = () => {
    Linking.openURL("mailto:bilmenudeveloper@gmail.com");
  };

  const handleGitHubPress = () => {
    Linking.openURL("https://github.com/ndricimrr/bilmenu");
  };

  const handleWebsitePress = () => {
    Linking.openURL("https://www.bilmenu.com");
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
          {language === "en" ? "About BilMenu" : "BilMenu Hakkında"}
        </ThemedText>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.screenHeader}>
          <ThemedText style={styles.subtitle}>
            {language === "en"
              ? "Bilkent University Cafeteria Menu App"
              : "Bilkent Üniversitesi Kafeterya Menü Uygulaması"}
          </ThemedText>
        </View>

        <ThemedView style={styles.content}>
          <ThemedText style={styles.sectionTitle}>
            {language === "en" ? "What is BilMenu?" : "BilMenu Nedir?"}
          </ThemedText>
          <ThemedText style={styles.paragraph}>
            {language === "en"
              ? "BilMenu is a mobile application that helps Bilkent University students and staff easily view the daily cafeteria menu with visual meal representations. The app fetches data from the official university cafeteria website and presents it in a user-friendly format."
              : "BilMenu, Bilkent Üniversitesi öğrencilerinin ve personelinin günlük kafeterya menüsünü görsel yemek temsilleriyle kolayca görüntülemesine yardımcı olan bir mobil uygulamadır. Uygulama, resmi üniversite kafeterya web sitesinden veri alır ve kullanıcı dostu bir formatta sunar."}
          </ThemedText>

          <ThemedText style={styles.sectionTitle}>
            {language === "en" ? "Features" : "Özellikler"}
          </ThemedText>
          <ThemedText style={styles.paragraph}>
            {language === "en"
              ? "• View daily cafeteria menu with meal images\n• Get notifications for lunch and dinner times\n• Support for both English and Turkish languages\n• Offline viewing of cached menu data\n• Clean and intuitive user interface"
              : "• Yemek görselleriyle günlük kafeterya menüsünü görüntüleme\n• Öğle ve akşam yemeği saatleri için bildirimler alma\n• İngilizce ve Türkçe dil desteği\n• Önbelleğe alınmış menü verilerini çevrimdışı görüntüleme\n• Temiz ve sezgisel kullanıcı arayüzü"}
          </ThemedText>

          <ThemedText style={styles.sectionTitle}>
            {language === "en" ? "Developer" : "Geliştirici"}
          </ThemedText>
          <ThemedText style={styles.paragraph}>
            {language === "en"
              ? "Developed by Ndricim Rrapi, a former Bilkent University student who created this app to solve the problem of reading long cafeteria menus after exams. The project started in 2017 and continues to serve the university community."
              : "Eski bir Bilkent Üniversitesi öğrencisi olan Ndricim Rrapi tarafından geliştirilmiştir. Bu uygulamayı, sınavlardan sonra uzun kafeterya menülerini okuma sorununu çözmek için oluşturmuştur. Proje 2017'de başlamış ve üniversite topluluğuna hizmet etmeye devam etmektedir."}
          </ThemedText>

          <ThemedText style={styles.sectionTitle}>
            {language === "en"
              ? "Contributions Welcome!"
              : "Katkılarınızı Bekliyoruz!"}
          </ThemedText>
          <ThemedText style={styles.paragraph}>
            {language === "en"
              ? "BilMenu is an open-source project and we welcome contributions from the community! Whether you want to report bugs, suggest new features, add meal images, or help with translations, your input is valuable. This app is made by students, for students, and together we can make it even better."
              : "BilMenu açık kaynaklı bir projedir ve topluluktan katkıları memnuniyetle karşılıyoruz! Hata bildirmek, yeni özellikler önermek, yemek görselleri eklemek veya çevirilere yardım etmek istiyorsanız, katkılarınız değerlidir. Bu uygulama öğrenciler tarafından, öğrenciler için yapılmıştır ve birlikte daha da iyi hale getirebiliriz."}
          </ThemedText>
          <ThemedText style={styles.paragraph}>
            {language === "en"
              ? "Visit our GitHub repository to see how you can contribute, or contact us directly with your ideas and feedback."
              : "Nasıl katkıda bulunabileceğinizi görmek için GitHub deposumuzu ziyaret edin veya fikirlerinizi ve geri bildirimlerinizi doğrudan bizimle paylaşın."}
          </ThemedText>

          <ThemedText style={styles.sectionTitle}>
            {language === "en" ? "Contact & Support" : "İletişim ve Destek"}
          </ThemedText>
          <ThemedText style={styles.paragraph}>
            {language === "en"
              ? "For questions, feedback, or support, please contact us:"
              : "Sorular, geri bildirim veya destek için lütfen bizimle iletişime geçin:"}
          </ThemedText>

          <TouchableOpacity
            style={styles.linkButton}
            onPress={handleEmailPress}
          >
            <ThemedText style={styles.linkText}>
              📧 bilmenudeveloper@gmail.com
            </ThemedText>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.linkButton}
            onPress={handleWebsitePress}
          >
            <ThemedText style={styles.linkText}>🌐 www.bilmenu.com</ThemedText>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.linkButton}
            onPress={handleGitHubPress}
          >
            <ThemedText style={styles.linkText}>💻 GitHub Project</ThemedText>
          </TouchableOpacity>

          <ThemedText style={styles.sectionTitle}>
            {language === "en"
              ? "Important Disclaimer"
              : "Önemli Sorumluluk Reddi"}
          </ThemedText>
          <ThemedText style={styles.disclaimerText}>
            {language === "en"
              ? "This application is an unofficial, third-party app and is not affiliated with, endorsed by, or sponsored by Bilkent University. The app is developed independently by a former student for the convenience of the university community. All meal information is sourced from publicly available data on the university's official cafeteria website. While we strive to provide accurate and up-to-date information, we cannot guarantee the accuracy, completeness, or timeliness of the data displayed. Users should verify important information directly with the university's official sources."
              : "Bu uygulama resmi olmayan, üçüncü taraf bir uygulamadır ve Bilkent Üniversitesi ile bağlantılı değildir, üniversite tarafından desteklenmez veya sponsor edilmez. Uygulama, üniversite topluluğunun kolaylığı için eski bir öğrenci tarafından bağımsız olarak geliştirilmiştir. Tüm yemek bilgileri, üniversitenin resmi kafeterya web sitesindeki kamuya açık verilerden alınmaktadır. Doğru ve güncel bilgi sağlamaya çalışsak da, görüntülenen verilerin doğruluğu, eksiksizliği veya zamanlaması konusunda garanti veremeyiz. Kullanıcılar önemli bilgileri üniversitenin resmi kaynaklarından doğrudan doğrulamalıdır."}
          </ThemedText>

          <ThemedText style={styles.sectionTitle}>
            {language === "en" ? "Version Information" : "Sürüm Bilgileri"}
          </ThemedText>
          <ThemedText style={styles.paragraph}>
            {language === "en"
              ? "Version 1.0.0\nBuilt with React Native and Expo\nLast updated: September 2025"
              : "Sürüm 1.0.0\nReact Native ve Expo ile oluşturulmuştur\nSon güncelleme: Eylül 2025"}
          </ThemedText>

          <ThemedText style={styles.footer}>
            {language === "en"
              ? "Thank you for using BilMenu! 🍽️"
              : "BilMenu'yu kullandığınız için teşekkürler! 🍽️"}
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
  disclaimerText: {
    fontSize: BilMenuTheme.typography.caption.fontSize,
    color: BilMenuTheme.colors.textLight,
    lineHeight: BilMenuTheme.typography.body.lineHeight,
    marginBottom: BilMenuTheme.spacing.md,
    fontStyle: "italic",
    backgroundColor: BilMenuTheme.colors.surfaceLight,
    padding: BilMenuTheme.spacing.md,
    borderRadius: BilMenuTheme.borderRadius.medium,
    borderLeftWidth: 3,
    borderLeftColor: BilMenuTheme.colors.warning,
  },
  linkButton: {
    backgroundColor: BilMenuTheme.colors.primaryLight,
    borderRadius: BilMenuTheme.borderRadius.medium,
    padding: BilMenuTheme.spacing.md,
    marginBottom: BilMenuTheme.spacing.sm,
    alignItems: "center",
  },
  linkText: {
    fontSize: BilMenuTheme.typography.body.fontSize,
    color: BilMenuTheme.colors.textWhite,
    fontWeight: BilMenuTheme.typography.subtitle.fontWeight,
  },
  footer: {
    fontSize: BilMenuTheme.typography.subtitle.fontSize,
    fontWeight: BilMenuTheme.typography.subtitle.fontWeight,
    color: BilMenuTheme.colors.secondary,
    textAlign: "center",
    marginTop: BilMenuTheme.spacing.lg,
  },
});
