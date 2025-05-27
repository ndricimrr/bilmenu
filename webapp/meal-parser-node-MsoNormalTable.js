// Only applicable for a html which contains the "MsoNormalTable" css class in it. Check inspect element of the URL below or /kafemud_html_snapshots
const WRONG_PARSING = "IS_WRONG_PARSING";
const axios = require("axios");
const { TextDecoder } = require("util");

const Day = require("./day");
const Meal = require("./meal");
const Week = require("./week");

const cheerio = require("cheerio");

function parseDataMSO(responseData) {
  console.log(
    "\n\nParsing algorithm being used: \x1b[32m*** MSONormalTable ***\x1b[0m"
  );

  // Parse HTML using cheerio
  const $ = cheerio.load(responseData);
  console.log("HTML loaded successfully.");

  // Holds data for the weekly plan
  const weeklyPlan = new Week();
  console.log("Weekly plan initialized.");

  let incompatibleMealSize = false;

  // Select all DOM elements with class name "MsoNormalTable"
  const MsoNormalTableElements = $(".MsoNormalTable");
  console.log(
    `Found ${MsoNormalTableElements.length} elements with class "MsoNormalTable".`
  );

  let alternativeData = [];

  if (MsoNormalTableElements.length === 5) {
    const secondToLastMsoNormalTable = MsoNormalTableElements.eq(-2);
    if (
      !secondToLastMsoNormalTable ||
      secondToLastMsoNormalTable.length === 0
    ) {
      console.error(
        "Second-to-last MsoNormalTable element is null or undefined."
      );
      return WRONG_PARSING;
    }
    console.log("Second-to-last MsoNormalTable element selected.");

    const filteredSecondToLastMSONormalTable = secondToLastMsoNormalTable
      .find("*")
      .removeAttr("style class lang width");
    console.log(
      "Unnecessary attributes removed from second-to-last MsoNormalTable element."
    );

    const secondToLasTbodyTr =
      filteredSecondToLastMSONormalTable.find("tbody > tr");
    if (!secondToLasTbodyTr || secondToLasTbodyTr.length === 0) {
      console.error(
        "tbody > tr elements in second-to-last MsoNormalTable are null or undefined."
      );
      return WRONG_PARSING;
    }
    console.log(
      `Found ${secondToLasTbodyTr.length} tbody > tr elements in second-to-last MsoNormalTable.`
    );

    secondToLasTbodyTr.each((index, element) => {
      if (index > 0) {
        let date = $(element).find("td:first-child").text().trim();
        if (!date) {
          console.warn(
            `Date is null or undefined for index ${index}. Skipping.`
          );
          return;
        }
        date = date.replace(/\s+/g, " ").trim();
        date = /^\d+\.\d+\.\d{4}/.test(date)
          ? date.match(/^\d+\.\d+\.\d{4}/)[0]
          : null;

        if (!date) {
          console.warn(`Invalid date format for index ${index}. Skipping.`);
          return;
        }
        console.log(`Parsed date: ${date}`);

        if (index % 2 !== 0) {
          const currentDay = new Day(date);
          console.log(`Created new Day object for date: ${date}`);

          const dishElement = $(element).find("td:nth-child(2)");
          if (!dishElement || dishElement.length === 0) {
            console.warn(
              `Dish element is null or undefined for index ${index}. Skipping.`
            );
            return;
          }
          console.log("Dish element found for lunch parsing.");

          const meals =
            $(dishElement)
              .html()
              ?.split(/<br\s*\/?>|<p\s*\/?>/) || [];
          console.log(`Found ${meals.length} meals for lunch parsing.`);

          meals.forEach((mealItemHTML, index) => {
            if (index > 1) {
              let dishText = cheerio.load(mealItemHTML).root().text().trim();
              dishText = dishText.replace(/\s+/g, " ").trim();
              dishText = dishText.replace(/[\n\t]+/g, " ");
              const tr_en = dishText.split("/");
              const meal = new Meal(tr_en[0]?.trim(), tr_en[1]?.trim());
              currentDay.addLunchMeal(meal);
              console.log(`Added lunch meal: ${meal}`);
            }
          });

          let nextElement = $(element).next().find("td:first-child");
          if (!nextElement || nextElement.length === 0) {
            console.warn(
              `Next element for dinner parsing is null or undefined for index ${index}. Skipping.`
            );
            return;
          }
          console.log("Next element found for dinner parsing.");

          const dinnerMeals =
            $(nextElement)
              .html()
              ?.split(/<br\s*\/?>|<p\s*\/?>/) || [];
          console.log(`Found ${dinnerMeals.length} meals for dinner parsing.`);

          dinnerMeals.forEach((mealItemHTML, index) => {
            if (index > 1) {
              let dishText = cheerio.load(mealItemHTML).root().text().trim();
              dishText = dishText.replace(/\s+/g, " ").trim();
              dishText = dishText.replace(/[\n\t]+/g, " ");
              const tr_en = dishText.split("/");
              const meal = new Meal(tr_en[0]?.trim(), tr_en[1]?.trim());
              currentDay.addDinnerMeal(meal);
              console.log(`Added dinner meal: ${meal}`);
            }
          });

          const length_lunch = currentDay.lunch.length;
          const length_dinner = currentDay.dinner.length;

          if (length_dinner !== 4 || length_lunch !== 4) {
            console.error(
              `Invalid meal size for date ${date}. Lunch: ${length_lunch}, Dinner: ${length_dinner}`
            );
            incompatibleMealSize = true;
          }
          weeklyPlan.addDay(currentDay);
          console.log(`Added day to weekly plan: ${date}`);
        }
      }
    });

    const lastMsoNormalTable = MsoNormalTableElements.eq(-1);
    if (!lastMsoNormalTable || lastMsoNormalTable.length === 0) {
      console.error("Last MsoNormalTable element is null or undefined.");
      return WRONG_PARSING;
    }
    console.log("Last MsoNormalTable element selected.");

    const lastTbodyTr = lastMsoNormalTable.find("tbody > tr");
    if (!lastTbodyTr || lastTbodyTr.length === 0) {
      console.error(
        "tbody > tr elements in last MsoNormalTable are null or undefined."
      );
      return WRONG_PARSING;
    }
    console.log(
      `Found ${lastTbodyTr.length} tbody > tr elements in last MsoNormalTable.`
    );

    lastTbodyTr.each((index, element) => {
      if (index > 0) {
        let date = $(element).find("td:first-child").text().trim();
        if (!date) {
          console.warn(
            `Date is null or undefined for index ${index}. Skipping.`
          );
          return;
        }
        date = date.replace(/\s+/g, " ").trim();
        date = /^\d+\.\d+\.\d{4}/.test(date)
          ? date.match(/^\d+\.\d+\.\d{4}/)[0]
          : null;

        if (!date) {
          console.warn(`Invalid date format for index ${index}. Skipping.`);
          return;
        }
        console.log(`Parsed date: ${date}`);

        const currentDay = weeklyPlan.getDay(date);
        if (!currentDay) {
          console.warn(`No Day object found for date ${date}. Skipping.`);
          return;
        }
        console.log(`Found Day object for date: ${date}`);

        const dishElement = $(element).find("td:nth-child(2)");
        if (!dishElement || dishElement.length === 0) {
          console.warn(
            `Dish element is null or undefined for index ${index}. Skipping.`
          );
          return;
        }
        console.log("Dish element found for alternative parsing.");

        let filteredDishElementHTML =
          $(dishElement)
            .find("*")
            .removeAttr("style class lang")
            .end()
            .html()
            ?.replace(/\s+/g, " ") || "";
        const meals = filteredDishElementHTML
          .split(/<br\s*\/?>|<p\s*\/?>/)
          .map((str) => str.trim())
          .filter((str) => str !== "");
        console.log(
          `Found ${meals.length} alternative meals for date ${date}.`
        );

        meals.forEach((mealItem) => {
          const $temp = cheerio.load(mealItem);
          let dishText = $temp.text();
          dishText = dishText.replace(/\s+/g, " ").trim();
          dishText = dishText.replace(/[\n\t]+/g, " ");
          const tr_en = dishText.split("/");
          const meal = new Meal(tr_en[0]?.trim(), tr_en[1]?.trim());
          currentDay.addAlternativeMeal(meal);
          console.log(`Added alternative meal: ${meal}`);
        });

        const length = currentDay.alternative.length;
        if (length !== 12) {
          console.error(
            `Invalid alternative meal size for date ${date}. Length: ${length}`
          );
          incompatibleMealSize = true;
        }
        alternativeData.push({ date, alternativeDishes: meals, length });
      }
    });
  }

  if (weeklyPlan.days.length === 0) {
    console.error("No days added to weekly plan.");
    return WRONG_PARSING;
  }

  if (incompatibleMealSize) {
    console.error("Incompatible meal sizes detected.");
    return WRONG_PARSING;
  }

  console.log("Parsing completed successfully.");
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
//   parseDataMSO(responseData);
// });

module.exports = {
  parseDataMSO,
};
