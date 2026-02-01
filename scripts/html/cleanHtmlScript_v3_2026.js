// 1 Feb, 2026
const axios = require("axios");
const URL = require("../../webapp/js/constants").URL;

const cheerio = require("cheerio");
const { minify } = require("html-minifier-terser");

// EXTREMELY CONSERVATIVE CLEANER
// Goal: reduce token noise WITHOUT semantic assumptions

async function getHTMLCleaned(responseData) {
  if (!responseData) {
    console.error("Response data is null or undefined.");
    return null;
  }

  const $ = cheerio.load(responseData, {
    decodeEntities: true,
    recognizeSelfClosing: true,
  });

  // 1. Remove executable / non-textual content ONLY
  $("script").remove();
  $("style").remove();
  $("svg").remove();
  $("noscript").remove();

  // 2. Remove HTML comments
  $.root()
    .contents()
    .each((_, el) => {
      if (el.type === "comment") {
        $(el).remove();
      }
    });

  // 3. Minify whitespace, preserve EVERYTHING else
  const cleanedHtml = await minify($.html(), {
    collapseWhitespace: true,
    conservativeCollapse: true,
    removeComments: true,
    removeEmptyAttributes: false,
    keepClosingSlash: true,
    minifyCSS: false,
    minifyJS: false,
  });

  return cleanedHtml;
}

async function fetchMealData(url) {
  try {
    const response = await axios.get(url, {
      responseType: "arraybuffer",
    });

    let responseData;
    try {
      responseData = new TextDecoder("UTF-8").decode(response.data);
    } catch {
      responseData = new TextDecoder("ISO-8859-9").decode(response.data);
    }

    return responseData;
  } catch (error) {
    throw new Error(`Error fetching HTML: ${error}`);
  }
}

(async () => {
  const responseData = await fetchMealData(URL);
  if (!responseData) {
    console.error("Failed to fetch response data.");
    process.exit(1);
  }

  const cleanedHTML = await getHTMLCleaned(responseData);
  if (!cleanedHTML) {
    console.error("Failed to clean HTML.");
    process.exit(1);
  }

  console.log(cleanedHTML);
})();

module.exports = {
  getHTMLCleaned,
};
