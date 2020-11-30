
const chai=require('chai');
const {before,after,describe,it}=require('mocha');
const dao=require('../src/dao');
const chaiHttp=require('chai-http');
chai.use(chaiHttp);
const server=require('../src/server');
const expect=chai.expect;
let cookie;
const url='http://localhost:3001';
const db=require('../src/db');

function insertDeletedRow(Course_Ref,Name,Date,DateDeadline,Capacity){
    return new Promise(((resolve, reject) => {
        const sql='INSERT INTO Lecture(Course_Ref,Name,Date,DateDeadline,Capacity,Type) VALUES(?,?,?,?,?,?)';
        db.run(sql,[
            Course_Ref,Name,Date,DateDeadline,Capacity,'p'
        ],function(err){
            if(err)
                reject(err);
            else
                resolve(true);
        });
    }))
}
function restoreTypeLecture(Course_Ref,Date){
    return new Promise((resolve, reject) => {
        const sql='UPDATE Lecture SET Type="p" WHERE Course_Ref=? AND Date=?'
        db.run(sql,[Course_Ref,Date], function(err){
            if(err)
                reject(err);
            else
                resolve(true);
        })
    })
}

describe('TEACHER TESTING', function () {
    //login teacher and saves its session before to do other stuffs
    before(async() => {
        let res = await chai.request(url).post('/api/login').send({
            userName: 't987654',
            password: 'scimmia'
        })
        cookie = res.headers['set-cookie'];
    })
    describe('/api/courses', function () {
        it('should return 200 and courses list', function () {
            return chai.request(url)
                .get('/api/courses')
                .set('Cookie',cookie)
                .send()
                .then(res=>{
                    expect(res).to.have.status(200)
                    expect(res.body).to.be.an('array')
                    expect(res.body[0]).to.haveOwnPropertyDescriptor('Name')
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
                .delete('/api/courseLectures/C4567?date=2020-12-11 14:00:00')
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
                    expect(res.body[0]).to.haveOwnPropertyDescriptor('lectureName')
                    expect(res.body[0]).to.haveOwnPropertyDescriptor('date')
                    expect(res.body[0]).to.haveOwnPropertyDescriptor('nBooked')
                    expect(res.body).to.have.lengthOf(3)
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
        it('should return week stats of second semester',async function () {
            let res=await chai.request(url)
                .get('/api/weekStats/C8901')
                .set("Cookie",cookie)
                .send()
                    expect(res).to.have.status(200)
                    /*expect(res.body).to.be.an('array')
                    expect(res.body).to.be.not.empty;
                    expect(res.body[0]).to.haveOwnPropertyDescriptor('weekName')
                    expect(res.body[0]).to.haveOwnPropertyDescriptor('average')*/

        });
    });
    after(async()=>{
        const course_id='C4567';
        let date='2020-12-22 09:00:00';
        await restoreTypeLecture(course_id,date);
        const course_Ref='C4567';
        const userId='s266260';
        date='2020-12-11 14:00:00';
        const deadline='2020-12-17 23:00:00';
        const name='PDS Les:3';
        const capacity=70;
        await insertDeletedRow(course_Ref,name,date,deadline,capacity);
        await dao.addSeat(userId,course_id,date);
        let res=await chai.request(url).post('/api/logout').set('Cookie',cookie).send();
    })
});
