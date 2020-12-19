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
        it('should upload list student', function () {
            const date=Cypress.moment().format('DD/MM/YYYY HH:mm')
            cy.server()
            cy.route({
                method:'POST',
                url:'/api/uploadStudents',
                status:200,
                response:{inserted:true}
            }).as('student')
            cy.get('#custom-file').eq(0)
                .attachFile('Students.csv')
            cy.wait(200)
            cy.get('.btn.btn-primary').eq(0)
                .should('be.enabled')
                .click()
            cy.wait('@student')
            cy.get('tbody>tr').eq(0).within(()=>{
                cy.get('td').eq(0).should('have.text','Students.csv')
                cy.get('td').eq(1).should('have.text',date)
            })

        });
        it('should not upload a file, and returns an error', function () {
            const date=Cypress.moment().format('DD/MM/YYYY HH:mm')
            cy.server()
            cy.route({
                method:'POST',
                url:'/api/uploadStudents',
                status:500,
                response:{}
            }).as('student')
            cy.get('#custom-file').eq(0)
                .attachFile('Students.csv')
            cy.wait(200)
            cy.get('.btn.btn-primary').eq(0)
                .should('be.enabled')
                .click()
            cy.wait('@student')
            cy.get('tbody>tr').eq(0).within(()=>{
                cy.get('td').eq(0).should('have.text','Students.csv')
                cy.get('td').eq(1).should('not.have.text',date)
            })
            cy.get('.Toastify__toast-container--top-right')
                .should('contains.text',"Server error: error sending data to server")
        });
        it('should upload teacher', function () {
            const date=Cypress.moment().format('DD/MM/YYYY HH:mm')
            cy.server()
            cy.route({
                method:'POST',
                url:'/api/uploadTeachers',
                status:200,
                response:{inserted:true}
            }).as('teacher')
            cy.get('.custom-file-input').eq(1)
                .attachFile('Professors.csv')
            cy.wait(200)
            cy.get('.btn.btn-primary').eq(1)
                .should('be.enabled')
                .click()
            cy.wait('@teacher')
            cy.get('tbody>tr').eq(1).within(()=>{
                cy.get('td').eq(0).should('have.text','Professors.csv')
                cy.get('td').eq(1).should('have.text',date)
            })
            cy.get('.Toastify__toast-container--top-right')
                .should('contains.text',"Professor list correctly uploaded")
        });
        it('should upload Courses', function () {
            const date=Cypress.moment().format('DD/MM/YYYY HH:mm')
            cy.server()
            cy.route({
                method:'POST',
                url:'/api/uploadCourses',
                status:200,
                response:{inserted:true}
            }).as('courses')
            cy.get('.custom-file-input').eq(2)
                .attachFile('Courses.csv')
            cy.get('.btn.btn-primary').eq(2)
                .should('be.enabled')
                .click()
            cy.wait('@courses')
            cy.get('tbody>tr').eq(2).within(()=>{
                cy.get('td').eq(0).should('have.text','Courses.csv')
                cy.get('td').eq(1).should('have.text',date)
            })

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
            cy.server()
            cy.route({
                method:'POST',
                url:'/api/lecturesBookable',
                status:200,
                response:{"modified": true}
            })
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
            cy.server()
            cy.route({
                method:'POST',
                url:'/api/lecturesBookable',
                status:200,
                response:{"modified": true}
            })
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
            cy.server()
            cy.route({
                method:'POST',
                url:'/api/lecturesBookable',
                status:200,
                response:{"modified": true}
            })
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
                        cy.get('.form-check-input').eq(1).check()
                    })
                    cy.wait(100)
                })
        });

    });
});