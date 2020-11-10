# PULSeBS_12

## ENDPOINTS

**base path: /api** 

**POST /login**
- request body: {userName, password}




## ENDPOINTS WITH AUTHENTICATION
**POST /logout**
///////


**GET /lectures**
- query parameters: userId => student ID (taken from token)
- response body: [{"lectureId": "0432SQ", "lectureName": "SE2", "date": "...", "teacher": "Torchiano"}, {...}]


**POST /lectures**
- body request: {"lectureId": "0432SQ", "date": "..."} /////lecture ID should be unique in this case
- body response: status 201/404/500


**DELETE /lectures/:lectureId?date=2020-12-13 19:00:00** => don't worry about spaces
- request parameters: lectureId, date
- body response: status 204/404/500


**GET /lectures/next**
- query parameters: userId => teacher ID
- response body: {"lectureId": "0432SQ", "lectureName": "SE2", "date": "...", "teacher": "Torchiano", "numberStudents" : 123, "numberMax": 200}


**GET /lectures/:lectureId/listStudents**
- query parameters: lectureId, userId => teacher ID
- response body: {"students": [{...}]}

**GET /lectures/:lectureId/bookedStudents?userId=...**
- query parameters: lectureId, userId => teacher ID
- response body: {"numberStudents" : 123, "numberMax": 200}




