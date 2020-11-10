'use strict';
const db = require('./db');
const bcrypt = require('bcrypt');

//check user data for login
exports.checkUserPwd = function (username, password) {
    return new Promise((resolve, reject) => {
        var sql = 'SELECT userID, Password FROM User WHERE userID = ?'; // sql query to select user entry from database
        console.log(username);
        console.log(password);
        db.get(sql, [username], (err, row) => {
            if (err) reject(err); // error handling
            else if (typeof row === 'undefined') reject(new Error('User does not exist')); // no entry found
            else if (typeof row !== 'undefined') { // username found
                bcrypt.compare(password, row.Password, (err,res) => { //check password hash
                    console.log(res);
                    if (err) reject(err);
                    else if (!res) reject(new Error('Password is incorrect'));
                    else {
                        this.getRole(row.userID)
                            .then(row2 => {
                                resolve({userID: row.userID, userType: row2.UserType});
                            })
                            .catch(err2 => {
                                reject(err2);
                            })

                    }
                })
            }

        });
    });
};

exports.addSeat=function(userId, lectureId,date){
    return new Promise((resolve, reject) => {
        findCourse(userId,lectureId).then(res=>{
            console.log(res);
            if(res){
                getCapacity(lectureId,date).then((capacity)=>{
                    this.countStudent(lectureId,date).then(count=>{
                        if(count<capacity.Capacity){
                            const sql='INSERT INTO Booking VALUES(?,?,?)';
                            db.run(sql, [lectureId,date,userId], function(err){
                                if(err){
                                    reject(err);
                                }
                                else{
                                    resolve(true);
                                }
                            })

                        }
                        else{
                            reject([{"error": "0 seats available"}]);
                        }
                    }).catch(err=>reject(err));
                }).catch(err=>reject(err));
            }else reject([{"error": "Course unavailable"}]);

        }).catch(err=>reject(err));

    })
}

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

function getCapacity(courseID,date){
    return new Promise((resolve, reject) => {
        const sql='SELECT Capacity FROM Lecture WHERE Course_Ref=? AND Date=?';
        db.get(sql,[courseID,date],(err,row)=>{
            if(err)
                reject(err);
            else{
                //console.log(row);
                resolve(row);
            }

        })
    });
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

exports.getLecturesByUserId=function(userId){
    return new Promise((resolve, reject) => {
        const sql='SELECT Course_Ref, Name, Date FROM  Lecture  WHERE Course_Ref IN (' +
            'SELECT CourseID FROM Course WHERE User_Ref=?)';
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

exports.getRole=function(userId){
    return new Promise((resolve, reject) => {
        const sql='SELECT UserType FROM User WHERE userID=?'
        db.get(sql, [userId], (err, row)=>{
            if(err)
                reject(err);
            else {
                console.log(row);
                resolve(row);
            }

        })
    })
}

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
