const fs = require("fs");
const axios = require("axios");
const { getCurrentWeekJSONFileName } = require("./webapp/utilities_node");

// Load prompt and cleaned HTML
const prompt = fs.readFileSync("prompt.txt", "utf8");
const cleanedHtml = fs.readFileSync("cleaned.html", "utf8");

// Combine prompt and cleaned HTML
const finalPrompt = `${prompt} ${cleanedHtml}`;

// Prepare the request payload
const payload = {
  contents: [
    {
      parts: [
        {
          text: finalPrompt,
        },
      ],
    },
  ],
};

// Send the request to the Gemini API
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

console.log("Calling Gemini API with payload");

axios
  .post(url, payload, {
    headers: {
      "Content-Type": "application/json",
    },
  })
  .then((response) => {
    if (!response) {
      throw new Error("No response from Gemini API");
    }
    if (!response.candidates) {
      throw new Error(
        "Invalid AI response structure: candidates is undefined",
        response
      );
    }
    if (!response.candidates[0]) {
      throw new Error(
        "Invalid AI response structure: candidates[0] is undefined",
        response
      );
    }
    if (!response.candidates[0].content) {
      throw new Error(
        "Invalid AI response structure: candidates[0].content is undefined",
        response
      );
    }
    if (!response.candidates[0].content.parts) {
      throw new Error(
        "Invalid AI response structure: candidates[0].content.parts is undefined",
        response
      );
    }
    if (!response.candidates[0].content.parts[0]) {
      throw new Error(
        "Invalid AI response structure: candidates[0].content.parts[0] is undefined",
        response
      );
    }
    if (!response.candidates[0].content.parts[0].text) {
      throw new Error(
        "Invalid AI response structure: candidates[0].content.parts[0].text is undefined",
        response
      );
    }

    const rawText = response.candidates[0].content.parts[0].text;
    if (!rawText) {
      throw new Error("Invalid AI response structure: rawText is undefined");
    }

    // Remove code block wrapper (```json\n ... ```)
    const jsonString = rawText.replace(/```json\n([\s\S]*?)```/, "$1");

    // Parse it
    const parsed = JSON.parse(jsonString);

    fs.writeFileSync(
      getCurrentWeekJSONFileName(),
      JSON.stringify(parsed, null, 2)
    );
    console.log("Response saved to" + getCurrentWeekJSONFileName());
    console.log("AI parsed response: \n", parsed);
  })
  .catch((error) => {
    console.error("Error calling Gemini API:", error.message);
  });
