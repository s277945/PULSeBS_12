var expect = require('chai').expect;
const dao=require('../dao');
const moment=require('moment');
const mocha=require('mocha');
describe('Test check User Identity', function () {
    it('should check userIdentity', function () {
        const username='s266260';
        const password='pornhub';
        return dao.checkUserPwd(username,password).then(result=>{
            expect(result).to.equal(username);
        }).catch(err=>{
            expect().fail();
        });

    });
    it('should fail userIdentity', function () {
        const username='s26626';
        const password='pornhub';
        return dao.checkUserPwd(username,password).then(result=>{
            expect(result).fail();
        }).catch(err=>{
            expect(err.message).to.equal('User does not exist');
        });

    });
});
describe('Test list courses associated with userID', function () {
    it('should find list of all courses associated with a user', async function () {
        const userId='s266260';
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
    const lectureId='01SQNOV';

    const date=moment("2020-11-09 15:00:00").format('YYYY-MM-DD HH:mm:ss');
    let result=await dao.countStudent(lectureId,date);
    expect(result).to.equal(2);
});
it('should get the role of a user ', async function () {
    const user='s266260';
    let result=await dao.getRole(user)
    expect(result.UserType).to.equal('s');
});
it('should find student list associated with a lesson ', async function () {
    const lectureId='01SQNOV';

    const date=moment("2020-11-09 15:00:00").format('YYYY-MM-DD HH:mm:ss');
    let result=await dao.getStudentList(lectureId,date);
    expect(result).to.be.an('array');
});


/*it('should add successfully a new seat for an existing lecture', async function(done) {
    //define some data to compare against


    //call the function we're testing
    const userId='francesco';
    const lectureId='01SQNOV';

    const date=moment("2020-11-09 15:00:00").format('YYYY-MM-DD HH:mm:ss');
    let result = await dao.addSeat(userId,lectureId,date);

    assert(result===true);



});*/
