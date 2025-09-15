import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  Linking,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useTranslations } from "@/hooks/use-translations";
import { BilMenuTheme } from "@/constants/theme";
import { IconSymbol } from "@/components/ui/icon-symbol";

interface ImageContributor {
  name: string;
  contribution: string;
  imageCount: number;
}

interface CodeContributor {
  name: string;
  contribution: string;
}

interface ContributorsData {
  imageContributors: ImageContributor[];
  codeContributors: CodeContributor[];
  lastUpdated: string;
}

export default function AttributionScreen() {
  const { language } = useTranslations();
  const router = useRouter();

  const [contributors, setContributors] = useState<ContributorsData>({
    imageContributors: [],
    codeContributors: [],
    lastUpdated: "",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchContributors();
  }, []);

  const fetchContributors = async () => {
    try {
      const response = await fetch("https://www.bilmenu.com/contributors.json");
      const data = await response.json();
      setContributors(data);
    } catch (error) {
      console.error("Failed to fetch contributors:", error);
      // Fallback to empty arrays if fetch fails
      setContributors({
        imageContributors: [],
        codeContributors: [],
        lastUpdated: "",
      });
    } finally {
      setLoading(false);
    }
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
          <ThemedText style={styles.subtitle}>
            {language === "en"
              ? "Thank you to everyone who helped make BilMenu better"
              : "BilMenu'yu daha iyi hale getirmeye yardımcı olan herkese teşekkürler"}
          </ThemedText>
        </View>

        <ThemedView style={styles.section}>
          <ThemedText style={styles.sectionTitle}>
            {language === "en" ? "Image Contributions" : "Görsel Katkıları"}
          </ThemedText>
          <ThemedText style={styles.sectionDescription}>
            {language === "en"
              ? "These amazing people contributed meal photos to help complete our image collection:"
              : "Bu harika insanlar, görsel koleksiyonumuzu tamamlamaya yardımcı olmak için yemek fotoğrafları katkısında bulundu:"}
          </ThemedText>

          {loading ? (
            <ThemedText style={styles.loadingText}>
              {language === "en"
                ? "Loading contributors..."
                : "Katkıda bulunanlar yükleniyor..."}
            </ThemedText>
          ) : contributors.imageContributors.length > 0 ? (
            contributors.imageContributors.map((contributor, index) => (
              <View key={index} style={styles.contributorCard}>
                <ThemedText style={styles.contributorName}>
                  {contributor.name}
                </ThemedText>
                <ThemedText style={styles.contributorContribution}>
                  {contributor.contribution} ({contributor.imageCount}{" "}
                  {language === "en" ? "images" : "görsel"})
                </ThemedText>
              </View>
            ))
          ) : (
            <ThemedText style={styles.emptyText}>
              {language === "en"
                ? "No image contributors yet."
                : "Henüz görsel katkıda bulunan yok."}
            </ThemedText>
          )}

          <TouchableOpacity
            style={styles.submitButton}
            onPress={() => {
              router.dismissAll();
              router.push("/(tabs)/submit");
            }}
          >
            <IconSymbol
              name="camera.fill"
              size={16}
              color={BilMenuTheme.colors.textWhite}
            />
            <ThemedText style={styles.submitButtonText}>
              {language === "en" ? "Submit Images" : "Görsel Gönder"}
            </ThemedText>
          </TouchableOpacity>
        </ThemedView>

        <ThemedView style={styles.section}>
          <ThemedText style={styles.sectionTitle}>
            {language === "en" ? "Code Contributions" : "Kod Katkıları"}
          </ThemedText>
          <ThemedText style={styles.sectionDescription}>
            {language === "en"
              ? "These talented developers helped build and improve BilMenu:"
              : "Bu yetenekli geliştiriciler BilMenu'yu oluşturmaya ve geliştirmeye yardımcı oldu:"}
          </ThemedText>

          {loading ? (
            <ThemedText style={styles.loadingText}>
              {language === "en"
                ? "Loading contributors..."
                : "Katkıda bulunanlar yükleniyor..."}
            </ThemedText>
          ) : contributors.codeContributors.length > 0 ? (
            contributors.codeContributors.map((contributor, index) => (
              <View key={index} style={styles.contributorCard}>
                <ThemedText style={styles.contributorName}>
                  {contributor.name}
                </ThemedText>
                <ThemedText style={styles.contributorContribution}>
                  {contributor.contribution}
                </ThemedText>
              </View>
            ))
          ) : (
            <ThemedText style={styles.emptyText}>
              {language === "en"
                ? "No code contributors yet."
                : "Henüz kod katkıda bulunan yok."}
            </ThemedText>
          )}

          <TouchableOpacity
            style={styles.githubButton}
            onPress={() => {
              // Open GitHub repository
              const githubUrl = "https://github.com/ndricimrr/bilmenu";
              Linking.openURL(githubUrl);
            }}
          >
            <IconSymbol
              name="chevron.left.forwardslash.chevron.right"
              size={16}
              color={BilMenuTheme.colors.text}
            />
            <ThemedText style={styles.githubButtonText}>
              {language === "en" ? "Contribute Now" : "Şimdi Katkıda Bulun"}
            </ThemedText>
          </TouchableOpacity>
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
              ? "Contributors are recognized in this section and may be featured in app updates. Your name will appear exactly as you provide it when submitting images."
              : "Katkıda bulunanlar bu bölümde tanınır ve uygulama güncellemelerinde yer alabilir. Adınız, görsel gönderirken sağladığınız şekilde görünecektir."}
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
    paddingTop: BilMenuTheme.spacing.lg,
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
  githubButton: {
    backgroundColor: BilMenuTheme.colors.surface,
    borderRadius: BilMenuTheme.borderRadius.medium,
    paddingHorizontal: BilMenuTheme.spacing.md,
    paddingVertical: BilMenuTheme.spacing.sm,
    alignItems: "center",
    marginTop: BilMenuTheme.spacing.sm,
    borderWidth: 2,
    borderColor: BilMenuTheme.colors.secondary,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    flexDirection: "row",
    justifyContent: "center",
    alignSelf: "center",
    minWidth: 160,
  },
  githubButtonText: {
    fontSize: BilMenuTheme.typography.body.fontSize,
    color: BilMenuTheme.colors.text,
    fontWeight: BilMenuTheme.typography.subtitle.fontWeight,
    marginLeft: BilMenuTheme.spacing.xs,
  },
  submitButton: {
    backgroundColor: BilMenuTheme.colors.secondary,
    borderRadius: BilMenuTheme.borderRadius.medium,
    paddingHorizontal: BilMenuTheme.spacing.md,
    paddingVertical: BilMenuTheme.spacing.sm,
    alignItems: "center",
    marginTop: BilMenuTheme.spacing.sm,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
    flexDirection: "row",
    justifyContent: "center",
    alignSelf: "center",
    minWidth: 160,
  },
  submitButtonText: {
    fontSize: BilMenuTheme.typography.body.fontSize,
    color: BilMenuTheme.colors.textWhite,
    fontWeight: BilMenuTheme.typography.subtitle.fontWeight,
    marginLeft: BilMenuTheme.spacing.xs,
  },
  loadingText: {
    fontSize: BilMenuTheme.typography.body.fontSize,
    color: BilMenuTheme.colors.textMuted,
    textAlign: "center",
    fontStyle: "italic",
    marginVertical: BilMenuTheme.spacing.md,
  },
  emptyText: {
    fontSize: BilMenuTheme.typography.body.fontSize,
    color: BilMenuTheme.colors.textMuted,
    textAlign: "center",
    fontStyle: "italic",
    marginVertical: BilMenuTheme.spacing.md,
  },
});
