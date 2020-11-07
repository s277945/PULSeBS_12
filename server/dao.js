'use strict';
const db = require('./db');
const bcrypt = require('bcryptjs');

//check user data for login
exports.checkUserPwd = function (username, password) {
    return new Promise((resolve, reject) => {
        var sql = 'SELECT userId, passwordHash FROM users WHERE userId = ?'; // sql query to select user entry from database
        console.log(username);
        console.log(password);
        db.get(sql, [username], (err, row) => {
            if (err) reject(err); // error handling
            else if (typeof row === 'undefined') reject(new Error('User does not exist')); // no entry found
            else if (typeof row !== 'undefined') { // username found
                bcrypt.compare(password, row.passwordHash, (err,res) => { //check password hash
                    console.log(res);
                    if (err) reject(err);
                    else if (!res) reject(new Error('Password is incorrect'));
                    else resolve(row.userId) // if password is correct return user id
                })
            }

        });
    });
};

exports.addSeat=function(userId, lectureId,date){
    return new Promise((resolve, reject) => {
        countBooking(lectureId,date).then((row)=>{
            if(row.Booked<row.Capacity){
                const sql='INSERT INTO Booking VALUES(?,?,?)';
                db.run(sql, [lectureId,date,userId], function(err){
                    if(err)
                        reject(err);
                    else
                        resolve(true);
                })
            }
            else{
                //waiting list
                reject(false);
            }

            }
            ).catch(err => reject(err));


});
}
function countBooking(lectureId,date){

    return new Promise((resolve, reject) => {
        const sql='SELECT COUNT(*) AS Booked, Capacity FROM Booking JOIN Lecture ON Booking.Course_Ref=Lecture.Course_Ref AND Booking.Date_Ref=Lecture.Date WHERE Course_Ref=? AND Date_Ref=?';
        db.get(sql, [lectureId,date], (err,row)=>{
            if(err)
                reject(err);
            else{

                resolve(row);
            }

        })
    })
}

exports.deleteSeat=function(userId, lectureId,date){
    return new Promise((resolve, reject) => {
        const sql='DELETE FROM Booking WHERE Student_Ref=? AND Course_Ref=?AND Date_Ref=?';
        db.run(sql, [userId, lectureId,date], function(err){
            if(err)
                reject(err);
            else
                resolve(true);
        })
    });
};

exports.getLecturesByStudentId=function(studentId){
    return new Promise((resolve, reject) => {
        const sql='SELECT Course_Ref, Name, Date FROM  Lecture  WHERE Date>datetime(now,localtime) AND Course_Ref IN (' +
            'SELECT CourseID FROM Course WHERE User_Ref=?)';
        db.all(sql, [studentId], async (err,rows)=>{
            if(err){
                reject(err);
            }
            else{

                resolve(rows);
            }
        });
    });
}

exports.countStudent=function(courseId, date){
    return new Promise((resolve, reject) => {
        const sql='SELECT COUNT(*) FROM Booking WHERE Course_Ref=? AND Date_Ref=?';
        db.get(sql, [courseId, date], (err,row)=>{
            if(err)
                reject(err);
            else
                resolve(row['COUNT(*)']);
        })
    });
};

exports.getStudentList=function(courseId, date){
    let list=[];
    return new Promise((resolve, reject) => {
        const sql='SELECT Student_Ref FROM Booking WHERE Course_Ref=? AND Date_Ref=?';
        db.all(sql,(err,rows)=>{
            if(err)
                reject(err);
            else{
                rows.forEach((row)=>{
                    list.push(row)
                });
                resolve(list);
            }
        });
    });
};
