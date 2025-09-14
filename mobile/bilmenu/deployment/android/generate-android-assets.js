const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const androidIconSizes = [
  { size: 48, name: "icon-48.png" },
  { size: 72, name: "icon-72.png" },
  { size: 96, name: "icon-96.png" },
  { size: 144, name: "icon-144.png" },
  { size: 192, name: "icon-192.png" },
  { size: 512, name: "icon-512.png" },
];

const featureGraphicSizes = [
  { width: 1024, height: 500, name: "feature-graphic-1024x500.png" },
];

const inputPath = "../../assets/images/logo/master_ios_bilmenu_1024_1024.png";
const outputDir = "../../assets/images/logo/android";

// Create output directory if it doesn't exist
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

async function generateAndroidAssets() {
  console.log("Generating Android app assets...");

  // Generate icons
  for (const icon of androidIconSizes) {
    try {
      await sharp(inputPath)
        .resize(icon.size, icon.size)
        .png()
        .toFile(path.join(outputDir, icon.name));

      console.log(`✅ Generated ${icon.name} (${icon.size}x${icon.size})`);
    } catch (error) {
      console.error(`❌ Failed to generate ${icon.name}:`, error.message);
    }
  }

  // Generate feature graphic
  for (const graphic of featureGraphicSizes) {
    try {
      // Create a background with your brand color
      const background = sharp({
        create: {
          width: graphic.width,
          height: graphic.height,
          channels: 3,
          background: { r: 230, g: 244, b: 254 }, // #E6F4FE
        },
      }).png();

      // Load and resize the logo
      const logo = await sharp(inputPath)
        .resize(200, 200, { fit: "inside" })
        .png()
        .toBuffer();

      // Composite logo onto background
      await background
        .composite([
          {
            input: logo,
            gravity: "center",
          },
        ])
        .toFile(path.join(outputDir, graphic.name));

      console.log(
        `✅ Generated ${graphic.name} (${graphic.width}x${graphic.height})`
      );
    } catch (error) {
      console.error(`❌ Failed to generate ${graphic.name}:`, error.message);
    }
  }

  console.log("🎉 All Android assets generated successfully!");
}

generateAndroidAssets().catch(console.error);
