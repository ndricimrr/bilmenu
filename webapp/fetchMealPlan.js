// import { getCurrentWeekFileName } from './utilities.js';
// import { getCurrentWeekFileName } from "./utilities.js";

var mealPlanJSON = {};

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
    mealPlanJSON = jsonObject;
    console.log("Meal Plan Loaded.", jsonObject);
  } else {
    console.log("Failed to load JSON file from " + getCurrentWeekFileName());
  }
});
