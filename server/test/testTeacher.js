
const chai=require('chai');
const {before,after,describe,it}=require('mocha');
const dao=require('../src/Dao/studentDao');
const chaiHttp=require('chai-http');
chai.use(chaiHttp);
chai.use(require('chai-match'));
const server=require('../src/server');
const expect=chai.expect;
let cookie;
const url='http://localhost:3001';
const supportFunc=require('./supportFunction');
const db=require('../src/db')
describe('TEACHER TESTING', function () {
    //login teacher and saves its session before to do other stuffs
    beforeEach(()=>{
        db.run("BEGIN")
    })
    afterEach(()=>{
        db.run("ROLLBACK")
    })
    before(async() => {
        let res = await chai.request(url).post('/api/login').send({
            userName: 't987654',
            password: 'scimmia'
        })
        cookie = res.headers['set-cookie'];
    })
    describe('/api/teacherLectures', function () {
        it('should return list of courses not empty', function () {
           return chai.request(url)
               .get('/api/teacherLectures')
               .set('Cookie',cookie)
               .send()
               .then(res=>{
                   expect(res).to.have.status(200)
                   expect(res.body).to.be.an('array')
                   expect(res.body).to.be.not.empty
                   expect(res.body[0]).to.haveOwnProperty('Course_Ref')
                   expect(res.body[0].Course_Ref).to.match(/[A-Z0-9]{5}/)
                   expect(res.body[0]).to.haveOwnProperty('Name')
                   expect(res.body[0].Name).to.match(/[\w\s:]+/)
                   expect(res.body[0]).to.haveOwnProperty('Date')
                   expect(res.body[0]).to.haveOwnProperty('DateDeadline')
                   expect(res.body[0]).to.haveOwnProperty('EndDate')
                   expect(res.body[0]).to.haveOwnProperty('BookedSeats')
                   expect(res.body[0]).to.haveOwnProperty('Capacity')
                   expect(res.body[0].Capacity).to.be.a('number')
                   expect(res.body[0]).to.haveOwnProperty('Type')
               })
        });
    });
    describe('/api/teacherCourses', function () {
        it('should return 200 and courses list', function () {
            return chai.request(url)
                .get('/api/teacherCourses')
                .set('Cookie',cookie)
                .send()
                .then(res=>{
                    expect(res).to.have.status(200)
                    expect(res.body).to.be.an('array')
                    expect(res.body).to.be.not.empty
                    expect(res.body[0]).to.haveOwnProperty('Name')
                    expect(res.body[0]).to.haveOwnProperty('CourseID')
                    expect(res.body[0].CourseID).to.match(/[A-Z0-9]{5}/)
                })
        });
    });
    describe('List Student', function () {
        it('should return status 201 and an array of students', function () {
            return chai.request(url).get('/api/lectures/listStudents?courseRef=C4567&date=2020-12-22 09:00:00')
                .set('Cookie',cookie)
                .send()
                .then(res=>{
                    expect(res.status).to.equal(201);
                    expect(res.body).to.be.an('array');
                    expect(res.body).not.be.empty;

                })
        });
    });
    describe('DELETE FUNCTION', function () {
        it('should return status 500',async function () {
            return chai.request(url)
                .delete('/api/courseLectures/C4567?date=2020-10-15 09:00:00')
                .set('Cookie',cookie)
                .send()
                .then((res)=>{
                    expect(res.status).to.equal(500);
                    expect(res).to.have.property('error');
                    expect(res.body.error).to.equal('Delete lecture deadline expired');
                })

        });
        it('should return status 204',async function () {
            return chai.request(url)
                .delete('/api/courseLectures/C4567?date=2020-12-25 09:00:00')
                .set('Cookie',cookie)
                .send()
                .then(res=>{
                    expect(res.err).to.be.undefined;
                    expect(res.status).to.be.equals(204);
                })




        });
    });
    describe('CHANGE TYPE OF LECTURE', function () {
        it('should return status 422', async function () {
            return chai.request(url).put('/api/lectures').set("Cookie",cookie)
                .send({courseId: "C4567",date:"2020-11-17 14:00:00"})
                .then(res=>{
                    expect(res.status).to.be.equals(422);
                    expect(res.body).to.have.property('error')
                    expect(res.body.error).to.be.equals('Cannot modify type of lecture after 30 minutes before scheduled time')
                })
        });
        it('should return status 200',async function () {
            let res=await chai.request(url).put('/api/lectures').set("Cookie",cookie)
                .send({courseId: "C4567",date:"2020-12-22 09:00:00"});
            expect(res.err).to.be.undefined;
            expect(res).to.have.status(200);
            expect(res.body).to.have.property('response');
            expect(res.body.response).to.be.equals(true);
        });
    });
    describe('GET COURSE STATS BY COURSE_ID', function () {
        it('should return status 200',async function () {
            return chai.request(url).get("/api/courseStats/C4567")
                .set("Cookie",cookie)
                .send()
                .then((res)=>{
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.an('array')
                    expect(res.body).to.be.not.empty
                    expect(res.body[0]).to.haveOwnPropertyDescriptor('lectureName')
                    expect(res.body[0]).to.haveOwnPropertyDescriptor('date')
                    expect(res.body[0]).to.haveOwnPropertyDescriptor('nBooked')

                });
        });
    });
    describe('GET MONTH STATS', function () {
        it('should return status 200 and list of stats related first semester',async function () {
            return  chai.request(url).get('/api/monthStats/C4567')
                .set("Cookie",cookie)
                .send()
                .then((res)=>{
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.an('array');
                    //expect(res.body).to.be.greaterThan(0)
                    expect(res.body[0]).to.haveOwnPropertyDescriptor('month')
                    expect(res.body[0]).to.haveOwnPropertyDescriptor('average')
                });
        });
        it('should return status 200 and list of stats second semester',async function () {
            return chai.request(url).get('/api/monthStats/C8901')
                .set("Cookie",cookie)
                .send()
                .then((res)=>{
                    expect(res).to.have.status(200)
                });
        });
    });
    describe('GET WEEK STATS', function () {
        it('should return status 200 and week stats of first semester',async function () {
            return chai.request(url)
                .get("/api/weekStats/C4567")
                .set("Cookie",cookie)
                .send()
                .then(res=>{
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.an('array');
                    expect(res.body).to.be.not.empty;
                    expect(res.body[0]).to.haveOwnPropertyDescriptor('weekName')
                    expect(res.body[0]).to.haveOwnPropertyDescriptor('average')
                })
        });
        it('should return week stats of second semester',function () {
            return chai.request(url)
                .get('/api/weekStats/C8901')
                .set("Cookie",cookie)
                .send()
                .then(res=>{
                    expect(res).to.have.status(200);
                })

                    /*expect(res.body).to.be.an('array')
                    expect(res.body).to.be.not.empty;
                    expect(res.body[0]).to.haveOwnPropertyDescriptor('weekName')
                    expect(res.body[0]).to.haveOwnPropertyDescriptor('average')*/

        });

    });
});
