describe('TEST MANAGER PAGE', function () {
    beforeEach(() => {
        cy.visit('http://localhost:3000/')
        cy.bookingManager('b123456','scimmia','bm')
        Cypress.Cookies.preserveOnce('token', 'value')
        Cypress.Cookies.debug(true)
    })
    it('should load correctly manager page', function () {
        cy.location('pathname').should('include', '/bookingHome')
    });
    it('should render correctly', function () {
        cy.get('nav')
            .should('include.text', 'PULSeBS - SystemActivity')
        cy.get('.accordion')
            .should('include.text','Data Science')
            .should('have.length',1)

    });

    it('should open accordion of a course', function () {
        cy.get('.accordion')
            .should('be.visible')
            .click()
        cy.get('.card-body')
            .should('be.visible')
            .within(()=>{
                cy.get('h5').eq(0).should('have.text','Total Information')
                cy.get('h5').eq(1).should('have.text','Information by Lecture')
                cy.get('tbody>tr').then(($lis)=>{
                    expect($lis.eq(0)).to.contain('6')
                    expect($lis.eq(0)).to.contain('192')
                    expect($lis.eq(0)).to.contain('45')
                    expect($lis.eq(0)).to.contain('147')
                    expect($lis.eq(1)).to.contain('70')
                    expect($lis.eq(1)).to.contain('23')
                    expect($lis.eq(1)).to.contain('47')

                })
            })
        cy.wait(100)
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
                    .select('DS Les:2')

            })
        cy.get('.card-body').should('be.visible')
            .within(()=>{
                cy.get('tbody>tr').eq(1).within(()=>{
                    cy.get('td').eq(0).should('contains.text','30')
                    cy.get('td').eq(1).should('contains.text','7')
                    cy.get('td').eq(2).should('contains.text','23')
                })
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
        cy.server()
        cy.route({
            method:'POST',
            url:'/api/students/*',
            status:200,
            response:{"setAsPositive": true}
        })
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
                cy.wait(200)

            })
        cy.get('tbody>tr').should('have.length',5)

    });
    it('should close correctly popup', function () {
        cy.get('[data-testid="report"]')
            .click()
        cy.get('[data-testid="addSSN"]').should('have.text', 'Add New Student')
            .click()
        cy.get('.modal').should('be.visible')
            .click({ force: true });
    });
    it('should not add a positive student if the ssn does not exists', function () {
        cy.server()
        cy.route({
            method:'GET',
            url:'/api/students/*',
            status:500,
            response:{}
        }).as('student')
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
                cy.wait('@student')
            })
            .should('contain.text', 'Student not found');
    });
        it('should generate a report empty', function () {
            cy.server()
            cy.route({
                method:'GET',
                url:'/api/reports/*',
                status:200,
                response:[]
            }).as('report')
            cy.get('[data-testid="report"]')
                .click()
            cy.get('tbody>tr').eq(0)
                .within(()=>{
                    cy.get('.btn.btn-primary')
                        .click()
                })
            cy.wait('@report')
        });
        it('should not generate a report if a student is not enrolled in any lectures', function () {
            cy.server()
            cy.route({
                method:'GET',
                url:'/api/reports/*',
                status:500,
                response:{}
            }).as('report')
            cy.get('[data-testid="report"]')
                .click()
            cy.get('tbody>tr').eq(2)
                .within(()=>{
                    cy.get('.btn.btn-primary')
                        .click()
                })
            cy.wait('@report')
        });
        it('should generate correctly a report', function () {
            cy.get('[data-testid="report"]').click()
            cy.get('tbody>tr').eq(1)
                .within(()=>{
                    cy.get('.btn.btn-primary')
                        .click()
                    cy.wait(500);
                })
        });
        it('should logout', function () {
            cy.get('[data-testid="logout"]')
                .click()

        });
    });