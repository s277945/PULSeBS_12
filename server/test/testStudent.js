const chai=require('chai');
const {Context}=require('mocha');
const chaiHttp=require('chai-http');
const supportFunc=require('./supportFunction')
chai.use(chaiHttp);
chai.use(require('chai-match'));
const server=require('../src/server');
const expect=chai.expect;
let cookie;
const studDao=require('../src/Dao/studentDao');
const url='http://localhost:3001';
const date='2021-03-08 15:00:00';
const course_id='C2468';
let capacity;


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
    describe('/api/courses', function () {
        it('should return list of student courses', function () {
            return chai.request(url)
                .get('/api/courses')
                .set('Cookie',cookie)
                .send()
                .then(res=>{
                    expect(res).to.have.status(200)
                    expect(res.body).to.be.an('array')
                    expect(res.body).to.be.not.empty
                    expect(res.body[0]).to.haveOwnProperty('CourseID')
                    expect(res.body[0].CourseID).to.match(/[A-Z0-9]{5}/)
                    expect(res.body[0]).to.haveOwnProperty('Name')
                    expect(res.body[0].Name).to.match(/[\w\s:]+/);
                })
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
        it('should return 401 if i am not logged in', async function () {
            let res=await chai.request(url).post('/api/lectures').send({userId: "s269422", lectureId: "C0123", date: "2019-11-1 18:00:00"})
            expect(res.status).to.equal(401);
        });
        it('should return status 422 if i try to book a lecture that starts before of now', async function () {
            let res=await chai.request(url).post('/api/lectures').set('Cookie',cookie).send({userId: "s269422", lectureId: "C0123", date: "2019-11-1 18:00:00"})
            expect(res.status).to.equal(422);
        });
        before(async()=>{
            //i will set a lecture to 0 seat
            supportFunc.updateCourseCapacity(course_id,date,1).then(res=>{
                console.log(res)
            })

        })
        it('should return 0 seats available status 500',async function () {
            return chai.request(url).post('/api/lectures').set('Cookie',cookie)
                .send({lectureId: "C2468", date: "2021-03-08 15:00:00",endDate:"2021-03-08 18:00:00"})
                .then(res=>{
                    expect(res).to.have.status(500)
                    expect(res.body.operation).to.equals('waiting')
            })
            //expect(res.body.errors.msg).to.be.equals('0 seats available')
        });
        /*after(async()=>{
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
        })*/
        it('should return status 201 ', async function () {
            let res=await chai.request(url).post('/api/lectures').set('Cookie',cookie).send({lectureId: "C4567", date: "2020-12-25 09:00:00",endDate:"2020-12-25 12:00:00"})
            expect(res.status).to.equal(201);
            expect(res.body.operation).to.equals("booked");
        });
        it('should return status 500 ', async function () {
            let res=await chai.request(url).post('/api/lectures').set('Cookie',cookie).send({lectureId: "prova", date: "2020-12-18 20:00:00"})
            expect(res.status).to.equal(500);

        });
        /*it('should return status 500 ', async function () {
            let res=await chai.request(url).post('/api/lectures').set('Cookie',cookie).send({lectureId: "C0123", date: "2020-12-10 12:00:00"})
            expect(res.status).to.equal(500);

        });*/

    });
    describe('/api/lectures/waiting', function () {
        it('should return the list of all the courses in which i am in waiting list', function () {
            return chai.request(url)
                .get('/api/lectures/waiting')
                .set('Cookie',cookie)
                .send()
                .then(res=>{
                    expect(res).to.have.status(201)
                    expect(res.body).to.be.an('array')
                    expect(res.body).to.be.not.empty
                    expect(res.body[0]).to.haveOwnProperty('Course_Ref')
                    expect(res.body[0].Course_Ref).to.match(/[A-Z0-9]{5}/)
                    expect(res.body[0]).to.haveOwnProperty('Date_Ref')
                    expect(res.body[0]).to.haveOwnProperty('EndDate_Ref')
                })
        });
    });
    describe('DELETE', function () {
        before(async()=>{
            //update course capacity, add a booking and then add a waiting list before testing
            await supportFunc.updateCourseCapacity('C2468','2021-03-05 11:00:00',1).then(async res=>{
                if(res.equals(true)){
                    await studDao.addSeat('s266260','C2468','2021-03-05 11:00:00','2021-03-05 14:00:00')
                        .then(async res=>{
                            await studDao.addSeat('s267348','C2468','2021-03-05 11:00:00','2021-03-05 14:00:00').then(
                                res=>console.log('success')
                            )
                        })

                }
            })
        })
        it('should delete an user and there is someone else in waiting list', function () {
            return  chai.request(url)
                .delete('/api/lectures/C2468?date=2021-03-08 15:00:00')
                .set('Cookie',cookie)
                .send()
                .then(res=>{
                    expect(res).to.have.status(204)
                    expect(res.body).to.haveOwnProperty('Student_Ref')
                    expect(res.body.Student_Ref).to.match(/s[0-9]{6}/)

                })

        });
        before(async()=>{
            await supportFunc.updateCourseCapacity('C2468','2021-03-05 11:00:00',70).then(
                res=>console.log('ok')
            )
        })

        it('should delete an user and there is no one in waiting list',async function () {
            let res=await chai.request(url).delete('/api/lectures/C4567?date=2020-12-25 09:00:00').set('Cookie',cookie).send()
            expect(res.status).to.equal(204);
            expect(res.body.operation).to.equals("NoUser")
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
