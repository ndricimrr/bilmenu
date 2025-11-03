const axios = require("axios");
const URL = require("../../webapp/js/constants").URL;

// NEW VERSION - For the redesigned site (Bootstrap-based card layout)
// Only applicable for the new HTML structure with tab-panes and cards

const cheerio = require("cheerio");
const { minify } = require("html-minifier-terser");

// gets the HTML
async function getHTMLCleaned(responseData) {
  // Parse HTML using cheerio
  if (!responseData) {
    console.error("Response data is null or undefined.");
    return null;
  }
  const $ = cheerio.load(responseData);

  // Remove all <style> blocks
  $("style").remove();

  // Remove all inline style attributes
  $("*").removeAttr("style");

  // Remove all <script> blocks
  $("script").remove();

  // Remove navigation/navbar
  $("nav").remove();

  // Remove header/footer elements
  $("header, footer").remove();

  // Remove flash messages
  $(".flash-message").remove();

  // Remove date range display (not needed for parsing)
  $(".text-center.text-dark").remove();

  // Remove tab navigation buttons (we only need the content)
  $("ul.nav-tabs").remove();

  // Remove nutrition boxes (not needed for meal parsing)
  $(".nutrition-box").remove();

  // Remove icons and SVG elements (not needed)
  $("i, svg").remove();

  // Remove badges (like "Vegan" badge - we'll detect vegan from class)
  $(".badge").remove();

  // Clean up: Remove all attributes except essential ones
  $("*").each((_, el) => {
    // Keep only id, class, and data attributes for structure
    Object.keys(el.attribs || {}).forEach((attr) => {
      if (!["id", "class", "data-bs-toggle", "data-bs-target"].includes(attr)) {
        $(el).removeAttr(attr);
      }
    });
  });

  // Remove empty divs that don't contribute to structure
  $("div").each((_, el) => {
    const $el = $(el);
    if ($el.children().length === 0 && !$el.text().trim()) {
      $el.remove();
    }
  });

  // Extract only the tab content area
  // Keep the tab-pane divs with their structure
  const tabContent = $(".tab-content");

  if (tabContent.length === 0) {
    console.error(
      "No tab-content found. This might not be the new site design."
    );
    return null;
  }

  // Get the HTML from tab-content only
  const cleanedHtml = tabContent.html();

  // Minify
  const minifiedHtml = await minify(cleanedHtml || "", {
    collapseWhitespace: true,
    removeComments: true,
    removeEmptyAttributes: true,
    minifyCSS: false,
    minifyJS: false,
  });

  return minifiedHtml;
}

async function fetchMealData(url) {
  try {
    const response = await axios.get(url, {
      responseType: "arraybuffer",
    });

    // Try UTF-8 first, fallback to ISO-8859-9 (Turkish)
    let responseData;
    try {
      const decoder = new TextDecoder("UTF-8");
      responseData = decoder.decode(response.data);
    } catch (e) {
      const decoder = new TextDecoder("ISO-8859-9");
      responseData = decoder.decode(response.data);
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
  const tableHTML = await getHTMLCleaned(responseData);
  if (!tableHTML) {
    console.error("Failed to clean HTML.");
    process.exit(1);
  }
  console.log(tableHTML);
})();

module.exports = {
  getHTMLCleaned,
};
