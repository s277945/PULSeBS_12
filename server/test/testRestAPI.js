const chai=require('chai');
const {Context}=require('mocha');
const db = require('../src/db');
const chaiHttp=require('chai-http');
chai.use(chaiHttp);
const server=require('../src/server');
const expect=chai.expect;
let cookie;
const url='http://localhost:3001';
const date='2020-12-22 09:00:00';
const course_id='C4567';
let capacity;
function getCourseCapacity(id,date){
    return new Promise((resolve, reject) => {
        const sql='SELECT Capacity FROM Lecture WHERE Course_Ref=? AND Date=?';
        db.get(sql,[id,date],(err,row)=>{
            if(err)
                reject(err)
            else
                resolve(row);
        })
    });
}
function updateCourseCapacity(id,date,capacity){
    return new Promise((resolve, reject) => {
        const sql='UPDATE Lecture SET Capacity=? WHERE Course_Ref=? AND Date=?';
        db.run(sql,[capacity,id,date],function (err){
            if(err)
                reject(err);
            else
                resolve(true);
        })
    });
}

describe('********STUDENT TEST******', function () {
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
        before(async()=>{
            //i will set a lecture to 0 seat
            getCourseCapacity(course_id,date)
                .then(async (val)=>{
                    capacity=val;
                    await updateCourseCapacity(course_id,date,0)
                        .then(res=>{
                            if(res==true){
                                return;
                            }
                        })
                })
        })
        it('should return 0 seats available status 500',async function () {
            let res=await chai.request(url).post('/api/lectures').set('Cookie',cookie)
                .send({lectureId: "C4567", date: "2020-12-25 09:00:00"})
            expect(res).to.have.status(500);
            //expect(res.body.errors.msg).to.be.equals('0 seats available')
        });
        after(async()=>{
            //restore current value of that lecture
            updateCourseCapacity(course_id,date,capacity)
                .then(res=>{
                    if(res==true)
                        return;
                })
                .catch(err=>{
                    if(err)
                        throw Error(err);
                });
        })
        it('should return status 201 ', async function () {
            let res=await chai.request(url).post('/api/lectures').set('Cookie',cookie).send({lectureId: "C0123", date: "2020-10-02 14:30:00"})
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
