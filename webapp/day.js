const isNodeEnvironment =
  typeof module !== "undefined" && typeof module.exports !== "undefined";

var Meal;
if (isNodeEnvironment) {
  Meal = require("./meal");
} else {
  Meal = window.Meal;
}
// import "./meal.js";

function getDayOfTheWeek(dateString) {
  const [day, month, year] = dateString.split(".").map(Number);
  const date = new Date(year, month - 1, day);
  const adjustedDaysOfWeek = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];
  return adjustedDaysOfWeek[(date.getDay() + 6) % 7];
}

class Day {
  constructor(date, lunch, dinner, alternative) {
    this._date = date;
    this._dayOfWeek = getDayOfTheWeek(date);
    this._lunch = lunch || [];
    this._dinner = dinner || [];
    this._alternative = alternative || [];
  }

  get date() {
    return this._date;
  }

  set date(date) {
    this._date = date;
  }

  get dayOfWeek() {
    return this._dayOfWeek;
  }

  set dayOfWeek(date) {
    this._dayOfWeek = getDayOfTheWeek(date);
  }

  get lunch() {
    return this._lunch;
  }

  set lunch(lunch) {
    this._lunch = lunch;
  }

  addLunchMeal(meal) {
    this._lunch.push(meal);
  }

  get dinner() {
    return this._dinner;
  }

  set dinner(dinner) {
    this._dinner = dinner;
  }

  addDinnerMeal(meal) {
    this._dinner.push(meal);
  }

  get alternative() {
    return this._alternative;
  }

  set alternative(alternative) {
    this._alternative = alternative;
  }

  addAlternativeMeal(meal) {
    this._alternative.push(meal);
  }

  // Convert the Day instance to a JSON-friendly format
  toJSON() {
    return {
      date: this._date,
      dayOfWeek: this._dayOfWeek,
      lunch: this._lunch.map((meal) => meal.toJSON()),
      dinner: this._dinner.map((meal) => meal.toJSON()),
      alternative: this._alternative.map((meal) => meal.toJSON()),
    };
  }

  // Create a Day instance from a JSON object
  static fromJSON(json) {
    const lunch = json.lunch.map((mealJson) => Meal.fromJSON(mealJson));
    const dinner = json.dinner.map((mealJson) => Meal.fromJSON(mealJson));
    const alternative = json.alternative.map((mealJson) =>
      Meal.fromJSON(mealJson)
    );
    return new Day(json.date, lunch, dinner, alternative);
  }
}

// Check if exports and require are defined (Node.js environment)
if (isNodeEnvironment) {
  module.exports = Day;
} else {
  window.Day = Day;
}
