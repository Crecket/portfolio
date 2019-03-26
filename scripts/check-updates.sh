#!/usr/bin/bash

UPSTREAM=${1:-'@{u}'}
LOCAL=$(git rev-parse @)
REMOTE=$(git rev-parse "$UPSTREAM")
BASE=$(git merge-base @ "$UPSTREAM")

echo -e "\n # Fetching git history\n"
git fetch origin master

if [[ $LOCAL = $REMOTE ]]; then
    echo -e "\n # Up-to-date\n"
elif [[ $LOCAL = $BASE ]]; then

  echo -e "\n  -> Reset to latest origin version\n"
  git reset origin --hard
  echo -e "\n  -> Update dependencies\n"
  yarn
  echo -e "\n  -> Add sudo support to react-snap\n"
  sed -i "s/puppeteerArgs: \[\],/puppeteerArgs: \[\"--no-sandbox\", \"--disable-setuid-sandbox\"\],/" ./node_modules/react-snap/index.js
  echo -e "\n  -> Build the server\n"
  yarn build
  echo -e "\n  -> Restart the server\n"
  pm2 restart portfolio

else
    echo -e "\n # Diverged changes \n"
fi
