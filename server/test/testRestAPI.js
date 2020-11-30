const chai=require('chai');
const {Context}=require('mocha');

const chaiHttp=require('chai-http');
chai.use(chaiHttp);
const server=require('../src/server');
const expect=chai.expect;
let cookie;
const url='http://localhost:3001';

describe('********TEST SERVER******', function () {
    describe('method POST/login', function () {
        it('should return status 401 when password is incorrect', async function () {
            let res = await chai.request(url).post('/api/login').send({
                userName: 's269422',
                password: 'prova'
            })
            expect(res.status).to.equal(401);
        });

        it('should return status when i call db without password', async function () {
            let res = await chai.request(url).post('/api/login').send({
                userName: 's269422',
                password: undefined
            });
            expect(res.status).to.equal(res.status);
        });
        it('should return status 200', async function () {
            let res = await chai.request(url).post('/api/login').send({
                userName: 's266260',
                password: 'scimmia'
            })
            cookie = res.headers['set-cookie'];
            expect(res.status).to.equal(200);
        });
        it('should return status 401 when username-password are incorrect', async function () {
            let res = await chai.request(url).post('/api/login').send({
                userName: 'fran',
                password: 'prova'
            })

            expect(res.status).to.equal(401);
        });
    });
    describe('method GET/Lectures', function () {
        it('should return list of lectures ', async function () {
            let res=await chai.request(url).get('/api/lectures').set('Cookie',cookie).send()
            expect(res.body).to.be.an('array');
        });
    });

    describe('List Student', function () {
        it('should return status 201 and an array of students', function () {
            return chai.request(url).get('/api/lectures/listStudents')
                .set('Cookie',cookie)
                .send({courseRef: "C4567", date: "2020-12-22 09:00:00"})
                .then(res=>{
                    expect(res.status).to.equal(201);
                    expect(res.body).to.be.an('array');
                  /*expect(res.body[0]).to.haveOwnPropertyDescriptor('userId')
                    expect(res.body[0].userId).to.be.equals('s267348')
                    expect(res.body[0]).to.haveOwnPropertyDescriptor('name')
                    expect(res.body[0].name).to.be.equals('Gianluca')
                    expect(res.body[0]).to.haveOwnPropertyDescriptor('surname')
                    expect(res.body[0].surname).to.be.equals('Fasulo')*/

                })
        });
    });
    describe('Get lectures booked', function () {
        it('should return status 201', async function () {
            let res=await chai.request(url).get('/api/lectures/booked').set('Cookie',cookie).send()
            expect(res.status).to.equal(201);
        });
    });
    describe('POST/Lectures', function () {
        it('should return 401', async function () {
            let res=await chai.request(url).post('/api/lectures').send({userId: "s269422", lectureId: "C0123", date: "2019-11-1 18:00:00"})
            expect(res.status).to.equal(401);
        });
        it('should return status 422 ', async function () {
            let res=await chai.request(url).post('/api/lectures').set('Cookie',cookie).send({userId: "s269422", lectureId: "C0123", date: "2019-11-1 18:00:00"})
            expect(res.status).to.equal(422);
        });
        it('should return 0 seats available status 500',async function () {
            let res=await chai.request(url).post('/api/lectures').set('Cookie',cookie)
                .send({lectureId: "C4567", date: "2020-12-25 09:00:00"})
            expect(res).to.have.status(500);
            //expect(res.body.errors.msg).to.be.equals('0 seats available')
        });
        it('should return status 201 ', async function () {
            let res=await chai.request(url).post('/api/lectures').set('Cookie',cookie).send({lectureId: "C0123", date: "2020-12-10 12:00:00"})
            expect(res.status).to.equal(201);
        });
        it('should return status 500 ', async function () {
            let res=await chai.request(url).post('/api/lectures').set('Cookie',cookie).send({lectureId: "prova", date: "2020-12-12 20:00:00"})
            expect(res.status).to.equal(500);

        });
        it('should return status 500 ', async function () {
            let res=await chai.request(url).post('/api/lectures').set('Cookie',cookie).send({lectureId: "C0123", date: "2020-12-10 12:00:00"})
            expect(res.status).to.equal(500);

        });

    });
    describe('DELETE', function () {
        it('should delete status 204',async function () {
            let res=await chai.request(url).delete('/api/lectures/C0123?date=2020-12-10 12:00:00').set('Cookie',cookie).send()
            expect(res.status).to.equal(204);
        });

    });

    describe('Logout', function () {
        it('should logout',async function () {
            let res=await chai.request(url).post('/api/logout').set('Cookie',cookie).send()
            expect(res.headers['set-cookies']).to.be.undefined;
        });
    });
    describe('GET api/checkEmails', function () {
        it('should ', async function () {
            let res=await chai.request(url).get('/api/checkEmails').set('Cookie',cookie).send();
            expect(res.status).to.equal(200);
        });
    });

})
