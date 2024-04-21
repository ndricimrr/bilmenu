// Only applicable for a html which contains the "MsoNormalTable" css class in it. Check inspect element of the URL below or /kafemud_html_snapshots

const axios = require("axios");
const cheerio = require("cheerio");
const url = "http://kafemud.bilkent.edu.tr/monu_eng.html";
const fs = require("fs");
const { TextDecoder } = require("util");

const { getCurrentWeekJSONFileName } = require("./utilities_node");

function writeResultToJSONFIle(content) {
  const filename = getCurrentWeekJSONFileName();

  // Write the result object to a JSON file
  fs.writeFile(filename, JSON.stringify(content, null, 2), (err) => {
    if (err) {
      console.error("Error writing to JSON file:", err);
    } else {
      console.log(`Data written to ${filename} successfully.`);
    }
  });
}

axios
  .get(url, {
    responseType: "arraybuffer",
  })
  .then((response) => {
    const decoder = new TextDecoder("ISO-8859-9"); // Assuming ISO-8859-9 (Turkish) encoding
    const responseData = decoder.decode(response.data);

    // Parse HTML using cheerio
    const $ = cheerio.load(responseData);

    // Extract information from the table
    const lunchData = [];
    const dinnerData = [];

    // Select all DOM elements with class name "Jimmy"
    const MsoNormalTableElements = $(".MsoNormalTable");

    let lunchDishes = [];
    let dinnerDishes = [];
    let alternativeData = [];

    // Check if there are at least 5 elements with class name "MsoNormalTable"
    // Simple search on Inspect Element reveals 5 on DOM thats why
    if (MsoNormalTableElements.length === 5) {
      // Select the second to last element with class name "MsoNormalTable"
      const secondToLastMsoNormalTable = MsoNormalTableElements.eq(-2);

      // Query its tbody > tr
      const secondToLasTbodyTr = secondToLastMsoNormalTable.find("tbody > tr");

      secondToLasTbodyTr.each((index, element) => {
        if (index > 0) {
          let date = $(element).find("td:first-child").text().trim();

          // remove spaces
          date = date.replace(/\s+/g, " ").trim();

          // Pick only date and skip DoW string
          date = /^\d+\.\d+\.\d{4}/.test(date)
            ? date.match(/^\d+\.\d+\.\d{4}/)[0]
            : null;

          if (index <= 13) {
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
      });

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
          const meals = $(dishElement)
            .html()
            .split(/<br\s*\/?>/);

          let dishText;
          // Iterate over the parts
          meals.forEach((mealItemHTML, index) => {
            dishText = dishText = cheerio
              .load(mealItemHTML)
              .root()
              .text()
              .trim();

            dishText = dishText.replace(/\s+/g, " ").trim();
            dishText = dishText.replace(/[\n\t]+/g, " ");

            const tr_en = dishText.split("/");

            alternativeDishes.push({
              tr: tr_en[0].trim(),
              en: tr_en[1].trim(),
            });
          });
          const length = alternativeDishes.length;

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

    console.log(result);
    writeResultToJSONFIle(result);
  })
  .catch((error) => {
    console.error("Error fetching HTML:", error);
  });
