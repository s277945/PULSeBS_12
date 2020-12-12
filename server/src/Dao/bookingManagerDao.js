'use strict';
const db = require('../db');

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
        const sql='SELECT Name, Surname, Birthday FROM User WHERE Covid=?';
        db.all(sql,[1], (err,rows)=>{
            /* istanbul ignore if */if(err) reject(err);
            else{
                rows.forEach((row)=>{
                    list.push({"name":row.Name, "surname":row.Surname, "birthday":row.Birthday});
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
                resolve({"name":row.Name, "surname":row.Surname, "birthday":row.Birthday, "ssn":row.SSN});
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