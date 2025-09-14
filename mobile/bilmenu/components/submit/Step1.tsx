import React from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { BilMenuTheme } from "@/constants/theme";
import { MissingMeal, MealType, Step1View } from "@/types/submit";
import { getCurrentWeek } from "@/utils/submitUtils";
import { DayMealView } from "./DayMealView";
import { SearchView } from "./SearchView";

interface Step1Props {
  step1View: Step1View;
  onViewChange: (view: Step1View) => void;
  selectedDay: number;
  selectedMealType: MealType;
  onDayChange: (day: number) => void;
  onMealTypeChange: (mealType: MealType) => void;
  dayMealViewMeals: MissingMeal[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
  showAllMissing: boolean;
  onToggleShowAll: (showAll: boolean) => void;
  filteredMeals: MissingMeal[];
  isLoading: boolean;
  onMealSelect: (mealName: string) => void;
  lastUpdated: string;
  totalCheckpoints: number;
}

export const Step1: React.FC<Step1Props> = ({
  step1View,
  onViewChange,
  selectedDay,
  selectedMealType,
  onDayChange,
  onMealTypeChange,
  dayMealViewMeals,
  searchQuery,
  onSearchChange,
  showAllMissing,
  onToggleShowAll,
  filteredMeals,
  isLoading,
  onMealSelect,
  lastUpdated,
  totalCheckpoints,
}) => {
  return (
    <ScrollView
      style={styles.stepContainer}
      showsVerticalScrollIndicator={true}
    >
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
          onPress={() => onViewChange("daymeal")}
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
          onPress={() => onViewChange("search")}
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

      {step1View === "daymeal" ? (
        <DayMealView
          selectedDay={selectedDay}
          selectedMealType={selectedMealType}
          onDayChange={onDayChange}
          onMealTypeChange={onMealTypeChange}
          meals={dayMealViewMeals}
          isLoading={isLoading}
          onMealSelect={onMealSelect}
        />
      ) : (
        <SearchView
          searchQuery={searchQuery}
          onSearchChange={onSearchChange}
          showAllMissing={showAllMissing}
          onToggleShowAll={onToggleShowAll}
          filteredMeals={filteredMeals}
          isLoading={isLoading}
          onMealSelect={onMealSelect}
        />
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
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
});
