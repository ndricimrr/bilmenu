// Function to calculate week of the year
function getWeekOfYear() {
  const date = new Date();
  const onejan = new Date(date.getFullYear(), 0, 1);
  const millisecsInDay = 86400000;
  return Math.ceil(
    ((date - onejan) / millisecsInDay + onejan.getDay() + 1) / 7
  );
}

function getYear() {
  const date = new Date();
  return date.getFullYear();
}

function getCurrentWeekFileName() {
  const weekOfYear = getWeekOfYear();
  return `mealplans/meal_plan_week_${weekOfYear}_${getYear()}.json`;
}
