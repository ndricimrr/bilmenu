#!/bin/bash

# Example script to set up CRON job for missing meals check
# Run this script to add the CRON job to your crontab

echo "Setting up CRON job for missing meals check..."

# Get the current directory
CURRENT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CRON_SCRIPT="$CURRENT_DIR/run-missing-meals-check.sh"

# Check if the script exists
if [ ! -f "$CRON_SCRIPT" ]; then
    echo "Error: run-missing-meals-check.sh not found at $CRON_SCRIPT"
    exit 1
fi

# Make sure the script is executable
chmod +x "$CRON_SCRIPT"

# Create a temporary crontab file
TEMP_CRON=$(mktemp)

# Get current crontab (if any)
crontab -l 2>/dev/null > "$TEMP_CRON"

# Check if the job already exists
if grep -q "run-missing-meals-check.sh" "$TEMP_CRON"; then
    echo "CRON job already exists. Removing old entry..."
    grep -v "run-missing-meals-check.sh" "$TEMP_CRON" > "${TEMP_CRON}.new"
    mv "${TEMP_CRON}.new" "$TEMP_CRON"
fi

# Add the new CRON job (runs every Monday at 9 AM)
echo "# Missing meals check - runs every Monday at 9 AM" >> "$TEMP_CRON"
echo "0 9 * * 1 $CRON_SCRIPT" >> "$TEMP_CRON"

# Install the new crontab
crontab "$TEMP_CRON"

# Clean up
rm "$TEMP_CRON"

echo "✅ CRON job added successfully!"
echo "📅 Schedule: Every Monday at 9:00 AM"
echo "📁 Script: $CRON_SCRIPT"
echo ""
echo "To view your current crontab: crontab -l"
echo "To remove this job: crontab -e (then delete the line)"
echo "To check logs: tail -f $CURRENT_DIR/missing-meals-check.log"
