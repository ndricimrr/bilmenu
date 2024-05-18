const isNodeEnvironment =
  typeof module !== "undefined" && typeof module.exports !== "undefined";

class Meal {
  constructor(tr, en) {
    this._tr = tr;
    this._en = en;
  }

  get turkish_name() {
    return this._tr;
  }

  set turkish_name(tr) {
    this._tr = tr;
  }

  get english_name() {
    return this._en;
  }

  set english_name(en) {
    this._en = en;
  }

  // Convert the Meal instance to a JSON-friendly format
  toJSON() {
    return {
      tr: this._tr,
      en: this._en,
    };
  }

  // Create a Meal instance from a JSON object
  static fromJSON(json) {
    return new Meal(json.turkish_name, json.english_name);
  }
}

// Check if exports and require are defined (Node.js environment)
if (isNodeEnvironment) {
  module.exports = Meal;
} else {
  console.log("Setting window object - Meal");

  window.Meal = Meal;
}
