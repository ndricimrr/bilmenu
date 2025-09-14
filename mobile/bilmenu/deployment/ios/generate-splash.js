const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const splashSizes = [
  { width: 1242, height: 2436, name: "splash-1242x2436.png" }, // iPhone X/XS/11 Pro
  { width: 1125, height: 2436, name: "splash-1125x2436.png" }, // iPhone XS Max/11 Pro Max
  { width: 828, height: 1792, name: "splash-828x1792.png" }, // iPhone XR/11
  { width: 1242, height: 2688, name: "splash-1242x2688.png" }, // iPhone XS Max/11 Pro Max
  { width: 1125, height: 2436, name: "splash-1125x2436.png" }, // iPhone X/XS/11 Pro
  { width: 750, height: 1334, name: "splash-750x1334.png" }, // iPhone 6/7/8
  { width: 640, height: 1136, name: "splash-640x1136.png" }, // iPhone 5/5S/5C
  { width: 1536, height: 2048, name: "splash-1536x2048.png" }, // iPad
  { width: 2048, height: 2732, name: "splash-2048x2732.png" }, // iPad Pro
];

const logoPath = "../../assets/images/logo/master_ios_bilmenu_1024_1024.png";
const outputDir = "../../assets/images/splash";

// Create output directory if it doesn't exist
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

async function generateSplashScreens() {
  console.log("Generating iOS splash screens...");

  for (const splash of splashSizes) {
    try {
      // Create a white background
      const background = sharp({
        create: {
          width: splash.width,
          height: splash.height,
          channels: 3,
          background: { r: 255, g: 255, b: 255 },
        },
      }).png();

      // Load and resize the logo
      const logo = await sharp(logoPath)
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
        .toFile(path.join(outputDir, splash.name));

      console.log(
        `✅ Generated ${splash.name} (${splash.width}x${splash.height})`
      );
    } catch (error) {
      console.error(`❌ Failed to generate ${splash.name}:`, error.message);
    }
  }

  console.log("🎉 All splash screens generated successfully!");
}

generateSplashScreens().catch(console.error);
