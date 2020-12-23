'use strict';
const db = require('../db');
const moment = require('moment');
const mailer = require('../mailer');
//////////////////////////////////////////////////
//////////////////////STORY12/////////////////////
//////////////////////////////////////////////////

/**
* Input: List of students, Filename
* Output: True or False
* Description: Get the list of students to insert into the db
*/

exports.uploadStudents=function(list, fileName){

    let lenght;
    /* istanbul ignore else */
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
                    /* istanbul ignore else */
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

/**
* Input: List of teachers, Filename
* Output: True or False
* Description: Get the list of teachers to insert into the db
*/

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
                    /* istanbul ignore else */
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

/**
* Input: List of students, Filename
* Output: True or False
* Description: Get the list of courses to insert into the db
*/

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
                    /* istanbul ignore else */
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

/**
* Input: List of students, Filename
* Output: True or False
* Description: Get the list of enrollments to insert into the db
*/

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
                    /* istanbul ignore else */
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
                                let sql2 = 'INSERT INTO Lecture VALUES(?,?,?,?,?,?,?,?,?,?,?,?)';
                                db.run(sql2, [el.Course_Ref, el.Name, el.Capacity, el.Date, el.EndDate, el.DateDeadline,
                                    el.BookedSeats, el.UnbookedSeats, el.Type, el.EmailSent,0, el.Day], (err2) => {
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
            /* istanbul ignore else */
            if (!err) {
                let courseName = row.Name
                let semester = row.Semester
                let nDay = dayMap[schedule.day]
                let startDate
                let endDate
                let time = schedule.time.split("-")
                let thisDate = moment();
                let currentYear
                /* istanbul ignore else */
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
                            "EmailSent": mailsent,
                            "Day": schedule.day
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

/**
* Input: //
* Output: FileType, FileName, LastUpdate
* Description: Get the data of the selected file
*/

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

//////////////////////////////////////////////////
//////////////////////STORY17/////////////////////
//////////////////////////////////////////////////

/**
* Input: //
* Output: CourseID, Year, Name, Semestern Restriction
* Description: Get all the courses with all the data about them
*/

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

/**
* Input: List of courses
* Output: True or False
* Description: Change the restriction status of a course accordingly to the command required
*/

exports.modifyBookableLectures=function(list){ 
    return new Promise((resolve, reject) => {
        const sql='UPDATE Course SET Restriction=? WHERE CourseID=?'
            for(let el of list){
                db.run(sql, [el.restriction, el.courseId], (err) => {
                    /* istanbul ignore if */
                    if(err) reject(err);
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
            /* istanbul ignore else */
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
                    /* istanbul ignore else */
                    if(i === list.length)
                        resolve(true);
                    /* istanbul ignore else */
                }
            });
        }
    });
}



/**
* Input: empty
* Output: list of schedule
* Description: retrieves list of schedule
*/


exports.getSchedule = function(){
    let list = []
    let i = 0
    return new Promise((resolve, reject) => {
        const sql = 'SELECT Code, Room, Day, Seats, Time FROM Schedule'
        db.all(sql, [], (err, rows) => {
            if(err)
                reject(err)
            else{
                for(let row of rows){
                    const sql_2 = 'SELECT Name FROM Course WHERE CourseID = ?'
                    db.get(sql_2, [row.Code], (err_2, row_2) =>{
                        if(err_2)
                            reject(err_2)
                        else{
                            i++
                            let obj = {
                                "courseId": row.Code,
                                "courseName": row_2.Name,
                                "room": row.Room,
                                "day": row.Day,
                                "seats": row.Seats,
                                "time": row.Time
                            }
                            list.push(obj)
                            if(i === rows.length) resolve(list)
                        }
                    })
                }
            }
        })
    })
}

/**
 *
 *
 * */

exports.updateSchedules = function(schedule){
    let today = moment().format("YYYY-MM-DD HH:mm:ss")
    return new Promise((resolve, reject) => {
        const sql = 'SELECT Course_Ref, Date, Day FROM Lecture WHERE Course_Ref=? AND Date>=? AND Day=?'
        db.all(sql, [schedule.courseId, today, schedule.oldDay], (err, rows)=> {
            if(err)
                reject(err)
            else{
                updateSingleSchedule(schedule)
                    .then((response) => {
                        if(response){
                            updateGivenLectures(rows, schedule)
                                .then((response2) => {
                                    resolve(response2)
                                })
                                .catch((err2) => {
                                    reject(err2)
                                })
                        }
                    })
                    .catch((err3) => {
                        reject(err3)
                    })

            }

        })
    })

}

function updateSingleSchedule(schedule){
    return new Promise((resolve, reject) => {
        const sql = 'UPDATE Schedule SET Room=?, Day=?, Seats=?, Time=? WHERE Code=? AND Day=?'
        db.run(sql, [schedule.newRoom, schedule.newDay, schedule.newSeats, schedule.newTime,
                    schedule.courseId, schedule.oldDay], (err) => {
            if(err)
                reject(err)
            else
                resolve(true)
        })
    })
}


/**
 * Updates given lectures
 *
 * */

function updateGivenLectures(lectures, schedule){
    let dayMap = {
        "Mon": 1,
        "Tue": 2,
        "Wed": 3,
        "Thu": 4,
        "Fri": 5
    }
    return new Promise((resolve, reject)=> {
        const sql = 'UPDATE Lecture SET Capacity=?, Date=?, EndDate=?, DateDeadline=?, Day=? WHERE Course_Ref=? AND Date=?'
        if(lectures.length === 0) resolve("there are not lectures to be changed")
        for(let lecture of lectures){
            let date = moment(lecture.Date)
            let nDay = Number(dayMap[schedule.newDay])
            let newDate = moment(date).startOf('week').add(nDay, 'day')
            let endDate = newDate
            let deadline = newDate
            deadline = moment(newDate).subtract(1, 'day').format("YYYY-MM-DD").concat(" 23:00:00")
            let time = schedule.newTime.split("-")
            newDate = (time[0].length === 4) ? newDate.format("YYYY-MM-DD").concat(" 0"+time[0]+":00") :
                                                newDate.format("YYYY-MM-DD").concat(" "+time[0]+":00")
            endDate = (time[1].length === 4) ? endDate.format("YYYY-MM-DD").concat(" 0"+time[1]+":00") :
                                                endDate.format("YYYY-MM-DD").concat(" "+time[1]+":00")

            db.serialize(()=>{
                db.run(sql, [schedule.newSeats, newDate, endDate, deadline, schedule.newDay,
                        lecture.Course_Ref, lecture.Date], (err) => {
                    if(err)
                        reject(err)
                })

                const sql2 = 'UPDATE Booking SET Date_Ref=?, EndDate=? WHERE Course_Ref=? AND Date_Ref=?'
                db.run(sql2, [newDate, endDate, lecture.Course_Ref, lecture.Date], (err) => {
                    if(err)
                        reject(err)
                })

                const sql3 = 'SELECT Email FROM User WHERE userID IN ('+
                    'SELECT Student_Ref FROM Booking WHERE Course_Ref=? AND Date_Ref=?)'
                db.all(sql3, [lecture.Course_Ref, newDate], (err, rows)=>{
                    if(err)
                        reject(err)
                    else{
                        for(let email of rows){
                            sendBookingChangeNotification(email.Email, lecture.Date, newDate, endDate)
                        }
                    }
                })
            })
            resolve(true)

        }


    })
}

function sendBookingChangeNotification(email, oldDate, newDate, newEnd){
    let mailOptions = {
        from: mailer.email,
        to: email,
        subject: 'Booking Change Notification',
        text: `Dear student, lecture on ${oldDate} has been moved on ${newDate} and will last until ${newEnd}`
    };

    mailer.transporter.sendMail(mailOptions, function(err, info){
        /* istanbul ignore if */
        if(err){
            console.log(err);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}