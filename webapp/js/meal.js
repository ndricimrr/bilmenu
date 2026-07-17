const isNodeEnvironmentMeal =
  typeof module !== "undefined" && typeof module.exports !== "undefined";

class Meal {
  constructor(tr, en, isVegan) {
    this._tr = tr;
    this._en = en;
    this._isVegan =
      typeof isVegan === "boolean"
        ? isVegan
        : /vegan/i.test(`${tr || ""} ${en || ""}`);
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

  get isVegan() {
    return this._isVegan;
  }

  set isVegan(isVegan) {
    this._isVegan = !!isVegan;
  }

  // Convert the Meal instance to a JSON-friendly format
  toJSON() {
    return {
      tr: this._tr,
      en: this._en,
      isVegan: this._isVegan,
    };
  }

  // Create a Meal instance from a JSON object
  static fromJSON(json) {
    return new Meal(json.tr, json.en, json.isVegan);
  }
}

// Check if exports and require are defined (Node.js environment)
if (isNodeEnvironmentMeal) {
  module.exports = Meal;
} else {
  window.Meal = Meal;
}
