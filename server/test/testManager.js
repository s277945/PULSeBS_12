const chai=require('chai');
const {Context}=require('mocha');

const chaiHttp=require('chai-http');
chai.use(chaiHttp);
const server=require('../src/server');
const expect=chai.expect;
let cookie;
const url='http://localhost:3001';

describe('TEST SUITE MANAGER FUNCTION', function () {
    before(async() => {
        let res = await chai.request(url).post('/api/login').send({
            userName: 'b123456',
            password: 'scimmia'
        })
        cookie = res.headers['set-cookie'];
    })
    describe('GET ALL COURSES', function () {
        it('should return list of all courses', function () {
            return chai.request(url)
                .get('/api/courses/all')
                .set('Cookie',cookie)
                .send()
                .then(res=>{
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.an('array');
                    expect(res.body).to.be.not.empty
                    expect(res.body[0]).to.haveOwnPropertyDescriptor('Name');
                })
        });
    });
    describe('GET STATS FOR A GIVEN COURSE', function () {
        it('should return list of stats for a given existing course', function () {
            return chai.request(url)
                .get('/api/managerCourses/C4567')
                .set('Cookie',cookie)
                .send()
                .then(res=>{
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.an('array');
                    expect(res.body[0]).to.haveOwnPropertyDescriptor('lectureName');
                    expect(res.body[0].lectureName).to.not.be.undefined;
                })
        });
        it('should return an empty list', function () {
            return chai.request(url)
                .get('/api/managerCourses/fake')
                .set('Cookie',cookie)
                .send()
                .then(res=>{
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.empty;
                })
        });
    });
    describe('GET STATS OF ALL COURSES', function () {
        it('should return stats of all courses', function () {
            return chai.request(url)
                .get('/api/managerCoursesTotal/C4567')
                .set('Cookie',cookie)
                .send()
                .then(res=>{
                    expect(res).to.have.status(200);
                    expect(res.body).to.haveOwnProperty('courseName');
                })
        });
        it('should return 404 error if i dont insert a courseId inside request', function () {
            return chai.request(url)
                .get('/api/managerCoursesTotal/')
                .set('Cookie',cookie)
                .send()
                .then(res=>{
                    expect(res).to.have.status(404);
                })
        });
    });
    describe('SET STUDENT POSITIVE', function () {
        it('should mark a student as positive by ssn', function () {
            return chai.request(url)
                .post('/api/students/:studentSsn')
                .set('Cookie',cookie)
                .send()
                .then(res=>{
                    expect(res).to.have.status(200)
                    expect(res.body).to.haveOwnProperty('setAsPositive')
                    expect(res.body.setAsPositive).to.equals(true)
                })
        });
    });
    describe('GET LIST OF POSITIVE STUDENTS', function () {
        it('should return a list of students', function () {
            return chai.request(url).get('/api/students/positiveStudents')
                .set('Cookie',cookie)
                .send()
                .then(res=>{
                    expect(res.to.have.status(201))
                    expect(res.body).to.be.an('array')
                    expect(res.body).to.be.not.empty
                    expect(res.body[0]).to.haveOwnProperty('name')
                    expect(res.body[0].name).to.match(/[a-zA-z]+/)
                    expect(res.body[0]).to.haveOwnProperty('surname')
                    expect(res.body[0].surname).to.match(/[a-zA-z]+/)
                    expect(res.body[0]).to.haveOwnProperty('birthday')
                    expect(res.body[0].birthday).to.match(/^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/)
                })
        });
        it('should return single student', function () {
            return chai.request(url).get('/api/students/TODO')
                .set('Cookie',cookie)
                .send()
                .then(res=>{
                    expect(res).to.have.status(201)
                    expect(res.body).to.be.not.empty
                    expect(res.body).to.haveOwnProperty('name')
                    expect(res.body.name).to.match(/[a-zA-Z]+/)
                    expect(res.body).to.haveOwnProperty('surname')
                    expect(res.body.name).to.match(/[a-zA-Z]+/)
                    expect(res.body).to.haveOwnProperty('birthday')
                    expect(res.body.birthday).to.match(/^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/)
                    expect(res.body).to.haveOwnProperty('ssn')
                    expect(res.body.ssn).to.match(/[A-Z]{2}[0-9]{8}/)
                })
        });
        
    });
    describe('generate student report of tracking', function () {
        it('should return list of students that have a contact with a student', function () {
            return chai.request(url).get('/api/reports/:studentSsn')
                .set('Cookie',cookie)
                .send()
                .then(res=> {
                    expect(res.to.have.status(201))
                    expect(res.body).to.be.an('array')
                    expect(res.body).to.be.not.empty
                    expect(res.body[0]).to.haveOwnProperty('name')
                    expect(res.body[0].name).to.match(/[a-zA-z]+/)
                    expect(res.body[0]).to.haveOwnProperty('surname')
                    expect(res.body[0].surname).to.match(/[a-zA-z]+/)
                    expect(res.body[0]).to.haveOwnProperty('ssn')
                    expect(res.body[0].ssn).to.match(/[A-Z]{2}[0-9]{8}/)
                    expect(res.body[0]).to.haveOwnProperty('birthday')
                    expect(res.body[0].birthday).to.match(/^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/)
                })
        });
    });
    after(async()=>{
        await chai.request(url).post('/api/logout').set('Cookie',cookie).send();
    })
});
