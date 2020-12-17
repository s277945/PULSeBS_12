describe('STUDENT PAGE', function () {
    beforeEach(() => {
        cy.visit('http://localhost:3000/')
        cy.get('input:first').type('s266260').should('have.value','s266260')
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
            .eq(1).click()
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
        cy.wait(200)
        cy.get('.card')
            .eq(1).click()
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
                .should('not.be.enabled')
        })
    });
    it('should open correctly modal to book a seat', function () {
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
        cy.get('tbody>tr').eq(1).within(()=>{
            cy.get('.btn.btn-primary')
                .should('not.be.enabled')
        })
    });
    it('should put student in waiting list if room is full', function () {
        //PDS Les:5
        cy.server()
        cy.route({
            method:'GET',
            url:'/api/courses',
            status:200,
            response:[{"CourseID":"C0123","Name":"Software Engineering II"},{"CourseID":"C4567","Name":"Data Science"},{"CourseID":"C8901","Name":"Human Computer Interaction"}]
        }).as('showCourse')
        cy.route({
            method:'GET',
            url:'/api/lectures',
            status:200,
            response:[{"Course_Ref":"C0123","Name":"SE2 Les:4","Date":"2020-12-17 19:30:00","DateDeadline":"2020-12-16 23:00:00","EndDate":"2020-10-17 21:00:00","BookedSeats":20,"Capacity":100,"Type":"p"},
                    {"Course_Ref":"C4567","Name":"DS Les:5","Date":"2020-12-22 09:00:00","DateDeadline":"2020-12-21 23:00:00","EndDate":"2020-12-22 10:30:00","BookedSeats":70,"Capacity":70,"Type":"p"},
                    {"Course_Ref":"C4567","Name":"DS Les:6","Date":"2020-12-25 09:00:00","DateDeadline":"2020-12-24 23:00:00","EndDate":"2020-12-25 12:00:00","BookedSeats":2,"Capacity":70,"Type":"p"},
                    {"Course_Ref":"C8901","Name":"HCI Les:1","Date":"2021-03-02 15:00:00","DateDeadline":"2021-03-01 23:00:00","EndDate":"2021-03-02 18:00:00","BookedSeats":2,"Capacity":100,"Type":"p"},
                    {"Course_Ref":"C8901","Name":"HCI Les:2","Date":"2021-03-04 09:00:00","DateDeadline":"2021-03-03 23:00:00","EndDate":"2021-03-04 10:30:00","BookedSeats":80,"Capacity":80,"Type":"p"}]
            }).as('showLec')
        cy.route({
            method:'POST',
            url:'/api/lectures',
            status:200,
            request:{"lectureId":"C8901","date":"2021-03-04 09:00:00","endDate":"2021-03-04 10:30:00"},
            response:{"operation":"waiting"}
        }).as('bookSeat')
        cy.route({
            method:'GET',
            url:'/api/lectures/booked',
            status:201,
            response:[]
        }).as('booked')
        cy.route({
            method:'GET',
            url:'/api/lectures/waiting',
            status:201,
            response:[]
        }).as('@waiting')
        cy.wait('@showCourse')
        cy.wait('@showLec')
        cy.wait('@booked')
        cy.wait('@waiting')
        cy.intercept('@showCourse')
        cy.intercept('@showLec')
        cy.intercept('@booked')
        cy.intercept('@waiting')
        cy.get('.card').contains('Human Computer Interaction')
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
                cy.intercept('@bookSeat')
                cy.wait('@bookSeat')
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

