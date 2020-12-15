describe('TEST MANAGER PAGE', function () {
    beforeEach(() => {
        cy.visit('http://localhost:3000/')
        cy.get('input:first').type('b123456')
        cy.get('input:last').type('scimmia')
        cy.intercept('POST', '/api/login').as('login')

        cy.get('.btn.btn-primary')
            .click()
        cy.wait('@login')
        Cypress.Cookies.preserveOnce('token', 'value')
        Cypress.Cookies.debug(true)
    })
    it('should load correctly manager page', function () {
        cy.location('pathname').should('include', '/bookingHome')
    });
    it('should render', function () {
        cy.get('nav')
            .should('include.text', 'PULSeBS - SystemActivity')


    });

    it('should open accordion of a course', function () {
        cy.get('.accordion')
            .eq(1)
            .should('be.visible')
            .click()
    });
    it('should change lecture inside select', function () {
        cy.get('.accordion')
            .eq(0)
            .click()
        cy.wait(100)
        cy.get('.card').eq(0)
            .should('be.visible')
            .within(() => {
                cy.get('select')
                    .first()
            })

    });
    it('should not redirect', function () {
        cy.visit('http://localhost:3000/')
        cy.wait(200)
        cy.location('pathname').should('include', '/bookingHome')
    });
    it('should show correctly positive page', function () {
        cy.get('[data-testid="report"]')
            .click()
        cy.get('.page-title').should('have.text', 'Positive students and reports')
        cy.get('table').should('be.visible')
    });
    it('should add a new positive student', function () {
        cy.get('[data-testid="report"]')
            .click()
        cy.get('[data-testid="addSSN"]').should('have.text', 'Add New Student')
            .click()
        cy.get('[data-testid="modalSSN"]').should('be.visible')
            .within(() => {
                cy.get('input')
                    .should('be.visible')
                    .type('WHTRWHRW')
                cy.get('[data-testid="search"]').click()
                cy.wait(100)
                //cy.get('table)
                cy.get('[data-testid="listTabSL"]').should('be.visible')
                    .and('have.length', 1)
                cy.get('[data-testid="confirmButton"]')
                    .should('be.visible')
                    .click()

            })

    });
    it('should not add a positive student if the ssn does not exists', function () {
        cy.get('[data-testid="report"]')
            .click()
        cy.get('[data-testid="addSSN"]').should('have.text', 'Add New Student')
            .click()
        cy.get('[data-testid="modalSSN"]').should('be.visible')
            .within(() => {
                cy.get('input')
                    .should('be.visible')
                    .type('TODO')
                cy.get('[data-testid="search"]').click()
            })
            .should('contain.text','Student not found');
        it('should generate a report', function () {
            cy.get('[data-testid="report"]')
                .click()
            cy.get('tbody>tr').eq(1)
                .within(()=>{
                    cy.get('.btn.btn-primary')
                        .click()
                })
        });
        it('should not generate a report if a student is not enrolled in any lectures', function () {
            cy.get('[data-testid="report"]')
                .click()
            cy.get('tbody>tr').eq(2)
                .within(()=>{
                    cy.get('.btn.btn-primary')
                        .click()
                })
        });
        it('should generate correctly a report', function () {
            cy.get('[data-testid="report"]').click()
            cy.get('tbody>tr').eq(0)
                .within(()=>{
                    cy.get('.btn.btn-primary')
                        .click()
                })
        });
        it('should logout', function () {
            cy.get('[data-testid="logout"]')
                .click()

        });
    });
})