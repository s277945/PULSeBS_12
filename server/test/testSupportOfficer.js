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
const db=require('../src/db')
describe('TEST SUPPORT OFFICER', function () {
    beforeEach(()=>{
        db.run("BEGIN")
    })
    afterEach(()=>{
        db.run("ROLLBACK")
    })
    before(async() => {
        let res = await chai.request(url).post('/api/login').send({
            userName: 'so123456',
            password: 'scimmia'
        })
        cookie = res.headers['set-cookie'];
        student.push({"userID": "900000", "Name": "Ambra", "Surname":"Ferri",
            "City": "Poggio Ferro", "email":"s900000@students.politu.it",
            "birthday": "1991-11-04", "ssn": "MK97060783"});
        teacher.push({"userID": "d9000", "Name": "Ines", "Surname":"Beneventi", "email":"Ines.Beneventi@politu.it",
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
                .send({data:student,fileName:'Students.csv'})
                .then(res=>{
                    expect(res).to.have.status(200)
                    expect(res.body.inserted).to.equals(true)
                })
        });
    });
    describe('UPLOAD TEACHER', function () {
        it('should upload teacher', function () {
            return chai.request(url)
                .post('/api/uploadTeachers')
                .set("Cookie",cookie)
                .send({data:teacher,fileName:'Students.csv'})
                .then(res=>{
                    expect(res).to.have.status(200)
                    expect(res.body.inserted).to.equals(true)
                })
        });
    });
    describe('UPLOAD COURSE', function () {
        it('should upload list course', function () {
            return chai.request(url)
                .post('/api/uploadCourses')
                .set("Cookie",cookie)
                .send({data:course,fileName:'Students.csv'})
                .then(res=>{
                    expect(res).to.have.status(200)
                    expect(res.body.inserted).to.equals(true)
                })
        });
    });
    describe('UPLOAD ENROLLMENT', function () {
        it('should upload list enrollment', function () {
            return chai.request(url)
                .post('/api/uploadEnrollment')
                .set("Cookie",cookie)
                .send({data:enrollment,fileName:'Students.csv'})
                .then(res=>{
                    expect(res).to.have.status(200)
                    expect(res.body.inserted).to.equals(true)
                })
        });

    });
    describe('UPLOAD schedule', function () {
        it('should upload list schedule', async function () {
            let result=await chai.request(url)
                .post('/api/uploadCourses')
                .set("Cookie",cookie)
                .send({data:course,fileName:'Students.csv'})
                .then(res=>{
                    if(res){
                        return chai.request(url)
                            .post('/api/uploadSchedule')
                            .set("Cookie",cookie)
                            .send({data:schedule,fileName:'Schedule.csv'})
                            .then(res=>{
                                expect(res).to.have.status(200)
                                expect(res.body.inserted).to.equals(true)
                            })
                    }
                })
        });
    });
    describe('FileData', function () {
        it('should get file data', function () {
            return chai.request(url).get('/api/fileData')
                .set('Cookie',cookie).send()
                .then(res=>{
                    expect(res).to.have.status(200)
                    expect(res.body).to.be.an('array')
                    expect(res.body).to.have.lengthOf(5)
                })
        });
    });
    describe('COURSE DATA', function () {
        it('should return course data', function () {
            return chai.request(url).get('/api/coursesData')
                .set('Cookie',cookie).send()
                .then(res=>{
                    expect(res).to.have.status(200)
                    expect(res.body).to.be.an('array')
                    expect(res.body).to.be.not.empty
                })
        });
        it('should post bookable lecture', function () {
            return chai.request(url).post('/api/lecturesBookable')
                .set('Cookie',cookie)
                .send([{"courseId": "C4567","restriction": 0}])
                .then(res=>{
                    expect(res).to.have.status((200))
                    expect(res.body).to.haveOwnProperty("modified")
                })
        });
        it('should post not bookable lecture', function () {
            return chai.request(url).post('/api/lecturesBookable')
                .set('Cookie',cookie)
                .send([{"courseId": "C4567","restriction": 1}])
                .then(res=>{
                    expect(res).to.have.status((200))
                    expect(res.body).to.haveOwnProperty("modified")
                })
        });
    });
    describe('SCHEDULE SETUP', function () {
        it('should get list of schedule and return status 200', function () {
            return chai.request(url)
                .get('/api/schedules')
                .set('Cookie',cookie)
                .send()
                .then(res=>{
                    expect(res).to.have.status(200)
                    expect(res.body).to.be.an('array')
                    expect(res.body).to.be.not.empty
                })
        });
        it('should update schedule and return status 200', function () {
            return chai.request(url)
                .put('/api/schedules')
                .set('Cookie',cookie)
                .send({})
                .then(res=>{
                    expect(res).to.have.status(200)
                })
        });
    });
});