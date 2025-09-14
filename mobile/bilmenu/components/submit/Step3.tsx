import React from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Modal,
  Image,
} from "react-native";
import { BilMenuTheme } from "@/constants/theme";

interface Step3Props {
  selectedMeal: string;
  capturedImage: string | null;
  imageSize: number | null;
  userName: string;
  onUserNameChange: (name: string) => void;
  onSendEmail: () => void;
  onBack: () => void;
  showAttributionModal: boolean;
  onToggleAttributionModal: (show: boolean) => void;
}

export const Step3: React.FC<Step3Props> = ({
  selectedMeal,
  capturedImage,
  imageSize,
  userName,
  onUserNameChange,
  onSendEmail,
  onBack,
  showAttributionModal,
  onToggleAttributionModal,
}) => {
  return (
    <KeyboardAvoidingView
      style={styles.stepContainer}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 50 : 50}
      enabled={true}
    >
      <ScrollView
        style={styles.step3Content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.step3ScrollContent}
        removeClippedSubviews={false}
        scrollEventThrottle={16}
      >
        <Text style={styles.stepTitle}>Step 3: Send Email</Text>
        <Text style={styles.selectedMealText}>
          <Text style={styles.selectedLabel}>Meal: </Text>
          <Text style={styles.selectedMealName}>{selectedMeal}</Text>
        </Text>
        <View style={styles.previewContainer}>
          {capturedImage && (
            <View style={styles.imagePreviewContainer}>
              <View style={styles.imagePreviewSmall}>
                <Image
                  source={{ uri: capturedImage }}
                  style={styles.previewImageSmall}
                />
              </View>
              <Text style={styles.imageFilenameText}>{selectedMeal}.jpg</Text>
              {imageSize && (
                <Text style={styles.imageSizeText}>
                  {(imageSize / (1024 * 1024)).toFixed(1)} MB
                </Text>
              )}
            </View>
          )}

          <View style={styles.emailPreview}>
            <Text style={styles.emailPreviewTitle}>Email Preview</Text>
            <Text style={styles.emailPreviewCompact}>
              <Text style={styles.emailPreviewLabel}>To:</Text>{" "}
              ndricim@bilmenu.com
              {"\n"}
              <Text style={styles.emailPreviewLabel}>Subject:</Text> BilMenu
              Image Submission
              {"\n"}
            </Text>

            <View style={styles.subjectNameContainer}>
              <Text
                style={[
                  styles.subjectNameText,
                  userName.length > 0 && styles.subjectNameTextBold,
                ]}
              >
                By: {userName || "No name provided"}
              </Text>
            </View>

            <Text style={styles.emailPreviewCompact}>
              <Text style={styles.emailPreviewLabel}>Message:</Text> Hi! 👋 This
              meal was missing from BilMenu, so I'm sharing a photo. This is:{" "}
              {selectedMeal}. Thanks for BilMenu!
            </Text>
          </View>
        </View>

        <View style={styles.nameInputContainer}>
          <View style={styles.nameInputHeader}>
            <View style={styles.nameInputLabelContainer}>
              <Text style={styles.nameInputLabel}>
                Add your name for attribution{" "}
                <Text style={styles.optionalText}>(optional)</Text>
                <TouchableOpacity
                  style={styles.helpButton}
                  onPress={() => onToggleAttributionModal(true)}
                >
                  <Text style={styles.helpButtonText}>?</Text>
                </TouchableOpacity>
              </Text>
            </View>
            <Text
              style={[
                styles.characterCounter,
                userName.length === 50 && styles.characterCounterLimit,
              ]}
            >
              {userName.length}/50
            </Text>
          </View>
          <View style={styles.nameInputWrapper}>
            <TextInput
              style={styles.nameInput}
              placeholder="Your name"
              value={userName}
              onChangeText={onUserNameChange}
              placeholderTextColor={BilMenuTheme.colors.textLight}
              maxLength={50}
            />
            {userName.length > 0 && (
              <TouchableOpacity
                style={styles.clearButton}
                onPress={() => onUserNameChange("")}
              >
                <Text style={styles.clearButtonText}>×</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        <TouchableOpacity style={styles.sendButton} onPress={onSendEmail}>
          <Text style={styles.sendButtonText}>📧 Send Email</Text>
        </TouchableOpacity>
      </ScrollView>

      <TouchableOpacity style={styles.backButton} onPress={onBack}>
        <Text style={styles.backButtonText}>← Back to Camera</Text>
      </TouchableOpacity>

      <Modal
        visible={showAttributionModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => onToggleAttributionModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Attribution</Text>
            <Text style={styles.modalText}>
              Your name will be shown as a thank you to contributors who helped
              improve the meal image collection.
            </Text>
            <Text style={styles.modalText}>
              It will appear in a contributors section to recognize your help in
              making BilMenu better for all students.
            </Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => onToggleAttributionModal(false)}
            >
              <Text style={styles.modalButtonText}>Got it!</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  stepContainer: {
    flex: 1,
  },
  step3Content: {
    flex: 1,
    marginBottom: 20,
  },
  step3ScrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
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
  previewContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 15,
    gap: 12,
  },
  imagePreviewContainer: {
    alignItems: "center",
  },
  imagePreviewSmall: {
    width: 100,
    height: 100,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: BilMenuTheme.colors.border,
    overflow: "hidden",
  },
  previewImageSmall: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  imageSizeText: {
    fontSize: 10,
    color: BilMenuTheme.colors.textWhite,
    marginTop: 4,
    textAlign: "center",
  },
  imageFilenameText: {
    fontSize: 9,
    color: BilMenuTheme.colors.textWhite,
    marginTop: 2,
    textAlign: "center",
    fontStyle: "italic",
  },
  emailPreview: {
    backgroundColor: BilMenuTheme.colors.surface,
    borderRadius: 8,
    padding: 8,
    flex: 1,
    borderWidth: 1,
    borderColor: BilMenuTheme.colors.border,
  },
  emailPreviewTitle: {
    fontSize: 12,
    fontWeight: "bold",
    color: BilMenuTheme.colors.text,
    marginBottom: 6,
  },
  emailPreviewCompact: {
    fontSize: 11,
    color: BilMenuTheme.colors.text,
    lineHeight: 14,
  },
  emailPreviewLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: BilMenuTheme.colors.text,
  },
  subjectNameContainer: {
    height: 32,
    justifyContent: "center",
    marginTop: 1,
    marginBottom: 1,
  },
  subjectNameText: {
    fontSize: 11,
    color: BilMenuTheme.colors.text,
    fontWeight: "500",
  },
  subjectNameTextBold: {
    fontWeight: "bold",
  },
  nameInputContainer: {
    marginBottom: 15,
  },
  nameInputHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  nameInputLabelContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  nameInputLabel: {
    fontSize: 14,
    color: BilMenuTheme.colors.textWhite,
    fontWeight: "500",
    flex: 1,
  },
  helpButton: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: BilMenuTheme.colors.secondary,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 6,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  optionalText: {
    color: BilMenuTheme.colors.textWhite,
    fontWeight: "500",
  },
  helpButtonText: {
    fontSize: 12,
    color: BilMenuTheme.colors.textWhite,
    fontWeight: "bold",
  },
  characterCounter: {
    fontSize: 12,
    color: BilMenuTheme.colors.textWhite,
    fontWeight: "400",
  },
  characterCounterLimit: {
    color: "#FF4444",
    fontWeight: "600",
  },
  nameInputWrapper: {
    position: "relative",
  },
  nameInput: {
    backgroundColor: BilMenuTheme.colors.surface,
    borderRadius: 8,
    padding: 12,
    paddingRight: 40,
    borderWidth: 1,
    borderColor: BilMenuTheme.colors.border,
    fontSize: 14,
    color: BilMenuTheme.colors.text,
  },
  clearButton: {
    position: "absolute",
    right: 8,
    top: "50%",
    transform: [{ translateY: -12 }],
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: BilMenuTheme.colors.textLight,
    justifyContent: "center",
    alignItems: "center",
  },
  clearButtonText: {
    fontSize: 16,
    color: BilMenuTheme.colors.surface,
    fontWeight: "bold",
    lineHeight: 16,
  },
  sendButton: {
    backgroundColor: BilMenuTheme.colors.secondary,
    borderRadius: 12,
    padding: 15,
    alignItems: "center",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  sendButtonText: {
    fontSize: 16,
    color: BilMenuTheme.colors.textWhite,
    fontWeight: "bold",
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
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    backgroundColor: BilMenuTheme.colors.surface,
    borderRadius: 12,
    padding: 20,
    maxWidth: 300,
    width: "100%",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: BilMenuTheme.colors.text,
    marginBottom: 12,
    textAlign: "center",
  },
  modalText: {
    fontSize: 14,
    color: BilMenuTheme.colors.text,
    lineHeight: 20,
    marginBottom: 12,
  },
  modalButton: {
    backgroundColor: BilMenuTheme.colors.secondary,
    borderRadius: 8,
    padding: 12,
    alignItems: "center",
    marginTop: 8,
  },
  modalButtonText: {
    fontSize: 16,
    color: BilMenuTheme.colors.textWhite,
    fontWeight: "bold",
  },
});
