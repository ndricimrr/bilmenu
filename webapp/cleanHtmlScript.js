console.log("Hello World!");
const axios = require("axios");
const URL = require("./constants").URL;

// Only applicable for a html which contains the "icerik" css class in it. Check inspect element of the URL below or /kafemud_html_snapshots

const cheerio = require("cheerio");

function getTableHTML(responseData) {
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

  // Remove all <style> blocks
  $("style").remove();

  // Remove all inline style attributes
  $("*").removeAttr("style");

  // Remove Word-specific classes like MsoNormal
  $("*").each((_, el) => {
    const classAttr = $(el).attr("class");
    if (classAttr && classAttr.startsWith("Mso")) {
      $(el).removeAttr("class");
    }
  });

  // Remove Office namespaces and custom XML attributes
  $("*").each((_, el) => {
    Object.keys(el.attribs).forEach((attr) => {
      if (
        attr.startsWith("xmlns:") ||
        attr.startsWith("v:") ||
        attr.startsWith("o:") ||
        attr.startsWith("w:") ||
        attr.startsWith("x:") ||
        attr.startsWith("m:")
      ) {
        $(el).removeAttr(attr);
      }
    });
  });

  // Remove <meta> and Word-specific <link> tags
  $('meta, link[rel="File-List"], link[rel="Edit-Time-Data"]').remove();

  // Remove <o:p> tags but keep inner text
  $("o\\:p").each((_, el) => {
    $(el).replaceWith($(el).text());
  });

  // Remove <a> tags but keep inner text
  $("a").each((_, el) => {
    $(el).replaceWith($(el).text());
  });

  // Remove all <img> tags
  $("img").remove();

  // Remove all <span> tags but keep inner content
  $("span").each((_, el) => {
    $(el).replaceWith($(el).html());
  });

  // ✅ Remove width, valign, align, nowrap attributes globally
  const attrsToRemove = ["width", "valign", "align", "nowrap"];
  $("*").each((_, el) => {
    attrsToRemove.forEach((attr) => {
      if ($(el).attr(attr) !== undefined) {
        $(el).removeAttr(attr);
      }
    });
  });

  // ✅ Get only <body> content
  const bodyHtml = $("body").html();

  return bodyHtml;
}

async function fetchMealData(url) {
  try {
    const response = await axios.get(url, {
      responseType: "arraybuffer",
    });

    const decoder = new TextDecoder("ISO-8859-9"); // Assuming ISO-8859-9 (Turkish) encoding
    const responseData = decoder.decode(response.data);

    // console.log("HTML fetched successfully.", responseData);

    return responseData;
  } catch (error) {
    throw new Error(`Error fetching HTML: ${error}`);
  }
}

fetchMealData(URL)
  .then((responseData) => {
    console.log("-----");
    // console.log("Fetched HTML data:", responseData);
    console.log("-----*********");

    const tableHTML = getTableHTML(responseData);
    console.log("Cleaned table HTML:", tableHTML);
    console.log("-----+");
  })
  .catch((error) => {
    console.error("Error during fetching or parsing:", error);
  });

module.exports = {
  getTableHTML,
};
