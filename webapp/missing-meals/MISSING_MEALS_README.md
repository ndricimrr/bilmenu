# Missing Meals Checker

This tool helps identify missing meal images by cross-referencing meal plans with existing images in the assets folder.

## Overview

The script analyzes all meal plan JSON files in `webapp/mealplans/` and compares the Turkish meal names with existing image files in `webapp/assets/images/meals/`. It generates a comprehensive report of missing meal images.

## Files

- `scripts/utils/check-missing-meals.js` - Main script that performs the analysis
- `.github/workflows/check_missing_meals.yml` - GitHub Actions workflow
- `webapp/missing-meals/` - Directory where reports are saved

## Usage

### Manual Execution

```bash
# Run the script manually
node scripts/utils/check-missing-meals.js

# Or make it executable and run directly
./scripts/utils/check-missing-meals.js
```

### Automated Execution (GitHub Actions)

The missing meals check runs automatically via GitHub Actions:

1. **Automatic Schedule:**

   - Runs on the 1st day of every month at 9:00 AM Turkish time
   - Generates a new checkpoint report and commits it to the repository

2. **Manual Execution:**

   - Go to the "Actions" tab in your GitHub repository
   - Select "Check Missing Meals and Commit Report"
   - Click "Run workflow" to trigger manually

3. **View Results:**
   - Check the Actions tab for execution logs
   - New checkpoint files appear in `webapp/missing-meals/` directory
   - Each run commits the generated report automatically

## Output

### Console Output

The script provides real-time feedback:

- Number of meal plan files processed
- Number of existing images found
- Total unique meals discovered
- List of missing meals
- Summary statistics

### JSON Report

Each run generates a timestamped JSON file in `webapp/missing-meals/`:

- `missing-checkpoint-YYYY-MM-DD_HH-MM-SS.json`

#### Report Structure

```json
{
  "timestamp": "2025-09-14T16:06:24.169Z",
  "generatedAt": "9/14/2025, 6:06:24 PM",
  "summary": {
    "totalMeals": 471,
    "foundMeals": 217,
    "missingMeals": 254,
    "processedFiles": 42,
    "totalImageFiles": 301
  },
  "missingMeals": [
    "Akdeniz Gülü",
    "Antep Tava"
    // ... list of missing meals
  ],
  "foundMeals": [
    "Akdeniz Salata",
    "Alaca Çorba"
    // ... list of meals with images
  ]
}
```

## Supported Meal Plan Formats

The script handles two different JSON structures:

### New Format (Array of days)

```json
[
  {
    "date": "30.12.2024",
    "dayOfWeek": "Monday",
    "lunch": [{ "tr": "Romen Çorba", "en": "Roman soup" }],
    "dinner": [{ "tr": "Sebze Çorba", "en": "Vegetable soup" }],
    "alternative": [{ "tr": "Akdeniz Salata", "en": "Mediterranean salad" }]
  }
]
```

### Old Format (Object with fixMenu)

```json
{
  "fixMenuLunch": [
    {
      "date": "04.03.2024",
      "lunchDishes": [{ "tr": "Yoğurt Çorba", "en": "Yogurt soup" }]
    }
  ],
  "fixMenuDinner": [
    {
      "date": "04.03.2024",
      "dinnerDishes": [{ "tr": "Meksika Köfte", "en": "Stuffed meatballs" }]
    }
  ]
}
```

## Image Matching

- Images are matched by exact Turkish name (case-sensitive)
- Supported image formats: `.jpg`, `.jpeg`, `.png`
- Image filenames should match the Turkish meal name exactly

## Example Results

Based on the current data (September 14, 2025):

- **Total unique meals**: 471
- **Meals with images**: 217 (46%)
- **Missing images**: 254 (54%)

## Troubleshooting

### Common Issues

1. **Permission errors**: Make sure scripts are executable

   ```bash
   chmod +x scripts/utils/check-missing-meals.js
   ```

2. **GitHub Actions not running**: Check repository settings and workflow permissions

3. **Node.js version issues**: The workflow uses Node.js 18, ensure compatibility

### Logs

- GitHub Actions execution logs: Available in the Actions tab
- Script output: Console and JSON reports
- Commit history: Shows when new checkpoint files are added

## Integration

This tool can be integrated into:

- CI/CD pipelines
- Automated monitoring systems
- Content management workflows
- Quality assurance processes

## Future Enhancements

Potential improvements:

- Fuzzy matching for similar meal names
- Image quality validation
- Duplicate image detection
- Integration with image generation APIs
- Web dashboard for missing meals
