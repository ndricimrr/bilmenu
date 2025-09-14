import React from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Switch,
} from "react-native";
import { BilMenuTheme } from "@/constants/theme";
import { MissingMeal } from "@/types/submit";
import { useTranslations } from "@/hooks/use-translations";

interface SearchViewProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  showAllMissing: boolean;
  onToggleShowAll: (showAll: boolean) => void;
  filteredMeals: MissingMeal[];
  isLoading: boolean;
  onMealSelect: (mealName: string) => void;
}

export const SearchView: React.FC<SearchViewProps> = ({
  searchQuery,
  onSearchChange,
  showAllMissing,
  onToggleShowAll,
  filteredMeals,
  isLoading,
  onMealSelect,
}) => {
  const { t } = useTranslations();
  return (
    <>
      <View style={styles.toggleContainer}>
        <View style={styles.toggleRow}>
          <View style={styles.toggleInfo}>
            <Text style={styles.toggleLabel}>
              {showAllMissing
                ? t("submit.search.allMissingMeals")
                : t("submit.search.currentWeekOnly")}
            </Text>
          </View>
          <Switch
            value={showAllMissing}
            onValueChange={onToggleShowAll}
            trackColor={{
              false: BilMenuTheme.colors.switchTrack,
              true: BilMenuTheme.colors.secondary,
            }}
            thumbColor={
              showAllMissing
                ? BilMenuTheme.colors.switchThumbActive
                : BilMenuTheme.colors.switchThumb
            }
          />
        </View>
      </View>

      <TextInput
        style={styles.searchInput}
        placeholder={t("submit.search.placeholder")}
        value={searchQuery}
        onChangeText={onSearchChange}
        placeholderTextColor={BilMenuTheme.colors.textLight}
      />

      <ScrollView style={styles.mealsList} showsVerticalScrollIndicator={true}>
        {isLoading ? (
          <Text style={styles.loadingText}>{t("submit.dayMeal.loading")}</Text>
        ) : filteredMeals.length === 0 ? (
          <Text style={styles.noResultsText}>
            {searchQuery
              ? t("submit.search.noResults")
              : t("submit.step1.noMealsFound")}
          </Text>
        ) : (
          <>
            <Text style={styles.resultsCount}>
              {t("submit.search.resultsCount", {
                count: filteredMeals.length,
                plural: filteredMeals.length !== 1 ? "s" : "",
              })}
            </Text>
            {filteredMeals.map((meal, index) => (
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
  toggleContainer: {
    backgroundColor: BilMenuTheme.colors.surface,
    borderRadius: BilMenuTheme.borderRadius.medium,
    padding: BilMenuTheme.spacing.md,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  toggleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: BilMenuTheme.spacing.xs,
  },
  toggleInfo: {
    flex: 1,
    marginRight: BilMenuTheme.spacing.sm,
  },
  toggleLabel: {
    fontSize: BilMenuTheme.typography.body.fontSize,
    fontWeight: BilMenuTheme.typography.subtitle.fontWeight,
    color: BilMenuTheme.colors.text,
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
