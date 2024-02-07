class Day {
  constructor() {
    this.date = "";
    this.lunch = [];
    this.dinner = [];
    this.secmeli = [];
  }

  setAll(date, lunchList, dinnerList, secmeliList) {
    this.setDate(date);
    this.setLunch(lunchList);
    this.setDinner(dinnerList);
    this.setSecmeli(secmeliList);
  }

  setDate(str) {
    this.date = str;
  }

  getDate() {
    return this.date;
  }

  setLunch(list) {
    this.lunch = list;
  }

  getLunch() {
    return this.lunch;
  }

  setDinner(list) {
    this.dinner = list;
  }

  getDinner() {
    return this.dinner;
  }

  setSecmeli(list) {
    this.secmeli = list;
  }

  getSecmeli() {
    return this.secmeli;
  }
}

module.exports = Day;
