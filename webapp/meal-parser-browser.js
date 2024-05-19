// const axios = require("axios");
// const cheerio = require("cheerio");

// URL of the HTML page
const url = require("./constants").URL;

// Make a request to the URL

// const { TextDecoder } = require("util");

var mealPlanJSON = {};

fetch(url)
  .then((response) => response.arrayBuffer())
  .then((buffer) => {
    // Convert the ArrayBuffer to a Uint8Array
    const uint8Array = new Uint8Array(buffer);
    // Decode the Uint8Array using ISO-8859-9 encoding
    const decoder = new TextDecoder("iso-8859-9");
    const html = decoder.decode(uint8Array);

    // Parse HTML using DOM methods or JSDOM
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");

    // axios
    //   .get(url, {
    //     responseType: "arraybuffer",
    //   })
    //   .then((response) => {
    //     const decoder = new TextDecoder("ISO-8859-9"); // Assuming ISO-8859-9 (Turkish) encoding
    //     const responseData = decoder.decode(response.data);

    //     // Parse HTML using cheerio
    //     const $ = cheerio.load(responseData);

    // Extract information from the table
    const lunchData = [];
    const dinnerData = [];

    const rows = doc.querySelectorAll(
      ".icerik > tbody > tr:nth-child(2) > td > table > tbody > tr"
    );
    rows.forEach((element, index) => {
      if (index > 0) {
        let date = element.querySelector("td:first-child").textContent.trim();

        // remove spaces
        date = date.replace(/\s+/g, " ").trim();

        // Pick only date and skip DoW string
        date = /^\d+\.\d+\.\d{4}/.test(date)
          ? date.match(/^\d+\.\d+\.\d{4}/)[0]
          : null;

        if (index <= 13) {
          let lunchDishes = [];

          let dinnerDishes = [];
          if (index % 2 !== 0) {
            const dishElement = element.querySelector("td:nth-child(2)");
            const meals = dishElement.innerHTML.split(/<br\s*\/?>/);

            let dishText;
            // Iterate over the parts
            meals.forEach((mealItemHTML, index) => {
              if (index > 0) {
                dishText = parser
                  .parseFromString(mealItemHTML, "text/html")
                  .documentElement.textContent.trim();

                dishText = dishText.replace(/\s+/g, " ").trim();
                dishText = dishText.replace(/[\n\t]+/g, " ");
                const tr_en = dishText.split("/");

                lunchDishes.push({
                  tr: tr_en[0].trim(),
                  en: tr_en[1].trim(),
                });
              }
            });

            const nextElement = element.nextElementSibling;

            if (nextElement) {
              const dishesElement = nextElement.querySelector("td:first-child");
              if (dishesElement) {
                const meals = dishesElement.innerHTML.split(/<br\s*\/?>/);

                let dishText;
                meals.forEach((mealItemHTML, index) => {
                  if (index > 0) {
                    dishText = parser
                      .parseFromString(mealItemHTML, "text/html")
                      .documentElement.textContent.trim();

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

    const alternativeData = [];

    const rowsAlternative = doc.querySelectorAll(
      ".icerik > tbody > tr:nth-child(3) > td > table > tbody > tr"
    );

    rowsAlternative.forEach((element, index) => {
      if (index > 0) {
        let date = element.querySelector("td:first-child").textContent.trim();

        // remove spaces
        date = date.replace(/\s+/g, " ").trim();

        // Pick only date and skip DoW string
        date = /^\d+\.\d+\.\d{4}/.test(date)
          ? date.match(/^\d+\.\d+\.\d{4}/)[0]
          : null;

        let alternativeDishes = [];
        const dishElement = element.querySelector("td:nth-child(2)");
        const meals = dishElement.innerHTML.split(/<br\s*\/?>/);

        let dishText;
        // Iterate over the parts
        meals.forEach((mealItemHTML, index) => {
          dishText = parser
            .parseFromString(mealItemHTML, "text/html")
            .documentElement.textContent.trim();

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

    // Print the extracted data
    let result = {
      fixMenuLunch: lunchData,
      fixMenuDinner: dinnerData,
      alternativeMenu: alternativeData,
    };
    console.log(result);
    mealPlanJSON = result;
  })
  .catch((error) => {
    console.error("Error fetching HTML:", error);
  });
