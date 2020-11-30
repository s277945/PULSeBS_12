describe('STUDENT PAGE', function () {
    beforeEach(() => {
        cy.visit('http://localhost:3000/')
        cy.get('input:first').type('s269422').should('have.value','s269422')
        cy.get('input:last').type('scimmia').should('have.value','scimmia')
        cy.get('.btn.btn-primary')
            .click()
        Cypress.Cookies.preserveOnce('token', 'value')
        Cypress.Cookies.debug(true)
    })
    it('should show correctly student page', function () {
        cy.location('pathname').should('include','/studentHome')
        cy.get('.page-title')
            .should('be.visible')
            .should('have.text','Lectures')
        cy.get('tbody>tr')
            .should('have.length',5)
            .eq(0)
            .within(()=>{
                cy.get('td').eq(0).should('have.text','SE2 Les:1')
                cy.get('td').eq(1).should('have.text','2020-12-10 12:00:00')
                cy.get('.btn.btn-primary').should('be.disabled')
                    .should('have.text','Book Seat')
                cy.get('.btn.btn-danger').should('not.be.disabled')
                    .should('have.text', 'Cancel')
            })
    });

    it('should reload correctly the same page', function () {
        cy.wait(100)
        cy.location('pathname').should('include', '/studentHome')
        cy.reload()
        cy.location('pathname').should('include','/studentHome')
    });
    it('should not redirect to login page', function () {
        cy.wait(200)
        cy.location('pathname').should('include','/studentHome')
        cy.visit('http://localhost:3000')
        cy.wait(200)
        cy.location('pathname').should('include','/studentHome')
    });
    it('should reload calendar page', function () {
        cy.get('[data-testid="calendar"]')
            .should('be.visible')
            .click()
        cy.hash().should('include','#calendar')
        cy.reload()
        cy.location('pathname').should('include','/')
    });
    it('should redirect to calendar and home', function () {


        cy.get('[data-testid="studentLectures"]')
            .click()
        cy.location('pathname').should('include','/studentHome')
        cy.get('[data-testid="home"]')
            .click()
        cy.location('pathname').should('include','/')
        cy.get('[data-testid="calendar"]').should('be.visible')
            .click()
        cy.wait(100)
        cy.location('pathname').should('include','/studentHome')
    });
    it('should open correctly modal to cancel a seat and press nothing', function () {
        cy.wait(200)
        cy.get('[data-testid="studentLectures"]')
            .click()
        cy.get('tbody>tr').eq(0).within(()=>{
            cy
                .get('.btn.btn-danger')
                .should('be.enabled')
                .click()
        })
        cy.wait(10)
        cy.get('.modal')
            .should('be.visible')
            .within(()=>{
                cy.get('p')
                    .should('have.text', 'Do you want to cancel your booking for this lecture?')
                cy.get('.btn.btn-secondary')
                    .should('be.visible')
                    .should('have.text','No')
                cy.get('.btn.btn-danger')
                    .should('be.visible')
                    .should('have.text', 'Yes')
            })
            .click({force: true})


    });
    it('should open correctly modal to cancel a seat ', function () {
        cy.wait(200)
        cy.get('tbody>tr').eq(0).within(()=>{
            cy.get('.btn.btn-danger')
                .click()
        })
        cy.get('.modal')
            .should('be.visible')
            .within(()=>{
                cy.get('.btn.btn-danger')
                    .click()

            })
        cy.get('tbody>tr').eq(0).within(()=>{
            cy.get('.btn.btn-danger')
                .should('not.be.enabled')
        })
    });
    it('should open correctly modal to book a seat', function () {
        cy.wait(200)
        cy.get('tbody>tr').eq(0).within(()=>{
            cy.get('.btn.btn-primary')
                .should('be.enabled')
                .click()
        })
        cy.wait(10)
        cy.get('.modal')
            .within(()=>{
                cy.get('p')
                    .should('be.visible')
                    .should('have.text','Do you want to book a seat for this lecture?')
                cy.get('.btn.btn-secondary')
                    .should('have.text','No')
                cy.get('.btn.btn-primary')
                    .should('be.visible')
                    .should('have.text', 'Yes')
                    .click()
            })
        cy.get('tbody>tr').eq(0).within(()=>{
            cy.get('.btn.btn-primary')
                .should('not.be.enabled')
        })
    });
    it('should not book a seat when a room is full', function () {
        //PDS Les:5
        cy.get('tbody>tr')
            .contains('td','PDS Les:5')
            .siblings()
            .find('.btn.btn-primary')
            .should('be.enabled')
            .click()
        cy.wait(100)
        cy.get('.modal')
            .within(()=>{
                cy.get('p')
                    .should('be.visible')
                    .should('have.text','Do you want to book a seat for this lecture?')
                cy.get('.btn.btn-secondary')
                    .should('have.text','No')
                cy.get('.btn.btn-primary')
                    .should('be.visible')
                    .should('have.text', 'Yes')
                    .click()
            })
        cy.wait(100)
        cy.get('[data-testid="popup_student"]')
            .should('be.visible')
            .within(()=>{
                cy.get('.btn.btn-secondary')
                    .should('have.text','Close')
                    .click()
            })


    });
    it('should logout', function () {
        cy.location('pathname').should('include','/studentHome')
        cy.get('[data-testid="logout"]').should('be.visible')
            .click()
        cy.wait(1000)
        cy.getCookies().should('be.empty')
        cy.location('pathname').should('include','/')
    });
});
describe('TEST AXIOS INTERCEPTOR', function () {
    beforeEach(() => {
        cy.clearCookies()
        Cypress.Cookies.debug(true)
    })
    it('should setup next test', function () {
        cy.visit('http://localhost:3000/')
        cy.get('input:first').type('t987654').should('have.value','t987654')
        cy.get('input:last').type('scimmia').should('have.value','scimmia')
        cy.get('.btn.btn-primary')
            .click()
        cy.location('pathname').should('include','/teacherHome')
        cy.get('[data-testid="teacherStudent"]').should('have.text', 'Student List')
            .should('have.attr', 'href', '#studentList')
            .click()
        //cy.clearCookies()
        cy.wait(100)
        cy.location('pathname').should('include','/teacherHome')
    });
    it('should return 401', function () {
        cy.get('tbody>tr').eq(0).within(()=>{
            cy.get('.btn.btn-primary')
                .click()
        })
        cy.wait(200)
        cy.location('pathname').should('include','/')
    });
});