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
          <Text style={styles.stepTitle}>{t("submit.step2.title")}</Text>
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

            <Text style={styles.guidelinesTips}>
              {t("submit.step2.guidelines.tips")}
            </Text>

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

      <TouchableOpacity style={styles.backButton} onPress={onBack}>
        <Text style={styles.backButtonText}>
          {t("submit.step2.backToSelection")}
        </Text>
      </TouchableOpacity>
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
    paddingBottom: 20,
  },
  step2Content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: BilMenuTheme.colors.textWhite,
    marginBottom: 16,
    textAlign: "center",
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
    color: BilMenuTheme.colors.textMuted,
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
  examplesContainer: {
    width: "100%",
    marginBottom: 20,
  },
  exampleLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: BilMenuTheme.colors.textWhite,
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
    color: BilMenuTheme.colors.text,
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
  backButton: {
    backgroundColor: BilMenuTheme.colors.surface,
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: BilMenuTheme.colors.border,
    marginHorizontal: 20,
    marginBottom: 20,
  },
  backButtonText: {
    fontSize: 16,
    color: BilMenuTheme.colors.text,
    fontWeight: "500",
  },
});
