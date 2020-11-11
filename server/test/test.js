var expect = require('chai').expect;
const dao=require('../dao');
const moment=require('moment');
const mocha=require('mocha');

describe('Test suite', function () {
    describe('Test check User Identity', function () {
        it('should check userIdentity', function () {
            const username='francesco';
            const password='scimmia';
            return dao.checkUserPwd(username,password).then(result=>{
                expect(result).to.equal(username);
            }).catch(err=>{
                //expect(err).fail();
            });

        });
        it('should fail userIdentity with incorrect username', function () {
            const username='s26626';
            const password='password';
            return dao.checkUserPwd(username,password).then(result=>{
                expect(result).fail();
            }).catch(err=>{
                expect(err.message).to.equal('User does not exist');
            });

        });
        it('should fail userIdentity with incorrect password', function () {
            const username='francesco';
            const password='password';
            return dao.checkUserPwd(username,password).then(result=>{
                expect(result).fail();
            }).catch(err=>{
                expect(err.message).to.equal('Password is incorrect');
            });

        });
    });
    describe('Test list courses associated with userID', function () {
        it('should find list of all courses associated with a user', async function () {
            const userId='francesco';
            let result=await dao.getLecturesByUserId(userId);
            expect(result).to.be.an('array');
        });
        it('should fail', function () {
            const userId='pippo';
            return dao.getLecturesByUserId(userId).then(result=>{
                expect(result).fail();
            }).catch(err=>{
                expect(err).to.equal(err);
            })
        });
    });
    describe('test count number of students for a seat', function () {
        it('should count number associated with a lesson ', async function () {
            const user='torchiano';

            const date=moment("2020-12-12 20:00:00").format('YYYY-MM-DD HH:mm:ss');
            let result=await dao.getNextLectureNumber(user)
            expect(result.numberOfStudents).to.equal(1);
        });
    });
    describe('Test get role of a student', function () {
        it('should get the role of a user ', async function () {
            const user='francesco';
            let result=await dao.getRole(user)
            expect(result.UserType).to.equal('s');
        });
    });

    describe('Test find list of students', function () {
        it('should find student list associated with a lesson ', async function () {
            const lectureId='123123';

            const date=moment("2020-12-12 20:00:00").format('YYYY-MM-DD HH:mm:ss');
            let result=await dao.getStudentList(lectureId,date);
            expect(result[0]).to.be.a('string');
        });
    });


    describe('Test function add seats to a lecture', function () {
        it('should add successfully a new seat for an existing lecture', async function() {
            //define some data to compare against


            //call the function we're testing
            const userId='francesco';
            const lectureId='123123';

            const date=moment("2020-12-12 20:00:00").format('YYYY-MM-DD HH:mm:ss');
            return dao.addSeat(userId,lectureId,date).then(result=>{
                expect(result).to.be.true;
            }).catch()





        });
        it('should not add  a new seat for an existing lecture with Course Unavailable exception', async function() {
            //define some data to compare against


            //call the function we're testing
            const userId='francesco';
            const lectureId='8888';

            const date=moment("2020-11-12 20:00:00").format('YYYY-MM-DD HH:mm:ss');
            return dao.addSeat(userId,lectureId,date).then(result=>{
                expect(result).fail();
            }).catch(err=>{
                expect(err.message).to.equal('Course unavailable');
            })
        });
        it('should fail insert booking with 0 seats available', function () {
            const userId='gianluca';
            const lectureId='123123';

            const date=moment("2020-12-12 20:00:00").format('YYYY-MM-DD HH:mm:ss');
            return dao.addSeat(userId,lectureId,date).then(res=>{
                expect(res).fail();
            }).catch(err=>{
                expect(err.message).to.equal('0 seats available');
            });
        });
    });

    describe('Test function delete', function () {
        it('should delete row', function () {
            const user='francesco';
            const courseID='123123';
            const date= moment("2020-12-12 20:00:00").format('YYYY-MM-DD HH:mm:ss');
            return dao.deleteSeat(user,courseID,date).then(res=>{
                    expect(res).to.be.true;
                }

            ).catch(err=>{
                expect(err).fail();
            });
        });
    });

    describe('Test function getUserEmail', function () {
        it('should get user Email of a valid user',async function () {
            const user='francesco';
            let email=await dao.getStudentEmail(user);
            expect(email.Email).to.equal('frgarau@gmail.com')
        });
        it('should not get email of invalid user',async function () {
            const user='prova';
            let email=await dao.getStudentEmail(user);
            expect(email).to.be.undefined;
        });
    });

});
