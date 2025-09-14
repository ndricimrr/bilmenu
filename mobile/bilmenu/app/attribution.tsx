import React from "react";
import { StyleSheet, View, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Header } from "@/components/header";
import { useTranslations } from "@/hooks/use-translations";
import { BilMenuTheme } from "@/constants/theme";

export default function AttributionScreen() {
  const { t, language } = useTranslations();
  const router = useRouter();

  // Mock contributors data - you can replace this with real data
  const contributors = [
    { name: "Ahmet Yılmaz", contribution: "Meal Image Contributions" },
    { name: "Fatma Demir", contribution: "Menu Data Verification" },
    { name: "Mehmet Kaya", contribution: "UI/UX Feedback" },
    { name: "Ayşe Özkan", contribution: "Translation Support" },
    { name: "Can Arslan", contribution: "Bug Reports & Testing" },
  ];

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
          {language === "en"
            ? "Contributors & Attribution"
            : "Katkıda Bulunanlar"}
        </ThemedText>
        <View style={styles.placeholder} />
      </View>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.screenHeader}>
          <ThemedText style={styles.title}>
            {language === "en"
              ? "Contributors & Attribution"
              : "Katkıda Bulunanlar"}
          </ThemedText>
          <ThemedText style={styles.subtitle}>
            {language === "en"
              ? "Thank you to everyone who helped make BilMenu better"
              : "BilMenu'yu daha iyi hale getirmeye yardımcı olan herkese teşekkürler"}
          </ThemedText>
        </View>

        <ThemedView style={styles.section}>
          <ThemedText style={styles.sectionTitle}>
            {language === "en"
              ? "Image Contributors"
              : "Görsel Katkıda Bulunanlar"}
          </ThemedText>
          <ThemedText style={styles.sectionDescription}>
            {language === "en"
              ? "These amazing people contributed meal photos to help complete our image collection:"
              : "Bu harika insanlar, görsel koleksiyonumuzu tamamlamaya yardımcı olmak için yemek fotoğrafları katkısında bulundu:"}
          </ThemedText>

          {contributors.map((contributor, index) => (
            <View key={index} style={styles.contributorCard}>
              <ThemedText style={styles.contributorName}>
                {contributor.name}
              </ThemedText>
              <ThemedText style={styles.contributorContribution}>
                {contributor.contribution}
              </ThemedText>
            </View>
          ))}
        </ThemedView>

        <ThemedView style={styles.section}>
          <ThemedText style={styles.sectionTitle}>
            {language === "en"
              ? "How to Contribute"
              : "Nasıl Katkıda Bulunulur"}
          </ThemedText>
          <ThemedText style={styles.sectionDescription}>
            {language === "en"
              ? "Want to help improve BilMenu? You can contribute by:"
              : "BilMenu'yu geliştirmeye yardımcı olmak ister misiniz? Şu şekillerde katkıda bulunabilirsiniz:"}
          </ThemedText>

          <View style={styles.contributionList}>
            <View style={styles.contributionItem}>
              <ThemedText style={styles.contributionBullet}>•</ThemedText>
              <ThemedText style={styles.contributionText}>
                {language === "en"
                  ? "Submitting photos of missing meals"
                  : "Eksik yemek fotoğrafları gönderme"}
              </ThemedText>
            </View>
            <View style={styles.contributionItem}>
              <ThemedText style={styles.contributionBullet}>•</ThemedText>
              <ThemedText style={styles.contributionText}>
                {language === "en"
                  ? "Reporting bugs or suggesting improvements"
                  : "Hata bildirme veya iyileştirme önerileri"}
              </ThemedText>
            </View>
            <View style={styles.contributionItem}>
              <ThemedText style={styles.contributionBullet}>•</ThemedText>
              <ThemedText style={styles.contributionText}>
                {language === "en"
                  ? "Sharing feedback about the app"
                  : "Uygulama hakkında geri bildirim paylaşma"}
              </ThemedText>
            </View>
          </View>
        </ThemedView>

        <ThemedView style={styles.section}>
          <ThemedText style={styles.sectionTitle}>
            {language === "en" ? "Recognition" : "Tanınma"}
          </ThemedText>
          <ThemedText style={styles.sectionDescription}>
            {language === "en"
              ? "Contributors are recognized in this section and may be featured in app updates and social media posts. Your name will appear exactly as you provide it when submitting images."
              : "Katkıda bulunanlar bu bölümde tanınır ve uygulama güncellemelerinde ve sosyal medya gönderilerinde yer alabilir. Adınız, görsel gönderirken sağladığınız şekilde görünecektir."}
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
    backgroundColor: BilMenuTheme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: BilMenuTheme.colors.border,
  },
  backButton: {
    padding: BilMenuTheme.spacing.sm,
  },
  backButtonText: {
    fontSize: 24,
    color: BilMenuTheme.colors.text,
    fontWeight: "bold",
  },
  headerTitle: {
    fontSize: BilMenuTheme.typography.subtitle.fontSize,
    fontWeight: BilMenuTheme.typography.subtitle.fontWeight,
    color: BilMenuTheme.colors.text,
    textAlign: "center",
    flex: 1,
  },
  placeholder: {
    width: 40, // Same width as back button to center the title
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: BilMenuTheme.spacing.md,
    paddingTop: BilMenuTheme.spacing.sm,
    paddingBottom: BilMenuTheme.spacing.xxl,
  },
  screenHeader: {
    marginBottom: BilMenuTheme.spacing.md,
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
  },
  sectionTitle: {
    fontSize: BilMenuTheme.typography.subtitle.fontSize,
    fontWeight: BilMenuTheme.typography.subtitle.fontWeight,
    color: BilMenuTheme.colors.textWhite,
    marginBottom: BilMenuTheme.spacing.sm,
  },
  sectionDescription: {
    fontSize: BilMenuTheme.typography.body.fontSize,
    color: BilMenuTheme.colors.textMuted,
    lineHeight: BilMenuTheme.typography.body.lineHeight,
    marginBottom: BilMenuTheme.spacing.md,
  },
  contributorCard: {
    backgroundColor: BilMenuTheme.colors.surface,
    borderRadius: BilMenuTheme.borderRadius.medium,
    padding: BilMenuTheme.spacing.md,
    marginBottom: BilMenuTheme.spacing.sm,
    borderWidth: 1,
    borderColor: BilMenuTheme.colors.border,
  },
  contributorName: {
    fontSize: BilMenuTheme.typography.body.fontSize,
    fontWeight: BilMenuTheme.typography.subtitle.fontWeight,
    color: BilMenuTheme.colors.text,
    marginBottom: BilMenuTheme.spacing.xs,
  },
  contributorContribution: {
    fontSize: BilMenuTheme.typography.caption.fontSize,
    color: BilMenuTheme.colors.text,
  },
  contributionList: {
    gap: BilMenuTheme.spacing.sm,
  },
  contributionItem: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  contributionBullet: {
    fontSize: BilMenuTheme.typography.body.fontSize,
    color: BilMenuTheme.colors.secondary,
    marginRight: BilMenuTheme.spacing.sm,
    marginTop: 2,
  },
  contributionText: {
    fontSize: BilMenuTheme.typography.body.fontSize,
    color: BilMenuTheme.colors.textMuted,
    flex: 1,
    lineHeight: BilMenuTheme.typography.body.lineHeight,
  },
});
