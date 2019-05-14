#!/usr/bin/bash

echo -e "\n  -> Add sudo support to react-snap\n"
sed -i "s/puppeteerArgs: \[\],/puppeteerArgs: \[\"--no-sandbox\", \"--disable-setuid-sandbox\"\],/" ./node_modules/react-snap/index.js
