#!/bin/bash
cd server
npm start &
npm run mail_start &
cd ../frontend
npm start