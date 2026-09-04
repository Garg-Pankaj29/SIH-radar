#!/bin/bash
# Local cron script to fetch SIH data and push to github

# Move to project directory
cd "$(dirname "$0")/.." || exit

# Run python script
python3 -m backend.api_data

# Check if there are any changes
if git diff --quiet data/ frontend/data/ frontend/public/; then
    echo "$(date): No changes found."
else
    echo "$(date): Changes found. Committing and pushing."
    git add data/ frontend/data/ frontend/public/
    git commit -m "chore(data): auto-refresh SIH data from local cron"
    git push
fi
