

describe('TEACHER PAGE', function () {
    beforeEach(() => {
        cy.visit('http://localhost:3000/')
        cy.teacher('t987654','scimmia','t')
        Cypress.Cookies.preserveOnce('token', 'value')
        Cypress.Cookies.debug(true)
    })
    it('should render correctly teacher page', function () {
        cy.location('pathname').should('include','teacherHome')
        cy.get('.page-title').should('have.text','Lectures')

    });
    it('should reload teacher page', function () {
        cy.location('pathname').should('include','/teacherHome')
        cy.reload()
        cy.location('pathname').should('include','/teacherHome')
    });
    it('should render correctly student list page', function () {
        cy.get('[data-testid="teacherStudent"]').should('have.text', 'Student List')
                .should('have.attr', 'href', '#studentList')
                .click()
        cy.get('.page-title').should('have.text','Student list')

    });
    it('should reload teacher student page', function () {
        cy.get('[data-testid="teacherStudent"]').should('have.text', 'Student List')
            .should('have.attr', 'href', '#studentList')
            .click()
        cy.hash().should('include', '#studentList')
        cy.reload()
        cy.location('pathname').should('include','/')
    });
    it('should render modal student list page', function () {
        cy.get('[data-testid="teacherStudent"]').should('have.text', 'Student List')
            .should('have.attr', 'href', '#studentList')
            .click()
        cy.get('tbody>tr').eq(0).find('.btn.btn-primary').should('have.text','SHOW LIST')
            .click()
        cy.wait(100)
        cy.get('[data-testid="studentsList"]').should('be.visible')
            .within(()=>{
                cy.get('tr').eq(0).should('contain','s266260')
            })
        cy.get('.modal').should('be.visible')
            .click({ force: true });

    });
    it('should reload modal student when refresh page', function () {
        cy.get('[data-testid="teacherStudent"]').should('have.text', 'Student List')
            .should('have.attr', 'href', '#studentList')
            .click()
        cy.get('tbody>tr').eq(0).find('.btn.btn-primary').should('have.text','SHOW LIST')
            .click()
        cy.wait(100)
        cy.get('[data-testid="studentsList"]').should('have.length', 1)
            .within(()=>{
                cy.get('tr').eq(0).should('contain','s266260')
            })

        cy.reload()
        cy.get('.modal').should('be.visible')
    });
    it('should render modal lectures page', function () {
        cy.get('[data-testid="lecturesPage"]')
            .click()
        cy.get('tbody>tr')
            .eq(1).find('.btn.btn-primary')
            .should('have.text', 'SELECT')
            .should('be.visible')
            .click();
        cy.get('.modal').should('be.visible')
            .within(()=>{
                cy.get('.btn.btn-danger')
                    .should('have.text', 'CANCEL LECTURE')
                cy.get('.btn.btn-info')
                    .should('have.text', 'TURN INTO DISTANCE LECTURE')
            })
            .click({ force: true })
        cy.get('[data-testid="homeRedirect"]')
            .should('be.visible')
            .click()
        cy.location('pathname').should('include','/')
    });
    it('should not turn into a distance lecture', function () {
        cy.get('tbody>tr')
            .eq(1).find('.btn.btn-primary')
            .should('have.text', 'SELECT')
            .should('be.visible')
            .click();
        cy.get('.modal').should('be.visible')
            .within(()=>{
                cy.get('.btn.btn-info')
                    .should('have.text', 'TURN INTO DISTANCE LECTURE')
                    .click()
            })
        cy.get('[data-testid="popup"]').should('be.visible')
            .within(()=>{
                cy.get('p')
                    .should('be.visible')
                    .and('have.text','Do you want to turn this lecture into a distance lecture ?')
                cy.get('.btn.btn-info')
                    .should('not.be.disabled')
                    .and('have.text','Yes')
                cy.get('.btn.btn-secondary')
                    .should('be.visible')
                    .and('have.text','No')
                    .click()
            })
        cy.get('tbody>tr').should('have.length',4)

    });
    it('should press cancel lecture, but click on button No', function () {
        cy.get('tbody>tr')
            .eq(1)
            .find('.btn.btn-primary')
            .should('have.text', 'SELECT')
            .should('be.visible')
            .click();
        cy.get('.modal')
            .should('be.visible')
            .within(()=>{
                cy.get('.btn.btn-danger')
                    .should('have.text','CANCEL LECTURE')
                    .should('not.be.disabled')
                    .click()
            })
        cy.wait(100);
        cy.get('[data-testid="popup"]')
            .should('be.visible')
            .within(()=>{
                cy.get('p').should('have.text','Do you want to cancel this lecture ?')
                cy.get('.btn.btn-danger')
                    .should('be.enabled')
                    .and('have.text','Yes')
                cy.get('.btn.btn-secondary')
                    .should('be.enabled')
                    .and('have.text','No')
                    .click()
            })
        cy.wait(20)
        cy.get('.modal')
            .should('be.visible')
    });
    it('should cancel correctly a lecture', function () {
        cy.server()
        cy.route({
            method:'DELETE',
            url:'/api/courseLectures/*',
            status:204,
            response:{lecture: "canceled"}
        })
        cy.get('tbody>tr')
            .eq(1)
            .find('.btn.btn-primary')
            .should('have.text', 'SELECT')
            .should('be.visible')
            .click();
        cy.get('.modal')
            .should('be.visible')
            .within(()=>{
                cy.get('.btn.btn-danger')
                    .should('have.text','CANCEL LECTURE')
                    .should('not.be.disabled')
                    .click()
            })
        cy.wait(100);
        cy.get('[data-testid="popup"]')
            .should('be.visible')
            .within(()=>{
                cy.get('p').should('have.text','Do you want to cancel this lecture ?')
                cy.get('.btn.btn-danger')
                    .should('be.enabled')
                    .and('have.text','Yes')
                    .click()
            })
        cy.wait(20)
        cy.get('tbody>tr')
            .should('have.length',3)
    });
    it('should turn into distance lecture correctly', function () {
        cy.server()
        cy.route({
            method:'PUT',
            url:'/api/lectures',
            status:200,
            response:{response: true}
        })
        cy.get('tbody>tr')
            .eq(1).find('.btn.btn-primary')
            .should('have.text', 'SELECT')
            .should('be.visible')
            .click();
        cy.get('.modal').should('be.visible')
            .within(()=>{
                cy.get('.btn.btn-info')
                    .should('have.text', 'TURN INTO DISTANCE LECTURE')
                    .click()
            })
        cy.get('[data-testid="popup"]').should('be.visible')
            .within(()=>{
                cy.get('p')
                    .should('be.visible')
                    .and('have.text','Do you want to turn this lecture into a distance lecture ?')
                cy.get('.btn.btn-info')
                    .should('not.be.disabled')
                    .and('have.text','Yes')
                    .click()
            })
        cy.wait(100)
        cy.get('tbody>tr')
            .should('have.length',4)

    });
    it('should not cancel a lecture 60 minute before lecture', function () {
        cy.server()
        cy.route({
            method:'DELETE',
            url:'/api/courseLectures/*',
            status:500,
            response:{error: "Delete lecture deadline expired"}
        })
        cy.get('tbody>tr')
            .contains('td','HCI Les:1')
            .siblings()
            .find('.btn.btn-primary')
            .should('have.text', 'SELECT')
            .should('be.visible')
            .click();
        cy.get('.modal')
            .should('be.visible')
            .within(()=>{
                cy.get('.btn.btn-danger')
                    .should('have.text','CANCEL LECTURE')
                    .should('be.disabled')
                cy.wait(100);
            }).click({force:true})
        cy.wait(20)
        cy.get('tbody>tr')
            .should('have.length',4)
    });
    it('should not turn into distance lecture 30 minute before', function () {
        cy.server()
        cy.route({
            method:'PUT',
            url:'/api/lectures',
            status:422,
            response:{error: "Cannot modify type of lecture after 30 minutes before scheduled time"}
        })
        cy.get('tbody>tr')
            .contains('td','HCI Les:1')
            .siblings()
            .find('.btn.btn-primary')
            .should('have.text', 'SELECT')
            .should('be.visible')
            .click();
        cy.get('.modal').should('be.visible')
            .within(()=>{
                cy.get('.btn.btn-info')
                    .should('be.disabled')

            }).click({force:true})
        cy.get('tbody>tr')
            .should('have.length',4)
    });
    it('should render teacher stats', function () {
        cy.get('[data-testid="history"]')
            .click()
        cy.wait(200)
        cy.hash().should('include','#history')
        cy.get('.page-title')
            .should('have.text','Historical Data')

    });
    it('should show stats by week', function () {
        cy.get('[data-testid="history"]')
            .click()
        cy.wait(200)
        cy.get('select').first()
            .select('Week')
    });
    it('should show stats by month', function () {
        cy.get('[data-testid="history"]')
            .click()
        cy.wait(200)
        cy.get('select').first()
            .select('Month')
    });

    it('should logout', function () {
        cy.location('pathname').should('include','/teacherHome')
        cy.get('[data-testid="logout"]')
            .click()
        cy.location('pathname').should('include','/')
        cy.wait(1000)
        cy.getCookies().should('be.empty')
    });
    it('should redirect if i am using an expired cookie', function () {
        cy.clearCookies()
        cy.location('pathname').should('include','teacherHome')

        cy.reload({force: true})
        cy.location('pathname').should('include', '/')
    });


});


