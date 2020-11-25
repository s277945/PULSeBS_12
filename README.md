# PULSeBS_12

## DOCKER INSTALL INSTRUCTIONS

  From a command line run:
  
  Linux:
  ```
  git clone https://github.com/s277945/PULSeBS_12.git
  cd PULSeBS_12
  sudo docker pull alebottisio/pulsebs_12:frontend_stable
  sudo docker pull alebottisio/pulsebs_12:mail_stable
  sudo docker pull alebottisio/pulsebs_12:server_stable
  sudo docker-compose up
  ```
  Windows:
  ```
  git clone https://github.com/s277945/PULSeBS_12.git
  cd PULSeBS_12
  docker pull alebottisio/pulsebs_12:frontend_stable
  docker pull alebottisio/pulsebs_12:mail_stable
  docker pull alebottisio/pulsebs_12:server_stable
  docker-compose up
  ```

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
 
  **GET /api/historicalStats/:courseId**
  - url example: /api/historicalStats/C0123?dateStart=2020-12-10 12:00:00&dateEnd=2020-12-17 12:00:00
  - request parameters: courseId 
  - query parameters: dateStart, dateEnd
  - body response: it's a number, the average. For istance: 0.3333333333333333