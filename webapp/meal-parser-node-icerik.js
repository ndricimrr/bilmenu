// Only applicable for a html which contains the "icerik" css class in it. Check inspect element of the URL below or /kafemud_html_snapshots

const cheerio = require("cheerio");

const WRONG_PARSING = "IS_WRONG_PARSING";

function parseDataIcerik(responseData) {
  console.log(
    "\n\nParsing algorithm being used: \x1b[32m*** Icerik ***\x1b[0m"
  );

  // Parse HTML using cheerio
  if (!responseData) {
    console.error("Response data is null or undefined.");
    return WRONG_PARSING;
  }
  const $ = cheerio.load(responseData);
  console.log("HTML loaded successfully.");

  // Extract information from the table
  const lunchData = [];
  const dinnerData = [];
  const alternativeData = [];

  // set to true only if a certain meal plan
  // does not have the fixed meal number: lunch/dinner/alternative=4/4/12
  let incompatibleMealSize = false;

  const lunchDinnerRows = $(
    ".icerik > tbody > tr:nth-child(2) > td > table > tbody > tr"
  );
  if (!lunchDinnerRows || lunchDinnerRows.length === 0) {
    console.error("Lunch/Dinner rows are null or undefined.");
    return WRONG_PARSING;
  }
  console.log(`Found ${lunchDinnerRows.length} rows for lunch/dinner parsing.`);

  lunchDinnerRows.each((index, element) => {
    if (index > 0) {
      console.log(`Processing row index: ${index}`);
      let date = $(element).find("td:first-child").text()?.trim();
      if (!date) {
        console.warn(`Date is null or undefined for index ${index}. Skipping.`);
        return;
      }

      // remove spaces
      date = date.replace(/\s+/g, " ").trim();

      // Pick only date and skip DoW string
      date = /^\d+\.\d+\.\d{4}/.test(date)
        ? date.match(/^\d+\.\d+\.\d{4}/)[0]
        : null;
      if (!date) {
        console.warn(`Invalid date format for index ${index}. Skipping.`);
        return;
      }
      console.log(`Parsed date: ${date}`);

      if (index <= 13) {
        let lunchDishes = [];
        let dinnerDishes = [];

        if (index % 2 !== 0) {
          // Parse Lunch dishes
          const dishElement = $(element).find("td:nth-child(2)");
          if (!dishElement || dishElement.length === 0) {
            console.warn(
              `Dish element for lunch is null or undefined for index ${index}. Skipping.`
            );
            return;
          }
          console.log("Dish element found for lunch parsing.");

          const meals =
            $(dishElement)
              .html()
              ?.split(/<br\s*\/?>/) || [];
          console.log(`Found ${meals.length} meals for lunch parsing.`);

          meals.forEach((mealItemHTML, index) => {
            if (index > 0) {
              let dishText = cheerio.load(mealItemHTML).root().text()?.trim();
              if (!dishText) {
                console.warn(
                  `Dish text is null or undefined for lunch meal index ${index}. Skipping.`
                );
                return;
              }
              dishText = dishText.replace(/\s+/g, " ").trim();
              dishText = dishText.replace(/[\n\t]+/g, " ");
              const tr_en = dishText.split("/");
              lunchDishes.push({
                tr: tr_en[0]?.trim() || "",
                en: tr_en[1]?.trim() || "",
              });
              console.log(
                `Added lunch dish: ${JSON.stringify(
                  lunchDishes[lunchDishes.length - 1]
                )}`
              );
            }
          });

          // Parse Dinner Dishes
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
              ?.split(/<br\s*\/?>/) || [];
          console.log(`Found ${dinnerMeals.length} meals for dinner parsing.`);

          dinnerMeals.forEach((mealItemHTML, index) => {
            if (index > 0) {
              let dishText = cheerio.load(mealItemHTML).root().text()?.trim();
              if (!dishText) {
                console.warn(
                  `Dish text is null or undefined for dinner meal index ${index}. Skipping.`
                );
                return;
              }
              dishText = dishText.replace(/\s+/g, " ").trim();
              dishText = dishText.replace(/[\n\t]+/g, " ");
              const tr_en = dishText.split("/");
              dinnerDishes.push({
                tr: tr_en[0]?.trim() || "",
                en: tr_en[1]?.trim() || "",
              });
              console.log(
                `Added dinner dish: ${JSON.stringify(
                  dinnerDishes[dinnerDishes.length - 1]
                )}`
              );
            }
          });

          const length_lunch = lunchDishes.length;
          const length_dinner = dinnerDishes.length;

          if (length_dinner !== 4 || length_lunch !== 4) {
            console.error(
              `Invalid meal size for date ${date}. Lunch: ${length_lunch}, Dinner: ${length_dinner}`
            );
            incompatibleMealSize = true;
          }

          lunchData.push({ date, lunchDishes, length_lunch });
          dinnerData.push({ date, dinnerDishes, length_dinner });
          console.log(`Added lunch and dinner data for date: ${date}`);
        }
      }
    }
  });

  const alternativeRows = $(
    ".icerik > tbody > tr:nth-child(3) > td > table > tbody > tr"
  );
  if (!alternativeRows || alternativeRows.length === 0) {
    console.error("Alternative rows are null or undefined.");
    return WRONG_PARSING;
  }
  console.log(`Found ${alternativeRows.length} rows for alternative parsing.`);

  alternativeRows.each((index, element) => {
    if (index > 0) {
      let date = $(element).find("td:first-child").text()?.trim();
      if (!date) {
        console.warn(`Date is null or undefined for index ${index}. Skipping.`);
        return;
      }

      // remove spaces
      date = date.replace(/\s+/g, " ").trim();

      // Pick only date and skip DoW string
      date = /^\d+\.\d+\.\d{4}/.test(date)
        ? date.match(/^\d+\.\d+\.\d{4}/)[0]
        : null;
      if (!date) {
        console.warn(`Invalid date format for index ${index}. Skipping.`);
        return;
      }
      console.log(`Parsed date: ${date}`);

      const dishElement = $(element).find("td:nth-child(2)");
      if (!dishElement || dishElement.length === 0) {
        console.warn(
          `Dish element for alternative is null or undefined for index ${index}. Skipping.`
        );
        return;
      }
      console.log("Dish element found for alternative parsing.");

      const meals =
        $(dishElement)
          .html()
          ?.split(/<br\s*\/?>/) || [];
      console.log(`Found ${meals.length} meals for alternative parsing.`);

      let alternativeDishes = [];
      meals.forEach((mealItemHTML) => {
        let dishText = cheerio.load(mealItemHTML).root().text()?.trim();
        if (!dishText) {
          console.warn(
            `Dish text is null or undefined for alternative meal. Skipping.`
          );
          return;
        }
        dishText = dishText.replace(/\s+/g, " ").trim();
        dishText = dishText.replace(/[\n\t]+/g, " ");
        const tr_en = dishText.split("/");
        alternativeDishes.push({
          tr: tr_en[0]?.trim() || "",
          en: tr_en[1]?.trim() || "",
        });
        console.log(
          `Added alternative dish: ${JSON.stringify(
            alternativeDishes[alternativeDishes.length - 1]
          )}`
        );
      });

      const length = alternativeDishes.length;

      if (length !== 12) {
        console.error(
          `Invalid alternative meal size for date ${date}. Length: ${length}`
        );
        incompatibleMealSize = true;
      }

      alternativeData.push({ date, alternativeDishes, length });
      console.log(`Added alternative data for date: ${date}`);
    }
  });

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
    console.error("One or more meal data arrays are empty.");
    return WRONG_PARSING;
  }

  if (incompatibleMealSize) {
    console.error("Incompatible meal sizes detected.");
    return WRONG_PARSING;
  }

  console.log("Parsing completed successfully.");
  return result;
}

module.exports = {
  parseDataIcerik,
};
