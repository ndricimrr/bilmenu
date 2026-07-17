/**
 * Validates the parsed meal plan JSON structure (shared by Gemini / OpenRouter scripts).
 * @param {any} parsed
 * @returns {{ isValid: boolean, issues: string[] }}
 */
function validateJSONStructure(parsed) {
  const issues = [];

  if (!Array.isArray(parsed)) {
    issues.push("JSON is not an array");
    return { isValid: false, issues };
  }

  if (parsed.length === 0) {
    issues.push("JSON array is empty - no days found");
    return { isValid: false, issues };
  }

  let validDays = 0;
  let totalMeals = 0;

  for (const day of parsed) {
    if (!day.date || typeof day.date !== "string") {
      issues.push(`Day missing or invalid date field`);
      continue;
    }

    if (!day.dayOfWeek || typeof day.dayOfWeek !== "string") {
      issues.push(`Day ${day.date} missing or invalid dayOfWeek field`);
      continue;
    }

    const requiredArrays = ["lunch", "dinner", "alternative"];
    for (const mealType of requiredArrays) {
      if (!Array.isArray(day[mealType])) {
        issues.push(`Day ${day.date} missing ${mealType} array`);
        continue;
      }

      for (const meal of day[mealType]) {
        if (!meal.tr || typeof meal.tr !== "string" || meal.tr.trim() === "") {
          issues.push(
            `Day ${day.date} ${mealType} has meal without valid 'tr' field`
          );
        }
        if (!meal.en || typeof meal.en !== "string" || meal.en.trim() === "") {
          issues.push(
            `Day ${day.date} ${mealType} has meal without valid 'en' field`
          );
        } else {
          totalMeals++;
        }
        if (
          meal.isVegan !== undefined &&
          typeof meal.isVegan !== "boolean"
        ) {
          issues.push(
            `Day ${day.date} ${mealType} meal has non-boolean 'isVegan'`
          );
        }
      }
    }

    validDays++;
  }

  const isValid =
    validDays > 0 &&
    validDays >= 3 &&
    totalMeals > 0 &&
    issues.length < validDays * 2;

  if (!isValid) {
    issues.unshift(
      `Validation failed: ${validDays} valid days, ${totalMeals} total meals, ${issues.length} issues`
    );
  }

  return { isValid, issues };
}

/**
 * True if either language name contains a vegan marker.
 * @param {{ tr?: string, en?: string }} meal
 * @returns {boolean}
 */
function mealNameLooksVegan(meal) {
  return /vegan/i.test(`${meal?.tr || ""} ${meal?.en || ""}`);
}

/**
 * Ensures every meal has a boolean isVegan.
 * Uses AI value when true, and also catches vegan markers in tr/en
 * (e.g. English-only "(Vegan)" when Turkish omitted it).
 * @param {any} parsed
 * @returns {any}
 */
function enrichMealPlanWithIsVegan(parsed) {
  if (!Array.isArray(parsed)) return parsed;

  for (const day of parsed) {
    for (const mealType of ["lunch", "dinner", "alternative"]) {
      if (!Array.isArray(day?.[mealType])) continue;
      for (const meal of day[mealType]) {
        const fromAi = meal.isVegan === true;
        meal.isVegan = fromAi || mealNameLooksVegan(meal);
      }
    }
  }

  return parsed;
}

/**
 * Strips markdown code fences and parses JSON from an AI assistant message.
 * @param {string} rawText
 * @returns {any}
 */
function parseJsonFromAiMarkdown(rawText) {
  if (!rawText || typeof rawText !== "string") {
    throw new Error("Invalid AI response structure: content is empty or not a string");
  }
  let jsonString = rawText.replace(/```json\n([\s\S]*?)```/, "$1");
  jsonString = jsonString.replace(/```\n([\s\S]*?)```/, "$1");
  jsonString = jsonString.trim();
  return JSON.parse(jsonString);
}

module.exports = {
  validateJSONStructure,
  enrichMealPlanWithIsVegan,
  mealNameLooksVegan,
  parseJsonFromAiMarkdown,
};
