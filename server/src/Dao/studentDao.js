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

/**
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
* Description: Delete the booking from a lecture and update the avaiable seats of the lecture
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