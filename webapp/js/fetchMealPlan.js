// This file is used to fetch the JSON data for the current day. To be then used in the index.html
var weeklyMealPlan = {};

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
  } else {
    console.log("Failed to load JSON file from " + getCurrentWeekFileName());
  }
});
