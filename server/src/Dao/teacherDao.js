'use strict';
const db = require('../db');
const moment = require('moment');

/**
* Input: userID
* Output: List of courses of the teacher
* Description: Retrieve the list of courses in which the teacher is enrolled
*/

exports.getCoursesByTeacherId=function(userId){
    return new Promise((resolve, reject) => {
        const sql='SELECT CourseID, Name FROM Course WHERE Teacher_Ref = ?';
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

/**
 * Input: userID
 * Output: List of lectures (Course_ref, Name, Date)
 * Description: Retrieve the list of lectures from the courses in which the teacher is enrolled in
 */

exports.getLecturesByTeacherId=function(userId){
    return new Promise((resolve, reject) => {
        const date=moment().format('YYYY-MM-DD HH:mm:ss');
        const sql='SELECT Course_Ref, Name, Date, DateDeadline, EndDate, BookedSeats, Capacity, Type FROM  Lecture  WHERE Date > ? AND Course_Ref IN (' +
            'SELECT Course_Ref FROM Course WHERE Teacher_Ref=?)';
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

/**
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


/**
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

/**
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

/**
 * Input: Course_Ref, Date_Ref
 * Output: True or False
 * Description: Change the type of the selected lecture from "presence" to "distance"
 */

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

/**
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

/**
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


function getTeacherEmail(courseId){
    return new Promise((resolve, reject) => {
        const sql = 'SELECT Email FROM User WHERE UserType="t" AND userID IN (' +
            'SELECT User_Ref FROM Course WHERE Course_Ref=?)';
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


//////////////////////////////////
//////////////////////////////////
//////// STATS FUNCTIONS /////////
//////////////////////////////////
//////////////////////////////////


/**
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

/**
 * Input: CourseID
 * Output: List of weeks and associated datas
 * Descrtiption: Retrieve a list of weeks for the course selected with the number of bookings
 */

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
                    .catch(/* istanbul ignore next */(err2) => {
                        reject(err2);
                    })
            }
        })
    })
}

/**
 * Input: First monday of the first month of the semester, Last monday of the last month of the semester
 * Output: List of weeks of the semester
 * Descrtiption: Retrieve a list of weeks for the selected semester
 */

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

/**
 * Input: CourseID, Semester
 * Output: List of weeks and associated average
 * Descrtiption: Retrieve a list of weeks for the course selected with the associated average
 */

function retrieveWeekStats(courseId, semester){
    let list = [];
    let startWeek;
    let endWeek;
    let thisDate = moment();
    let currentYear;
    let i = 0;

    if(thisDate.isAfter(moment(6, 'M')))
        currentYear = moment().year();
    /* istanbul ignore next */
    else
        currentYear =  moment().year() - 1;

    switch(semester){
        case 1:
            startWeek = moment([currentYear, 9, 1]).startOf('isoWeek');
            endWeek = moment([currentYear+1, 0, 31]).startOf('isoWeek');
            break;
        case 2:
            startWeek = moment([currentYear+1, 2, 1]).startOf('isoWeek');
            endWeek = moment([currentYear+1, 5, 30]).startOf('isoWeek');
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
                    let weekName = moment(startDate).format('MM/DD') + "-" + moment(endDate).format('MM/DD');
                    list.push({"weekName": weekName, "startDate": moment(startDate).format('YYYY/MM/DD'), "endDate": moment(endDate).format('YYYY/MM/DD'), "average": row.average});
                    i++;
                }
                if (i===n) resolve(list);
            });
        }

    })



}

/**
 * Input: CourseID
 * Output: List of months and associated data
 * Descrtiption: Retrieve a list of months for the course selected with the average number of bookings
 */

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
                    .catch(/* istanbul ignore next */(err2) => {
                        reject(err2);
                    })
            }
        })
    })
}

/**
 * Input: CourseID, Semester
 * Output: List of months and associated data
 * Descrtiption: Retrieve a list of months for the course selected with the associated average
 */

function retrieveMonthStats(courseId, semester){
    console.log(courseId, semester);
    let list = [];
    let months;
    let thisDate = moment();
    let currentYear;
    if(thisDate.isAfter(moment(6, 'M')))
        currentYear = moment().year();
    /* istanbul ignore next */
    else
        currentYear =  moment().year() - 1;

    switch(semester){
        case 1:
            months = [9, 10, 11, 0];
            break;
        case 2:
            months = [2, 3, 4, 5];
            currentYear = currentYear+1;
            break;
        /* istanbul ignore next */
        default:
            months = [];
            break;
    }
    let i = 0;
    const sql = 'SELECT AVG(BookedSeats) AS average FROM Lecture WHERE Course_Ref=? AND Date>=? AND Date<=? ORDER BY Date';
    return new Promise((resolve, reject) => {
        for(let month of months) {
            let monthYear;
            if(month === 0) monthYear = currentYear+=1;
            else monthYear = currentYear;
            let startDate = moment([monthYear, month, 1]);
            let tmp = moment([monthYear, month, 1]);
            let endDate = tmp.endOf('month');
            db.get(sql,[courseId, startDate.format('YYYY-MM-DD HH:mm:ss'),
                endDate.format('YYYY-MM-DD HH:mm:ss')], (err,row)=>{
                /* istanbul ignore if */
                if(err) reject(err);
                else {
                    let monthName = startDate.format('MMMM');
                    console.log(monthName+" "+monthYear);
                    list.push({"month": monthName, "year": monthYear, "average": row.average});
                    i++;
                }
                if (i===4) resolve(list);
            });
        }

    })



}
