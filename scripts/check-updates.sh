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

  echo -e "\n  -> Stash current changes\n"
  git stash
  echo -e "\n  -> Pull latest from master\n"
  git pull origin master
  echo -e "\n  -> Pop changes\n"
  git stash pop
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
