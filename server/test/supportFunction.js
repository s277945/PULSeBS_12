const db = require('../src/db');
const csv=require('csvtojson')
const fs = require('fs');
const dao = require("../src/Dao/supportOfficerDao");
const moment = require('moment');

exports.getCourseCapacity= function(id,date){
    return new Promise((resolve, reject) => {
        const sql='SELECT Capacity FROM Lecture WHERE Course_Ref=? AND Date=?';
        db.get(sql,[id,date],(err,row)=>{
            if(err)
                reject(err)
            else
                resolve(row);
        })
    });
}
exports.updateCourseCapacity= function (id,date,capacity,seats){
    return new Promise((resolve, reject) => {
        const sql='UPDATE Lecture SET Capacity=? AND BookedSeats=? WHERE Course_Ref=? AND Date=?';
        db.run(sql,[capacity,seats,id,date],function (err){
            if(err)
                reject(err);
            else
                resolve(true);
        })
    });
}
exports.deleteFromWaiting= function (user,date,courseRef){
    return new Promise((resolve, reject) => {
        const sql='DELETE FROM WaitingList WHERE Course_Ref=? AND Date_Ref=? AND Student_Ref=?';
        db.run(sql, [courseRef,date,user],function(err){
            if(err)
                reject(err);
            else
                resolve(true);
        })
    })
}

exports.insertDeletedRow= function (Course_Ref,Name,Date,DateDeadline,Capacity){
    return new Promise(((resolve, reject) => {
        const sql='INSERT INTO Lecture(Course_Ref,Name,Date,DateDeadline,Capacity,Type) VALUES(?,?,?,?,?,?)';
        db.run(sql,[
            Course_Ref,Name,Date,DateDeadline,Capacity,'p'
        ],function(err){
            if(err)
                reject(err);
            else
                resolve(true);
        });
    }))
}
exports.restoreTypeLecture= function (Course_Ref,Date){
    return new Promise((resolve, reject) => {
        const sql='UPDATE Lecture SET Type="p" WHERE Course_Ref=? AND Date=?'
        db.run(sql,[Course_Ref,Date], function(err){
            if(err)
                reject(err);
            else
                resolve(true);
        })
    })
}

exports.readFromCsv=function (type){
    return new Promise((resolve, reject) => {
        let fileName="";
        switch(type){
            case "student":
                fileName="Students.csv"
                break;
            case "teacher":
                fileName="Professors.csv"
                break;
            case "course":
                fileName="Courses.csv"
                break;
            case "enrollment":
                fileName="Enrollment.csv"
                break;
            case "schedule":
                fileName="Schedule.csv"
                break;
            default:
                reject(err);
                break;
        }
        let list=[]
        const converter=csv()
            .fromFile(fileName, {headers : true})
            .on('data',(data)=>{
                console.log(data);
                list.push(data)
            })
            .on('end',()=>{
                resolve(list);
            })
    });


}
exports.deleteRowsStudent=function (list){
    let length=list.length;
    let i=0;
    return new Promise((resolve, reject) => {
        const sql='DELETE FROM User WHERE UserID=?'
        list.forEach(row=>{
            db.run(sql,[row.userID],function (err){
                if(err)
                    reject(err)
                else{
                    i++;
                    if(i==length)
                        resolve(true);
                }
            })
        })
    })
}
exports.deleteRowsTeacher=function (list){
    return new Promise((resolve, reject) => {
        let i=0;
        let length=list.length;
        const sql='DELETE FROM User WHERE UserID=?'
        list.forEach(row=>{
            db.run(sql,[row.userID],function (err){
                if(err)
                    reject(err)
                else{
                    i++;
                    if(i==length)
                        resolve(true);
                }
            })
        })
        resolve(true);
    })
}
exports.deleteRowsCourse=function (list){
    return new Promise((resolve, reject) => {
        let i=0;
        let length=list.length;
        const sql='DELETE FROM Course WHERE CourseID=? AND Year=?'
        list.forEach(row=>{
            db.run(sql,[row.courseId,row.year],function (err){
                if(err)
                    reject(err)
                else{
                    i++;
                    if(i==length)
                        resolve(true);
                }
            })
        })
        resolve(true);
    })
}
exports.deleteRowsEnrollment=function (list){
    return new Promise((resolve, reject) => {
        let i=0;
        let length=list.length;
        const sql='DELETE FROM Enrollment WHERE Course_Ref=? AND Student_Ref=?'
        list.forEach(row=>{
            db.run(sql,[row.courseId,row.studentId],function (err){
                if(err)
                    reject(err)
                else{
                    i++;
                    if(i==length)
                        resolve(true);
                }
            })
        })
        resolve(true);
    })
}
exports.deleteRowsSchedule=function (list){
    return new Promise((resolve, reject) => {
        let i=0;
        let sql='DELETE FROM Schedule WHERE Code=?'
        list.forEach(row=>{
            db.run(sql,[row.courseId],function (err){
                if(err)
                    reject(err)
                else{
                    dao.getListLectures(row)
                        .then(listLectures=>{
                            for(let el of listLectures){
                                let sql2='DELETE FROM Lecture WHERE Course_Ref=?AND Date=?'
                                db.run(sql2,[el.Course_Ref,el.Date],function (err){
                                    if(err)
                                        reject(err)
                                    else{
                                        i++;
                                        if(i==listLectures.length)
                                            resolve(true);
                                    }
                                })
                            }
                        })
                }
            })
        })
        resolve(true);
    })
}
exports.setNotPositive=function(userId){
    return new Promise((resolve, reject) => {
        const sql='UPDATE User SET Covid=0 WHERE userID=?';
        db.run(sql,[userId],function (err) {
            if(err)
                reject(err)
            else{
                resolve(true)
            }
        })
    })
}

exports.addWaitingList=function (userId, courseId, date, endDate){
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
exports.updateDateLecture=function(courseId,courseName,type){
    return new Promise(((resolve, reject) => {
        let startDate,endDate,deadline;
        if(type===0){
            startDate=moment().subtract('days',1).add('hours',1).format('YYYY-MM-DD HH:mm:ss');
            deadline=moment().subtract('days',2).format('YYYY-MM-DD HH:mm:ss');
            endDate=moment().subtract('days',1).add('hours',4).format('YYYY-MM-DD HH:mm:ss');
        }
        else{
            startDate=moment().add('days',5).add('hours',1).format('YYYY-MM-DD HH:mm:ss');
            deadline=moment().add('days',4).format('YYYY-MM-DD HH:mm:ss');
            endDate=moment().add('days',5).add('hours',4).format('YYYY-MM-DD HH:mm:ss');
        }
        const sql='UPDATE Lecture SET Date=?,EndDate=?,DateDeadline=? WHERE Course_Ref=? AND Name=?';
        db.run(sql,[startDate,endDate,deadline,courseId,courseName],(err)=>{
            if(err)
                reject(err);
            else
                resolve(startDate);
        })
    }))
}