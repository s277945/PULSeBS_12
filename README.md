# PULSeBS_12

## INSTALL AND START PROJECT WITHOUT DOCKER

  From a command line run:
    
  clone git directory:
  
    git clone https://github.com/s277945/PULSeBS_12.git
    cd PULSeBS_12
    
  install node dependencies:
  
    ./install_script.sh
    
  start the project:
  
    ./start_script.sh


## INSTALL AND START PROJECT WITH DOCKER

  From a command line run:
  
  **Linux:**
  
  clone git directory:
  
    git clone https://github.com/s277945/PULSeBS_12.git
    cd PULSeBS_12
  download prebuilt images:
  
    sudo docker pull alebottisio/pulsebs_12:stable
  or build local images:
  
    sudo docker build -t alebottisio/pulsebs_12:stable .
  then run the docker container:
  
    sudo docker run -i -p 3000:3000 -p 3001:3001 -p 3002:3002 alebottisio/pulsebs_12:stable

  **Windows:**

  clone git directory:
  
    git clone https://github.com/s277945/PULSeBS_12.git
    cd PULSeBS_12
  download prebuilt images:
  
    docker pull alebottisio/pulsebs_12:stable
  or build local images:
  
    docker build -t alebottisio/pulsebs_12:stable .
  then run the docker container:
  
    docker run -i -p 3000:3000 -p 3001:3001 -p 3002:3002 alebottisio/pulsebs_12:stable


## SONARSCANNER INSTRUCTIONS
  Just run the following command from the project's root folder
  
  Linux:
  ```
  sonar-scanner
  ```
  Windows:
  ```
  sonar-scanner.bat
  ```
  which will automatically use the preconfigured **sonar-project.properties** file

## ENDPOINTS

**base path: /api** 

**POST /login**
- request body: {userName, password}




## ENDPOINTS WITH AUTHENTICATION
**POST /logout**
///////


**GET /lectures**
- query parameters: userId => student ID (taken from token)
- response body: [{"Course_Ref": 123123, "Name": "SE2", "date": "..."}]


**POST /lectures**
- body request: {"lectureId": "0432SQ", "date": "..."} 
- body response: status 201/404/500


**DELETE /lectures/:lectureId?date=2020-12-13 19:00:00** => don't worry about spaces
- request parameters: lectureId, date
- body response: status 204/404/500


**GET /lectures/next**
- query parameters: userId => teacher ID
- response body: {"lectureName": 123123, "numberOfStudents": 123}


**GET /lectures/:lectureId/listStudents**
- query parameters: lectureId, userId => teacher ID
- response body: {francesco, gianluca}


**GET /lectures/booked**
- query parameters: userId => retrieve from token
- response body: {"Course_Ref" : "123123", "Date_Ref": "2020-10-11"}

**GET /lectures/waiting**
- query parameters: userId => retrieve from token
- response body: {"Course_Ref" : "123123", "Date_Ref": "2020-10-11"}

**DELETE /courseLectures/:courseId?date=2020-12-12 20:00:00** 
- query parameters: courseId, date
- response body: {email1@gmail.com, email2@gmail.com}


**DELETE /api/courseLectures/:courseId?date=...** 
 - query parameters: courseId, date
 
 **PUT /api/lectures**
 - body parameters: courseId, date, type
 - body example: {"courseId": "C4567", "date": "2020-12-22 09:00:00", "type": "d"}
 
 ## STATS ENDPOINTS (Need authentication)
 **GET /api/courseStats/:courseId**
 - url example: /api/courseStats/C0123
 - request parameters: courseId
 - body response:  [{"lectureName": "SE2 Les:1", "date": "2020-12-10 12:00:00","nBooked": 1}, ...]
 
 **GET /api/monthStats/:courseId**
 - request parameters: courseId
 - url example: /api/monthStats/C0123
 - body response: [
                      {
                          "month": "October",
                          "average": null
                      },
                      {
                          "month": "November",
                          "average": null
                      },
                      {
                          "month": "December",
                          "average": 0.25
                      },
                      {
                          "month": "January",
                          "average": null
                      }
                  ]
 - hint: null value on average means that we haven't any data on db to compute
  
  
  **GET /api/weekStats/:courseId**
   - request parameters: courseId
   - url example: /api/weekStats/C0123
   - body response: [
                        {
                            "weekName": "02/11-07/11",
                            "average": null
                        },
                        {
                            "weekName": "16/11-21/11",
                            "average": null
                        },
                        {
                            "weekName": "23/11-28/11",
                            "average": null
                        },
                        {
                            "weekName": "30/11-05/12",
                            "average": null
                        },
                        {
                            "weekName": "07/12-12/12",
                            "average": 1
                        },
                        {
                            "weekName": "14/12-19/12",
                            "average": 0
                        },
                        {
                            "weekName": "21/12-26/12",
                            "average": 0
                        },
                        {
                            "weekName": "28/12-02/01",
                            "average": null
                        }
                    ]
   - hints: null value on average means that we haven't any data on db to compute
            Also I cut the response example because it was too long
            
            
 ## BOOKING MANAGER ENDPOINTS 
 
 **GET /api/courses/all**
 - retrieves all courses that have to be managed by booking manager
 - no request/query params
 - body response example: [
                              {
                                  "Name": "HCI"
                              },
                              {
                                  "Name": "PDS"
                              },
                              {
                                  "Name": "SE2"
                              }
                          ]
       
 **GET /api/managerCourses/:courseId**
 - retrieves all stats of a given course of the University
 - for each lecture associated to the course retrives information about:
    - lectureName, date, number of booking, number of attendance, number of cancellations
 - request parameter: courseId
 - url example: /api/managerCourses/C4567
 - body response example: [
                              {
                                  "lectureName": "PDS Les:1",
                                  "date": "2020-12-11 14:00:00",
                                  "nBooked": 1,
                                  "nAttendance": 1,
                                  "nCancellations": 0
                              },
                              {
                                  "lectureName": "PDS Les:2",
                                  "date": "2020-12-15 09:00:00",
                                  "nBooked": 0,
                                  "nAttendance": 0,
                                  "nCancellations": 0
                              }, ...
                          ]
                          
 **GET /api/managerCoursesTotal/:courseId**
 - retrieves overall stats of a given course of the University
 - request parameter: courseId
 - url example: /api/managerCoursesTotal/C4567                   
 - body response example: {
                              "courseName": "C0123",
                              "nBooked": 5,
                              "nAttendance": 2,
                              "nCancellations": 3
                          }

## UPLOAD ENDPOINTS

 **POST api/uploadStudents**
- upload list of students
- body request example: [{"userId": "900000", "name": "Ambra", "surname":"Ferri", "city": "Poggio Ferro", "email":	"s900000@students.politu.it",
                "birthday": "1991-11-04", "ssn": "MK97060783"}, ...]
  

**POST api/uploadTeachers**
- upload list of teachers
- body request example: [{"userId": "d9000", "name": "Ines", "surname":"Beneventi", "email":"Ines.Beneventi@politu.it"
                "ssn": "XT6141393"}, ...]
  
**POST api/uploadCourses**
- upload list of courses
- body request example: [{"courseId": "XY1211", "year": 1, "name": "Metodi di finanziamento delle imprese", "semester": 1, "teacherId": "d9000"}]

**POST api/uploadEnrollment**
- upload list of enrollments
- body request example: [{"courseId":"XY1211", "studentId": "900000"}, ...]

**POST api/uploadSchedule**
- upload list of schedule
- body request example: [{"courseId": "XY1211","room": 1, "day": "Mon", "seats": 120, "time": "8:30-11:30"}, ...]

## CONTACT TRACING ENDPOINTS

**GET /api/students/:studentSsn**
- Retrieves list of positive students or a single student
- Request params: studentSsn
- IMPORTANT: pass "positiveStudents" as parameter if you need list of positive students otherwise insert SSN of student
- response: 
    -if you use "positiveStudents": [{"name": "Gianluca","surname": "Fasulo","birthday": "16/07/1995"}, ...]
    -if you insert a specific SSN: {"name": "Fortunato Sabato","surname": "Sole","birthday": "18/08/1994","ssn": "WHTRWHRW"}

**POST api/students/:studentSsn**
- Sets a student as positive to covid
- body request: nothing
- response: {"setAsPositive": true}

**GET /api/reports/:studentSsn**
- Retrieves list of students that participated to the same lectures of a positive student
- Needed to create a report
- Request params: studentSsn
- Response example: [
  {
  "name": "Fortunato Sabato",
  "surname": "Sole",
  "birthday": "18/08/1994",
  "ssn": "WHTRWHRW"
  },
  {
  "name": "Francesco",
  "surname": "Garau",
  "birthday": "13/03/1996",
  "ssn": "GERTHETH"
  }
  ]


