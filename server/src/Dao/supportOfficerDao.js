'use strict';
const db = require('../db');
const moment = require('moment');

//students, courses, teachers, lectures, and classes

exports.uploadStudent=function(userId, email, password, name, surname){
    return new Promise((resolve, reject) => {
        const sql='INSERT INTO User VALUES(?,?,?,?,?,?)';
        db.run(sql, [userId, email, password, name, surname, 's'], (err) => {
            /* istanbul ignore if */
            if(err)
                reject(err);
            else{
                resolve(true);
                }
        })
    });
}

exports.uploadCourse=function(courseId, name, semester){
    return new Promise((resolve, reject) => {
        const sql='INSERT INTO Course VALUES(?,?,?)';
        db.run(sql, [courseId, name, semester], (err) => {
            /* istanbul ignore if */
            if(err)
                reject(err);
            else{
                resolve(true);
                }
        })
    });
}

exports.uploadStudent=function(userId, email, password, name, surname){
    return new Promise((resolve, reject) => {
        const sql='INSERT INTO User VALUES(?,?,?,?,?,?)';
        db.run(sql, [userId, email, password, name, surname, 't'], (err) => {
            /* istanbul ignore if */
            if(err)
                reject(err);
            else{
                resolve(true);
                }
        })
    });
}


exports.uploadLecture=function(courseId, name, dateStart, dateEnd, dateDeadline, capacity){
    return new Promise((resolve, reject) => {
        const sql='INSERT INTO Lecture VALUES(?,?,?,?,?,?,?,?,?,?)';
        db.run(sql, [courseId, name, dateStart, dateEnd, dateDeadline, capacity, 0, 0, 'p', 0], (err) => {
            /* istanbul ignore if */
            if(err)
                reject(err);
            else{
                resolve(true);
                }
        })
    });
}