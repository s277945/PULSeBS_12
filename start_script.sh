#!/bin/bash
./server/npm start &
./server/npm run mail_start &
wait
./frontend/npm start