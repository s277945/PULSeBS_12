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
    after(async()=>{
        await chai.request(url).post('/api/logout').set('Cookie',cookie).send();
    })
});
