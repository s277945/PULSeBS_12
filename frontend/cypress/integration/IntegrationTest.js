

describe('TEACHER PAGE', function () {
    beforeEach(() => {
        cy.visit('http://localhost:3000/')
        cy.teacher('t987654','scimmia','t',1)
        Cypress.Cookies.preserveOnce('token', 'value')
        Cypress.Cookies.debug(true)
    })
    it('should render correctly teacher page', function () {
        cy.location('pathname').should('include','teacherHome')
        cy.get('.page-title').should('have.text','Lectures')

    });
    it('should reload teacher page', function () {
        cy.location('pathname').should('include','/teacherHome')
        cy.reload()
        cy.location('pathname').should('include','/teacherHome')
    });
    it('should render correctly student list page', function () {
        cy.get('[data-testid="teacherStudent"]').should('have.text', 'Student List')
                .should('have.attr', 'href', '#studentList')
                .click()
        cy.get('.page-title').should('have.text','Student list')

    });
    it('should reload teacher student page', function () {
        cy.get('[data-testid="teacherStudent"]').should('have.text', 'Student List')
            .should('have.attr', 'href', '#studentList')
            .click()
        cy.hash().should('include', '#studentList')
        cy.reload()
        cy.location('pathname').should('include','/')
    });
    it('should render modal student list page', function () {
        cy.get('[data-testid="teacherStudent"]').should('have.text', 'Student List')
            .should('have.attr', 'href', '#studentList')
            .click()
        //click on programmed lectures info
        cy.get('.card-header').eq(0)
            .click({force:true})
        cy.get('tbody>tr').eq(0).find('.btn.btn-primary').should('have.text','SHOW LIST')
            .click()
        cy.wait(100)
        cy.get('[data-testid="studentsList"]').should('be.visible')
            .within(()=>{
                cy.get('tr').eq(0).should('contain','s266260')
            })
        cy.get('.modal').should('be.visible')
            .click({ force: true });

    });
    it('should render teacher attendance', function () {
        cy.server()
        cy.route({
            url:'/api/teacherPastLectures',
            method:'GET',
            status:200,
            response:[
                {"Course_Ref":"C0123","Name":"SE2 Les:1","Date":"2020-10-01 13:00:00","DateDeadline":"2020-09-30 23:00:00","EndDate":"2020-10-01 16:00:00","BookedSeats":20,"Capacity":100,"Type":"p","Attendees":0},
                {"Course_Ref":"C0123","Name":"SE2 Les:2","Date":"2020-10-02 14:30:00","DateDeadline":"2020-10-01 23:00:00","EndDate":"2020-10-02 16:00:00","BookedSeats":15,"Capacity":100,"Type":"p","Attendees":0},
                {"Course_Ref":"C0123","Name":"SE2 Les:3","Date":"2020-12-04 18:00:00","DateDeadline":"2020-12-03 23:00:00","EndDate":"2020-12-04 19:30:00","BookedSeats":2,"Capacity":100,"Type":"p","Attendees":2},
                {"Course_Ref":"C0123","Name":"SE2 Les:4","Date":"2020-12-17 19:30:00","DateDeadline":"2020-12-16 23:00:00","EndDate":"2020-10-17 21:00:00","BookedSeats":20,"Capacity":100,"Type":"p","Attendees":0}
                ]
        }).as('past')
        cy.route({
            url:'/api/lectures/listStudents?courseRef=*',
            method:'GET',
            status:200,
            response:[{"userId":"s266260","name":"Fortunato Sabato","surname":"Sole","attendance":0}]
        }).as('attendance')
        cy.get('[data-testid="teacherStudent"]').should('have.text', 'Student List')
            .should('have.attr', 'href', '#studentList')
            .click()
        //click on programmed lectures info
        cy.get('.card-header').eq(1)
            .click({force:true})
        cy.get('.card-body').eq(1)
            .within(()=>{
                cy.get('[data-testid="listTabSL"]').within(()=>{
                    cy.get('tr').eq(0).find('.btn.btn-secondary').click()
                })
            })

        cy.wait('@attendance')
        cy.get('.modal')
            .should('be.visible')
            .within(()=>{
                cy.get('tbody>tr').eq(0)
                    .contains('Fortunato Sabato')
                    .parent()
            })
    });
    it('should set presence', function () {
        cy.server()
        let start_date=Cypress.moment().subtract('hours',10).format('YYYY-MM-DD HH:mm');
        let end_date=Cypress.moment().subtract('hours',7).format('YYYY-MM-DD HH:mm');
        let deadline=Cypress.moment().subtract('days',1).format('YYYY-MM-DD HH:mm');
        let selection;
        let line;
        cy.route({
            url:'/api/teacherPastLectures',
            method:'GET',
            status:200,
            response:[
                {"Course_Ref":"C0123","Name":"SE2 Les:1","Date":start_date,"DateDeadline":deadline,"EndDate":end_date,"BookedSeats":20,"Capacity":100,"Type":"p","Attendees":0},
                {"Course_Ref":"C0123","Name":"SE2 Les:2","Date":"2020-10-02 14:30:00","DateDeadline":"2020-10-01 23:00:00","EndDate":"2020-10-02 16:00:00","BookedSeats":15,"Capacity":100,"Type":"p","Attendees":0},
                {"Course_Ref":"C0123","Name":"SE2 Les:3","Date":"2020-12-04 18:00:00","DateDeadline":"2020-12-03 23:00:00","EndDate":"2020-12-04 19:30:00","BookedSeats":2,"Capacity":100,"Type":"p","Attendees":2},
                {"Course_Ref":"C0123","Name":"SE2 Les:4","Date":"2020-12-17 19:30:00","DateDeadline":"2020-12-16 23:00:00","EndDate":"2020-10-17 21:00:00","BookedSeats":20,"Capacity":100,"Type":"p","Attendees":0}
            ]
        }).as('past')
        cy.route({
            url:'/api/lectures/listStudents?courseRef=*',
            method:'GET',
            status:200,
            response:[{"userId":"s266260","name":"Fortunato Sabato","surname":"Sole","attendance":0}]
        }).as('attendance')
        cy.route({
            url:'*',
            method:'POST',
            status:200,
            response:{modified:true}
        }).as('post')
        cy.get('[data-testid="teacherStudent"]').should('have.text', 'Student List')
            .should('have.attr', 'href', '#studentList')
            .click()
        //click on programmed lectures info
        cy.get('.card-header').eq(1)
            .click({force:true})
        cy.get('.card-body').eq(1)
            .within(()=>{
                cy.get('[data-testid="listTabSL"]').within(()=>{
                    cy.get('tr').eq(0).find('.btn.btn-info').click()
                })
            })

        cy.wait('@attendance')
        cy.get('.modal')
            .should('be.visible')
            .within(()=>{
                line=cy.get('tbody>tr').eq(0)
                    line
                    .within(()=>{
                        cy.get('td').eq(2).should('contains.text','Fortunato Sabato')
                        cy.get('td').eq(5).within(()=>{
                            selection=cy.get('input[type=checkbox]')
                            selection.check().should('be.checked')
                        })

                    })
                //expect that primary button is enabled
                cy.get('.btn.btn-danger').should('be.enabled')
                    .and('contains.text','Reset selection')
                cy.get('.btn.btn-secondary')
                    .should('not.be.enabled')
                    .and('contains.text','Select all')
                cy.get('.btn.btn-primary')
                    .should('be.enabled')
                    .and('contains.text','Mark as present')
                    .click()
                cy.wait('@post')
                line.get('td').eq(4).should('contains.text','Yes')

            })
    });
    it('should not set presence if a server error occurs', function () {
        cy.server()
        let start_date=Cypress.moment().subtract('hours',10).format('YYYY-MM-DD HH:mm');
        let end_date=Cypress.moment().subtract('hours',7).format('YYYY-MM-DD HH:mm');
        let deadline=Cypress.moment().subtract('days',1).format('YYYY-MM-DD HH:mm');
        let selection;
        let line;
        cy.route({
            url:'/api/teacherPastLectures',
            method:'GET',
            status:200,
            response:[
                {"Course_Ref":"C0123","Name":"SE2 Les:1","Date":start_date,"DateDeadline":deadline,"EndDate":end_date,"BookedSeats":20,"Capacity":100,"Type":"p","Attendees":0},
                {"Course_Ref":"C0123","Name":"SE2 Les:2","Date":"2020-10-02 14:30:00","DateDeadline":"2020-10-01 23:00:00","EndDate":"2020-10-02 16:00:00","BookedSeats":15,"Capacity":100,"Type":"p","Attendees":0},
                {"Course_Ref":"C0123","Name":"SE2 Les:3","Date":"2020-12-04 18:00:00","DateDeadline":"2020-12-03 23:00:00","EndDate":"2020-12-04 19:30:00","BookedSeats":2,"Capacity":100,"Type":"p","Attendees":2},
                {"Course_Ref":"C0123","Name":"SE2 Les:4","Date":"2020-12-17 19:30:00","DateDeadline":"2020-12-16 23:00:00","EndDate":"2020-10-17 21:00:00","BookedSeats":20,"Capacity":100,"Type":"p","Attendees":0}
            ]
        }).as('past')
        cy.route({
            url:'/api/lectures/listStudents?courseRef=*',
            method:'GET',
            status:200,
            response:[{"userId":"s266260","name":"Fortunato Sabato","surname":"Sole","attendance":0}]
        }).as('attendance')
        cy.route({
            url:'*',
            method:'POST',
            status:500,
            response:{}
        }).as('post')
        cy.get('[data-testid="teacherStudent"]').should('have.text', 'Student List')
            .should('have.attr', 'href', '#studentList')
            .click()
        //click on programmed lectures info
        cy.get('.card-header').eq(1)
            .click({force:true})
        cy.get('.card-body').eq(1)
            .within(()=>{
                cy.get('[data-testid="listTabSL"]').within(()=>{
                    cy.get('tr').eq(0).find('.btn.btn-info').click()
                })
            })

        cy.wait('@attendance')
        cy.get('.modal')
            .should('be.visible')
            .within(()=>{
                line=cy.get('tbody>tr').eq(0)
                line
                    .within(()=>{
                        cy.get('td').eq(2).should('contains.text','Fortunato Sabato')
                        cy.get('td').eq(5).within(()=>{
                            selection=cy.get('input[type=checkbox]')
                            selection.check().should('be.checked')
                        })

                    })
                //expect that primary button is enabled
                cy.get('.btn.btn-danger').should('be.enabled')
                    .and('contains.text','Reset selection')
                cy.get('.btn.btn-secondary')
                    .should('not.be.enabled')
                    .and('contains.text','Select all')
                cy.get('.btn.btn-primary')
                    .should('be.enabled')
                    .and('contains.text','Mark as present')
                    .click()
                cy.wait('@post')
                line.get('td').eq(4).should('contains.text','No')

            })
    });
    it('should click on reset', function () {
        cy.server()
        let start_date=Cypress.moment().subtract('hours',10).format('YYYY-MM-DD HH:mm');
        let end_date=Cypress.moment().subtract('hours',7).format('YYYY-MM-DD HH:mm');
        let deadline=Cypress.moment().subtract('days',1).format('YYYY-MM-DD HH:mm');
        let selection;
        let line;
        cy.route({
            url:'/api/teacherPastLectures',
            method:'GET',
            status:200,
            response:[
                {"Course_Ref":"C0123","Name":"SE2 Les:1","Date":start_date,"DateDeadline":deadline,"EndDate":end_date,"BookedSeats":20,"Capacity":100,"Type":"p","Attendees":0},
                {"Course_Ref":"C0123","Name":"SE2 Les:2","Date":"2020-10-02 14:30:00","DateDeadline":"2020-10-01 23:00:00","EndDate":"2020-10-02 16:00:00","BookedSeats":15,"Capacity":100,"Type":"p","Attendees":0},
                {"Course_Ref":"C0123","Name":"SE2 Les:3","Date":"2020-12-04 18:00:00","DateDeadline":"2020-12-03 23:00:00","EndDate":"2020-12-04 19:30:00","BookedSeats":2,"Capacity":100,"Type":"p","Attendees":2},
                {"Course_Ref":"C0123","Name":"SE2 Les:4","Date":"2020-12-17 19:30:00","DateDeadline":"2020-12-16 23:00:00","EndDate":"2020-10-17 21:00:00","BookedSeats":20,"Capacity":100,"Type":"p","Attendees":0}
            ]
        }).as('past')
        cy.route({
            url:'/api/lectures/listStudents?courseRef=*',
            method:'GET',
            status:200,
            response:[{"userId":"s266260","name":"Fortunato Sabato","surname":"Sole","attendance":0}]
        }).as('attendance')
        cy.route({
            url:'*',
            method:'POST',
            status:200,
            response:{modified:true}
        })
        cy.get('[data-testid="teacherStudent"]').should('have.text', 'Student List')
            .should('have.attr', 'href', '#studentList')
            .click()
        //click on programmed lectures info
        cy.get('.card-header').eq(1)
            .click({force:true})
        cy.get('.card-body').eq(1)
            .within(()=>{
                cy.get('[data-testid="listTabSL"]').within(()=>{
                    cy.get('tr').eq(0).find('.btn.btn-info').click()
                })
            })

        cy.wait('@attendance')
        cy.get('.modal')
            .should('be.visible')
            .within(()=>{
                line=cy.get('tbody>tr').eq(0)
                line
                    .within(()=>{
                        cy.get('td').eq(2).should('contains.text','Fortunato Sabato')
                        cy.get('td').eq(5).within(()=>{
                            selection=cy.get('input[type=checkbox]')
                            selection.check().should('be.checked')
                        })

                    })
                //expect that primary button is enabled
                cy.get('.btn.btn-danger').should('be.enabled')
                    .and('contains.text','Reset selection')
                    .click()
                //selection.should('not.be.checked')
                cy.get('.btn.btn-secondary')
                    .should('be.enabled')
                    .and('contains.text','Select all')
                cy.get('.btn.btn-primary')
                    .should('not.be.enabled')
                    .and('contains.text','Mark as present')

                line.get('td').eq(4).should('contains.text','No')

            })
    });
    it('should click on select all', function () {
        cy.server()
        let start_date=Cypress.moment().subtract('hours',10).format('YYYY-MM-DD HH:mm');
        let end_date=Cypress.moment().subtract('hours',7).format('YYYY-MM-DD HH:mm');
        let deadline=Cypress.moment().subtract('days',1).format('YYYY-MM-DD HH:mm');
        let selection;
        let line;
        cy.route({
            url:'/api/teacherPastLectures',
            method:'GET',
            status:200,
            response:[
                {"Course_Ref":"C0123","Name":"SE2 Les:1","Date":start_date,"DateDeadline":deadline,"EndDate":end_date,"BookedSeats":20,"Capacity":100,"Type":"p","Attendees":0},
                {"Course_Ref":"C0123","Name":"SE2 Les:2","Date":"2020-10-02 14:30:00","DateDeadline":"2020-10-01 23:00:00","EndDate":"2020-10-02 16:00:00","BookedSeats":15,"Capacity":100,"Type":"p","Attendees":0},
                {"Course_Ref":"C0123","Name":"SE2 Les:3","Date":"2020-12-04 18:00:00","DateDeadline":"2020-12-03 23:00:00","EndDate":"2020-12-04 19:30:00","BookedSeats":2,"Capacity":100,"Type":"p","Attendees":2},
                {"Course_Ref":"C0123","Name":"SE2 Les:4","Date":"2020-12-17 19:30:00","DateDeadline":"2020-12-16 23:00:00","EndDate":"2020-10-17 21:00:00","BookedSeats":20,"Capacity":100,"Type":"p","Attendees":0}
            ]
        }).as('past')
        cy.route({
            url:'/api/lectures/listStudents?courseRef=*',
            method:'GET',
            status:200,
            response:[{"userId":"s266260","name":"Fortunato Sabato","surname":"Sole","attendance":0}]
        }).as('attendance')
        cy.route({
            url:'*',
            method:'POST',
            status:200,
            response:{modified:true}
        })
        cy.get('[data-testid="teacherStudent"]').should('have.text', 'Student List')
            .should('have.attr', 'href', '#studentList')
            .click()
        //click on programmed lectures info
        cy.get('.card-header').eq(1)
            .click({force:true})
        cy.get('.card-body').eq(1)
            .within(()=>{
                cy.get('[data-testid="listTabSL"]').within(()=>{
                    cy.get('tr').eq(0).find('.btn.btn-info').click()
                })
            })

        cy.wait('@attendance')
        cy.get('.modal')
            .should('be.visible')
            .within(()=>{
                line=cy.get('tbody>tr').eq(0)
                line
                    .within(()=>{
                        cy.get('td').eq(2).should('contains.text','Fortunato Sabato')
                        cy.get('td').eq(5).within(()=>{
                            selection=cy.get('input[type=checkbox]')
                            selection.should('not.be.checked')
                        })

                    })
                //expect that primary button is enabled

                cy.get('.btn.btn-secondary')
                    .should('be.enabled')
                    .and('contains.text','Select all')
                    .click()
                cy.get('.btn.btn-danger').should('be.enabled')
                    .and('contains.text','Reset selection')
                cy.get('.btn.btn-primary')
                    .should('be.enabled')
                    .and('contains.text','Mark as present')

                line.get('td').eq(4).should('contains.text','No')
                cy.get('input[type=checkbox]').should('be.checked')
            })
    });

    it('should reload modal student when refresh page', function () {
        cy.get('[data-testid="teacherStudent"]').should('have.text', 'Student List')
            .should('have.attr', 'href', '#studentList')
            .click()
        //click on programmed lectures info
        cy.get('.card-header').eq(0)
            .click({force:true})
        cy.get('tbody>tr').eq(0).find('.btn.btn-primary').should('have.text','SHOW LIST')
            .click()
        cy.wait(100)
        cy.get('[data-testid="studentsList"]').should('have.length', 1)
            .within(()=>{
                cy.get('tr').eq(0).should('contain','s266260')
            })

        cy.reload()
        cy.get('.modal').should('be.visible')
    });
    it('should render modal lectures page', function () {
        cy.get('[data-testid="lecturesPage"]')
            .click()
        cy.get('tbody>tr')
            .eq(1).find('.btn.btn-primary')
            .should('have.text', 'SELECT')
            .should('be.visible')
            .click();
        cy.get('.modal').should('be.visible')
            .within(()=>{
                cy.get('.btn.btn-danger')
                    .should('have.text', 'CANCEL LECTURE')
                cy.get('.btn.btn-info')
                    .should('have.text', 'TURN INTO DISTANCE LECTURE')
            })
            .click({ force: true })
        cy.get('[data-testid="homeRedirect"]')
            .should('be.visible')
            .click()
        cy.location('pathname').should('include','/')
    });
    it('should not turn into a distance lecture', function () {
        cy.get('tbody>tr')
            .eq(1).find('.btn.btn-primary')
            .should('have.text', 'SELECT')
            .should('be.visible')
            .click();
        cy.get('.modal').should('be.visible')
            .within(()=>{
                cy.get('.btn.btn-info')
                    .should('have.text', 'TURN INTO DISTANCE LECTURE')
                    .click()
            })
        cy.get('[data-testid="popup"]').should('be.visible')
            .within(()=>{
                cy.get('p')
                    .should('be.visible')
                    .and('have.text','Do you want to turn this lecture into a distance lecture ?')
                cy.get('.btn.btn-info')
                    .should('not.be.disabled')
                    .and('have.text','Yes')
                cy.get('.btn.btn-secondary')
                    .should('be.visible')
                    .and('have.text','No')
                    .click()
            })
        cy.get('tbody>tr').should('have.length',4)

    });
    it('should press cancel lecture, but click on button No', function () {
        cy.get('tbody>tr')
            .eq(1)
            .find('.btn.btn-primary')
            .should('have.text', 'SELECT')
            .should('be.visible')
            .click();
        cy.get('.modal')
            .should('be.visible')
            .within(()=>{
                cy.get('.btn.btn-danger')
                    .should('have.text','CANCEL LECTURE')
                    .should('not.be.disabled')
                    .click()
            })
        cy.wait(100);
        cy.get('[data-testid="popup"]')
            .should('be.visible')
            .within(()=>{
                cy.get('p').should('have.text','Do you want to cancel this lecture ?')
                cy.get('.btn.btn-danger')
                    .should('be.enabled')
                    .and('have.text','Yes')
                cy.get('.btn.btn-secondary')
                    .should('be.enabled')
                    .and('have.text','No')
                    .click()
            })
        cy.wait(20)
        cy.get('.modal')
            .should('be.visible')
    });
    it('should cancel correctly a lecture', function () {
        cy.server()
        cy.route({
            method:'DELETE',
            url:'/api/courseLectures/*',
            status:204,
            response:{lecture: "canceled"}
        })
        cy.get('tbody>tr')
            .eq(1)
            .find('.btn.btn-primary')
            .should('have.text', 'SELECT')
            .should('be.visible')
            .click();
        cy.get('.modal')
            .should('be.visible')
            .within(()=>{
                cy.get('.btn.btn-danger')
                    .should('have.text','CANCEL LECTURE')
                    .should('not.be.disabled')
                    .click()
            })
        cy.wait(100);
        cy.get('[data-testid="popup"]')
            .should('be.visible')
            .within(()=>{
                cy.get('p').should('have.text','Do you want to cancel this lecture ?')
                cy.get('.btn.btn-danger')
                    .should('be.enabled')
                    .and('have.text','Yes')
                    .click()
            })
        cy.wait(20)
        cy.get('tbody>tr')
            .should('have.length',3)
    });
    it('should turn into distance lecture correctly', function () {
        cy.server()
        cy.route({
            method:'PUT',
            url:'/api/lectures',
            status:200,
            response:{response: true}
        })
        cy.get('tbody>tr')
            .eq(1).find('.btn.btn-primary')
            .should('have.text', 'SELECT')
            .should('be.visible')
            .click();
        cy.get('.modal').should('be.visible')
            .within(()=>{
                cy.get('.btn.btn-info')
                    .should('have.text', 'TURN INTO DISTANCE LECTURE')
                    .click()
            })
        cy.get('[data-testid="popup"]').should('be.visible')
            .within(()=>{
                cy.get('p')
                    .should('be.visible')
                    .and('have.text','Do you want to turn this lecture into a distance lecture ?')
                cy.get('.btn.btn-info')
                    .should('not.be.disabled')
                    .and('have.text','Yes')
                    .click()
            })
        cy.wait(100)
        cy.get('tbody>tr')
            .should('have.length',4)

    });
    it('should render teacher stats', function () {
        cy.get('[data-testid="history"]')
            .click()
        cy.wait(200)
        cy.hash().should('include','#history')
        cy.get('.page-title')
            .should('have.text','Historical Data')

    });
    it('should reload teacher stats', function () {
        cy.get('[data-testid="history"]')
            .click()
        cy.wait(200)
        cy.hash().should('include','#history')
        cy.get('.page-title')
            .should('have.text','Historical Data')
        cy.reload()
        cy.get('.page-title')
            .should('have.text','Historical Data')
    });
    it('should test screen resolution', function () {
        cy.get('[data-testid="history"]')
            .click()
        cy.wait(200)
        cy.hash().should('include','#history')
        cy.viewport(2999, 2999)
        cy.viewport('macbook-15')
        cy.wait(200)
        cy.viewport('macbook-13')
        cy.wait(200)
        cy.viewport('macbook-11')
        cy.wait(200)
        cy.viewport('ipad-2')
        cy.wait(200)
        cy.viewport('ipad-mini')
        cy.wait(200)
        cy.viewport('iphone-6+')
        cy.wait(200)
        cy.viewport('iphone-6')
        cy.wait(200)
        cy.viewport('iphone-5')
        cy.wait(200)
        cy.viewport('iphone-4')
        cy.wait(200)
        cy.viewport('iphone-3')
        cy.wait(200)

        // cy.viewport() accepts an orientation for all presets
        // the default orientation is 'portrait'
        cy.viewport('ipad-2', 'portrait')
        cy.wait(200)
    });
    it('should show stats by week', function () {
        cy.get('[data-testid="history"]')
            .click()
        cy.wait(200)
        cy.get('select').first()
            .select('Week')
    });
    it('should show stats by month', function () {
        cy.get('[data-testid="history"]')
            .click()
        cy.wait(200)
        cy.get('select').first()
            .select('Month')
    });


    it('should logout', function () {
        cy.server()
        cy.route({
            method:'POST',
            url:'/api/logout',
            status:200,
            response:{}
        }).as('logout')
        cy.location('pathname').should('include','/teacherHome')
        cy.get('[data-testid="logout"]')
            .click()
        cy.wait('@logout')
        cy.location('pathname').should('include','/')
        cy.getCookies().should('be.empty')
    });
    it('should redirect if i am using an expired cookie', function () {
        cy.clearCookies()
        cy.location('pathname').should('include','teacherHome')

        cy.reload({force: true})
        cy.location('pathname').should('include', '/')
    });


});
describe('TEST BEHAVIOUR OF CANCEL OR TURN INTO DISTANCE A LECTURE WITHIN 30-60MINUTES', function () {
    beforeEach(()=>{
        cy.visit('http://localhost:3000')
        let date=Cypress.moment().subtract('minutes',59).format('YYYY-MM-DD HH:mm');
        let date1=Cypress.moment().subtract('minutes',29).format('YYYY-MM-DD HH:mm');
        cy.server()
        cy.route({
            method:'POST',
            url:'/api/login',
            status:200,
            request:{userName:'t987654',password:'scimmia'},
            response:{user:'t987654',userType:'t',tutorial:1}
        }).as('login')
        cy.route({
            url: "/api/teacherLectures",
            method: "GET",
            response:[
                {"Course_Ref":"C8901","Name":"HCI Les:1","Date":date,"DateDeadline":"2021-03-01 23:00:00","EndDate":date,"BookedSeats":2,"Capacity":100,"Type":"p"},
                {"Course_Ref":"C8901","Name":"HCI Les:2","Date":date1,"DateDeadline":"2021-03-03 23:00:00","EndDate":date1,"BookedSeats":1,"Capacity":80,"Type":"p"}]
        }).as('lectures')
        cy.get('input:first').type('t987654').should('have.value','t987654')
        cy.get('input:last').type('scimmia').should('have.value','scimmia')
        cy.get('.btn.btn-primary')
            .click()

        cy.wait('@login')
    })
    it('should not cancel a lecture 60 minute before lecture', function () {
        cy.server()
        cy.route({
            method:'DELETE',
            url:'/api/courseLectures/*',
            status:500,
            response:{error: "Delete lecture deadline expired"}
        })
        cy.get('tbody>tr')
            .contains('td','HCI Les:1')
            .siblings()
            .find('.btn.btn-primary')
            .should('have.text', 'SELECT')
            .should('be.visible')
            .click();
        cy.get('.modal')
            .should('be.visible')
            .within(()=>{
                cy.get('.btn.btn-danger')
                    .should('have.text','CANCEL LECTURE')
                    .should('be.disabled')
                cy.wait(100);
            }).click({force:true})
        cy.wait(20)
        cy.get('tbody>tr')
            .should('have.length',2)
    });
    it('should not turn into distance lecture 30 minute before', function () {
        cy.server()
        cy.route({
            method:'PUT',
            url:'/api/lectures',
            status:422,
            response:{error: "Cannot modify type of lecture after 30 minutes before scheduled time"}
        })
        cy.get('tbody>tr')
            .contains('td','HCI Les:2')
            .siblings()
            .find('.btn.btn-primary')
            .should('have.text', 'SELECT')
            .should('be.visible')
            .click();
        cy.get('.modal').should('be.visible')
            .within(()=>{
                cy.get('.btn.btn-info')
                    .should('be.disabled')

            })
        cy.wait(100)

        cy.get('tbody>tr')
            .should('have.length',2)
    });
    it('should not show anything in Student List popup', function () {
        cy.server()
        cy.route({
            method:"GET",
            url:"/api/lectures/listStudents*",
            status:500,
            response:{
                errors: [{ 'param': 'Server', 'msg': "Server Error" }]
            }
        }).as('list')
        cy.get('[data-testid="teacherStudent"]').should('have.text', 'Student List')
            .should('have.attr', 'href', '#studentList')
            .click()
        cy.get('.card-header').eq(0)
            .click({force:true})
        cy.get('tbody>tr').eq(0).find('.btn.btn-primary').should('have.text','SHOW LIST')
            .click()
        cy.wait('@list')
        cy.get('[data-testid="studentsList"]').should('have.length', 0)
        cy.get('.modal').should('not.be.visible')
    });
    it('should click on tutorial page', function () {
        cy.get('[data-testid="tour"]').click()
            .should(()=>{
                expect(localStorage.getItem('tutorial')).to.eq('1')
                expect(localStorage.getItem('willingNewTutorial')).to.eq('true')
            })
        //test when close button is pressed in tutorial
        cy.get('.sc-bdVaJa.cYQqRL.sc-bxivhb.eTpeTG.reactour__close')
            .click()
            .should(()=>{
                expect(localStorage.getItem('willingNewTutorial')).to.eq('false')
                expect(localStorage.getItem('tutorialLec')).to.eq('true')
            })
    });
    it('should click on tutorial button from studentList page and click on close', function () {
        cy.get('[data-testid="teacherStudent"]')
            .click()
        cy.get('[data-testid="tour"]').click()
            .should(()=>{
                expect(localStorage.getItem('tutorial')).to.eq('1')
                expect(localStorage.getItem('willingNewTutorial')).to.eq('true')
            })
        cy.get('.sc-bdVaJa.cYQqRL.sc-bxivhb.eTpeTG.reactour__close')
            .click()
            .should(()=>{
                expect(localStorage.getItem('willingNewTutorial')).to.eq('false')
                expect(localStorage.getItem('tutorialSL')).to.eq('true')
            })
    });
    it('should click on tutorial button from history page and click on close', function () {
        cy.get('[data-testid="history"]')
            .click()
        cy.get('[data-testid="tour"]').click()
            .should(()=>{
                expect(localStorage.getItem('tutorial')).to.eq('1')
                expect(localStorage.getItem('willingNewTutorial')).to.eq('true')
            })
        cy.get('.sc-bdVaJa.cYQqRL.sc-bxivhb.eTpeTG.reactour__close')
            .click()
            .should(()=>{
                expect(localStorage.getItem('willingNewTutorial')).to.eq('false')
                expect(localStorage.getItem('tutorialHT')).to.eq('true')
            })
    });
});


