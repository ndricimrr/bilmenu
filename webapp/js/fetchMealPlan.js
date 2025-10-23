// This file is used to fetch the JSON data for the current day. To be then used in the index.html
var weeklyMealPlan = {};
var mealPlanLoadCallbacks = [];
var mealPlanLoaded = false;
var mealPlanLoadFailed = false;

// Register callback to be called when meal plan loads
function onMealPlanLoad(callback) {
  if (mealPlanLoaded) {
    // Already loaded, call immediately
    callback(true);
  } else if (mealPlanLoadFailed) {
    // Already failed, call immediately
    callback(false);
  } else {
    // Register for when it loads
    mealPlanLoadCallbacks.push(callback);
  }
}

function loadJSON(filename, callback) {
  fetch(filename)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      callback(data);
    })
    .catch((error) => {
      console.error("Error loading JSON:", error);
      callback(null);
    });
}

loadJSON(getCurrentWeekFileName(), function (jsonObject) {
  if (jsonObject) {
    weeklyMealPlan = window.Week.fromJSON(jsonObject).days;
    console.log("Meal Plan Loaded.", weeklyMealPlan);
    mealPlanLoaded = true;
    // Notify all waiting callbacks
    mealPlanLoadCallbacks.forEach((cb) => cb(true));
    mealPlanLoadCallbacks = [];
  } else {
    console.log("Failed to load JSON file from " + getCurrentWeekFileName());
    mealPlanLoadFailed = true;
    // Notify all waiting callbacks of failure
    mealPlanLoadCallbacks.forEach((cb) => cb(false));
    mealPlanLoadCallbacks = [];
  }
});
