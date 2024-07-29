// Only applicable for a html which contains the "MsoNormalTable" css class in it. Check inspect element of the URL below or /kafemud_html_snapshots
const WRONG_PARSING = "IS_WRONG_PARSING";
const axios = require("axios");
const { TextDecoder } = require("util");

const Day = require("./day");
const Meal = require("./meal");
const Week = require("./week");

const cheerio = require("cheerio");

function parseDataMSO_07_2024(responseData) {
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
  if (MsoNormalTableElements.length === 2) {

    // Select the first (i=0) "MsoNormalTable" for fix menu data
    const firstMsoNormalTableFixMenu = MsoNormalTableElements.eq(0);

    // remove extra unnecessary attributes to make it easier to read and debug
    const filteredFixMenuMSONormalTable = firstMsoNormalTableFixMenu
      .find("*")
      .removeAttr("style class lang width align");

    // Query its tbody > tr
    // remove first two rows since table header not needed
    const fixMenuTRs =
    filteredFixMenuMSONormalTable.find("tbody > tr").slice(2);

    let date; 
    let currentDay;

    // iterating for Fix Menu : Lunch + Dinner dishes
    fixMenuTRs.each((index, element) => {
        /**
         * td (1) = Date
         * 
         * td (1) = Meal (Turkish)
         * td (2) = Meal (English)
         * 
         * td (3) = Nutrition (TR)
         * td (4) = Nutrition (EN)
         * 
         */
        
        if (index % 12 === 0) {
          // add the current day before adding the next day. since the meals are iterated sequentially
          if (currentDay){ // skip adding to empty day on first iteration
            // produce warnings if wrong number of meals found
            checkFixMenuLength(currentDay);
            weeklyPlan.addDay(currentDay);
          }
          date = $(element).find("td:first-child").text().trim();

          // remove spaces
          date = date.replace(/\s+/g, " ").trim();
  
          // Pick only date and skip DoW string. dd.mm.yyyy
          date = /^\d+\.\d+\.\d{4}/.test(date)
            ? date.match(/^\d+\.\d+\.\d{4}/)[0]
            : null;

          currentDay = new Day(date);
          return;
        }
       
        /****************************************
        /************** LUNCH PARSING ***********
        /****************************************/
       
        // Parse Lunch / Dinner dishes
        const currentDishTrRaw = $(element).find("td:first-child").text();
        const currentDishTr = currentDishTrRaw.replace(/\s+/g, " ").replace(/[\n\t]+/g, " ").replace(/\bveya\b/g, '').trim();
        const currentDishEnRaw = $(element).find("td:nth-child(2)").text();
        const currentDishEn = currentDishEnRaw.replace(/\s+/g, " ").replace(/[\n\t]+/g, " ").replace(/\bor\b/g, '').trim();

        // Caputre the index for TR elements that contain lunch meals
        if (index % 12 >= 1 && index % 12 <= 5) {
          const lunchMeal = new Meal(currentDishTr, currentDishEn);
          currentDay.addLunchMeal(lunchMeal);
        } else {
          if (index % 12 === 6)  return; // skip header "Aksam Yemegi/Dinner"
          // rest of indexes belong to dinner meals
          const dinnerMeal = new Meal(currentDishTr, currentDishEn);
          currentDay.addDinnerMeal(dinnerMeal);
        }    
    });
    // add last day
    weeklyPlan.addDay(currentDay);
 
    /*
     ************************************
     *** ALTERNATIVE SECTION PARSING  ***
     ************************************
     */

    // Select the second element with class name "MsoNormalTable" which corresponds to alternative menu table


    // Select the second (i=1) "MsoNormalTable" for alternative menu data
    const secondMsoNormalTableAlternative = MsoNormalTableElements.eq(1);

    // filter out unnecessary properties that pollute the html
    const filteredAlternativeMSOTable = secondMsoNormalTableAlternative
    .find("*")
    .removeAttr("style class lang width align");

    // select all TR elements and remove first TR (table header)
    const filteredAlternativeMenuMSONormalTableTr =
    filteredAlternativeMSOTable.find("tbody > tr").slice(1);

    currentDay = undefined;
    
    filteredAlternativeMenuMSONormalTableTr.each((index, element) => {
      if (index % 12 === 0) {
        if (currentDay){
          // add day to weekly plan if currentDay exists
          weeklyPlan.addDay(currentDay)
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
        date = $(element).find("td:first-child").text().trim();

        // remove spaces
        date = date.replace(/\s+/g, " ").trim();

        // Pick only date and skip DoW string
        date = /^\d+\.\d+\.\d{4}/.test(date)
          ? date.match(/^\d+\.\d+\.\d{4}/)[0]
          : null;

        // get the day that is already created before during name parsing
        currentDay = weeklyPlan.getDay(date);
        // quit as first iteration only for parsing date
      } 
      
      const turkishSelector = index % 12 === 0 ? "td:nth-child(2)" : "td:nth-child(1)"
      const englishSelector = index % 12 === 0 ? "td:nth-child(3)" : "td:nth-child(2)"

        // parse alternative TR/EN meal name
        const currentDishTrRaw = $(element).find(turkishSelector).text();
        const currentDishEnRaw = $(element).find(englishSelector).text();

        const currentDishTr = currentDishTrRaw.replace(/\s+/g, " ").replace(/[\n\t]+/g, " ").replace(/\bveya\b/g, '').trim();
        const currentDishEn = currentDishEnRaw.replace(/\s+/g, " ").replace(/[\n\t]+/g, " ").replace(/\bor\b/g, '').trim();

        const alternativeMeal = new Meal(currentDishTr, currentDishEn);
        currentDay.addAlternativeMeal(alternativeMeal);
      
    });
    // add last day
    weeklyPlan.addDay(currentDay)
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

function checkFixMenuLength(currentDay) {
   // add length too for easier debugging
   const length_lunch = currentDay.lunch.length;
   const length_dinner = currentDay.dinner.length;

   // TODO: Change when adding Vegan Option, should be 5 afterwards
   if (length_dinner !== 5 || length_lunch != 5) {
     console.log("length_dinner=", length_dinner);
     console.log("length_lunch=", length_lunch);
     console.error(
       "Length Dinner and Lunch have less then or more than 5 Items. Must have 5"
     );
     // process.exit();
     // incompatibleMealSize = true;
   }
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
  parseDataMSO_07_2024(responseData);
});

module.exports = {
  parseDataMSO_07_2024,
};
