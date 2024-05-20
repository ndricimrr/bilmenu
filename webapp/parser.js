const axios = require("axios");
const URL = require("./constants").URL;
const fs = require("fs");
const { TextDecoder } = require("util");
const {
  getCurrentWeekJSONFileName,
  getWeekAndDateJSONFileName,
} = require("./utilities_node");
const { parseDataIcerik } = require("./meal-parser-node-icerik");
const { parseDataMSO } = require("./meal-parser-node-MsoNormalTable");

// similar to parseDataMSO algorithm but they changed alignment
const { parseDataMSORight } = require("./parser-node-MsoNormalTableRight.js");

const WRONG_PARSING = "IS_WRONG_PARSING";

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

function writeResultToJSONFile(content, isDailyFetch) {
  const filename = isDailyFetch
    ? getWeekAndDateJSONFileName()
    : getCurrentWeekJSONFileName();

  // Write the result object to a JSON file
  fs.writeFile(filename, JSON.stringify(content, null, 2), (err) => {
    if (err) {
      console.error("Error writing to JSON file:", err);
    } else {
      console.log(
        "\x1b[32m\u2713\x1b[0m",
        `Parsed and processed data written to \x1b[33m'${filename}'\x1b[0m successfully.`
      );
    }
  });
}

// select strategy also, with which algorithm to parse
function parseData(responseData) {
  const msoAlignRightResult = parseDataMSORight(responseData);
  console.log(msoAlignRightResult);
  if (msoAlignRightResult !== WRONG_PARSING) {
    console.log(
      "\n\nParsing algorithm finished successfully: \x1b[32m*** MSONormalTable ***\x1b[0m"
    );
    return msoAlignRightResult;
  }

  // check default parsing, keyword - "MSO" is some classname that is unique to this particular HTML Structure
  const msoResult = parseDataMSO(responseData);
  if (msoResult !== WRONG_PARSING) {
    console.log(
      "\n\nParsing algorithm finished successfully: \x1b[32m*** MSONormalTable ***\x1b[0m"
    );
    return msoResult;
  }
  // check secondary parsing algorithm, keyword = "icerik" refers to a class name that is unique to the HTML structure
  const icerikResult = parseDataIcerik(responseData);
  if (icerikResult !== WRONG_PARSING) {
    console.log(
      "\n\nParsing algorithm finished successfully: \x1b[32m*** Icerik ***\x1b[0m"
    );
    return icerikResult;
  }
  throw new Error(
    "Both Parsing algorithms failed. Check if HTML structure of parsed site has changed!"
  );
}

// Usage
//
async function parseAndWriteToJSON(isDailyFetch) {
  try {
    const responseData = await fetchMealData(URL);
    const parsedResult = parseData(responseData);

    writeResultToJSONFile(parsedResult, isDailyFetch);
  } catch (error) {
    throw new Error(error);
  }
}

// False signifies this is weekly cron job to be run on Monday only
parseAndWriteToJSON(false);

module.exports = {
  parseAndWriteToJSON,
};
