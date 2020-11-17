'use strict';
const db = require('./db');
const bcrypt = require('bcrypt');
const moment = require('moment');

//check user data for login
exports.checkUserPwd = function (username, password) {
    return new Promise((resolve, reject) => {
        var sql = 'SELECT userID, Password FROM User WHERE userID = ?'; // sql query to select user entry from database

        db.get(sql, [username], (err, row) => {
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
                            .catch(err3 => {
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

exports.addSeat=function(userId, courseId, date){
    return new Promise((resolve, reject) => {
        findCourse(userId, courseId).then(res=>{
            if(res){
                getCapacity(courseId, date).then((capacity)=>{
                    countStudent(courseId, date).then(count=>{
                        if(count<capacity.Capacity){
                            const sql='INSERT INTO Booking VALUES(?,?,?)';
                            db.run(sql, [courseId, date, userId], function(err){
                                if(err){
                                    reject(err);
                                }
                                else{
                                    resolve(true);
                                }
                            })

                        }
                        else{
                            reject(new Error("0 seats available"));
                        }
                    }).catch(err=>reject(err));
                }).catch(err=>reject(err));
            }else reject(new Error("Course unavailable"));

        }).catch(err=>reject(err));

    })
}

/*
* Input: userID, CourseID 
* Output: True or False
* Description: Check if the student is enrolled in the course specified on the lecture
*/

function findCourse(userId, courseId){
    return new Promise((resolve, reject) => {
        const sql='SELECT COUNT(*) FROM Course WHERE User_Ref=? AND CourseID=?';
        db.get(sql,[userId,courseId],(err,row)=>{
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

function getCapacity(courseID,date){
    return new Promise((resolve, reject) => {
        const sql='SELECT Capacity FROM Lecture WHERE Course_Ref=? AND Date=?';
        db.get(sql,[courseID,date],(err,row)=>{
            if(err)
                reject(err);
            else{
    
                resolve(row);
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
            if(err)
                reject(err);
            else
                resolve(true);
        })
    });
};

/*
* Input: userID 
* Output: List of lectures (Course_ref, Name, Date)
* Description: Retrieve the list of lectures from the courses in which the user is enrolled in
*/

exports.getLecturesByUserId=function(userId){
    return new Promise((resolve, reject) => {
        const date=moment().format('YYYY-MM-DD HH:mm:ss');
        const sql='SELECT Course_Ref, Name, Date FROM  Lecture  WHERE DateDeadline > ? AND Course_Ref IN (' +
            'SELECT CourseID FROM Course WHERE User_Ref=?)';
        db.all(sql, [date, userId], (err,rows)=>{
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
        const sql='SELECT Course_Ref, Date_Ref FROM Booking WHERE Student_ref = ?';
        db.all(sql, [userId], (err,rows)=>{
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

exports.getNextLectureNumber=function(userId){
    
    return new Promise((resolve, reject) => {
        const date=moment().format('YYYY-MM-DD HH:mm:ss');
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

/*
* Input: Course_Ref, Date_Ref 
* Output: NumberOfStudents
* Description: Retrieve the number of students that booked a specific lecture
*/

function countStudent(courseId, date){
    return new Promise((resolve, reject) => {
        const sql='SELECT COUNT(*) FROM Booking WHERE Course_Ref=? AND Date_Ref=?';
        db.get(sql, [courseId, date], (err,row)=>{
            if(err)
                reject(err);
            else
                resolve(row['COUNT(*)']);
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
        const sql='SELECT Student_Ref FROM Booking WHERE Course_Ref=? AND Date_Ref=?';
        db.all(sql,[courseId,date],(err,rows)=>{

            if(err){
                reject(err);
            }
            else{
                rows.forEach((row)=>{ 
                    list.push(row.Student_Ref);
                });
                resolve(list);
            }
        });
    });
};

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
            if(err){
                reject(err);
            }
            else{
                for(let row of rows){
                    await countStudent(row.Course_Ref, row.Date).then(async(n) => {
                        await getTeacherEmail(row.Course_Ref).then((email) => {
                            list.push({"email":email, "nBooked": n, "nameLecture": row.Name, "dateLecture": row.Date, "Course_Ref": row.Course_Ref})
                        }).catch(err2 => reject(err2));
                    }).catch(err3 => reject(err3));
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
                        if(err)
                            reject(err);
                        else
                            resolve(emails);
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
};

/*
* Input: Course_Ref, Date_Ref 
* Output: True or False
* Description: Delete all the booking related to a lecture canceled.
*/

function deleteBookings(courseId, date){
    return new Promise((resolve, reject) => {
        const sql='DELETE FROM Booking WHERE Course_Ref = ? AND Date_Ref = ?';
        db.run(sql, [courseId, date], (err) => {
            if(err)
                reject(err);
            else resolve(true);
        })
    });
};

// EMAIL FUNCTIONS
/**
 * Retrieve email of a given student
 * @param {} userId 
 */

exports.getStudentEmail = function(userId){
    return new Promise((resolve, reject) => {
        const sql = 'SELECT Email FROM User WHERE userID=?';
        db.get(sql, [userId], (err, row)=> {
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
                'SELECT User_Ref FROM Course WHERE CourseID=?)';
        db.get(sql, [courseId], (err, row)=> {
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
            if(err) 
                reject(err);
            else 
                resolve(true);
        });
    })
}