const chai=require('chai');
const {Context}=require('mocha');
const chaiHttp=require('chai-http');
chai.use(chaiHttp);
chai.use(require('chai-match'));
const expect=chai.expect;
let cookie;
const url='http://localhost:3001';

describe('TEST SUPPORT OFFICER', function () {
    before(async() => {
        let res = await chai.request(url).post('/api/login').send({
            userName: 'TODO',
            password: 'scimmia'
        })
        cookie = res.headers['set-cookie'];
    })
    describe('insert a student inside table', function () {
        it('should insert correctly a student', function () {
            return chai.request(url)
                .post('/api/uploadStudents')
                .set("Cookie",cookie)
                .send({

                })
                .then(res=>{
                    expect(res).to.have.status(200)
                    expect(res.body.inserted).to.equals(true)
                })
        });
        it('should not insert a student already in table', function () {
            return chai.request(url)
                .post('/api/uploadStudents')
                .set("Cookie",cookie)
                .send({

                })
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
                .send({

                })
                .then(res=>{
                    expect(res).to.have.status(200)
                    expect(res.body.inserted).to.equals(true)
                })
        });
        it('should not upload teacher', function () {
            return chai.request(url)
                .post('/api/uploadTeachers')
                .set("Cookie",cookie)
                .send({

                })
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
                .send({

                })
                .then(res=>{
                    expect(res).to.have.status(200)
                    expect(res.body.inserted).to.equals(true)
                })
        });
        it('should not upload list courses', function () {
            return chai.request(url)
                .post('/api/uploadCourses')
                .set("Cookie",cookie)
                .send({

                })
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
                .send({

                })
                .then(res=>{
                    expect(res).to.have.status(200)
                    expect(res.body.inserted).to.equals(true)
                })
        });
        it('should not upload list enrollment', function () {
            return chai.request(url)
                .post('/api/uploadEnrollment')
                .set("Cookie",cookie)
                .send({

                })
                .then(res=>{
                    expect(res).to.have.status(500)
                })
        });
    });
    describe('UPLOAD ENROLLMENT', function () {
        it('should upload list schedule', function () {
            return chai.request(url)
                .post('/api/uploadSchedule')
                .set("Cookie",cookie)
                .send({

                })
                .then(res=>{
                    expect(res).to.have.status(200)
                    expect(res.body.inserted).to.equals(true)
                })
        });
        it('should not upload list schedule', function () {
            return chai.request(url)
                .post('/api/uploadSchedule')
                .set("Cookie",cookie)
                .send({

                })
                .then(res=>{
                    expect(res).to.have.status(500)
                })
        });
    });
});