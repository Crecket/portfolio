#!/usr/bin/bash

git fetch origin master

if [[ `git status --porcelain --untracked-files=no` ]]; then
  echo \nStash current changes\n
  git stash
  echo Pull latest from master\n
  git pull origin master
  echo Pop changes\n
  git stash pop
  echo Update dependencies\n
  yarn
  echo \nAdd sudo support to react-snap\n
  sed -i "s/puppeteerArgs: \[\],/puppeteerArgs: \[\"--no-sandbox\", \"--disable-setuid-sandbox\"\],/" ./node_modules/react-snap/index.js
  echo \nBuild the server\n
  yarn build
  echo \nRestart the server\n
  pm2 restart portfolio
else
  echo "\nNo changes\n"
fi