const axios = require("axios");
const url = "http://kafemud.bilkent.edu.tr/monu_eng.html";
const fs = require("fs");

const { getWeekOfYear } = require("./utilities_node");

function returnCurrentDate() {
  // Get current date
  const today = new Date();
  const day = today.getDate().toString().padStart(2, "0");
  const month = (today.getMonth() + 1).toString().padStart(2, "0"); // January is 0!
  const year = today.getFullYear();
  return `${day}-${month}-${year}`;
}

axios
  .get(url, {
    responseType: "arraybuffer",
  })
  .then((response) => {
    const decoder = new TextDecoder("ISO-8859-9"); // Assuming ISO-8859-9 (Turkish) encoding
    const responseData = decoder.decode(response.data);

    const fileName =
      "Week-" + getWeekOfYear() + "_" + returnCurrentDate() + ".html";

    try {
      fs.writeFileSync("kafe_html_snapshots/" + fileName, responseData);
      console.log(
        "\x1b[32m\u2713\x1b[0m",
        `File \x1b[33m'${fileName}'\x1b[0m has been created successfully.`
      );
    } catch (error) {
      console.error(`Error writing file ${fileName} HTML:`, error);
      process.exit(1);
    }
  })
  .catch((error) => {
    console.error("Error fetching HTML:", error);
    process.exit(1);
  });
