'use strict';
const db = require('../db');
const moment = require('moment');

//students, courses, teachers, lectures, and classes

exports.uploadStudents=function(list){
    const lenght = list.length;
    const password = "$2a$10$Uoatm1KqMfPsesdIcOm8a.yTYzUQAvEkfhZNOIh.1BFt.hY4jv8yq"
    let i = 0;
    return new Promise((resolve, reject) => {
        const sql='INSERT INTO User VALUES(?,?,?,?,?,?,?,?,?)';
        for(let element of list) {
            db.run(sql, [element.userId, element.name, element.surname, element.city, element.email, password,
                element.birthday, element.ssn, "s"], (err) => {
                /* istanbul ignore if */
                if (err)
                    reject(err);
                else {
                    i++;
                    if (lenght === i) resolve(true);
                }
            })
        }
    });
}

exports.uploadTeachers=function(list){
    const lenght = list.length;
    let i = 0;
    const password = "$2a$10$Uoatm1KqMfPsesdIcOm8a.yTYzUQAvEkfhZNOIh.1BFt.hY4jv8yq"
    return new Promise((resolve, reject) => {
        const sql='INSERT INTO User VALUES(?,?,?,?,?,?,?,?,?)';
        for(let element of list) {
            db.run(sql, [element.userId, element.name, element.surname, "", element.email, password,
                "", element.ssn, "t"], (err) => {
                /* istanbul ignore if */
                if (err)
                    reject(err);
                else {
                    i++;
                    if (lenght === i) resolve(true);
                }
            })
        }
    });
}

exports.uploadCourses=function(list){
    const lenght = list.length;
    let i = 0;
    return new Promise((resolve, reject) => {
        const sql='INSERT INTO Course VALUES(?,?,?,?,?)';
        for(let element of list) {
            db.run(sql, [element.courseId, element.year, element.name, element.semester, element.teacherId], (err) => {
                /* istanbul ignore if */
                if (err)
                    reject(err);
                else {
                    i++;
                    if (lenght === i) resolve(true);
                }
            })
        }
    });
}


exports.uploadEnrollment=function(list){
    const lenght = list.length;
    let i = 0;
    return new Promise((resolve, reject) => {
        const sql='INSERT INTO Enrollment VALUES(?,?)';
        for(let element of list) {
            db.run(sql, [element.courseId, element.studentId], (err) => {
                /* istanbul ignore if */
                if (err)
                    reject(err);
                else {
                    i++;
                    if (lenght === i) resolve(true);
                }
            })
        }
    });
}

exports.uploadSchedule=function(list){
    const lenght = list.length;
    let i = 0;
    return new Promise((resolve, reject) => {
        const sql='INSERT INTO Schedule VALUES(?,?,?,?,?)';
        for(let element of list) {
            db.run(sql, [element.courseId, element.room, element.day, element.seats, element.time], (err) => {
                /* istanbul ignore if */
                if (err)
                    reject(err);
                else {
                    i++;
                    if (lenght === i) resolve(true);
                }
            })
        }
    });
}
