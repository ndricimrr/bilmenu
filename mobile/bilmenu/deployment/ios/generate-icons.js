const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const iconSizes = [
  { size: 20, name: "icon-20.png" },
  { size: 29, name: "icon-29.png" },
  { size: 40, name: "icon-40.png" },
  { size: 58, name: "icon-58.png" },
  { size: 60, name: "icon-60.png" },
  { size: 76, name: "icon-76.png" },
  { size: 80, name: "icon-80.png" },
  { size: 87, name: "icon-87.png" },
  { size: 114, name: "icon-114.png" },
  { size: 120, name: "icon-120.png" },
  { size: 152, name: "icon-152.png" },
  { size: 167, name: "icon-167.png" },
  { size: 180, name: "icon-180.png" },
  { size: 1024, name: "icon-1024.png" },
];

const inputPath = "./assets/images/logo/master_ios_bilmenu_1024_1024.png";
const outputDir = "./assets/images/logo/ios";

// Create output directory if it doesn't exist
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

async function generateIcons() {
  console.log("Generating iOS app icons...");

  for (const icon of iconSizes) {
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

  console.log("🎉 All iOS icons generated successfully!");
}

generateIcons().catch(console.error);
