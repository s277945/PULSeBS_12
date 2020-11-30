
describe('LOGIN PAGE', function () {
    beforeEach(() => {
        cy.visit('http://localhost:3000/')
        Cypress.Cookies.preserveOnce('session_id', 'remember_token')
    })
    it('should visit webpage', function () {
        cy.visit('http://localhost:3000/')
    });
    it('should render correctly login', function () {
        cy
            .get('nav')
            .should('be.visible')
        cy.get('form').within(()=>{
            cy.get('input:first').should('have.attr', 'placeholder', 'Your domain username')
            cy.get('input:last').should('have.attr', 'placeholder', 'Password')
            cy.get('.btn.btn-primary').should('have.attr','type','submit')
            cy.get('.btn.btn-secondary').should('have.attr','type','submit')
        })
    });
    it('should type into input', function () {
        cy.get('input:first')
            .type('francesco').should('have.value', 'francesco')

            // .type() with special character sequences
            .type('{leftarrow}{rightarrow}{uparrow}{downarrow}')
            .type('{del}{selectall}{backspace}')

            // .type() with key modifiers
            .type('{alt}{option}') //these are equivalent
            .type('{ctrl}{control}') //these are equivalent
            .type('{meta}{command}{cmd}') //these are equivalent
            .type('{shift}')

            // Delay each keypress by 0.1 sec
            .type('aaaabbbbbb', { delay: 100 })

    });
    it('.clear() - clears an input or textarea element', () => {
        // https://on.cypress.io/clear
        cy.get('input:first').type('Clear')
            .should('have.value', 'Clear')
            .clear()
            .should('have.value', '')
    })
    it('should clear invalid char', function () {
        cy.get('input:first')
            .type('&')
            .should('have.value','')
        cy.get('input:last')
            .type('&')
            .should('have.value','')
    });
    it('should submit with error show', function () {
        cy.get('.btn.btn-primary')
            .click()
        cy.get('input:last').should('have.class', 'is-invalid')
        cy.get('input:first').should('have.class','is-invalid')
    });
    it('should reset form fields ', function () {
        const username=cy.get('input:first').type('prova').should('have.value','prova');
        const password=cy.get('input:last').type('ciao').should('have.value','ciao')
        cy.get('.btn.btn-secondary')
            .click()
        username.should('have.value','')
        password.should('have.value','')
    });
    it('should not login', function () {
        const username=cy.get('input:first').type('prova').should('have.value','prova');
        const password=cy.get('input:last').type('ciao').should('have.value','ciao')
        cy.get('.btn.btn-primary')
            .click()
        cy.get('.form-text').should('have.text','Invalid credentials')
    });
    it('should login teacher correctly', function () {
        cy.getCookies().should('be.empty')
        cy.get('input:first').type('t987654').should('have.value','t987654')
        cy.get('input:last').type('scimmia').should('have.value','scimmia')
        cy.get('.btn.btn-primary')
            .click()
        cy.location('pathname').should('include','teacherHome')
    });

});
describe('TEACHER PAGE', function () {
    beforeEach(() => {
        cy.visit('http://localhost:3000/')
        cy.get('input:first').type('t987654').should('have.value','t987654')
        cy.get('input:last').type('scimmia').should('have.value','scimmia')
        cy.get('.btn.btn-primary')
            .click()
        Cypress.Cookies.preserveOnce('token', 'value')
        Cypress.Cookies.debug(true)
    })
    it('should render correctly teacher page', function () {
        cy.location('pathname').should('include','teacherHome')
        cy.get('.page-title').should('have.text','Lectures')
        cy.get('tbody>tr').should('have.length',4)
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
        cy.get('tbody>tr').should('have.length',4)
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
        cy.get('tbody>tr').eq(0).find('.btn.btn-primary').should('have.text','SHOW LIST')
            .click()
        cy.wait(100)
        cy.get('[data-testid="studentsList"]').should('have.length', 1)
            .within(()=>{
                cy.get('tr').eq(0).should('contain','s266260')
            })
        cy.get('.modal').should('be.visible')
            .click({ force: true });

    });
    it('should reload modal student when refresh page', function () {
        cy.get('[data-testid="teacherStudent"]').should('have.text', 'Student List')
            .should('have.attr', 'href', '#studentList')
            .click()
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
        cy.get('tbody>tr').should('have.length',4)
            .eq(0).find('.btn.btn-primary')
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
        cy.get('tbody>tr').should('have.length',4)
            .eq(0).find('.btn.btn-primary')
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
        cy.wait(100)
        cy.get('.modal').should('be.visible')
    });
    it('should press cancel lecture, but click on button No', function () {
        cy.get('tbody>tr')
            .eq(0)
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
    /*it('should cancel correctly a lecture', function () {
        cy.get('tbody>tr')
            .eq(0)
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
        cy.get('.modal')
            .should('not.be.visible')
        cy.get('tbody>tr')
            .should('have.length',3)
    });*/
    /*it('should turn into distance lecture correctly', function () {
        cy.get('tbody>tr').should('have.length',3)
            .eq(0).find('.btn.btn-primary')
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
        cy.get('.modal').should('not.be.visible')
        cy.get('tbody>tr').should('have.length',2)
    });*/
    /*it('should not cancel a lecture 60 minute before lecture', function () {
        cy.get('tbody>tr')
            .eq(0)
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
                cy.wait(100);
                cy.get('p').should('have.css','color','#e00d0d')
                cy.get('.btn.btn-danger')
                    .should('be.disabled')
            }).click({force:true})
        cy.wait(20)
        cy.get('.modal')
            .should('not.be.visible')
        cy.get('tbody>tr')
            .should('have.length',2)
    });*/
    /*it('should not turn into distance lecture 30 minute before', function () {
        cy.get('tbody>tr')
            .eq(0).find('.btn.btn-primary')
            .should('have.text', 'SELECT')
            .should('be.visible')
            .click();
        cy.get('.modal').should('be.visible')
            .within(()=>{
                cy.get('.btn.btn-info')
                    .should('have.text', 'TURN INTO DISTANCE LECTURE')
                    .click()
                cy.wait(20)
                cy.get('p').should('have.css','color','#e00d0d')
                cy.get('.btn.btn-info')
                    .should('be.disabled')

            }).click({force:true})
        cy.get('.modal').should('not.be.visible')
        cy.get('tbody>tr').should('have.length',2)
    });
    */
    it('should render teacher stats', function () {
        cy.get('[data-testid="history"]')
            .click()
        cy.hash().should('include','#history')
        cy.get('.page-title')
            .should('have.text','Historical Data')
        cy.get('.row')
            .within(()=>{
                cy.get('[data-testid="courseStat"]')
                    .should('have.text','Course: C4567')
            })
        cy.get('svg')
            .should('be.visible')

    });
    it('should show stats by week', function () {
        cy.get('[data-testid="history"]')
            .click()
        cy.get('select')
            .select('Week')
    });
    it('should show stats by month', function () {
        cy.get('[data-testid="history"]')
            .click()
        cy.get('select')
            .select('Month')
    });

    it('should logout', function () {
        cy.location('pathname').should('include','/teacherHome')
        cy.get('[data-testid="logout"]')
            .click()
        cy.location('pathname').should('include','/')
        cy.wait(1000)
        cy.getCookies().should('be.empty')
    });
    it('should redirect if i am using an expired cookie', function () {
        cy.clearCookies()
        cy.location('pathname').should('include','teacherHome')

        cy.reload({force: true})
        cy.location('pathname').should('include', '/')
    });


});
describe('STUDENT PAGE', function () {
    beforeEach(() => {
        cy.visit('http://localhost:3000/')
        cy.get('input:first').type('s269422').should('have.value','s269422')
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
        cy.get('tbody>tr')
            .should('have.length',5)
            .eq(0)
            .within(()=>{
                cy.get('td').eq(0).should('have.text','SE2 Les:1')
                cy.get('td').eq(1).should('have.text','2020-12-10 12:00:00')
                cy.get('.btn.btn-primary').should('be.disabled')
                    .should('have.text','Book Seat')
                cy.get('.btn.btn-danger').should('not.be.disabled')
                    .should('have.text', 'Cancel')
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
        cy.get('tbody>tr').eq(0).within(()=>{
            cy
                .get('.btn.btn-danger')
                .should('be.enabled')
                .click()
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
        cy.get('tbody>tr').eq(0).within(()=>{
            cy.get('.btn.btn-danger')
                .click()
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
    it('should open correctly modal to book a seat', function () {
        cy.wait(200)
        cy.get('tbody>tr').eq(0).within(()=>{
            cy.get('.btn.btn-primary')
                .should('be.enabled')
                .click()
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
        cy.get('tbody>tr').eq(0).within(()=>{
            cy.get('.btn.btn-primary')
                .should('not.be.enabled')
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
describe('TEST AXIOS INTERCEPTOR', function () {
    beforeEach(() => {
        cy.clearCookies()
        Cypress.Cookies.debug(true)
    })
    it('should setup next test', function () {
        cy.visit('http://localhost:3000/')
        cy.get('input:first').type('t987654').should('have.value','t987654')
        cy.get('input:last').type('scimmia').should('have.value','scimmia')
        cy.get('.btn.btn-primary')
            .click()
        cy.location('pathname').should('include','/teacherHome')
        cy.get('[data-testid="teacherStudent"]').should('have.text', 'Student List')
            .should('have.attr', 'href', '#studentList')
            .click()
        //cy.clearCookies()
        cy.wait(100)
        cy.location('pathname').should('include','/teacherHome')
    });
    it('should return 401', function () {
        cy.get('tbody>tr').eq(0).within(()=>{
            cy.get('.btn.btn-primary')
                .click()
        })
        cy.wait(200)
        cy.location('pathname').should('include','/')
    });
});


