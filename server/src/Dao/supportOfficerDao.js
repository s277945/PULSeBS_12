'use strict';
const db = require('../db');
const moment = require('moment');

//students, courses, teachers, lectures, and classes

exports.uploadStudents=function(list, fileName){

    let lenght;
    if(list!=undefined)
        lenght= list.length;
    /* istanbul ignore else */
    let i = 0;
    return new Promise((resolve, reject) => {
        const sql='INSERT INTO User(userID,Name,Surname,City,Email,Birthday,SSN,UserType) VALUES(?,?,?,?,?,?,?,?)';
        for(let element of list) {
            //console.log("list element student:"+JSON.stringify(element))
            db.run(sql, [element.userID, element.Name, element.Surname, element.City, element.email,
                element.birthday, element.ssn, "s"], (err) => {
                /* istanbul ignore if */
                if (err)
                    reject(err);
                else {
                    i++;
                    if (lenght === i) {
                        const date = moment().format("YYYY-MM-DD HH:mm:ss")
                        const sql2='UPDATE File SET FileName=? , LastUpdate=? WHERE FileType=0'
                        db.run(sql2, [fileName, date], (err1) => {
                            resolve(true);
                        })
                    }
                    /* istanbul ignore else */
                }
            })
        }
    });
}

exports.uploadTeachers=function(list, fileName){
    const lenght = list.length;
    let i = 0;
    const password = "$2a$10$Uoatm1KqMfPsesdIcOm8a.yTYzUQAvEkfhZNOIh.1BFt.hY4jv8yq"
    return new Promise((resolve, reject) => {
        const sql='INSERT INTO User(userID,Name,Surname,City,Email,Password,Birthday,SSN,UserType) VALUES(?,?,?,?,?,?,?,?,?)';
        for(let element of list) {
            db.run(sql, [element.userID, element.Name, element.Surname, "", element.email, password,
                "", element.ssn, "t"], (err) => {
                /* istanbul ignore if */
                if (err)
                    reject(err);
                else {
                    i++;
                    if (lenght === i) {
                        const date = moment().format("YYYY-MM-DD HH:mm:ss")
                        const sql2='UPDATE File SET FileName=? , LastUpdate=? WHERE FileType=1'
                        db.run(sql2, [fileName, date], (err1) => {
                            resolve(true);
                        })
                    }
                    /* istanbul ignore else */
                }
            })
        }
    });
}

exports.uploadCourses=function(list, fileName){
    const lenght = list.length;
    let i = 0;
    return new Promise((resolve, reject) => {
        const sql='INSERT INTO Course(CourseID, Year, Name, Semester, Teacher_Ref) VALUES(?,?,?,?,?)';
        for(let element of list) {
            db.run(sql, [element.courseId, element.year, element.name, element.semester, element.teacherId], (err) => {
                /* istanbul ignore if */
                if (err)
                    reject(err);
                else {
                    i++;
                    if (lenght === i) {
                        const date = moment().format("YYYY-MM-DD HH:mm:ss")
                        const sql2='UPDATE File SET FileName=? , LastUpdate=? WHERE FileType=2'
                        db.run(sql2, [fileName, date], (err1) => {
                            resolve(true);
                        })
                    }
                    /* istanbul ignore else */
                }
            })
        }
    });
}

exports.uploadEnrollment=function(list, fileName){
    const lenght = list.length;
    let i = 0;
    return new Promise((resolve, reject) => {
        const sql='INSERT INTO Enrollment(Course_Ref, Student_Ref) VALUES(?,?)';
        for(let element of list) {
            db.run(sql, [element.courseId, element.studentId], (err) => {
                /* istanbul ignore if */
                if (err)
                    reject(err);
                else {
                    i++;
                    if (lenght === i) {
                        const date = moment().format("YYYY-MM-DD HH:mm:ss")
                        const sql2='UPDATE File SET FileName=? , LastUpdate=? WHERE FileType=3'
                        db.run(sql2, [fileName, date], (err1) => {
                            resolve(true);
                        })
                    }
                    /* istanbul ignore else */
                }
            })
        }
    });
}

exports.uploadSchedule=function(list, fileName){
    let i = 0;
    return new Promise((resolve, reject) => {
        const sql='INSERT INTO Schedule(code, Room, Day, Seats, Time) VALUES(?,?,?,?,?)';
        for(let element of list) {
            db.run(sql, [element.courseId, element.room, element.day, element.seats, element.time], (err) => {
                /* istanbul ignore if */
                if (err)
                    reject(err);
                else {
                    getListLectures(element)
                        .then((listLectures) => {
                            for (let el of listLectures ){
                                let sql2 = 'INSERT INTO Lecture VALUES(?,?,?,?,?,?,?,?,?,?,?)';
                                db.run(sql2, [el.Course_Ref, el.Name, el.Capacity, el.Date, el.EndDate, el.DateDeadline,
                                    el.BookedSeats, el.UnbookedSeats, el.Type, el.EmailSent,0], (err2) => {
                                    /* istanbul ignore if */
                                    if(err2){
                                        console.log("fail");
                                        reject(err2)
                                    }

                                    else{
                                        i++
                                        if(i === listLectures.length) {
                                            const date = moment().format("YYYY-MM-DD HH:mm:ss")
                                            const sql3='UPDATE File SET FileName=? , LastUpdate=? WHERE FileType=4'
                                            db.run(sql3, [fileName, date], (err3) => {
                                                resolve(true);
                                            })
                                        }
                                    }
                                })
                            }
                        })
                        .catch(/* istanbul ignore next */(err2) => {
                            reject(err2);
                        })
                }
            })
        }
    });
}

function getListLectures(schedule){
    let list = []
    let dayMap = {
        "Mon": 0,
        "Tue": 1,
        "Wed": 2,
        "Thu": 3,
        "Fri": 4
    }
    return new Promise((resolve, reject) => {
        const sql = 'SELECT Name, Semester FROM Course WHERE CourseID=?'
        db.get(sql, [schedule.courseId], (err, row) => {
            if (!err) {
                let courseName = row.Name
                let semester = row.Semester
                let nDay = dayMap[schedule.day]
                let startDate
                let endDate
                let time = schedule.time.split("-")
                let thisDate = moment();
                let currentYear
                if (thisDate.isAfter(moment(6, 'M')))
                    currentYear = moment().year();
                /* istanbul ignore else */
                else {
                    currentYear = moment().year() - 1;
                }
                switch (semester){
                    case 1:
                        startDate = moment([currentYear, 9, 1]).startOf('isoWeek').add(nDay, 'day');
                        endDate = moment([currentYear+1, 0, 31]).startOf('isoWeek').add(nDay, 'day');

                        break;
                    /* istanbul ignore next */
                    case 2:
                        startDate = moment([currentYear + 1, 2, 1]).startOf('isoWeek').add(nDay, 'day');
                        endDate = moment([currentYear + 1, 5, 30]).startOf('isoWeek').add(nDay, 'day');
                        break;
                    /* istanbul ignore next */
                    default:
                        break;
                }

                let date = moment()
                let start = moment(startDate)
                let end = moment(endDate)
                let i = 0
                while(start.isBefore(end)){
                    if(time[0].length === 4)
                        time[0] = "0"+time[0]

                    let startLecture = start.format("YYYY-MM-DD").concat(" " + time[0] + ":00")
                    let deadline = moment(startLecture).subtract(1, 'day').format("YYYY-MM-DD").concat(" 23:00:00")
                    let endLecture = start.format("YYYY-MM-DD").concat(" " + time[1] + ":00")
                    i++;
                    console.log(i)
                    let mailsent;
                    if(start.isAfter(date)) mailsent=0;
                    else mailsent=1;


                    let obj = {
                            "Course_Ref": schedule.courseId,
                            "Name": courseName + " Les:" + i,
                            "Capacity": schedule.seats,
                            "Date": startLecture,
                            "EndDate": endLecture,
                            "DateDeadline": deadline,
                            "BookedSeats": 0,
                            "UnbookedSeats": 0,
                            "Type": "p",
                            "EmailSent": mailsent
                    }
                    //console.log(obj)
                    list.push(obj)

                    start.add(7, 'day')
                }

                resolve(list)
            }
            /* istanbul ignore else */
            else {
                reject(err)
            }
        })
    })

}

exports.getCoursesData=function(){
    let list = [];
    return new Promise((resolve, reject) => {
        const sql='SELECT CourseID, Year, Name, Semester, Restriction FROM Course';
        db.all(sql, [], (err, rows) => {
            /* istanbul ignore if */
            if (err)
                reject(err);
            else {
                for(let row of rows){
                    list.push({"courseId":row.CourseID, "year":row.Year, "name":row.Name, "semester":row.Semester, "restriction":row.Restriction});
                }
                resolve(list);
            }
        });
    });
}

exports.modifyBookableLectures=function(list){ 
    return new Promise((resolve, reject) => {
        const sql='UPDATE Course SET Restriction=? WHERE CourseID=?'
            for(let el of list){
                db.run(sql, [el.restriction, el.courseId], (err) => {
                    /* istanbul ignore if */if(err) reject(err);
                    else{
                        updateLectures(list).then(result =>{
                            resolve(result);
                        }).catch(/* istanbul ignore next */err1 => reject(err1));
                    }
                })
            }
    });
}

function updateLectures(list){
    let i = 0;
    let type;
    const date=moment().format('YYYY-MM-DD HH:mm:ss');
    return new Promise((resolve, reject) => {
        const sql='UPDATE Lecture SET Type=? WHERE Course_Ref=? AND Date > ?';
        for(let el of list){
            if(el.restriction===0)
                type = "p";
            else if(el.restriction===1)
                type = "d";
            /* istanbul ignore else */
            db.run(sql, [type, el.courseId, date], (err) => {
                /* istanbul ignore if */
                if (err)
                    reject(err);
                else {
                    i++;
                    if(i === list.length)
                        resolve(true);
                    /* istanbul ignore else */
                }
            });
        }
    });
}

exports.getFileData=function(){
    let list = []; 
    return new Promise((resolve, reject) => {
        const sql='SELECT FileType, FileName, LastUpdate FROM File'
        db.all(sql, [], (err, rows) => {
            /* istanbul ignore if */if(err) {console.log(err);reject(err);}
            else{
                for(let row of rows){
                    list.push({"fileType": row.FileType, "fileName": row.FileName, "lastUpdate": row.LastUpdate});
                }
                console.log(list);
                resolve(list);
            }
        }) 
    });
}