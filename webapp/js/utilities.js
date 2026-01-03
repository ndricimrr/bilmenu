function getWeekOfYear() {
  var date = new Date();
  // Set to nearest Thursday: current date + 4 - current day number
  // Make Sunday's day number 7
  date.setUTCDate(date.getUTCDate() + 4 - (date.getUTCDay() || 7));
  // Get first day of year
  var yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
  // Calculate full weeks to nearest Thursday
  var weekNo = Math.ceil(((date - yearStart) / 86400000 + 1) / 7);
  return weekNo;
}

function getYear() {
  // Get ISO week year (the year that contains the Thursday of the current week)
  // This ensures that weeks spanning year boundaries use the correct year
  const date = new Date();
  // Set to nearest Thursday: current date + 4 - current day number
  // Make Sunday's day number 7
  const thursday = new Date(date);
  thursday.setUTCDate(thursday.getUTCDate() + 4 - (thursday.getUTCDay() || 7));
  return thursday.getUTCFullYear();
}

function getCurrentWeekFileName() {
  const weekOfYear = getWeekOfYear();
  return `mealplans/meal_plan_week_${weekOfYear}_${getYear()}.json`;
}
