import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Header } from "@/components/header";
import { BilMenuTheme } from "@/constants/theme";
import * as ImagePicker from "expo-image-picker";
import * as MailComposer from "expo-mail-composer";

interface Meal {
  tr: string;
  en: string;
}

interface MealPlanDay {
  date: string;
  dayOfWeek: string;
  lunch: Meal[];
  dinner: Meal[];
  alternative: Meal[];
}

interface MissingMeal {
  name: string;
  isMissing: boolean;
}

export default function SubmitScreen() {
  const [selectedMeal, setSelectedMeal] = useState<string>("");
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [currentWeekMeals, setCurrentWeekMeals] = useState<MissingMeal[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [showAllMissing, setShowAllMissing] = useState(false);
  const [allMissingMeals, setAllMissingMeals] = useState<MissingMeal[]>([]);
  const [lastUpdated, setLastUpdated] = useState<string>("");
  const [totalCheckpoints, setTotalCheckpoints] = useState<number>(0);

  // Get current week number
  const getCurrentWeek = () => {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 1);
    const days = Math.floor(
      (now.getTime() - start.getTime()) / (24 * 60 * 60 * 1000)
    );
    return Math.ceil((days + start.getDay() + 1) / 7);
  };

  // Load missing meals data
  useEffect(() => {
    loadMissingMeals();
  }, []);

  const loadMissingMeals = async () => {
    try {
      setIsLoading(true);

      // Get current week and year
      const now = new Date();
      const currentWeek = getCurrentWeek();
      const currentYear = now.getFullYear();

      // First, get the latest checkpoint URL from the state file
      const latestCheckpointResponse = await fetch(
        "https://raw.githubusercontent.com/ndricim/bilmenu/refs/heads/main/webapp/missing-meals/latest-checkpoint.json"
      );

      if (!latestCheckpointResponse.ok) {
        throw new Error("Failed to load latest checkpoint state");
      }

      const latestCheckpointData = await latestCheckpointResponse.json();
      const latestCheckpointUrl = latestCheckpointData.latestCheckpointUrl;

      // Store metadata for display
      setLastUpdated(latestCheckpointData.lastUpdated);
      setTotalCheckpoints(latestCheckpointData.totalCheckpoints);

      // Load the latest missing meals checkpoint using the dynamic URL
      const missingMealsResponse = await fetch(latestCheckpointUrl);

      if (!missingMealsResponse.ok) {
        throw new Error("Failed to load missing meals data");
      }

      const missingMealsData = await missingMealsResponse.json();
      const missingMealsSet = new Set(missingMealsData.missingMeals);

      // Try to load current week's meal plan
      let currentWeekMeals: MissingMeal[] = [];

      try {
        const mealPlanResponse = await fetch(
          `https://raw.githubusercontent.com/ndricim/bilmenu/refs/heads/main/webapp/mealplans/meal_plan_week_${currentWeek}_${currentYear}.json`
        );

        if (mealPlanResponse.ok) {
          const mealPlanData = await mealPlanResponse.json();
          const allMeals = new Set<string>();

          // Extract all meals from the current week
          if (Array.isArray(mealPlanData)) {
            mealPlanData.forEach((day: MealPlanDay) => {
              if (day.lunch)
                day.lunch.forEach((meal: Meal) => allMeals.add(meal.tr));
              if (day.dinner)
                day.dinner.forEach((meal: Meal) => allMeals.add(meal.tr));
              if (day.alternative)
                day.alternative.forEach((meal: Meal) => allMeals.add(meal.tr));
            });
          }

          // Filter to only show missing meals from current week
          currentWeekMeals = Array.from(allMeals)
            .filter((meal) => missingMealsSet.has(meal))
            .map((meal) => ({ name: meal, isMissing: true }));
        }
      } catch (mealPlanError) {
        console.log(
          "Could not load current week meal plan, showing all missing meals"
        );
      }

      // Store all missing meals
      const allMissing = missingMealsData.missingMeals.map((meal: string) => ({
        name: meal,
        isMissing: true,
      }));
      setAllMissingMeals(allMissing);

      // If no current week meals found, show all missing meals
      if (currentWeekMeals.length === 0) {
        setCurrentWeekMeals(allMissing);
      } else {
        setCurrentWeekMeals(currentWeekMeals);
      }
    } catch (error) {
      console.error("Error loading missing meals:", error);
      Alert.alert(
        "Error",
        "Failed to load missing meals data. Please try again later."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const mealsToShow = showAllMissing ? allMissingMeals : currentWeekMeals;
  const filteredMeals = mealsToShow.filter((meal) =>
    meal.name.toLowerCase().includes(searchQuery.toLowerCase())
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
      });

      if (!result.canceled && result.assets[0]) {
        setCapturedImage(result.assets[0].uri);
        setStep(3);
      }
    } catch (error) {
      console.error("Error capturing image:", error);
      Alert.alert("Error", "Failed to capture image. Please try again.");
    }
  };

  const handleSendEmail = async () => {
    if (!capturedImage || !selectedMeal) {
      Alert.alert("Error", "Please select a meal and capture an image first.");
      return;
    }

    try {
      const isAvailable = await MailComposer.isAvailableAsync();

      if (!isAvailable) {
        Alert.alert(
          "Email Not Available",
          "Email is not configured on this device."
        );
        return;
      }

      const subject = `Missing Meal Image Submission: ${selectedMeal}`;
      const body = `
Hello BilMenu Team,

I am submitting an image for the missing meal: "${selectedMeal}"

Please find the attached image.

Best regards,
BilMenu User
      `.trim();

      await MailComposer.composeAsync({
        recipients: ["ndricim@bilmenu.com"], // Replace with your actual email
        subject,
        body,
        attachments: [capturedImage],
      });

      // Reset the form
      setSelectedMeal("");
      setCapturedImage(null);
      setStep(1);

      Alert.alert(
        "Success",
        "Email sent successfully! Thank you for your contribution."
      );
    } catch (error) {
      console.error("Error sending email:", error);
      Alert.alert("Error", "Failed to send email. Please try again.");
    }
  };

  const renderStep1 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Step 1: Select Missing Meal</Text>

      <View style={styles.weekInfo}>
        <Text style={styles.weekInfoText}>
          Week {getCurrentWeek()}, {new Date().getFullYear()}
        </Text>
        {lastUpdated && (
          <Text style={styles.lastUpdatedText}>
            Data updated: {new Date(lastUpdated).toLocaleDateString()}
          </Text>
        )}
        {totalCheckpoints > 0 && (
          <Text style={styles.checkpointCountText}>
            {totalCheckpoints} checkpoint{totalCheckpoints !== 1 ? "s" : ""}{" "}
            available
          </Text>
        )}
        <TouchableOpacity
          style={styles.toggleButton}
          onPress={() => setShowAllMissing(!showAllMissing)}
        >
          <Text style={styles.toggleButtonText}>
            {showAllMissing
              ? "Show Current Week Only"
              : "Show All Missing Meals"}
          </Text>
        </TouchableOpacity>
      </View>

      <TextInput
        style={styles.searchInput}
        placeholder="Search for a meal..."
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholderTextColor={BilMenuTheme.colors.textLight}
      />

      <ScrollView style={styles.mealsList} showsVerticalScrollIndicator={false}>
        {isLoading ? (
          <Text style={styles.loadingText}>Loading missing meals...</Text>
        ) : filteredMeals.length === 0 ? (
          <Text style={styles.noResultsText}>
            {searchQuery
              ? "No meals found matching your search."
              : "No missing meals found."}
          </Text>
        ) : (
          <>
            <Text style={styles.resultsCount}>
              {filteredMeals.length} missing meal
              {filteredMeals.length !== 1 ? "s" : ""} found
            </Text>
            {filteredMeals.map((meal, index) => (
              <TouchableOpacity
                key={index}
                style={styles.mealButton}
                onPress={() => handleMealSelection(meal.name)}
              >
                <Text style={styles.mealButtonText}>{meal.name}</Text>
              </TouchableOpacity>
            ))}
          </>
        )}
      </ScrollView>
    </View>
  );

  const renderStep2 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Step 2: Capture Image</Text>
      <Text style={styles.selectedMealText}>Selected: {selectedMeal}</Text>

      <TouchableOpacity
        style={styles.captureButton}
        onPress={handleCameraCapture}
      >
        <Text style={styles.captureButtonText}>📷 Capture Image</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.backButton} onPress={() => setStep(1)}>
        <Text style={styles.backButtonText}>← Back to Meal Selection</Text>
      </TouchableOpacity>
    </View>
  );

  const renderStep3 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Step 3: Send Email</Text>
      <Text style={styles.selectedMealText}>Meal: {selectedMeal}</Text>

      {capturedImage && (
        <View style={styles.imagePreview}>
          <Image source={{ uri: capturedImage }} style={styles.previewImage} />
        </View>
      )}

      <TouchableOpacity style={styles.sendButton} onPress={handleSendEmail}>
        <Text style={styles.sendButtonText}>📧 Send Email</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.backButton} onPress={() => setStep(2)}>
        <Text style={styles.backButtonText}>← Back to Camera</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Submit Images" />

      <View style={styles.content}>
        <Text style={styles.description}>
          Help us complete our meal image collection by submitting photos of
          missing meals.
        </Text>

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
    padding: 20,
  },
  description: {
    fontSize: 16,
    color: BilMenuTheme.colors.text,
    textAlign: "center",
    marginBottom: 20,
    lineHeight: 24,
  },
  stepContainer: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: BilMenuTheme.colors.primary,
    marginBottom: 20,
    textAlign: "center",
  },
  searchInput: {
    backgroundColor: BilMenuTheme.colors.surfaceLight,
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    color: BilMenuTheme.colors.text,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: BilMenuTheme.colors.border,
  },
  mealsList: {
    flex: 1,
  },
  mealButton: {
    backgroundColor: BilMenuTheme.colors.primaryLight,
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: BilMenuTheme.colors.border,
  },
  mealButtonText: {
    fontSize: 16,
    color: BilMenuTheme.colors.text,
    textAlign: "center",
  },
  loadingText: {
    fontSize: 16,
    color: BilMenuTheme.colors.textLight,
    textAlign: "center",
    marginTop: 50,
  },
  noResultsText: {
    fontSize: 16,
    color: BilMenuTheme.colors.textLight,
    textAlign: "center",
    marginTop: 50,
  },
  selectedMealText: {
    fontSize: 18,
    color: BilMenuTheme.colors.primary,
    textAlign: "center",
    marginBottom: 30,
    fontWeight: "600",
  },
  captureButton: {
    backgroundColor: BilMenuTheme.colors.primary,
    borderRadius: 15,
    padding: 20,
    alignItems: "center",
    marginBottom: 20,
  },
  captureButtonText: {
    fontSize: 18,
    color: BilMenuTheme.colors.textWhite,
    fontWeight: "bold",
  },
  imagePreview: {
    alignItems: "center",
    marginBottom: 30,
  },
  previewImage: {
    width: 200,
    height: 150,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: BilMenuTheme.colors.border,
  },
  sendButton: {
    backgroundColor: BilMenuTheme.colors.secondary,
    borderRadius: 15,
    padding: 20,
    alignItems: "center",
    marginBottom: 20,
  },
  sendButtonText: {
    fontSize: 18,
    color: BilMenuTheme.colors.textWhite,
    fontWeight: "bold",
  },
  backButton: {
    backgroundColor: BilMenuTheme.colors.surfaceLight,
    borderRadius: 10,
    padding: 15,
    alignItems: "center",
    borderWidth: 1,
    borderColor: BilMenuTheme.colors.border,
  },
  backButtonText: {
    fontSize: 16,
    color: BilMenuTheme.colors.text,
  },
  weekInfo: {
    marginBottom: 20,
    alignItems: "center",
  },
  weekInfoText: {
    fontSize: 16,
    color: BilMenuTheme.colors.primary,
    fontWeight: "600",
    marginBottom: 5,
  },
  lastUpdatedText: {
    fontSize: 12,
    color: BilMenuTheme.colors.textLight,
    marginBottom: 3,
  },
  checkpointCountText: {
    fontSize: 12,
    color: BilMenuTheme.colors.textLight,
    marginBottom: 10,
  },
  toggleButton: {
    backgroundColor: BilMenuTheme.colors.surfaceLight,
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: BilMenuTheme.colors.border,
  },
  toggleButtonText: {
    fontSize: 14,
    color: BilMenuTheme.colors.primary,
    fontWeight: "500",
  },
  resultsCount: {
    fontSize: 14,
    color: BilMenuTheme.colors.textLight,
    textAlign: "center",
    marginBottom: 15,
    fontStyle: "italic",
  },
});
