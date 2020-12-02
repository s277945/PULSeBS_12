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
    it('should open accordion of a course', function () {
        cy.get('.accordion')
            .should('have.length',5)
            .contains('Data Science')
            .should('be.visible')
            .click({force:true})
    });
    it('should change lecture inside select', function () {
        cy.get('.accordion')
            .contains('Data Science')
            .click({force:true})
        cy.get('.collapse.show')
            .should('be.visible')
            .within(()=>{
                cy.get('select')
                    .select('DS Les:2')
            })

    });
    it('should logout', function () {
        cy.get('[data-testid="logout"]')
            .click()

    });
});
