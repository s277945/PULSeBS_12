import moment from "moment";
describe('STUDENT PAGE', function () {
    beforeEach(() => {
        cy.visit('http://localhost:3000/')
        cy.login('s2662260','scimmia','s',1)
        Cypress.Cookies.preserveOnce('token', 'value')
        Cypress.Cookies.debug(true)
        /*cy.get('.sc-bdVaJa.cYQqRL.sc-bxivhb.eTpeTG.reactour__close')
            .click()*/
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
    it('should reload when toggle course is open', function () {
        cy.wait(100)
        cy.get('.card')
            .eq(0).click()
        cy.reload()
        cy.get('.sc-bdVaJa.cYQqRL.sc-bxivhb.eTpeTG.reactour__close')
            .click()
        cy.get('.card-body').eq(0)
            .should('be.visible')

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
        cy.wait(50)
    });
    it('should reload page when is open modal', function () {
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
        cy.reload()
        cy.get('.modal')
            .should('be.visible')

    });
    it('should open correctly modal to cancel a seat ', function () {
        cy.server()
        cy.route({
            method:'DELETE',
            url:'/api/lectures/*',
            status:204,
            response:{}
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
        cy.get('tbody>tr').eq(0).within(()=>{
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

});
describe('TUTORIAL TEST', function () {
    beforeEach(() => {
        cy.visit('http://localhost:3000/')
        cy.login('s2662260','scimmia','s',0)
        Cypress.Cookies.preserveOnce('token', 'value')
        Cypress.Cookies.debug(true)
    })
    it('should render correctly tutorial page', function () {
        cy.get('.sc-bdVaJa.cYQqRL.sc-bxivhb.eTpeTG.reactour__close').parent()
            .should('be.visible')
            .and('contains.text','You can change between lectures/calendar view in the nav bar')
            .within(()=>{
                cy.get('[data-tour-elem="right-arrow"]')
                    .should('be.enabled')
                cy.get('[data-tour-elem="left-arrow"]')
                    .should('not.be.enabled')
                cy.get('[data-tour-elem="navigation"]')
                    .should('be.visible')
            })
    });
    it('should close tutorial popup', function () {

        cy.get('.sc-bdVaJa.cYQqRL.sc-bxivhb.eTpeTG.reactour__close')
            .click()
    });
    it('should click on start tour in navbar', function () {
        cy.get('.sc-bdVaJa.cYQqRL.sc-bxivhb.eTpeTG.reactour__close')
            .click()
        cy.get('[data-testid="tour"]')
            .click()
        cy.get('.sc-bdVaJa.cYQqRL.sc-bxivhb.eTpeTG.reactour__close').parent()
            .should('be.visible')
    });
    it('should refresh page', function () {
        cy.get('.sc-bdVaJa.cYQqRL.sc-bxivhb.eTpeTG.reactour__close')
            .click()
        cy.reload()
        cy.wait(100)
        cy.get('.sc-bdVaJa.cYQqRL.sc-bxivhb.eTpeTG.reactour__close').parent().should('be.visible')
    });
    it('should logout', function () {
        cy.server()
        cy.route({
            method:'POST',
            url:'/api/logout',
            status:200,
            response:{}
        }).as('logout')
        cy.get('.sc-bdVaJa.cYQqRL.sc-bxivhb.eTpeTG.reactour__close')
            .click()
        cy.location('pathname').should('include','/studentHome')
        cy.get('[data-testid="logout"]').should('be.visible')
            .click()
        cy.wait('@logout')
        cy.getCookies().should('be.empty')
        cy.location('pathname').should('include','/')
    });

});
describe('SHOW TODAY LECTURE AND VC LECTURES IN TABLE', function () {
    beforeEach(()=>{
        let startDate;
        let endDate;
        let deadline;
        startDate=moment().add('hours',1).format('YYYY-MM-DD HH:mm:ss');
        deadline=moment().subtract('days',1).format('YYYY-MM-DD HH:mm:ss');
        endDate=moment().add('hours',4).format('YYYY-MM-DD HH:mm:ss');

        cy.server()
        cy.route({
            method:'POST',
            url:'/api/login',
            status:200,
            request:{userName:"s266260",password:"password"},
            response:{user:"s266260",userType:"s",tutorial:1}
        }).as('login')
        cy.route({
            method:'GET',
            url:'/api/courses',
            response:[
                {"CourseID":"C0123","Name":"Software Engineering II"}
            ]
        })
        cy.route({
            method:'GET',
            url:'/api/lectures',
            response:[
                {"Course_Ref":"C0123","Name":"SE2 Les:4","Date":startDate,"DateDeadline":deadline,"EndDate":endDate,"BookedSeats":null,"Capacity":null,"Type":"d"},
                {"Course_Ref":"C0123","Name":"SE2 Les:5","Date":"2021-03-27 19:30:00","DateDeadline":"2021-03-26 23:00:00","EndDate":"2021-03-27 21:00:00","BookedSeats":null,"Capacity":null,"Type":"d"},

            ]
        })
        cy.get('input:first').type('s266260').should('have.value','s266260')
        cy.get('input:last').type('scimmia').should('have.value','scimmia')
        cy.get('.btn.btn-primary')
            .click()

        cy.wait('@login')
    })
    it('should display today lecture distance', function () {
        cy.get('[data-testid="lectures"]').within(()=>{
            cy.get('tr').eq(1).within(()=>{
                cy.get('td').eq(0).contains("SE2 Les:4")
                cy.get('td').eq(3).contains('/')
                cy.get('td').eq(4).contains('/')
                cy.get('td').eq(5).contains('Virtual Classroom')
            })
        })
    });
});


