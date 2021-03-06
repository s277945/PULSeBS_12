import axios from 'axios'

/**
 * 
 * API - Call to API should only be in here
 * 
 */
export const axiosInst = axios.create(); // create axios instance to manage interceptors

export function useResponseInterceptor(auth) { // function to set up response interceptor with authentication state and functions
    axiosInst.interceptors.response.use(// create response interceptor
        (response) => { return response },
        async function (error) {
            /* istanbul ignore next */
            if (error.response.status === 404) {
                // redirecti to 404 page
                // history.replace("/404")
            }
                /* istanbul ignore else */
            if (error.response.status === 403 || error.response.status === 401) {// in case of expired jwt token
                auth.clearSession(); // clear session data from useProvideAuth() instance method
            }
            return Promise.reject(error);
        }
    );
}

/*export function useRequestInterceptor(auth) { // function to set up request interceptor with authentication state and functions
    axiosInst.interceptors.request.use(// create request interceptor
        (request) => { //perfrom tasks on request
            return request 
        }
    );
}*/


export function getLectures(){
    // get list of lectures for student from server
    return axiosInst.get(`http://localhost:3001/api/lectures`, { withCredentials: true });
}

export function getTeacherLectures(){
    // get list of lectures for student from server
    return axiosInst.get(`http://localhost:3001/api/teacherLectures`, { withCredentials: true });
}

export function getTeacherPastLectures(){
    // get list of lectures for student from server
    return axiosInst.get(`http://localhost:3001/api/teacherPastLectures`, { withCredentials: true });
}

export function setPresentStudents(cid, date, body){
    // get list of lectures for student from server
    return axiosInst.post(`http://localhost:3001/api/${cid}/${date}/attendees`, body, { withCredentials: true });
}

export function getCourses(){
    // get list of lectures for student from server
    return axiosInst.get(`http://localhost:3001/api/courses`, { withCredentials: true });
}

export function getTeacherCourses(){
    // get list of lectures for student from server
    return axiosInst.get(`http://localhost:3001/api/teacherCourses`, { withCredentials: true });
}

export function getStudentBookedLectures(){
    // get list of student booked lectures for student from server
    return axiosInst.get(`http://localhost:3001/api/lectures/booked`, { withCredentials: true});
}

export function getStudentWaitingLectures(){
    // get list of student lectures where s/he is in waiting list from server
    return axiosInst.get(`http://localhost:3001/api/lectures/waiting`, { withCredentials: true});
}

export function postStudentBookedLecture(body){
    // add booking for a lecture to server
    return axiosInst.post(`http://localhost:3001/api/lectures`, body, { withCredentials: true})
}

export function deleteStudentBookedLecture(lectureId, date){
    // tell server to cancel booking for a lecture
    return axiosInst.delete(`http://localhost:3001/api/lectures/${lectureId}?date=${date}`, { withCredentials: true})
}

export function getStudentList(element){
    // get list of students booked 
    return axiosInst.get(`http://localhost:3001/api/lectures/listStudents?courseRef=${element.Course_Ref}&date=${element.Date}`,{ withCredentials: true })
}

export function lectreTurnToDistance(body) {
    // change lecture to distance lecture
    return axiosInst.put('http://localhost:3001/api/lectures/', body, { withCredentials: true });
}

export function cancelLecture(courseId, date){
    // cancel teacher Lecture
    return axiosInst.delete(`http://localhost:3001/api/courseLectures/${courseId}?date=${date}`, { withCredentials: true });
}

export function getCourseStats(course){
    // get list of lectures for student from server
    return axiosInst.get(`http://localhost:3001/api/courseStats/${course}`, { withCredentials: true });
}

export function getWeekStats(course){
    // get list of lectures for student from server
    return axiosInst.get(`http://localhost:3001/api/weekStats/${course}`, { withCredentials: true });
}

export function getMonthStats(course){
    // get list of lectures for student from server
    return axiosInst.get(`http://localhost:3001/api/monthStats/${course}`, { withCredentials: true });
}

export function getAllCoursesForBookingManager(){
    return axiosInst.get(`http://localhost:3001/api/courses/all`, { withCredentials: true });
}

export function getStatsByCourseID(courseID){
    return axiosInst.get(`http://localhost:3001/api/managerCoursesTotal/${courseID}`, { withCredentials: true });
}

export function getLecturesStatsByCourseID(courseID){
    return axiosInst.get(`http://localhost:3001/api/managerCourses/${courseID}`, { withCredentials: true });
}

export function getAllPosUsers(){
    return axiosInst.get(`http://localhost:3001/api/users/positiveUsers`, { withCredentials: true });
}

export function getUserBySSN(ssn){
    return axiosInst.get(`http://localhost:3001/api/users/${ssn}`, { withCredentials: true });
}

// Be aware that when sending a post request with an empty body you must specify the empty body with {}
export function postMarkUser(ssn){
    return axiosInst.post(`http://localhost:3001/api/users/${ssn}`,{}, { withCredentials: true, credentials: 'include' });
}

export function getUserReport(ssn){
    return axiosInst.get(`http://localhost:3001/api/reports/${ssn}`, { withCredentials: true });
}

export function uploadStudents(studentList, filename){
    return axiosInst.post(`http://localhost:3001/api/uploadStudents`, { data: studentList, fileName: filename}, { withCredentials: true, credentials: 'include' });
}

export function uploadTeachers(data, filename){
    return axiosInst.post(`http://localhost:3001/api/uploadTeachers`, { data: data, fileName: filename}, { withCredentials: true, credentials: 'include' });
}

export function uploadCourses(data, filename){
    return axiosInst.post(`http://localhost:3001/api/uploadCourses`, { data: data, fileName: filename}, { withCredentials: true, credentials: 'include' });
}

export function uploadEnrollment(data, filename){
    return axiosInst.post(`http://localhost:3001/api/uploadEnrollment`, { data: data, fileName: filename}, { withCredentials: true, credentials: 'include' });
}

export function uploadSchedule(data, filename){
    return axiosInst.post(`http://localhost:3001/api/uploadSchedule`, { data: data, fileName: filename}, { withCredentials: true, credentials: 'include' });
}

export function getCoursesData(){
    // get list of courses for support officer selection from server
    return axiosInst.get(`http://localhost:3001/api/coursesData`, { withCredentials: true });
}

export function postCoursesType(coursesData){// receives array of { coursesId: "CID", restriction: 0/1 }
    // post list of courses of which to update type for support officer selection from server
    return axiosInst.post(`http://localhost:3001/api/lecturesBookable`, coursesData, { withCredentials: true });
}

export function getFileData(){
    // get uploaded files info from server
    return axiosInst.get(`http://localhost:3001/api/fileData`, { withCredentials: true });
}

export function getAllSchedule(){
    //get all schedules of SupportOfficer page from server
    return axiosInst.get('http://localhost:3001/api/schedules',{withCredentials:true});
}

export function setNewSchedule(body){
    //update schedule and send the new schedule of a given course to the server, one element at time
    return axiosInst.put('http://localhost:3001/api/schedules',body,{withCredentials:true});
}

export function setTutorial(){
    //update tutorial value for user
    return axiosInst.put('http://localhost:3001/api/user/tutorial',{},{withCredentials:true});
}

export async function login (userName, password){
    return axios.post(`http://localhost:3001/api/login`, { userName: userName, password: password}, {withCredentials: true})
        .then(result => {
            return {
                userName : result.data.userID,
                userType: result.data.userType,
                tutorial: result.data.tutorial
            }
        })
}

export function logout(){
    return axios.post("http://localhost:3001/api/logout", {}, {withCredentials: true})
}