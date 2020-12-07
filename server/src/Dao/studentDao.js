'use strict';

const db = require('../db');
const moment = require('moment');

/**
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
                                    else resolve("booked");
                                });
                            }

                        })
                    }
                    else{
                        addWaitingList(userId, courseId, date, endDate).then((check2)=>{
                            if(check2) resolve("waiting");
                            else reject(err);
                        }).catch(/* istanbul ignore next */err=>reject(err));
                    }
                }).catch(/* istanbul ignore next */err=>reject(err));
            }else reject(new Error("Course unavailable"));
        }).catch(/* istanbul ignore next */err=>reject(err));
    })
}

/**
 * Input: userID, CourseID
 * Output: True or False
 * Description: Check if the student is enrolled in the course specified on the lecture
 */

function findCourse(userId, courseId){
    return new Promise((resolve, reject) => {
        const sql='SELECT COUNT(*) FROM Enrollment WHERE User_Ref=? AND Course_Ref=?';
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

/**
* Input: Course_Ref, Date_Ref
* Output: Capacity
* Description: Get the max capacity and the current occupation of the selected lecture
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

/**
* Input: Course_Ref, Date_Ref
* Output: True or False
* Description: Add the student to the waiting list for that lecture
*/

function addWaitingList(userId, courseId, date, endDate){
    return new Promise((resolve, reject) => {
        let bookingDate = moment().format('YYYY-MM-DD HH:mm:ss');
        console.log(bookingDate);
        const sql='INSERT INTO WaitingList VALUES (?,?,?,?,?)';
        db.run(sql,[courseId, date, userId, endDate, bookingDate],(err) => {
            /* istanbul ignore if */
            if(err)
                reject(err);
            else resolve(true);
        })
    });
}

/**
* Input: Course_Ref, Date_Ref
* Output: True or False
* Description: Delete the booking from a lecture and update the avaiable seats of the lecture or pick the most recent student from 
* the waiting list and keep the BookedSeats number the same
*/

exports.deleteSeat=function(userId, courseId, date){
    return new Promise((resolve, reject) => {
        const sql='DELETE FROM Booking WHERE Student_Ref=? AND Course_Ref=? AND Date_Ref=?';
        db.run(sql, [userId, courseId, date], (err) => {
            /* istanbul ignore if */
            if(err)
                reject(err);
            else{
                controlWaitingList(courseId, date).then((check) => {
                    if(check > 0){
                        addFromWaitingList(courseId, date).then((user) => {
                            resolve(user);
                        }).catch(/* istanbul ignore next */err=>reject(err));
                    }else{
                        const sql2='UPDATE Lecture SET BookedSeats = BookedSeats - 1, UnbookedSeats = UnbookedSeats + 1 WHERE Course_Ref=? AND Date=?';
                        db.run(sql2, [courseId, date], (err2) => {
                        /* istanbul ignore if */
                            if(err2) reject(err2);
                            else resolve("NoUser");
                        });
                    }
                }).catch(/* istanbul ignore next */err=>reject(err));
            }
        })
    });
}

/**
* Input: Course_Ref, Date_Ref
* Output: Number of student in the waiting list for that lecture
* Description: Return the number of student for the selected lecture
*/

function controlWaitingList(courseId, date){
    return new Promise((resolve, reject) => {
        const sql='SELECT COUNT(*) FROM WaitingList WHERE Course_Ref=? AND Date_Ref=?';
        db.get(sql,[courseId, date],(err,row)=>{
            /* istanbul ignore if */
            if(err)
                reject(err);
            else {
                resolve(row['COUNT(*)']);
            }
        })
    });
}

/**
* Input: Course_Ref, Date_Ref
* Output: True or False
* Description: Pick the most recent booking from the waiting list for the lecture that received a cancel booking request
*/

function addFromWaitingList(courseId, date){
    return new Promise((resolve, reject) => {
        const sql='SELECT EndDate_Ref, Student_Ref FROM WaitingList WHERE DateBooking IN ('+
        'SELECT MIN(DateBooking) FROM WaitingList WHERE Course_Ref=? AND Date_Ref=?)';
        db.get(sql,[courseId, date],(err,row)=>{
            /* istanbul ignore if */
            if(err)
                reject(err);
            else {
                console.log("Student_Ref "+row.Student_Ref);
                const sql2='INSERT INTO Booking VALUES (?,?,?,?)';
                db.run(sql2, [courseId, date, row.Student_Ref, row.EndDate_Ref], (err2) => {
                    /* istanbul ignore if */
                    if(err2) reject(err2);
                    else {
                        const sql3='DELETE FROM WaitingList WHERE Course_Ref=? AND Date_Ref=? AND Student_Ref=?';
                        db.run(sql3, [courseId, date, row.Student_Ref], (err3) => {
                            /* istanbul ignore if */
                            if(err3) reject(err3);
                            else resolve(row.Student_Ref);                 
                        });
                    }
                });
            }
        })
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

exports.getLecturesWaitingByUserId=function(userId){
    return new Promise((resolve, reject) => {
        const sql='SELECT Course_Ref, Date_Ref, EndDate_Ref FROM WaitingList WHERE Student_ref = ?';
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