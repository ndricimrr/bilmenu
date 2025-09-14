# Missing Meals Checker

This tool helps identify missing meal images by cross-referencing meal plans with existing images in the assets folder.

## Overview

The script analyzes all meal plan JSON files in `webapp/mealplans/` and compares the Turkish meal names with existing image files in `webapp/assets/images/meals/`. It generates a comprehensive report of missing meal images.

## Files

- `check-missing-meals.js` - Main script that performs the analysis
- `run-missing-meals-check.sh` - CRON job wrapper script
- `webapp/missing-meals/` - Directory where reports are saved

## Usage

### Manual Execution

```bash
# Run the script manually
node check-missing-meals.js

# Or make it executable and run directly
./check-missing-meals.js
```

### Automated Execution (CRON)

1. **Add to crontab:**

   ```bash
   crontab -e
   ```

2. **Add one of these lines (choose your preferred schedule):**

   ```bash
   # Run every Monday at 9 AM
   0 9 * * 1 /Users/ndricim/Documents/coding/bilmenu/run-missing-meals-check.sh

   # Run daily at 6 AM
   0 6 * * * /Users/ndricim/Documents/coding/bilmenu/run-missing-meals-check.sh

   # Run weekly on Sunday at 8 PM
   0 20 * * 0 /Users/ndricim/Documents/coding/bilmenu/run-missing-meals-check.sh
   ```

3. **Check CRON logs:**
   ```bash
   tail -f missing-meals-check.log
   ```

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

Based on the current data:

- **Total unique meals**: 471
- **Meals with images**: 217 (46%)
- **Missing images**: 254 (54%)

## Troubleshooting

### Common Issues

1. **Permission errors**: Make sure scripts are executable

   ```bash
   chmod +x check-missing-meals.js
   chmod +x run-missing-meals-check.sh
   ```

2. **CRON not running**: Check CRON service status

   ```bash
   sudo systemctl status cron
   ```

3. **Path issues**: Use absolute paths in crontab entries

### Logs

- CRON execution logs: `missing-meals-check.log`
- Script output: Console and JSON reports

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
