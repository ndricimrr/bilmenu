export interface Meal {
  tr: string;
  en: string;
}

export interface MealPlanDay {
  date: string;
  dayOfWeek: string;
  lunch: Meal[];
  dinner: Meal[];
  alternative: Meal[];
}

export interface MissingMeal {
  name: string;
  isMissing: boolean;
}

export type MealType = "lunch" | "dinner" | "alternative";
export type Step = 1 | 2 | 3;
export type Step1View = "search" | "daymeal";
