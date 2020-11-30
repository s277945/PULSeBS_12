'use strict';
const db = require('./db');
const bcrypt = require('bcrypt');
const moment = require('moment');

//check user data for login
exports.checkUserPwd = function (username, password) {
    return new Promise((resolve, reject) => {
        var sql = 'SELECT userID, Password FROM User WHERE userID = ?'; // sql query to select user entry from database

        db.get(sql, [username], (err, row) => {
            /* istanbul ignore if */
            if (err) reject(err); // error handling
            else if (typeof row === 'undefined') reject(new Error('User does not exist')); // no entry found
            else if (typeof row !== 'undefined') { // username found
                bcrypt.compare(password, row.Password, (err2,res) => { //check password hash

                    if (err2) reject(err2);
                    else if (!res) reject(new Error('Password is incorrect'));
                    else {
                        this.getRole(row.userID)
                            .then(row2 => {
                                resolve({userID: row.userID, userType: row2.UserType});
                            })
                            .catch(/* istanbul ignore next */err3 => {
                                reject(err3);
                            })

                    }
                })
            }

        });
    });
};

/*
* Input: Student_Ref, Course_Ref, Date_Ref
* Output: True or False
* Description: Book a seat for a lecture if possible
*/

exports.addSeat=function(userId, courseId, date, endDate){
    return new Promise((resolve, reject) => {
        findCourse(userId, courseId).then(res=>{
            if(res){
                controlCapacity(courseId, date).then((check)=>{
                    if(check){
                        const sql='INSERT INTO Booking VALUES(?,?,?,?)';
                        db.run(sql, [courseId, date, userId, endDate], function(err){
                            if(err) reject(err);
                            else{
                                const sql2 ='UPDATE Lecture SET BookedSeats=BookedSeats+1 WHERE Course_Ref=? AND Date=?'
                                db.run(sql2, [courseId, date], function(err2){
                                    /* istanbul ignore if */
                                    if(err2) reject(err2);
                                    else resolve(true);
                                });
                            }

                        })
                    }
                    else reject(new Error("0 seats available"));
                }).catch(/* istanbul ignore next */err=>reject(err));
            }else reject(new Error("Course unavailable"));
        }).catch(/* istanbul ignore next */err=>reject(err));
    })
}

/*
* Input: userID, CourseID
* Output: True or False
* Description: Check if the student is enrolled in the course specified on the lecture
*/

function findCourse(userId, courseId){
    return new Promise((resolve, reject) => {
        const sql='SELECT COUNT(*) FROM Presence WHERE User_Ref=? AND Course_Ref=?';
        db.get(sql,[userId,courseId],(err,row)=>{
            /* istanbul ignore if */
            if(err)
                reject(err);
            else if(row['COUNT(*)']>0)
                resolve(true);
            else resolve(false);
        })
    })
}

/*
* Input: Course_Ref, Date_Ref
* Output: Capacity
* Description: Get the max capacity of the selected lecture
*/

function controlCapacity(courseID,date){
    return new Promise((resolve, reject) => {
        const sql='SELECT Capacity, BookedSeats FROM Lecture WHERE Course_Ref=? AND Date=?';
        db.get(sql,[courseID,date],(err,row)=>{
            /* istanbul ignore if */
            if(err)
                reject(err);
            else{
                if(row.Capacity > row.BookedSeats) resolve(true);
                else resolve(false);
            }

        })
    });
}

/*
* Input: Course_Ref, Date_Ref
* Output: True or False
* Description: Delete the booking from a lecture
*/

exports.deleteSeat=function(userId, courseId, date){
    return new Promise((resolve, reject) => {
        const sql='DELETE FROM Booking WHERE Student_Ref=? AND Course_Ref=?AND Date_Ref=?';
        db.run(sql, [userId, courseId, date], (err) => {
            /* istanbul ignore if */
            if(err)
                reject(err);
            else{
                const sql2='UPDATE Lecture SET BookedSeats = BookedSeats - 1, UnbookedSeats = UnbookedSeats + 1 WHERE Course_Ref=? AND Date=?';
                db.run(sql2, [courseId, date], (err2) => {
                    /* istanbul ignore if */
                    if(err2) reject(err2);
                    else{
                        resolve(true);
                    }
                });
            }
        })
    });
}

/*
* Input: userID
* Output: List of lectures (Course_ref, Name, Date)
* Description: Retrieve the list of lectures from the courses in which the user is enrolled in
*/

exports.getLecturesByUserId=function(userId){
    return new Promise((resolve, reject) => {
        const date=moment().format('YYYY-MM-DD HH:mm:ss');
        const sql='SELECT Course_Ref, Name, Date FROM  Lecture  WHERE DateDeadline > ? AND Type = "p" AND Course_Ref IN (' +
            'SELECT Course_Ref FROM Presence WHERE User_Ref=?)';
        db.all(sql, [date, userId], (err,rows)=>{
            /* istanbul ignore if */
            if(err){
                reject(err);
            }
            else{
                resolve(rows);
            }
        });
    });
}

/*
* Input: userID
* Output: List of lectures booked
* Description: Retrieve the list of lectures already booked from a student
*/

exports.getLecturesBookedByUserId=function(userId){
    return new Promise((resolve, reject) => {
        const sql='SELECT Course_Ref, Date_Ref, EndDate FROM Booking WHERE Student_ref = ?';
        db.all(sql, [userId], (err,rows)=>{
            /* istanbul ignore if */
            if(err){
                reject(err);
            }
            else{
                resolve(rows);
            }
        });
    });
}

/*
* Input: userID
* Output: List of courses of the user
* Description: Retrieve the list of courses in which the user is enrolled
*/

exports.getCoursesByUserId=function(userId){
    return new Promise((resolve, reject) => {
        const sql='SELECT Name FROM Course WHERE CourseID IN ('+
            'SELECT Course_Ref FROM Presence WHERE User_Ref=?)';
        db.all(sql, [userId], (err,rows)=>{
            /* istanbul ignore if */
            if(err){
                reject(err);
            }
            else{
                resolve(rows);
            }
        });
    });
}

/*
* Input: userID (Teacher)
* Output: Name, NumberOfStudents
* Description: Get the number of students enrolled in the next lecture of one teacher
*/
/* CANCELLABILE
exports.getNextLectureNumber=function(userId){

    return new Promise((resolve, reject) => {
        const date=moment().format ;
        const sql='SELECT Course_Ref, Name, MIN(Date) AS minDate FROM Lecture WHERE Date > ? AND Course_Ref IN (' +
            'SELECT CourseID FROM Course WHERE User_Ref=?)';
        db.get(sql, [date, userId], async (err,row) =>{
            if(err){
                reject(err);
            }
            else{
                await countStudent(row.Course_Ref, row.minDate).then(number =>{

                        resolve({"lectureName": row.Name, "numberOfStudents": number});
                }).catch(err2 => reject(err2));
            }
        });
    });
}
*/

/*
* Input: Course_Ref, Date_Ref
* Output: NumberOfStudents
* Description: Retrieve the number of students that booked a specific lecture
*/

function countStudent(courseId, date){
    return new Promise((resolve, reject) => {
        const sql='SELECT BookedSeats FROM Lecture WHERE Course_Ref=? AND Date=?';
        db.get(sql, [courseId, date], (err,row)=>{
            /* istanbul ignore if */
            if(err)
                reject(err);
            else
                resolve(row.BookedSeats);
        })
    });
}

/*
* Input: userID
* Output: UserType of the user
* Description: Retrieve the role of a specific user
*/

exports.getRole=function(userId){
    return new Promise((resolve, reject) => {
        const sql='SELECT UserType FROM User WHERE userID=?'
        db.get(sql, [userId], (err, row)=>{
            /* istanbul ignore if */
            if(err)
                reject(err);
            else {

                resolve(row);
            }

        })
    })
}

/*
* Input: Course_Ref, Date
* Output: List of Student_Ref
* Description: Retrieve the list of students booked to the selected lecture
*/

exports.getStudentList=function(courseId, date){
    let list=[];
    return new Promise((resolve, reject) => {
        const sql='SELECT userID, Name, Surname FROM User WHERE userID IN ('+
            'SELECT Student_Ref FROM Booking WHERE Course_Ref=? AND Date_Ref=?)';
        db.all(sql,[courseId,date],(err,rows)=>{
            /* istanbul ignore if */
            if(err){
                reject(err);
            }
            else{
                rows.forEach((row)=>{
                    list.push({"userId":row.userID, "name":row.Name, "surname": row.Surname})
                });
                resolve(list);

            }
        });
    });
}

/*
* Input: dateDeadline
* Output: List of Course_Ref, Name, Date
* Description: Send automatically an email to the teacher when a constraint of the deadline is triggered
*/

exports.checkDeadline=function(dateD){
    let list = [];
    return new Promise((resolve, reject) => {
        const sql='SELECT Course_Ref, Name, Date FROM Lecture WHERE dateDeadline <=? AND emailSent=0';
        db.all(sql, [dateD], async (err,rows)=>{
            /* istanbul ignore if */
            if(err){
                reject(err);
            }
            else{
                for(let row of rows){

                    await countStudent(row.Course_Ref, row.Date).then(async(n) => {

                        await getTeacherEmail(row.Course_Ref).then((email) => {

                            list.push({"email":email, "nBooked": n, "nameLecture": row.Name, "dateLecture": row.Date, "Course_Ref": row.Course_Ref})
                        }).catch(/* istanbul ignore next */err2 => reject(err2));
                    }).catch(/* istanbul ignore next */err3 => reject(err3));
                }

                resolve(list);
            }
        });
    });
}

/*
* Input: Course_Ref, Date_Ref
* Output: True or False
* Description: Delete the lecture and the bookings
*/

exports.deleteLecture=function(courseId, date){
    return new Promise((resolve, reject) => {
        getStudentEmails(courseId, date).then(emails =>{
            deleteBookings(courseId, date).then(n =>{
                if(n){
                    const sql='DELETE FROM Lecture WHERE Course_Ref=? AND Date=?';
                    db.run(sql, [courseId, date], (err) => {

                        /* istanbul ignore if */
                        if(err)
                            reject(err);
                        else{

                            resolve(emails);}
                    });
                }
            });
        });
    });
};

/*
* Input: Course_Ref, Date_Ref
* Output: List of emails
* Description: Retrieve the list of emails of the students booked for the deleted lecture
*/

function getStudentEmails(courseId, date){
    let list = [];
    return new Promise((resolve, reject) => {
        const sql='SELECT Email FROM User WHERE userID IN ('+
            'SELECT Student_Ref FROM Booking WHERE Course_Ref=? AND Date_Ref=? )';
        db.all(sql, [courseId, date], (err, rows) => {
            /* istanbul ignore if */
            if(err)
                reject(err);
            else{
                for(let row of rows){

                    list.push(row.Email);
                }
                resolve(list);
            }
        })
    });
}

/*
* Input: Course_Ref, Date_Ref
* Output: True or False
* Description: Delete all the booking related to a lecture canceled.
*/

function deleteBookings(courseId, date){
    return new Promise((resolve, reject) => {
        const sql='DELETE FROM Booking WHERE Course_Ref = ? AND Date_Ref = ?';
        db.run(sql, [courseId, date], (err) => {
            /* istanbul ignore if */
            if(err)
                reject(err);
            else resolve(true);
        })
    });
}

/**
 * Function to update type of lecture
 *
 * Receives as parameters: courseId, date, type
 * */

exports.changeTypeOfLecture = function(courseId, date){

    return new Promise((resolve, reject)=>{
        const sql = 'UPDATE Lecture SET Type="d" WHERE Course_Ref=? AND Date=?';
        db.run(sql, [courseId, date], function (err) {
            /* istanbul ignore if */
            if(err)
                reject(err);
            else
                resolve(true);
        });
    })
}

/*
 * Input: Course_Ref
 * Output: List of lectures associated to the course selected
 * Descrtiption: Retrieve the data for the lectures of the course selected and the number of bookings
 */

exports.getCourseStats = function (courseId){
    let list = [];
    return new Promise((resolve, reject) => {
        const sql='SELECT Name, Date, BookedSeats FROM Lecture WHERE Course_Ref=? AND Type="p"';
        db.all(sql,[courseId], (err,rows)=>{
            /* istanbul ignore if */
            if(err) reject(err);
            else{
                rows.forEach((row)=>{
                    list.push({"lectureName":row.Name, "date":row.Date, "nBooked": row.BookedSeats})
                });
                resolve(list);
            }
        })
    })
}


exports.getWeekStats = function(courseId){
    return new Promise((resolve, reject) => {
        const sql = 'SELECT Semester FROM Course WHERE CourseID = ?';
        db.get(sql, [courseId], (err, row) => {
            /* istanbul ignore if */
            if(err) reject(err);
            else{
                retrieveWeekStats(courseId, row.Semester)
                    .then((list) => {
                        resolve(list);
                    })
                    .catch(/* istanbul ignore next */(err) => {
                        reject(err);
                    })
            }
        })
    })
}

function computeWeeks(startDate, endDate){
    let list = [];
    let end = moment(startDate);
    let start = moment(startDate);

    while(end.isBefore(moment(endDate))){
        end = moment(start).add(4, 'days');
        list.push({"startDate": start, "endDate": end});
        start = moment(start).add(7, 'days');
    }

    return list;
}

function retrieveWeekStats(courseId, semester){
    let list = [];
    let startWeek;
    let endWeek;
    let thisDate = moment();
    let currentYear;
    let i = 0;

    if(thisDate.isAfter(moment(6, 'M')))
        currentYear = moment().year();
    else currentYear =  moment().year() - 1;

    switch(semester){
        case 1:
            startWeek = moment([currentYear, 9, 1]).startOf('isoWeek');
            endWeek = moment([currentYear+1, 0, 31]).startOf('isoWeek');
            break;
        case 2:
            startWeek = moment([currentYear, 2, 1]).startOf('isoWeek');
            endWeek = moment([currentYear, 5, 31]).startOf('isoWeek');
            break;
        /* istanbul ignore next */
        default:
            break;
    }

    let weeks = computeWeeks(startWeek, endWeek);
    let n = weeks.length;

    const sql = 'SELECT AVG(BookedSeats) AS average FROM Lecture WHERE Course_Ref=? AND Date>=? AND Date<=?';
    return new Promise((resolve, reject) => {
        for(let week of weeks) {
            let startDate = moment(week["startDate"]).format('YYYY-MM-DD HH:mm:ss');
            let endDate = moment(week["endDate"]).add(1, 'days').format('YYYY-MM-DD HH:mm:ss');
            db.get(sql,[courseId, startDate, endDate], (err,row)=>{
                /* istanbul ignore if */
                if(err) reject(err);
                else {
                    let weekName = moment(startDate).format('DD/MM') + "-" + moment(endDate).format('DD/MM');
                    list.push({"weekName": weekName, "average": row.average});
                    i++;
                }
                if (i===n) resolve(list);
            });
        }

    })



}

/*
 * Input: Course_Ref, Date(start), Date(end)
 * Output: Average value of the information in the date range
 * Descrtiption: Function to retrieve the average for the course selected in the date range
 */

/*exports.getHistoricalStats = function (courseId, dateStart, dateEnd){
    return new Promise((resolve, reject) => {
        const sql='SELECT AVG(BookedSeats) AS average FROM Lecture WHERE Course_Ref=? AND Date>=? AND Date<=?'
        db.get(sql,[courseId, dateStart, dateEnd], (err,row)=>{
            if(err) reject(err);
            else{
                resolve(row.average);
            }
        })
    })
}*/

/**
 * Function to retrieve stats for the courses associated to a specific teacher grouped by month
 *
 * Receive as a parameter the userId
 * */

exports.getMonthStats = function (courseId){
    return new Promise((resolve, reject) => {
        const sql = 'SELECT Semester FROM Course WHERE CourseID = ?';
        db.get(sql, [courseId], (err, row) => {
            /* istanbul ignore if */
            if(err) reject(err);
            else{
                retrieveMonthStats(courseId, row.Semester)
                    .then((list) => {
                        resolve(list);
                    })
                    .catch(/* istanbul ignore next */(err) => {
                        reject(err);
                    })
            }
        })
        /*
        const sql='SELECT AVG(BookedSeats) AS average FROM Lecture WHERE Course_Ref=? AND Date>=? AND Date<=?'
        db.get(sql,[courseId, dateStart, dateEnd], (err,row)=>{
            if(err) reject(err);
            else{
                resolve(row.average);
            }
        })
        */
    })
}

function retrieveMonthStats(courseId, semester){
    let list = [];
    let months;
    let thisDate = moment();
    let currentYear;
    if(thisDate.isAfter(moment(6, 'M')))
        currentYear = moment().year();
    else currentYear =  moment().year() - 1;
    /* istanbul ignore default */
    switch(semester){
        case 1:
            months = [9, 10, 11, 0];
            break;
        case 2:
            months = [2, 3, 4, 5];
            break;
        /* istanbul ignore next */
        default:
            months = [];
            break;
    }
    console.log(months);
    let i = 0;
    const sql = 'SELECT AVG(BookedSeats) AS average FROM Lecture WHERE Course_Ref=? AND Date>=? AND Date<=?';
    return new Promise((resolve, reject) => {
        for(let month of months) {
            if(month === 0) currentYear+=1;
            let startDate = moment([currentYear, month, 1]);
            let tmp = moment([currentYear, month, 1]);
            let endDate = tmp.endOf('month');
            db.get(sql,[courseId, startDate.format('YYYY-MM-DD HH:mm:ss'),
                endDate.format('YYYY-MM-DD HH:mm:ss')], (err,row)=>{
                /* istanbul ignore if */
                if(err) reject(err);
                else {
                    let monthName = startDate.format('MMMM');
                    console.log(startDate);
                    list.push({"month": monthName, "average": row.average});
                    i++;
                }
                if (i===4) resolve(list);
            });
        }

    })



}

// EMAIL FUNCTIONS
/**
 * Retrieve email of a given student
 * @param {} userId
 */

exports.getStudentEmail = function(userId){
    return new Promise((resolve, reject) => {
        const sql = 'SELECT Email FROM User WHERE userID=?';
        db.get(sql, [userId], (err, row)=> {
            /* istanbul ignore if */
            if(err)
                reject(err);
            else
                resolve(row.Email);
        });
    })
}

function getTeacherEmail(courseId){
    return new Promise((resolve, reject) => {
        const sql = 'SELECT Email FROM User WHERE UserType="t" AND userID IN (' +
            'SELECT User_Ref FROM Presence WHERE Course_Ref=?)';
        db.get(sql, [courseId], (err, row)=> {
            /* istanbul ignore if */
            if(err)
                reject(err);
            else {
                resolve(row.Email);
            }
        });
    })
}



/**
 * Function to update Lecture table in order to not sent too many emails
 */
exports.emailSentUpdate = function(courseId, date){
    return new Promise((resolve, reject) => {
        const sql = 'UPDATE Lecture SET EmailSent=1 WHERE Course_Ref=? AND Date=?';
        db.run(sql, [courseId, date], function (err) {
            /* istanbul ignore if */
            if(err)
                reject(err);
            else
                resolve(true);
        });
    })
}

//Story 11 functions
exports.getCourses=function(){
    return new Promise((resolve, reject) => {
        const sql='SELECT Name FROM Course';
        db.all(sql, [], (err,rows)=>{
            /* istanbul ignore if */
            if(err){
                reject(err);
            }
            else{
                resolve(rows);
            }
        });
    });
}

exports.getManagerCourseStats = function (courseId){
    let list = [];
    let booking = 0;
    return new Promise((resolve, reject) => {
        const sql='SELECT Name, Date, BookedSeats, UnbookedSeats FROM Lecture WHERE Course_Ref=? AND Type="p"';
        db.all(sql,[courseId], (err,rows)=>{
            if(err) reject(err);
            else{
                rows.forEach((row)=>{
                    booking = row.BookedSeats+row.UnbookedSeats;
                    list.push({"lectureName":row.Name, "date":row.Date, "nBooked": booking,
                        "nAttendance": row.BookedSeats, "nCancellations":row.UnbookedSeats});
                });
                resolve(list);
            }
        })
    })
}

exports.getManagerCourseStatsTotal = function (courseId){
    let booking = 0;
    let attendance = 0;
    let cancellation = 0;
    return new Promise((resolve, reject) => {
        const sql='SELECT Name, Date, BookedSeats, UnbookedSeats FROM Lecture WHERE Course_Ref=? AND Type="p"';
        db.all(sql,[courseId], (err,rows)=>{
            if(err) reject(err);
            else{
                rows.forEach((row)=>{
                    booking += row.BookedSeats+row.UnbookedSeats;
                    attendance += row.BookedSeats;
                    cancellation += row.UnbookedSeats;
                });

                resolve({"courseName":courseId, "nBooked": booking,
                    "nAttendance": attendance, "nCancellations": cancellation});
            }
        })
    })
}
