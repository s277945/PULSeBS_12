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
                cy.get('td').eq(0).should('have.text','/')
                cy.get('td').eq(1).should('have.text','/')
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
        it('should not upload file of schedule or enrollment if missing dependencies ', function () {
            cy.server()
            cy.route({
                method:'POST',
                url:'/api/uploadSchedule',
                status:200,
                response:{inserted:true}
            }).as('courses')
            cy.get('.custom-file-input').eq(3)
                .attachFile('Schedule.csv')
            cy.get('.btn.btn-primary').eq(3)
                .should('not.be.enabled')
            cy.get('tbody>tr').eq(3).within(()=>{
                cy.get('td').eq(2).should('contains.text','Missing file dependencies')
            })

        });
        it('should upload correctly all the files', function () {
            const date=Cypress.moment().format('DD/MM/YYYY HH:mm')
            cy.server()
            cy.route({
                method:'POST',
                url:'/api/uploadStudents',
                status:200,
                response:{inserted:true}
            }).as('student')
            cy.route({
                method:'POST',
                url:'/api/uploadTeachers',
                status:200,
                response:{inserted:true}
            }).as('teacher')
            cy.route({
                method:'POST',
                url:'/api/uploadCourses',
                status:200,
                response:{inserted:true}
            }).as('courses')
            cy.route({
                method:'POST',
                url:'/api/uploadSchedule',
                status:200,
                response:{inserted:true}
            }).as('schedule')
            cy.route({
                method:'POST',
                url:'/api/uploadEnrollment',
                status:200,
                response:{inserted:true}
            }).as('enrollment')
            //insert all the files inside the fields and press button
            cy.get('.custom-file-input').eq(0)
                .attachFile('Students.csv')
            cy.get('.custom-file-input').eq(1)
                .attachFile('Professors.csv')
            cy.get('.custom-file-input').eq(2)
                .attachFile('Courses.csv')
            cy.get('.custom-file-input').eq(3)
                .attachFile('Enrollment.csv')
            cy.get('.custom-file-input').eq(4)
                .attachFile('Schedule.csv')
            cy.get('.btn.btn-primary').eq(0)
                .should('be.enabled')
                .click()
            cy.wait('@student')
            cy.get('.btn.btn-primary').eq(1)
                .should('be.enabled')
                .click()
            cy.wait('@teacher')
            cy.get('.btn.btn-primary').eq(2)
                .should('be.enabled')
                .click()
            cy.wait('@courses')
            cy.get('.btn.btn-primary').eq(3)
                .should('be.enabled')
                .click()
            cy.wait('@enrollment')
            cy.get('.btn.btn-primary').eq(4)
                .should('be.enabled')
                .click()
            cy.wait('@schedule')
            cy.get('tbody>tr')
                .then(($lis) => {
                    expect($lis).to.have.length(5)
                    expect($lis.eq(0)).to.contain('Students.csv')
                    expect($lis.eq(1)).to.contain('Professors.csv')
                    expect($lis.eq(2)).to.contain('Courses.csv')
                    expect($lis.eq(3)).to.contain('Enrollment.csv')
                    expect($lis.eq(4)).to.contain('Schedule.csv')
                    expect($lis.eq(0)).to.contain(date)
                    expect($lis.eq(1)).to.contain(date)
                    expect($lis.eq(2)).to.contain(date)
                    expect($lis.eq(3)).to.contain(date)
                    expect($lis.eq(4)).to.contain(date)

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
            }).as('bookable')
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
            cy.wait('@bookable')
            cy.get('.card').eq(0).should('contains.text','2remote courses,0courses in presence')
        });
        it('should click two times on the year checkbox', function () {
            cy.server()
            cy.route({
                method:'POST',
                url:'/api/lecturesBookable',
                status:200,
                response:{"modified": true}
            }).as('bookable')
            cy.get('[data-testid="updatebookable"]')
                .should('be.visible')
                .click()
            cy.wait(100)
            cy.get('.card').eq(0).should('be.visible')
                .click({force:true})
                .within(()=>{
                    cy.get('[data-testid="year"]').should('be.visible').click()
                })
            cy.get('.btn.btn-info').should('be.enabled')
            cy.get('[data-testid="year"]').eq(0).should('be.visible').click()
            cy.get('[data-testid="year"]').should('not.be.checked')
        });
        it('should select a course of second semester', function () {
            cy.server()
            cy.route({
                method:'POST',
                url:'/api/lecturesBookable',
                status:200,
                response:{"modified": true}
            }).as('bookable')
            cy.get('[data-testid="updatebookable"]')
                .should('be.visible')
                .click()
            cy.wait(100)
            cy.get('.card').eq(0).should('be.visible')
                .click()

            cy.get('.card-body').eq(0).should('be.visible')
                .within(()=>{
                    cy.get('.accordion-custom-setup-1').eq(1)
                        .find('.form-check-input.position-static')
                        .check()
                })
            cy.get('.btn.btn-info').should('be.enabled')
        });
        it('should invert type of a course of first semester', function () {
            cy.server()
            cy.route({
                method:'POST',
                url:'/api/lecturesBookable',
                status:200,
                response:{"modified": true}
            }).as('bookable')
            cy.get('[data-testid="updatebookable"]')
                .should('be.visible')
                .click()
            cy.wait(100)
            cy.get('.card').eq(0).should('be.visible')
                .click()

            cy.get('.card-body').eq(0).should('be.visible')
                .within(()=>{
                    cy.get('.accordion-custom-setup-1').eq(0)
                        .find('.form-check-input.position-static')
                        .check()
                })
            cy.get('.btn.btn-info').should('be.enabled')
            cy.get('.btn.btn-secondary').eq(2).should('be.enabled').click()
            cy.wait(100)
            cy.get('.form-check-input.position-static').eq(1)
                .should('not.be.checked')
        });
        it('should invert type of a course of second semester', function () {
            cy.server()
            cy.route({
                method:'POST',
                url:'/api/lecturesBookable',
                status:200,
                response:{"modified": true}
            }).as('bookable')
            cy.get('[data-testid="updatebookable"]')
                .should('be.visible')
                .click()
            cy.wait(100)
            cy.get('.card').eq(0).should('be.visible')
                .click()

            cy.get('.card-body').eq(0).should('be.visible')
                .within(()=>{
                    cy.get('.accordion-custom-setup-1').eq(1)
                        .find('.form-check-input.position-static')
                        .check()
                })
            cy.get('.btn.btn-info').should('be.enabled')
            cy.get('.btn.btn-secondary').eq(2).should('be.enabled').click()
            cy.wait(100)
            cy.get('.form-check-input.position-static').eq(4)
                .should('not.be.checked')
        });
        it('should deselect all', function () {
            cy.get('[data-testid="updatebookable"]')
                .should('be.visible')
                .click()
            cy.get('.btn.btn-secondary').eq(1).should('be.enabled').click()
            cy.wait(100)
            cy.get('.form-check-input.position-static').each((item,index)=>{
                cy.wrap(item)
                    .should('be.checked')
            })
            cy.get('.btn.btn-secondary').eq(2).should('be.enabled').click()
            cy.get('.form-check-input.position-static').each((item,index)=>{
                cy.wrap(item)
                    .should('not.be.checked')
            })
        });
        it('should turn lecture into presence', function () {
            cy.server()
            cy.route({
                method:'POST',
                url:'/api/lecturesBookable',
                status:200,
                response:{"modified": true}
            }).as('bookable')
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
            cy.wait('@bookable')
            cy.get('.card').eq(0).should('contains.text','0remote courses,2courses in presence')
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
            cy.get('[data-testid="year"]').should('not.be.checked')
            
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
        it('should click on course of first semester', function () {
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
        it('should click on course of second semester', function () {
            cy.get('[data-testid="updatebookable"]')
                .should('be.visible')
                .click()
            cy.wait(100)
            cy.get('.card').eq(0).should('be.visible')
                .click()
                .within(()=>{
                    cy.get(".card-header").eq(2).click()
                    cy.get(".card-body").eq(2).within(()=>{
                        cy.get('.form-check-input').eq(0).check()
                            .should('be.checked')
                    })
                    cy.wait(100)
                })
        });
    });
    describe('SCHEDULE SETUP PAGE', function () {
        it('should modify a schedule', function () {
            //scrivere un test in cui modifico tutti i campi e poi verifico che effettivamente i valori sono stati aggiornati
            cy.server()
            cy.route({
                url:'/api/schedules',
                method:'GET',
                status:200,
                response:[{"courseId":"XY1211","courseName":"Metodi di finanziamento delle imprese","room":"1","day":"Mon","seats":120,"time":"16:00-17:30"},{"courseId":"XY8221","courseName":"Basi di dati","room":"4","day":"Mon","seats":80,"time":"10:00-11:30"}]
            }).as('schedule')
            cy.route({
                method:'PUT',
                url:'/api/schedules',
                status:200,
                response:{}
            }).as('put')
            cy.get('[data-testid="schedule"]')
                .should('be.visible')
                .click()
            cy.wait('@schedule')
            cy.get('tbody>tr').eq(0).should('be.visible')
                .click()
                .within(()=>{
                    cy.get('.btn.btn-primary').click()
                })
            cy.get('[data-testid="modal"]')
                .within(()=>{
                    cy.get('[data-testid="room"]').should('be.visible')
                        .type("170")
                        .should('have.value','170')
                    cy.get('[data-testid="day"]').should('be.visible')
                        .select("Tue")
                        .should('have.value','Tue')
                    cy.get('[data-testid="seats"]').should('be.visible')
                        .type("50")
                        .should('have.value','50')
                    cy.get('[data-testid="startTime"]').should('be.visible')
                        .select("11:30")
                        .should('have.value','41400')
                    cy.get('[data-testid="endTime"]').should('be.visible')
                        .select("14:30")
                        .should('have.value', '52200')
                    cy.get('[data-testid="submit"]').should('be.enabled')
                        .click()
                })
            cy.wait('@put')
            cy.get('tbody>tr').eq(0).within(()=>{
                cy.get('td').eq(2).should('contains.text','170')
                cy.get('td').eq(3).should('contains.text','Tue')
                cy.get('td').eq(4).should('contains.text','50')
                cy.get('td').eq(5).should('contains.text','11:30-14:30')
            })
        });
        it('should not upload schedule if nothing was updated inside modal', function () {
            cy.server()
            cy.route({
                url:'/api/schedules',
                method:'GET',
                status:200,
                response:[{"courseId":"XY1211","courseName":"Metodi di finanziamento delle imprese","room":"1","day":"Mon","seats":120,"time":"8:30-11:30"},{"courseId":"XY8221","courseName":"Basi di dati","room":"4","day":"Mon","seats":80,"time":"10:00-11:30"}]
            }).as('schedule')
            cy.route({
                method:'PUT',
                url:'/api/schedules',
                status:200,
                response:{}
            }).as('put')
            cy.get('[data-testid="schedule"]')
                .should('be.visible')
                .click()
            cy.wait('@schedule')
            cy.get('tbody>tr').eq(0).should('be.visible')
                .click()
                .within(()=>{
                    cy.get('.btn.btn-primary').click()
                })
            cy.get('[data-testid="modal"]')
                .within(()=>{
                    cy.get('[data-testid="submit"]').should('not.be.enabled')
                })
                .click({force:true})
        });
        it('should not upload a field if startDate>endDate', function () {
            cy.server()
            cy.route({
                url:'/api/schedules',
                method:'GET',
                status:200,
                response:[{"courseId":"XY1211","courseName":"Metodi di finanziamento delle imprese","room":"1","day":"Mon","seats":120,"time":"11:30-12:30"},{"courseId":"XY8221","courseName":"Basi di dati","room":"4","day":"Mon","seats":80,"time":"10:00-11:30"}]
            }).as('schedule')
            cy.route({
                method:'PUT',
                url:'/api/schedules',
                status:200,
                response:{}
            }).as('put')
            cy.get('[data-testid="schedule"]')
                .should('be.visible')
                .click()
            cy.wait('@schedule')
            cy.get('tbody>tr').eq(0).should('be.visible')
                .click()
                .within(()=>{
                    cy.get('.btn.btn-primary').click()
                })
            cy.get('[data-testid="modal"]')
                .within(()=>{
                    cy.get('[data-testid="startTime"]').should('be.visible')
                        .select("12:30")
                        .should('have.value','41400')
                    cy.get('[data-testid="endTime"]').should('be.visible')
                        .select("08:30")
                        .should('have.value', '45000')
                    cy.get('[data-testid="submit"]').should('not.be.enabled')
                })

        });
        it('should not put in room field a char', function () {
            cy.server()
            cy.route({
                url:'/api/schedules',
                method:'GET',
                status:200,
                response:[{"courseId":"XY1211","courseName":"Metodi di finanziamento delle imprese","room":"1","day":"Mon","seats":120,"time":"8:30-11:30"},{"courseId":"XY8221","courseName":"Basi di dati","room":"4","day":"Mon","seats":80,"time":"10:00-11:30"}]
            }).as('schedule')
            cy.route({
                method:'PUT',
                url:'/api/schedules',
                status:200,
                response:{}
            }).as('put')
            cy.get('[data-testid="schedule"]')
                .should('be.visible')
                .click()
            cy.wait('@schedule')
            cy.get('tbody>tr').eq(0).should('be.visible')
                .click()
                .within(()=>{
                    cy.get('.btn.btn-primary').click()
                })
            cy.get('[data-testid="modal"]')
                .within(()=>{
                    cy.get('[data-testid="seats"]').should('be.visible')
                        .type("8A")
                        .should('have.value','8')
                    cy.get('[data-testid="submit"]').should('be.enabled')
                        .click()
                })
            cy.wait('@put')
            cy.get('tbody>tr').eq(0).within(()=>{
                cy.get('td').eq(2).should('contains.text','1')
                cy.get('td').eq(3).should('contains.text','Mon')
                cy.get('td').eq(4).should('contains.text','8')
                cy.get('td').eq(5).should('contains.text','8:30-11:30')
            })
        });
        it('should update start date only of a schedule', function () {
            cy.server()
            cy.route({
                url:'/api/schedules',
                method:'GET',
                status:200,
                response:[{"courseId":"XY1211","courseName":"Metodi di finanziamento delle imprese","room":"1","day":"Mon","seats":120,"time":"16:00-18:30"},{"courseId":"XY8221","courseName":"Basi di dati","room":"4","day":"Mon","seats":80,"time":"10:00-11:30"}]
            }).as('schedule')
            cy.route({
                method:'PUT',
                url:'/api/schedules',
                status:200,
                response:{}
            }).as('put')
            cy.get('[data-testid="schedule"]')
                .should('be.visible')
                .click()
            cy.wait('@schedule')
            cy.get('tbody>tr').eq(0).should('be.visible')
                .click()
                .within(()=>{
                    cy.get('.btn.btn-primary').click()
                })
            cy.get('[data-testid="modal"]')
                .within(()=>{
                    cy.get('[data-testid="room"]').should('be.visible')
                        .type("8A")
                        .should('have.value','8A')
                    cy.get('[data-testid="startTime"]').should('be.visible')
                        .select("17:00")
                        .should('have.value','61200')
                    cy.wait(100)
                    cy.get('[data-testid="submit"]').should('be.enabled')
                        .click()
                })
            cy.wait('@put')
            cy.get('tbody>tr').eq(0).within(()=>{
                cy.get('td').eq(2).should('contains.text','8A')
                cy.get('td').eq(3).should('contains.text','Mon')
                cy.get('td').eq(4).should('contains.text','120')
                cy.get('td').eq(5).should('contains.text','17:00-18:30')
            })

        });
        it('should update only end date of a schedule', function () {
            cy.server()
            cy.route({
                url:'/api/schedules',
                method:'GET',
                status:200,
                response:[{"courseId":"XY1211","courseName":"Metodi di finanziamento delle imprese","room":"1","day":"Mon","seats":120,"time":"16:00-18:30"},{"courseId":"XY8221","courseName":"Basi di dati","room":"4","day":"Mon","seats":80,"time":"10:00-11:30"}]
            }).as('schedule')
            cy.route({
                method:'PUT',
                url:'/api/schedules',
                status:200,
                response:{}
            }).as('put')
            cy.get('[data-testid="schedule"]')
                .should('be.visible')
                .click()
            cy.wait('@schedule')
            cy.get('tbody>tr').eq(0).should('be.visible')
                .click()
                .within(()=>{
                    cy.get('.btn.btn-primary').click()
                })
            cy.get('[data-testid="modal"]')
                .within(()=>{
                    cy.get('[data-testid="room"]').should('be.visible')
                        .type("8A")
                        .should('have.value','8A')
                    cy.get('[data-testid="endTime"]').should('be.visible')
                        .select("17:00")
                        .should('have.value','61200')
                    cy.wait(100)
                    cy.get('[data-testid="submit"]').should('be.enabled')
                        .click()
                })
            cy.wait('@put')
            cy.get('tbody>tr').eq(0).within(()=>{
                cy.get('td').eq(2).should('contains.text','8A')
                cy.get('td').eq(3).should('contains.text','Mon')
                cy.get('td').eq(4).should('contains.text','120')
                cy.get('td').eq(5).should('contains.text','16:00-17:00')
            })

        });
        it('should return a server error', function () {
            cy.server()
            cy.route({
                url:'/api/schedules',
                method:'GET',
                status:200,
                response:[{"courseId":"XY1211","courseName":"Metodi di finanziamento delle imprese","room":"1","day":"Mon","seats":120,"time":"16:00:17:30"},{"courseId":"XY8221","courseName":"Basi di dati","room":"4","day":"Mon","seats":80,"time":"10:00-11:30"}]
            }).as('schedule')
            cy.route({
                method:'PUT',
                url:'/api/schedules',
                status:500,
                response:{}
            }).as('put')
            cy.get('[data-testid="schedule"]')
                .should('be.visible')
                .click()
            cy.wait('@schedule')
            cy.get('tbody>tr').eq(0).should('be.visible')
                .click()
                .within(()=>{
                    cy.get('.btn.btn-primary').click()
                })
            cy.get('[data-testid="modal"]')
                .within(()=>{
                    cy.get('[data-testid="room"]').should('be.visible')
                        .type("170")
                        .should('have.value','170')
                    cy.get('[data-testid="day"]').should('be.visible')
                        .select("Tue")
                        .should('have.value','Tue')
                    cy.get('[data-testid="seats"]').should('be.visible')
                        .type("50")
                        .should('have.value','50')
                    cy.get('[data-testid="startTime"]').should('be.visible')
                        .select("11:30")
                        .should('have.value','41400')
                    cy.get('[data-testid="endTime"]').should('be.visible')
                        .select("14:30")
                        .should('have.value', '52200')
                    cy.get('[data-testid="submit"]').should('be.enabled')
                        .click()
                })
            cy.wait('@put')
            cy.get('tbody>tr').eq(0).within(()=>{
                cy.get('td').eq(2).should('contains.text','1')
                cy.get('td').eq(3).should('contains.text','Mon')
                cy.get('td').eq(4).should('contains.text','120')
                cy.get('td').eq(5).should('contains.text','16:00:17:30')
            })
        });
        it('should logout', function () {
            cy.server()
            cy.route({
                method:'POST',
                url:'/api/logout',
                status:200,
                response:{}
            }).as('logout')
            cy.get('[data-testid="logout"]').should('be.visible')
                .click()
            cy.wait('@logout')
            cy.getCookies().should('be.empty')
            cy.location('pathname').should('include','/')
        });
    });
});