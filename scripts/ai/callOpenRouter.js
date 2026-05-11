const fs = require("fs");
const axios = require("axios");
const {
  getCurrentWeekJSONFileName,
} = require("../../webapp/js/utilities_node");
const {
  validateJSONStructure,
  parseJsonFromAiMarkdown,
} = require("./mealPlanParseShared");

const OPEN_ROUTER_KEY = process.env.OPEN_ROUTER_KEY;
// API requires `model`; `openrouter/auto` routes to a suitable model (not pinned to one provider).
const OPENROUTER_MODEL =
  process.env.OPENROUTER_MODEL || "openrouter/auto";

if (!OPEN_ROUTER_KEY) {
  throw new Error("OPEN_ROUTER_KEY environment variable is not set");
}

const prompt = fs.readFileSync("./scripts/ai/prompt_v3.txt", "utf8");
const cleanedHtml = fs.readFileSync("./cleaned.html", "utf8");
const finalPrompt = `${prompt}\n\n=== HTML CONTENT TO PARSE ===\n${cleanedHtml}`;

async function callOpenRouter() {
  console.log(
    `OpenRouter fallback: calling chat/completions (model: ${OPENROUTER_MODEL})`
  );

  const res = await axios.post(
    "https://openrouter.ai/api/v1/chat/completions",
    {
      model: OPENROUTER_MODEL,
      messages: [{ role: "user", content: finalPrompt }],
      temperature: 0.2,
    },
    {
      headers: {
        Authorization: `Bearer ${OPEN_ROUTER_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://github.com/",
      },
      timeout: 120000,
    }
  );

  const resolvedModel = res.data?.model;
  if (resolvedModel && resolvedModel !== OPENROUTER_MODEL) {
    console.log("OpenRouter resolved model:", resolvedModel);
  }

  const content = res.data?.choices?.[0]?.message?.content;
  if (!content) {
    throw new Error(
      "Invalid OpenRouter response: missing choices[0].message.content"
    );
  }

  let parsed;
  try {
    parsed = parseJsonFromAiMarkdown(content);
  } catch (e) {
    console.error("Failed to parse JSON from OpenRouter response:", e.message);
    throw e;
  }

  const validation = validateJSONStructure(parsed);
  if (!validation.isValid) {
    console.error(validation.issues.slice(0, 15).join("\n"));
    throw new Error("OpenRouter output failed meal plan JSON validation");
  }

  const outPath = getCurrentWeekJSONFileName();
  fs.writeFileSync(outPath, JSON.stringify(parsed, null, 2));
  console.log("OpenRouter: saved to " + outPath);
}

callOpenRouter().catch((err) => {
  if (err.response) {
    console.error(
      "OpenRouter HTTP error:",
      err.response.status,
      err.response.data
    );
  }
  console.error(err);
  process.exit(1);
});
