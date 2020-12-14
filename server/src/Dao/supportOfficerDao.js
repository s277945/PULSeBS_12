'use strict';
const db = require('../db');
const moment = require('moment');

//students, courses, teachers, lectures, and classes

exports.uploadStudents=function(list){
    const lenght = list.length;
    const password = "$2a$10$Uoatm1KqMfPsesdIcOm8a.yTYzUQAvEkfhZNOIh.1BFt.hY4jv8yq"
    let i = 0;
    return new Promise((resolve, reject) => {
        const sql='INSERT INTO User(userID,Name,Surname,City,Email,Password,Birthday,SSN,UserType) VALUES(?,?,?,?,?,?,?,?,?)';
        for(let element of list) {
            console.log("list element student:"+JSON.stringify(element))
            db.run(sql, [element.userID, element.Name, element.Surname, element.City, element.email, password,
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
        const sql='INSERT INTO User(userID,Name,Surname,City,Email,Password,Birthday,SSN,UserType) VALUES(?,?,?,?,?,?,?,?,?)';
        for(let element of list) {
            db.run(sql, [element.userID, element.Name, element.Surname, "", element.email, password,
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
    let i = 0;
    return new Promise((resolve, reject) => {
        const sql='INSERT INTO Schedule VALUES(?,?,?,?,?)';
        for(let element of list) {
            db.run(sql, [element.courseId, element.room, element.day, element.seats, element.time], (err) => {
                /* istanbul ignore if */
                if (err)
                    reject(err);
                else {
                    this.getListLectures(element)
                        .then((listLectures) => {
                            for (let el of listLectures ){
                                let sql2 = 'INSERT INTO Lecture VALUES(?,?,?,?,?,?,?,?,?,?)';
                                db.run(sql2, [el.Course_Ref, el.Name, el.Capacity, el.Date, el.EndDate, el.DateDeadline,
                                    el.BookedSeats, el.UnbookedSeats, el.Type, el.EmailSent], (err2) => {

                                    if(err2){
                                        console.log("fail");
                                        reject(err2)
                                    }

                                    else{
                                        i++
                                        if(i === listLectures.length) resolve(true);
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

exports.getListLectures=function (schedule){
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
                /* istanbul ignore next */
                else
                    currentYear = moment().year() - 1;

                switch (semester){
                    case 1:
                        startDate = moment([currentYear, 9, 1]).startOf('isoWeek').add(nDay, 'day');
                        endDate = moment([currentYear+1, 0, 31]).startOf('isoWeek').add(nDay, 'day');;
                        break;
                    case 2:
                        startDate = moment([currentYear + 1, 2, 1]).startOf('isoWeek').add(nDay, 'day');;
                        endDate = moment([currentYear + 1, 5, 30]).startOf('isoWeek').add(nDay, 'day');;
                        break;
                    /* istanbul ignore next */
                    default:
                        break;
                }

                let start = moment(startDate)
                let end = moment(endDate)
                let i = 0
                while(start.isBefore(end)){
                    i++
                    if(time[0].length === 4)
                        time[0] = "0"+time[0]

                    let startLecture = start.format("YYYY-MM-DD").concat(" " + time[0] + ":00")
                    let deadline = moment(startLecture).subtract(1, 'day').format("YYYY-MM-DD").concat(" 23:00:00")
                    let endLecture = start.format("YYYY-MM-DD").concat(" " + time[1] + ":00")

                    let obj = {
                            "Course_Ref": schedule.courseId,
                            "Name": courseName + "Les:" + i,
                            "Capacity": schedule.seats,
                            "Date": startLecture,
                            "EndDate": endLecture,
                            "DateDeadline": deadline,
                            "BookedSeats": 0,
                            "UnbookedSeats": 0,
                            "Type": "p",
                            "EmailSent": 0
                    }
                    list.push(obj)

                    start.add(7, 'day')
                }

                resolve(list)
            } else {
                reject(err)
            }
        })
    })

}

exports.getCoursesData=function(){
    let list = [];
    return new Promise((resolve, reject) => {
        const sql='SELECT CourseID, Year, Name, Semester FROM Course';
        db.all(sql, [], (err, rows) => {
            /* istanbul ignore if */
            if (err)
                reject(err);
            else {
                for(let row of rows){
                    list.push({"courseId":row.CourseID, "year":row.Year, "name":row.Name, "semester":row.Semester});
                }
                resolve(list);
            }
        });
    });
}

exports.modifyBookableLectures=function(list){
    let i = 0;
    const date=moment().format('YYYY-MM-DD HH:mm:ss'); 
    return new Promise((resolve, reject) => {
        console.log("QUI"+list);
        for(let el of list){
            console.log(el.courseId);
            let sql='UPDATE Lecture SET Type="d" WHERE Course_Ref=? AND Date > ?';
            db.run(sql, [el.courseId, date], (err) => {
                /* istanbul ignore if */
                if (err)
                    reject(err);
                else {
                    i++;
                    if(i === list.length)
                        resolve(true);
                }
            });
        }
    });
}