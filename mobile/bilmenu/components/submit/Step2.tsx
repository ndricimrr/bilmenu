import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { BilMenuTheme } from "@/constants/theme";
import { useTranslations } from "@/hooks/use-translations";

interface Step2Props {
  selectedMeal: string;
  onCameraCapture: () => void;
  onGallerySelection: () => void;
  onBack: () => void;
}

export const Step2: React.FC<Step2Props> = ({
  selectedMeal,
  onCameraCapture,
  onGallerySelection,
  onBack,
}) => {
  const { t } = useTranslations();
  const [guidelinesAcknowledged, setGuidelinesAcknowledged] = useState(false);

  const handleCameraCapture = () => {
    if (guidelinesAcknowledged) {
      onCameraCapture();
    }
  };

  const handleGallerySelection = () => {
    if (guidelinesAcknowledged) {
      onGallerySelection();
    }
  };

  return (
    <View style={styles.stepContainer}>
      <ScrollView
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.step2Content}>
          <View style={styles.headerRow}>
            <TouchableOpacity style={styles.backButtonTop} onPress={onBack}>
              <Ionicons
                name="chevron-back"
                size={20}
                color={BilMenuTheme.colors.textWhite}
              />
              <Text style={styles.backButtonTopText}>Back</Text>
            </TouchableOpacity>
            <View style={styles.titleContainer}>
              <Text style={styles.stepNumber}>
                {t("submit.step2.stepNumber")}
              </Text>
              <Text style={styles.stepTitle}>
                {t("submit.step2.stepTitle")}
              </Text>
            </View>
          </View>
          <Text style={styles.selectedMealText}>
            <Text style={styles.selectedLabel}>
              {t("submit.step2.selectedMeal", { meal: selectedMeal })}
            </Text>
          </Text>

          {/* Mandatory Guidelines */}
          <View style={styles.guidelinesContainer}>
            <View style={styles.guidelinesHeader}>
              <Ionicons
                name="information-circle"
                size={24}
                color={BilMenuTheme.colors.secondary}
              />
              <Text style={styles.guidelinesTitle}>
                {t("submit.step2.guidelines.title")}
              </Text>
            </View>

            <Text style={styles.guidelinesSubtitle}>
              {t("submit.step2.guidelines.subtitle")}
            </Text>

            <View style={styles.guidelinesTipsGrid}>
              <View style={styles.tipRow}>
                <View style={styles.tipBox}>
                  <Text style={styles.tipText}>
                    {t("submit.step2.guidelines.tip1")}
                  </Text>
                </View>
                <View style={styles.tipBox}>
                  <Text style={styles.tipText}>
                    {t("submit.step2.guidelines.tip2")}
                  </Text>
                </View>
              </View>
              <View style={styles.tipRow}>
                <View style={styles.tipBox}>
                  <Text style={styles.tipText}>
                    {t("submit.step2.guidelines.tip3")}
                  </Text>
                </View>
                <View style={styles.tipBox}>
                  <Text style={styles.tipText}>
                    {t("submit.step2.guidelines.tip4")}
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.examplesContainer}>
              <Text style={styles.exampleLabel}>
                {t("submit.step2.guidelines.correct")}
              </Text>
              <View style={styles.exampleRow}>
                <Image
                  source={require("@/assets/images/guidelines/sample_missing_1.jpg")}
                  style={styles.exampleImage}
                  resizeMode="cover"
                />
                <Image
                  source={require("@/assets/images/guidelines/sample_missing_2.jpg")}
                  style={styles.exampleImage}
                  resizeMode="cover"
                />
              </View>

              <Text style={styles.exampleLabel}>
                {t("submit.step2.guidelines.incorrect")}
              </Text>
              <View style={styles.exampleRow}>
                <Image
                  source={require("@/assets/images/guidelines/incorrect_sample_missing_1.jpg")}
                  style={styles.exampleImage}
                  resizeMode="cover"
                />
                <Image
                  source={require("@/assets/images/guidelines/incorrect_sample_missing_2.jpg")}
                  style={styles.exampleImage}
                  resizeMode="cover"
                />
              </View>
              <View style={styles.exampleRow}>
                <Image
                  source={require("@/assets/images/guidelines/sample_wrong_meal_group.jpg")}
                  style={styles.exampleImage}
                  resizeMode="cover"
                />
                <View style={styles.exampleImage} />
              </View>
            </View>

            {/* Acknowledgment Checkbox */}
            <TouchableOpacity
              style={styles.acknowledgmentContainer}
              onPress={() => setGuidelinesAcknowledged(!guidelinesAcknowledged)}
            >
              <View
                style={[
                  styles.checkbox,
                  guidelinesAcknowledged && styles.checkboxChecked,
                ]}
              >
                {guidelinesAcknowledged && (
                  <Ionicons
                    name="checkmark"
                    size={16}
                    color={BilMenuTheme.colors.textWhite}
                  />
                )}
              </View>
              <Text style={styles.acknowledgmentText}>
                {t("submit.step2.guidelines.acknowledgment")}
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[
              styles.captureButton,
              !guidelinesAcknowledged && styles.captureButtonDisabled,
            ]}
            onPress={handleCameraCapture}
            disabled={!guidelinesAcknowledged}
          >
            <Ionicons
              name="camera"
              size={24}
              color={BilMenuTheme.colors.textWhite}
            />
            <Text style={styles.captureButtonText}>
              {t("submit.step2.captureImage")}
            </Text>
          </TouchableOpacity>

          <Text style={styles.orText}>{t("submit.step2.or")}</Text>

          <TouchableOpacity
            style={[
              styles.galleryButton,
              !guidelinesAcknowledged && styles.galleryButtonDisabled,
            ]}
            onPress={handleGallerySelection}
            disabled={!guidelinesAcknowledged}
          >
            <Ionicons
              name="images"
              size={16}
              color={
                guidelinesAcknowledged
                  ? BilMenuTheme.colors.text
                  : BilMenuTheme.colors.textMuted
              }
            />
            <Text
              style={[
                styles.galleryButtonText,
                !guidelinesAcknowledged && styles.galleryButtonTextDisabled,
              ]}
            >
              {t("submit.step2.gallery")}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  stepContainer: {
    flex: 1,
    backgroundColor: BilMenuTheme.colors.background,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  step2Content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  backButtonTop: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    paddingHorizontal: 12,
    position: "absolute",
    left: 0,
    zIndex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  backButtonTopText: {
    fontSize: 16,
    color: BilMenuTheme.colors.textWhite,
    marginLeft: 4,
    fontWeight: "500",
  },
  titleContainer: {
    flex: 1,
    alignItems: "flex-start",
    marginLeft: 100, // Account for back button width + padding + extra space
    marginRight: 20, // Reduced right margin since we're left-aligned
  },
  stepNumber: {
    fontSize: 16,
    fontWeight: "600",
    color: BilMenuTheme.colors.textMuted,
    textAlign: "left",
  },
  stepTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: BilMenuTheme.colors.textWhite,
    textAlign: "left",
  },
  selectedMealText: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 24,
  },
  selectedLabel: {
    color: BilMenuTheme.colors.textMuted,
    fontSize: 16,
    fontWeight: "500",
  },
  // Guidelines styles
  guidelinesContainer: {
    backgroundColor: BilMenuTheme.colors.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    borderWidth: 2,
    borderColor: BilMenuTheme.colors.secondary,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  guidelinesHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  guidelinesTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: BilMenuTheme.colors.text,
    marginLeft: 8,
  },
  guidelinesSubtitle: {
    fontSize: 14,
    color: BilMenuTheme.colors.textLight,
    textAlign: "center",
    marginBottom: 16,
    lineHeight: 20,
  },
  guidelinesTips: {
    fontSize: 13,
    color: BilMenuTheme.colors.text,
    lineHeight: 20,
    marginBottom: 20,
    textAlign: "center",
  },
  guidelinesTipsGrid: {
    marginBottom: 12,
  },
  tipRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
    gap: 8,
  },
  tipBox: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.05)",
    borderRadius: 8,
    padding: 6,
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.2)",
    alignItems: "center",
    justifyContent: "center",
    minHeight: 36,
  },
  tipText: {
    fontSize: 11,
    color: BilMenuTheme.colors.text,
    textAlign: "center",
    lineHeight: 14,
  },
  examplesContainer: {
    width: "100%",
    marginBottom: 20,
  },
  exampleLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: BilMenuTheme.colors.text,
    marginBottom: 12,
    marginTop: 16,
  },
  exampleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
    gap: 12,
  },
  exampleImage: {
    flex: 1,
    height: 100,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: BilMenuTheme.colors.border,
  },
  // Acknowledgment styles
  acknowledgmentContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: BilMenuTheme.colors.background,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: BilMenuTheme.colors.border,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: BilMenuTheme.colors.border,
    backgroundColor: BilMenuTheme.colors.surface,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  checkboxChecked: {
    backgroundColor: BilMenuTheme.colors.secondary,
    borderColor: BilMenuTheme.colors.secondary,
  },
  acknowledgmentText: {
    flex: 1,
    fontSize: 14,
    color: BilMenuTheme.colors.textWhite,
    lineHeight: 20,
  },
  // Button styles
  captureButton: {
    backgroundColor: BilMenuTheme.colors.secondary,
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    marginBottom: 16,
    flexDirection: "row",
    justifyContent: "center",
    gap: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  captureButtonDisabled: {
    backgroundColor: BilMenuTheme.colors.textMuted,
    opacity: 0.6,
  },
  captureButtonText: {
    fontSize: 18,
    color: BilMenuTheme.colors.textWhite,
    fontWeight: "bold",
  },
  orText: {
    fontSize: 14,
    color: BilMenuTheme.colors.textMuted,
    textAlign: "center",
    marginVertical: 8,
    fontStyle: "italic",
  },
  galleryButton: {
    backgroundColor: BilMenuTheme.colors.surface,
    borderRadius: 12,
    padding: 16,
    paddingHorizontal: 20,
    alignItems: "center",
    marginTop: 8,
    borderWidth: 1,
    borderColor: BilMenuTheme.colors.border,
    alignSelf: "center",
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
  },
  galleryButtonDisabled: {
    opacity: 0.5,
    borderColor: BilMenuTheme.colors.textMuted,
  },
  galleryButtonText: {
    fontSize: 16,
    color: BilMenuTheme.colors.text,
    fontWeight: "500",
  },
  galleryButtonTextDisabled: {
    color: BilMenuTheme.colors.textMuted,
  },
});
