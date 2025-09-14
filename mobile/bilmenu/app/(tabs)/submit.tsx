import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Header } from "@/components/header";
import { BilMenuTheme } from "@/constants/theme";
import * as ImagePicker from "expo-image-picker";
import * as MailComposer from "expo-mail-composer";
import { Step, MealType, Step1View } from "@/types/submit";
import { getCurrentDayOfWeek, getCurrentMealTime } from "@/utils/submitUtils";
import { useSubmitData } from "@/hooks/useSubmitData";
import { Step1, Step2, Step3 } from "@/components/submit";
import { useTranslations } from "@/hooks/use-translations";

export default function SubmitScreen() {
  const { t } = useTranslations();
  const [selectedMeal, setSelectedMeal] = useState<string>("");
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [imageSize, setImageSize] = useState<number | null>(null);
  const [userName, setUserName] = useState<string>("");
  const [showAttributionModal, setShowAttributionModal] =
    useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [step, setStep] = useState<Step>(1);
  const [showAllMissing, setShowAllMissing] = useState(false);
  const [step1View, setStep1View] = useState<Step1View>("daymeal");
  const [selectedDay, setSelectedDay] = useState<number>(0);
  const [selectedMealType, setSelectedMealType] = useState<MealType>("lunch");

  // Use the custom hook for data management
  const {
    currentWeekMeals,
    allMissingMeals,
    currentWeekMealPlan,
    isLoading,
    lastUpdated,
    getMissingMealsForDayAndType,
  } = useSubmitData();

  // Auto-select current day and meal time
  useEffect(() => {
    const currentDay = getCurrentDayOfWeek();
    const currentMealTime = getCurrentMealTime();
    setSelectedDay(currentDay);
    setSelectedMealType(currentMealTime);
  }, []);

  const mealsToShow = showAllMissing ? allMissingMeals : currentWeekMeals;
  const filteredMeals = mealsToShow.filter((meal) =>
    meal.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Get meals for day/meal view
  const dayMealViewMeals = getMissingMealsForDayAndType(
    selectedDay,
    selectedMealType
  );

  const handleMealSelection = (mealName: string) => {
    setSelectedMeal(mealName);
    setStep(2);
  };

  const handleCameraCapture = async () => {
    try {
      // Request camera permissions
      const { status } = await ImagePicker.requestCameraPermissionsAsync();

      if (status !== "granted") {
        Alert.alert(
          "Permission Required",
          "Camera permission is required to capture images."
        );
        return;
      }

      // Launch camera
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
        exif: false,
      });

      if (!result.canceled && result.assets[0]) {
        setCapturedImage(result.assets[0].uri);
        setImageSize(result.assets[0].fileSize || null);
        setStep(3);
      }
    } catch (error) {
      console.error("Error capturing image:", error);
      Alert.alert("Error", "Failed to capture image. Please try again.");
    }
  };

  const handleGallerySelection = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
        exif: false,
      });

      if (!result.canceled && result.assets[0]) {
        setCapturedImage(result.assets[0].uri);
        setImageSize(result.assets[0].fileSize || null);
        setStep(3);
      }
    } catch (error) {
      console.error("Error selecting image:", error);
      Alert.alert("Error", "Failed to select image. Please try again.");
    }
  };

  const handleSendEmail = async () => {
    if (!capturedImage || !selectedMeal) {
      Alert.alert(t("submit.alerts.error"), t("submit.alerts.selectMealFirst"));
      return;
    }

    try {
      const isAvailable = await MailComposer.isAvailableAsync();

      if (!isAvailable) {
        Alert.alert(
          t("submit.alerts.emailNotAvailable"),
          t("submit.alerts.emailNotConfigured")
        );
        return;
      }

      const subject = `BilMenu Image Submission |${selectedMeal}.jpg`;
      const body = `${t("submit.email.greeting")}

${t("submit.email.body")}

${t("submit.email.mealInfo", { meal: selectedMeal })}

${t("submit.email.thanks")} 

${t("submit.email.signature")}
${userName || t("submit.email.defaultName")}`;

      // Create filename with meal name
      const filename = `${selectedMeal}.jpg`;

      await MailComposer.composeAsync({
        recipients: ["bilmenudeveloper@gmail.com"], // Replace with your actual email
        subject,
        body,
        attachments: [capturedImage],
      });

      // Reset the form
      setSelectedMeal("");
      setCapturedImage(null);
      setImageSize(null);
      setUserName("");
      setStep(1);

      Alert.alert(t("submit.alerts.success"), t("submit.alerts.emailSent"));
    } catch (error) {
      console.error("Error sending email:", error);
      Alert.alert(t("submit.alerts.error"), t("submit.alerts.emailFailed"));
    }
  };

  const renderStep1 = () => (
    <Step1
      step1View={step1View}
      onViewChange={setStep1View}
      selectedDay={selectedDay}
      selectedMealType={selectedMealType}
      onDayChange={setSelectedDay}
      onMealTypeChange={setSelectedMealType}
      dayMealViewMeals={dayMealViewMeals}
      searchQuery={searchQuery}
      onSearchChange={setSearchQuery}
      showAllMissing={showAllMissing}
      onToggleShowAll={setShowAllMissing}
      filteredMeals={filteredMeals}
      isLoading={isLoading}
      onMealSelect={handleMealSelection}
      lastUpdated={lastUpdated}
    />
  );

  const renderStep2 = () => (
    <Step2
      selectedMeal={selectedMeal}
      onCameraCapture={handleCameraCapture}
      onGallerySelection={handleGallerySelection}
      onBack={() => setStep(1)}
    />
  );

  const renderStep3 = () => (
    <Step3
      selectedMeal={selectedMeal}
      capturedImage={capturedImage}
      imageSize={imageSize}
      userName={userName}
      onUserNameChange={setUserName}
      onSendEmail={handleSendEmail}
      onBack={() => setStep(2)}
      showAttributionModal={showAttributionModal}
      onToggleAttributionModal={setShowAttributionModal}
    />
  );

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <Header title={t("submit.title")} />

      <View style={styles.content}>
        <Text style={styles.description}>{t("submit.description")}</Text>

        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BilMenuTheme.colors.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  description: {
    fontSize: 14,
    color: BilMenuTheme.colors.textWhite,
    textAlign: "center",
    marginBottom: 20,
    lineHeight: 20,
  },
});
