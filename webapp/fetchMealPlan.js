// This file is used to fetch the JSON data for the current day. To be then used in the index.html

// const Week = require("./week");

const Week = window.Week;

console.log(Week);

var weeklyMealPlan = new Week();

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
    mealPlanJSON = Week.fromJSON(JSON.parse(jsonObject));
    console.log("Meal Plan Loaded.", mealPlanJSON);
  } else {
    console.log("Failed to load JSON file from " + getCurrentWeekFileName());
  }
});
