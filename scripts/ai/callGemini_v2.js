const fs = require("fs");
const axios = require("axios");
const {
  getCurrentWeekJSONFileName,
} = require("../../webapp/js/utilities_node");
const { GoogleGenAI } = require("@google/genai");
const URL = require("../../webapp/js/constants").URL;
const {
  validateJSONStructure,
  parseJsonFromAiMarkdown,
} = require("./mealPlanParseShared");

// Load prompt and cleaned HTML (V2 for new site design)
const prompt = fs.readFileSync("./scripts/ai/prompt_v3.txt", "utf8");
const cleanedHtml = fs.readFileSync("./cleaned.html", "utf8");

// Send the request to the Gemini API
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

console.log("Calling Gemini API with payload (V3 - 2026 - New Site Design)");

if (!GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

/**
 * Fetches raw HTML from the URL for fallback parsing
 * @returns {Promise<string>} - Raw HTML content
 */
async function fetchRawHTML() {
  try {
    const response = await axios.get(URL, {
      responseType: "arraybuffer",
    });

    // Try UTF-8 first, fallback to ISO-8859-9 (Turkish)
    try {
      const decoder = new TextDecoder("UTF-8");
      return decoder.decode(response.data);
    } catch (e) {
      const decoder = new TextDecoder("ISO-8859-9");
      return decoder.decode(response.data);
    }
  } catch (error) {
    throw new Error(`Error fetching raw HTML: ${error}`);
  }
}

/**
 * Fallback parsing with raw HTML
 */
async function fallbackParsing() {
  console.log("\n⚠️  FALLBACK MODE ACTIVATED - Parsing raw HTML");
  console.log(
    "This indicates the normal parsing may have failed or site structure changed unexpectedly.\n"
  );

  try {
    // Fetch raw HTML
    const rawHtml = await fetchRawHTML();

    // Load fallback prompt
    const fallbackPrompt = fs.readFileSync(
      "./scripts/ai/prompt_v2_fallback.txt",
      "utf8"
    );

    // Combine prompt and raw HTML (minimal cleaning - just remove scripts/styles for safety)
    const finalPrompt = `${fallbackPrompt}\n\n=== RAW HTML CONTENT (FALLBACK MODE) ===\n${rawHtml}`;

    console.log("Calling Gemini API with fallback prompt (raw HTML)...");

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: finalPrompt,
    });

    if (!response || !response.text) {
      throw new Error("Invalid response from Gemini API in fallback mode");
    }

    console.log("Received response from Gemini API (fallback mode)");
    const rawText = response.text;

    const parsed = parseJsonFromAiMarkdown(rawText);

    // Validate fallback result
    const validation = validateJSONStructure(parsed);
    if (!validation.isValid) {
      console.error("⚠️  Fallback parsing also produced invalid structure:");
      console.error(validation.issues.join("\n"));
      throw new Error("Fallback parsing failed validation");
    }

    console.log("✓ Fallback parsing successful and validated");

    return parsed;
  } catch (error) {
    console.error("Error in fallback parsing:", error);
    throw error;
  }
}

async function callApi() {
  let fallbackUsed = false;

  try {
    // Normal parsing attempt
    const finalPrompt = `${prompt}\n\n=== HTML CONTENT TO PARSE ===\n${cleanedHtml}`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: finalPrompt,
    });

    if (!response || !response.text) {
      throw new Error(
        "Invalid response from Gemini API: response or response.text is undefined"
      );
    }

    console.log("Received response from Gemini API");
    const rawText = response.text;
    if (!rawText) {
      throw new Error("Invalid AI response structure: rawText is undefined");
    }

    let parsed;
    try {
      parsed = parseJsonFromAiMarkdown(rawText);
    } catch (parseError) {
      console.error(
        "⚠️  Failed to parse JSON response. Activating fallback mode..."
      );
      parsed = await fallbackParsing();
      fallbackUsed = true;
    }

    // Validate the parsed JSON (only if not already from fallback)
    if (!fallbackUsed) {
      const validation = validateJSONStructure(parsed);

      if (!validation.isValid) {
        console.log("\n⚠️  JSON validation failed:");
        console.log(validation.issues.slice(0, 5).join("\n")); // Show first 5 issues
        if (validation.issues.length > 5) {
          console.log(`... and ${validation.issues.length - 5} more issues`);
        }
        console.log("\nActivating fallback mode with raw HTML...\n");

        // Fallback to raw HTML parsing
        parsed = await fallbackParsing();
        fallbackUsed = true;
      } else {
        console.log("✓ JSON validation passed");
      }
    }

    console.log("Saving parsed response to file...");

    fs.writeFileSync(
      getCurrentWeekJSONFileName(),
      JSON.stringify(parsed, null, 2)
    );
    console.log("Response saved to " + getCurrentWeekJSONFileName());

    // Final validation and summary
    const finalValidation = validateJSONStructure(parsed);
    if (finalValidation.isValid) {
      if (fallbackUsed) {
        console.log("\n✓ Fallback parsing succeeded - data validated");
      } else {
        console.log("\n✓ Normal parsing succeeded - no fallback needed");
      }
    } else {
      console.warn("\n⚠️  Warning: Final validation still shows issues:");
      console.warn(finalValidation.issues.slice(0, 3).join("\n"));
    }
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw error;
  }
}

callApi();
