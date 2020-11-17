# PULSeBS_12

## DOCKER INSTALL INSTRUCTIONS

  From a command line run:
  
  Linux:
  ```
  git clone https://github.com/s277945/PULSeBS_12.git
  cd PULSeBS_12
  sudo docker pull alebottisio/pulsebs_12 -a
  sudo docker-compose up
  ```
  Windows:
  ```
  git clone https://github.com/s277945/PULSeBS_12.git
  cd PULSeBS_12
  docker pull alebottisio/pulsebs_12 -a
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
  wich will automatically use the preconfigured **sonar-project.properties** file

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
- body request: {"lectureId": "0432SQ", "date": "..."} /////lecture ID should be unique in this case
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



