'use strict';



//import express
const express = require('express');
const dao = require('./dao');
const mailer = require('./mailer');
const morgan = require('morgan'); // logging middleware
const cors = require('cors');
const { check, validationResult } = require('express-validator');
const jwt = require ('express-jwt');
const moment = require('moment');
const cookieParser = require('cookie-parser');
const jsonwebtoken = require('jsonwebtoken');

const authErrorObj = { errors: [{ 'param': 'Server', 'msg': 'Authorization error' }] };
//setup private key
const jwtSecret = 'aD6c3gT4Fh5gThVd4WwE5Er5gVjGhyT8iOLc2d7W5q1gTdC9vFs5N8ju6Kt7RhIq7Xz8Nt';

//setup JWT token expiration time
const expireTime = 600; // 10 minutes

//create application
const app = express();
app.disable("x-powered-by");
const port = 3001;

// Set-up logging
app.use(morgan('tiny'));

// Process body content
app.use(express.json());

// Enable cors
app.use(cors({ origin: true, credentials: true }));

/**
 * FAKE ENDPOINT TO CHECK DEADLINE DAO
 * 
 */

 app.get('/api/checkEmails', (req, res) => {
   let date = moment().format('YYYY-MM-DD HH:mm:ss');
   dao.checkDeadline(date)
    .then((list) => {
      res.status(200).json(list);
    })
    .catch((err) => {
      res.status(500).json({"errors": err});
    })
 })

//login route
app.post('/api/login', (req, res) => {
  dao.checkUserPwd(req.body.userName, req.body.password)
      .then((response) => {
        console.log(response.userID);
          const token = jsonwebtoken.sign({ user: response.userID, userType: response.userType }, jwtSecret, { expiresIn: expireTime });
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

/**
 * Endpoint for logout management
 */
app.post('/api/logout', (req, res) => {
  res.clearCookie('token').end();
});


/**
 * From this point, next endpoints need authentication to work
 *
 * AUTHENTICATED REST API endopoints
 */

app.use(
  jwt({
      secret: jwtSecret,
      getToken: req => req.cookies.token
  })
);

//unauthorized access management
app.use((err, req, res, next) => {
  if (err.name === 'UnauthorizedError') {
      res.status(401).json(authErrorObj);
  }
});

/**
 * GET api/lectures
 *
 * Returns list of available lectures for a given student
 *
 * userId => userId
 */

 app.get('/api/lectures', (req, res) => {
  const user = req.user && req.user.user;
  console.log("User: " + user);
    dao.getLecturesByUserId(user)
      .then((lectures) => {
        res.status(200).json(lectures);
      })
      .catch((err) => {
        res.status(500).json({errors: [{'msg': err}]});
      });
 });


/**
 * POST api/lectures
 *
 * Book a lecture for a given student
 *
 * body request: {"lectureId": "0432SQ", date: ""}
 */

 app.post('/api/lectures', (req, res) => {
    const user = req.user && req.user.user;
    const date=moment(req.body.date).format('YYYY-MM-DD HH:mm:ss');

    if (moment(date).isBefore(moment()))
      return res.status(422).json({ errors: 'Invalid end date' });

    dao.addSeat(user, req.body.lectureId, date)
      .then((response) => {
          res.status(201).json({"inserted": response});
          dao.getStudentEmail(user)
            .then((email) => {
              var mailOptions = {
                from: mailer.email,
                to: email,
                subject: 'Booking Confirmation',
                text: `Dear ${user}, you booked a seat for Course ${req.body.lectureId} for lecture on ${date}`
              };

              mailer.transporter.sendMail(mailOptions, function(err, info){
                if(err){
                    console.log(err);
                } else {
                    console.log('Email sent: ' + info.response);
                }
              });
            })
            .catch((err) => res.status(500).json({ errors: [{ 'param': 'Server', 'msg': err }] }))
      }).catch((err) => {
        res.status(500).json({ errors: [{ 'param': 'Server', 'msg': err }] });
      });
 });

 /**
 * DELETE api/lectures/:lectureId?date=2020-12-13 19:00:00
 *
 * Delete booked lecture for a given student
 *
 * params: lectureId, date
 */

 app.delete('/api/lectures/:lectureId', (req,res) => {
    let date = moment(req.query.date).format('YYYY-MM-DD HH:mm:ss');
    const user = req.user && req.user.user;
    dao.deleteSeat(user, req.params.lectureId, date)
      .then(() => res.status(204).end())
      .catch((err) => res.status(500).json({ errors: [{ 'param': 'Server', 'msg': err }] }));
 });

/**
 * GET /api/lectures/next
 *
 */

 app.get('/api/lectures/next', (req, res) => {
    const user = req.user && req.user.user;
    dao.getNextLectureNumber(user)
      .then((response) => {
        res.status(201).json(response);
      })
      .catch((err) => res.status(500).json({ errors: [{ 'param': 'Server', 'msg': err }] }));
 });


/**
 * GET /lectures/listStudents?courseRef=...&date=2020-....
 *
 * query parameters: lectureId
 */

 app.get('/api/lectures/listStudents', (req, res) => {

    const course_ref = req.query.courseRef;
    const date = moment(req.query.date).format('YYYY-MM-DD HH:mm:ss');
    dao.getStudentList(course_ref, date)
      .then((list) => {
        res.status(201).json(list);
      })
      .catch((err) => res.status(500).json({ errors: [{ 'param': 'Server', 'msg': err }] }));

 });


/**
 * GET /lectures/booked
 *
 * query parameters: userId => retrieved from cookie
 */

app.get('/api/lectures/booked', (req, res) => {
  const user = req.user && req.user.user;
  dao.getLecturesBookedByUserId(user)
    .then((list) => {
      res.status(201).json(list);
    })
    .catch((err) => res.status(500).json({ errors: [{ 'param': 'Server', 'msg': err }] }));

});

/**
 * DELETE /api/courseLectures/:courseId?date=...
 * 
 * parameters: courseId, date
 */

 app.delete('/api/courseLectures/:courseId', (req, res)=>{
    const courseId = req.params.courseId;
    const date = req.query.date;

    //const now = moment().format('YYYY-MM-DD HH:mm:ss');

    if(moment().isAfter(moment(date).subtract(1, 'hours'))){
      return res.status(500).json({error: "Delete lecture deadline expired"});
    }

    dao.deleteLecture(courseId, date)
      .then((emails) => {
        for(let email of emails){
          var mailOptions = {
            from: mailer.email,
            to: email,
            subject: 'Lecture canceled',
            text: `Dear student, the lecture of Course ${courseId} for lecture on ${date} has been canceled`
          };

          mailer.transporter.sendMail(mailOptions, function(err, info){
            if(err){
                console.log(err);
            } else {
                console.log('Email sent: ' + info.response);
            }
          });
        }
        res.status(204).json({"lecture": "canceled"});
      })
      .catch((err) => {
        res.status(500).json(err);
      })
 })

/**
 * PUT /api/lectures
 *
 * body parameters: {"courseId": C4567, "date": "2020-12-22 09:00:00", "type": "d"}
 * */

app.put('/api/lectures', (req, res) => {
    const courseId = req.body.courseId;

    if(moment().isAfter(moment(req.body.date).subtract('30', 'minutes'))){
        return res.status(422).json(
            {error: "Cannot modify type of lecture after 30 minutes before scheduled time"});
    }

    dao.changeTypeOfLecture(courseId, req.body.date, req.body.type)
        .then((response) => {
            res.status(200).json({response: response});
        })
        .catch(err => {
            res.status(500).json(err);
        })

})

//activate server
app.listen(port, () => console.log(`Server ready at port: ${port}`));
