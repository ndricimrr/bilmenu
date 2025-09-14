import React from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { BilMenuTheme } from "@/constants/theme";

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
  return (
    <View style={styles.stepContainer}>
      <View style={styles.step2Content}>
        <Text style={styles.stepTitle}>Step 2: Capture Image</Text>
        <Text style={styles.selectedMealText}>
          <Text style={styles.selectedLabel}>Selected: </Text>
          <Text style={styles.selectedMealName}>{selectedMeal}</Text>
        </Text>

        <TouchableOpacity
          style={styles.captureButton}
          onPress={onCameraCapture}
        >
          <Ionicons
            name="camera"
            size={24}
            color={BilMenuTheme.colors.textWhite}
          />
          <Text style={styles.captureButtonText}>Capture Image</Text>
        </TouchableOpacity>

        <Text style={styles.orText}>or</Text>

        <TouchableOpacity
          style={styles.galleryButton}
          onPress={onGallerySelection}
        >
          <Ionicons name="images" size={16} color={BilMenuTheme.colors.text} />
          <Text style={styles.galleryButtonText}>Gallery</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.backButton} onPress={onBack}>
        <Text style={styles.backButtonText}>← Back to Meal Selection</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  stepContainer: {
    flex: 1,
  },
  step2Content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  stepTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: BilMenuTheme.colors.textWhite,
    marginBottom: 20,
    textAlign: "center",
  },
  selectedMealText: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 30,
  },
  selectedLabel: {
    color: BilMenuTheme.colors.textMuted,
    fontSize: 18,
    fontWeight: "500",
  },
  selectedMealName: {
    color: BilMenuTheme.colors.secondary,
    fontSize: 18,
    fontWeight: "600",
  },
  captureButton: {
    backgroundColor: BilMenuTheme.colors.secondary,
    borderRadius: 15,
    padding: 20,
    alignItems: "center",
    marginBottom: 20,
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
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
    borderRadius: 8,
    padding: 8,
    paddingHorizontal: 16,
    alignItems: "center",
    marginTop: 10,
    borderWidth: 1,
    borderColor: BilMenuTheme.colors.border,
    alignSelf: "center",
    flexDirection: "row",
    justifyContent: "center",
    gap: 6,
  },
  galleryButtonText: {
    fontSize: 14,
    color: BilMenuTheme.colors.text,
    fontWeight: "500",
  },
  backButton: {
    backgroundColor: BilMenuTheme.colors.surface,
    borderRadius: 10,
    padding: 15,
    alignItems: "center",
    borderWidth: 1,
    borderColor: BilMenuTheme.colors.border,
    marginTop: "auto",
    marginBottom: 20,
  },
  backButtonText: {
    fontSize: 16,
    color: BilMenuTheme.colors.text,
  },
});
