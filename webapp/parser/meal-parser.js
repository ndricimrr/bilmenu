class MealParser {
  constructor() {
    this.doc = null;
    this.Monday = new Day();
    this.Tuesday = new Day();
    this.Wednesday = new Day();
    this.Thursday = new Day();
    this.Friday = new Day();
    this.Saturday = new Day();
    this.Sunday = new Day();
  }

  async fixAll() {
    try {
      const response = await axios.get(
        "http://kafemud.bilkent.edu.tr/monu_eng.html"
      );
      this.doc = cheerio.load(response.data);
      const dateList = this.getAllWeekDays();
      const lunchList = this.returnLunch();
      const dinnerList = this.returnDinner();
      const secmeliList = this.returnSecmeli();

      // ... (rest of the code remains unchanged)
    } catch (error) {
      console.error("Error fetching data:", error.message);
    }
  }

  // ... (rest of the code remains unchanged)

  static removeExtraSpaces(input) {
    let temp = input;
    for (let i = input.length - 1; i > 0; i--) {
      if (input.charAt(i) === " ") {
        temp = input.substring(0, i);
      } else {
        break;
      }
    }
    return temp;
  }

  // ... (rest of the code remains unchanged)

  static getAllWeekDays() {
    const table = this.doc("table");
    const rows = table.eq(0).find("tr");
    const list = [];

    rows.each((index, row) => {
      const columns = this.doc(row).find("td");
      if (columns.length === 3 && !columns.text().includes("DAYS")) {
        list.push(columns.eq(0).text());
      }
    });

    return list;
  }

  // ... (rest of the code remains unchanged)

  static async returnLunch() {
    const table = this.doc("table");
    const rows = table.eq(0).find("tr");
    const list = [];

    rows.each((index, row) => {
      const columns = this.doc(row).find("td");
      if (columns.length === 3 && !columns.text().includes("DISHES")) {
        const elm = columns.eq(1);
        let str = elm.html().replace(/<br\s*\/?>/g, "br2n");
        str = str.replace(/br2n/g, "\n");

        // Additional processing if needed

        list.push(str + "\n");
      }
    });

    return list;
  }

  // ... (rest of the code remains unchanged)

  // Similarly, update the other methods to use this.doc instead of doc
}

const parser = new MealParser();
parser.fixAll().then(() => {
  const days = parser.returnDays();
  console.log(days);
});
