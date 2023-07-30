#!/bin/bash
./wait-for-it.sh postgres:5432 --timeout=5

# run migrations 
node ./dist/migrate.js

# start server
npm start