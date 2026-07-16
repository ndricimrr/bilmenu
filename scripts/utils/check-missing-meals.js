#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

/**
 * Script to identify missing meal images by cross-referencing meal plans with existing images
 *
 * This script:
 * 1. Reads all meal plan JSON files from webapp/mealplans/
 * 2. Extracts all Turkish meal names (tr field) from lunch, dinner, and alternative arrays
 * 3. Compares with existing image files in webapp/assets/images/meals/
 * 4. Generates a JSON report of missing meals
 */

const REPO_ROOT = path.join(__dirname, "..", "..");
const MEAL_PLANS_DIR = path.join(REPO_ROOT, "webapp", "mealplans");
const MEALS_IMAGES_DIR = path.join(
  REPO_ROOT,
  "webapp",
  "assets",
  "images",
  "meals"
);
const OUTPUT_DIR = path.join(REPO_ROOT, "webapp", "missing-meals");

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  console.log(`📁 Created output directory: ${OUTPUT_DIR}`);
}

/**
 * Get all meal plan JSON files
 */
function getMealPlanFiles() {
  try {
    const files = fs.readdirSync(MEAL_PLANS_DIR);
    return files.filter(
      (file) => file.endsWith(".json") && file.startsWith("meal_plan_week_")
    );
  } catch (error) {
    console.error("Error reading meal plans directory:", error.message);
    return [];
  }
}

/**
 * Get all existing meal image files
 */
function getExistingMealImages() {
  try {
    const files = fs.readdirSync(MEALS_IMAGES_DIR);
    return files
      .filter(
        (file) =>
          file.endsWith(".jpg") ||
          file.endsWith(".jpeg") ||
          file.endsWith(".png")
      )
      .map((file) => file.replace(/\.(jpg|jpeg|png)$/i, "")); // Remove extension
  } catch (error) {
    console.error("Error reading meals images directory:", error.message);
    return [];
  }
}

/**
 * Extract all Turkish meal names from a meal plan file
 */
function extractMealNamesFromFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, "utf8");
    const mealPlan = JSON.parse(content);

    const mealNames = new Set();

    // Handle different JSON structures
    if (Array.isArray(mealPlan)) {
      // New format: Array of days
      mealPlan.forEach((day) => {
        // Extract from lunch
        if (day.lunch && Array.isArray(day.lunch)) {
          day.lunch.forEach((meal) => {
            if (meal.tr && typeof meal.tr === "string") {
              mealNames.add(meal.tr.trim());
            }
          });
        }

        // Extract from dinner
        if (day.dinner && Array.isArray(day.dinner)) {
          day.dinner.forEach((meal) => {
            if (meal.tr && typeof meal.tr === "string") {
              mealNames.add(meal.tr.trim());
            }
          });
        }

        // Extract from alternative
        if (day.alternative && Array.isArray(day.alternative)) {
          day.alternative.forEach((meal) => {
            if (meal.tr && typeof meal.tr === "string") {
              mealNames.add(meal.tr.trim());
            }
          });
        }
      });
    } else if (typeof mealPlan === "object" && mealPlan !== null) {
      // Old format: Object with fixMenuLunch and fixMenuDinner
      if (mealPlan.fixMenuLunch && Array.isArray(mealPlan.fixMenuLunch)) {
        mealPlan.fixMenuLunch.forEach((day) => {
          if (day.lunchDishes && Array.isArray(day.lunchDishes)) {
            day.lunchDishes.forEach((meal) => {
              if (meal.tr && typeof meal.tr === "string") {
                mealNames.add(meal.tr.trim());
              }
            });
          }
        });
      }

      if (mealPlan.fixMenuDinner && Array.isArray(mealPlan.fixMenuDinner)) {
        mealPlan.fixMenuDinner.forEach((day) => {
          if (day.dinnerDishes && Array.isArray(day.dinnerDishes)) {
            day.dinnerDishes.forEach((meal) => {
              if (meal.tr && typeof meal.tr === "string") {
                mealNames.add(meal.tr.trim());
              }
            });
          }
        });
      }
    }

    return Array.from(mealNames);
  } catch (error) {
    console.error(`Error processing file ${filePath}:`, error.message);
    return [];
  }
}

/**
 * Find missing meals by comparing meal names with existing images
 */
function findMissingMeals() {
  console.log("🔍 Starting missing meals check...");

  // Get all meal plan files
  const mealPlanFiles = getMealPlanFiles();
  console.log(`📁 Found ${mealPlanFiles.length} meal plan files`);

  // Get all existing meal images
  const existingImages = getExistingMealImages();
  console.log(`🖼️  Found ${existingImages.length} existing meal images`);

  // Extract all unique meal names from all meal plans
  const allMealNames = new Set();
  let processedFiles = 0;

  mealPlanFiles.forEach((file) => {
    const filePath = path.join(MEAL_PLANS_DIR, file);
    const mealNames = extractMealNamesFromFile(filePath);
    mealNames.forEach((name) => allMealNames.add(name));
    processedFiles++;
  });

  console.log(`📊 Processed ${processedFiles} meal plan files`);
  console.log(`🍽️  Found ${allMealNames.size} unique meal names`);

  // Find missing meals
  const missingMeals = [];
  const foundMeals = [];

  allMealNames.forEach((mealName) => {
    if (existingImages.includes(mealName)) {
      foundMeals.push(mealName);
    } else {
      missingMeals.push(mealName);
    }
  });

  console.log(`✅ Found images for ${foundMeals.length} meals`);
  console.log(`❌ Missing images for ${missingMeals.length} meals`);

  return {
    totalMeals: allMealNames.size,
    foundMeals: foundMeals.length,
    missingMeals: missingMeals.length,
    missingMealNames: missingMeals.sort(),
    foundMealNames: foundMeals.sort(),
    processedFiles: processedFiles,
    totalImageFiles: existingImages.length,
  };
}

/**
 * Generate timestamp for filename
 */
function getTimestamp() {
  const now = new Date();
  return (
    now.toISOString().replace(/[:.]/g, "-").split("T")[0] +
    "_" +
    now.toTimeString().split(" ")[0].replace(/:/g, "-")
  );
}

/**
 * Save missing meals report to JSON file
 */
function saveMissingMealsReport(report) {
  const timestamp = getTimestamp();
  const filename = `missing-checkpoint-${timestamp}.json`;
  const filepath = path.join(OUTPUT_DIR, filename);

  const fullReport = {
    timestamp: new Date().toISOString(),
    generatedAt: new Date().toLocaleString(),
    summary: {
      totalMeals: report.totalMeals,
      foundMeals: report.foundMeals,
      missingMeals: report.missingMeals,
      processedFiles: report.processedFiles,
      totalImageFiles: report.totalImageFiles,
    },
    missingMeals: report.missingMealNames,
    foundMeals: report.foundMealNames,
  };

  try {
    fs.writeFileSync(filepath, JSON.stringify(fullReport, null, 2), "utf8");
    console.log(`💾 Report saved to: ${filepath}`);

    // Update latest-checkpoint.json
    updateLatestCheckpointState(filename);

    return filepath;
  } catch (error) {
    console.error("Error saving report:", error.message);
    return null;
  }
}

/**
 * Update the latest checkpoint state file
 */
function updateLatestCheckpointState(filename) {
  try {
    // Count total checkpoint files
    const files = fs.readdirSync(OUTPUT_DIR);
    const checkpointFiles = files.filter(
      (file) => file.startsWith("missing-checkpoint-") && file.endsWith(".json")
    );
    const totalCheckpoints = checkpointFiles.length;

    const latestCheckpointState = {
      latestCheckpoint: filename,
      latestCheckpointUrl: `https://raw.githubusercontent.com/ndricimrr/bilmenu/refs/heads/main/webapp/missing-meals/${filename}`,
      totalCheckpoints: totalCheckpoints,
      lastUpdated: new Date().toISOString(),
      generatedBy:
        process.env.GITHUB_ACTIONS === "true"
          ? "GitHub Actions"
          : "Local Script",
    };

    const stateFilePath = path.join(OUTPUT_DIR, "latest-checkpoint.json");
    fs.writeFileSync(
      stateFilePath,
      JSON.stringify(latestCheckpointState, null, 2),
      "utf8"
    );
    console.log(`📊 Latest checkpoint state updated: ${filename}`);
  } catch (error) {
    console.error("Error updating latest checkpoint state:", error.message);
  }
}

/**
 * Main execution
 */
function main() {
  console.log("🚀 Missing Meals Checker");
  console.log("========================");

  // Check if running in GitHub Actions
  if (process.env.GITHUB_ACTIONS === "true") {
    console.log("🤖 Running in GitHub Actions environment");
  }

  const report = findMissingMeals();

  if (report.missingMeals > 0) {
    console.log("\n❌ Missing Meals:");
    console.log("==================");
    report.missingMealNames.forEach((meal, index) => {
      console.log(`${index + 1}. ${meal}`);
    });
  } else {
    console.log("\n🎉 All meals have corresponding images!");
  }

  const savedFile = saveMissingMealsReport(report);

  console.log("\n📈 Summary:");
  console.log("===========");
  console.log(`Total unique meals: ${report.totalMeals}`);
  console.log(`Meals with images: ${report.foundMeals}`);
  console.log(`Missing images: ${report.missingMeals}`);
  console.log(`Processed files: ${report.processedFiles}`);

  if (savedFile) {
    console.log(`\n✅ Report saved successfully!`);
    console.log(`📁 Location: ${savedFile}`);
  }
}

// Run the script
if (require.main === module) {
  main();
}

module.exports = {
  findMissingMeals,
  saveMissingMealsReport,
  getMealPlanFiles,
  getExistingMealImages,
  extractMealNamesFromFile,
};
