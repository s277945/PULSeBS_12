describe('TEST MANAGER PAGE', function () {
    beforeEach(()=>{
        cy.visit('http://localhost:3000/')
        cy.get('input:first').type('b123456')
        cy.get('input:last').type('scimmia')
        cy.get('.btn.btn-primary')
            .click()
        Cypress.Cookies.preserveOnce('token', 'value')
        Cypress.Cookies.debug(true)
    })
    it('should load correctly manager page', function () {
        cy.location('pathname').should('include','/bookingHome')
    });
    it('should render', function () {
        cy.get('nav')
            .should('include.text','PULSeBS - SystemActivity')


    });
    after(()=>{
        cy.get('[data-testid="logout"]')
            .click()

    })
});
