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
        cy.server()
        cy.route({
            method:'POST',
            url:'/api/login',
            status:200,
            response:{user:"t987654",userType:'t'}
        }).as('login')
        cy.get('input:first').type('t987654').should('have.value','t987654')
        cy.get('input:last').type('scimmia').should('have.value','scimmia')
        cy.get('.btn.btn-primary')
            .click()
        cy.location('pathname').should('include','teacherHome')
    });

});
