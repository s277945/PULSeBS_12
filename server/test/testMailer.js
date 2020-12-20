const {expect} = require("chai");
const mailer = require("../src/mail_mod");
const db=require('../src/db')
describe('TEST MAIL MODULE', function () {
    beforeEach(()=>{
        db.run("BEGIN")
    })
    afterEach(()=>{
        db.run("ROLLBACK")
    })
    it('should not be null', function () {
        expect(mailer).to.not.be.null;
    });
//the test is time dependent, because it starts the first second of the first minute
    /*it('task should be scheduled', async function () {
        const job=mailer.job;
        job.start();
        await setTimeout(function () {
            expect(job.getStatus()).to.be.equal('running');
        },600)
    });*/

});




