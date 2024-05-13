class Day {
  constructor(date, lunch, dinner, secmeli) {
    this._date = date;
    this._lunch = lunch || [];
    this._dinner = dinner || [];
    this._secmeli = secmeli || [];
  }

  get date() {
    return this._date;
  }

  set date(date) {
    this._date = date;
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

  get secmeli() {
    return this._secmeli;
  }

  set secmeli(secmeli) {
    this._secmeli = secmeli;
  }

  addSecmeliMeal(meal) {
    this._secmeli.push(meal);
  }
}

module.exports = Day;
