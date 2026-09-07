#!/bin/bash
# Local cron script to fetch SIH data and push to GitHub
# This runs on the developer's machine and pushes to origin/main

set -e

# Move to project directory
cd "$(dirname "$0")/.." || exit

LOG_PREFIX="$(date '+%Y-%m-%d %H:%M:%S')"

echo "$LOG_PREFIX: Starting SIH data refresh..."

# Pull latest to avoid non-fast-forward rejections
echo "$LOG_PREFIX: Pulling latest from origin/main..."
git fetch origin main 2>/dev/null || true
git merge origin/main --no-edit 2>/dev/null || true

# Run python script
python3 -m backend.api_data

# Check if there are any changes
if git diff --quiet data/ frontend/data/ frontend/public/; then
    echo "$LOG_PREFIX: No changes found."
else
    echo "$LOG_PREFIX: Changes found. Committing and pushing."
    git add data/ frontend/data/ frontend/public/
    git commit -m "chore(data): auto-refresh SIH data from local cron"
    
    if git push origin HEAD:main; then
        echo "$LOG_PREFIX: Successfully pushed to origin/main."
    else
        echo "$LOG_PREFIX: ERROR — push failed. Reverting commit."
        git reset --soft HEAD~1
        git restore --staged data/ frontend/data/ frontend/public/
        exit 1
    fi
fi
