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

  // holds data for the weekly plan
  const weeklyPlan = new Week();

  // set to true only if a certain meal plan
  // does not have the fixed meal number: lunch/dinner/alternative=4/4/12
  let incompatibleMealSize = false;

  // Select all DOM elements with class name "Jimmy"
  const MsoNormalTableElements = $(".MsoNormalTable");

  let alternativeData = [];

  // Check if there are at least 5 elements with class name "MsoNormalTable"
  // Simple search on Inspect Element reveals 5 on DOM thats why
  if (MsoNormalTableElements.length === 5) {
    // Select the second to last element with class name "MsoNormalTable"
    const secondToLastMsoNormalTable = MsoNormalTableElements.eq(-2);

    // remove extra unnecessary attributes to make it easier to read and debug
    const filteredSecondToLastMSONormalTable = secondToLastMsoNormalTable
      .find("*")
      .removeAttr("style class lang width");

    // Query its tbody > tr
    const secondToLasTbodyTr =
      filteredSecondToLastMSONormalTable.find("tbody > tr");
    const fs = require("fs");

    let output = [];
    // iterating for Fix Menu : Lunch + Dinner dishes
    secondToLasTbodyTr.each((index, element) => {
      // skip index = 0 as it is table header (Days / Dishes / Nutrition Facts)
      if (index > 0) {
        output.push($(element).html());
        return;
        // date is in first column (td), meals are on second td, and nutritional facts on third td

        let date = $(element).find("td:first-child").text().trim();
        // remove spaces
        date = date.replace(/\s+/g, " ").trim();

        // Pick only date and skip DoW string. dd.mm.yyyy
        date = /^\d+\.\d+\.\d{4}/.test(date)
          ? date.match(/^\d+\.\d+\.\d{4}/)[0]
          : null;

        // ODD Index = Lunch, Even Index = Dinner
        if (index % 2 !== 0) {
          const currentDay = new Day(date);
          /****************************************
          /************** LUNCH PARSING ***********
          /****************************************/

          // Parse Lunch dishes
          const dishElement = $(element).find("td:nth-child(2)");

          // split html based on paragraph and break line html elements to extract single meals
          const meals = $(dishElement)
            .html()
            .split(/<br\s*\/?>|<p\s*\/?>/);

          let dishText;
          // Iterate over the parts
          meals.forEach((mealItemHTML, index) => {
            // skip 0 & 1
            //  index 0 is just null value
            //  index 1  is "Ogle Yemeği / Lunch" TD header text
            if (index > 1) {
              // extract only text part from HTML
              dishText = cheerio.load(mealItemHTML).root().text().trim();

              // remove white space
              dishText = dishText.replace(/\s+/g, " ").trim();

              // remove new line and tabs and replace with 1 space
              dishText = dishText.replace(/[\n\t]+/g, " ");

              // split to get the Turkish/English text elements separated
              const tr_en = dishText.split("/");

              // TODO: Get Vegan options
              // TODO: Add UI to make Image Box Green or add a Vegan icon of some sort.
              // Example: There are two parts that are split. If second part contains 'veya / or' text
              // then split again accordingly to add the vegan meal there too
              // Sebzeli Tavuk Sote / Chicken sautéed with vegetables veya / or Vegan Barbunya / Kidney beans (Vegan)

              const meal = new Meal(tr_en[0].trim(), tr_en[1].trim());
              currentDay.addLunchMeal(meal);
            }
          });

          // EVEN index = dinner. Instead of waiting for next loop. do both lunch/dinner in one go and skip last index = 14
          // Parse Dinner Dishes: It should be the next() element right after the odd one (=even)
          // this saves always the last iteration. which is why, index <= 13.
          // td:first-child because TD Child 11 = Date, TD Child 22 = Lunch , TD 3 = Dinner
          let nextElement = $(element).next().find("td:first-child");

          if (nextElement) {
            const meals = $(nextElement)
              .html()
              .split(/<br\s*\/?>|<p\s*\/?>/);

            let dishText;
            meals.forEach((mealItemHTML, index) => {
              // skip
              //  index 0 is just null value
              //  index 1  is "Ogle Yemeği / Lunch" TD header text
              if (index > 1) {
                // extract only text part from HTML
                dishText = cheerio.load(mealItemHTML).root().text().trim();

                // remove white space
                dishText = dishText.replace(/\s+/g, " ").trim();

                // remove new line and tabs and replace with 1 space
                dishText = dishText.replace(/[\n\t]+/g, " ");

                // split to get the Turkish/English text elements separated
                const tr_en = dishText.split("/");

                const meal = new Meal(tr_en[0].trim(), tr_en[1].trim());
                currentDay.addDinnerMeal(meal);
              }
            });
          }

          // add length too for easier debugging
          const length_lunch = currentDay.lunch.length;
          const length_dinner = currentDay.dinner.length;

          // TODO: Change when adding Vegan Option, should be 5 afterwards
          if (length_dinner !== 4 && length_lunch != 4) {
            console.log("length_dinner=", length_dinner);
            console.log("length_lunch=", length_lunch);
            console.error(
              "Length Dinner and Lunch have less then or more than 4 Items. Must have 4"
            );
            // process.exit();
            incompatibleMealSize = true;
          }
          weeklyPlan.addDay(currentDay);
        }
      }
    });
    fs.writeFileSync("output.html", output.join(""));
    return;
    /*
      ************************************
      /// ALTERNATIVE SECTION PARSING ////
      ************************************
      */

    // Select the last element with class name "MsoNormalTable" which corresponds to alternative menu table
    const lastMsoNormalTable = MsoNormalTableElements.eq(-1);

    // Query its tbody > tr
    const lastTbodyTr = lastMsoNormalTable.find("tbody > tr");

    lastTbodyTr.each((index, element) => {
      if (index > 0) {
        let date = $(element).find("td:first-child").text().trim();

        // remove spaces
        date = date.replace(/\s+/g, " ").trim();

        // Pick only date and skip DoW string
        date = /^\d+\.\d+\.\d{4}/.test(date)
          ? date.match(/^\d+\.\d+\.\d{4}/)[0]
          : null;

        const currentDay = weeklyPlan.getDay(date);

        let alternativeDishes = [];
        const dishElement = $(element).find("td:nth-child(2)");

        // remove style, class and lang properties to make html output more readable and remove whitespace
        let filteredDishElementHTML = $(dishElement)
          .find("*")
          .removeAttr("style class lang")
          .end()
          .html()
          .replace(/\s+/g, " ");

        // split html based on paragraph and break line html elements to extract single meals
        let meals = filteredDishElementHTML.split(/<br\s*\/?>|<p\s*\/?>/);

        // remove empty string meal items
        meals = meals.map((str) => str.trim()).filter((str) => str !== "");

        // represents the text for a single dish, ex: "Muz / Banana"
        let dishText;

        // iterate over the list of 12 alternative meals for current date
        meals.forEach((mealItem) => {
          // reload String HTML back to cheerio to be able to extrat HTML innerHTML text out of it
          const $temp = cheerio.load(mealItem);
          dishText = $temp.text();

          // remove white space
          dishText = dishText.replace(/\s+/g, " ").trim();

          // remove new line and tabs and replace with 1 space
          dishText = dishText.replace(/[\n\t]+/g, " ");

          // Split based on slash to get turkish and english separate words in two parts
          const tr_en = dishText.split("/");

          const meal = new Meal(
            tr_en[0] && tr_en[0].trim(),
            tr_en[1] && tr_en[1].trim()
          );
          currentDay.addAlternativeMeal(meal);
        });

        const length = currentDay.alternative.length;

        // TODO: Change when adding Vegan Option, if needed be
        if (length !== 12) {
          console.log("length_alternative=", length);
          console.error(
            "Length Alternative have less then or more than 12 Items. Must have 12"
          );
          incompatibleMealSize = true;
          // process.exit();
        }

        // Extract lunch dishes text
        alternativeData.push({ date, alternativeDishes, length });
      }
    });
  }

  if (weeklyPlan.days.length === 0) {
    return WRONG_PARSING;
  }

  if (incompatibleMealSize) {
    return WRONG_PARSING;
  }

  return weeklyPlan;
}

// Uncomment for testing

async function fetchMealData(url) {
  try {
    const response = await axios.get(url, {
      responseType: "arraybuffer",
    });

    const decoder = new TextDecoder("ISO-8859-9"); // Assuming ISO-8859-9 (Turkish) encoding
    const responseData = decoder.decode(response.data);

    return responseData;
  } catch (error) {
    throw new Error(`Error fetching HTML: ${error}`);
  }
}
const URL = require("./constants").URL;

const responseData = fetchMealData(URL).then((responseData) => {
  parseDataMSO(responseData);
});

module.exports = {
  parseDataMSO,
};
