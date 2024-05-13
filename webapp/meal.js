class Meal {
  constructor(tr, en) {
    this._turkish_name = tr;
    this._english_name = en;
  }

  get turkish_name() {
    return this._turkish_name;
  }

  set turkish_name(tr) {
    this._turkish_name = tr;
  }

  get english_name() {
    return this._english_name;
  }

  set english_name(en) {
    this._english_name = en;
  }
}
