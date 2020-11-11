const chai=require('chai');
const chaiHttp=require('chai-http');
chai.use(chaiHttp);
const server=require('../server');
const expect=chai.expect;
let cookie;
describe('', function () {
    describe('POST/login', function () {
        it('should return status 401', async function () {
            let res=await chai.request('http://localhost:3001').post('/api/login').send({userName:'francesco',password:'prova'})

            expect(res.status).to.equal(401);
        });
    });
    describe('POST/login', function () {
        it('should return status 401', async function () {
            let res=await chai.request('http://localhost:3001').post('/api/login').send({userName:'fran',password:'prova'})

            expect(res.status).to.equal(401);
        });
    });
    describe('POST/login', function () {
        it('should return status 200', async function () {
            let res=await chai.request('http://localhost:3001').post('/api/login').send({userName:'francesco',password:'scimmia'})
            cookie=res.headers['set-cookie'];
            expect(res.status).to.equal(200);
        });
    });
    describe('GET/Lectures', function () {
        it('should return list of lectures ', async function () {
            let res=await chai.request('http://localhost:3001').get('/api/lectures').set('Cookie',cookie).send()
            expect(res.body).to.be.an('array');
        });
    });
    describe('POST/Lectures', function () {
        it('should return 401', async function () {
            let res=await chai.request('http://localhost:3001').post('/api/lectures').send({userId: "francesco", lectureId: "123123", date: "2019-11-1 18:00:00"})
            expect(res.status).to.equal(401);
        });
        it('should return status 422 ', async function () {
            let res=await chai.request('http://localhost:3001').post('/api/lectures').set('Cookie',cookie).send({userId: "francesco", lectureId: "123123", date: "2019-11-1 18:00:00"})
            expect(res.status).to.equal(422);
        });
        it('should return status 201 ', async function () {
            let res=await chai.request('http://localhost:3001').post('/api/lectures').set('Cookie',cookie).send({userId: "francesco", lectureId: "123123", date: "2020-12-12 20:00:00"})
            expect(res.status).to.equal(201);
        });
        it('should return status 500 ', async function () {
            let res=await chai.request('http://localhost:3001').post('/api/lectures').set('Cookie',cookie).send({userId: "francesco", lectureId: "prova", date: "2020-12-12 20:00:00"})
            expect(res.status).to.equal(500);

        });
        it('should return status 500 ', async function () {
            let res=await chai.request('http://localhost:3001').post('/api/lectures').set('Cookie',cookie).send({userId: "francesco", lectureId: "123123", date: "2020-12-12 20:00:00"})
            expect(res.status).to.equal(500);

        });

    });
    describe('DELETE', function () {
        it('should delete status 204',async function () {
            let res=await chai.request('http://localhost:3001').delete('/api/lectures/123123?date=2020-12-12 20:00:00').set('Cookie',cookie).send()
            expect(res.status).to.equal(204);
        });

    });
    describe('next lecture', function () {
        it('should get response state 201',async function () {
            let res=await chai.request('http://localhost:3001').get('/api/lectures/next').set('Cookie',cookie).send()
            expect(res.status).to.equal(201);
        });
    });
    describe('List Student', function () {
        it('should get response state 201',async function () {
            let res=await chai.request('http://localhost:3001').get('/api/lectures/listStudents').set('Cookie',cookie).send({courseRef: "123123", date: "2020-12-12 20:00:00"})
            expect(res.status).to.equal(201);
        });
    });
    describe('Logout', function () {
        it('should logout',async function () {
            let res=await chai.request('http://localhost:3001').post('/api/logout').set('Cookie',cookie).send()
            expect(res.headers['set-cookies']).to.be.undefined;
        });
    });
    describe('Get lectures booked', function () {
        it('should return status 201', async function () {
            let res=await chai.request('http://localhost:3001').get('/api/lectures/booked').set('Cookie',cookie).send()
            expect(res.status).to.equal(201);
        });
    });
});
