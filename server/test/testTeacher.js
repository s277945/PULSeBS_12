const chai=require('chai');
const {before,after,describe,it}=require('mocha');

const chaiHttp=require('chai-http');
chai.use(chaiHttp);
const server=require('../server');
const expect=chai.expect;
let cookie;
const url='http://localhost:3001';
const db=require('../db');

function insertDeletedRow(){

}
function restoreTypeLecture(){

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
    describe('DELETE FUNCTION', function () {
        it('should return status 500',async function () {
           let res=await chai.request(url).delete('/api/courseLectures/C4567?date=2020-11-15 09:00:00').set('Cookie',cookie).send()
               .end((err,res)=>{
                   expect(err).to.deep.equals("Delete lecture deadline expired");
                   expect(res.status).to.equal(500);
               })

        });
        it('should return status 204',async function () {
            let res=await chai.request(url).delete('/api/courseLectures/C4567?date=2020-12-11 14:00:00').set('Cookie',cookie).send()
                .end((err,res)=>{
                    expect(err).to.be.null;
                    expect(res).to.have.status(204);
                    expect(res.body.lecture).to.deep.equals('canceled');
                })


        });
        after(()=>{
            insertDeletedRow();
        })
    });
    describe('CHANGE TYPE OF LECTURE', function () {
        it('should return status 422', async function () {
            let res=await chai.request(url).put('/api/lectures').set("Cookie",cookie)
                .send({courseId: "",date:""})
                .end((err,res)=>{
                    expect(err.error).to.deep
                        .equals("Cannot modify type of lecture after 30 minutes before scheduled time");
                    expect(res).to.have.status(422);
                })
        });
        it('should return status 200',async function () {
            let res=await chai.request(url).put('/api/lectures').set("Cookie",cookie)
                .send({courseId: "",date:""})
                .end((err,res)=>{
                    expect(err).to.be.null;
                    expect(res).to.have.status(200);
                    expect(res.body.response).to.deep.equals(true);
                });
        });
    });
    describe('GET COURSE STATS BY COURSE_ID', function () {
        it('should return status 200',async function () {
            let res=await chai.request(url).get("/api/courseStats/:courseId")
                .set("Cookie",cookie)
                .send()
                .end((err,res)=>{
                    expect(res).to.have.status(200);
                });
        });
        it('should return status 500',async function () {
            let res=await chai.request(url).get("/api/courseStats/:courseId")
                .set("Cookie",cookie)
                .send()
                .end((err,res)=>{

                });
        });
    });
    describe('GET HISTORICAL STATS', function () {
        it('should return status 200',async function () {
            let res=await chai.request(url).get('/api/historicalStats/:courseId')
                .set("Cookie",cookie)
                .send()
                .end((err,res)=>{
                    expect(res).to.have.status(200);
                });
        });
        it('should return status 500',async function () {
            let res=await chai.request(url).get('/api/historicalStats/:courseId')
                .set("Cookie",cookie)
                .send()
                .end((err,res)=>{

                });
        });
    });

});
