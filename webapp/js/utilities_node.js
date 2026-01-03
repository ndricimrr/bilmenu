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

// Example 24-02-2024
function getCurrentDate() {
  // Get current date
  const today = new Date();
  const day = today.getDate().toString().padStart(2, "0");
  const month = (today.getMonth() + 1).toString().padStart(2, "0"); // January is 0!
  const year = today.getFullYear();
  return `${day}-${month}-${year}`;
}

function getWeekAndDate() {
  return "Week-" + getWeekOfYear() + "_" + getCurrentDate();
}

function getWeekAndDateJSONFileName() {
  return "kafemud_daily_parsing_snapshots/" + getWeekAndDate() + ".json";
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

/**
 * Gets the filename for the parsed resulting json to be written into
 * @returns webapp/mealplans/meal_plan_week_${weekOfYear}_${getYear()}.json
 */
function getCurrentWeekJSONFileName() {
  const weekOfYear = getWeekOfYear();
  return `webapp/mealplans/meal_plan_week_${weekOfYear}_${getYear()}.json`;
}

// Export functions based on environment
if (typeof module !== "undefined" && typeof module.exports !== "undefined") {
  // Node.js/CommonJS environment
  module.exports = {
    getWeekOfYear,
    getYear,
    getCurrentWeekJSONFileName,
    getCurrentDate,
    getWeekAndDate,
    getWeekAndDateJSONFileName,
  };
}
