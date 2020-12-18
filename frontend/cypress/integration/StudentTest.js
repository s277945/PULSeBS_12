describe('STUDENT PAGE', function () {
    beforeEach(() => {
        cy.visit('http://localhost:3000/')
        cy.login('s2662260','scimmia','s')
        Cypress.Cookies.preserveOnce('token', 'value')
        Cypress.Cookies.debug(true)
    })
    it('should show correctly student page', function () {
        cy.location('pathname').should('include','/studentHome')
        cy.get('.page-title')
            .should('be.visible')
            .should('have.text','Lectures')
        cy.get('.card')
            .eq(0).click()
            .within(()=>{
                cy.get('table')
                    .should('be.visible')
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
        cy.get('.card')
            .eq(0).click()
            .within(()=>{
                cy.get('tbody>tr').eq(0).within(()=>{
                    cy
                        .get('.btn.btn-danger')
                        .should('be.enabled')
                        .click()
                })
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
        cy.server()
        cy.route({
            method:'DELETE',
            url:'/api/lectures/*',
            status:204
        })
        cy.wait(200)
        cy.get('.card')
            .eq(0).click()
            .within(()=>{
                cy.get('tbody>tr').eq(0).within(()=>{
                    cy
                        .get('.btn.btn-danger')
                        .should('be.enabled')
                        .click()
                })
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
    it('should not cancel a lecture', function () {
        cy.server()
        cy.route({
            method:'DELETE',
            url:'/api/lectures/*',
            status:500,
            response:{
                errors: [{ 'param': 'Server', 'msg': "An error occurred" }]
            }
        })
        cy.wait(200)
        cy.get('.card')
            .eq(0).click()
            .within(()=>{
                cy.get('tbody>tr').eq(0).within(()=>{
                    cy
                        .get('.btn.btn-danger')
                        .should('be.enabled')
                        .click()
                })
            })
        cy.get('.modal')
            .should('be.visible')
            .within(()=>{
                cy.get('.btn.btn-danger')
                    .click()

            })
        cy.get('tbody>tr').eq(1).within(()=>{
            cy.get('.btn.btn-danger')
                .should('be.enabled')
        })
    });
    it('should open correctly modal to book a seat', function () {
        cy.server()
        cy.route({
            method:'POST',
            status:201,
            url:'/api/lectures',
            response:{
                operation:"booked"
            }
        })
        cy.wait(200)
        cy.get('.card').eq(1).click()
            .within(()=>{
                cy.get('tbody>tr').eq(1).within(()=>{
                    cy.get('.btn.btn-primary')
                        .should('be.enabled')
                        .click()
                })
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
        cy.get('tbody>tr').eq(2).within(()=>{
            cy.get('.btn.btn-primary')
                .should('not.be.enabled')
        })
    });
    it('should not book a lecture if an error occurs', function () {
        cy.server()
        cy.route({
            method:'POST',
            status:422,
            url:'/api/lectures',
            response:{
                errors: 'Invalid end date'
            }
        }).as('book')
        cy.wait(200)
        cy.get('.card').eq(1).click()
            .within(()=>{
                cy.get('tbody>tr').eq(1).within(()=>{
                    cy.get('.btn.btn-primary')
                        .should('be.enabled')
                        .click()
                })
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
        cy.wait('@book')
        cy.get('tbody>tr').eq(2).within(()=>{
            cy.get('.btn.btn-primary')
                .should('be.enabled')
        })
    });
    it('should not buy a lecture if is not bookable', function () {
        cy.server()
        cy.route({
            method:'POST',
            status:500,
            url:'/api/lectures',
            response:{
                errors: [{ 'param': 'Server', 'msg': "Server error" }]
            }
        }).as('book')
        cy.wait(200)
        cy.get('.card').eq(1).click()
            .within(()=>{
                cy.get('tbody>tr').eq(1).within(()=>{
                    cy.get('.btn.btn-primary')
                        .should('be.enabled')
                        .click()
                })
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
        cy.wait('@book')
        cy.get('tbody>tr').eq(2).within(()=>{
            cy.get('.btn.btn-primary')
                .should('be.enabled')
        })
    });
    it('should put student in waiting list if room is full', function () {
        //PDS Les:5
        cy.server()
        cy.route({
            method:'POST',
            url:'/api/lectures',
            status:200,
            response:{"operation":"waiting"}
        }).as('bookSeat')
        cy.get('.card').eq(2)
            .click()
            .within(()=>{
                cy.get("tbody>tr")
                    .contains('td','HCI Les:2')
                    .siblings()
                    .find('.btn.btn-warning')
                    .should('be.enabled')
                    .click()
            })
        cy.get('.modal')
            .within(()=>{
                cy.get('p')
                    .should('be.visible')
                    .should('have.text','Do you want to enter the waiting list for this lecture?')
                cy.get('.btn.btn-secondary')
                    .should('have.text','No')
                cy.get('.btn.btn-warning')
                    .should('be.visible')
                    .should('have.text', 'Yes')
                    .click()
                cy.wait('@bookSeat')
            })
        cy.wait(100)
        cy.get('.btn.btn-warning').should('be.disabled')


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

