describe('SUPPORT OFFICER TESTS', function () {
    beforeEach(()=>{
        cy.visit('http://localhost:3000/')
        cy.supportOfficer('so123456','scimmia','so')
        Cypress.Cookies.preserveOnce('token', 'value')
        Cypress.Cookies.debug(true)
    })
    describe('SYSTEM SETUP PAGE', function () {
        it('should render correctly system setup page', function () {
            cy.get('.page-title')
                .should('contains.text','Upload data')
        });

    });
    describe('COURSE SETUP PAGE', function () {
        it('should render page', function () {
            cy.get('[data-testid="updatebookable"]')
                .should('be.visible')
                .click()
            cy.wait(100)

        });
        it('should turn lecture into distance', function () {
            cy.get('[data-testid="updatebookable"]')
                .should('be.visible')
                .click()
            cy.wait(100)
            cy.get('.card').eq(0).should('be.visible')
                .click({force:true})
                .within(()=>{
                    cy.get('[data-testid="year"]').should('be.visible').click()
                })
            cy.get('.btn.btn-info').should('be.enabled').click()
            cy.wait(100)
        });
        it('should turn lecture into presence', function () {
            cy.get('[data-testid="updatebookable"]')
                .should('be.visible')
                .click()
            cy.wait(100)
            cy.get('.card').eq(0).should('be.visible')
                .click({force:true})
                .within(()=>{
                    cy.get('[data-testid="year"]').should('be.visible').click()
                })
            cy.get('.btn.btn-primary').should('be.enabled').click()
            cy.wait(100)
        });
        it('should reset', function () {
            cy.get('[data-testid="updatebookable"]')
                .should('be.visible')
                .click()
            cy.wait(100)
            cy.get('.card').eq(0).should('be.visible')
                .click({force:true})
                .within(()=>{
                    cy.get('[data-testid="year"]').should('be.visible').click()
                })
            cy.get('.btn.btn-danger').should('be.enabled').click()
            cy.wait(100)
            
        });
        it('should select all', function () {
            cy.get('[data-testid="updatebookable"]')
                .should('be.visible')
                .click()
            cy.wait(100)
            cy.get('.btn.btn-secondary').eq(1).should('be.enabled').click()
            cy.wait(100)
        });
        it('should invert selection', function () {
            cy.get('[data-testid="updatebookable"]')
                .should('be.visible')
                .click()
            cy.wait(100)
            cy.get('.card').eq(0).should('be.visible')
                .click({force:true})
                .within(()=>{
                    cy.get('[data-testid="year"]').should('be.visible').click()
                })
            cy.get('.btn.btn-secondary').eq(2).should('be.enabled').click()
            cy.wait(100)
        });
        it('should invert type', function () {
            cy.get('[data-testid="updatebookable"]')
                .should('be.visible')
                .click()
            cy.wait(100)
            cy.get('.card').eq(0).should('be.visible')
                .click({force:true})
                .within(()=>{
                    cy.get('[data-testid="year"]').should('be.visible').click()
                })
            cy.get('.btn.btn-secondary').eq(0).should('be.enabled').click()
            cy.wait(100)
        });
        it('should click on semester', function () {
            cy.get('[data-testid="updatebookable"]')
                .should('be.visible')
                .click()
            cy.wait(100)
            cy.get('.card').eq(0).should('be.visible')
                .click()
                .within(()=>{
                    cy.get(".accordion-custom-setup-1").within(()=>{
                        cy.get('.form-check-input').eq(1).check()
                    })
                    cy.wait(100)
                })
        });
        it('should click on course', function () {
            cy.get('[data-testid="updatebookable"]')
                .should('be.visible')
                .click()
            cy.wait(100)
            cy.get('.card').eq(0).should('be.visible')
                .click()
                .within(()=>{
                    cy.get(".card-header").eq(1).click()
                    cy.get(".card-body").eq(1).within(()=>{
                        cy.get('.form-check-input').eq(2).check()
                    })
                    cy.wait(100)
                })
        });

    });
});