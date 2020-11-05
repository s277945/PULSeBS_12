'use strict';



//import express
const express = require('express');
const dao = require('./dao');
const morgan = require('morgan'); // logging middleware
const cors = require('cors');
const { check, validationResult } = require('express-validator');
const moment = require('moment');
const nodemailer = require('nodemailer'); 


//create application
const app = express();
const port = 3001;

// Set-up logging
app.use(morgan('tiny'));

// Process body content
app.use(express.json());

// Enable cors
app.use(cors());

//mail configuration

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'youremail@gmail.com',
      pass: 'yourpassword'
    }
  });
  
  var mailOptions = {
    from: 'youremail@gmail.com',
    to: 'myfriend@yahoo.com',
    subject: 'Sending Email using Node.js',
    text: 'That was easy!'
  };
  

///////////////////////
///REST API ENDPOINT///
///////////////////////



//activate server
app.listen(port, () => console.log(`Server ready at port: ${port}`));