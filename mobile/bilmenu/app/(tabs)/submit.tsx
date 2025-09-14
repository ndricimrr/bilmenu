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
  const [step1View, setStep1View] = useState<"search" | "daymeal">("daymeal");
  const [selectedDay, setSelectedDay] = useState<number>(0);
  const [selectedMealType, setSelectedMealType] = useState<
    "lunch" | "dinner" | "alternative"
  >("lunch");
  const [currentWeekMealPlan, setCurrentWeekMealPlan] = useState<MealPlanDay[]>(
    []
  );

  // Get current week number
  const getCurrentWeek = () => {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 1);
    const days = Math.floor(
      (now.getTime() - start.getTime()) / (24 * 60 * 60 * 1000)
    );
    return Math.ceil((days + start.getDay() + 1) / 7);
  };

  // Get current day of week (Monday = 0, Sunday = 6)
  const getCurrentDayOfWeek = () => {
    const today = new Date();
    const day = today.getDay();
    return day === 0 ? 6 : day - 1; // Convert Sunday (0) to 6, others shift by 1
  };

  // Get current meal time based on hour
  const getCurrentMealTime = (): "lunch" | "dinner" | "alternative" => {
    const now = new Date();
    const hour = now.getHours();

    // Lunch: 11:00 - 15:00
    if (hour >= 11 && hour < 15) {
      return "lunch";
    }
    // Dinner: 17:00 - 21:00
    else if (hour >= 17 && hour < 21) {
      return "dinner";
    }
    // Default to lunch for other times
    else {
      return "lunch";
    }
  };

  // Get day name
  const getDayName = (dayIndex: number) => {
    const days = [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ];
    return days[dayIndex];
  };

  // Get short day name
  const getShortDayName = (dayIndex: number) => {
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    return days[dayIndex];
  };

  // Load missing meals data
  useEffect(() => {
    loadMissingMeals();
  }, []);

  // Auto-select current day and meal time
  useEffect(() => {
    const currentDay = getCurrentDayOfWeek();
    const currentMealTime = getCurrentMealTime();
    setSelectedDay(currentDay);
    setSelectedMealType(currentMealTime);
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
        "https://raw.githubusercontent.com/ndricimrr/bilmenu/refs/heads/main/webapp/missing-meals/latest-checkpoint.json"
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
          `https://raw.githubusercontent.com/ndricimrr/bilmenu/refs/heads/main/webapp/mealplans/meal_plan_week_${currentWeek}_${currentYear}.json`
        );

        if (mealPlanResponse.ok) {
          const mealPlanData = await mealPlanResponse.json();
          const allMeals = new Set<string>();

          // Store the meal plan data for day/meal view
          if (Array.isArray(mealPlanData)) {
            setCurrentWeekMealPlan(mealPlanData);

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

  // Get missing meals for selected day and meal type
  const getMissingMealsForDayAndType = () => {
    if (currentWeekMealPlan.length === 0 || !allMissingMeals.length) {
      return [];
    }

    const dayData = currentWeekMealPlan[selectedDay];
    if (!dayData) return [];

    const mealsForType = dayData[selectedMealType] || [];
    const missingMealsSet = new Set(allMissingMeals.map((meal) => meal.name));

    return mealsForType
      .filter((meal: Meal) => missingMealsSet.has(meal.tr))
      .map((meal: Meal) => ({ name: meal.tr, isMissing: true }));
  };

  const mealsToShow = showAllMissing ? allMissingMeals : currentWeekMeals;
  const filteredMeals = mealsToShow.filter((meal) =>
    meal.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Get meals for day/meal view
  const dayMealViewMeals = getMissingMealsForDayAndType();

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
      </View>

      {/* View Selection Buttons */}
      <View style={styles.viewSelector}>
        <TouchableOpacity
          style={[
            styles.viewButton,
            step1View === "daymeal" && styles.viewButtonActive,
          ]}
          onPress={() => setStep1View("daymeal")}
        >
          <Text
            style={[
              styles.viewButtonText,
              step1View === "daymeal" && styles.viewButtonTextActive,
            ]}
          >
            📅 Day & Meal
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.viewButton,
            step1View === "search" && styles.viewButtonActive,
          ]}
          onPress={() => setStep1View("search")}
        >
          <Text
            style={[
              styles.viewButtonText,
              step1View === "search" && styles.viewButtonTextActive,
            ]}
          >
            🔍 Search All
          </Text>
        </TouchableOpacity>
      </View>

      {step1View === "daymeal" ? renderDayMealView() : renderSearchView()}
    </View>
  );

  const renderDayMealView = () => (
    <>
      {/* Day Selection */}
      <View style={styles.daysContainer}>
        <Text style={styles.sectionTitle}>Select Day</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.daysScrollView}
        >
          {[0, 1, 2, 3, 4, 5, 6].map((dayIndex) => (
            <TouchableOpacity
              key={dayIndex}
              style={[
                styles.dayButton,
                selectedDay === dayIndex && styles.dayButtonActive,
                dayIndex === getCurrentDayOfWeek() && styles.dayButtonToday,
              ]}
              onPress={() => setSelectedDay(dayIndex)}
            >
              <Text
                style={[
                  styles.dayButtonText,
                  selectedDay === dayIndex && styles.dayButtonTextActive,
                ]}
              >
                {getShortDayName(dayIndex)}
              </Text>
              {dayIndex === getCurrentDayOfWeek() && (
                <Text style={styles.todayLabel}>Today</Text>
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Meal Type Selection */}
      <View style={styles.mealTypeContainer}>
        <Text style={styles.sectionTitle}>Select Meal Type</Text>
        <View style={styles.mealTypeButtons}>
          <TouchableOpacity
            style={[
              styles.mealTypeButton,
              selectedMealType === "lunch" && styles.mealTypeButtonActive,
            ]}
            onPress={() => setSelectedMealType("lunch")}
          >
            <Text
              style={[
                styles.mealTypeButtonText,
                selectedMealType === "lunch" && styles.mealTypeButtonTextActive,
              ]}
            >
              ☀️ Lunch
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.mealTypeButton,
              selectedMealType === "dinner" && styles.mealTypeButtonActive,
            ]}
            onPress={() => setSelectedMealType("dinner")}
          >
            <Text
              style={[
                styles.mealTypeButtonText,
                selectedMealType === "dinner" &&
                  styles.mealTypeButtonTextActive,
              ]}
            >
              🌙 Dinner
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.mealTypeButton,
              selectedMealType === "alternative" && styles.mealTypeButtonActive,
            ]}
            onPress={() => setSelectedMealType("alternative")}
          >
            <Text
              style={[
                styles.mealTypeButtonText,
                selectedMealType === "alternative" &&
                  styles.mealTypeButtonTextActive,
              ]}
            >
              💰 Alternative
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Missing Meals List */}
      <ScrollView style={styles.mealsList} showsVerticalScrollIndicator={true}>
        {isLoading ? (
          <Text style={styles.loadingText}>Loading missing meals...</Text>
        ) : dayMealViewMeals.length === 0 ? (
          <Text style={styles.noResultsText}>
            No missing meals found for {getDayName(selectedDay)}{" "}
            {selectedMealType}.
          </Text>
        ) : (
          <>
            <Text style={styles.resultsCount}>
              {dayMealViewMeals.length} missing meal
              {dayMealViewMeals.length !== 1 ? "s" : ""} found for{" "}
              {getDayName(selectedDay)} {selectedMealType}
            </Text>
            {dayMealViewMeals.map((meal, index) => (
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
    </>
  );

  const renderSearchView = () => (
    <>
      <TouchableOpacity
        style={styles.toggleButton}
        onPress={() => setShowAllMissing(!showAllMissing)}
      >
        <Text style={styles.toggleButtonText}>
          {showAllMissing ? "Show Current Week Only" : "Show All Missing Meals"}
        </Text>
      </TouchableOpacity>

      <TextInput
        style={styles.searchInput}
        placeholder="Search for a meal..."
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholderTextColor={BilMenuTheme.colors.textLight}
      />

      <ScrollView style={styles.mealsList} showsVerticalScrollIndicator={true}>
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
    </>
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
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
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
    color: BilMenuTheme.colors.textWhite,
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
    color: BilMenuTheme.colors.textWhite,
    marginBottom: 20,
    textAlign: "center",
  },
  searchInput: {
    backgroundColor: BilMenuTheme.colors.surface,
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
    borderWidth: 1,
    borderColor: BilMenuTheme.colors.border,
    borderRadius: 10,
    padding: 10,
    backgroundColor: BilMenuTheme.colors.surfaceLight,
  },
  mealButton: {
    backgroundColor: BilMenuTheme.colors.surface,
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
    color: BilMenuTheme.colors.textMuted,
    textAlign: "center",
    marginTop: 50,
  },
  noResultsText: {
    fontSize: 16,
    color: BilMenuTheme.colors.textMuted,
    textAlign: "center",
    marginTop: 50,
  },
  selectedMealText: {
    fontSize: 18,
    color: BilMenuTheme.colors.secondary,
    textAlign: "center",
    marginBottom: 30,
    fontWeight: "600",
  },
  captureButton: {
    backgroundColor: BilMenuTheme.colors.secondary,
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
    backgroundColor: BilMenuTheme.colors.primary,
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
    backgroundColor: BilMenuTheme.colors.surface,
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
    color: BilMenuTheme.colors.textWhite,
    fontWeight: "600",
    marginBottom: 5,
  },
  lastUpdatedText: {
    fontSize: 12,
    color: BilMenuTheme.colors.textMuted,
    marginBottom: 3,
  },
  checkpointCountText: {
    fontSize: 12,
    color: BilMenuTheme.colors.textMuted,
    marginBottom: 10,
  },
  toggleButton: {
    backgroundColor: BilMenuTheme.colors.surface,
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: BilMenuTheme.colors.border,
  },
  toggleButtonText: {
    fontSize: 14,
    color: BilMenuTheme.colors.text,
    fontWeight: "500",
  },
  resultsCount: {
    fontSize: 14,
    color: BilMenuTheme.colors.textMuted,
    textAlign: "center",
    marginBottom: 15,
    fontStyle: "italic",
  },
  viewSelector: {
    flexDirection: "row",
    marginBottom: 20,
    backgroundColor: BilMenuTheme.colors.surfaceLight,
    borderRadius: 10,
    padding: 4,
  },
  viewButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  viewButtonActive: {
    backgroundColor: BilMenuTheme.colors.surface,
  },
  viewButtonText: {
    fontSize: 14,
    color: BilMenuTheme.colors.textMuted,
    fontWeight: "500",
  },
  viewButtonTextActive: {
    color: BilMenuTheme.colors.text,
    fontWeight: "600",
  },
  sectionTitle: {
    fontSize: 16,
    color: BilMenuTheme.colors.textWhite,
    fontWeight: "600",
    marginBottom: 10,
  },
  daysContainer: {
    marginBottom: 20,
  },
  daysScrollView: {
    flexGrow: 0,
  },
  dayButton: {
    backgroundColor: BilMenuTheme.colors.surface,
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginRight: 8,
    alignItems: "center",
    minWidth: 60,
    borderWidth: 1,
    borderColor: BilMenuTheme.colors.border,
  },
  dayButtonActive: {
    backgroundColor: BilMenuTheme.colors.secondary,
  },
  dayButtonToday: {
    borderColor: BilMenuTheme.colors.secondary,
    borderWidth: 2,
  },
  dayButtonText: {
    fontSize: 14,
    color: BilMenuTheme.colors.text,
    fontWeight: "500",
  },
  dayButtonTextActive: {
    color: BilMenuTheme.colors.textWhite,
    fontWeight: "600",
  },
  todayLabel: {
    fontSize: 10,
    color: BilMenuTheme.colors.secondary,
    fontWeight: "600",
    marginTop: 2,
  },
  mealTypeContainer: {
    marginBottom: 20,
  },
  mealTypeButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  mealTypeButton: {
    flex: 1,
    backgroundColor: BilMenuTheme.colors.surface,
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 8,
    marginHorizontal: 4,
    alignItems: "center",
    borderWidth: 1,
    borderColor: BilMenuTheme.colors.border,
  },
  mealTypeButtonActive: {
    backgroundColor: BilMenuTheme.colors.primary,
  },
  mealTypeButtonText: {
    fontSize: 12,
    color: BilMenuTheme.colors.text,
    fontWeight: "500",
    textAlign: "center",
  },
  mealTypeButtonTextActive: {
    color: BilMenuTheme.colors.textWhite,
    fontWeight: "600",
  },
});
