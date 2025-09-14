import { useState, useEffect } from "react";
import { Alert } from "react-native";
import { MissingMeal, MealPlanDay } from "@/types/submit";
import {
  getCurrentWeek,
  getCurrentDayOfWeek,
  getCurrentMealTime,
} from "@/utils/submitUtils";
import { cacheUtils } from "@/utils/cacheUtils";

export const useSubmitData = () => {
  const [currentWeekMeals, setCurrentWeekMeals] = useState<MissingMeal[]>([]);
  const [allMissingMeals, setAllMissingMeals] = useState<MissingMeal[]>([]);
  const [currentWeekMealPlan, setCurrentWeekMealPlan] = useState<MealPlanDay[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<string>("");
  const [totalCheckpoints, setTotalCheckpoints] = useState<number>(0);
  const [isUsingCache, setIsUsingCache] = useState(false);

  const loadMissingMeals = async () => {
    try {
      setIsLoading(true);
      setIsUsingCache(false);

      // First, try to load cached data as fallback
      const cachedData = await cacheUtils.loadCache();
      if (cachedData) {
        console.log("Loading cached data while fetching fresh data...");
        setCurrentWeekMeals(cachedData.currentWeekMeals);
        setAllMissingMeals(cachedData.allMissingMeals);
        setCurrentWeekMealPlan(cachedData.currentWeekMealPlan);
        setLastUpdated(cachedData.lastUpdated);
        setTotalCheckpoints(cachedData.totalCheckpoints);
        setIsUsingCache(true);
        setIsLoading(false);
      }

      // Get current week and year
      const now = new Date();
      const currentWeek = getCurrentWeek();
      const currentYear = now.getFullYear();

      try {
        // First, get the latest checkpoint URL from the state file
        const latestCheckpointResponse = await fetch(
          "https://raw.githubusercontent.com/ndricimrr/bilmenu/refs/heads/main/webapp/missing-meals/latest-checkpoint.json"
        );

        if (!latestCheckpointResponse.ok) {
          throw new Error("Failed to load latest checkpoint state");
        }

        const latestCheckpointData = await latestCheckpointResponse.json();
        const latestCheckpointUrl = latestCheckpointData.latestCheckpointUrl;

        // Check if we have cached data and if it's newer than what we're about to fetch
        if (
          cachedData &&
          cacheUtils.isCacheNewerThan(
            cachedData,
            latestCheckpointData.lastUpdated
          )
        ) {
          console.log("Cached data is up to date, skipping network fetch");
          return;
        }

        // Load the latest missing meals checkpoint using the dynamic URL
        const missingMealsResponse = await fetch(latestCheckpointUrl);

        if (!missingMealsResponse.ok) {
          throw new Error("Failed to load missing meals data");
        }

        const missingMealsData = await missingMealsResponse.json();
        const missingMealsSet = new Set(missingMealsData.missingMeals);

        // Try to load current week's meal plan
        let currentWeekMeals: MissingMeal[] = [];
        let mealPlanData: MealPlanDay[] = [];

        try {
          const mealPlanResponse = await fetch(
            `https://raw.githubusercontent.com/ndricimrr/bilmenu/refs/heads/main/webapp/mealplans/meal_plan_week_${currentWeek}_${currentYear}.json`
          );

          if (mealPlanResponse.ok) {
            mealPlanData = await mealPlanResponse.json();
            const allMeals = new Set<string>();

            // Store the meal plan data for day/meal view
            if (Array.isArray(mealPlanData)) {
              setCurrentWeekMealPlan(mealPlanData);

              mealPlanData.forEach((day: MealPlanDay) => {
                if (day.lunch)
                  day.lunch.forEach((meal) => allMeals.add(meal.tr));
                if (day.dinner)
                  day.dinner.forEach((meal) => allMeals.add(meal.tr));
                if (day.alternative)
                  day.alternative.forEach((meal) => allMeals.add(meal.tr));
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
        const allMissing = missingMealsData.missingMeals.map(
          (meal: string) => ({
            name: meal,
            isMissing: true,
          })
        );

        // Update state with fresh data
        setAllMissingMeals(allMissing);
        setLastUpdated(latestCheckpointData.lastUpdated);
        setTotalCheckpoints(latestCheckpointData.totalCheckpoints);

        // If no current week meals found, show all missing meals
        if (currentWeekMeals.length === 0) {
          setCurrentWeekMeals(allMissing);
        } else {
          setCurrentWeekMeals(currentWeekMeals);
        }

        // Cache the fresh data
        await cacheUtils.saveCache({
          currentWeekMeals:
            currentWeekMeals.length === 0 ? allMissing : currentWeekMeals,
          allMissingMeals: allMissing,
          currentWeekMealPlan: mealPlanData,
          lastUpdated: latestCheckpointData.lastUpdated,
          totalCheckpoints: latestCheckpointData.totalCheckpoints,
        });

        setIsUsingCache(false);
        console.log("Successfully loaded fresh data and updated cache");
      } catch (networkError) {
        console.error("Network error loading missing meals:", networkError);

        // If we don't have cached data and network fails, show error
        if (!cachedData) {
          Alert.alert(
            "Connection Error",
            "Unable to load missing meals data. Please check your internet connection and try again."
          );
        } else {
          console.log("Using cached data due to network error");
        }
      }
    } catch (error) {
      console.error("Error loading missing meals:", error);
      if (!isUsingCache) {
        Alert.alert(
          "Error",
          "Failed to load missing meals data. Please try again later."
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Get missing meals for selected day and meal type
  const getMissingMealsForDayAndType = (
    selectedDay: number,
    selectedMealType: "lunch" | "dinner" | "alternative"
  ) => {
    if (currentWeekMealPlan.length === 0 || !allMissingMeals.length) {
      return [];
    }

    const dayData = currentWeekMealPlan[selectedDay];
    if (!dayData) return [];

    const mealsForType = dayData[selectedMealType] || [];
    const missingMealsSet = new Set(allMissingMeals.map((meal) => meal.name));

    return mealsForType
      .filter((meal) => missingMealsSet.has(meal.tr))
      .map((meal) => ({ name: meal.tr, isMissing: true }));
  };

  useEffect(() => {
    loadMissingMeals();
  }, []);

  return {
    currentWeekMeals,
    allMissingMeals,
    currentWeekMealPlan,
    isLoading,
    lastUpdated,
    totalCheckpoints,
    isUsingCache,
    getMissingMealsForDayAndType,
    loadMissingMeals,
  };
};
