// const Day = require("./day");
// const axios = require("axios");
// const cheerio = require("cheerio");

// class MealParser {
//   constructor() {
//     this.doc = null;
//     this.Monday = new Day();
//     this.Tuesday = new Day();
//     this.Wednesday = new Day();
//     this.Thursday = new Day();
//     this.Friday = new Day();
//     this.Saturday = new Day();
//     this.Sunday = new Day();
//   }

//   async fetchDataFromUrl(url) {
//     try {
//       const response = await axios.get(
//         "http://kafemud.bilkent.edu.tr/monu_eng.html"
//       );
//       const html = response.data;

//       this.doc = cheerio.load(response.data);
//     } catch (error) {
//       console.error("Error fetching data:", error.message);
//     }
//   }

//   async fixAll() {
//     try {
//       const response = await axios.get();

//       const dateList = this.getAllWeekDays();
//       const lunchList = this.returnLunch();
//       const dinnerList = this.returnDinner();
//       const secmeliList = this.returnSecmeli();

//       for (let i = 0; i < dinnerList.length; i++) {
//         let lunch = returnDay(lunchList[i]);
//         let dinner = returnDay(dinnerList[i]);
//         let secmeli = returnDay(secmeliList[i]);

//         let tMondayLunch = [],
//           tTuesdayLunch,
//           tWednesdayLunch,
//           tThursdayLunch,
//           tFridayLunch,
//           tSaturdayLunch,
//           tSundayLunch = [];
//         let tMondayDinner = [],
//           tTuesdayDinner,
//           tWednesdayDinner,
//           tThursdayDinner,
//           tFridayDinner,
//           tSaturdayDinner,
//           tSundayDinner = [];
//         let tMondaySecmeli = [],
//           tTuesdaySecmeli,
//           tWednesdaySecmeli,
//           tThursdaySecmeli,
//           tFridaySecmeli,
//           tSaturdaySecmeli,
//           tSundaySecmeli = [];

//         for (let k = 1; k < lunch.length; k++) {
//           //lunch
//           let temp = "Not Available";
//           temp = lunch[k];
//           tMondayLunch.push(temp);
//         }

//         for (let k = 1; k < dinner.length; k++) {
//           //dinner
//           let temp = "";
//           temp = dinner[k].trim();
//           tMondayDinner.push(temp);
//         }

//         for (let k = 0; k < secmeli.length; k++) {
//           //secmeli
//           let temp = secmeli[k];
//           tMondaySecmeli.push(temp);
//         }

//         let thisDate = dateList[i].substring(0, 10);
//         if (i === 0) {
//           this.this.Monday.setDate(thisDate);
//           this.Monday.setLunch(tMondayLunch);
//           this.Monday.setDinner(tMondayDinner);
//           this.Monday.setSecmeli(tMondaySecmeli);
//         }
//         if (i === 1) {
//           this.Tuesday.setDate(thisDate);
//           this.Tuesday.setLunch(tTuesdayLunch);
//           this.Tuesday.setDinner(tTuesdayDinner);
//           this.Tuesday.setSecmeli(tTuesdaySecmeli);
//         }
//         if (i === 2) {
//           this.Wednesday.setDate(thisDate);
//           this.Wednesday.setLunch(tWednesdayLunch);
//           this.Wednesday.setDinner(tWednesdayDinner);
//           this.Wednesday.setSecmeli(tWednesdaySecmeli);
//         }
//         if (i === 3) {
//           this.Thursday.setDate(thisDate);
//           this.Thursday.setLunch(tThursdayLunch);
//           this.Thursday.setDinner(tThursdayDinner);
//           this.Thursday.setSecmeli(tThursdaySecmeli);
//         }
//         if (i === 4) {
//           this.Friday.setDate(thisDate);
//           this.Friday.setLunch(tFridayLunch);
//           this.Friday.setDinner(tFridayDinner);
//           this.Friday.setSecmeli(tFridaySecmeli);
//         }
//         if (i === 5) {
//           this.Saturday.setDate(thisDate);
//           this.Saturday.setLunch(tSaturdayLunch);
//           this.Saturday.setDinner(tSaturdayDinner);
//           this.Saturday.setSecmeli(tSaturdaySecmeli);
//         }
//         if (i === 6) {
//           this.Sunday.setDate(thisDate);
//           this.Sunday.setLunch(tSundayLunch);
//           this.Sunday.setDinner(tSundayDinner);
//           this.Sunday.setSecmeli(tSundaySecmeli);
//         }
//       }
//     } catch (error) {
//       console.error("Error fetching data:", error.message);
//     }
//   }

//   returnDays() {
//     let temp = [];
//     // adding monday
//     temp.push("Monday|" + this.Monday.getDate());
//     for (let i = 0; i < this.Monday.getLunch().length; i++)
//       temp.push(this.Monday.getLunch()[i]);
//     temp.push("____________________");
//     for (let i = 0; i < this.Monday.getDinner().length; i++)
//       temp.push(this.Monday.getDinner()[i]);
//     temp.push("____________________");
//     for (let i = 0; i < this.Monday.getSecmeli().length; i++)
//       temp.push(this.Monday.getSecmeli()[i]);
//     temp.push("");

//     // adding tuesday
//     temp.push("Tusday|" + this.Tuesday.getDate());
//     for (let i = 0; i < this.Tuesday.getLunch().length; i++)
//       temp.push(this.Tuesday.getLunch()[i]);
//     temp.push("____________________");
//     for (let i = 0; i < this.Tuesday.getDinner().length; i++)
//       temp.push(this.Tuesday.getDinner()[i]);
//     temp.push("____________________");
//     for (let i = 0; i < this.Tuesday.getSecmeli().length; i++)
//       temp.push(this.Tuesday.getSecmeli()[i]);
//     temp.push("");

//     // adding wednesday
//     temp.push("Wednesday|" + this.Wednesday.getDate());
//     for (let i = 0; i < this.Wednesday.getLunch().length; i++)
//       temp.push(this.Wednesday.getLunch()[i]);
//     temp.push("____________________");
//     for (let i = 0; i < this.Wednesday.getDinner().length; i++)
//       temp.push(this.Wednesday.getDinner()[i]);
//     temp.push("____________________");
//     for (let i = 0; i < this.Wednesday.getSecmeli().length; i++)
//       temp.push(this.Wednesday.getSecmeli()[i]);
//     temp.push("");

//     // adding thursday
//     temp.push("Thursday|" + this.Thursday.getDate());
//     for (let i = 0; i < this.Thursday.getLunch().length; i++)
//       temp.push(this.Thursday.getLunch()[i]);
//     temp.push("____________________");
//     for (let i = 0; i < this.Thursday.getDinner().length; i++)
//       temp.push(this.Thursday.getDinner()[i]);
//     temp.push("____________________");
//     for (let i = 0; i < this.Thursday.getSecmeli().length; i++)
//       temp.push(this.Thursday.getSecmeli()[i]);
//     temp.push("");

//     // adding friday
//     temp.push("Friday|" + this.Friday.getDate());
//     for (let i = 0; i < this.Friday.getLunch().length; i++)
//       temp.push(this.Friday.getLunch()[i]);
//     temp.push("____________________");
//     for (let i = 0; i < this.Friday.getDinner().length; i++)
//       temp.push(this.Friday.getDinner()[i]);
//     temp.push("____________________");
//     for (let i = 0; i < this.Friday.getSecmeli().length; i++)
//       temp.push(this.Friday.getSecmeli()[i]);
//     temp.push("");

//     // adding saturday
//     temp.push("Saturday|" + this.Saturday.getDate());
//     for (let i = 0; i < this.Saturday.getLunch().length; i++)
//       temp.push(this.Saturday.getLunch()[i]);
//     temp.push("____________________");
//     for (let i = 0; i < this.Saturday.getDinner().length; i++)
//       temp.push(this.Saturday.getDinner()[i]);
//     temp.push("____________________");
//     for (let i = 0; i < this.Saturday.getSecmeli().length; i++)
//       temp.push(this.Saturday.getSecmeli()[i]);
//     temp.push("");

//     // adding sunday
//     temp.push("Sunday|" + this.Sunday.getDate());
//     for (let i = 0; i < this.Sunday.getLunch().length; i++)
//       temp.push(this.Sunday.getLunch()[i]);
//     temp.push("____________________");
//     for (let i = 0; i < this.Sunday.getDinner().length; i++)
//       temp.push(this.Sunday.getDinner()[i]);
//     temp.push("____________________");
//     for (let i = 0; i < this.Sunday.getSecmeli().length; i++)
//       temp.push(this.Sunday.getSecmeli()[i]);
//     return temp;
//   }

//   static removeExtraSpaces(input) {
//     let temp = input;
//     for (let i = input.length - 1; i > 0; i--) {
//       if (input.charAt(i) === " ") {
//         temp = input.substring(0, i);
//       } else {
//         break;
//       }
//     }
//     return temp;
//   }

//   removeBrackets(input) {
//     let temp = input;
//     for (let i = 0; i < input.length; i++) {
//       if (input.charAt(i) === ")") {
//         temp = input.substring(i + 1, input.length);
//       } else break;
//     }
//     return temp;
//   }

//   static getAllWeekDays() {
//     const table = this.doc("table");
//     const rows = table.eq(0).find("tr");
//     const list = [];

//     rows.each((index, row) => {
//       const columns = this.doc(row).find("td");
//       if (columns.length === 3 && !columns.text().includes("DAYS")) {
//         list.push(columns.eq(0).text());
//       }
//     });

//     return list;
//   }

//   returnDay(str) {
//     let base = str;
//     let start = 0;
//     let list = [];
//     let check = true;
//     while (check) {
//       let temp = base.indexOf("\n", start);
//       if (temp < 0) {
//         check = false;
//         break;
//       }

//       if (removeExtraSpaces(base.substring(start, temp)).length > 2)
//         list.push(removeExtraSpaces(base.substring(start, temp)));
//       start = temp + 2;
//     }
//     return list;
//   }

//   getAllWeekDays() {
//     let element = document.querySelectorAll("table");
//     let rows = element[0].querySelectorAll("tr");
//     let list = [];
//     for (let i = 0; i < rows.length; i++) {
//       let row = rows[i];
//       let tds = row.querySelectorAll("td");
//       if (tds.length == 3 && !row.textContent.includes("DAYS"))
//         list.push(tds[0].textContent);
//     }
//     return list;
//   }

//   returnLunch() {
//     let element = document.querySelectorAll("table");
//     let rows = element[0].querySelectorAll("tr");
//     let list = [];
//     for (let i = 0; i < rows.length; i++) {
//       let row = rows[i];
//       let tds = row.querySelectorAll("td");
//       if (tds.length == 3 && !row.textContent.includes("DISHES")) {
//         //lunch
//         let elm = tds[1];
//         let str = elm.innerHTML.replace(/<br\s*\/?>/gi, "br2n");
//         let str2 = str.replace(/br2n/g, "\n");
//         if (str2.includes("veya") && str2.includes("rian)")) {
//           str2 =
//             str2.substring(0, str2.indexOf("veya")) +
//             str2.substring(str2.indexOf("rian)") + 5, str2.length);
//           console.log("_____" + str2 + "____");
//         } else if (str2.includes("veya") && !str2.includes("rian)")) {
//           str2 =
//             str2.substring(0, str2.indexOf("veya")) +
//             str2.substring(str2.indexOf("rian") + 4, str2.length);
//         }
//         list.push(str2 + "\n");
//       }
//     }
//     return list;
//   }

//   trimEnd(myString) {
//     for (let i = myString.length - 1; i >= 0; --i) {
//       if (myString.charAt(i) === " ") {
//         continue;
//       } else {
//         myString = myString.substring(0, i + 1);
//         break;
//       }
//     }
//     return myString;
//   }

//   returnDinner() {
//     let element = document.querySelectorAll("table");
//     let rows = element[0].querySelectorAll("tr");
//     let list = [];
//     for (let i = 0; i < rows.length; i++) {
//       let row = rows[i];
//       let tds = row.querySelectorAll("td");
//       if (tds.length == 2 && row.textContent.includes("inner")) {
//         //dinner
//         let elm = tds[0];
//         let str = elm.innerHTML.replace(/<br\s*\/?>/gi, "br2n");
//         let str2 = str.replace(/br2n/g, "\n");
//         if (str2.includes("veya")) {
//           str2 =
//             str2.substring(0, str2.indexOf("veya")) +
//             removeBrackets(
//               str2.substring(str2.indexOf("arian") + 5, str2.length)
//             );
//         }
//         list.push(str2.trim() + "\n");
//       }
//     }
//     return list;
//   }

//   returnEnergy() {
//     let element = document.querySelectorAll("table");
//     let rows = element[0].querySelectorAll("tr");
//     let list = [];
//     for (let i = 0; i < rows.length; i++) {
//       let row = rows[i];
//       let tds = row.querySelectorAll("td");
//       if (tds.length == 3) {
//         list.push(tds[2].textContent);
//       }
//     }
//     return list;
//   }
// }

// const parser = new MealParser();
// parser.fixAll().then(() => {
//   const days = parser.returnDays();
//   console.log(days);
// });

// URL of the HTML page
// const url = "http://kafemud.bilkent.edu.tr/monu_eng.html";

const axios = require("axios");
const cheerio = require("cheerio");

// URL of the HTML page
const url = "http://kafemud.bilkent.edu.tr/monu_eng.html";

// Make a request to the URL

axios
  .get(url, { responseType: "arraybuffer", responseEncoding: "utf-8" })
  .then((response) => {
    // Parse HTML using cheerio
    const $ = cheerio.load(response.data);

    // Extract information from the table
    const data = [];

    $("tbody tr").each((index, element) => {
      let day = $(element).find("td:first-child").text().trim();

      // remove spaces
      day = day.replace(/\s+/g, " ").trim();

      // Pick only date and skip DoW string
      day = /^\d+\.\d+\.\d{4}/.test(day)
        ? day.match(/^\d+\.\d+\.\d{4}/)[0]
        : null;

      // Extract lunch dishes text
      const lunchDishes = [];
      $(element)
        .find("td:nth-child(2)")
        .find("font")
        .each((idx, dishElement) => {
          let dishText = $(dishElement).text().trim();
          const additionalInfo = $(dishElement).next("i").text().trim();
          if (additionalInfo) {
            dishText += " / " + additionalInfo.replace(/[\n\t]+/g, " ");
          }
          dishText = dishText.replace(/\s+/g, " ").trim();

          lunchDishes.push(dishText.replace(/[\n\t]+/g, " "));
        });

      // Extract dinner dishes text
      const dinnerDishes = $(element).find("td:nth-child(3)").text().trim();

      data.push({ day, lunchDishes, dinnerDishes });
    });

    // Print the extracted data
    console.log(data);
  })
  .catch((error) => {
    console.error("Error fetching HTML:", error);
  });
