// Function to calculate week of the year
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
  const date = new Date();
  return date.getFullYear();
}

function getCurrentWeekFileName() {
  const weekOfYear = getWeekOfYear();
  return `webapp/mealplans/meal_plan_week_${weekOfYear}_${getYear()}.json`;
}

// Export functions based on environment
if (typeof module !== "undefined" && typeof module.exports !== "undefined") {
  // Node.js/CommonJS environment
  module.exports = { getWeekOfYear, getYear, getCurrentWeekFileName };
}
