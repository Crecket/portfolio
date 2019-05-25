#!/usr/bin/bash

echo -e "\n === Stop PM2 server\n"
pm2 stop portfolio

echo -e "\n === Checking and optimizing image sizes\n"
yarn run optimize-images

echo -e "\n === Update bunq data files and check API\n"
yarn run generate-bunq-data

echo -e "\n === Render bunq charts as images\n"
yarn run generate-chart-images

echo -e "\n === Build server\n"
yarn run build:server

echo -e "\n === Build client\n"
yarn run build:client

echo -e "\n === Start PM2 server\n"
pm2 start portfolio
