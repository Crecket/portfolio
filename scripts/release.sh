#!/usr/bin/bash

echo -e "\n  -> Stop PM2 server\n"
pm2 stop portfolio

echo -e "\n  -> Run the 'generate-bunq-data' script\n"
yarn run generate-bunq-data

echo -e "\n  -> Build server\n"
yarn run build:server

echo -e "\n  -> Build client\n"
yarn run build:client

echo -e "\n  -> Start PM2 server\n"
pm2 start portfolio
