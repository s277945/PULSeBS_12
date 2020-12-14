'use strict';
const db = require('../db');
const moment = require('moment');

/**
 * Input:
 * Output: List of all the existent courses on the university
 * Descrtiption: Retrieve the list of all the courses present on the university for the booking manager
 */

exports.getCourses=function(){
    return new Promise((resolve, reject) => {
        const sql='SELECT CourseID, Name FROM Course';
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

/**
 * Input: Course_Ref
 * Output: List of lectures for the selected course
 * Descrtiption: Retrieve a list of lectures for the selected course with the associated data (booking/cancellation/attendance)
 */

exports.getManagerCourseStats = function (courseId){
    let list = [];
    let booking = 0;
    return new Promise((resolve, reject) => {
        const sql='SELECT Name, Date, BookedSeats, UnbookedSeats FROM Lecture WHERE Course_Ref=? AND Type="p"';
        db.all(sql,[courseId], (err,rows)=>{
            /* istanbul ignore if */if(err) reject(err);
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

/**
 * Input: Course_Ref
 * Output: Total values for a single course
 * Descrtiption: Retrieve the total number of booking/cancellation/attendance of the lectures for the selected course
 */

exports.getManagerCourseStatsTotal = function (courseId){
    let booking = 0;
    let attendance = 0;
    let cancellation = 0;
    return new Promise((resolve, reject) => {
        const sql='SELECT Name, Date, BookedSeats, UnbookedSeats FROM Lecture WHERE Course_Ref=? AND Type="p"';
        db.all(sql,[courseId], (err,rows)=>{
            /* istanbul ignore if */if(err) reject(err);
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

exports.getPositiveStudents = function(){
    let list = [];
    return new Promise((resolve, reject) => {
        const sql='SELECT Name, Surname, Birthday, SSN FROM User WHERE Covid=?';
        db.all(sql,[1], (err,rows)=>{
            /* istanbul ignore if */if(err) reject(err);
            else{
                rows.forEach((row)=>{
                    list.push({"name":row.Name, "surname":row.Surname, "birthday":row.Birthday,"ssn":row.SSN});
                });
                resolve(list);
            }
        })
    })
}

exports.searchStudentBySsn = function (ssn){
    return new Promise((resolve, reject) => {
        const sql='SELECT Name, Surname, Birthday, SSN FROM User WHERE SSN=?';
        db.get(sql, [ssn], (err,row)=>{
            /* istanbul ignore if */if(err) reject(err);
            else{
                if(row!=undefined)
                    resolve({"name":row.Name, "surname":row.Surname, "birthday":row.Birthday, "ssn":row.SSN});
                else
                    reject(new Error({err: "Nothing to show"}))
            }
        })
    })
}

exports.setPositiveStudent = function (ssn){
    return new Promise((resolve, reject) => {
        const sql='UPDATE User SET Covid = 1 WHERE SSN=?';
        db.run(sql, [ssn], (err) =>{
            /* istanbul ignore if */if(err) reject(err);
            else resolve(true);
        })
    })
}


exports.generateReport = function(ssn){
    let list = []
    return new Promise ((resolve, reject) => {
        getUserId(ssn)
            .then((userId) => {
                    retrieveLectures(userId)
                        .then((lectures) => {
                            if(lectures.length==0)
                                reject(new Error('Student was not in any class'))
                            const date = moment().format("YYYY-MM-DD HH:mm:ss")
                            const sql = 'SELECT Name, Surname, Birthday, SSN FROM User WHERE UserID != ? AND UserID IN ('+
                                'SELECT Student_Ref FROM Booking WHERE Course_Ref=? AND Date_Ref=? AND Date_Ref<?)'
                            let iterator = 0;
                            for(let lecture of lectures){
                                iterator++
                                db.all(sql, [userId, lecture.course, lecture.date, date], (err, rows) => {
                                    if(err)
                                        reject(err)
                                    else{
                                        rows.forEach((row) => {
                                            let obj = {
                                                "name": row.Name,
                                                "surname": row.Surname,
                                                "birthday": row.Birthday,
                                                "ssn": row.SSN
                                            }
                                            let cond = list.includes(obj)

                                            if(!cond)
                                                list.push(obj)
                                        })
                                    }
                                    if(iterator === lectures.length) resolve(list)
                                })

                            }
                        })

            }).catch(err=>reject(err))


    })
}

function retrieveLectures(studentId){
    let list = []
    return new Promise((resolve, reject) =>{
        const sql = 'SELECT Course_Ref, Date_Ref FROM Booking WHERE Student_Ref = ?'
        db.all(sql, [studentId], (err, rows) => {
            if(err)
                reject(err)
            else{
                rows.forEach((el) => {
                    list.push({"course": el.Course_Ref, "date": el.Date_Ref})
                })
                resolve(list)
            }

        })
    })
}

function getUserId(ssn){
    return new Promise((resolve, reject) =>{
        const sql = 'SELECT userID FROM User WHERE SSN = ?'
        db.get(sql, [ssn], (err, row) => {
            if(err)
                reject(err)
            else{
                if(row!=undefined)
                    resolve(row.userID)
                else
                    reject(new Error('Student not found'))
            }

        })
    })
}