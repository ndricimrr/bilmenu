import React from "react";
import { StyleSheet, View, TouchableOpacity, Image } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { ThemedText } from "@/components/themed-text";
import { useTranslations } from "@/hooks/use-translations";
import { BilMenuTheme } from "@/constants/theme";
import { useNetworkStatus } from "@/hooks/useNetworkStatus";
import { MaterialIcons } from "@expo/vector-icons";

interface HeaderProps {
  title?: string;
  showLanguageSwitcher?: boolean;
  onRefresh?: () => void;
}

export function Header({
  title,
  showLanguageSwitcher = true,
  onRefresh,
}: HeaderProps) {
  const { t, language, changeLanguage } = useTranslations();
  const { isOffline } = useNetworkStatus();

  // Show offline label when offline (WebView will use cached content)
  const showOfflineIndicator = isOffline;

  const handleLanguageChange = (newLanguage: "en" | "tr") => {
    changeLanguage(newLanguage);
  };

  return (
    <View style={styles.header}>
      <View style={styles.headerContent}>
        {/* Logo - Mobile style (no title text) */}
        <View style={styles.logoSection}>
          <Image
            source={require("@/assets/images/logo/android_108_108.png")}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        {/* Right side: Offline indicator + Language Switcher */}
        <View style={styles.rightSection}>
          {/* Offline Label */}
          {showOfflineIndicator && (
            <View style={styles.offlineContainer}>
              <MaterialIcons name="wifi-off" size={16} color="#666666" />
              <ThemedText style={styles.offlineText}>Offline</ThemedText>
            </View>
          )}

          {/* Refresh Button */}
          {onRefresh && (
            <TouchableOpacity
              style={styles.refreshButton}
              onPress={onRefresh}
              activeOpacity={0.7}
            >
              <MaterialIcons name="refresh" size={18} color="#666666" />
            </TouchableOpacity>
          )}

          {/* Language Switcher - Two button design like webapp */}
          {showLanguageSwitcher && (
            <View style={styles.languageSwitcher}>
              <TouchableOpacity
                style={styles.langBtn}
                onPress={() => handleLanguageChange("en")}
                activeOpacity={0.8}
              >
                {language === "en" ? (
                  <LinearGradient
                    colors={["#ff9434", "#ff6b35"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.langBtnGradient}
                  >
                    <ThemedText style={styles.langBtnTextActive}>EN</ThemedText>
                  </LinearGradient>
                ) : (
                  <View style={styles.langBtnInactive}>
                    <ThemedText style={styles.langBtnText}>EN</ThemedText>
                  </View>
                )}
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.langBtn}
                onPress={() => handleLanguageChange("tr")}
                activeOpacity={0.8}
              >
                {language === "tr" ? (
                  <LinearGradient
                    colors={["#ff9434", "#ff6b35"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.langBtnGradient}
                  >
                    <ThemedText style={styles.langBtnTextActive}>TR</ThemedText>
                  </LinearGradient>
                ) : (
                  <View style={styles.langBtnInactive}>
                    <ThemedText style={styles.langBtnText}>TR</ThemedText>
                  </View>
                )}
              </TouchableOpacity>
            </View>
          )}
        </View>
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
  rightSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: BilMenuTheme.spacing.sm,
  },
  offlineContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  offlineText: {
    fontSize: 12,
    color: "#666666",
    fontWeight: "500",
  },
  refreshButton: {
    padding: 4,
    alignItems: "center",
    justifyContent: "center",
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
    backgroundColor: "rgba(255, 255, 255, 0.9)", // Solid background for shadow to work
    borderRadius: 20, // Exact match: border-radius: 20px (mobile)
    padding: 3, // Exact match: padding: 3px (mobile)
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)", // Exact match: border: 1px solid rgba(255, 255, 255, 0.2)
    // iOS shadow
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4, // Exact match: box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1)
    },
    shadowOpacity: 0.15, // Increased opacity for better visibility
    shadowRadius: 16, // Exact match: 16px blur
    // Android shadow
    elevation: 8, // Increased elevation for better visibility
  },
  langBtn: {
    backgroundColor: "transparent",
    paddingHorizontal: 0, // Remove padding from TouchableOpacity
    paddingVertical: 0, // Remove padding from TouchableOpacity
    borderRadius: 15, // Exact match: border-radius: 15px
    minWidth: 35, // Exact match: min-width: 35px
    alignItems: "center",
    justifyContent: "center",
  },
  langBtnGradient: {
    paddingHorizontal: 12,
    paddingVertical: 2,
    borderRadius: 15,
    minWidth: 35,
    alignItems: "center",
    justifyContent: "center",
    // iOS shadow for gradient
    shadowColor: "#ff9434",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    // Android shadow
    elevation: 6,
  },
  langBtnInactive: {
    paddingHorizontal: 12,
    paddingVertical: 2,
    borderRadius: 15,
    minWidth: 35,
    alignItems: "center",
    justifyContent: "center",
  },
  langBtnText: {
    fontSize: 12.8, // Exact match: font-size: 0.8rem (0.8 * 16 = 12.8)
    fontWeight: "600", // Exact match: font-weight: 600
    color: "#333", // Exact match: color: #333
    fontFamily:
      "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
  },
  langBtnTextActive: {
    color: "#ffffff", // Exact match: color: white
    fontWeight: "600",
  },
});
