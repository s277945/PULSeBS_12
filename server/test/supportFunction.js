const db = require('../src/db');

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
exports.updateCourseCapacity= function (id,date,capacity){
    return new Promise((resolve, reject) => {
        const sql='UPDATE Lecture SET Capacity=? WHERE Course_Ref=? AND Date=?';
        db.run(sql,[capacity,id,date],function (err){
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