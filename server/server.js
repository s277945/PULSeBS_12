'use strict';



//import express
const express = require('express');
const dao = require('./dao');
const morgan = require('morgan'); // logging middleware
const cors = require('cors');
const { check, validationResult } = require('express-validator');
const jwt = require ('express-jwt');
const moment = require('moment');
const cookieParser = require('cookie-parser');
const nodemailer = require('nodemailer'); 
const jsonwebtoken = require('jsonwebtoken');

const authErrorObj = { errors: [{ 'param': 'Server', 'msg': 'Authorization error' }] };

//create application
const app = express();
const port = 3001;


// Set-up logging
app.use(morgan('tiny'));

// Process body content
app.use(express.json());



//setup private key
const jwtSecret = 'aD6c3gT4Fh5gThVd4WwE5Er5gVjGhyT8iOLc2d7W5q1gTdC9vFs5N8ju6Kt7RhIq7Xz8Nt';

//setup JWT token expiration time
const expireTime = 600; // 10 minutes

//unauthorized access management
app.use((err, req, res, next) => {
  if (err.name === 'UnauthorizedError') {
      res.status(401).json(authErrorObj);
  }
});

// Enable cors
app.use(cors());

//login route
app.post('/api/login', (req, res) => {
  dao.checkUserPwd(req.body.userName, req.body.password)
      .then((response) => {
        console.log(response.userID + " aasdads");
        console.log(response.userType + " aasdads");
          const token = jsonwebtoken.sign({ user: response.userId, userType: response.userType }, jwtSecret, { expiresIn: expireTime });
          res.cookie('token', token, { httpOnly: true, sameSite: true, maxAge: 3000 * expireTime });
          res.status(200).json(response).end(); 
      }).catch( // Delay response in case of wrong user/pass to prevent fast guessing attempts
          () => new Promise((resolve) => { setTimeout(resolve, 1000) }).then( // 1 second timeout
              () => {res.status(401).end()}
          )
      );
});

//cookie parsing setup
app.use(cookieParser());


app.post('/api/logout', (req, res) => {
  res.clearCookie('token').end();
});


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