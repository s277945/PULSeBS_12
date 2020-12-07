'use strict';
const db = require('../db');
const moment = require('moment');


/**
 * Input: userID
 * Output: List of lectures (Course_ref, Name, Date)
 * Description: Retrieve the list of lectures from the courses in which the user is enrolled in
 */

exports.getLecturesByUserId=function(userId){
    return new Promise((resolve, reject) => {
        const date=moment().format('YYYY-MM-DD HH:mm:ss');
        const sql='SELECT Course_Ref, Name, Date, DateDeadline, EndDate, BookedSeats, Capacity, Type FROM  Lecture  WHERE Date > ? AND Course_Ref IN (' +
            'SELECT Course_Ref FROM Enrollment WHERE User_Ref=?)';
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
* Input: userID
* Output: List of courses of the user
* Description: Retrieve the list of courses in which the user is enrolled
*/

exports.getCoursesByUserId=function(userId){
    return new Promise((resolve, reject) => {
        const sql='SELECT CourseID, Name FROM Course WHERE CourseID IN ('+
            'SELECT Course_Ref FROM Enrollment WHERE User_Ref=?)';
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
