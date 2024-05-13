// Only applicable for a html which contains the "icerik" css class in it. Check inspect element of the URL below or /kafemud_html_snapshots

const cheerio = require("cheerio");

const WRONG_PARSING = "IS_WRONG_PARSING";

function parseDataIcerik(responseData) {
  console.log(
    "\n\nParsing algorithm being used: \x1b[32m*** Icerik ***\x1b[0m"
  );

  // Parse HTML using cheerio
  const $ = cheerio.load(responseData);

  // Extract information from the table
  const lunchData = [];
  const dinnerData = [];
  const alternativeData = [];

  // set to true only if a certain meal plan
  // does not have the fixed meal number: lunch/dinner/alternative=4/4/12
  let incompatibleMealSize = false;

  $(".icerik > tbody > tr:nth-child(2) > td > table > tbody > tr").each(
    (index, element) => {
      if (index > 0) {
        console.log("INDEX", index);
        let date = $(element).find("td:first-child").text().trim();

        // remove spaces
        date = date.replace(/\s+/g, " ").trim();

        // Pick only date and skip DoW string
        date = /^\d+\.\d+\.\d{4}/.test(date)
          ? date.match(/^\d+\.\d+\.\d{4}/)[0]
          : null;

        if (index <= 13) {
          let lunchDishes = [];
          let dinnerDishes = [];

          // TODO: Write why odd number needed
          if (index % 2 !== 0) {
            // Parse Lunch dishes
            const dishElement = $(element).find("td:nth-child(2)");
            const meals = $(dishElement)
              .html()
              .split(/<br\s*\/?>/);

            let dishText;
            // Iterate over the parts

            meals.forEach((mealItemHTML, index) => {
              if (index > 0) {
                dishText = cheerio.load(mealItemHTML).root().text().trim();

                dishText = dishText.replace(/\s+/g, " ").trim();
                dishText = dishText.replace(/[\n\t]+/g, " ");
                const tr_en = dishText.split("/");

                lunchDishes.push({
                  tr: tr_en[0].trim(),
                  en: tr_en[1].trim(),
                });
              }
            });

            // Parse Dinner Dishes
            let nextElement = $(element).next().find("td:first-child");

            if (nextElement) {
              const meals = $(nextElement)
                .html()
                .split(/<br\s*\/?>/);

              let dishText;
              meals.forEach((mealItemHTML, index) => {
                if (index > 0) {
                  dishText = cheerio.load(mealItemHTML).root().text().trim();

                  dishText = dishText.replace(/\s+/g, " ").trim();
                  dishText = dishText.replace(/[\n\t]+/g, " ");

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
      }
    }
  );

  $(".icerik > tbody > tr:nth-child(3) > td > table > tbody > tr").each(
    (index, element) => {
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
        const meals = $(dishElement)
          .html()
          .split(/<br\s*\/?>/);

        let dishText;
        // Iterate over the parts
        meals.forEach((mealItemHTML, index) => {
          dishText = dishText = cheerio.load(mealItemHTML).root().text().trim();

          dishText = dishText.replace(/\s+/g, " ").trim();
          dishText = dishText.replace(/[\n\t]+/g, " ");

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
    }
  );

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
  parseDataIcerik,
};
