// const Day = require("./day");

import Day from "./day.js";
class Week {
  constructor() {
    this._days = [];
  }

  addDay(day) {
    if (day instanceof Day) {
      this._days.push(day);
    } else {
      throw new Error("Argument must be an instance of Day");
    }
  }

  getDay(date) {
    return this._days.find((day) => day.date === date);
  }
  // Generate a string representation of the Week instance
  toString() {
    return this._days
      .map((day) => {
        const lunch =
          day.lunch
            .map((meal) => `${meal.turkish_name} (${meal.english_name})`)
            .join(", ") || "No lunch items";
        const dinner =
          day.dinner
            .map((meal) => `${meal.turkish_name} (${meal.english_name})`)
            .join(", ") || "No dinner items";
        const alternative =
          day.alternative
            .map((meal) => `${meal.turkish_name} (${meal.english_name})`)
            .join(", ") || "No alternative items";

        return (
          `Date: ${day.date}\n` +
          `Day of the Week: ${day.dayOfWeek}\n` +
          `Lunch: ${lunch}\n` +
          `Dinner: ${dinner}\n` +
          `Alternative: ${alternative}\n`
        );
      })
      .join("\n");
  }

  // Convert the Week instance to a JSON-friendly format
  toJSON() {
    return this._days.map((day) => day.toJSON());
  }

  // Create a Week instance from a JSON object
  static fromJSON(json) {
    const week = new Week();
    week._days = json.map((dayJson) => Day.fromJSON(dayJson));
    return week;
  }
}

// Check if exports and require are defined (Node.js environment)
if (typeof module !== "undefined" && typeof module.exports !== "undefined") {
  module.exports = Week;
} else {
  window.Week = Week;
}
