#!/usr/bin/bash

echo -e "\n  -> Update dependencies\n"
yarn

echo -e "\n  -> Add sudo support to react-snap\n"
sed -i "s/puppeteerArgs: \[\],/puppeteerArgs: \[\"--no-sandbox\", \"--disable-setuid-sandbox\"\],/" ./node_modules/react-snap/index.js

echo -e "\n  -> Build the project\n"
yarn build
