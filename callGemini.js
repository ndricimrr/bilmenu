const fs = require("fs");
const axios = require("axios");
const { getCurrentWeekJSONFileName } = require("./webapp/utilities_node");
const { GoogleGenAI } = require("@google/genai");

// Load prompt and cleaned HTML
const prompt = fs.readFileSync("prompt.txt", "utf8");
const cleanedHtml = fs.readFileSync("cleaned.html", "utf8");

// Combine prompt and cleaned HTML
const finalPrompt = `${prompt} ${cleanedHtml}`;

// Send the request to the Gemini API
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
// const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

console.log("Calling Gemini API with payload");

if (!GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

async function callApi() {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash-001",
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
    // Remove code block wrapper (```json\n ... ```)
    const jsonString = rawText.replace(/```json\n([\s\S]*?)```/, "$1");

    // Parse it
    const parsed = JSON.parse(jsonString);

    console.log("Parsed response. Now saving to file...");

    fs.writeFileSync(
      getCurrentWeekJSONFileName(),
      JSON.stringify(parsed, null, 2)
    );
    console.log("Response saved to " + getCurrentWeekJSONFileName());
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw error;
  }
}

callApi();
