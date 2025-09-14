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
import { useTranslations } from "@/hooks/use-translations";

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
}) => {
  const { t } = useTranslations();
  return (
    <ScrollView
      style={styles.stepContainer}
      showsVerticalScrollIndicator={true}
    >
      <Text style={styles.stepTitle}>{t("submit.step1.title")}</Text>

      <View style={styles.weekInfo}>
        <Text style={styles.weekInfoText}>
          {t("submit.step1.weekInfo", {
            week: getCurrentWeek(),
            year: new Date().getFullYear(),
          })}
        </Text>
        {lastUpdated && (
          <Text style={styles.lastUpdatedText}>
            {t("submit.step1.dataUpdated", {
              date: new Date(lastUpdated).toLocaleDateString(),
            })}
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
            📅 {t("submit.step1.viewSelector.dayMeal")}
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
            🔍 {t("submit.step1.viewSelector.search")}
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
