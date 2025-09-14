import { MealType } from "@/types/submit";

// Get current week number (ISO week)
export const getCurrentWeek = () => {
  const now = new Date();
  const target = new Date(now.valueOf());
  const dayNr = (now.getDay() + 6) % 7;
  target.setDate(target.getDate() - dayNr + 3);
  const firstThursday = target.valueOf();
  target.setMonth(0, 1);
  if (target.getDay() !== 4) {
    target.setMonth(0, 1 + ((4 - target.getDay() + 7) % 7));
  }
  return 1 + Math.ceil((firstThursday - target.valueOf()) / 604800000);
};

// Get current day of week (Monday = 0, Sunday = 6)
export const getCurrentDayOfWeek = () => {
  const today = new Date();
  const day = today.getDay();
  return day === 0 ? 6 : day - 1; // Convert Sunday (0) to 6, others shift by 1
};

// Get current meal time based on hour
export const getCurrentMealTime = (): MealType => {
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
export const getDayName = (dayIndex: number) => {
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
export const getShortDayName = (dayIndex: number) => {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  return days[dayIndex];
};
