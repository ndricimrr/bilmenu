const isNodeEnvironment =
  typeof module !== "undefined" && typeof module.exports !== "undefined";

class Meal {
  constructor(tr, en) {
    this._tr = tr;
    this._en = en;
  }

  get tr() {
    return this._tr;
  }

  set tr(tr) {
    this._tr = tr;
  }

  get en() {
    return this._en;
  }

  set en(en) {
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
    return new Meal(json.tr, json.en);
  }
}

// Check if exports and require are defined (Node.js environment)
if (isNodeEnvironment) {
  module.exports = Meal;
} else {
  window.Meal = Meal;
}
