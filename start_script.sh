#!/bin/bash
(cd server; npm start) &
(cd server; npm run mail_start) &
(cd frontend; npm start)