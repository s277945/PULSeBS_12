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
