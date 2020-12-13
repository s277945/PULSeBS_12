const chai=require('chai');
const {Context}=require('mocha');
const chaiHttp=require('chai-http');
chai.use(chaiHttp);
chai.use(require('chai-match'));
const expect=chai.expect;
const support=require('./supportFunction')
let cookie;
let student=[];
let teacher=[];
let course=[];
let enrollment=[];
let schedule=[];
const url='http://localhost:3001';
describe('TEST SUPPORT OFFICER', function () {
    before(async() => {
        let res = await chai.request(url).post('/api/login').send({
            userName: 'c123456',
            password: 'scimmia'
        })
        cookie = res.headers['set-cookie'];
        student.push({"userId": "900000", "name": "Ambra", "surname":"Ferri",
            "city": "Poggio Ferro", "email":	"s900000@students.politu.it",
            "birthday": "1991-11-04", "ssn": "MK97060783"});
        teacher.push({"userId": "d9000", "name": "Ines", "surname":"Beneventi", "email":"Ines.Beneventi@politu.it",
            "ssn": "XT6141393"});
        course.push({"courseId": "XY1211", "year": 1, "name": "Metodi di finanziamento delle imprese", "semester": 1, "teacherId": "d9000"});
        enrollment.push({"courseId":"XY1211", "studentId": "900000"});
        schedule.push({"courseId": "XY1211","room": 1, "day": "Mon", "seats": 120, "time": "8:30-11:30"});
    })
    describe('insert a student inside table', function () {
        it('should insert correctly a student', function () {
            return chai.request(url)
                .post('/api/uploadStudents')
                .set("Cookie",cookie)
                .send(student)
                .then(res=>{
                    expect(res).to.have.status(200)
                    expect(res.body.inserted).to.equals(true)
                })
        });
        it('should not insert a student already in table', function () {
            return chai.request(url)
                .post('/api/uploadStudents')
                .set("Cookie",cookie)
                .send(student)
                .then(res=>{
                    expect(res).to.have.status(500)
                })
        });
    });
    describe('UPLOAD TEACHER', function () {
        it('should upload teacher', function () {
            return chai.request(url)
                .post('/api/uploadTeachers')
                .set("Cookie",cookie)
                .send(teacher)
                .then(res=>{
                    expect(JSON.stringify(res)).to.equals('a')
                    expect(res).to.have.status(200)
                    expect(res.body.inserted).to.equals(true)
                })
        });
        it('should not upload teacher', function () {
            return chai.request(url)
                .post('/api/uploadTeachers')
                .set("Cookie",cookie)
                .send(teacher)
                .then(res=>{
                    expect(res).to.have.status(500)
                })
        });
    });
    describe('UPLOAD COURSE', function () {
        it('should upload list course', function () {
            return chai.request(url)
                .post('/api/uploadCourses')
                .set("Cookie",cookie)
                .send(course)
                .then(res=>{
                    expect(res).to.have.status(200)
                    expect(res.body.inserted).to.equals(true)
                })
        });
        it('should not upload list courses', function () {
            return chai.request(url)
                .post('/api/uploadCourses')
                .set("Cookie",cookie)
                .send(course)
                .then(res=>{
                    expect(res).to.have.status(500)
                })
        });
    });
    describe('UPLOAD ENROLLMENT', function () {
        it('should upload list enrollment', function () {
            return chai.request(url)
                .post('/api/uploadEnrollment')
                .set("Cookie",cookie)
                .send(enrollment)
                .then(res=>{
                    expect(res).to.have.status(200)
                    expect(res.body.inserted).to.equals(true)
                })
        });
        it('should not upload list enrollment', function () {
            return chai.request(url)
                .post('/api/uploadEnrollment')
                .set("Cookie",cookie)
                .send(enrollment)
                .then(res=>{
                    expect(res).to.have.status(500)
                })
        });
    });
    describe('UPLOAD schedule', function () {
        it('should upload list schedule', function () {
            return chai.request(url)
                .post('/api/uploadSchedule')
                .set("Cookie",cookie)
                .send(schedule)
                .then(res=>{
                    expect(res).to.have.status(200)
                    expect(res.body.inserted).to.equals(true)
                })
        });
        it('should not upload list schedule', function () {
            return chai.request(url)
                .post('/api/uploadSchedule')
                .set("Cookie",cookie)
                .send(schedule)
                .then(res=>{
                    expect(res).to.have.status(500)
                })
        });
    });
    after(async()=>{
        support.deleteRowsSchedule(schedule).then(res=>{

        })
        support.deleteRowsEnrollment(enrollment).then(res=>{

        })
        support.deleteRowsCourse(course).then(res=>{

        })
        support.deleteRowsTeacher(teacher).then(res=>{

        })
        support.deleteRowsStudent(student).then(res=>{

        })
    })
});