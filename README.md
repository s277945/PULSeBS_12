# PULSeBS_12

## ENDPOINTS

**base path: /api** 

**POST /login**
- request body: {userId, password}




## ENDPOINTS WITH AUTHENTICATION
**POST /logout**
///////


**GET /lectures?userId=...**
- query parameters: userId => student ID
- response body: [{"lectureId": "0432SQ", "lectureName": "SE2", "date": "...", "teacher": "Torchiano"}, {...}]


**POST /lectures**
- body request: {"userId": "s269443", "lectureId": "0432SQ"} /////lecture ID should be unique in this case
- body response: status 201/404/500


**DELETE /lectures/:lectureId?userId=...**
- request parameters: lectureId, userId
- body response: status 204/404/500


**GET /lectures/next?userId=...**
- query parameters: userId => teacher ID
- response body: {"lectureId": "0432SQ", "lectureName": "SE2", "date": "...", "teacher": "Torchiano", "numberStudents" : 123, "numberMax": 200}


**GET /lectures?userId=...**
- query parameters: userId => teacher ID
- response body: [{"lectureId": "0432SQ", "lectureName": "SE2", "date": "..."}, {...}]


**GET /lectures/:lectureId/listStudents?userId=...**
- query parameters: lectureId, userId => teacher ID
- response body: {"students": [{...}]}

**GET /lectures/:lectureId/bookedStudents?userId=...**
- query parameters: lectureId, userId => teacher ID
- response body: {"numberStudents" : 123, "numberMax": 200}




