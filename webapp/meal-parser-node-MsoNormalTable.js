// Only applicable for a html which contains the "MsoNormalTable" css class in it. Check inspect element of the URL below or /kafemud_html_snapshots
const WRONG_PARSING = "IS_WRONG_PARSING";

const cheerio = require("cheerio");

function parseDataMSO(responseData) {
  // Parse HTML using cheerio
  const $ = cheerio.load(responseData);

  // Extract information from the table
  const lunchData = [];
  const dinnerData = [];

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

    // iterating for Fix Menu : Lunch + Dinner dishes
    secondToLasTbodyTr.each((index, element) => {
      // skip index = 0 as it is table header (Days / Dishes / Nutrition Facts)
      if (index > 0) {
        // date is in first column (td), meals are on second td, and nutritional facts on third td
        let date = $(element).find("td:first-child").text().trim();

        // remove spaces
        date = date.replace(/\s+/g, " ").trim();

        // Pick only date and skip DoW string. dd.mm.yyyy
        date = /^\d+\.\d+\.\d{4}/.test(date)
          ? date.match(/^\d+\.\d+\.\d{4}/)[0]
          : null;

        let lunchDishes = [];
        let dinnerDishes = [];

        // ODD Index = Lunch, Even Index = Dinner
        if (index % 2 !== 0) {
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

              lunchDishes.push({
                tr: tr_en[0].trim(),
                en: tr_en[1].trim(),
              });
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

                dinnerDishes.push({
                  tr: tr_en[0].trim(),
                  en: tr_en[1].trim(),
                });
              }
            });
          }

          // add length too for easier debugging
          const length_lunch = lunchDishes.length;
          const length_dinner = dinnerDishes.length;

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

          // Extract lunch dishes text
          lunchData.push({
            date,
            lunchDishes,
            length_lunch,
          });

          dinnerData.push({
            date,
            dinnerDishes,
            length_dinner,
          });
        }
      }
    });

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

          // Split based on slash to get turkish and english separate words in two parts
          const tr_en = dishText.split("/");

          alternativeDishes.push({
            tr: tr_en[0].trim(),
            en: tr_en[1].trim(),
          });
        });

        const length = alternativeDishes.length;

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

  // Print the extracted data
  let result = {
    fixMenuLunch: lunchData,
    fixMenuDinner: dinnerData,
    alternativeMenu: alternativeData,
  };

  if (
    lunchData.length === 0 ||
    dinnerData.length === 0 ||
    alternativeData.length === 0
  ) {
    return WRONG_PARSING;
  }

  if (incompatibleMealSize) {
    return WRONG_PARSING;
  }
  return result;
}

module.exports = {
  parseDataMSO,
};
