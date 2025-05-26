const axios = require("axios");
const URL = require("./constants").URL;

const fs = require("fs");
const { getWeekAndDate } = require("./utilities_node");

// const { parseAndWriteToJSON } = require("./parser");

axios
  .get(URL, {
    responseType: "arraybuffer",
  })
  .then((response) => {
    const decoder = new TextDecoder("ISO-8859-9"); // Assuming ISO-8859-9 (Turkish) encoding
    const responseData = decoder.decode(response.data);

    const fileName =
      "kafemud_daily_html_snapshots/" + getWeekAndDate() + ".html";

    try {
      fs.writeFileSync(fileName, responseData);
      console.log(
        "\x1b[32m\u2713\x1b[0m",
        `File \x1b[33m'${fileName}'\x1b[0m has been created successfully.`
      );

      // set true to save to /kafemud_daily_parsing_snapshots instead of webapp/mealplans
      // parseAndWriteToJSON(true);
    } catch (error) {
      console.error(`Error writing file ${fileName} HTML:`, error);
      process.exit(1);
    }
  })
  .catch((error) => {
    console.error("Error fetching HTML:", error);
    process.exit(1);
  });
