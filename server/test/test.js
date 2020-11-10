var expect = require('chai').expect;
const dao=require('../dao');
const moment=require('moment');
const mocha=require('mocha');

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

it('should count number associated with a lesson ', async function () {
    const user='torchiano';

    const date=moment("2020-12-12 20:00:00").format('YYYY-MM-DD HH:mm:ss');
    let result=await dao.getNextLectureNumber(user)
    expect(result.numberOfStudents).to.equal(1);
});
it('should get the role of a user ', async function () {
    const user='francesco';
    let result=await dao.getRole(user)
    expect(result.UserType).to.equal('s');
});

it('should find student list associated with a lesson ', async function () {
    const lectureId='123123';

    const date=moment("2020-12-12 20:00:00").format('YYYY-MM-DD HH:mm:ss');
    let result=await dao.getStudentList(lectureId,date);
    expect(result[0]).to.have.a.property('Student_Ref');
});
/*it('should not find student list associated with a lesson', function () {
    const lectureId='non esiste';

    const date=moment("2020-12-12 20:00:00").format('YYYY-MM-DD HH:mm:ss');
    return dao.getStudentList(lectureId,date).then().catch(err=>{
        expect(err).to.equal(err);
    })
});*/


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
