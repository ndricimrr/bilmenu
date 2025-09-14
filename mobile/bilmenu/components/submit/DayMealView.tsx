import React from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { BilMenuTheme } from "@/constants/theme";
import { MissingMeal, MealType } from "@/types/submit";
import {
  getCurrentDayOfWeek,
  getDayName,
  getShortDayName,
} from "@/utils/submitUtils";
import { useTranslations } from "@/hooks/use-translations";

interface DayMealViewProps {
  selectedDay: number;
  selectedMealType: MealType;
  onDayChange: (day: number) => void;
  onMealTypeChange: (mealType: MealType) => void;
  meals: MissingMeal[];
  isLoading: boolean;
  onMealSelect: (mealName: string) => void;
}

export const DayMealView: React.FC<DayMealViewProps> = ({
  selectedDay,
  selectedMealType,
  onDayChange,
  onMealTypeChange,
  meals,
  isLoading,
  onMealSelect,
}) => {
  const { t } = useTranslations();
  return (
    <>
      {/* Day Selection */}
      <View style={styles.daysContainer}>
        <Text style={styles.sectionTitle}>{t("submit.dayMeal.selectDay")}</Text>
        <View style={styles.daysGrid}>
          {[0, 1, 2, 3, 4, 5, 6].map((dayIndex) => (
            <TouchableOpacity
              key={dayIndex}
              style={[
                styles.dayButton,
                selectedDay === dayIndex && styles.dayButtonActive,
                dayIndex === getCurrentDayOfWeek() && styles.dayButtonToday,
              ]}
              onPress={() => onDayChange(dayIndex)}
            >
              <Text
                style={[
                  styles.dayButtonText,
                  selectedDay === dayIndex && styles.dayButtonTextActive,
                ]}
              >
                {getShortDayName(dayIndex, t)}
              </Text>
              {dayIndex === getCurrentDayOfWeek() && (
                <Text
                  style={[
                    styles.todayLabel,
                    selectedDay === dayIndex && styles.todayLabelActive,
                  ]}
                >
                  {t("submit.dayMeal.today")}
                </Text>
              )}
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Meal Type Selection */}
      <View style={styles.mealTypeContainer}>
        <Text style={styles.sectionTitle}>
          {t("submit.dayMeal.selectMealType")}
        </Text>
        <View style={styles.mealTypeButtons}>
          <TouchableOpacity
            style={[
              styles.mealTypeButton,
              styles.mealTypeButtonLeft,
              selectedMealType === "lunch" && styles.mealTypeButtonActive,
            ]}
            onPress={() => onMealTypeChange("lunch")}
          >
            <Text
              style={[
                styles.mealTypeButtonText,
                selectedMealType === "lunch" && styles.mealTypeButtonTextActive,
              ]}
            >
              ☀️ {t("submit.dayMeal.lunch")}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.mealTypeButton,
              styles.mealTypeButtonCenter,
              selectedMealType === "dinner" && styles.mealTypeButtonActive,
            ]}
            onPress={() => onMealTypeChange("dinner")}
          >
            <Text
              style={[
                styles.mealTypeButtonText,
                selectedMealType === "dinner" &&
                  styles.mealTypeButtonTextActive,
              ]}
            >
              🌙 {t("submit.dayMeal.dinner")}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.mealTypeButton,
              styles.mealTypeButtonRight,
              selectedMealType === "alternative" && styles.mealTypeButtonActive,
            ]}
            onPress={() => onMealTypeChange("alternative")}
          >
            <Text
              style={[
                styles.mealTypeButtonText,
                selectedMealType === "alternative" &&
                  styles.mealTypeButtonTextActive,
              ]}
            >
              💰 {t("submit.dayMeal.alternative")}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Missing Meals List */}
      <ScrollView style={styles.mealsList} showsVerticalScrollIndicator={true}>
        {isLoading ? (
          <Text style={styles.loadingText}>{t("submit.dayMeal.loading")}</Text>
        ) : meals.length === 0 ? (
          <Text style={styles.noResultsText}>
            {t("submit.dayMeal.noResults", {
              day: getDayName(selectedDay, t),
              mealType: selectedMealType,
            })}
          </Text>
        ) : (
          <>
            <Text style={styles.resultsCount}>
              {t("submit.dayMeal.resultsCount", {
                count: meals.length,
                plural: meals.length !== 1 ? "s" : "",
                day: getDayName(selectedDay, t),
                mealType: selectedMealType,
              })}
            </Text>
            {meals.map((meal, index) => (
              <TouchableOpacity
                key={index}
                style={styles.mealButton}
                onPress={() => onMealSelect(meal.name)}
              >
                <Text style={styles.mealButtonIcon}>+</Text>
                <Text style={styles.mealButtonText}>{meal.name}</Text>
              </TouchableOpacity>
            ))}
          </>
        )}
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: 16,
    color: BilMenuTheme.colors.textWhite,
    fontWeight: "600",
    marginBottom: 10,
  },
  daysContainer: {
    marginBottom: 20,
  },
  daysGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  dayButton: {
    backgroundColor: BilMenuTheme.colors.surface,
    borderRadius: 6,
    paddingVertical: 2,
    paddingHorizontal: 6,
    marginBottom: 8,
    alignItems: "center",
    justifyContent: "center",
    flexBasis: "13.5%",
    minWidth: 48,
    height: 32,
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
    fontSize: 11,
    color: BilMenuTheme.colors.text,
    fontWeight: "500",
  },
  dayButtonTextActive: {
    color: BilMenuTheme.colors.textWhite,
    fontWeight: "600",
  },
  todayLabel: {
    fontSize: 8,
    color: BilMenuTheme.colors.text,
    fontWeight: "600",
    marginTop: 1,
  },
  todayLabelActive: {
    color: BilMenuTheme.colors.textWhite,
  },
  mealTypeContainer: {
    marginBottom: 20,
  },
  mealTypeButtons: {
    flexDirection: "row",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
    overflow: "hidden",
  },
  mealTypeButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 8,
    alignItems: "center",
    borderRightWidth: 1,
    borderRightColor: "rgba(255, 255, 255, 0.2)",
  },
  mealTypeButtonLeft: {
    borderTopLeftRadius: 9,
    borderBottomLeftRadius: 9,
  },
  mealTypeButtonCenter: {
    // No additional border radius for center
  },
  mealTypeButtonRight: {
    borderTopRightRadius: 9,
    borderBottomRightRadius: 9,
    borderRightWidth: 0, // Remove right border for last button
  },
  mealTypeButtonActive: {
    backgroundColor: "#FF9434",
  },
  mealTypeButtonText: {
    fontSize: 12,
    color: BilMenuTheme.colors.textWhite,
    fontWeight: "500",
    textAlign: "center",
  },
  mealTypeButtonTextActive: {
    color: BilMenuTheme.colors.textWhite,
    fontWeight: "600",
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
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: BilMenuTheme.colors.border,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  mealButtonIcon: {
    fontSize: 18,
    color: BilMenuTheme.colors.secondary,
    fontWeight: "bold",
    marginRight: 8,
  },
  mealButtonText: {
    fontSize: 14,
    color: BilMenuTheme.colors.text,
    flex: 1,
    textAlign: "left",
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
  resultsCount: {
    fontSize: 12,
    color: BilMenuTheme.colors.textMuted,
    textAlign: "center",
    marginBottom: 12,
    fontStyle: "italic",
  },
});
