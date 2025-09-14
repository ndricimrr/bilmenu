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

  const handleLanguageToggle = () => {
    const newLanguage = language === "en" ? "tr" : "en";
    changeLanguage(newLanguage);
  };

  return (
    <View style={styles.header}>
      <View style={styles.headerContent}>
        {/* Logo and Title */}
        <View style={styles.logoSection}>
          <Image
            source={require("@/assets/images/logo_m.png")}
            style={styles.logo}
            resizeMode="contain"
          />
          <View style={styles.titleSection}>
            <ThemedText style={styles.title}>BilMenu</ThemedText>
            <ThemedText style={styles.subtitle}>
              {t("header.subtitle")}
            </ThemedText>
          </View>
        </View>

        {/* Language Switcher */}
        {showLanguageSwitcher && (
          <TouchableOpacity
            style={styles.languageButton}
            onPress={handleLanguageToggle}
            activeOpacity={0.7}
          >
            <ThemedText style={styles.languageText}>
              {language === "en" ? "🇺🇸 EN" : "🇹🇷 TR"}
            </ThemedText>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: BilMenuTheme.colors.surface,
    paddingHorizontal: BilMenuTheme.spacing.lg,
    paddingVertical: BilMenuTheme.spacing.md,
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
    flex: 1,
  },
  logo: {
    width: 35,
    height: 35,
    marginRight: BilMenuTheme.spacing.md,
  },
  titleSection: {
    flex: 1,
  },
  title: {
    fontSize: BilMenuTheme.typography.subtitle.fontSize,
    fontWeight: BilMenuTheme.typography.subtitle.fontWeight,
    color: BilMenuTheme.colors.text,
    marginBottom: 2,
  },
  subtitle: {
    fontSize: BilMenuTheme.typography.caption.fontSize,
    color: BilMenuTheme.colors.textLight,
    lineHeight: BilMenuTheme.typography.caption.lineHeight,
  },
  languageButton: {
    backgroundColor: BilMenuTheme.colors.surfaceLight,
    paddingHorizontal: BilMenuTheme.spacing.md,
    paddingVertical: BilMenuTheme.spacing.sm,
    borderRadius: BilMenuTheme.borderRadius.medium,
    borderWidth: 1,
    borderColor: BilMenuTheme.colors.border,
    minWidth: 60,
    alignItems: "center",
  },
  languageText: {
    fontSize: BilMenuTheme.typography.caption.fontSize,
    fontWeight: BilMenuTheme.typography.subtitle.fontWeight,
    color: BilMenuTheme.colors.text,
  },
});
