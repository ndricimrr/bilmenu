import React from "react";
import { StyleSheet, View, TouchableOpacity, Image } from "react-native";
import { ThemedText } from "@/components/themed-text";
import { useTranslations } from "@/hooks/use-translations";
import { BilMenuTheme } from "@/constants/theme";

interface HeaderProps {
  title?: string;
  showLanguageSwitcher?: boolean;
}

export function Header({ title, showLanguageSwitcher = true }: HeaderProps) {
  const { t, language, changeLanguage } = useTranslations();

  const handleLanguageChange = (newLanguage: "en" | "tr") => {
    changeLanguage(newLanguage);
  };

  return (
    <View style={styles.header}>
      <View style={styles.headerContent}>
        {/* Logo - Mobile style (no title text) */}
        <View style={styles.logoSection}>
          <Image
            source={require("@/assets/images/logo_m.png")}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        {/* Language Switcher - Two button design like webapp */}
        {showLanguageSwitcher && (
          <View style={styles.languageSwitcher}>
            <TouchableOpacity
              style={[
                styles.langBtn,
                language === "en" && styles.langBtnActive,
              ]}
              onPress={() => handleLanguageChange("en")}
              activeOpacity={0.8}
            >
              <ThemedText
                style={[
                  styles.langBtnText,
                  language === "en" && styles.langBtnTextActive,
                ]}
              >
                EN
              </ThemedText>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.langBtn,
                language === "tr" && styles.langBtnActive,
              ]}
              onPress={() => handleLanguageChange("tr")}
              activeOpacity={0.8}
            >
              <ThemedText
                style={[
                  styles.langBtnText,
                  language === "tr" && styles.langBtnTextActive,
                ]}
              >
                TR
              </ThemedText>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: BilMenuTheme.colors.surface,
    paddingHorizontal: BilMenuTheme.spacing.lg,
    paddingVertical: BilMenuTheme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: BilMenuTheme.colors.border,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  logoSection: {
    flexDirection: "row",
    alignItems: "center",
  },
  logo: {
    width: 35,
    height: 35,
  },
  languageSwitcher: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 20,
    padding: 3,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 4,
  },
  langBtn: {
    backgroundColor: "transparent",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    minWidth: 35,
    alignItems: "center",
    justifyContent: "center",
  },
  langBtnActive: {
    backgroundColor: BilMenuTheme.colors.secondary,
    shadowColor: BilMenuTheme.colors.secondary,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 4,
  },
  langBtnText: {
    fontSize: 12,
    fontWeight: "600",
    color: BilMenuTheme.colors.text,
    fontFamily:
      "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
  },
  langBtnTextActive: {
    color: "#ffffff",
    fontWeight: "600",
  },
});
