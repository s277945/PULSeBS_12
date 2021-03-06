'use strict';



//import express
const express = require('express');
const userDao = require('./Dao/userDao')
const studentDao = require('./Dao/studentDao')
const supportOfficerDao = require('./Dao/supportOfficerDao')
const teacherDao = require('./Dao/teacherDao')
const bookingManagerDao = require('./Dao/bookingManagerDao')
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

//login route
app.post('/api/login', (req, res) => {
  userDao.checkUserPwd(req.body.userName, req.body.password)
      .then((response) => {
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
    /* istanbul ignore else */
    if (err.name === 'UnauthorizedError') {
      res.status(401).json(authErrorObj);
  }
    /* istanbul ignore else */
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
    studentDao.getLecturesByStudentId(user)
      .then((lectures) => {
        res.status(200).json(lectures);
      })
      .catch(/* istanbul ignore next */(err) => {
        res.status(500).json({errors: [{'msg': err}]});
      });
 });

/**
 * GET api/teacherLectures
 *
 * Returns list of available lectures for a given teacher
 *
 * userId => userId
 */

app.get('/api/teacherLectures', (req, res) => {
  const user = req.user && req.user.user;
    teacherDao.getLecturesByTeacherId(user)
      .then((lectures) => {
        res.status(200).json(lectures);
      })
      .catch(/* istanbul ignore next */(err) => {
        res.status(500).json({errors: [{'msg': err}]});
      });
 });

/**
 * GET api/courses
 *
 * Returns list of available courses for a given user
 *
 * userId => userId
 */

app.get('/api/courses', (req, res) => {
  const user = req.user && req.user.user;
    studentDao.getCoursesByStudentId(user)
      .then((courses) => {
        res.status(200).json(courses);
      })
      .catch(/* istanbul ignore next */(err) => {
        res.status(500).json({errors: [{'msg': err}]});
      });
 });

/**
 * GET api/teacherCourses
 *
 * Returns list of available courses for a given teacher
 *
 * userId => userId
 */

app.get('/api/teacherCourses', (req, res) => {
  const user = req.user && req.user.user;
    teacherDao.getCoursesByTeacherId(user)
      .then((courses) => {
        res.status(200).json(courses);
      })
      .catch(/* istanbul ignore next */(err) => {
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
    const endDate=moment(req.body.endDate).format('YYYY-MM-DD HH:mm:ss');

    if (moment(date).isBefore(moment()))
      return res.status(422).json({ errors: 'Invalid end date' });

    studentDao.addSeat(user, req.body.lectureId, date, endDate)
      .then((response) => {
          res.status(201).json({"operation": response});
          studentDao.getStudentEmail(user)
            .then((email) => {
                let mailOptions;
                /* istanbul ignore else */
                if(response === "booked"){
                    mailOptions = {
                        from: mailer.email,
                        to: email,
                        subject: 'Booking Confirmation',
                        text: `Dear ${user}, you booked a seat for Course ${req.body.lectureId} for lecture on ${date}`
                    };
                } else if(response === "waiting"){
                    mailOptions = {
                        from: mailer.email,
                        to: email,
                        subject: 'Lecture waiting list',
                        text: `Dear ${user}, you have been inserted in a waiting list for a seat of Course ${req.body.lectureId} for lecture on ${date}`
                    };
                }
                /* istanbul ignore else */
                else {
                    return;
                }


              mailer.transporter.sendMail(mailOptions, function(err, info){
                  /* istanbul ignore if */
                  if(err){
                    console.log(err);
                } else {
                    console.log('Email sent: ' + info.response);
                }
              });
            })
            .catch(/* istanbul ignore next */(err) => res.status(500).json({ errors: [{ 'param': 'Server', 'msg': err.message }] }))
      }).catch((err) => {
        console.log(err.message);
        res.status(500).json({ errors: [{ 'param': 'Server', 'msg': err.message }] });
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
    studentDao.deleteSeat(user, req.params.lectureId, date)
      .then((userId) => {res.status(204).end()
        if(userId!=="NoUser") studentDao.getStudentEmail(userId)
        .then((email) => {
          var mailOptions = {
            from: mailer.email,
            to: email,
            subject: 'Waiting list notification',
            text: `Dear ${userId}, you got moved from the waiting list for Course ${req.params.lectureId} for lecture on ${date}`
          };

          mailer.transporter.sendMail(mailOptions, function(err, info){
              /* istanbul ignore if */
              if(err){
                console.log(err);
            } else {
                console.log('Email sent: ' + info.response);
            }
          });
        })
        .catch(/* istanbul ignore next */(err) => res.status(500).json({ errors: [{ 'param': 'Server', 'msg': err.message }] }))
      })
      .catch(/* istanbul ignore next */(err) => res.status(500).json({ errors: [{ 'param': 'Server', 'msg': err.message }] }));
 });

/**
 * GET /lectures/listStudents?courseRef=...&date=2020-....
 *
 * Return the list of students that attended a specific lecture
 * 
 * query parameters: lectureId
 */

 app.get('/api/lectures/listStudents', (req, res) => {

    const course_ref = req.query.courseRef;
    const date = moment(req.query.date).format('YYYY-MM-DD HH:mm:ss');

    teacherDao.getStudentList(course_ref, date)
      .then((list) => {
        res.status(201).json(list);
      })
      .catch(/* istanbul ignore next */(err) => res.status(500).json({ errors: [{ 'param': 'Server', 'msg': err.message }] }));
 });

/**
 * GET /lectures/booked
 *
 * Return the lectures booked by the student logged in
 * 
 * query parameters: userId => retrieved from cookie
 */

app.get('/api/lectures/booked', (req, res) => {
  const user = req.user && req.user.user;
  studentDao.getLecturesBookedByUserId(user)
    .then((list) => {
      res.status(201).json(list);
    })
    .catch(/* istanbul ignore next */(err) => res.status(500).json({ errors: [{ 'param': 'Server', 'msg': err.message }] }));
});

/**
 * GET /lectures/waiting
 *
 * Return the list of lectures in which the student in waiting
 * 
 * query parameters: userId => retrieved from cookie
 */

app.get('/api/lectures/waiting', (req, res) => {
  const user = req.user && req.user.user;
  studentDao.getLecturesWaitingByUserId(user)
    .then((list) => {
      res.status(201).json(list);
    })
    .catch(/* istanbul ignore next */(err) => res.status(500).json({ errors: [{ 'param': 'Server', 'msg': err.message }] }));

});

/**
 * DELETE /api/courseLectures/:courseId?date=...
 *
 * Delete a lecture and notify all the students booked
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

    teacherDao.deleteLecture(courseId, date)
      .then((emails) => {
        for(let email of emails){
          var mailOptions = {
            from: mailer.email,
            to: email,
            subject: 'Lecture canceled',
            text: `Dear student, the lecture of Course ${courseId} for lecture on ${date} has been canceled`
          };

          mailer.transporter.sendMail(mailOptions, function(err, info){
              /* istanbul ignore if */
              if(err){
                console.log(err);
            } else {
                console.log('Email sent: ' + info.response);
            }
          });
        }
        res.status(204).json({lecture: "canceled"});
      })
      .catch(/* istanbul ignore next */(err) => {
        res.status(500).json(err);
      })
 })

/**
 * PUT /api/lectures
 *
 * Change a lecture from "presence" to "distance"
 * 
 * body parameters: {"courseId": C4567, "date": "2020-12-22 09:00:00"}
 * */

app.put('/api/lectures', (req, res) => {
    const courseId = req.body.courseId;

    if(moment().isAfter(moment(req.body.date).subtract('30', 'minutes'))){
        return res.status(422).json(
            {error: "Cannot modify type of lecture after 30 minutes before scheduled time"});
    }

    teacherDao.changeTypeOfLecture(courseId, req.body.date)
        .then((response) => {
            res.status(200).json({response: response});
        })
        .catch(/* istanbul ignore next */err => {
            res.status(500).json(err);
        })

})


/**
 * GET /api/courseStats/:courseId
 * 
 * Retrieves overall stats for every course for a given teacher
 *
 * body response: overall courses stats (to be defined)
 */

app.get('/api/courseStats/:courseId', (req, res) => {
    const courseId = req.params.courseId;
    teacherDao.getCourseStats(courseId)
        .then((response) => {
            res.status(200).json(response);
        })
        .catch(/* istanbul ignore next */(err) => {
            res.status(500).json(err);
        })

})

/**
 * GET /api/historicalStats/:courseId
 * 
 * Retrieves stats of the courses of a given teacher grouped by week (and course)
 *
 *  body response: stats grouped by week. Format to be defined
 */

app.get('/api/monthStats/:courseId', (req, res) => {
    const courseId = req.params.courseId;
    teacherDao.getMonthStats(courseId)
        .then((response) => {
            res.status(200).json(response);
        })
        .catch(/* istanbul ignore next */(err) => {
            res.status(500).json(err);
        })
})

/**
 * GET /api/historicalStats/:courseId
 * 
 * Retrieves stats of the courses of a given teacher grouped by week (and course)
 *
 *  body response: stats grouped by week. Format to be defined
 */

app.get('/api/weekStats/:courseId', (req, res) => {
    const courseId = req.params.courseId;
    teacherDao.getWeekStats(courseId)
        .then((response) => {
            res.status(200).json(response);
        })
        .catch(/* istanbul ignore next */(err) => {
            res.status(500).json(err);
        })
})

/////////////////////////////////
/// BOOKING MANAGER ENDPOINTS ///
/////////////////////////////////

/**
 * GET /api/courses/all
 *
 * Retrieves all University Courses in order to be managed by Booking Manager
 *
 * No params needed
 */

app.get('/api/courses/all', (req, res) => {
    bookingManagerDao.getCourses()
        .then((courses) => {
            res.status(200).json(courses);
        })
        .catch(/* istanbul ignore next */(err) => {
            res.status(500).json(err);
        })
})

/**
 * GET /api/managerCourses/:courseId
 *
 * Retrieves stats of a given course of the University
 *
 * Request param: courseId
 */

app.get('/api/managerCourses/:courseId', (req, res) => {
    const courseId = req.params.courseId;
    bookingManagerDao.getManagerCourseStats(courseId)
        .then((list) => {
            res.status(200).json(list);
        })
        .catch(/* istanbul ignore next */(err) => {
            res.status(500).json(err);
        })
})

/**
 * GET /api/managerCoursesTotal/:courseId
 *
 * Retrieves stats of all courses of the University, grouped by courses
 *
 * Request params: courseId
 */

app.get('/api/managerCoursesTotal/:courseId', (req, res) => {
    const courseId = req.params.courseId;
    bookingManagerDao.getManagerCourseStatsTotal(courseId)
        .then((stats) => {
            res.status(200).json(stats);
        })
        .catch(/* istanbul ignore next */(err) => {
            res.status(500).json(err);
        })
})

/**
 * POST api/uploadStudents
 *
 * Uploads list of students
 *
 * body request: [{"userId": "900000", "name": "Ambra", "surname":"Ferri", "city": "Poggio Ferro", "email":	"s900000@students.politu.it",
 *                "birthday": "1991-11-04", "ssn": "MK97060783"}, ...]
 */

app.post('/api/uploadStudents', (req, res) => {

    supportOfficerDao.uploadStudents(req.body.data, req.body.fileName)
        .then((response) => {
            res.status(200).json({"inserted": response});
        })
        .catch(/* istanbul ignore next */(err) => {
            res.status(500).json(err);
        })
});

/**
 * POST api/uploadTeachers
 *
 * Uploads list of teachers
 *
 * body request: [{"userId": "d9000", "name": "Ines", "surname":"Beneventi", "email":"Ines.Beneventi@politu.it"
 *                "ssn": "XT6141393"}, ...]
 */

app.post('/api/uploadTeachers', (req, res) => {

    supportOfficerDao.uploadTeachers(req.body.data, req.body.fileName)
        .then((response) => {
            res.status(200).json({"inserted": response});
        })
        .catch(/* istanbul ignore next */(err) => {
            res.status(500).json(err);
        })
});

/**
 * POST api/uploadCourses
 *
 * Uploads list of courses
 *
 * body request: [{"courseId", "XY1211", "year": 1, "name": "Metodi di finanziamento delle imprese", "semester": 1, "teacherId": "d9000"}]
 */

app.post('/api/uploadCourses', (req, res) => {

    supportOfficerDao.uploadCourses(req.body.data, req.body.fileName)
        .then((response) => {
            res.status(200).json({"inserted": response});
        })
        .catch(/* istanbul ignore next */(err) => {
            res.status(500).json(err);
        })
});

/**
 * POST api/uploadEnrollment
 *
 * Uploads list of enrollments
 *
 * body request: [{"courseId":"XY1211", "studentId": "900000"}, ...]
 */

app.post('/api/uploadEnrollment', (req, res) => {

    supportOfficerDao.uploadEnrollment(req.body.data, req.body.fileName)
        .then((response) => {
            res.status(200).json({"inserted": response});
        })
        .catch(/* istanbul ignore next */(err) => {
            res.status(500).json(err);
        })
});

/**
 * POST api/uploadSchedule
 *
 * Uploads list of schedule
 *
 * body request: [{"courseId": "XY1211","room": 1, "day": "Mon", "seats": 120, "time": "8:30-11:30"}, ...]
 */

app.post('/api/uploadSchedule', (req, res) => {

    supportOfficerDao.uploadSchedule(req.body.data, req.body.fileName)
        .then((response) => {
            res.status(200).json({"inserted": response});
        })
        .catch(/* istanbul ignore next */(err) => {
            res.status(500).json(err);
        })
});

/**
 * GET /api/managerCoursesTotal/:courseId
 *
 * Retrieves stats of all courses of the University, grouped by courses
 *
 * Request params: courseId
 */

app.get('/api/fileData', (req, res) => {
  supportOfficerDao.getFileData()
      .then((response) => {
          res.status(200).json(response);
      })
      .catch(/* istanbul ignore next */(err) => {
          res.status(500).json(err);
      })
})

/**
 * POST api/uploadSchedule
 *
 * Uploads list of schedule
 *
 * body request: [{"courseId": "XY1211","room": 1, "day": "Mon", "seats": 120, "time": "8:30-11:30"}, ...]
 */
/* istanbul ignore next */
app.post('/api/fileData', (req, res) => {

  supportOfficerDao.updateFileData(req.body)
      .then((response) => {
          res.status(200).json({"uploaded": response});
      })
      .catch(/* istanbul ignore next */(err) => {
          res.status(500).json(err);
      })
});

////////////////////////
// STORY 12 ENDPOINTS //
////////////////////////

/**
 * GET /api/users/:userSsn
 *
 * Retrieves list of positive users or a single
 *
 * Request params: user
 *
 * IMPORTANT: pass "positiveusers" as parameter if you need list of positive users otherwise insert SSN of user
 */

app.get('/api/users/:userSsn', (req, res) => {
    const param = req.params.userSsn
    if(param === "positiveUsers"){
        bookingManagerDao.getPositiveUsers()
            .then((list) => {
                res.status(201).json(list)
            })
            .catch(/* istanbul ignore next */(err) => {
                res.status(500).json(err)
            })
    } else {
        bookingManagerDao.searchUserBySsn(param)
            .then((user) => {
                res.status(201).json(user)
            })
            .catch(/* istanbul ignore next */(err) => {
                res.status(500).json(err)
            })
    }
})

/**
 * POST api/users/:userSsn
 *
 * Sets a user as positive to covid
 *
 * body request: nothing
 */

app.post('/api/users/:userSsn', (req, res) => {
    const ssn = req.params.userSsn

    bookingManagerDao.setPositiveUser(ssn)
        .then((response)=>{
            res.status(200).json({"setAsPositive": response})
        })
        .catch(/* istanbul ignore next */(err) => {
            res.status(500).json(err)
        })
});

/**
 * GET /api/reports/:userSsn
 *
 * Retrieves list of users that participated to the same lectures of a positive user
 *
 * Needed to create a report
 *
 * Request params: userSsn
 */

app.get('/api/reports/:userSsn', (req, res) => {
    const param = req.params.userSsn

    bookingManagerDao.generateReport(param)
        .then((list) => {
            res.status(201).json(list)
        })
        .catch((err) => {
            res.status(500).json(err)
        })
})

//// STORY 17

/**
 * GET /api/coursesData
 *
 * Retrieves all University Courses and related data in order to be managed by Support Officer
 *
 * No params needed
 */

app.get('/api/coursesData', (req, res) => {
  supportOfficerDao.getCoursesData()
      .then((courses) => {
          res.status(200).json(courses);
      })
      .catch(/* istanbul ignore next */(err) => {
          res.status(500).json(err);
      })
})

/**
 * POST api/lecturesBookable
 *
 * Change the bookability of a course/year
 *
 * body request: [{"courseId": "C4567","restriction": 0}, ...]
 */

app.post('/api/lecturesBookable', (req, res) => {
  supportOfficerDao.modifyBookableLectures(req.body) 
      .then((response) => {
          res.status(200).json({"modified": response});
      })
      .catch(/* istanbul ignore next */(err) => {
          res.status(500).json(err);
      })
});

/**
 * POST api/:courseId/:date/attendees
 *
 * Set the attendance of the students to a lecture
 *
 * body request: [{"studentId": "s267348"}, ...]
 */

app.post('/api/:courseId/:date/attendees', (req, res) => {
  const today = moment();
  const date = req.params.date;
  if(today.diff(moment(date), "day")<=1){
    teacherDao.setPresentStudents(req.params.courseId, date, req.body) 
        .then((response) => {
            res.status(200).json({"modified": response});
        })
        .catch(/* istanbul ignore next */(err) => {
          console.log(err);
            res.status(500).json(err);
        })
  }else res.status(500).json("Lecture date is out of modification range");
});

/**
 * GET api/teacherPastLectures
 *
 * Returns list of past lectures for a given teacher
 *
 * userId => userId
 */

app.get('/api/teacherPastLectures', (req, res) => {
  const user = req.user && req.user.user;
    teacherDao.getPastLecturesByTeacherId(user)
      .then((lectures) => {
        res.status(200).json(lectures);
      })
      .catch(/* istanbul ignore next */(err) => {
        console.log(err);
        res.status(500).json({errors: [{'msg': err}]});
      });
 });

/**
 * GET api/schedules
 *
 * Returns list of the schedules
 */

app.get('/api/schedules', (req, res) => {
    supportOfficerDao.getSchedule()
        .then((list) =>{
            res.status(200).json(list)
        })
        .catch(/* istanbul ignore next*/(err) => {
            res.status(500).json({errors: [{'msg': err}]});
        })
});

/**
 * PUT api/schedules
 *
 * Updates a schedule and associated lectures
 */

app.put('/api/schedules', (req, res) => {
    supportOfficerDao.updateSchedules(req.body)
        .then((response) =>{
            res.status(200).json(response)
        })
        .catch(/* istanbul ignore next*/(err) => {
            res.status(500).json({errors: [{'msg': err}]});
        })
});


/**
 * PUT api/user/tutorial
 *
 * Body request: {"userId": "s269422"}
 * Body response: {"response": true}
 * Updates tutorial field of a user
 * */

app.put('/api/user/tutorial', (req, res) => {
    const user = req.user && req.user.user;
    userDao.setTutorial(user)
        .then((value) =>{
            res.status(200).json({response: value})
        })
        .catch(/* istanbul ignore next*/(err) => {
            res.status(500).json({errors: [{'msg': err}]});
        })
});

//activate server
app.listen(port, () => console.log(`Server ready at port: ${port}`));
