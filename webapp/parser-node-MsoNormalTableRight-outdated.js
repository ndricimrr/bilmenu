// Only applicable for a html which contains the "MsoNormalTable" css class in it. Check inspect element of the URL below or /kafemud_html_snapshots
const WRONG_PARSING = "IS_WRONG_PARSING";
const axios = require("axios");
const { TextDecoder } = require("util");

const Day = require("./day");
const Meal = require("./meal");
const Week = require("./week");

const cheerio = require("cheerio");

function parseDataMSORight(responseData) {
  console.log(
    "\n\nParsing algorithm being used: \x1b[32m*** MSONormalTable ***\x1b[0m"
  );
  // Parse HTML using cheerio
  const $ = cheerio.load(responseData);

  // holds data for the weekly plan
  const weeklyPlan = new Week();

  // set to true only if a certain meal plan
  // does not have the fixed meal number: lunch/dinner/alternative=4/4/12
  let incompatibleMealSize = false;

  // Select all DOM elements with class name "MsoNormalTable"
  const MsoNormalTableElements = $(".MsoNormalTable");

  // Check if there are at least 5 elements with class name "MsoNormalTable"
  // Simple search on Inspect Element reveals 5 on DOM thats why
  if (MsoNormalTableElements.length === 5) {
    // Select the second to last element with class name "MsoNormalTable"
    const secondToLastMsoNormalTable = MsoNormalTableElements.eq(-2);

    // remove extra unnecessary attributes to make it easier to read and debug
    const filteredSecondToLastMSONormalTable = secondToLastMsoNormalTable
      .find("*")
      .removeAttr("style class lang width align");

    // Query its tbody > tr
    const secondToLasTbodyTr =
      filteredSecondToLastMSONormalTable.find("tbody > tr");

    // iterating for Fix Menu : Lunch + Dinner dishes
    secondToLasTbodyTr.each((index, element) => {
      // skip index = 0 as it is table header (Days / Dishes / Nutrition Facts)

      if (index >= 1) {
        // ODD Index = Lunch, Even Index = Dinner
        if (index % 2 !== 0) {
          // date is in first column (td), meals are on second td, and nutritional facts on third td

          let date = $(element).find("td:first-child").text().trim();
          // remove spaces
          date = date.replace(/\s+/g, " ").trim();

          // Pick only date and skip DoW string. dd.mm.yyyy
          date = /^\d+\.\d+\.\d{4}/.test(date)
            ? date.match(/^\d+\.\d+\.\d{4}/)[0]
            : null;

          const currentDay = new Day(date);
          /****************************************
          /************** LUNCH PARSING ***********
          /****************************************/

          // Parse Lunch dishes

          const dishElementsTr = $(element).find("td:nth-child(2)");
          const dishElementsEn = $(element).find("td:nth-child(3)");

          let splitTurkishLunchMeals = $(dishElementsTr)
            .html()
            .split(/<\/?p[^>]*>\s*/g)
            .map((item) => item.trim())
            .filter((item) => item !== "")
            .map((mealItemHTML, index) => {
              const dishText = cheerio.load(mealItemHTML).root().text().trim();
              return dishText
                .replace("Öğle Yemeği", "")
                .replace(/\s+/g, " ")
                .trim()
                .replace(/[\n\t]+/g, " ");
            })
            .flatMap((item) => {
              if (item.includes("veya")) {
                // Split the item by 'veya' and return the resulting parts
                return item.split("veya").map((part) => part.trim());
              } else {
                // If the item doesn't contain 'veya', return it as is
                return item;
              }
            })
            .filter((item) => item !== "");

          let splitEnglishLunchMeals = $(dishElementsEn)
            .html()
            .split(/<\/?p[^>]*>\s*/g)
            .map((item) => item.trim())
            .filter((item) => item !== "")
            .map((mealItemHTML, index) => {
              const dishText = cheerio.load(mealItemHTML).root().text().trim();
              return dishText
                .replace("Lunch", "")
                .replace(/\s+/g, " ")
                .trim()
                .replace(/[\n\t]+/g, " ");
            })
            .flatMap((item) => {
              if (item.includes("or /")) {
                // Split the item by 'or /' and return the resulting parts
                return item.split("or /").map((part) => part.trim());
              } else if (item.includes(" or ")) {
                // Split the item by 'or /' and return the resulting parts
                return item.split(" or ").map((part) => part.trim());
              } else {
                // If the item doesn't contain 'or /', return it as is
                return item;
              }
            })
            .filter((item) => item !== "");

          splitTurkishLunchMeals.forEach((mealTr, index) => {
            const englishName = splitEnglishLunchMeals[index];
            const lunchMeal = new Meal(mealTr, englishName);
            currentDay.addLunchMeal(lunchMeal);
          });

          // EVEN index = dinner. Instead of waiting for next loop. do both lunch/dinner in one go and skip last index = 14
          // Parse Dinner Dishes: It should be the next() element right after the odd one (=even)
          // this saves always the last iteration. which is why, index <= 13.
          // td:first-child because TD Child 11 = Date, TD Child 22 = Lunch , TD 3 = Dinner
          let nextElement = $(element).next();

          if (!nextElement) {
            return;
          }

          const dishElementsDinnerTr = $(nextElement).find("td:first-child");
          const dishElementsDinnerEn = $(nextElement).find("td:nth-child(2)");

          let splitTurkishDinnerMeals = $(dishElementsDinnerTr)
            .html()
            .split(/<\/?p[^>]*>\s*/g)
            .map((item) => item.trim())
            .filter((item) => item !== "")
            .map((mealItemHTML, index) => {
              const dishText = cheerio.load(mealItemHTML).root().text().trim();
              return dishText
                .replace("Akşam Yemeği", "")
                .replace(/\s+/g, " ")
                .trim()
                .replace(/[\n\t]+/g, " ");
            })
            .flatMap((item) => {
              if (item.includes("veya")) {
                // Split the item by 'veya' and return the resulting parts
                return item.split("veya").map((part) => part.trim());
              } else {
                // If the item doesn't contain 'veya', return it as is
                return item;
              }
            })
            .filter((item) => item !== "");

          let splitEnglishDinnerMeals = $(dishElementsDinnerEn)
            .html()
            .split(/<\/?p[^>]*>\s*/g)
            .map((item) => item.trim())
            .filter((item) => item !== "")
            .map((mealItemHTML, index) => {
              const dishText = cheerio.load(mealItemHTML).root().text().trim();
              return dishText
                .replace("Dinner", "")
                .replace(/\s+/g, " ")
                .trim()
                .replace(/[\n\t]+/g, " ");
            })
            .flatMap((item) => {
              if (item.includes("or /")) {
                // Split the item by 'or /' and return the resulting parts
                return item.split("or /").map((part) => part.trim());
              } else if (item.includes(" or ")) {
                // Split the item by 'or /' and return the resulting parts
                return item.split(" or ").map((part) => part.trim());
              } else {
                // If the item doesn't contain 'or /', return it as is
                return item;
              }
            })
            .filter((item) => item !== "");

          splitTurkishDinnerMeals.forEach((mealTr, index) => {
            const englishName = splitEnglishDinnerMeals[index];
            const lunchMeal = new Meal(mealTr, englishName);
            currentDay.addDinnerMeal(lunchMeal);
          });

          // add length too for easier debugging
          const length_lunch = currentDay.lunch.length;
          const length_dinner = currentDay.dinner.length;

          // TODO: Change when adding Vegan Option, should be 5 afterwards
          if (length_dinner !== 5 && length_lunch != 5) {
            console.log("length_dinner=", length_dinner);
            console.log("length_lunch=", length_lunch);
            console.error(
              "Length Dinner and Lunch have less then or more than 5 Items. Must have 5"
            );
            // process.exit();
            // incompatibleMealSize = true;
          }
          weeklyPlan.addDay(currentDay);
        }
      }
    });

    /*
     ************************************
     *** ALTERNATIVE SECTION PARSING  ***
     ************************************
     */

    // Select the last element with class name "MsoNormalTable" which corresponds to alternative menu table
    const lastMsoNormalTable = MsoNormalTableElements.eq(-1);

    const lastMsoNormalTableFiltered = lastMsoNormalTable
      .find("*")
      .removeAttr("style class lang width align valign");

    // Query its tbody > tr , rows
    const lastTbodyTr = lastMsoNormalTableFiltered.find("tbody > tr");

    lastTbodyTr.each((index, element) => {
      // skip first index 0 as it is the table header, and is not needed
      if (index > 0) {
        let date = $(element).find("td:first-child").text().trim();

        // remove spaces
        date = date.replace(/\s+/g, " ").trim();

        // Pick only date and skip DoW string
        date = /^\d+\.\d+\.\d{4}/.test(date)
          ? date.match(/^\d+\.\d+\.\d{4}/)[0]
          : null;

        // get the day that is already created before during lunch/dinner parsing
        const currentDay = weeklyPlan.getDay(date);

        const dishElementsTr = $(element).find("td:nth-child(2)");
        const dishElementsEn = $(element).find("td:nth-child(3)");

        let splitTurkishAlternativeMeals = $(dishElementsTr)
          .html()
          .split(/<\/?p[^>]*>\s*/g)
          .map((item) => item.trim())
          .filter((item) => item !== "")
          .map((mealItemHTML, index) => {
            const dishText = cheerio.load(mealItemHTML).root().text().trim();
            return dishText
              .replace(/\s+/g, " ")
              .trim()
              .replace(/[\n\t]+/g, " ");
          })
          .filter((item) => item !== "");

        let splitEnglishAlternativeMeals = $(dishElementsEn)
          .html()
          .split(/<\/?p[^>]*>\s*/g)
          .map((item) => item.trim())
          .filter((item) => item !== "")
          .map((mealItemHTML, index) => {
            const dishText = cheerio.load(mealItemHTML).root().text().trim();
            return dishText
              .replace(/\s+/g, " ")
              .trim()
              .replace(/[\n\t]+/g, " ");
          })
          .filter((item) => item !== "");

        splitTurkishAlternativeMeals.forEach((mealTr, index) => {
          const englishName = splitEnglishAlternativeMeals[index];
          const alternativeMeal = new Meal(mealTr, englishName);
          currentDay.addAlternativeMeal(alternativeMeal);
        });

        const length = currentDay.alternative.length;

        if (length !== 12) {
          console.log("length_alternative=", length);
          console.error(
            "Length Alternative have less then or more than 12 Items. Must have 12"
          );
          incompatibleMealSize = true;
          // process.exit();
        }
      }
    });
  }

  if (weeklyPlan.days.length === 0) {
    return WRONG_PARSING;
  }

  if (incompatibleMealSize) {
    return WRONG_PARSING;
  }

  console.log(weeklyPlan);
  return weeklyPlan;
}

// Uncomment for testing

// async function fetchMealData(url) {
//   try {
//     const response = await axios.get(url, {
//       responseType: "arraybuffer",
//     });

//     const decoder = new TextDecoder("ISO-8859-9"); // Assuming ISO-8859-9 (Turkish) encoding
//     const responseData = decoder.decode(response.data);

//     return responseData;
//   } catch (error) {
//     throw new Error(`Error fetching HTML: ${error}`);
//   }
// }
// const URL = require("./constants").URL;

// const responseData = fetchMealData(URL).then((responseData) => {
//   parseDataMSORight(responseData);
// });

module.exports = {
  parseDataMSORight,
};
