// const axios = require("axios");
// const cheerio = require("cheerio");

// URL of the HTML page
const url = "./test.html";

// Make a request to the URL

// const { TextDecoder } = require("util");

fetch(url)
  .then((response) => response.text())
  .then((html) => {
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
    const data = [];

    const rows = doc.querySelectorAll(
      ".icerik > tbody > tr:nth-child(2) > td > table > tbody > tr"
    );
    rows.forEach((element, index) => {
      if (index > 0) {
        let day = element.querySelector("td:first-child").textContent().trim();

        // remove spaces
        day = day.replace(/\s+/g, " ").trim();

        // Pick only date and skip DoW string
        day = /^\d+\.\d+\.\d{4}/.test(day)
          ? day.match(/^\d+\.\d+\.\d{4}/)[0]
          : null;

        if (index <= 13) {
          let lunchDishes = [];

          let dinnerDishes = [];
          if (index % 2 !== 0) {
            element
              .querySelector("td:nth-child(2)")
              .forEach((idx, dishElement) => {
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
                      tr: tr_en[0],
                      en: tr_en[1],
                    });
                  }
                });
              });

            const nextElement = element.nextElementSibling;

            if (nextElement) {
              const dishElement = nextElement.querySelector("td:first-child");
              if (dishElement) {
                const meals = dishElement.innerHTML.split(/<br\s*\/?>/);

                let dishText;
                meals.forEach((mealItemHTML, idx) => {
                  if (index > 0) {
                    dishText = parser
                      .parseFromString(mealItemHTML, "text/html")
                      .documentElement.textContent.trim();

                    dishText = dishText.replace(/\s+/g, " ").trim();
                    dishText = dishText.replace(/[\n\t]+/g, " ");

                    const tr_en = dishText.split("/");

                    dinnerDishes.push({
                      tr: tr_en[0],
                      en: tr_en[1],
                    });
                  }
                });
              }
            }

            // Extract lunch dishes text
            data.push({ day, lunchDishes, dinnerDishes });
          }
        }
      }
    });

    // $(".icerik > tbody > tr:nth-child(2) > td > table > tbody > tr").each(
    //   (index, element) => {

    //   }
    // );

    // let alternativeData = [];

    // $(".icerik > tbody > tr:nth-child(3) > td > table > tbody > tr").each(
    //   (index, element) => {
    //     if (index > 0) {
    //       let day = $(element).find("td:first-child").text().trim();

    //       // remove spaces
    //       day = day.replace(/\s+/g, " ").trim();

    //       // Pick only date and skip DoW string
    //       day = /^\d+\.\d+\.\d{4}/.test(day)
    //         ? day.match(/^\d+\.\d+\.\d{4}/)[0]
    //         : null;

    //       if (index <= 13) {
    //         let alternativeDishes = [];
    //         if (index % 2 !== 0) {
    //           $(element)
    //             .find("td:nth-child(2)")
    //             .each((idx, dishElement) => {
    //               const meals = $(dishElement)
    //                 .html()
    //                 .split(/<br\s*\/?>/);

    //               let dishText;
    //               // Iterate over the parts
    //               meals.forEach((mealItemHTML, index) => {
    //                 dishText = cheerio.load(mealItemHTML).root().text();

    //                 dishText = dishText.replace(/\s+/g, " ").trim();
    //                 dishText = dishText.replace(/[\n\t]+/g, " ");

    //                 const tr_en = dishText.split("/");

    //                 alternativeDishes.push({
    //                   tr: tr_en[0],
    //                   en: tr_en[1],
    //                 });
    //               });
    //             });
    //           // Extract lunch dishes text
    //           alternativeData.push({ day, alternativeDishes });
    //         }
    //       }
    //     }
    //   }
    // );

    // Print the extracted data
    let result = {
      fixMenu: data,
      // alternativeMenu: alternativeData,
    };
    console.log(JSON.stringify(result));
  })
  .catch((error) => {
    console.error("Error fetching HTML:", error);
  });
