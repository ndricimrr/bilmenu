#!/bin/bash

# CRON job script to run missing meals check
# This script can be added to crontab for automated execution
# Example: 0 9 * * 1 /path/to/run-missing-meals-check.sh

# Get the directory where this script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Change to the project directory
cd "$SCRIPT_DIR"

# Run the missing meals check
echo "$(date): Starting missing meals check..." >> missing-meals-check.log
node check-missing-meals.js >> missing-meals-check.log 2>&1

# Check if the script ran successfully
if [ $? -eq 0 ]; then
    echo "$(date): Missing meals check completed successfully" >> missing-meals-check.log
else
    echo "$(date): Missing meals check failed with exit code $?" >> missing-meals-check.log
fi

echo "$(date): Missing meals check finished" >> missing-meals-check.log
echo "---" >> missing-meals-check.log
